// backend/src/controllers/playerStatsController.js
import { pool } from "../db.js";

async function tableExists(tableName) {
  const r = await pool.query(
    `SELECT EXISTS (
       SELECT 1 FROM information_schema.tables
       WHERE table_schema='public' AND table_name=$1
     ) AS exists`,
    [tableName],
  );
  return !!r.rows?.[0]?.exists;
}

const BATTING_TABLE_CANDIDATES = [
  "player_stats",
  "player_batting_stats",
  "batting_stats",
  "player_batting",
];
const PITCHING_TABLE_CANDIDATES = [
  "pitching_stats",
  "player_pitching_stats",
  "player_pitching",
];

async function pickFirstExistingTable(candidates) {
  for (const t of candidates) {
    if (await tableExists(t)) return t;
  }
  return null;
}

// ── Whitelisted columns (prevents SQL injection) ──────────────────────────
const BATTING_COLS = new Set([
  "gp",
  "gs",
  "ab",
  "r",
  "h",
  "2b",
  "3b",
  "hr",
  "rbi",
  "tb",
  "slg",
  "bb",
  "hbp",
  "so",
  "gdp",
  "obp",
  "sf",
  "sh",
  "sb",
  "att",
  "cs",
  "avg",
  "fld",
  "po",
  "a",
  "e",
  "sb_att",
]);

const PITCHING_COLS = new Set([
  "era",
  "w",
  "l",
  "app",
  "gs",
  "cg",
  "sho",
  "cbo",
  "sv",
  "ip",
  "h",
  "r",
  "er",
  "bb",
  "so",
  "2b",
  "3b",
  "hr",
  "wp",
  "hbp",
  "bk",
  "sfa",
  "sha",
  "ab",
  "b_avg",
  "doubles",
  "triples",
]);

const LOWER_IS_BETTER = new Set(["era", "l", "hbp", "bk", "gdp", "e", "bb"]);

const colExpr = (col) => (/^\d/.test(col) ? `"${col}"` : col);

// ── Existing endpoints ────────────────────────────────────────────────────

export const getPlayerStatsYears = async (_req, res) => {
  try {
    const table = await pickFirstExistingTable([
      ...BATTING_TABLE_CANDIDATES,
      ...PITCHING_TABLE_CANDIDATES,
    ]);
    if (!table)
      return res.json({ years: [], message: "No player stats tables found." });

    const result = await pool.query(
      `SELECT DISTINCT year FROM ${table} WHERE year IS NOT NULL ORDER BY year DESC`,
    );
    res.json(result.rows.map((r) => r.year));
  } catch (err) {
    console.error("getPlayerStatsYears error:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch years", message: err.message });
  }
};

