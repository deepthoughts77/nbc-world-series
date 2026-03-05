// backend/src/controllers/teamController.js
import { pool } from "../db.js";

/** GET /api/teams */
export const getAllTeams = async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        t.id, t.name, t.city, t.state, t.league,
        COUNT(DISTINCT c.id)                          AS championships_won,
        (COUNT(DISTINCT c.id) + COUNT(DISTINCT ru.id)) AS finals_appearances
      FROM teams t
      LEFT JOIN championships c  ON t.id = c.champion_team_id
      LEFT JOIN championships ru ON t.id = ru.runner_up_team_id
      GROUP BY t.id, t.name, t.city, t.state, t.league
      ORDER BY t.name
    `);
    const rows = result.rows.map((r) => ({
      ...r,
      appearances: r.finals_appearances,
    }));
    res.json(rows);
  } catch (err) {
    console.error("/api/teams error:", err);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
};

/** GET /api/teams/by-name/:name */
export const getTeamByName = async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name || "").trim();
    if (!name) return res.status(400).json({ error: "missing_name" });

    const { rows } = await pool.query(
      `SELECT
         t.id, t.name, t.city, t.state, t.league,
         COUNT(DISTINCT c.id)                          AS championships_won,
         (COUNT(DISTINCT c.id) + COUNT(DISTINCT ru.id)) AS finals_appearances
       FROM teams t
       LEFT JOIN championships c  ON t.id = c.champion_team_id
       LEFT JOIN championships ru ON t.id = ru.runner_up_team_id
       WHERE LOWER(t.name) = LOWER($1)
       GROUP BY t.id, t.name, t.city, t.state, t.league
       LIMIT 1`,
      [name],
    );

    if (!rows.length) return res.status(404).json({ error: "team_not_found" });
    res.json({ ...rows[0], appearances: rows[0].finals_appearances });
  } catch (err) {
    console.error("getTeamByName error:", err);
    res.status(500).json({ error: "server_error" });
  }
};

/** GET /api/teams/:id  ← this was missing */
export const getTeamById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "invalid_id" });

    const { rows } = await pool.query(
      `SELECT
         t.id, t.name, t.city, t.state, t.league,
         COUNT(DISTINCT c.id)                          AS championships_won,
         (COUNT(DISTINCT c.id) + COUNT(DISTINCT ru.id)) AS finals_appearances
       FROM teams t
       LEFT JOIN championships c  ON t.id = c.champion_team_id
       LEFT JOIN championships ru ON t.id = ru.runner_up_team_id
       WHERE t.id = $1
       GROUP BY t.id, t.name, t.city, t.state, t.league
       LIMIT 1`,
      [id],
    );

    if (!rows.length) return res.status(404).json({ error: "team_not_found" });
    res.json({ ...rows[0], appearances: rows[0].finals_appearances });
  } catch (err) {
    console.error("getTeamById error:", err);
    res.status(500).json({ error: "server_error" });
  }
};

/** GET /api/teams/:id/championships */
export const getTeamChampionships = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT
         c.year, c.championship_score,
         c.champion_team_id, c.runner_up_team_id,
         ct.name AS champion_name,
         rt.name AS runner_up_name
       FROM championships c
       LEFT JOIN teams ct ON ct.id = c.champion_team_id
       LEFT JOIN teams rt ON rt.id = c.runner_up_team_id
       WHERE c.champion_team_id = $1 OR c.runner_up_team_id = $1
       ORDER BY c.year DESC`,
      [id],
    );
    res.json(rows);
  } catch (err) {
    console.error("getTeamChampionships error:", err);
    res.status(500).json({ error: "server_error" });
  }
};

/** GET /api/teams/:id/years */
export const getTeamYears = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT DISTINCT year FROM (
         SELECT year FROM batting_stats  WHERE team_id = $1 AND year IS NOT NULL
         UNION
         SELECT year FROM pitching_stats WHERE team_id = $1 AND year IS NOT NULL
       ) y
       ORDER BY year DESC`,
      [id],
    );
    res.json(rows.map((r) => Number(r.year)).filter(Boolean));
  } catch (err) {
    console.error("getTeamYears error:", err);
    res.status(500).json({ error: "server_error" });
  }
};

/** GET /api/teams/:id/batting?year=YYYY */
export const getTeamBatting = async (req, res) => {
  try {
    const { id } = req.params;
    const { year } = req.query;
    if (!year) return res.json([]);
    const { rows } = await pool.query(
      `SELECT
         bs.*,
         p.first_name,
         p.last_name,
         CONCAT(p.first_name, ' ', p.last_name) AS player_name
       FROM batting_stats bs
       JOIN players p ON bs.player_id = p.id
       WHERE bs.team_id = $1 AND bs.year = $2
       ORDER BY p.last_name`,
      [id, year],
    );
    res.json(rows);
  } catch (err) {
    console.error("getTeamBatting error:", err);
    res.status(500).json({ error: "server_error" });
  }
};

/** GET /api/teams/:id/pitching?year=YYYY */
export const getTeamPitching = async (req, res) => {
  try {
    const { id } = req.params;
    const { year } = req.query;
    if (!year) return res.json([]);
    const { rows } = await pool.query(
      `SELECT
         ps.*,
         p.first_name,
         p.last_name,
         CONCAT(p.first_name, ' ', p.last_name) AS player_name,
         CASE
           WHEN ps.ip > 0
           THEN ROUND((COALESCE(ps.bb,0) + COALESCE(ps.h,0))::numeric / ps.ip, 2)
           ELSE NULL
         END AS whip
       FROM pitching_stats ps
       JOIN players p ON ps.player_id = p.id
       WHERE ps.team_id = $1 AND ps.year = $2
       ORDER BY ps.era ASC NULLS LAST`,
      [id, year],
    );
    res.json(rows);
  } catch (err) {
    console.error("getTeamPitching error:", err);
    res.status(500).json({ error: "server_error" });
  }
};
