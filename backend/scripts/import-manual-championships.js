import fs from "fs";
import { parse } from "csv-parse/sync";
import { pool } from "../src/db.js";

async function importManualChampionships() {
  const client = await pool.connect();

  try {
    console.log("\n IMPORTING MANUAL CHAMPIONSHIP DATA\n");
    console.log("═".repeat(70));

    await client.query("BEGIN");

    // Read CSV
    const csvPath = "./data/manual-championships.csv";
    if (!fs.existsSync(csvPath)) {
      console.log(" File not found: data/manual-championships.csv");
      console.log("   Create this file first!\n");
      return;
    }

    const csvContent = fs.readFileSync(csvPath, "utf-8");
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
      const { year, champion, runner_up, championship_score, mvp } = record;

      if (!year || !champion) {
        skipped++;
        continue;
      }

      // Find or create champion team
      let championTeam = await client.query(
        "SELECT id FROM teams WHERE name = $1",
        [champion]
      );

      let championTeamId;
      if (championTeam.rows.length === 0) {
        // Extract city and state from team name
        const match = champion.match(
          /^(.+?)\s+(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)\s+(.+)$/
        );

        const city = match ? match[1] : null;
        const state = match ? match[2] : null;
        const teamName = match ? match[3] : champion;

        championTeam = await client.query(
          "INSERT INTO teams (name, city, state, league) VALUES ($1, $2, $3, $4) RETURNING id",
          [champion, city, state, "NBC"]
        );
        championTeamId = championTeam.rows[0].id;
      } else {
        championTeamId = championTeam.rows[0].id;
      }

      // Find or create runner-up team
      let runnerUpTeamId = null;
      if (runner_up) {
        let runnerUpTeam = await client.query(
          "SELECT id FROM teams WHERE name = $1",
          [runner_up]
        );

        if (runnerUpTeam.rows.length === 0) {
          const match = runner_up.match(
            /^(.+?)\s+(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)\s+(.+)$/
          );

          const city = match ? match[1] : null;
          const state = match ? match[2] : null;

          runnerUpTeam = await client.query(
            "INSERT INTO teams (name, city, state, league) VALUES ($1, $2, $3, $4) RETURNING id",
            [runner_up, city, state, "NBC"]
          );
          runnerUpTeamId = runnerUpTeam.rows[0].id;
        } else {
          runnerUpTeamId = runnerUpTeam.rows[0].id;
        }
      }

      // Find or create MVP player
      let mvpPlayerId = null;
      if (mvp) {
        const nameParts = mvp.trim().split(" ");
        if (nameParts.length >= 2) {
          const firstName = nameParts[0];
          const lastName = nameParts.slice(1).join(" ");

          let player = await client.query(
            "SELECT id FROM players WHERE first_name = $1 AND last_name = $2",
            [firstName, lastName]
          );

          if (player.rows.length === 0) {
            player = await client.query(
              "INSERT INTO players (first_name, last_name) VALUES ($1, $2) RETURNING id",
              [firstName, lastName]
            );
          }
          mvpPlayerId = player.rows[0].id;
        }
      }

      // Check if championship exists
      const existing = await client.query(
        "SELECT id FROM championships WHERE year = $1",
        [year]
      );

      if (existing.rows.length > 0) {
        // Update existing
        await client.query(
          `UPDATE championships 
           SET champion_team_id = $1, 
               runner_up_team_id = $2, 
               championship_score = $3, 
               mvp_player_id = $4
           WHERE year = $5`,
          [
            championTeamId,
            runnerUpTeamId,
            championship_score || null,
            mvpPlayerId,
            year,
          ]
        );
        updated++;
      } else {
        // Insert new
        await client.query(
          `INSERT INTO championships (year, champion_team_id, runner_up_team_id, championship_score, mvp_player_id)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            year,
            championTeamId,
            runnerUpTeamId,
            championship_score || null,
            mvpPlayerId,
          ]
        );
        imported++;
      }

      if ((imported + updated) % 10 === 0) {
        console.log(`   Processed ${imported + updated} records...`);
      }
    }

    await client.query("COMMIT");

    console.log("\n" + "═".repeat(70));
    console.log(" IMPORT SUMMARY:");
    console.log(`   New championships: ${imported}`);
    console.log(`   Updated championships: ${updated}`);
    console.log(`   Skipped: ${skipped}`);
    console.log("\n Import completed!\n");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(" Import failed:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

importManualChampionships()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
