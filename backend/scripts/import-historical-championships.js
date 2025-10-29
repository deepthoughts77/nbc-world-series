import { pool } from "../src/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function importHistoricalChampionships() {
  const client = await pool.connect();

  try {
    console.log("\n IMPORTING HISTORICAL CHAMPIONSHIP DATA\n");
    console.log("═".repeat(60));

    // Read CSV file
    const csvPath = path.join(__dirname, "../data/championships-1935-2023.csv");
    const csvContent = fs.readFileSync(csvPath, "utf-8");
    const lines = csvContent.split("\n").slice(1); // Skip header

    let added = 0;
    let skipped = 0;
    let errors = 0;

    await client.query("BEGIN");

    for (const line of lines) {
      if (!line.trim()) continue;

      const [year, champion, city, state, runner_up, score, mvp] = line
        .split(",")
        .map((s) => s.trim());

      if (!year || !champion) continue;

      // Skip 2020 (cancelled) and 2024 (already have it)
      if (year === "2020" || year === "2024") {
        skipped++;
        continue;
      }

      try {
        // Get or create champion team
        let championTeamId;
        const teamCheck = await client.query(
          "SELECT id FROM teams WHERE name = $1",
          [champion]
        );

        if (teamCheck.rows.length > 0) {
          championTeamId = teamCheck.rows[0].id;
        } else {
          const newTeam = await client.query(
            `INSERT INTO teams (name, city, state)
             VALUES ($1, $2, $3)
             RETURNING id`,
            [champion, city || null, state || null]
          );
          championTeamId = newTeam.rows[0].id;
          console.log(`   ➕ Created team: ${champion}`);
        }

        // Get or create runner-up team
        let runnerUpTeamId = null;
        if (runner_up) {
          const runnerCheck = await client.query(
            "SELECT id FROM teams WHERE name = $1",
            [runner_up]
          );

          if (runnerCheck.rows.length > 0) {
            runnerUpTeamId = runnerCheck.rows[0].id;
          } else {
            const newRunner = await client.query(
              `INSERT INTO teams (name)
               VALUES ($1)
               RETURNING id`,
              [runner_up]
            );
            runnerUpTeamId = newRunner.rows[0].id;
            console.log(`   ➕ Created team: ${runner_up}`);
          }
        }

        // Insert championship
        await client.query(
          `INSERT INTO championships (year, champion_team_id, runner_up_team_id, championship_score)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (year) DO NOTHING`,
          [parseInt(year), championTeamId, runnerUpTeamId, score || null]
        );

        console.log(` ${year}: ${champion}`);
        added++;
      } catch (err) {
        console.error(` Error processing ${year}: ${err.message}`);
        errors++;
      }
    }

    await client.query("COMMIT");

    console.log("\n" + "═".repeat(60));
    console.log(" IMPORT SUMMARY:");
    console.log(`    Added: ${added} championships`);
    console.log(`   ⏭  Skipped: ${skipped} records`);
    console.log(`    Errors: ${errors} records`);
    console.log("═".repeat(60) + "\n");

    // Show statistics
    const stats = await client.query(`
      SELECT 
        COUNT(*) as total_championships,
        MIN(year) as first_year,
        MAX(year) as latest_year
      FROM championships
    `);

    console.log(" DATABASE STATISTICS:");
    console.log(`   Total Championships: ${stats.rows[0].total_championships}`);
    console.log(
      `   Years Covered: ${stats.rows[0].first_year} - ${stats.rows[0].latest_year}`
    );
    console.log("");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(" IMPORT FAILED:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the import
importHistoricalChampionships()
  .then(() => {
    console.log(" Import completed successfully!\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error(" Import failed!\n");
    process.exit(1);
  });
