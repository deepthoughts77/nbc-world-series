import { pool } from "../src/db.js";

async function createRecordsTables() {
  const client = await pool.connect();

  try {
    console.log("\n CREATING RECORDS TABLES\n");
    console.log("═".repeat(60));

    await client.query("BEGIN");

    // Tournament Records Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tournament_records (
        id SERIAL PRIMARY KEY,
        year INTEGER NOT NULL,
        category VARCHAR(50) NOT NULL,
        subcategory VARCHAR(100) NOT NULL,
        record_type VARCHAR(50) NOT NULL,
        team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
        player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
        value_numeric DECIMAL(10,3),
        value_text VARCHAR(100),
        games_played INTEGER,
        description TEXT,
        source VARCHAR(50) DEFAULT 'official',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(year, category, subcategory, record_type)
      )
    `);
    console.log(" Created tournament_records table");

    // All-Time Records Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS alltime_records (
        id SERIAL PRIMARY KEY,
        era VARCHAR(50) NOT NULL,
        category VARCHAR(50) NOT NULL,
        subcategory VARCHAR(100) NOT NULL,
        record_type VARCHAR(50) NOT NULL,
        team_name VARCHAR(100),
        player_name VARCHAR(100),
        year INTEGER,
        value_numeric DECIMAL(10,3),
        value_text VARCHAR(100),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(era, category, subcategory, record_type)
      )
    `);
    console.log(" Created alltime_records table");

    // Single Game Records Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS single_game_records (
        id SERIAL PRIMARY KEY,
        year INTEGER NOT NULL,
        date DATE,
        category VARCHAR(50) NOT NULL,
        stat_name VARCHAR(100) NOT NULL,
        team_name VARCHAR(100),
        player_name VARCHAR(100),
        opponent VARCHAR(100),
        value_numeric DECIMAL(10,3),
        value_text VARCHAR(100),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log(" Created single_game_records table");

    // Player Career Stats (for multi-tournament players)
    await client.query(`
      CREATE TABLE IF NOT EXISTS player_career_stats (
        id SERIAL PRIMARY KEY,
        player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
        tournaments_played INTEGER DEFAULT 0,
        total_games INTEGER DEFAULT 0,
        batting_avg DECIMAL(4,3),
        total_hits INTEGER,
        total_runs INTEGER,
        total_rbis INTEGER,
        total_home_runs INTEGER,
        total_stolen_bases INTEGER,
        pitching_wins INTEGER,
        pitching_losses INTEGER,
        pitching_era DECIMAL(4,2),
        pitching_strikeouts INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(player_id)
      )
    `);
    console.log(" Created player_career_stats table");

    await client.query("COMMIT");

    console.log("\n" + "═".repeat(60));
    console.log(" ALL RECORDS TABLES CREATED!\n");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(" TABLE CREATION FAILED:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

createRecordsTables()
  .then(() => {
    console.log(" Records tables setup complete!\n");
    process.exit(0);
  })
  .catch(() => {
    console.error(" Records tables setup failed!\n");
    process.exit(1);
  });