export const getPlayerStatsByYear = async (req, res) => {
  const { year } = req.params;
  try {
    const table = await pickFirstExistingTable(BATTING_TABLE_CANDIDATES);
    if (!table)
      return res.json({
        year: Number(year),
        count: 0,
        data: [],
        message: "No batting table found.",
      });

    const result = await pool.query(
      `SELECT ps.*, t.name AS team_name, t.city AS team_city, t.state AS team_state,
              CONCAT(p.first_name, ' ', p.last_name) AS player_name
       FROM ${table} ps
       LEFT JOIN teams   t ON t.id = ps.team_id
       LEFT JOIN players p ON p.id = ps.player_id
       WHERE ps.year = $1
       ORDER BY t.name NULLS LAST, player_name NULLS LAST`,
      [year],
    );
    res.json({
      year: Number(year),
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    console.error("getPlayerStatsByYear error:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch player stats", message: err.message });
  }
};

export const getPlayerPitchingStatsByYear = async (req, res) => {
  const { year } = req.params;
  try {
    const table = await pickFirstExistingTable(PITCHING_TABLE_CANDIDATES);
    if (!table)
      return res.json({
        year: Number(year),
        count: 0,
        data: [],
        message: "No pitching table found.",
      });

    const result = await pool.query(
      `SELECT ps.*, t.name AS team_name, t.city AS team_city, t.state AS team_state,
              CONCAT(p.first_name, ' ', p.last_name) AS player_name
       FROM ${table} ps
       LEFT JOIN teams   t ON t.id = ps.team_id
       LEFT JOIN players p ON p.id = ps.player_id
       WHERE ps.year = $1
       ORDER BY t.name NULLS LAST, player_name NULLS LAST`,
      [year],
    );
    res.json({
      year: Number(year),
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    console.error("getPlayerPitchingStatsByYear error:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch pitching stats", message: err.message });
  }
};

export const getAvailablePlayerStatsYears = getPlayerStatsYears;

// ── Leaderboard ───────────────────────────────────────────────────────────
/**
 * GET /api/player-stats/leaderboard
 *   stat   - column name (required), e.g. hr, rbi, avg, era
 *   type   - "batting" | "pitching"  (default: batting)
 *   year   - specific year (optional, omit for all-time)
 *   order  - "asc" | "desc"          (default: auto)
 *   limit  - 1–100                   (default: 25)
 */
export const getPlayerStatsLeaderboard = async (req, res) => {
  try {
    let { stat, order, limit, year, type } = req.query;

    stat = (stat || "hr").toLowerCase();
    type = (type || "batting").toLowerCase();
    limit = Math.min(Math.max(parseInt(limit) || 25, 1), 100);
    order = (
      order || (LOWER_IS_BETTER.has(stat) ? "asc" : "desc")
    ).toLowerCase();
    if (order !== "asc") order = "desc";

    const validCols = type === "pitching" ? PITCHING_COLS : BATTING_COLS;
    if (!validCols.has(stat)) {
      return res.status(400).json({
        success: false,
        error: `Invalid stat "${stat}". Valid: ${[...validCols].sort().join(", ")}`,
      });
    }

    const table = type === "pitching" ? "pitching_stats" : "player_stats";
    const col = colExpr(stat);

    // Use parameterized year — no string interpolation
    const params = [limit];
    const yearClause = year
      ? `AND ps.year = $${params.push(parseInt(year))}`
      : "";

    const sql = `
      SELECT CONCAT(p.first_name, ' ', p.last_name) AS player_name,
             p.id   AS player_id,
             t.name AS team_name,
             ps.year,
             ps.${col} AS stat_value,
             ps.*
      FROM ${table} ps
      LEFT JOIN players p ON p.id = ps.player_id
      LEFT JOIN teams   t ON t.id = ps.team_id
      WHERE ps.${col} IS NOT NULL
        ${yearClause}
      ORDER BY ps.${col} ${order.toUpperCase()} NULLS LAST
      LIMIT $1
    `;

    const result = await pool.query(sql, params);
    res.json({
      success: true,
      stat,
      type,
      order,
      year: year ? parseInt(year) : "all-time",
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    console.error("getPlayerStatsLeaderboard error:", err);
    res
      .status(500)
      .json({
        success: false,
        error: "Failed to fetch leaderboard",
        message: err.message,
      });
  }
};

// ── Flexible search ───────────────────────────────────────────────────────
/**
 * GET /api/player-stats/search
 *   q      - player name (optional)
 *   year   - specific year (optional)
 *   stat   - column to filter by (optional)
 *   min    - minimum value for stat (optional)
 *   max    - maximum value for stat (optional)
 *   team   - team name filter (optional)
 *   type   - "batting" | "pitching"  (default: batting)
 *   limit  - 1–200                   (default: 50)
 *   order  - "asc" | "desc"          (default: desc)
 *   sortBy - column to sort by (defaults to stat, then avg/era)
 */
export const searchPlayerStats = async (req, res) => {
  try {
    let { q, year, stat, min, max, team, type, limit, order, sortBy } =
      req.query;

    type = (type || "batting").toLowerCase();
    limit = Math.min(Math.max(parseInt(limit) || 50, 1), 200);
    order = (order || "desc").toLowerCase();
    if (order !== "asc") order = "desc";

    const table = type === "pitching" ? "pitching_stats" : "player_stats";
    const validCols = type === "pitching" ? PITCHING_COLS : BATTING_COLS;

    stat = stat?.toLowerCase();
    sortBy = sortBy?.toLowerCase();

    if (stat && !validCols.has(stat)) {
      return res.status(400).json({
        success: false,
        error: `Invalid stat "${stat}". Valid: ${[...validCols].sort().join(", ")}`,
      });
    }
    if (sortBy && !validCols.has(sortBy)) {
      sortBy = null; // silently ignore invalid sortBy rather than erroring
    }

    const sortCol = sortBy || stat || (type === "pitching" ? "era" : "avg");

    const conditions = [];
    const params = [];
    let pIdx = 1;

    if (q) {
      conditions.push(
        `CONCAT(p.first_name, ' ', p.last_name) ILIKE $${pIdx++}`,
      );
      params.push(`%${q}%`);
    }
    if (year) {
      conditions.push(`ps.year = $${pIdx++}`);
      params.push(parseInt(year));
    }
    if (team) {
      conditions.push(`t.name ILIKE $${pIdx++}`);
      params.push(`%${team}%`);
    }
    if (stat && min !== undefined) {
      conditions.push(`ps.${colExpr(stat)} >= $${pIdx++}`);
      params.push(parseFloat(min));
    }
    if (stat && max !== undefined) {
      conditions.push(`ps.${colExpr(stat)} <= $${pIdx++}`);
      params.push(parseFloat(max));
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const sql = `
      SELECT CONCAT(p.first_name, ' ', p.last_name) AS player_name,
             p.id   AS player_id,
             t.name AS team_name,
             ps.year,
             ps.*
      FROM ${table} ps
      LEFT JOIN players p ON p.id = ps.player_id
      LEFT JOIN teams   t ON t.id = ps.team_id
      ${whereClause}
      ORDER BY ps.${colExpr(sortCol)} ${order.toUpperCase()} NULLS LAST
      LIMIT $${pIdx}
    `;

    params.push(limit);
    const result = await pool.query(sql, params);

    res.json({
      success: true,
      count: result.rows.length,
      filters: { q, year: year || "all", stat, min, max, team, type },
      data: result.rows,
    });
  } catch (err) {
    console.error("searchPlayerStats error:", err);
    res
      .status(500)
      .json({
        success: false,
        error: "Failed to search player stats",
        message: err.message,
      });
  }
};
