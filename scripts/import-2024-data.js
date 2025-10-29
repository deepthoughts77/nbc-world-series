// scripts/import-2024-data.js
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "..", "backend", ".env"),
});
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function import2024Data() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // Ensure we write to public schema
    await client.query(`SET search_path TO public, "$user"`);

    console.log("\n═══════════════════════════════════════════════════════");
    console.log("  2024 NBC WORLD SERIES - DATA IMPORT");
    console.log("═══════════════════════════════════════════════════════\n");

    // 1) Teams
    console.log(" Step 1/9: Upserting teams...");
    const teams = [
      {
        name: "Hutchinson Monarchs",
        city: "Hutchinson",
        state: "KS",
        league: "Jayhawk Collegiate League",
      },
      {
        name: "Lonestar Kraken TX",
        city: "Texas",
        state: "TX",
        league: "Texas Collegiate League",
      },
      {
        name: "Hays Larks",
        city: "Hays",
        state: "KS",
        league: "Rocky Mountain Collegiate League",
      },
      {
        name: "Seattle Studs",
        city: "Seattle",
        state: "WA",
        league: "Pacific International League",
      },
      {
        name: "Alaska Goldpanners",
        city: "Fairbanks",
        state: "AK",
        league: "Alaska Baseball League",
      },
      {
        name: "Santa Barbara Foresters",
        city: "Santa Barbara",
        state: "CA",
        league: "California Collegiate League",
      },
      {
        name: "Derby Twins",
        city: "Derby",
        state: "KS",
        league: "Kansas Collegiate League",
      },
      {
        name: "San Diego Stars",
        city: "San Diego",
        state: "CA",
        league: "Western Baseball Association",
      },
      {
        name: "Waynesboro Generals",
        city: "Waynesboro",
        state: "VA",
        league: "Valley Baseball League",
      },
      {
        name: "Holyoke Blue Sox",
        city: "Holyoke",
        state: "MA",
        league: "New England Collegiate League",
      },
      {
        name: "Milwaukee Brewers Scout Team",
        city: "Milwaukee",
        state: "WI",
        league: "MLB Scout Team",
      },
      {
        name: "Boston Blue Sox",
        city: "Boston",
        state: "MA",
        league: "New England Collegiate League",
      },
      {
        name: "El Dorado Broncos",
        city: "El Dorado",
        state: "KS",
        league: "Kansas Collegiate League",
      },
      {
        name: "Clarinda A's",
        city: "Clarinda",
        state: "IA",
        league: "MINK League",
      },
      {
        name: "Wichita Sluggers",
        city: "Wichita",
        state: "KS",
        league: "Kansas Collegiate League",
      },
      {
        name: "Boulder Collegians",
        city: "Boulder",
        state: "CO",
        league: "Rocky Mountain Collegiate League",
      },
    ];

    for (const team of teams) {
      await client.query(
        `INSERT INTO teams (name, city, state, league)
         VALUES ($1,$2,$3,$4)
         ON CONFLICT (name) DO UPDATE
         SET city = EXCLUDED.city, state = EXCLUDED.state, league = EXCLUDED.league`,
        [team.name, team.city, team.state, team.league]
      );
    }

    const getTeamId = async (name) => {
      const r = await client.query(`SELECT id FROM teams WHERE name = $1`, [
        name,
      ]);
      if (!r.rowCount) throw new Error(`Team not found: ${name}`);
      return r.rows[0].id;
    };
    const hutchinsonId = await getTeamId("Hutchinson Monarchs");
    const krakenId = await getTeamId("Lonestar Kraken TX");
    console.log(`    Hutchinson ID ${hutchinsonId} | Kraken ID ${krakenId}\n`);

    // 3) Tournament (no attendance column in your table)
    console.log(" Step 3/9: Upserting 2024 tournament...");
    const tRes = await client.query(
      `INSERT INTO tournaments (year, start_date, end_date, location)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (year) DO UPDATE
       SET start_date = EXCLUDED.start_date,
           end_date   = EXCLUDED.end_date,
           location   = EXCLUDED.location
       RETURNING id`,
      [2024, "2024-07-25", "2024-08-03", "Wichita, KS"]
    );
    const tournamentId = tRes.rows[0].id;
    console.log(`    2024 tournament id: ${tournamentId}\n`);

    // 4) Link teams
    console.log(" Step 4/9: Linking teams to 2024 tournament...");
    for (const team of teams) {
      const teamId = await getTeamId(team.name);
      await client.query(
        `INSERT INTO tournament_teams (tournament_id, team_id)
         VALUES ($1,$2) ON CONFLICT DO NOTHING`,
        [tournamentId, teamId]
      );
    }

    // 5) Players (subset)
    console.log(
      " Step 5/9: Upserting players and mapping to Hutchinson 2024..."
    );
    const players = [
      { firstName: "Jake", lastName: "Gutierrez", position: "OF" },
      { firstName: "Max", lastName: "Buettenback", position: "2B" },
      { firstName: "Drew", lastName: "Bugner", position: "SS" },
      { firstName: "Blake", lastName: "Bradford", position: "3B" },
      { firstName: "Dylan", lastName: "Bell", position: "OF" },
      { firstName: "Jaden", lastName: "Gustafson", position: "1B" },
      { firstName: "Ethan", lastName: "Lively", position: "C" },
      { firstName: "Bradyn", lastName: "McClure", position: "P" },
      { firstName: "Ethan", lastName: "Giesbrecht", position: "P" },
      { firstName: "Kaedyn", lastName: "Trevino", position: "P" },
      { firstName: "Jack", lastName: "Stetler", position: "P" },
      { firstName: "Tyler", lastName: "Satter", position: "P" },
    ];
    const playerIds = {};
    for (const p of players) {
      let id;
      try {
        const ins = await client.query(
          `INSERT INTO players (first_name, last_name) VALUES ($1,$2) RETURNING id`,
          [p.firstName, p.lastName]
        );
        id = ins.rows[0].id;
      } catch {
        const sel = await client.query(
          `SELECT id FROM players WHERE first_name=$1 AND last_name=$2`,
          [p.firstName, p.lastName]
        );
        id = sel.rows[0]?.id;
      }
      if (!id) continue;
      playerIds[`${p.firstName} ${p.lastName}`] = id;

      await client.query(
        `INSERT INTO player_teams (player_id, team_id, tournament_id, year, position)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT DO NOTHING`,
        [id, hutchinsonId, tournamentId, 2024, p.position]
      );
    }

    // 6) Batting stats
    console.log(" Step 6/9: Upserting batting stats...");
    const battingStats = [
      {
        name: "Jake Gutierrez",
        gp: 7,
        ab: 29,
        r: 11,
        h: 16,
        doubles: 3,
        triples: 0,
        hr: 0,
        rbi: 10,
        bb: 3,
        so: 3,
        sb: 4,
        cs: 0,
        obp: 0.559,
        slg: 0.655,
      },
      {
        name: "Max Buettenback",
        gp: 7,
        ab: 21,
        r: 10,
        h: 11,
        doubles: 3,
        triples: 0,
        hr: 0,
        rbi: 8,
        bb: 6,
        so: 3,
        sb: 2,
        cs: 1,
        obp: 0.643,
        slg: 0.667,
      },
      {
        name: "Drew Bugner",
        gp: 7,
        ab: 24,
        r: 8,
        h: 11,
        doubles: 1,
        triples: 0,
        hr: 0,
        rbi: 5,
        bb: 4,
        so: 2,
        sb: 1,
        cs: 0,
        obp: 0.517,
        slg: 0.5,
      },
      {
        name: "Blake Bradford",
        gp: 7,
        ab: 26,
        r: 6,
        h: 10,
        doubles: 4,
        triples: 0,
        hr: 0,
        rbi: 9,
        bb: 3,
        so: 4,
        sb: 0,
        cs: 0,
        obp: 0.448,
        slg: 0.538,
      },
      {
        name: "Dylan Bell",
        gp: 7,
        ab: 23,
        r: 7,
        h: 8,
        doubles: 2,
        triples: 0,
        hr: 0,
        rbi: 6,
        bb: 5,
        so: 7,
        sb: 3,
        cs: 0,
        obp: 0.464,
        slg: 0.435,
      },
      {
        name: "Jaden Gustafson",
        gp: 7,
        ab: 23,
        r: 4,
        h: 7,
        doubles: 1,
        triples: 0,
        hr: 0,
        rbi: 7,
        bb: 2,
        so: 6,
        sb: 0,
        cs: 0,
        obp: 0.36,
        slg: 0.348,
      },
      {
        name: "Ethan Lively",
        gp: 7,
        ab: 20,
        r: 5,
        h: 6,
        doubles: 2,
        triples: 0,
        hr: 0,
        rbi: 4,
        bb: 3,
        so: 4,
        sb: 0,
        cs: 0,
        obp: 0.391,
        slg: 0.4,
      },
    ];
    for (const s of battingStats) {
      const pid = playerIds[s.name];
      if (!pid) continue;
      const seasonKey = `2024_${hutchinsonId}`;
      await client.query(
        `INSERT INTO batting_stats (
           player_id, team_id, year, season_key,
           gp, ab, r, h, "2b", "3b", hr, rbi, bb, so, sb, cs, obp, slg
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
         ON CONFLICT (player_id, team_id, year) DO UPDATE SET
           gp=EXCLUDED.gp, ab=EXCLUDED.ab, r=EXCLUDED.r, h=EXCLUDED.h,
           "2b"=EXCLUDED."2b", "3b"=EXCLUDED."3b", hr=EXCLUDED.hr, rbi=EXCLUDED.rbi,
           bb=EXCLUDED.bb, so=EXCLUDED.so, sb=EXCLUDED.sb, cs=EXCLUDED.cs,
           obp=EXCLUDED.obp, slg=EXCLUDED.slg`,
        [
          pid,
          hutchinsonId,
          2024,
          seasonKey,
          s.gp,
          s.ab,
          s.r,
          s.h,
          s.doubles,
          s.triples,
          s.hr,
          s.rbi,
          s.bb,
          s.so,
          s.sb,
          s.cs,
          s.obp,
          s.slg,
        ]
      );
    }

    // 7) Pitching stats
    console.log(" Step 7/9: Upserting pitching stats...");
    const pitchingStats = [
      {
        name: "Bradyn McClure",
        w: 2,
        l: 0,
        gp: 3,
        gs: 2,
        sv: 0,
        ip: 12.2,
        h: 8,
        r: 2,
        er: 1,
        bb: 1,
        so: 16,
        era: 0.71,
      },
      {
        name: "Ethan Giesbrecht",
        w: 1,
        l: 0,
        gp: 3,
        gs: 2,
        sv: 0,
        ip: 10.0,
        h: 7,
        r: 3,
        er: 1,
        bb: 4,
        so: 11,
        era: 1.0,
      },
      {
        name: "Kaedyn Trevino",
        w: 1,
        l: 1,
        gp: 3,
        gs: 1,
        sv: 0,
        ip: 9.0,
        h: 8,
        r: 4,
        er: 3,
        bb: 2,
        so: 10,
        era: 3.0,
      },
      {
        name: "Jack Stetler",
        w: 0,
        l: 0,
        gp: 2,
        gs: 0,
        sv: 1,
        ip: 5.1,
        h: 3,
        r: 1,
        er: 0,
        bb: 2,
        so: 7,
        era: 0.0,
      },
      {
        name: "Tyler Satter",
        w: 1,
        l: 0,
        gp: 3,
        gs: 0,
        sv: 0,
        ip: 7.0,
        h: 5,
        r: 2,
        er: 2,
        bb: 3,
        so: 8,
        era: 2.57,
      },
    ];
    for (const s of pitchingStats) {
      const pid = playerIds[s.name];
      if (!pid) continue;
      const seasonKey = `2024_${hutchinsonId}`;
      await client.query(
        `INSERT INTO pitching_stats (
           player_id, team_id, year, season_key,
           w, l, app, gs, sv, ip, h, r, er, bb, so, era
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
         ON CONFLICT (player_id, team_id, year) DO UPDATE SET
           w=EXCLUDED.w, l=EXCLUDED.l, app=EXCLUDED.app, gs=EXCLUDED.gs,
           sv=EXCLUDED.sv, ip=EXCLUDED.ip, h=EXCLUDED.h, r=EXCLUDED.r, er=EXCLUDED.er,
           bb=EXCLUDED.bb, so=EXCLUDED.so, era=EXCLUDED.era`,
        [
          pid,
          hutchinsonId,
          2024,
          seasonKey,
          s.w,
          s.l,
          s.gp,
          s.gs,
          s.sv,
          s.ip,
          s.h,
          s.r,
          s.er,
          s.bb,
          s.so,
          s.era,
        ]
      );
    }

    // 8) Championship
    console.log(" Step 8/9: Upserting championship...");
    const mvpId = playerIds["Jake Gutierrez"];
    const leadPId = playerIds["Bradyn McClure"];
    await client.query(
      `INSERT INTO championships (year, champion_team_id, runner_up_team_id, championship_score, mvp_player_id, leading_pitcher_id)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (year) DO UPDATE
       SET champion_team_id = EXCLUDED.champion_team_id,
           runner_up_team_id = EXCLUDED.runner_up_team_id,
           championship_score = EXCLUDED.championship_score,
           mvp_player_id = EXCLUDED.mvp_player_id,
           leading_pitcher_id = EXCLUDED.leading_pitcher_id`,
      [2024, hutchinsonId, krakenId, "5-3", mvpId, leadPId]
    );

    // 9) Hall of Fame
    // 9) Hall of Fame
    console.log(" Step 9/9: Upserting Hall of Fame nominees...");
    const hof = [
      { name: "Kevin Hooper", year: 2024, category: "Player" },
      { name: "Mike Blue", year: 2024, category: "Player" },
      { name: "Bruce Konopka", year: 2024, category: "Player" },
    ];

    for (const h of hof) {
      await client.query(
        `INSERT INTO hall_of_fame (inductee_name, induction_year, category)
     VALUES ($1,$2,$3)
     ON CONFLICT (inductee_name, induction_year) DO NOTHING`,
        [h.name, h.year, h.category]
      );
    }

    await client.query("COMMIT");

    // Verify what we just wrote in public
    const verify = await pool.query(`
      SELECT
        (SELECT count(*) FROM public.tournament_teams tt JOIN public.tournaments t ON t.id=tt.tournament_id WHERE t.year=2024) AS teams_linked,
        (SELECT count(*) FROM public.batting_stats   WHERE year=2024) AS bats_2024,
        (SELECT count(*) FROM public.pitching_stats  WHERE year=2024) AS arms_2024
    `);
    console.log("\n════════ Verification (public schema) ════════");
    console.log("Tournament 2024 id:", tournamentId);
    console.log("Teams linked:", verify.rows[0].teams_linked);
    console.log("Batting rows:", verify.rows[0].bats_2024);
    console.log("Pitching rows:", verify.rows[0].arms_2024);
    console.log(
      "Championship 2024 exists:",
      (
        await pool.query(
          "select count(*) from public.championships where year=2024"
        )
      ).rows[0].count
    );

    console.log("\n Done\n");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(" ERROR:", err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

import2024Data().catch(() => process.exit(1));
