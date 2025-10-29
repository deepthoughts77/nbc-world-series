import axios from "axios";
import * as cheerio from "cheerio";
import { pool } from "../src/db.js";

async function scrapeNBCWebsite() {
  console.log("\n SCRAPING NBC BASEBALL WEBSITE\n");
  console.log("═".repeat(70));

  try {
    console.log(" Fetching data from nbcbaseball.com...\n");

    const response = await axios.get(
      "https://nbcbaseball.com/nbc-world-series-past-champs/",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        timeout: 10000,
      }
    );

    const $ = cheerio.load(response.data);
    const champions = [];

    // Log the HTML structure to help us identify the correct selectors
    console.log(" Analyzing page structure...\n");

    // Try to find tables
    const tables = $("table");
    console.log(`Found ${tables.length} table(s) on the page\n`);

    // Try different selectors
    $("table").each((index, table) => {
      console.log(`\n Table ${index + 1}:`);

      $(table)
        .find("tr")
        .each((rowIndex, row) => {
          const cells = $(row).find("td, th");
          const rowData = [];

          cells.each((cellIndex, cell) => {
            rowData.push($(cell).text().trim());
          });

          if (rowData.length > 0) {
            console.log(`  Row ${rowIndex + 1}: ${rowData.join(" | ")}`);

            // Try to extract year and champion
            if (rowData[0]?.match(/^\d{4}$/)) {
              champions.push({
                year: rowData[0],
                champion: rowData[1] || "Unknown",
                runnerUp: rowData[2] || null,
              });
            }
          }
        });
    });

    console.log("\n" + "═".repeat(70));
    console.log(` Found ${champions.length} championship records\n`);

    if (champions.length > 0) {
      console.log(" Sample data:");
      champions.slice(0, 5).forEach((c) => {
        console.log(
          `   ${c.year}: ${c.champion}${c.runnerUp ? ` vs ${c.runnerUp}` : ""}`
        );
      });
    }

    // Save to JSON for review
    const fs = await import("fs");
    fs.writeFileSync(
      "./data/scraped-champions.json",
      JSON.stringify(champions, null, 2)
    );
    console.log("\n Saved to data/scraped-champions.json\n");

    return champions;
  } catch (error) {
    console.error(" Scraping failed:", error.message);
    throw error;
  }
}

scrapeNBCWebsite()
  .then(() => {
    console.log(" Scraping completed!\n");
    process.exit(0);
  })
  .catch(() => {
    console.error(" Scraping failed!\n");
    process.exit(1);
  });
