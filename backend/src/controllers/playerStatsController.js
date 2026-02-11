// backend/src/controllers/playerStatsController.js
import { pool } from "../db.js";

async function tableExists(tableName) {
  const q = `
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema='public' AND table_name=$1
    ) AS exists
  `;
  const r = await pool.query(q, [tableName]);
  return !!r.rows?.[0]?.exists;
}

// Put your real table names first if you know them
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
    // eslint-disable-next-line no-await-in-loop
    if (await tableExists(t)) return t;
  }
  return null;
}

/**
 * GET /api/player-stats/years
 * Return years present in batting table (or fallback pitching table if batting not found)
 */
export const getPlayerStatsYears = async (_req, res) => {
  try {
    const battingTable = await pickFirstExistingTable(BATTING_TABLE_CANDIDATES);
    const pitchingTable = await pickFirstExistingTable(
      PITCHING_TABLE_CANDIDATES,
    );

    const table = battingTable || pitchingTable;
    if (!table) {
      return res.json({
        years: [],
        message:
          "No player stats tables found. Update table candidates in playerStatsController.js",
      });
    }

    const result = await pool.query(`
      SELECT DISTINCT year
      FROM ${table}
      WHERE year IS NOT NULL
      ORDER BY year DESC
    `);

    res.json(result.rows.map((r) => r.year));
  } catch (err) {
    console.error("getPlayerStatsYears error:", err);
    res.status(500).json({
      error: "Failed to fetch player-stats years",
      message: err.message,
    });
  }
};

/**
 * GET /api/player-stats/:year
 * Returns batting rows for that year (with joins if possible)
 */
export const getPlayerStatsByYear = async (req, res) => {
  const { year } = req.params;

  try {
    const table = await pickFirstExistingTable(BATTING_TABLE_CANDIDATES);
    if (!table) {
      return res.json({
        year: Number(year),
        count: 0,
        data: [],
        message:
          "No batting table found. Update BATTING_TABLE_CANDIDATES in playerStatsController.js",
      });
    }

    const result = await pool.query(
      `
      SELECT
        ps.*,
        t.name AS team_name,
        t.city AS team_city,
        t.state AS team_state,
        CONCAT(p.first_name, ' ', p.last_name) AS player_name
      FROM ${table} ps
      LEFT JOIN teams t ON t.id = ps.team_id
      LEFT JOIN players p ON p.id = ps.player_id
      WHERE ps.year = $1
      ORDER BY t.name NULLS LAST, player_name NULLS LAST
      `,
      [year],
    );

    res.json({
      year: Number(year),
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    console.error("getPlayerStatsByYear error:", err);
    res.status(500).json({
      error: "Failed to fetch player stats by year",
      message: err.message,
    });
  }
};

/**
 * GET /api/player-stats/:year/pitching
 * Returns pitching rows for that year (with joins if possible)
 */
export const getPlayerPitchingStatsByYear = async (req, res) => {
  const { year } = req.params;

  try {
    const table = await pickFirstExistingTable(PITCHING_TABLE_CANDIDATES);
    if (!table) {
      return res.json({
        year: Number(year),
        count: 0,
        data: [],
        message:
          "No pitching table found. Update PITCHING_TABLE_CANDIDATES in playerStatsController.js",
      });
    }

    const result = await pool.query(
      `
      SELECT
        ps.*,
        t.name AS team_name,
        t.city AS team_city,
        t.state AS team_state,
        CONCAT(p.first_name, ' ', p.last_name) AS player_name
      FROM ${table} ps
      LEFT JOIN teams t ON t.id = ps.team_id
      LEFT JOIN players p ON p.id = ps.player_id
      WHERE ps.year = $1
      ORDER BY t.name NULLS LAST, player_name NULLS LAST
      `,
      [year],
    );

    res.json({
      year: Number(year),
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    console.error("getPlayerPitchingStatsByYear error:", err);
    res.status(500).json({
      error: "Failed to fetch pitching stats by year",
      message: err.message,
    });
  }
};

// Alias (in case any old route imports a different name)
export const getAvailablePlayerStatsYears = getPlayerStatsYears;
