// src/routes/championships.js
const express = require("express");
const router = express.Router();
const pool = require("../config/database");

/**
 * GET /api/championships
 * Query params:
 *   - limit  (default 50, max 100)
 *   - offset (default 0)
 * Returns champion + runner-up details and basic pagination metadata.
 */
router.get("/", async (req, res) => {
  try {
    // Pagination (safe bounds)
    const limit = Math.min(parseInt(req.query.limit || "50", 10), 100);
    const offset = Math.max(parseInt(req.query.offset || "0", 10), 0);

    const baseQuery = `
      SELECT 
        c.*,
        ct.name  AS champion_name,
        ct.city  AS champion_city,
        ct.state AS champion_state,
        rt.name  AS runner_up_name,
        rt.city  AS runner_up_city,
        rt.state AS runner_up_state
      FROM championships c
      LEFT JOIN teams ct ON c.champion_team_id = ct.id
      LEFT JOIN teams rt ON c.runner_up_team_id = rt.id
      ORDER BY c.year DESC
    `;

    const pagedQuery = `${baseQuery} LIMIT $1 OFFSET $2`;

    const [dataResult, countResult] = await Promise.all([
      pool.query(pagedQuery, [limit, offset]),
      pool.query("SELECT COUNT(*)::int AS total FROM championships"),
    ]);

    const total = countResult.rows[0]?.total ?? 0;

    res.json({
      success: true,
      count: dataResult.rows.length,
      total,
      limit,
      offset,
      data: dataResult.rows,
    });
  } catch (error) {
    console.error("Error fetching championships:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch championships",
    });
  }
});

/**
 * GET /api/championships/:year
 * Validates year as 4 digits.
 * Returns champion + runner-up details for the given year.
 */
router.get("/:year", async (req, res) => {
  try {
    const { year } = req.params;

    // Validate year is exactly 4 digits
    if (!/^\d{4}$/.test(year)) {
      return res
        .status(400)
        .json({ success: false, error: "Year must be a 4-digit number" });
    }

    const query = `
      SELECT 
        c.*,
        ct.name  AS champion_name,
        ct.city  AS champion_city,
        ct.state AS champion_state,
        rt.name  AS runner_up_name,
        rt.city  AS runner_up_city,
        rt.state AS runner_up_state
      FROM championships c
      LEFT JOIN teams ct ON c.champion_team_id = ct.id
      LEFT JOIN teams rt ON c.runner_up_team_id = rt.id
      WHERE c.year = $1
      LIMIT 1
    `;

    const result = await pool.query(query, [year]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Championship not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching championship:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch championship",
    });
  }
});

module.exports = router;
