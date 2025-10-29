import { pool } from "../src/db.js";

async function importAllMVPs() {
  const client = await pool.connect();

  try {
    console.log("\n IMPORTING ALL MVP AWARDS\n");
    console.log("═".repeat(70));

    await client.query("BEGIN");

    // MVP data from NBC website tables
    const mvps = [
      // 2020-2025
      { year: 2025, mvp: "Jake Gutierrez", team: "Hutchinson Monarchs" },
      { year: 2024, mvp: "Garrett Gruell", team: "Hays Larks" },
      { year: 2023, mvp: "Max Buettenback", team: "Hutchinson Monarchs" },
      { year: 2022, mvp: "Gavin Kash", team: "Santa Barbara Foresters" },
      { year: 2021, mvp: "Justin Eckhardt", team: "Santa Barbara Foresters" },
      { year: 2020, mvp: "Sean Johnson", team: "Santa Barbara Foresters" },

      // 2010-2019
      { year: 2019, mvp: "Henry Cheney", team: "Seattle Studs" },
      { year: 2018, mvp: "Patrick Mathis", team: "Santa Barbara Foresters" },
      { year: 2017, mvp: "Ryan Langerhans", team: "Kansas Stars" },
      { year: 2016, mvp: "Jacob Patterson", team: "Santa Barbara Foresters" },
      { year: 2015, mvp: "Connor Savage", team: "Seattle Studs" },
      { year: 2014, mvp: "Jon Duplantier", team: "Santa Barbara Foresters" },
      { year: 2013, mvp: "David Benson", team: "Seattle Studs" },
      { year: 2012, mvp: "Zach Fish", team: "Santa Barbara Foresters" },
      { year: 2011, mvp: "Mitch Mormann", team: "Santa Barbara Foresters" },
      { year: 2010, mvp: "Paul Gonzalez", team: "Liberal Bee Jays" },

      // 2000-2009
      { year: 2009, mvp: "Jake Sabol", team: "El Dorado Broncos" },
      { year: 2008, mvp: "Kevin Keyes", team: "Santa Barbara Foresters" },
      { year: 2007, mvp: "Brad Arnett", team: "Havasu Heat" },
      { year: 2006, mvp: "Jon Qualls", team: "Derby Twins" },
      { year: 2005, mvp: "Matt Whitaker", team: "Derby Twins" },
      { year: 2004, mvp: "Ryan Anetsberger", team: "Prairie Gravel" },
      { year: 2003, mvp: "Chang-Wei Tu", team: "Chinese Taipei" },
      { year: 2002, mvp: "Blake Gill", team: "Fairbanks Goldpanners" },
      { year: 2001, mvp: "Jeff Francis", team: "Anchorage Glacier Pilots" },
      { year: 2000, mvp: "Cory Metzler", team: "Liberal Bee Jays" },

      // 1990-1999
      { year: 1999, mvp: "Marco Cunningham", team: "Dallas Phillies" },
      { year: 1998, mvp: "Jason Aspito", team: "El Dorado Broncos" },
      { year: 1997, mvp: "Jeff Juarez", team: "Nevada Griffons" },
      { year: 1996, mvp: "Kevin Frederick", team: "El Dorado Broncos" },
      { year: 1995, mvp: "Lance Berkman", team: "Hays Larks" },
      { year: 1994, mvp: "Jesse Zepeda", team: "Kenai Peninsula Oilers" },
      { year: 1993, mvp: "Jeff Poor", team: "Kenai Peninsula Oilers" },
      { year: 1992, mvp: "Mike Kane", team: "Midlothian White Sox" },
      { year: 1991, mvp: "Chris Hmielewski", team: "Kenai Peninsula Oilers" },
      { year: 1990, mvp: "Chris Hmielewski", team: "Midlothian White Sox" },

      // 1980-1989
      { year: 1989, mvp: "Jim Huslig", team: "El Dorado Broncos" },
      { year: 1988, mvp: "Dave Wong", team: "Everett Merchants" },
      { year: 1987, mvp: "Ken Kremer", team: "Mat-Su Miners" },
      { year: 1986, mvp: "Steve Bales", team: "Anchorage Glacier Pilots" },
      { year: 1985, mvp: "Kerry Richardson", team: "Liberal Bee Jays" },
      { year: 1984, mvp: "Bill Bates", team: "Grand Rapids Sullivans" },
      { year: 1983, mvp: "Curtis Morgan", team: "Grand Rapids Sullivans" },
      { year: 1982, mvp: "Dave Hengle", team: "Santa Maria Indians" },
      { year: 1981, mvp: "Keith Mucha", team: "Clarinda A's" },
      { year: 1980, mvp: "Kevin McReynolds", team: "Fairbanks Goldpanners" },

      // 1970-1979
      { year: 1979, mvp: "Gary D'Onofrio", team: "Liberal Bee Jays" },
      { year: 1978, mvp: "Bob Ferris", team: "Boulder Collegians" },
      { year: 1977, mvp: "Bob Skube", team: "Kenai Peninsula Oilers" },
      { year: 1976, mvp: "Greg Harris", team: "Fairbanks Goldpanners" },
      { year: 1975, mvp: "Mike Colbern", team: "Boulder Collegians" },
      { year: 1974, mvp: "Steve Kemp", team: "Fairbanks Goldpanners" },
      { year: 1973, mvp: "Lee Iorg", team: "Fairbanks Goldpanners" },
      { year: 1972, mvp: "Kerry Dineen", team: "Fairbanks Goldpanners" },
      { year: 1971, mvp: "Bruce Bochte", team: "Anchorage Glacier Pilots" },
      { year: 1970, mvp: "Al Gerhardt", team: "Grand Rapids Sullivans" },

      // 1960-1969
      { year: 1969, mvp: "Chris Chambliss", team: "Anchorage Glacier Pilots" },
      { year: 1968, mvp: "Joe Tanner", team: "Jackson Braves" },
      { year: 1967, mvp: "Frank Duffy", team: "Boulder Collegians" },
      { year: 1966, mvp: "Ray Henningsen", team: "Boulder Collegians" },
      { year: 1965, mvp: "Bob Boyd", team: "Rapid Transit Dreamliners" },
      { year: 1964, mvp: "Dick Sanders", team: "Wichita Service Auto Glass" },
      { year: 1963, mvp: "Sam Suplizio", team: "Fairbanks Goldpanners" },
      { year: 1962, mvp: "Rocky Krsnich", team: "Wichita Rapid Transit" },
      { year: 1961, mvp: "Al Ware", team: "Grand Rapids Sullivans" },
      { year: 1960, mvp: "Bob Seltzer", team: "Tampa Gibsonton" },

      // 1950-1959
      { year: 1959, mvp: "Clyde Girrens", team: "Wichita Weller" },
      { year: 1958, mvp: "Jim O'Rourke", team: "Drain Black Sox" },
      { year: 1957, mvp: "Wilmer Fields", team: "Ft. Wayne Dairymen" },
      { year: 1956, mvp: "Clyde McCullough", team: "Alpine Cowboys" },
      { year: 1955, mvp: "Daryl Spencer", team: "Wichita Boeing Bombers" },
      { year: 1954, mvp: "Donnie Lee", team: "Casa Grande Cotton Kings" },
      { year: 1953, mvp: "Robert McKee", team: "Ft. Leonard Wood Hilltoppers" },
      { year: 1952, mvp: "Danny O'Connell", team: "Ft. Meyer Colonials" },
      { year: 1951, mvp: "Steve Rapech", team: "Sinton Plymouth Oilers" },
      { year: 1950, mvp: "Pat Scantlebury", team: "Ft. Wayne Capeharts" },

      // 1940-1949
      { year: 1949, mvp: "Bill Ricks", team: "Ft. Wayne G-E Club" },
      { year: 1948, mvp: "Veo Story", team: "Chatham Blanketeers" },
      { year: 1947, mvp: "Bruno Konopka", team: "Golden Coors" },
      { year: 1946, mvp: "Les Lollis", team: "Carmichael Firemen" },
      { year: 1945, mvp: "Cot Deal", team: "Enid AFB Enidairs" },
      { year: 1944, mvp: "Cot Deal", team: "Enid AFB Enidairs" },
      { year: 1943, mvp: "George Archie", team: "Ft. Riley CRTC" },
      { year: 1942, mvp: "Ed Borom", team: "Wichita Boeing Bombers" },
      { year: 1941, mvp: "Red Barkley", team: "Enid Champlins" },
      { year: 1940, mvp: "Vance Cauble", team: "Enid Champlins" },

      // 1935-1939
      { year: 1939, mvp: "Roy Helser", team: "Silverton Red Sox" },
      { year: 1938, mvp: "Andy Johnson", team: "Buford Bona Allens" },
      { year: 1937, mvp: "Claude Gilchrist", team: "Enid Eason Oilers" },
      { year: 1936, mvp: "Harry White", team: "Duncan Cementers" },
      { year: 1935, mvp: "Satchel Paige", team: "Bismarck Corwin-Churchills" },
    ];

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const record of mvps) {
      try {
        const nameParts = record.mvp.split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ");

        // Find or create player
        let player = await client.query(
          "SELECT id FROM players WHERE first_name = $1 AND last_name = $2",
          [firstName, lastName]
        );

        let playerId;
        if (player.rows.length === 0) {
          player = await client.query(
            "INSERT INTO players (first_name, last_name) VALUES ($1, $2) RETURNING id",
            [firstName, lastName]
          );
          playerId = player.rows[0].id;
          created++;
        } else {
          playerId = player.rows[0].id;
        }

        // Update championship
        const result = await client.query(
          "UPDATE championships SET mvp_player_id = $1 WHERE year = $2 RETURNING id",
          [playerId, record.year]
        );

        if (result.rowCount > 0) {
          console.log(` ${record.year}: ${record.mvp}`);
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
    console.log(`    Players created: ${created}`);
    console.log(`    Championships updated: ${updated}`);
    console.log(`   ⏭  Skipped: ${skipped}`);
    console.log(`    Total: ${mvps.length}\n`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(" Import failed:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

importAllMVPs()
  .then(() => {
    console.log(" MVP import completed!\n");
    process.exit(0);
  })
  .catch(() => {
    console.error(" MVP import failed!\n");
    process.exit(1);
  });
