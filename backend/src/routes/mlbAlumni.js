// src/routes/mlbAlumni.js
const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// GET /api/mlb-alumni
router.get("/", async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT ma.*, p.first_name, p.last_name
      FROM mlb_alumni ma
      JOIN players p ON ma.player_id = p.id
      ORDER BY p.last_name, p.first_name
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching alumni:", err);
    res.status(500).json({ error: "Failed to fetch MLB alumni" });
  }
});

module.exports = router;
