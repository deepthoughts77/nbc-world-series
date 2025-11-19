import fs from "fs";
import * as pdf from "pdf-parse";
import { pool } from "../src/db.js";

async function parsePDFRecords() {
  console.log("\n PARSING PDF RECORDS\n");
  console.log("═".repeat(70));

  try {
    // List all PDFs in a folder
    const pdfFolder = "./data/pdfs";

    if (!fs.existsSync(pdfFolder)) {
      console.log(" Creating pdfs folder...");
      fs.mkdirSync(pdfFolder, { recursive: true });
      console.log("\n Please place your PDF files in backend/data/pdfs/\n");
      return;
    }

    const pdfFiles = fs
      .readdirSync(pdfFolder)
      .filter((f) => f.endsWith(".pdf"));

    console.log(` Found ${pdfFiles.length} PDF file(s)\n`);

    for (const pdfFile of pdfFiles) {
      console.log(`\n Processing: ${pdfFile}`);

      const dataBuffer = fs.readFileSync(`${pdfFolder}/${pdfFile}`);
      const data = await pdf(dataBuffer);

      console.log(`   Pages: ${data.numpages}`);
      console.log(`   Text length: ${data.text.length} characters\n`);

      // Save extracted text for analysis
      fs.writeFileSync(`./data/extracted-${pdfFile}.txt`, data.text);

      console.log(`    Saved extracted text to data/extracted-${pdfFile}.txt`);

      // Parse specific patterns
      parseRecordsFromText(data.text, pdfFile);
    }
  } catch (error) {
    console.error(" PDF parsing failed:", error.message);
    throw error;
  }
}

function parseRecordsFromText(text, filename) {
  console.log(`\n    Analyzing content from ${filename}...`);

  // Look for patterns like "Year: 2024, Champion: Team Name"
  const championPattern = /(\d{4}).*?champion.*?:?\s*([A-Za-z\s]+)/gi;
  const matches = [...text.matchAll(championPattern)];

  if (matches.length > 0) {
    console.log(`    Found ${matches.length} potential championship records`);
  }

  // Look for batting records
  if (text.includes("batting average") || text.includes("BATTING")) {
    console.log("    Contains batting statistics");
  }

  // Look for pitching records
  if (text.includes("ERA") || text.includes("strikeout")) {
    console.log("    Contains pitching statistics");
  }
}

parsePDFRecords()
  .then(() => {
    console.log("\n PDF parsing completed!\n");
    process.exit(0);
  })
  .catch(() => {
    console.error("\n PDF parsing failed!\n");
    process.exit(1);
  });
