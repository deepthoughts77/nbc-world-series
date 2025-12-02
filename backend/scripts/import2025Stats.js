// backend/scripts/import2025Stats.js
import { pool } from "../src/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const YEAR = 2025;

function makeSeasonKey(teamName, playerName) {
  return `${YEAR}_${teamName}_${playerName}`
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

async function import2025Stats() {
  const client = await pool.connect();

  try {
    console.log("🚀 Starting 2025 NBC World Series data import...\n");

    // Read JSON file
    const jsonPath = path.join(__dirname, "../data/nbc_2025_stats.json");
    console.log(`📂 Reading file: ${jsonPath}`);

    if (!fs.existsSync(jsonPath)) {
      throw new Error(`JSON file not found at: ${jsonPath}`);
    }

    const rawData = fs.readFileSync(jsonPath, "utf8");
    const data = JSON.parse(rawData);

    console.log(`✅ JSON loaded: ${data.teams.length} teams\n`);

    await client.query("BEGIN");

    let totalBatters = 0;
    let totalPitchers = 0;

    // Process each team
    for (const teamData of data.teams) {
      console.log(`\n📊 Processing: ${teamData.name}`);

      // 1. Get or create team
      let teamResult = await client.query(
        "SELECT id FROM teams WHERE name = $1",
        [teamData.name]
      );

      let teamId;
      if (teamResult.rows.length === 0) {
        const insertTeam = await client.query(
          "INSERT INTO teams (name, city, state) VALUES ($1, $2, $3) RETURNING id",
          [teamData.name, null, null]
        );
        teamId = insertTeam.rows[0].id;
        console.log(`  ✨ Created new team (ID: ${teamId})`);
      } else {
        teamId = teamResult.rows[0].id;
        console.log(`  ✓ Found existing team (ID: ${teamId})`);
      }

      // 2. Process batting stats
      for (const batter of teamData.batting) {
        // Split player name
        const nameParts = batter.player_name.trim().split(/\s+/);
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        // Get or create player
        let playerResult = await client.query(
          "SELECT id FROM players WHERE first_name = $1 AND last_name = $2",
          [firstName, lastName]
        );

        let playerId;
        if (playerResult.rows.length === 0) {
          const insertPlayer = await client.query(
            "INSERT INTO players (first_name, last_name) VALUES ($1, $2) RETURNING id",
            [firstName, lastName]
          );
          playerId = insertPlayer.rows[0].id;
        } else {
          playerId = playerResult.rows[0].id;
        }

        // Check if batting stats already exist
        const existingStats = await client.query(
          "SELECT id FROM batting_stats WHERE player_id = $1 AND team_id = $2 AND year = $3",
          [playerId, teamId, YEAR]
        );

        if (existingStats.rows.length > 0) {
          console.log(
            `  ⚠️  Skipping duplicate batting stats for ${batter.player_name}`
          );
          continue;
        }

        const seasonKey = makeSeasonKey(teamData.name, batter.player_name);

        // Insert batting stats with all fields INCLUDING season_key
        await client.query(
          `
  INSERT INTO batting_stats (
    player_id, team_id, year, season_key, jersey_num, position,
    gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg,
    bb, hbp, so, gdp, obp, sf, sh, sb, att, avg,
    po, a, e, fld
  ) VALUES (
    $1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
    $17, $18, $19, $20, $21, $22, $23, $24, $25, $26,
    $27, $28, $29, $30, $31
  )
          `,
          [
            playerId,
            teamId,
            YEAR,
            seasonKey,
            batter.jersey_num,
            batter.position || null,
            batter.gp,
            batter.gs,
            batter.ab,
            batter.r,
            batter.h,
            batter["2b"],
            batter["3b"],
            batter.hr,
            batter.rbi,
            batter.tb,
            batter.slg,
            batter.bb,
            batter.hbp,
            batter.so,
            batter.gdp,
            batter.obp,
            batter.sf,
            batter.sh,
            batter.sb,
            batter.att,
            batter.avg,
            batter.po,
            batter.a,
            batter.e,
            batter.fld,
          ]
        );
        totalBatters++;
      }

      console.log(`  ✅ Imported ${teamData.batting.length} batters`);

      // 3. Process pitching stats
      for (const pitcher of teamData.pitching) {
        // Split player name
        const nameParts = pitcher.player_name.trim().split(/\s+/);
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        // Get or create player
        let playerResult = await client.query(
          "SELECT id FROM players WHERE first_name = $1 AND last_name = $2",
          [firstName, lastName]
        );

        let playerId;
        if (playerResult.rows.length === 0) {
          const insertPlayer = await client.query(
            "INSERT INTO players (first_name, last_name) VALUES ($1, $2) RETURNING id",
            [firstName, lastName]
          );
          playerId = insertPlayer.rows[0].id;
        } else {
          playerId = playerResult.rows[0].id;
        }

        // Check if pitching stats already exist
        const existingStats = await client.query(
          "SELECT id FROM pitching_stats WHERE player_id = $1 AND team_id = $2 AND year = $3",
          [playerId, teamId, YEAR]
        );

        if (existingStats.rows.length > 0) {
          console.log(
            `  ⚠️  Skipping duplicate pitching stats for ${pitcher.player_name}`
          );
          continue;
        }

        // Handle ERA (null for infinite ERA)
        const era = pitcher.era === null ? null : pitcher.era;
        const seasonKey = makeSeasonKey(teamData.name, pitcher.player_name);

        // Insert pitching stats with all fields INCLUDING season_key
        await client.query(
          `
  INSERT INTO pitching_stats (
    player_id, team_id, year, season_key, jersey_num, era,
    w, l, app, gs, cg, sho, cbo, sv, ip,
    h, r, er, bb, so, "2b", "3b", hr, ab, b_avg,
    wp, hbp, bk, sfa, sha
  ) VALUES (
    $1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10, $11, $12, $13, $14, $15,
    $16, $17, $18, $19, $20, $21, $22, $23, $24, $25,
    $26, $27, $28, $29, $30
  )
          `,
          [
            playerId,
            teamId,
            YEAR,
            seasonKey,
            pitcher.jersey_num,
            era,
            pitcher.w,
            pitcher.l,
            pitcher.app,
            pitcher.gs,
            pitcher.cg,
            pitcher.sho,
            pitcher.cbo,
            pitcher.sv,
            pitcher.ip,
            pitcher.h,
            pitcher.r,
            pitcher.er,
            pitcher.bb,
            pitcher.so,
            pitcher["2b"],
            pitcher["3b"],
            pitcher.hr,
            pitcher.ab,
            pitcher.b_avg,
            pitcher.wp,
            pitcher.hbp,
            pitcher.bk,
            pitcher.sfa,
            pitcher.sha,
          ]
        );
        totalPitchers++;
      }

      console.log(`  ✅ Imported ${teamData.pitching.length} pitchers`);
    }

    await client.query("COMMIT");

    console.log("\n" + "=".repeat(60));
    console.log("🎉 IMPORT COMPLETE!");
    console.log("=".repeat(60));
    console.log(`📊 Total Teams: ${data.teams.length}`);
    console.log(`⚾ Total Batters: ${totalBatters}`);
    console.log(`🥎 Total Pitchers: ${totalPitchers}`);
    console.log(`📈 Total Player Records: ${totalBatters + totalPitchers}`);
    console.log("=".repeat(60) + "\n");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("\n❌ ERROR during import:", error.message);
    console.error(error.stack);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the import
import2025Stats()
  .then(() => {
    console.log("✅ Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
