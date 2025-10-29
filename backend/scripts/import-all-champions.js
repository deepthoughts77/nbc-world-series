import { pool } from "../src/db.js";

async function importAllChampions() {
  const client = await pool.connect();

  try {
    console.log("\n🏆 IMPORTING ALL NBC WORLD SERIES CHAMPIONS\n");
    console.log("═".repeat(70));

    await client.query("BEGIN");

    // Complete championship data from NBC website
    const champions = [
      // 1935-1940
      {
        year: 1935,
        champion: "Bismarck Corwin-Churchills",
        city: "Bismarck",
        state: "ND",
      },
      { year: 1936, champion: "Duncan Cementers", city: "Duncan", state: "OK" },
      { year: 1937, champion: "Enid Eason Oilers", city: "Enid", state: "OK" },
      {
        year: 1938,
        champion: "Buford Bona Allens",
        city: "Buford",
        state: "GA",
      },
      {
        year: 1939,
        champion: "Silverton Red Sox",
        city: "Silverton",
        state: "OR",
      },
      { year: 1940, champion: "Enid Champlins", city: "Enid", state: "OK" },

      // 1941-1950
      { year: 1941, champion: "Enid Champlins", city: "Enid", state: "OK" },
      {
        year: 1942,
        champion: "Wichita Boeing Bombers",
        city: "Wichita",
        state: "KS",
      },
      {
        year: 1943,
        champion: "Ft. Riley CRTC",
        city: "Ft. Riley",
        state: "KS",
      },
      { year: 1944, champion: "Enid AFB Enidairs", city: "Enid", state: "OK" },
      { year: 1945, champion: "Enid AFB Enidairs", city: "Enid", state: "OK" },
      {
        year: 1946,
        champion: "Carmichael Firemen",
        city: "Carmichael",
        state: "CA",
      },
      { year: 1947, champion: "Golden Coors", city: "Golden", state: "CO" },
      {
        year: 1948,
        champion: "Chatham Blanketeers",
        city: "Chatham",
        state: "NC",
      },
      {
        year: 1949,
        champion: "Ft. Wayne G-E Club",
        city: "Ft. Wayne",
        state: "IN",
      },
      {
        year: 1950,
        champion: "Ft. Wayne Capeharts",
        city: "Ft. Wayne",
        state: "IN",
      },

      // 1951-1960
      {
        year: 1951,
        champion: "Sinton Plymouth Oilers",
        city: "Sinton",
        state: "TX",
      },
      {
        year: 1952,
        champion: "Ft. Meyer Colonials",
        city: "Ft. Meyer",
        state: "VA",
      },
      {
        year: 1953,
        champion: "Ft. Leonard Wood Hilltoppers",
        city: "Ft. Leonard Wood",
        state: "MO",
      },
      {
        year: 1954,
        champion: "Casa Grande Cotton Kings",
        city: "Casa Grande",
        state: "AZ",
      },
      {
        year: 1955,
        champion: "Wichita Boeing Bombers",
        city: "Wichita",
        state: "KS",
      },
      { year: 1956, champion: "Alpine Cowboys", city: "Alpine", state: "TX" },
      {
        year: 1957,
        champion: "Ft. Wayne Dairymen",
        city: "Ft. Wayne",
        state: "IN",
      },
      { year: 1958, champion: "Drain Black Sox", city: "Drain", state: "OR" },
      { year: 1959, champion: "Wichita Weller", city: "Wichita", state: "KS" },
      { year: 1960, champion: "Tampa Gibsonton", city: "Tampa", state: "FL" },

      // 1961-1970
      {
        year: 1961,
        champion: "Grand Rapids Sullivans",
        city: "Grand Rapids",
        state: "MI",
      },
      {
        year: 1962,
        champion: "Wichita Rapid Transit",
        city: "Wichita",
        state: "KS",
      },
      {
        year: 1963,
        champion: "Fairbanks Goldpanners",
        city: "Fairbanks",
        state: "AK",
      },
      {
        year: 1964,
        champion: "Wichita Service Auto Glass",
        city: "Wichita",
        state: "KS",
      },
      {
        year: 1965,
        champion: "Rapid Transit Dreamliners",
        city: "Wichita",
        state: "KS",
      },
      {
        year: 1966,
        champion: "Boulder Collegians",
        city: "Boulder",
        state: "CO",
      },
      {
        year: 1967,
        champion: "Boulder Collegians",
        city: "Boulder",
        state: "CO",
      },
      { year: 1968, champion: "Jackson Braves", city: "Jackson", state: "MS" },
      {
        year: 1969,
        champion: "Anchorage Glacier Pilots",
        city: "Anchorage",
        state: "AK",
      },
      {
        year: 1970,
        champion: "Grand Rapids Sullivans",
        city: "Grand Rapids",
        state: "MI",
      },

      // 1971-1980
      {
        year: 1971,
        champion: "Anchorage Glacier Pilots",
        city: "Anchorage",
        state: "AK",
      },
      {
        year: 1972,
        champion: "Fairbanks Goldpanners",
        city: "Fairbanks",
        state: "AK",
      },
      {
        year: 1973,
        champion: "Fairbanks Goldpanners",
        city: "Fairbanks",
        state: "AK",
      },
      {
        year: 1974,
        champion: "Fairbanks Goldpanners",
        city: "Fairbanks",
        state: "AK",
      },
      {
        year: 1975,
        champion: "Boulder Collegians",
        city: "Boulder",
        state: "CO",
      },
      {
        year: 1976,
        champion: "Fairbanks Goldpanners",
        city: "Fairbanks",
        state: "AK",
      },
      {
        year: 1977,
        champion: "Kenai Peninsula Oilers",
        city: "Kenai",
        state: "AK",
      },
      {
        year: 1978,
        champion: "Boulder Collegians",
        city: "Boulder",
        state: "CO",
      },
      {
        year: 1979,
        champion: "Liberal Bee Jays",
        city: "Liberal",
        state: "KS",
      },
      {
        year: 1980,
        champion: "Fairbanks Goldpanners",
        city: "Fairbanks",
        state: "AK",
      },

      // 1981-1990
      { year: 1981, champion: "Clarinda A's", city: "Clarinda", state: "IA" },
      {
        year: 1982,
        champion: "Santa Maria Indians",
        city: "Santa Maria",
        state: "CA",
      },
      {
        year: 1983,
        champion: "Grand Rapids Sullivans",
        city: "Grand Rapids",
        state: "MI",
      },
      {
        year: 1984,
        champion: "Grand Rapids Sullivans",
        city: "Grand Rapids",
        state: "MI",
      },
      {
        year: 1985,
        champion: "Liberal Bee Jays",
        city: "Liberal",
        state: "KS",
      },
      {
        year: 1986,
        champion: "Anchorage Glacier Pilots",
        city: "Anchorage",
        state: "AK",
      },
      { year: 1987, champion: "Mat-Su Miners", city: "Wasilla", state: "AK" },
      {
        year: 1988,
        champion: "Everett Merchants",
        city: "Everett",
        state: "WA",
      },
      {
        year: 1989,
        champion: "El Dorado Broncos",
        city: "El Dorado",
        state: "KS",
      },
      {
        year: 1990,
        champion: "Midlothian White Sox",
        city: "Midlothian",
        state: "IL",
      },

      // 1991-2000
      {
        year: 1991,
        champion: "Kenai Peninsula Oilers",
        city: "Kenai",
        state: "AK",
      },
      {
        year: 1992,
        champion: "Midlothian White Sox",
        city: "Midlothian",
        state: "IL",
      },
      {
        year: 1993,
        champion: "Kenai Peninsula Oilers",
        city: "Kenai",
        state: "AK",
      },
      {
        year: 1994,
        champion: "Kenai Peninsula Oilers",
        city: "Kenai",
        state: "AK",
      },
      { year: 1995, champion: "Hays Larks", city: "Hays", state: "KS" },
      {
        year: 1996,
        champion: "El Dorado Broncos",
        city: "El Dorado",
        state: "KS",
      },
      { year: 1997, champion: "Nevada Griffons", city: "Nevada", state: "MO" },
      {
        year: 1998,
        champion: "El Dorado Broncos",
        city: "El Dorado",
        state: "KS",
      },
      { year: 1999, champion: "Dallas Phillies", city: "Dallas", state: "TX" },
      {
        year: 2000,
        champion: "Liberal Bee Jays",
        city: "Liberal",
        state: "KS",
      },

      // 2001-2010
      {
        year: 2001,
        champion: "Anchorage Glacier Pilots",
        city: "Anchorage",
        state: "AK",
      },
      {
        year: 2002,
        champion: "Fairbanks Goldpanners",
        city: "Fairbanks",
        state: "AK",
      },
      { year: 2003, champion: "Chinese Taipei", city: "Taipei", state: "TW" },
      { year: 2004, champion: "Aloha Knights", city: "Aloha", state: "OR" },
      { year: 2005, champion: "Derby Twins", city: "Derby", state: "KS" },
      {
        year: 2006,
        champion: "Santa Barbara Foresters",
        city: "Santa Barbara",
        state: "CA",
      },
      {
        year: 2007,
        champion: "Havasu Heat",
        city: "Lake Havasu City",
        state: "AZ",
      },
      {
        year: 2008,
        champion: "Santa Barbara Foresters",
        city: "Santa Barbara",
        state: "CA",
      },
      {
        year: 2009,
        champion: "El Dorado Broncos",
        city: "El Dorado",
        state: "KS",
      },
      {
        year: 2010,
        champion: "Liberal Bee Jays",
        city: "Liberal",
        state: "KS",
      },

      // 2011-2019
      {
        year: 2011,
        champion: "Santa Barbara Foresters",
        city: "Santa Barbara",
        state: "CA",
      },
      {
        year: 2012,
        champion: "Santa Barbara Foresters",
        city: "Santa Barbara",
        state: "CA",
      },
      { year: 2013, champion: "Seattle Studs", city: "Seattle", state: "WA" },
      {
        year: 2014,
        champion: "Santa Barbara Foresters",
        city: "Santa Barbara",
        state: "CA",
      },
      { year: 2015, champion: "Seattle Studs", city: "Seattle", state: "WA" },
      {
        year: 2016,
        champion: "Santa Barbara Foresters",
        city: "Santa Barbara",
        state: "CA",
      },
      { year: 2017, champion: "Kansas Stars", city: "Wichita", state: "KS" },
      {
        year: 2018,
        champion: "Santa Barbara Foresters",
        city: "Santa Barbara",
        state: "CA",
      },
      { year: 2019, champion: "Seattle Studs", city: "Seattle", state: "WA" },
    ];

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    for (const record of champions) {
      try {
        // Get or create team
        let team = await client.query("SELECT id FROM teams WHERE name = $1", [
          record.champion,
        ]);

        let teamId;
        if (team.rows.length === 0) {
          team = await client.query(
            "INSERT INTO teams (name, city, state, league) VALUES ($1, $2, $3, $4) RETURNING id",
            [record.champion, record.city, record.state, "NBC"]
          );
          teamId = team.rows[0].id;
          console.log(`➕ Created: ${record.champion}`);
        } else {
          teamId = team.rows[0].id;
        }

        // Check if championship exists
        const existing = await client.query(
          "SELECT id FROM championships WHERE year = $1",
          [record.year]
        );

        if (existing.rows.length > 0) {
          await client.query(
            "UPDATE championships SET champion_team_id = $1 WHERE year = $2",
            [teamId, record.year]
          );
          console.log(` Updated: ${record.year} - ${record.champion}`);
          updated++;
        } else {
          await client.query(
            "INSERT INTO championships (year, champion_team_id) VALUES ($1, $2)",
            [record.year, teamId]
          );
          console.log(` Imported: ${record.year} - ${record.champion}`);
          imported++;
        }
      } catch (err) {
        console.error(` Error with ${record.year}:`, err.message);
        skipped++;
      }
    }

    await client.query("COMMIT");

    console.log("\n" + "═".repeat(70));
    console.log(" IMPORT SUMMARY:");
    console.log(`    Imported: ${imported}`);
    console.log(`    Updated: ${updated}`);
    console.log(`   ⏭  Skipped: ${skipped}`);
    console.log(`    Total: ${champions.length}\n`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(" Import failed:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

importAllChampions()
  .then(() => {
    console.log(" All champions imported!\n");
    process.exit(0);
  })
  .catch(() => {
    console.error(" Import failed!\n");
    process.exit(1);
  });
