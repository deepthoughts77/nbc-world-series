import { pool } from "../src/db.js";

async function import2025Championship() {
  const client = await pool.connect();

  try {
    console.log("\n IMPORTING 2025 NBC WORLD SERIES DATA\n");
    console.log("═".repeat(60));

    await client.query("BEGIN");

    // 1. Get or create Hutchinson Monarchs
    let hutchinsonId;
    const hutchCheck = await client.query(
      "SELECT id FROM teams WHERE name = $1",
      ["Hutchinson Monarchs"]
    );

    if (hutchCheck.rows.length > 0) {
      hutchinsonId = hutchCheck.rows[0].id;
      console.log(" Found existing team: Hutchinson Monarchs");
    } else {
      const newTeam = await client.query(
        `INSERT INTO teams (name, city, state, league)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        ["Hutchinson Monarchs", "Hutchinson", "KS", "NBC"]
      );
      hutchinsonId = newTeam.rows[0].id;
      console.log(" Created team: Hutchinson Monarchs");
    }

    // 2. Get or create Lonestar Kraken TX
    let krakenId;
    const krakenCheck = await client.query(
      "SELECT id FROM teams WHERE name = $1",
      ["Lonestar Kraken TX"]
    );

    if (krakenCheck.rows.length > 0) {
      krakenId = krakenCheck.rows[0].id;
      console.log(" Found existing team: Lonestar Kraken TX");
    } else {
      const newTeam = await client.query(
        `INSERT INTO teams (name, city, state, league)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        ["Lonestar Kraken TX", "Lonestar", "TX", "NBC"]
      );
      krakenId = newTeam.rows[0].id;
      console.log(" Created team: Lonestar Kraken TX");
    }

    // 3. Create or get Jake Gutierrez (likely MVP based on stats)
    let mvpId = null;
    const gutierrezCheck = await client.query(
      "SELECT id FROM players WHERE first_name = $1 AND last_name = $2",
      ["Jake", "Gutierrez"]
    );

    if (gutierrezCheck.rows.length > 0) {
      mvpId = gutierrezCheck.rows[0].id;
      console.log(" Found existing player: Jake Gutierrez");
    } else {
      const newPlayer = await client.query(
        `INSERT INTO players (first_name, last_name, team_id)
         VALUES ($1, $2, $3)
         RETURNING id`,
        ["Jake", "Gutierrez", hutchinsonId]
      );
      mvpId = newPlayer.rows[0].id;
      console.log(" Created player: Jake Gutierrez");
    }

    // 4. Check if 2025 championship already exists
    const existingCheck = await client.query(
      "SELECT id FROM championships WHERE year = $1",
      [2025]
    );

    if (existingCheck.rows.length > 0) {
      console.log("  2025 championship already exists. Updating...");
      await client.query(
        `UPDATE championships 
         SET champion_team_id = $1,
             runner_up_team_id = $2,
             championship_score = $3,
             mvp_player_id = $4
         WHERE year = $5`,
        [hutchinsonId, krakenId, "21-4", mvpId, 2025]
      );
      console.log(" Updated 2025 championship");
    } else {
      // Insert 2025 championship
      await client.query(
        `INSERT INTO championships (year, champion_team_id, runner_up_team_id, championship_score, mvp_player_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [2025, hutchinsonId, krakenId, "21-4", mvpId]
      );
      console.log(" Inserted 2025 championship");
    }

    await client.query("COMMIT");

    console.log("\n" + "═".repeat(60));
    console.log(" IMPORT COMPLETE");
    console.log("═".repeat(60));

    // Show current championship data
    const result = await client.query(`
      SELECT 
        c.year,
        ct.name as champion,
        rt.name as runner_up,
        c.championship_score,
        p.first_name || ' ' || p.last_name as mvp
      FROM championships c
      JOIN teams ct ON c.champion_team_id = ct.id
      LEFT JOIN teams rt ON c.runner_up_team_id = rt.id
      LEFT JOIN players p ON c.mvp_player_id = p.id
      WHERE c.year >= 2023
      ORDER BY c.year DESC
    `);

    console.log("\n RECENT CHAMPIONSHIPS:");
    result.rows.forEach((row) => {
      console.log(
        `   ${row.year}: ${row.champion} defeated ${row.runner_up || "N/A"} (${
          row.championship_score
        })`
      );
      if (row.mvp) console.log(`         MVP: ${row.mvp}`);
    });
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
import2025Championship()
  .then(() => {
    console.log(" 2025 data import completed successfully!\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error(" Import failed!\n");
    process.exit(1);
  });
