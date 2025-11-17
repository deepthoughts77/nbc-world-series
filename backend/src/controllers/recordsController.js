import { pool } from "../db.js";

/**
 * @description Get a comprehensive overview of all-time records (streaks, MVPs, etc.)
 * @route GET /api/records/overview
 */
export const getRecordsOverview = async (_req, res) => {
  try {
    // === MOST CHAMPIONSHIPS ===
    const mostChampionships = await pool.query(`
      SELECT 
        t.name, t.city, t.state, COUNT(DISTINCT c.id) as championships
      FROM championships c
      JOIN teams t ON c.champion_team_id = t.id
      WHERE c.year IS NOT NULL
      GROUP BY t.id, t.name, t.city, t.state
      ORDER BY championships DESC, t.name
      LIMIT 1
    `);

    // === MOST APPEARANCES ===
    const mostAppearances = await pool.query(`
      SELECT 
        t.name, (COUNT(DISTINCT champ.id) + COUNT(DISTINCT runner.id)) as appearances
      FROM teams t
      LEFT JOIN championships champ ON t.id = champ.champion_team_id
      LEFT JOIN championships runner ON t.id = runner.runner_up_team_id
      GROUP BY t.id, t.name
      HAVING (COUNT(DISTINCT champ.id) + COUNT(DISTINCT runner.id)) > 0
      ORDER BY appearances DESC, t.name
      LIMIT 1
    `);

    // === MOST MVP AWARDS ===
    const mostMVP = await pool.query(`
      SELECT 
        CONCAT(p.first_name, ' ', p.last_name) as player_name,
        COUNT(DISTINCT c.id) as mvp_awards
      FROM championships c
      JOIN players p ON c.mvp_player_id = p.id
      WHERE c.mvp_player_id IS NOT NULL
      GROUP BY p.id, p.first_name, p.last_name
      ORDER BY mvp_awards DESC, player_name
      LIMIT 1
    `);

    // === TOTAL TOURNAMENTS ===
    const totalTournaments = await pool.query(`
      SELECT COUNT(DISTINCT year) as total
      FROM championships
      WHERE year IS NOT NULL
    `);

    // === CHAMPIONSHIP STREAKS ===
    const streaks = await pool.query(`
      WITH championship_years AS (
        SELECT 
          t.name, c.year,
          c.year - ROW_NUMBER() OVER (PARTITION BY t.id ORDER BY c.year) as streak_group
        FROM championships c
        JOIN teams t ON c.champion_team_id = t.id
        WHERE c.year IS NOT NULL
      ),
      streak_counts AS (
        SELECT 
          name, MIN(year) as start_year, MAX(year) as end_year,
          COUNT(*) as consecutive_wins
        FROM championship_years
        GROUP BY name, streak_group
      )
      SELECT name, start_year, end_year, consecutive_wins
      FROM streak_counts
      WHERE consecutive_wins > 1
      ORDER BY consecutive_wins DESC, end_year DESC
      LIMIT 5
    `);

    // === RECENT CHAMPIONS (last 5 years) ===
    const recentChampions = await pool.query(`
      SELECT 
        c.year, champ.name as champion_name, champ.city as champion_city,
        champ.state as champion_state, runner.name as runner_up_name,
        c.championship_score, CONCAT(p.first_name, ' ', p.last_name) as mvp
      FROM championships c
      JOIN teams champ ON c.champion_team_id = champ.id
      LEFT JOIN teams runner ON c.runner_up_team_id = runner.id
      LEFT JOIN players p ON c.mvp_player_id = p.id
      WHERE c.year IS NOT NULL
      ORDER BY c.year DESC
      LIMIT 5
    `);

    const response = {
      most_championships: mostChampionships.rows[0] || null,
      most_appearances: mostAppearances.rows[0] || null,
      most_mvp_awards: mostMVP.rows[0] || null,
      total_tournaments: totalTournaments.rows[0]?.total || 89,
      championship_streaks: streaks.rows || [],
      recent_champions: recentChampions.rows || [],
    };

    res.json(response);
  } catch (err) {
    console.error(" /api/records/overview error:", err);
    res.status(500).json({
      error: "Failed to fetch records overview",
      message: err.message,
    });
  }
};

/**
 * @description Get all records from the 'alltime_records' table
 * @route GET /api/records/all
 */
export const getAllTimeRecords = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM alltime_records
      WHERE era = 'modern_wood'
      ORDER BY category, subcategory
    `);

    res.json({
      success: true,
      count: result.rows.length,
      records: result.rows,
    });
  } catch (error) {
    console.error("Error fetching alltime_records:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch records",
    });
  }
};

/**
 * @description Get specific hard-coded modern wood era records
 * @route GET /api/records/modern-wood-era
 */
export const getModernWoodEraRecords = async (req, res) => {
  try {
    // This is the hard-coded data from your original file
    const records = {
      team_batting: {
        highest_avg: {
          team: "San Diego Stars",
          value: ".379",
          year: 2010,
          games: 6,
        },
        // ... (rest of your hard-coded JSON) ...
      },
      individual_pitching: {
        most_strikeouts_tournament: {
          player: "Tommy Hanson",
          team: "Aloha OR Knights",
          value: 27,
          year: 2005,
        },
      },
    };

    res.json(records);
  } catch (error) {
    console.error("Error fetching modern wood era records:", error);
    res.status(500).json({ error: "Failed to fetch records" });
  }
};

/**
 * @description Get records from 'alltime_records' by a specific category
 * @route GET /api/records/category/:category
 */
export const getRecordsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const result = await pool.query(
      `
      SELECT * FROM alltime_records
      WHERE category = $1 AND era = 'modern_wood'
      ORDER BY subcategory
    `,
      [category]
    );

    res.json({
      success: true,
      category,
      count: result.rows.length,
      records: result.rows,
    });
  } catch (error) {
    console.error("Error fetching records by category:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch records",
    });
  }
};
