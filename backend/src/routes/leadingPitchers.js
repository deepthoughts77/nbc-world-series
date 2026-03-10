// backend/src/routes/leadingPitchers.js
// NBC World Series Leading Pitchers API

import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/**
 * GET /api/leading-pitchers
 * Returns all leading pitchers, newest first.
 * Optional query params:
 *   ?decade=1970  → filter by decade (e.g. 1970 = 1970–1979)
 *   ?search=paige → search by pitcher name or team (case-insensitive)
 */
router.get("/", async (req, res) => {
  try {
    const { decade, search } = req.query;
    const params = [];
    const conditions = [];

    if (decade) {
      const decadeStart = parseInt(decade);
      conditions.push(
        `year >= $${params.length + 1} AND year <= $${params.length + 2}`,
      );
      params.push(decadeStart, decadeStart + 9);
    }

    if (search) {
      conditions.push(
        `(pitcher ILIKE $${params.length + 1} OR team ILIKE $${params.length + 1})`,
      );
      params.push(`%${search}%`);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const result = await pool.query(
      `SELECT
        id,
        year,
        pitcher,
        team,
        innings_pitched,
        earned_runs,
        strikeouts,
        notes
       FROM leading_pitchers
       ${whereClause}
       ORDER BY year DESC`,
      params,
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    console.error("Error fetching leading pitchers:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

/**
 * GET /api/leading-pitchers/decades
 * Returns a list of distinct decades represented in the data.
 * Used by the frontend decade filter.
 */
router.get("/decades", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT (FLOOR(year / 10) * 10)::int AS decade
      FROM leading_pitchers
      ORDER BY decade DESC
    `);
    res.json({
      success: true,
      data: result.rows.map((r) => r.decade),
    });
  } catch (err) {
    console.error("Error fetching decades:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

/**
 * GET /api/leading-pitchers/:year
 * Returns a single year's leading pitcher.
 */
router.get("/:year", async (req, res) => {
  const year = parseInt(req.params.year);
  if (isNaN(year)) {
    return res.status(400).json({ success: false, error: "Invalid year" });
  }
  try {
    const result = await pool.query(
      `SELECT * FROM leading_pitchers WHERE year = $1`,
      [year],
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "No record for that year" });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Error fetching leading pitcher by year:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
