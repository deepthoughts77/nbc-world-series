import fs from "fs";
import { pool } from "../src/db.js";

async function importScrapedMVPs() {
  const client = await pool.connect();

  try {
    console.log("\n IMPORTING MVP DATA FROM WEB SCRAPE\n");
    console.log("═".repeat(70));

    await client.query("BEGIN");

    // Read the scraped data
    const scrapedData = JSON.parse(
      fs.readFileSync("./data/scraped-champions.json", "utf-8")
    );

    console.log(` Found ${scrapedData.length} records from scrape\n`);

    // Filter to only MVP records (year column is 4 digits)
    const mvpRecords = scrapedData.filter(
      (record) => record.year && record.year.match(/^\d{4}$/) && record.champion
    );

    console.log(` Processing ${mvpRecords.length} MVP records...\n`);

    let updated = 0;
    let created = 0;
    let skipped = 0;

    for (const record of mvpRecords) {
      try {
        const year = parseInt(record.year);
        const mvpName = record.champion.trim();
        const teamName = record.runnerUp ? record.runnerUp.trim() : null;

        // Skip if no MVP name
        if (!mvpName || mvpName === "MVP" || mvpName === "Year") {
          skipped++;
          continue;
        }

        console.log(` ${year}: ${mvpName}${teamName ? ` (${teamName})` : ""}`);

        // Split MVP name into first and last
        const nameParts = mvpName.split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ");

        if (!firstName || !lastName) {
          console.log(`   ⏭  Skipped: Invalid name format`);
          skipped++;
          continue;
        }

        // Find or create the player
        let player = await client.query(
          "SELECT id FROM players WHERE first_name = $1 AND last_name = $2",
          [firstName, lastName]
        );

        let playerId;
        if (player.rows.length === 0) {
          // Create player
          player = await client.query(
            "INSERT INTO players (first_name, last_name) VALUES ($1, $2) RETURNING id",
            [firstName, lastName]
          );
          playerId = player.rows[0].id;
          console.log(`    Created player: ${mvpName}`);
          created++;
        } else {
          playerId = player.rows[0].id;
        }

        // Update championship with MVP
        const championship = await client.query(
          "SELECT id, mvp_player_id FROM championships WHERE year = $1",
          [year]
        );

        if (championship.rows.length > 0) {
          if (!championship.rows[0].mvp_player_id) {
            await client.query(
              "UPDATE championships SET mvp_player_id = $1 WHERE year = $2",
              [playerId, year]
            );
            console.log(`    Updated championship with MVP`);
            updated++;
          } else {
            console.log(`     MVP already set for ${year}`);
          }
        } else {
          console.log(`     No championship record for ${year}`);
          skipped++;
        }
      } catch (err) {
        console.error(`    Error processing ${record.year}:`, err.message);
        skipped++;
      }
    }

    await client.query("COMMIT");

    console.log("\n" + "═".repeat(70));
    console.log(" IMPORT SUMMARY:");
    console.log(`    Championships updated: ${updated}`);
    console.log(`    Players created: ${created}`);
    console.log(`   ⏭  Skipped: ${skipped}`);
    console.log(`    Total processed: ${mvpRecords.length}\n`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(" Import failed:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

importScrapedMVPs()
  .then(() => {
    console.log(" MVP import completed!\n");
    process.exit(0);
  })
  .catch(() => {
    console.error(" MVP import failed!\n");
    process.exit(1);
  });
