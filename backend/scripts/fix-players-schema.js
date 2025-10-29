import { pool } from "../src/db.js";

async function fixPlayersSchema() {
  const client = await pool.connect();

  try {
    console.log("\n FIXING PLAYERS TABLE SCHEMA\n");
    console.log("═".repeat(60));

    await client.query("BEGIN");

    // Check current players table structure
    const currentSchema = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'players'
      ORDER BY ordinal_position
    `);

    console.log("\n Current players table columns:");
    currentSchema.rows.forEach((col) => {
      console.log(`   - ${col.column_name} (${col.data_type})`);
    });

    // Add team_id column if it doesn't exist
    const hasTeamId = currentSchema.rows.some(
      (col) => col.column_name === "team_id"
    );

    if (!hasTeamId) {
      console.log("\n Adding team_id column...");

      await client.query(`
        ALTER TABLE players 
        ADD COLUMN team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL
      `);

      console.log("    Added team_id column");
    } else {
      console.log("\n team_id column already exists");
    }

    // Add position column if it doesn't exist
    const hasPosition = currentSchema.rows.some(
      (col) => col.column_name === "position"
    );

    if (!hasPosition) {
      console.log("\n Adding position column...");

      await client.query(`
        ALTER TABLE players 
        ADD COLUMN position VARCHAR(10)
      `);

      console.log("    Added position column");
    } else {
      console.log(" position column already exists");
    }

    await client.query("COMMIT");

    // Show updated schema
    const updatedSchema = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'players'
      ORDER BY ordinal_position
    `);

    console.log("\n Updated players table schema:");
    updatedSchema.rows.forEach((col) => {
      console.log(
        `   - ${col.column_name} (${col.data_type}) ${
          col.is_nullable === "YES" ? "NULL" : "NOT NULL"
        }`
      );
    });

    console.log("\n" + "═".repeat(60));
    console.log(" SCHEMA FIX COMPLETE!\n");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("\n SCHEMA FIX FAILED:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the fix
fixPlayersSchema()
  .then(() => {
    console.log(" Schema update completed successfully!\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error(" Schema update failed!\n");
    process.exit(1);
  });
