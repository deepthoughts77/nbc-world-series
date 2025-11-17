import { pool } from "../db.js";

/**
 * @description Get tournament details and all participating teams by year
 * @route GET /api/tournaments/:year
 */
export const getTournamentByYear = async (req, res) => {
  const { year } = req.params;
  try {
    // 1. Find the tournament by year
    const t = await pool.query("SELECT * FROM tournaments WHERE year = $1", [
      year,
    ]);

    if (t.rows.length === 0) {
      return res.status(404).json({ error: "Tournament not found" });
    }

    const tournament = t.rows[0];

    // 2. Get all teams that participated in that tournament
    const teams = await pool.query(
      `
      SELECT t.*, tt.finish_position, tt.wins, tt.losses
      FROM teams t
      JOIN tournament_teams tt ON t.id = tt.team_id
      WHERE tt.tournament_id = $1
      ORDER BY tt.finish_position
    `,
      [tournament.id]
    );

    // 3. Send the combined response
    res.json({ tournament: tournament, teams: teams.rows });
  } catch (err) {
    console.error("Error fetching tournament:", err);
    res.status(500).json({ error: "Failed to fetch tournament" });
  }
};
