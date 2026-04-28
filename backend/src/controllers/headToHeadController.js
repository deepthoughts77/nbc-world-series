// backend/src/controllers/headToHeadController.js
import { pool } from "../db.js";

/**
 * GET /api/head-to-head/teams
 * Returns all distinct team names for the dropdowns
 */
export const getTeamList = async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT DISTINCT team FROM (
        SELECT winning_team AS team FROM game_results
        UNION
        SELECT losing_team  AS team FROM game_results
      ) t
      ORDER BY team
    `);
    res.json({ success: true, data: rows.map((r) => r.team) });
  } catch (err) {
    console.error("getTeamList error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * GET /api/head-to-head?team1=Liberal+Bee+Jays&team2=Hays+Larks
 * Returns head-to-head record and game log between two teams
 */
export const getHeadToHead = async (req, res) => {
  try {
    const { team1, team2 } = req.query;
    if (!team1 || !team2) {
      return res
        .status(400)
        .json({ success: false, error: "Both team1 and team2 are required" });
    }

    const { rows } = await pool.query(
      `
      SELECT
        year,
        game_date,
        winning_team,
        winning_score,
        losing_team,
        losing_score,
        CASE
          WHEN winning_team ILIKE $1 THEN $1
          ELSE $2
        END AS team1_result
      FROM game_results
      WHERE
        (winning_team ILIKE $1 AND losing_team ILIKE $2)
        OR
        (winning_team ILIKE $2 AND losing_team ILIKE $1)
      ORDER BY year ASC, game_date ASC
    `,
      [team1, team2],
    );

    const team1Wins = rows.filter(
      (r) => r.winning_team.toLowerCase() === team1.toLowerCase(),
    ).length;
    const team2Wins = rows.length - team1Wins;

    res.json({
      success: true,
      team1,
      team2,
      total_games: rows.length,
      team1_wins: team1Wins,
      team2_wins: team2Wins,
      games: rows,
    });
  } catch (err) {
    console.error("getHeadToHead error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
