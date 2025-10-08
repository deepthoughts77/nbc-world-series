// src/routes/players.js
const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// Search players by name: /api/players/search?q=smith
router.get("/search", async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.json([]);

  try {
    const { rows } = await pool.query(
      `
      SELECT p.*,
             COALESCE(ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL), '{}') AS teams_played_for
      FROM players p
      LEFT JOIN player_teams pt ON p.id = pt.player_id
      LEFT JOIN teams t ON pt.team_id = t.id
      WHERE p.first_name ILIKE $1 OR p.last_name ILIKE $1
      GROUP BY p.id
      ORDER BY p.last_name, p.first_name
      LIMIT 25
      `,
      [`%${q}%`]
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Search failed" });
  }
});

// Get one player with history
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id))
    return res.status(400).json({ error: "Invalid id" });

  try {
    const { rows } = await pool.query(`SELECT * FROM players WHERE id = $1`, [
      id,
    ]);
    if (!rows.length) return res.status(404).json({ error: "Not found" });

    const history = await pool.query(
      `
      SELECT pt.year, pt.position, pt.stats,
             t.name AS team_name, t.city, t.state
      FROM player_teams pt
      LEFT JOIN teams t ON t.id = pt.team_id
      WHERE pt.player_id = $1
      ORDER BY pt.year DESC
      `,
      [id]
    );

    res.json({ ...rows[0], history: history.rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch player" });
  }
});

module.exports = router;
