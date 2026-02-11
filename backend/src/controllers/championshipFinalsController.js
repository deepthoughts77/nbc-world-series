// backend/src/controllers/championshipFinalsController.js
import { pool } from "../db.js";

async function tableExists(tableName) {
  const q = `
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = $1
    ) AS exists
  `;
  const r = await pool.query(q, [tableName]);
  return !!r.rows?.[0]?.exists;
}

/**
 * FINAL (single endpoint)
 * GET /api/championships/:year/final
 */
export const getFinalForYear = async (req, res) => {
  const { year } = req.params;

  try {
    // Try your “finals” style table first
    // (Rename these if your actual table name differs)
    const candidates = ["championship_finals", "finals", "championship_final"];
    let table = null;

    for (const t of candidates) {
      // eslint-disable-next-line no-await-in-loop
      if (await tableExists(t)) {
        table = t;
        break;
      }
    }

    if (!table) {
      return res.status(200).json({
        year: Number(year),
        message:
          "No finals table found. Create a finals table or rename the controller candidate list.",
        data: null,
      });
    }

    // Very generic fetch – adjust columns if needed
    const result = await pool.query(
      `SELECT * FROM ${table} WHERE year = $1 ORDER BY id ASC`,
      [year],
    );

    return res.json({
      year: Number(year),
      source_table: table,
      data: result.rows,
    });
  } catch (err) {
    console.error("getFinalForYear error:", err);
    return res.status(500).json({
      error: "Failed to fetch final for year",
      message: err.message,
    });
  }
};

/**
 * FINALS (plural) - compatibility
 * GET /api/championships/:year/finals
 */
export const getFinalsForYear = async (req, res) => {
  return getFinalForYear(req, res);
};

/**
 * FINALS FOR TEAM
 * GET /api/championships/:year/finals/team/:teamId
 */
export const getFinalsForTeam = async (req, res) => {
  const { year, teamId } = req.params;

  try {
    const candidates = ["championship_finals", "finals", "championship_final"];
    let table = null;

    for (const t of candidates) {
      // eslint-disable-next-line no-await-in-loop
      if (await tableExists(t)) {
        table = t;
        break;
      }
    }

    if (!table) {
      return res.status(200).json({
        year: Number(year),
        teamId: String(teamId),
        message: "No finals table found.",
        data: [],
      });
    }

    // Try common team column names
    const cols = await pool.query(
      `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
    `,
      [table],
    );

    const columnSet = new Set(cols.rows.map((c) => c.column_name));
    const teamCol =
      (columnSet.has("team_id") && "team_id") ||
      (columnSet.has("teamId") && "teamId") ||
      (columnSet.has("team") && "team") ||
      null;

    if (!teamCol) {
      return res.status(200).json({
        year: Number(year),
        teamId: String(teamId),
        source_table: table,
        message:
          "Finals table exists, but no recognizable team column (team_id/teamId/team).",
        data: [],
      });
    }

    const result = await pool.query(
      `SELECT * FROM ${table} WHERE year = $1 AND ${teamCol} = $2 ORDER BY id ASC`,
      [year, teamId],
    );

    return res.json({
      year: Number(year),
      teamId: String(teamId),
      source_table: table,
      data: result.rows,
    });
  } catch (err) {
    console.error("getFinalsForTeam error:", err);
    return res.status(500).json({
      error: "Failed to fetch finals for team",
      message: err.message,
    });
  }
};

/**
 * MVP
 * GET /api/championships/:year/mvp
 */
export const getMvpForYear = async (req, res) => {
  const { year } = req.params;

  try {
    // MVP info typically lives on championships table
    const result = await pool.query(
      `
      SELECT
        c.year,
        c.mvp_player_id,
        CONCAT(p.first_name, ' ', p.last_name) AS mvp_name
      FROM championships c
      LEFT JOIN players p ON p.id = c.mvp_player_id
      WHERE c.year = $1
      LIMIT 1
    `,
      [year],
    );

    const row = result.rows?.[0] || null;

    return res.json({
      year: Number(year),
      mvp: row,
      stats_snapshot: null,
      stats_source: "not set",
    });
  } catch (err) {
    console.error("getMvpForYear error:", err);
    return res.status(500).json({
      error: "Failed to fetch MVP for year",
      message: err.message,
    });
  }
};

// Aliases to stop “export not found” crashes from older imports
export const getChampionshipFinalByYear = getFinalForYear;
export const getChampionshipMvpByYear = getMvpForYear;
