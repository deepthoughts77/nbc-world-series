// src/routes/teams.js
const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// GET /api/teams
router.get("/", async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT t.*,
             COUNT(DISTINCT tt.tournament_id)::int AS appearances,
             COUNT(DISTINCT c1.id)::int           AS championships_won
      FROM teams t
      LEFT JOIN tournament_teams tt ON t.id = tt.team_id
      LEFT JOIN championships c1     ON t.id = c1.champion_team_id
      GROUP BY t.id
      ORDER BY championships_won DESC, t.name
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching teams:", err);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

module.exports = router;
