// backend/src/routes/records.js
const express = require("express");
const router = express.Router();
const pool = require("../config/database");

/**
 * GET /api/records/summary
 * Returns a few headline records computed from your current tables.
 * (Most championships by team, most appearances by team, most MVP awards by player)
 */
router.get("/summary", async (_req, res) => {
  try {
    // Most championships (by champion_team_id in championships)
    const { rows: mostChamps } = await pool.query(`
      SELECT t.id, t.name, COUNT(c.id)::int AS championships
      FROM teams t
      JOIN championships c ON c.champion_team_id = t.id
      GROUP BY t.id, t.name
      ORDER BY championships DESC, t.name ASC
      LIMIT 1
    `);

    // Most appearances (where a team participated in tournament_teams)
    const { rows: mostAppearances } = await pool.query(`
      SELECT t.id, t.name, COUNT(tt.tournament_id)::int AS appearances
      FROM teams t
      JOIN tournament_teams tt ON tt.team_id = t.id
      GROUP BY t.id, t.name
      ORDER BY appearances DESC, t.name ASC
      LIMIT 1
    `);

    // Most MVP awards (championships.mvp_player_id)
    const { rows: mostMvp } = await pool.query(`
      SELECT p.id, (p.first_name || ' ' || p.last_name) AS player_name,
             COUNT(c.id)::int AS mvp_awards
      FROM players p
      JOIN championships c ON c.mvp_player_id = p.id
      GROUP BY p.id, player_name
      ORDER BY mvp_awards DESC, player_name ASC
      LIMIT 1
    `);

    res.json({
      success: true,
      data: {
        most_championships_team: mostChamps[0] || null,
        most_appearances_team: mostAppearances[0] || null,
        most_mvp_player: mostMvp[0] || null,
      },
    });
  } catch (err) {
    console.error("Records summary error:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to compute records" });
  }
});

module.exports = router;
