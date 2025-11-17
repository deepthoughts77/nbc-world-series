import { pool } from "../db.js";

/**
 * @description Get all championships with pagination
 * @route GET /api/championships
 */
export const getAllChampionships = async (req, res) => {
  try {
    const query = `
      SELECT 
        c.id,
        c.year,
        c.championship_score,
        ct.name  AS champion_name,
        ct.city  AS champion_city,
        ct.state AS champion_state,
        rt.name  AS runner_up_name,
        rt.city  AS runner_up_city,
        rt.state AS runner_up_state,
        CONCAT(p.first_name, ' ', p.last_name) as mvp
      FROM championships c
      LEFT JOIN teams ct ON c.champion_team_id = ct.id
      LEFT JOIN teams rt ON c.runner_up_team_id = rt.id
      LEFT JOIN players p ON c.mvp_player_id = p.id
      ORDER BY c.year DESC
    `;

    const result = await pool.query(query);

    res.json({
      success: true,
      count: result.rows.length,
      total: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching championships:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch championships",
    });
  }
};

/**
 * @description Get a single championship by year
 * @route GET /api/championships/:year
 */
export const getChampionshipByYear = async (req, res) => {
  try {
    const { year } = req.params;

    if (!/^\d{4}$/.test(year)) {
      return res
        .status(400)
        .json({ success: false, error: "Year must be a 4-digit number" });
    }

    const query = `
      SELECT 
        c.id,
        c.year,
        c.championship_score,
        ct.name  AS champion_name,
        ct.city  AS champion_city,
        ct.state AS champion_state,
        rt.name  AS runner_up_name,
        rt.city  AS runner_up_city,
        rt.state AS runner_up_state,
        CONCAT(p.first_name, ' ', p.last_name) as mvp
      FROM championships c
      LEFT JOIN teams ct ON c.champion_team_id = ct.id
      LEFT JOIN teams rt ON c.runner_up_team_id = rt.id
      LEFT JOIN players p ON c.mvp_player_id = p.id
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

    // This is the data the frontend receives
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
};
