import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// GET /api/alumni
router.get("/", async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        id,
        player_id,
        array_to_string(mlb_teams, ', ')   AS mlb_team,
        array_to_string(nbc_teams, ', ')   AS nbc_team,
        array_to_string(nbc_years::text[], ', ') AS nbc_years,
        active
      FROM public.mlb_alumni
      ORDER BY id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching MLB alumni:", err);
    res.status(500).json({ error: "Failed to fetch MLB alumni" });
  }
});

export default router;
