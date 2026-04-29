// backend/src/controllers/headToHeadController.js
import { pool } from "../db.js";

/**
 * GET /api/head-to-head/teams
 * Returns all team names from the teams table (not just game_results).
 * This gives the full 465-team list, not just teams in recorded games.
 */
export const getTeamList = async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT DISTINCT name AS team
      FROM teams
      WHERE name IS NOT NULL AND name != ''
      ORDER BY name
    `);
    res.json({ success: true, data: rows.map((r) => r.team) });
  } catch (err) {
    console.error("getTeamList error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * GET /api/head-to-head?team1=Liberal+Bee+Jays&team2=Hays+Larks
 *
 * Returns head-to-head record and game log between two teams.
 * Uses ILIKE with % wildcards so minor name spelling differences in
 * game_results still match the canonical team name from the teams table.
 */
export const getHeadToHead = async (req, res) => {
  try {
    const { team1, team2 } = req.query;
    if (!team1 || !team2) {
      return res.status(400).json({
        success: false,
        error: "Both team1 and team2 are required",
      });
    }

    // Use % wildcard matching to bridge any minor spelling differences
    // between the teams table name and the game_results entries.
    // We match on the core team name (strip leading/trailing spaces).
    const t1 = `%${team1.trim()}%`;
    const t2 = `%${team2.trim()}%`;

    const { rows } = await pool.query(
      `
      SELECT
        year,
        game_date,
        winning_team,
        winning_score,
        losing_team,
        losing_score
      FROM game_results
      WHERE
        (winning_team ILIKE $1 AND losing_team ILIKE $2)
        OR
        (winning_team ILIKE $2 AND losing_team ILIKE $1)
      ORDER BY year ASC, game_date ASC
    `,
      [t1, t2],
    );

    const team1Wins = rows.filter((r) =>
      r.winning_team.toLowerCase().includes(team1.trim().toLowerCase()),
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
