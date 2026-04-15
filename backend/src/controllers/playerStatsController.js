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

export const getPlayerStatsYears = async (_req, res) => {
  try {
    const table = await pickFirstExistingTable([
      ...BATTING_TABLE_CANDIDATES,
      ...PITCHING_TABLE_CANDIDATES,
    ]);
    if (!table) {
      return res.json({ years: [], message: "No player stats tables found." });
    }

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
    if (!table) {
      return res.json({
        year: Number(year),
        count: 0,
        data: [],
        message: "No batting table found.",
      });
    }

    const result = await pool.query(
      `SELECT ps.*,
              COALESCE(t.name, tc.full_name, ps.team_code) AS team_name,
              t.city AS team_city,
              t.state AS team_state,
              CONCAT(p.first_name, ' ', p.last_name) AS player_name
       FROM ${table} ps
       LEFT JOIN teams t ON t.id = ps.team_id
       LEFT JOIN team_codes tc ON tc.code = ps.team_code
       LEFT JOIN players p ON p.id = ps.player_id
       WHERE ps.year = $1
       ORDER BY team_name NULLS LAST, player_name NULLS LAST`,
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
    if (!table) {
      return res.json({
        year: Number(year),
        count: 0,
        data: [],
        message: "No pitching table found.",
      });
    }

    const result = await pool.query(
      `SELECT ps.*,
              COALESCE(t.name, tc.full_name, ps.team_code) AS team_name,
              t.city AS team_city,
              t.state AS team_state,
              CONCAT(p.first_name, ' ', p.last_name) AS player_name
       FROM ${table} ps
       LEFT JOIN teams t ON t.id = ps.team_id
       LEFT JOIN team_codes tc ON tc.code = ps.team_code
       LEFT JOIN players p ON p.id = ps.player_id
       WHERE ps.year = $1
       ORDER BY team_name NULLS LAST, player_name NULLS LAST`,
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

    const table = type === "pitching" ? "pitching_stats" : "batting_stats";
    const col = colExpr(stat);
    const params = [limit];
    const yearClause = year
      ? `AND ps.year = $${params.push(parseInt(year, 10))}`
      : "";

    const result = await pool.query(
      `SELECT CONCAT(p.first_name, ' ', p.last_name) AS player_name,
              p.id AS player_id,
              COALESCE(t.name, tc.full_name, ps.team_code) AS team_name,
              ps.year,
              ps.${col} AS stat_value,
              ps.*
       FROM ${table} ps
       LEFT JOIN players p ON p.id = ps.player_id
       LEFT JOIN teams t ON t.id = ps.team_id
       LEFT JOIN team_codes tc ON tc.code = ps.team_code
       WHERE ps.${col} IS NOT NULL ${yearClause}
       ORDER BY ps.${col} ${order.toUpperCase()} NULLS LAST
       LIMIT $1`,
      params,
    );

    res.json({
      success: true,
      stat,
      type,
      order,
      year: year ? parseInt(year, 10) : "all-time",
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    console.error("getPlayerStatsLeaderboard error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch leaderboard",
      message: err.message,
    });
  }
};

export const searchPlayerStats = async (req, res) => {
  try {
    let { q, year, stat, min, max, team, type, limit, order, sortBy } =
      req.query;

    type = (type || "batting").toLowerCase();
    limit = Math.min(Math.max(parseInt(limit) || 50, 1), 200);
    order = (order || "desc").toLowerCase();
    if (order !== "asc") order = "desc";

    const table = type === "pitching" ? "pitching_stats" : "batting_stats";
    const validCols = type === "pitching" ? PITCHING_COLS : BATTING_COLS;

    stat = stat?.toLowerCase();
    sortBy = sortBy?.toLowerCase();

    if (stat && !validCols.has(stat)) {
      return res.status(400).json({
        success: false,
        error: `Invalid stat "${stat}"`,
      });
    }
    if (sortBy && !validCols.has(sortBy)) sortBy = null;

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
      params.push(parseInt(year, 10));
    }
    if (team) {
      conditions.push(
        `(LOWER(COALESCE(t.name, tc.full_name, ps.team_code)) ILIKE $${pIdx++})`,
      );
      params.push(`%${String(team).toLowerCase()}%`);
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

    params.push(limit);

    const result = await pool.query(
      `SELECT CONCAT(p.first_name, ' ', p.last_name) AS player_name,
              p.id AS player_id,
              COALESCE(t.name, tc.full_name, ps.team_code) AS team_name,
              ps.year,
              ps.*
       FROM ${table} ps
       LEFT JOIN players p ON p.id = ps.player_id
       LEFT JOIN teams t ON t.id = ps.team_id
       LEFT JOIN team_codes tc ON tc.code = ps.team_code
       ${whereClause}
       ORDER BY ps.${colExpr(sortCol)} ${order.toUpperCase()} NULLS LAST
       LIMIT $${params.length}`,
      params,
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    console.error("searchPlayerStats error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to search player stats",
      message: err.message,
    });
  }
};
