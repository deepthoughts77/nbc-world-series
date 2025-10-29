import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// GET /api/records - Get all records
router.get("/", async (req, res) => {
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
    console.error("Error fetching records:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch records",
    });
  }
});

// GET /api/records/modern-wood-era
router.get("/modern-wood-era", async (req, res) => {
  try {
    const records = {
      team_batting: {
        highest_avg: {
          team: "San Diego Stars",
          value: ".379",
          year: 2010,
          games: 6,
        },
        most_runs_game: {
          team: "Great Bend KS Bat Cats",
          value: 24,
          opponent: "Hutchinson KS",
          year: 2019,
        },
        most_hits_tournament: {
          team: "Liberal KS",
          value: 122,
          games: 11,
          year: 2015,
        },
      },
      team_pitching: {
        lowest_era: {
          team: "San Diego Force",
          value: "0.96",
          games: 4,
          year: 2012,
        },
        most_strikeouts_game: { value: 24, games: 1, year: 2004 },
      },
      individual_batting: {
        highest_avg: {
          player: "Grant Nottlemann",
          team: "Great Bend KS Bat Cats",
          value: ".750",
          year: 2023,
        },
        most_hits_tournament: {
          player: "Gavin Wehby",
          team: "Liberal KS",
          value: 19,
          year: 2015,
        },
        most_rbis_tournament: {
          player: "Gunnar Glad",
          team: "Anchorage AK Glacier Pilots",
          value: 17,
          year: 2009,
        },
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
});

// GET /api/records/category/:category
router.get("/category/:category", async (req, res) => {
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
});

export default router;
