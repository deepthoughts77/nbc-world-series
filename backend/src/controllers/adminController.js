import { pool } from "../db.js"; // Assuming your DB config is at ../db.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
// Note: This path goes from controller -> src -> db
const __dirname = path.dirname(__filename);
const schemaPath = path.join(__dirname, "..", "db", "schema.sql");

/**
 * @description Sanity check for admin routes
 * @route GET /api/admin/ping
 */
export const ping = (req, res) => {
  res.json({ ok: true, where: "adminController.js" });
};

/**
 * @description Create a new team
 * @route POST /api/admin/teams
 */
export const createTeam = async (req, res) => {
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
};

/**
 * @description Update or insert a championship record by year
 * @route PUT /api/admin/championships/:year
 */
export const upsertChampionship = async (req, res) => {
  const { year } = req.params;
  const {
    champion_team_id,
    runner_up_team_id,
    championship_score,
    mvp_player_id,
    leading_pitcher_id,
  } = req.body || {};

  try {
    // Try to UPDATE first
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

    // If no rows updated, INSERT
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
};

/**
 * @description Create a new player
 * @route POST /api/admin/players
 */
export const createPlayer = async (req, res) => {
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
};

/**
 * @description (Danger) Run the database schema setup SQL
 * @route POST /api/admin/setup-database
 */
export const setupDatabase = async (req, res) => {
  try {
    const key = req.header("x-admin-key");
    if (!key || key !== process.env.ADMIN_SETUP_KEY) {
      return res.status(401).json({ success: false, error: "unauthorized" });
    }

    if (!fs.existsSync(schemaPath)) {
      console.error(`Schema file not found at: ${schemaPath}`);
      return res
        .status(500)
        .json({ error: "Schema file not found on server." });
    }

    const schema = fs.readFileSync(schemaPath, "utf8");
    await pool.query(schema);

    res.json({
      success: true,
      message: "Database schema created successfully",
    });
  } catch (error) {
    console.error("Setup error:", error);
    res.status(500).json({ error: error.message });
  }
};
