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

async function getChampionAndRunnerUp(year) {
  const r = await pool.query(
    `
    SELECT year, champion_team_id, runner_up_team_id
    FROM championships
    WHERE year = $1
    LIMIT 1
    `,
    [year],
  );
  return r.rows?.[0] || null;
}

async function getTeamNames(teamIds) {
  if (!teamIds?.length) return new Map();
  const r = await pool.query(
    `
    SELECT id, name
    FROM teams
    WHERE id = ANY($1::int[])
    `,
    [teamIds],
  );
  return new Map(r.rows.map((t) => [Number(t.id), t.name]));
}

async function loadFinalBatting({ year, teamId }) {
  const r = await pool.query(
    `
    SELECT player_name, ab, r, h, rbi, bb, so
    FROM championship_final_batting
    WHERE year = $1 AND team_id = $2
    ORDER BY id ASC
    `,
    [year, teamId],
  );
  return r.rows || [];
}

async function loadFinalPitching({ year, teamId }) {
  const r = await pool.query(
    `
    SELECT player_name, ip, h, r, er, bb, so
    FROM championship_final_pitching
    WHERE year = $1 AND team_id = $2
    ORDER BY id ASC
    `,
    [year, teamId],
  );
  return r.rows || [];
}

/**
 * GET /api/championships/:year/final
 * Optional: ?team=runner_up
 *
 * Must match frontend ChampionshipFinal.js:
 * {
 *   success: true,
 *   meta: { year },
 *   data: [
 *     { team_id, team_name, batting: [], pitching: [] },
 *     ...
 *   ]
 * }
 */
export const getFinalForYear = async (req, res) => {
  const year = Number(req.params.year);
  const teamMode = String(req.query.team || "").toLowerCase(); // "runner_up" or ""

  try {
    // Make sure the final-line tables exist (these are the ones your DB has)
    const hasBat = await tableExists("championship_final_batting");
    const hasPit = await tableExists("championship_final_pitching");

    if (!hasBat || !hasPit) {
      return res.status(200).json({
        success: true,
        meta: { year },
        data: [],
        warning:
          "Missing championship_final_batting and/or championship_final_pitching tables.",
      });
    }

    const champRow = await getChampionAndRunnerUp(year);

    if (!champRow?.champion_team_id || !champRow?.runner_up_team_id) {
      return res.status(200).json({
        success: true,
        meta: { year },
        data: [],
        warning:
          "No champion_team_id / runner_up_team_id found for this year in championships table.",
      });
    }

    const championTeamId = Number(champRow.champion_team_id); // 470 (Santa Barbara)
    const runnerUpTeamId = Number(champRow.runner_up_team_id); // 300 (Hays)

    // ✅ correct ordering: champion first
    const orderedTeamIds =
      teamMode === "runner_up"
        ? [runnerUpTeamId]
        : [championTeamId, runnerUpTeamId];

    const teamNameById = await getTeamNames(orderedTeamIds);

    const data = [];
    for (const teamId of orderedTeamIds) {
      const teamName = teamNameById.get(teamId);
      if (!teamName) continue;

      // eslint-disable-next-line no-await-in-loop
      const batting = await loadFinalBatting({ year, teamId });
      // eslint-disable-next-line no-await-in-loop
      const pitching = await loadFinalPitching({ year, teamId });

      data.push({
        team_id: teamId,
        team_name: teamName,
        batting,
        pitching,
      });
    }

    return res.json({
      success: true,
      meta: { year },
      data,
    });
  } catch (err) {
    console.error("getFinalForYear error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch final stats for year",
      message: err.message,
    });
  }
};

// Compatibility: /:year/finals
export const getFinalsForYear = async (req, res) => getFinalForYear(req, res);

/**
 * GET /api/championships/:year/finals/team/:teamId
 * (Not used by your Final Stats page, but your routes import it)
 */
export const getFinalsForTeam = async (req, res) => {
  const year = Number(req.params.year);
  const teamId = Number(req.params.teamId);

  try {
    const hasBat = await tableExists("championship_final_batting");
    const hasPit = await tableExists("championship_final_pitching");

    if (!hasBat || !hasPit) {
      return res.status(404).json({
        success: false,
        error: "Final stats tables not found",
      });
    }

    const teamNameById = await getTeamNames([teamId]);
    const teamName = teamNameById.get(teamId) || null;

    const batting = await loadFinalBatting({ year, teamId });
    const pitching = await loadFinalPitching({ year, teamId });

    return res.json({
      success: true,
      meta: { year, team_id: teamId, team_name: teamName },
      data: { team_id: teamId, team_name: teamName, batting, pitching },
    });
  } catch (err) {
    console.error("getFinalsForTeam error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch finals for team",
      message: err.message,
    });
  }
};

/**
 * GET /api/championships/:year/mvp
 * Your routes import this; keep it safe.
 */
export const getMvpForYear = async (req, res) => {
  const year = Number(req.params.year);

  try {
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
      success: true,
      meta: { year },
      data: row,
    });
  } catch (err) {
    console.error("getMvpForYear error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch MVP for year",
      message: err.message,
    });
  }
};

// Aliases (optional)
export const getChampionshipFinalByYear = getFinalForYear;
export const getChampionshipMvpByYear = getMvpForYear;
