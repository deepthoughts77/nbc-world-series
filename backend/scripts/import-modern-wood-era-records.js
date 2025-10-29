import { pool } from "../src/db.js";

async function importModernWoodEraRecords() {
  const client = await pool.connect();

  try {
    console.log("\n IMPORTING MODERN WOOD ERA RECORDS (2000-2025)\n");
    console.log("═".repeat(70));

    await client.query("BEGIN");

    // Team Batting Records
    const teamBattingRecords = [
      {
        era: "modern_wood",
        category: "team_batting",
        subcategory: "highest_batting_average",
        record_type: "single_tournament",
        team_name: "San Diego CA Stars",
        year: 2010,
        value_numeric: 0.379,
        value_text: ".379",
        description: "6 games played",
      },
      {
        era: "modern_wood",
        category: "team_batting",
        subcategory: "most_runs_scored",
        record_type: "single_tournament",
        team_name: "Liberal KS",
        year: 2015,
        value_numeric: 89,
        value_text: "89",
        description: "11 games played",
      },
      {
        era: "modern_wood",
        category: "team_batting",
        subcategory: "most_hits",
        record_type: "single_tournament",
        team_name: "Liberal KS",
        year: 2015,
        value_numeric: 122,
        value_text: "122",
        description: "11 games played",
      },
      {
        era: "modern_wood",
        category: "team_batting",
        subcategory: "most_home_runs",
        record_type: "single_tournament",
        team_name: "Santa Barbara CA Foresters",
        year: 2010,
        value_numeric: 11,
        value_text: "11",
        description: "7 games played",
      },
    ];

    console.log(" Importing Team Batting Records...\n");
    for (const record of teamBattingRecords) {
      await client.query(
        `
        INSERT INTO alltime_records 
        (era, category, subcategory, record_type, team_name, year, value_numeric, value_text, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (era, category, subcategory, record_type) DO UPDATE
        SET team_name = EXCLUDED.team_name,
            year = EXCLUDED.year,
            value_numeric = EXCLUDED.value_numeric,
            value_text = EXCLUDED.value_text,
            description = EXCLUDED.description
      `,
        [
          record.era,
          record.category,
          record.subcategory,
          record.record_type,
          record.team_name,
          record.year,
          record.value_numeric,
          record.value_text,
          record.description,
        ]
      );
      console.log(
        `   ${record.subcategory}: ${record.team_name} (${record.year})`
      );
    }

    // Individual Batting Records
    const individualBattingRecords = [
      {
        era: "modern_wood",
        category: "individual_batting",
        subcategory: "highest_batting_average",
        record_type: "single_tournament",
        player_name: "Grant Nottlemann",
        team_name: "Great Bend KS Bat Cats",
        year: 2023,
        value_numeric: 0.75,
        value_text: ".750",
        description: "5 GP, 12 H, 16 AB",
      },
      {
        era: "modern_wood",
        category: "individual_batting",
        subcategory: "most_hits",
        record_type: "single_tournament",
        player_name: "Gavin Wehby",
        team_name: "Liberal KS",
        year: 2015,
        value_numeric: 19,
        value_text: "19",
        description: "11 games played",
      },
      {
        era: "modern_wood",
        category: "individual_batting",
        subcategory: "most_rbis",
        record_type: "single_tournament",
        player_name: "Gunnar Glad",
        team_name: "Anchorage AK Glacier Pilots",
        year: 2009,
        value_numeric: 17,
        value_text: "17",
        description: "9 games played",
      },
      {
        era: "modern_wood",
        category: "individual_batting",
        subcategory: "most_home_runs",
        record_type: "single_tournament",
        player_name: "Nolan Reimold",
        team_name: "Hays KS Larks",
        year: 2004,
        value_numeric: 4,
        value_text: "4",
        description: "Tournament record",
      },
    ];

    console.log("\n Importing Individual Batting Records...\n");
    for (const record of individualBattingRecords) {
      await client.query(
        `
        INSERT INTO alltime_records 
        (era, category, subcategory, record_type, player_name, team_name, year, value_numeric, value_text, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (era, category, subcategory, record_type) DO UPDATE
        SET player_name = EXCLUDED.player_name,
            team_name = EXCLUDED.team_name,
            year = EXCLUDED.year,
            value_numeric = EXCLUDED.value_numeric,
            value_text = EXCLUDED.value_text,
            description = EXCLUDED.description
      `,
        [
          record.era,
          record.category,
          record.subcategory,
          record.record_type,
          record.player_name,
          record.team_name,
          record.year,
          record.value_numeric,
          record.value_text,
          record.description,
        ]
      );
      console.log(
        `   ${record.subcategory}: ${record.player_name} (${record.year})`
      );
    }

    // Pitching Records
    const pitchingRecords = [
      {
        era: "modern_wood",
        category: "individual_pitching",
        subcategory: "most_strikeouts",
        record_type: "single_tournament",
        player_name: "Tommy Hanson",
        team_name: "Aloha OR Knights",
        year: 2005,
        value_numeric: 27,
        value_text: "27",
        description: "Tournament record",
      },
      {
        era: "modern_wood",
        category: "team_pitching",
        subcategory: "lowest_era",
        record_type: "single_tournament",
        team_name: "San Diego CA Force",
        year: 2012,
        value_numeric: 0.96,
        value_text: "0.96",
        description: "4 games played",
      },
    ];

    console.log("\n Importing Pitching Records...\n");
    for (const record of pitchingRecords) {
      await client.query(
        `
        INSERT INTO alltime_records 
        (era, category, subcategory, record_type, player_name, team_name, year, value_numeric, value_text, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (era, category, subcategory, record_type) DO UPDATE
        SET player_name = EXCLUDED.player_name,
            team_name = EXCLUDED.team_name,
            year = EXCLUDED.year,
            value_numeric = EXCLUDED.value_numeric,
            value_text = EXCLUDED.value_text,
            description = EXCLUDED.description
      `,
        [
          record.era,
          record.category,
          record.subcategory,
          record.record_type,
          record.player_name,
          record.team_name,
          record.year,
          record.value_numeric,
          record.value_text,
          record.description,
        ]
      );
      console.log(
        `   ${record.subcategory}: ${record.player_name || record.team_name} (${
          record.year
        })`
      );
    }

    await client.query("COMMIT");

    console.log("\n" + "═".repeat(70));
    console.log(" MODERN WOOD ERA RECORDS IMPORT COMPLETE!\n");

    // Summary
    const count = await client.query("SELECT COUNT(*) FROM alltime_records");
    console.log(` Total records in database: ${count.rows[0].count}\n`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(" RECORDS IMPORT FAILED:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

importModernWoodEraRecords()
  .then(() => {
    console.log(" Records import completed!\n");
    process.exit(0);
  })
  .catch(() => {
    console.error(" Records import failed!\n");
    process.exit(1);
  });
