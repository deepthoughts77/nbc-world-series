import fs from "fs";
import { parse } from "csv-parse/sync";
import { pool } from "../src/db.js";

async function importFromCSV() {
  const client = await pool.connect();

  try {
    console.log("\n IMPORTING CHAMPIONSHIPS FROM CSV\n");
    console.log("═".repeat(70));

    await client.query("BEGIN");

    // Read CSV file
    const csvContent = fs.readFileSync("./data/championships.csv", "utf-8");
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    console.log(` Found ${records.length} championship records\n`);

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    for (const record of records) {
      try {
        console.log(`\n Processing ${record.year}...`);

        // Get or create champion team
        let championTeam = await client.query(
          "SELECT id FROM teams WHERE name = $1",
          [record.champion]
        );

        if (championTeam.rows.length === 0) {
          championTeam = await client.query(
            "INSERT INTO teams (name, city, state, league) VALUES ($1, $2, $3, $4) RETURNING id",
            [
              record.champion,
              record.champion_city,
              record.champion_state,
              "NBC",
            ]
          );
          console.log(`   Created team: ${record.champion}`);
        }

        const championId = championTeam.rows[0].id;

        // Get or create runner-up team
        let runnerUpId = null;
        if (record.runner_up && record.runner_up !== "") {
          let runnerUpTeam = await client.query(
            "SELECT id FROM teams WHERE name = $1",
            [record.runner_up]
          );

          if (runnerUpTeam.rows.length === 0) {
            runnerUpTeam = await client.query(
              "INSERT INTO teams (name, city, state, league) VALUES ($1, $2, $3, $4) RETURNING id",
              [
                record.runner_up,
                record.runner_up_city || "",
                record.runner_up_state || "",
                "NBC",
              ]
            );
            console.log(`   Created team: ${record.runner_up}`);
          }

          runnerUpId = runnerUpTeam.rows[0].id;
        }

        // Get or create MVP
        let mvpId = null;
        if (record.mvp && record.mvp !== "") {
          const nameParts = record.mvp.trim().split(" ");
          const firstName = nameParts[0];
          const lastName = nameParts.slice(1).join(" ");

          let mvpPlayer = await client.query(
            "SELECT id FROM players WHERE first_name = $1 AND last_name = $2",
            [firstName, lastName]
          );

          if (mvpPlayer.rows.length === 0) {
            mvpPlayer = await client.query(
              "INSERT INTO players (first_name, last_name, team_id) VALUES ($1, $2, $3) RETURNING id",
              [firstName, lastName, championId]
            );
            console.log(`   Created player: ${record.mvp}`);
          }

          mvpId = mvpPlayer.rows[0].id;
        }

        // Check if championship exists
        const existing = await client.query(
          "SELECT id FROM championships WHERE year = $1",
          [record.year]
        );

        if (existing.rows.length > 0) {
          // Update
          await client.query(
            `UPDATE championships 
             SET champion_team_id = $1, 
                 runner_up_team_id = $2, 
                 championship_score = $3, 
                 mvp_player_id = $4
             WHERE year = $5`,
            [championId, runnerUpId, record.score || null, mvpId, record.year]
          );
          console.log(`   Updated: ${record.year} - ${record.champion}`);
          updated++;
        } else {
          // Insert
          await client.query(
            `INSERT INTO championships (year, champion_team_id, runner_up_team_id, championship_score, mvp_player_id)
             VALUES ($1, $2, $3, $4, $5)`,
            [record.year, championId, runnerUpId, record.score || null, mvpId]
          );
          console.log(`   Imported: ${record.year} - ${record.champion}`);
          imported++;
        }
      } catch (err) {
        console.error(`   Error with ${record.year}:`, err.message);
        skipped++;
      }
    }

    await client.query("COMMIT");

    console.log("\n" + "═".repeat(70));
    console.log(" IMPORT SUMMARY:");
    console.log(`    Imported: ${imported}`);
    console.log(`    Updated: ${updated}`);
    console.log(`   ⏭  Skipped: ${skipped}`);
    console.log(`    Total: ${records.length}\n`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(" Import failed:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

importFromCSV()
  .then(() => {
    console.log(" CSV import completed!\n");
    process.exit(0);
  })
  .catch(() => {
    console.error(" CSV import failed!\n");
    process.exit(1);
  });
