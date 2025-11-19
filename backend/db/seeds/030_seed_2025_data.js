import { pool } from "../../src/db.js";

export async function run() {
  const client = await pool.connect();

  try {
    console.log("\n IMPORTING COMPLETE 2025 NBC WORLD SERIES DATA\n");
    console.log("═".repeat(70));

    await client.query("BEGIN");

    // ============================================
    // 1. IMPORT ALL 2025 TEAMS
    // ============================================
    console.log("\n STEP 1: Importing 2025 Teams...\n");

    const teams2025 = [
      {
        name: "Hutchinson Monarchs",
        city: "Hutchinson",
        state: "KS",
        league: "NBC",
        finish: 1,
      },
      {
        name: "Lonestar Kraken TX",
        city: "Conroe",
        state: "TX",
        league: "NBC",
        finish: 2,
      },
      {
        name: "Hays Larks",
        city: "Hays",
        state: "KS",
        league: "NBC",
        finish: 3,
      },
      {
        name: "Santa Barbara Foresters",
        city: "Santa Barbara",
        state: "CA",
        league: "NBC",
        finish: 5,
      },
      {
        name: "Seattle Studs",
        city: "Seattle",
        state: "WA",
        league: "NBC",
        finish: 5,
      },
      {
        name: "Derby Twins",
        city: "Derby",
        state: "KS",
        league: "NBC",
        finish: 7,
      },
      {
        name: "San Diego Stars",
        city: "San Diego",
        state: "CA",
        league: "NBC",
        finish: 9,
      },
      {
        name: "Dallas Lonestar Kraken",
        city: "Dallas",
        state: "TX",
        league: "NBC",
        finish: 9,
      },
      {
        name: "Alaska Goldpanners",
        city: "Fairbanks",
        state: "AK",
        league: "NBC",
        finish: 9,
      },
      {
        name: "BTL Hornets",
        city: "Wichita",
        state: "KS",
        league: "NBC",
        finish: 9,
      },
      {
        name: "Kansas Cannons",
        city: "Wichita",
        state: "KS",
        league: "NBC",
        finish: 13,
      },
      {
        name: "Top Prospect Academy TX",
        city: "Grapevine",
        state: "TX",
        league: "NBC",
        finish: 17,
      },
      {
        name: "GPS TX Legends",
        city: "Dallas",
        state: "TX",
        league: "NBC",
        finish: 17,
      },
      {
        name: "MVP Oklahoma",
        city: "Oklahoma City",
        state: "OK",
        league: "NBC",
        finish: 17,
      },
    ];

    const teamIdMap = {};

    for (const team of teams2025) {
      const existing = await client.query(
        "SELECT id FROM teams WHERE name = $1",
        [team.name]
      );

      if (existing.rows.length > 0) {
        teamIdMap[team.name] = existing.rows[0].id;
        console.log(`   Found: ${team.name}`);
      } else {
        const result = await client.query(
          `INSERT INTO teams (name, city, state, league)
           VALUES ($1, $2, $3, $4)
           RETURNING id`,
          [team.name, team.city, team.state, team.league]
        );
        teamIdMap[team.name] = result.rows[0].id;
        console.log(`   Created: ${team.name}`);
      }
    }

    // ============================================
    // 2. CREATE/UPDATE 2025 CHAMPIONSHIP
    // ============================================
    console.log("\n STEP 2: Creating 2025 Championship Record...\n");

    const hutchinsonId = teamIdMap["Hutchinson Monarchs"];
    const krakenId = teamIdMap["Lonestar Kraken TX"];

    // MVP Jake Gutierrez
    let mvpId = null;
    const gutierrezCheck = await client.query(
      "SELECT id FROM players WHERE first_name = $1 AND last_name = $2",
      ["Jake", "Gutierrez"]
    );

    if (gutierrezCheck.rows.length > 0) {
      mvpId = gutierrezCheck.rows[0].id;
      console.log("   Found MVP: Jake Gutierrez");
    } else {
      const newPlayer = await client.query(
        `INSERT INTO players (first_name, last_name, team_id)
         VALUES ($1, $2, $3)
         RETURNING id`,
        ["Jake", "Gutierrez", hutchinsonId]
      );
      mvpId = newPlayer.rows[0].id;
      console.log("   Created MVP: Jake Gutierrez");
    }

    const champCheck = await client.query(
      "SELECT id FROM championships WHERE year = $1",
      [2025]
    );

    if (champCheck.rows.length > 0) {
      await client.query(
        `UPDATE championships 
         SET champion_team_id = $1,
             runner_up_team_id = $2,
             championship_score = $3,
             mvp_player_id = $4
         WHERE year = $5`,
        [hutchinsonId, krakenId, "21-4", mvpId, 2025]
      );
      console.log("   Updated 2025 Championship");
    } else {
      await client.query(
        `INSERT INTO championships (year, champion_team_id, runner_up_team_id, championship_score, mvp_player_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [2025, hutchinsonId, krakenId, "21-4", mvpId]
      );
      console.log("   Created 2025 Championship");
    }

    // ============================================
    // 3. IMPORT KEY 2025 PLAYERS
    // ============================================
    console.log("\n STEP 3: Importing Key 2025 Players...\n");

    const keyPlayers2025 = [
      {
        firstName: "Blake",
        lastName: "Bradford",
        team: "Hutchinson Monarchs",
        position: "P",
      },
      {
        firstName: "Matthew",
        lastName: "Pinal",
        team: "Alaska Goldpanners",
        position: "OF",
      },
      {
        firstName: "Lane",
        lastName: "Haworth",
        team: "Kansas Cannons",
        position: "IF",
      },
      {
        firstName: "Andre",
        lastName: "Jackson",
        team: "Lonestar Kraken TX",
        position: "OF",
      },
      {
        firstName: "Bailey",
        lastName: "Viscardi",
        team: "San Diego Stars",
        position: "P",
      },
    ];

    for (const player of keyPlayers2025) {
      const teamId = teamIdMap[player.team];

      const existing = await client.query(
        "SELECT id FROM players WHERE first_name = $1 AND last_name = $2",
        [player.firstName, player.lastName]
      );

      if (existing.rows.length === 0) {
        await client.query(
          `INSERT INTO players (first_name, last_name, team_id, position)
           VALUES ($1, $2, $3, $4)`,
          [player.firstName, player.lastName, teamId, player.position]
        );
        console.log(`   Created: ${player.firstName} ${player.lastName}`);
      } else {
        console.log(`   Found: ${player.firstName} ${player.lastName}`);
      }
    }

    // ============================================
    // 4. ADD 2025 TOURNAMENT RECORDS (LOG ONLY)
    // ============================================
    console.log("\n STEP 4: Recording 2025 Tournament Statistics...\n");

    const records2025 = {
      team_batting: {
        most_sacrifice_flies: { team: "Lonestar Kraken TX", value: 7 },
        fewest_stolen_base_attempts: { team: "San Diego Stars", value: 0 },
        lowest_fielding_pct: {
          team: "Top Prospect Academy TX",
          value: 0.895,
        },
        highest_era: { team: "Top Prospect Academy TX", value: 10.45 },
      },
      team_pitching: {
        most_hit_batters: { team: "San Diego Stars", value: 17 },
        most_balks: { team: "Lonestar Kraken TX", value: 3 },
      },
      team_fielding: {
        fewest_errors: { team: "BTL Hornets", value: 0, games: 3 },
        perfect_fielding: { team: "BTL Hornets", value: 1.0, tc: 141 },
        fewest_double_plays: { team: "MVP Oklahoma", value: 0, games: 3 },
      },
      individual: {
        most_hits_game: {
          player: "Matthew Pinal",
          team: "Alaska Goldpanners",
          value: 5,
        },
        hit_by_pitch_game: {
          player: "Blake Bradford",
          team: "Hutchinson Monarchs",
          value: 3,
        },
        hit_batters_game: {
          player: "Bailey Viscardi",
          team: "San Diego Stars",
          value: 6,
        },
      },
    };

    console.log("   2025 Records documented");
    console.log(
      `     - Team records: ${
        Object.keys(records2025.team_batting).length +
        Object.keys(records2025.team_pitching).length +
        Object.keys(records2025.team_fielding).length
      }`
    );
    console.log(
      `     - Individual records: ${Object.keys(records2025.individual).length}`
    );

    // ============================================
    // RECENT CHAMPIONSHIPS
    // ============================================
    const recentChamps = await client.query(`
      SELECT 
        c.year,
        ct.name AS champion,
        rt.name AS runner_up,
        c.championship_score,
        p.first_name || ' ' || p.last_name AS mvp
      FROM championships c
      JOIN teams ct ON c.champion_team_id = ct.id
      LEFT JOIN teams rt ON c.runner_up_team_id = rt.id
      LEFT JOIN players p ON c.mvp_player_id = p.id
      WHERE c.year >= 2023
      ORDER BY c.year DESC
    `);

    await client.query("COMMIT");

    console.log("\n" + "═".repeat(70));
    console.log(" 2025 DATA IMPORT COMPLETE!\n");

    console.log(" IMPORT SUMMARY:\n");
    console.log(`   Teams imported: ${teams2025.length}`);
    console.log(`   Key players: ${keyPlayers2025.length}`);
    console.log("   Championship: 2025");
    console.log("   Champion: Hutchinson Monarchs");
    console.log("   Runner-up: Lonestar Kraken TX");
    console.log("   MVP: Jake Gutierrez");
    console.log("   Final Score: 21-4\n");

    console.log(" RECENT CHAMPIONSHIPS:\n");
    recentChamps.rows.forEach((row) => {
      console.log(
        `   ${row.year}: ${row.champion} defeated ${row.runner_up || "N/A"}`
      );
      console.log(
        `          Score: ${row.championship_score}  |  MVP: ${
          row.mvp || "N/A"
        }\n`
      );
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("\n IMPORT FAILED:", error);
    // Important: rethrow so run-seeds.js can log "Seed failed: 030..."
    throw error;
  } finally {
    client.release();
  }
}
