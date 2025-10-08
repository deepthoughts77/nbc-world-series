// src/routes/tournaments.js
const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// GET /api/tournaments/:year
router.get("/:year", async (req, res) => {
  const { year } = req.params;
  try {
    const t = await pool.query("SELECT * FROM tournaments WHERE year = $1", [
      year,
    ]);
    if (t.rows.length === 0)
      return res.status(404).json({ error: "Tournament not found" });

    const teams = await pool.query(
      `
      SELECT t.*, tt.finish_position, tt.wins, tt.losses
      FROM teams t
      JOIN tournament_teams tt ON t.id = tt.team_id
      WHERE tt.tournament_id = $1
      ORDER BY tt.finish_position
    `,
      [t.rows[0].id]
    );

    res.json({ tournament: t.rows[0], teams: teams.rows });
  } catch (err) {
    console.error("Error fetching tournament:", err);
    res.status(500).json({ error: "Failed to fetch tournament" });
  }
});

module.exports = router;
