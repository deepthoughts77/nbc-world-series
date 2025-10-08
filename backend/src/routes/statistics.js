// backend/src/routes/statistics.js
const express = require("express");
const pool = require("../config/database");

const router = express.Router();

// GET /api/statistics/overview
router.get("/statistics/overview", async (_req, res) => {
  try {
    const [champs, teams, hof, mlb] = await Promise.all([
      pool.query("SELECT COUNT(*)::int AS count FROM championships"),
      pool.query("SELECT COUNT(*)::int AS count FROM teams"),
      pool.query("SELECT COUNT(*)::int AS count FROM hall_of_fame"),
      pool.query("SELECT COUNT(*)::int AS count FROM mlb_alumni"),
    ]);

    const { rows: most } = await pool.query(
      `SELECT t.name, COUNT(c.id)::int AS championships
       FROM teams t
       JOIN championships c ON t.id = c.champion_team_id
       GROUP BY t.name
       ORDER BY championships DESC
       LIMIT 1`
    );

    res.json({
      total_championships: champs.rows[0].count,
      total_teams: teams.rows[0].count,
      hall_of_fame_members: hof.rows[0].count,
      mlb_alumni: mlb.rows[0].count,
      most_successful_team: most[0] || null,
    });
  } catch (err) {
    console.error("statistics/overview error:", err);
    res.status(500).json({ error: "Failed to load statistics" });
  }
});

module.exports = router;
