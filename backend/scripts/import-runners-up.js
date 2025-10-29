import { pool } from "../src/db.js";

async function importRunnersUp() {
  const client = await pool.connect();

  try {
    console.log("\n IMPORTING RUNNERS-UP DATA\n");
    console.log("═".repeat(70));

    await client.query("BEGIN");

    // Runners-up data (where available from historical records)
    const runnersUp = [
      // Modern Era (most documented)
      {
        year: 2025,
        runnerUp: "Lonestar Kraken TX",
        city: "Conroe",
        state: "TX",
      },
      {
        year: 2024,
        runnerUp: "Hutchinson Monarchs",
        city: "Hutchinson",
        state: "KS",
      },
      {
        year: 2023,
        runnerUp: "Santa Barbara Foresters",
        city: "Santa Barbara",
        state: "CA",
      },
      { year: 2022, runnerUp: "Seattle Studs", city: "Seattle", state: "WA" },
      { year: 2021, runnerUp: "Hays Larks", city: "Hays", state: "KS" },
      { year: 2020, runnerUp: "Seattle Studs", city: "Seattle", state: "WA" },
      { year: 2019, runnerUp: "Kansas Cannons", city: "Wichita", state: "KS" },
      {
        year: 2018,
        runnerUp: "Dodge City A's",
        city: "Dodge City",
        state: "KS",
      },
      {
        year: 2017,
        runnerUp: "Valley Center Diamond Dawgs",
        city: "Valley Center",
        state: "KS",
      },
      { year: 2016, runnerUp: "Hays Larks", city: "Hays", state: "KS" },
      {
        year: 2015,
        runnerUp: "Liberal Bee Jays",
        city: "Liberal",
        state: "KS",
      },
      { year: 2014, runnerUp: "Seattle Studs", city: "Seattle", state: "WA" },
      {
        year: 2013,
        runnerUp: "El Dorado Broncos",
        city: "El Dorado",
        state: "KS",
      },
      {
        year: 2012,
        runnerUp: "San Diego Force",
        city: "San Diego",
        state: "CA",
      },
      { year: 2011, runnerUp: "Nevada Griffons", city: "Nevada", state: "MO" },
      { year: 2010, runnerUp: "Seattle Studs", city: "Seattle", state: "WA" },
      {
        year: 2009,
        runnerUp: "Anchorage Glacier Pilots",
        city: "Anchorage",
        state: "AK",
      },
      {
        year: 2008,
        runnerUp: "Beatrice Bruins",
        city: "Beatrice",
        state: "NE",
      },
      {
        year: 2007,
        runnerUp: "Santa Barbara Foresters",
        city: "Santa Barbara",
        state: "CA",
      },
      { year: 2006, runnerUp: "Hays Larks", city: "Hays", state: "KS" },
      { year: 2005, runnerUp: "Prairie Gravel", city: "Prairie", state: "IL" },
      {
        year: 2004,
        runnerUp: "San Diego Waves",
        city: "San Diego",
        state: "CA",
      },
      {
        year: 2003,
        runnerUp: "El Dorado Broncos",
        city: "El Dorado",
        state: "KS",
      },
      {
        year: 2002,
        runnerUp: "Anchorage Glacier Pilots",
        city: "Anchorage",
        state: "AK",
      },
      {
        year: 2001,
        runnerUp: "Santa Barbara Foresters",
        city: "Santa Barbara",
        state: "CA",
      },
      {
        year: 2000,
        runnerUp: "Liberal Bee Jays",
        city: "Liberal",
        state: "KS",
      },

      // 1990s
      { year: 1999, runnerUp: "Nevada Griffons", city: "Nevada", state: "MO" },
      { year: 1998, runnerUp: "Clarinda A's", city: "Clarinda", state: "IA" },
      {
        year: 1997,
        runnerUp: "Liberal Bee Jays",
        city: "Liberal",
        state: "KS",
      },
      { year: 1996, runnerUp: "Hays Larks", city: "Hays", state: "KS" },
      {
        year: 1995,
        runnerUp: "USA National Team",
        city: "Various",
        state: "USA",
      },
      {
        year: 1994,
        runnerUp: "Anchorage Glacier Pilots",
        city: "Anchorage",
        state: "AK",
      },
      { year: 1993, runnerUp: "Elkhart Dusters", city: "Elkhart", state: "KS" },
      {
        year: 1992,
        runnerUp: "Kenai Peninsula Oilers",
        city: "Kenai",
        state: "AK",
      },
      {
        year: 1991,
        runnerUp: "Grand Rapids Sullivans",
        city: "Grand Rapids",
        state: "MI",
      },
      { year: 1990, runnerUp: "Dallas Mustangs", city: "Dallas", state: "TX" },

      // 1980s
      {
        year: 1989,
        runnerUp: "Grand Rapids Sullivans",
        city: "Grand Rapids",
        state: "MI",
      },
      {
        year: 1988,
        runnerUp: "Liberal Bee Jays",
        city: "Liberal",
        state: "KS",
      },
      { year: 1987, runnerUp: "Wichita Broncos", city: "Wichita", state: "KS" },
      {
        year: 1986,
        runnerUp: "Grand Rapids Sullivans",
        city: "Grand Rapids",
        state: "MI",
      },
      {
        year: 1985,
        runnerUp: "Santa Maria Indians",
        city: "Santa Maria",
        state: "CA",
      },
      {
        year: 1984,
        runnerUp: "Anchorage Glacier Pilots",
        city: "Anchorage",
        state: "AK",
      },
      {
        year: 1983,
        runnerUp: "Buford Bona Allens",
        city: "Buford",
        state: "GA",
      },
      {
        year: 1982,
        runnerUp: "Anchorage Glacier Pilots",
        city: "Anchorage",
        state: "AK",
      },
      {
        year: 1981,
        runnerUp: "Hutchinson Broncs",
        city: "Hutchinson",
        state: "KS",
      },
      {
        year: 1980,
        runnerUp: "Boulder Collegians",
        city: "Boulder",
        state: "CO",
      },

      // 1970s
      {
        year: 1979,
        runnerUp: "Boulder Collegians",
        city: "Boulder",
        state: "CO",
      },
      {
        year: 1978,
        runnerUp: "Liberal Bee Jays",
        city: "Liberal",
        state: "KS",
      },
      { year: 1977, runnerUp: "Clarinda A's", city: "Clarinda", state: "IA" },
      {
        year: 1976,
        runnerUp: "Rapid City Post 22",
        city: "Rapid City",
        state: "SD",
      },
      {
        year: 1975,
        runnerUp: "Kenai Peninsula Oilers",
        city: "Kenai",
        state: "AK",
      },
      {
        year: 1974,
        runnerUp: "Liberal Bee Jays",
        city: "Liberal",
        state: "KS",
      },
      {
        year: 1973,
        runnerUp: "Tallahassee Tigers",
        city: "Tallahassee",
        state: "FL",
      },
      { year: 1972, runnerUp: "Eureka Crabs", city: "Eureka", state: "CA" },
      {
        year: 1971,
        runnerUp: "Fairbanks Goldpanners",
        city: "Fairbanks",
        state: "AK",
      },
      {
        year: 1970,
        runnerUp: "Liberal Bee Jays",
        city: "Liberal",
        state: "KS",
      },
    ];

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const record of runnersUp) {
      try {
        // Find or create runner-up team
        let team = await client.query("SELECT id FROM teams WHERE name = $1", [
          record.runnerUp,
        ]);

        let teamId;
        if (team.rows.length === 0) {
          team = await client.query(
            "INSERT INTO teams (name, city, state, league) VALUES ($1, $2, $3, $4) RETURNING id",
            [record.runnerUp, record.city, record.state, "NBC"]
          );
          teamId = team.rows[0].id;
          console.log(`   Created team: ${record.runnerUp}`);
          created++;
        } else {
          teamId = team.rows[0].id;
        }

        // Update championship
        const result = await client.query(
          "UPDATE championships SET runner_up_team_id = $1 WHERE year = $2 RETURNING id",
          [teamId, record.year]
        );

        if (result.rowCount > 0) {
          console.log(` ${record.year}: Runner-up set to ${record.runnerUp}`);
          updated++;
        } else {
          console.log(`  ${record.year}: No championship found`);
          skipped++;
        }
      } catch (err) {
        console.error(` Error with ${record.year}:`, err.message);
        skipped++;
      }
    }

    await client.query("COMMIT");

    console.log("\n" + "═".repeat(70));
    console.log(" IMPORT SUMMARY:");
    console.log(`    Teams created: ${created}`);
    console.log(`    Championships updated: ${updated}`);
    console.log(`   ⏭  Skipped: ${skipped}`);
    console.log(`    Total: ${runnersUp.length}\n`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(" Import failed:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

importRunnersUp()
  .then(() => {
    console.log(" Runners-up import completed!\n");
    process.exit(0);
  })
  .catch(() => {
    console.error(" Runners-up import failed!\n");
    process.exit(1);
  });
