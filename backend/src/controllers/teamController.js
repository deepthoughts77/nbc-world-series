import { pool } from "../db.js";
import { catchAsync } from "../utils/errorHandler.js";

/**
 * @description Get all teams with their championship and appearance counts
 * @route GET /api/teams
 */
export const getAllTeams = async (_req, res) => {
  try {
    // This query is the complex one from your original index.js
    // It's what your frontend needs.
    const result = await pool.query(`
      SELECT
        t.id,
        t.name,
        t.city,
        t.state,
        t.league,
        -- Count championships
        COUNT(DISTINCT c.id) as championships_won,
        -- Count appearances (champion + runner-up)
        (COUNT(DISTINCT c.id) + COUNT(DISTINCT ru.id)) as appearances
      FROM teams t
      LEFT JOIN championships c ON t.id = c.champion_team_id
      LEFT JOIN championships ru ON t.id = ru.runner_up_team_id
      GROUP BY t.id, t.name, t.city, t.state, t.league
      ORDER BY t.name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(" /api/teams error:", err);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
};

/**
 * @description Get batting stats for a specific team/year
 * @route GET /api/teams/:id/batting
 */
export const getTeamBatting = async (req, res) => {
  try {
    const { id } = req.params;
    const { year } = req.query;
    const { rows } = await pool.query(
      `SELECT * FROM public.vw_batting_expanded
       WHERE team_id = $1 AND year = $2
       ORDER BY last_name`,
      [id, year]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error" });
  }
};

/**
 * @description Get pitching stats for a specific team/year
 * @route GET /api/teams/:id/pitching
 */
export const getTeamPitching = async (req, res) => {
  try {
    const { id } = req.params;
    const { year } = req.query;
    const { rows } = await pool.query(
      `SELECT * FROM public.vw_pitching_expanded
       WHERE team_id = $1 AND year = $2
       ORDER BY last_name`,
      [id, year]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error" });
  }
};
