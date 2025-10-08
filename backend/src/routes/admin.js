// src/routes/admin.js
const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

// Create team
router.post(
  "/api/admin/teams",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    const { name, city, state, league } = req.body || {};
    if (!name) return res.status(400).json({ error: "Team name is required" });

    try {
      const { rows } = await pool.query(
        "INSERT INTO teams (name, city, state, league) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, city || null, state || null, league || null]
      );
      res.json(rows[0]);
    } catch (err) {
      console.error("Create team error:", err);
      res.status(500).json({ error: "Failed to create team" });
    }
  }
);

// Upsert championship by year
router.put(
  "/api/admin/championships/:year",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    const { year } = req.params;
    const {
      champion_team_id,
      runner_up_team_id,
      championship_score,
      mvp_player_id,
      leading_pitcher_id,
    } = req.body || {};

    try {
      const upd = await pool.query(
        `
      UPDATE championships
      SET champion_team_id = $1,
          runner_up_team_id = $2,
          championship_score = $3,
          mvp_player_id = $4,
          leading_pitcher_id = $5
      WHERE year = $6
      RETURNING *
    `,
        [
          champion_team_id,
          runner_up_team_id,
          championship_score,
          mvp_player_id,
          leading_pitcher_id,
          year,
        ]
      );

      if (upd.rows.length) return res.json(upd.rows[0]);

      const ins = await pool.query(
        `
      INSERT INTO championships (year, champion_team_id, runner_up_team_id, championship_score, mvp_player_id, leading_pitcher_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
        [
          year,
          champion_team_id,
          runner_up_team_id,
          championship_score,
          mvp_player_id,
          leading_pitcher_id,
        ]
      );

      res.json(ins.rows[0]);
    } catch (err) {
      console.error("Upsert championship error:", err);
      res.status(500).json({ error: "Failed to update championship" });
    }
  }
);

// Create player
router.post(
  "/api/admin/players",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    const { first_name, last_name, is_hall_of_fame, mlb_team } = req.body || {};
    if (!last_name)
      return res.status(400).json({ error: "last_name is required" });

    try {
      const { rows } = await pool.query(
        "INSERT INTO players (first_name, last_name, is_hall_of_fame, mlb_team) VALUES ($1, $2, $3, $4) RETURNING *",
        [first_name || null, last_name, !!is_hall_of_fame, mlb_team || null]
      );
      res.json(rows[0]);
    } catch (err) {
      console.error("Create player error:", err);
      res.status(500).json({ error: "Failed to create player" });
    }
  }
);

module.exports = router;
