const path = require("path");
// Ensure .env is loaded even if you run from scripts/
require("dotenv").config({ path: path.resolve(__dirname, "../backend/.env") });

const pool = require("../backend/src/config/database");
const { hashPassword } = require("../backend/src/utils/auth");

async function seedDatabase() {
  console.log("Starting database seed...");

  try {
    // 1) Admin password hash (optional helper)
    if (process.env.ADMIN_PASSWORD) {
      const adminPass = await hashPassword(process.env.ADMIN_PASSWORD);
      console.log("Admin password hash:", adminPass);
      console.log(
        "→ Paste this into backend/.env as ADMIN_PASSWORD_HASH and remove ADMIN_PASSWORD"
      );
    } else {
      console.warn(
        "No ADMIN_PASSWORD in .env — skipping hash generation (this is fine)."
      );
    }

    // 2) Teams
    const teams = [
      {
        name: "Santa Barbara Foresters",
        city: "Santa Barbara",
        state: "CA",
        league: "California Collegiate League",
      },
      {
        name: "Hutchinson Monarchs",
        city: "Hutchinson",
        state: "KS",
        league: "Jayhawk Collegiate League",
      },
      {
        name: "Liberal Bee Jays",
        city: "Liberal",
        state: "KS",
        league: "Rocky Mountain Collegiate League",
      },
      {
        name: "Seattle Cheney Studs",
        city: "Seattle",
        state: "WA",
        league: "Pacific International League",
      },
      {
        name: "Hays Larks",
        city: "Hays",
        state: "KS",
        league: "Rocky Mountain Collegiate League",
      },
    ];

    for (const t of teams) {
      await pool.query(
        "INSERT INTO teams (name, city, state, league) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING",
        [t.name, t.city, t.state, t.league]
      );
    }
    console.log("Teams inserted");

    // 3) Championships
    const championships = [
      { year: 2023, champion: "Hutchinson Monarchs" },
      { year: 2022, champion: "Santa Barbara Foresters" },
      { year: 2021, champion: "Santa Barbara Foresters" },
      { year: 2020, champion: "Santa Barbara Foresters" },
      { year: 2019, champion: "Seattle Cheney Studs" },
    ];

    for (const c of championships) {
      const { rows } = await pool.query(
        "SELECT id FROM teams WHERE name = $1",
        [c.champion]
      );
      if (rows.length) {
        await pool.query(
          "INSERT INTO championships (year, champion_team_id) VALUES ($1, $2) ON CONFLICT (year) DO NOTHING",
          [c.year, rows[0].id]
        );
      }
    }
    console.log("Championships inserted");

    // 4) Hall of Fame
    const hof = [
      { name: "Kevin Hooper", year: 2024, category: "Player" },
      { name: "Mike Blue", year: 2024, category: "Player" },
      { name: "Bruce Konopka", year: 2024, category: "Player" },
    ];

    for (const member of hof) {
      await pool.query(
        `INSERT INTO hall_of_fame (inductee_name, induction_year, category, bio)
     VALUES ($1, $2, COALESCE($3, ''), $4)
     ON CONFLICT (inductee_name, induction_year, category) DO NOTHING`,
        [member.name, member.year, member.category, member.bio || null]
      );
    }

    console.log("Hall of Fame members inserted");
    // 5) Players + links (idempotent)
    const players = [
      {
        first_name: "Kevin",
        last_name: "Hooper",
        is_hall_of_fame: true,
        mlb_team: "Detroit Tigers",
      },
      {
        first_name: "Mike",
        last_name: "Blue",
        is_hall_of_fame: true,
        mlb_team: null,
      },
      {
        first_name: "Bruce",
        last_name: "Konopka",
        is_hall_of_fame: true,
        mlb_team: null,
      },
    ];

    for (const p of players) {
      await pool.query(
        `INSERT INTO players (first_name, last_name, is_hall_of_fame, mlb_team)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT DO NOTHING`,
        [p.first_name, p.last_name, p.is_hall_of_fame, p.mlb_team]
      );
    }

    // Link Kevin Hooper to Hutchinson Monarchs in 2023 with some sample stats
    await pool.query(
      `
  INSERT INTO player_teams (player_id, team_id, tournament_id, year, position, stats)
  SELECT p.id, t.id, tr.id, 2023, 'INF', '{"AVG":".315","RBI":12}'
  FROM players p, teams t, tournaments tr
  WHERE p.first_name='Kevin' AND p.last_name='Hooper'
    AND t.name='Hutchinson Monarchs'
    AND tr.year=2023
    AND NOT EXISTS (
      SELECT 1 FROM player_teams pt
      WHERE pt.player_id=p.id AND pt.team_id=t.id AND pt.tournament_id=tr.id
    )
  `
    );

    console.log("Players and player-team links inserted");

    console.log("Database seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
}

seedDatabase();
