import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Change these if needed
const START_YEAR = 1935;
const END_YEAR = 2025;

const FINALS_ROOT = path.join(__dirname, "../data/imports/finals");
const TEMPLATES_DIR = path.join(FINALS_ROOT, "_templates");

// Template files
const TEMPLATE_FINAL = path.join(
  TEMPLATES_DIR,
  "championship_final_TEMPLATE.csv",
);
const TEMPLATE_BATTING = path.join(
  TEMPLATES_DIR,
  "championship_final_batting_TEMPLATE.csv",
);
const TEMPLATE_PITCHING = path.join(
  TEMPLATES_DIR,
  "championship_final_pitching_TEMPLATE.csv",
);

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function safeCopyTemplate(templatePath, targetPath) {
  // Never overwrite real files you already created
  if (fs.existsSync(targetPath)) return { created: false, reason: "exists" };

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Missing template: ${templatePath}`);
  }

  fs.copyFileSync(templatePath, targetPath);
  return { created: true, reason: "copied" };
}

function main() {
  // Ensure base dirs exist
  ensureDir(FINALS_ROOT);
  ensureDir(TEMPLATES_DIR);
  ensureDir(path.join(FINALS_ROOT, "_incoming"));
  ensureDir(path.join(FINALS_ROOT, "_logs"));

  // Validate templates exist
  const missing = [TEMPLATE_FINAL, TEMPLATE_BATTING, TEMPLATE_PITCHING].filter(
    (p) => !fs.existsSync(p),
  );
  if (missing.length) {
    throw new Error(
      `Template(s) missing.\nCreate these first:\n- ${missing.join("\n- ")}`,
    );
  }

  let foldersCreated = 0;
  let filesCreated = 0;
  let filesSkipped = 0;

  for (let year = START_YEAR; year <= END_YEAR; year++) {
    const yearDir = path.join(FINALS_ROOT, String(year));
    if (!fs.existsSync(yearDir)) {
      ensureDir(yearDir);
      foldersCreated++;
    }

    const finalCsv = path.join(yearDir, `championship_final_${year}.csv`);
    const batCsv = path.join(yearDir, `championship_final_batting_${year}.csv`);
    const pitCsv = path.join(
      yearDir,
      `championship_final_pitching_${year}.csv`,
    );

    const r1 = safeCopyTemplate(TEMPLATE_FINAL, finalCsv);
    const r2 = safeCopyTemplate(TEMPLATE_BATTING, batCsv);
    const r3 = safeCopyTemplate(TEMPLATE_PITCHING, pitCsv);

    [r1, r2, r3].forEach((r) => {
      if (r.created) filesCreated++;
      else filesSkipped++;
    });
  }

  console.log("✅ Finals folder scaffold complete");
  console.log(`Years: ${START_YEAR} → ${END_YEAR}`);
  console.log(`Folders created: ${foldersCreated}`);
  console.log(`CSV files created: ${filesCreated}`);
  console.log(`CSV files skipped (already existed): ${filesSkipped}`);
  console.log(`Root: ${FINALS_ROOT}`);
}

main();
