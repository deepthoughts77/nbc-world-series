/**
 * NBC World Series 2025 Data Verification Script (ES Module Version)
 * Run: node verify_2025_json.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXPECTED_BATTING_FIELDS = [
  "jersey_num",
  "player_name",
  "avg",
  "gp",
  "gs",
  "ab",
  "r",
  "h",
  "2b",
  "3b",
  "hr",
  "rbi",
  "tb",
  "slg",
  "bb",
  "hbp",
  "so",
  "gdp",
  "obp",
  "sf",
  "sh",
  "sb",
  "att",
  "po",
  "a",
  "e",
  "fld",
];

const EXPECTED_PITCHING_FIELDS = [
  "jersey_num",
  "player_name",
  "era",
  "w",
  "l",
  "app",
  "gs",
  "cg",
  "sho",
  "cbo",
  "sv",
  "ip",
  "h",
  "r",
  "er",
  "bb",
  "so",
  "2b",
  "3b",
  "hr",
  "ab",
  "b_avg",
  "wp",
  "hbp",
  "bk",
  "sfa",
  "sha",
];

const EXPECTED_TEAMS = [
  "Hutchinson Monarchs",
  "Lonestar Kraken TX",
  "Hays Larks",
  "Seattle Studs",
  "Alaska Goldpanners",
  "Santa Barbara Foresters",
  "Derby Twins",
  "San Diego Stars",
  "Junction City Brigade",
  "Top Prospect Academy",
  "Seattle Blackfins",
  "Lonestar TX Baseball Club",
  "Dodge City A's",
  "BTL Hornets",
  "MVP Oklahoma",
  "GPX TX Legends",
];

function loadJSON() {
  try {
    const jsonPath = path.join(__dirname, "nbc_2025_stats.json");
    const data = fs.readFileSync(jsonPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("❌ ERROR: Could not load nbc_2025_stats.json");
    console.error(
      "   Make sure the file is in the same directory as this script."
    );
    process.exit(1);
  }
}

function verifyTeamCount(data) {
  console.log("\n📊 TEAM COUNT VERIFICATION");
  console.log("═".repeat(60));
  const teamCount = data.teams.length;
  const expected = 16;
  if (teamCount === expected) {
    console.log(`✅ Team count: ${teamCount}/${expected}`);
  } else {
    console.log(`❌ Team count: ${teamCount}/${expected}`);
  }
  return teamCount === expected;
}

function verifyTeamNames(data) {
  console.log("\n🏆 TEAM NAMES VERIFICATION");
  console.log("═".repeat(60));
  const foundTeams = data.teams.map((t) => t.name);
  const missing = EXPECTED_TEAMS.filter((t) => !foundTeams.includes(t));
  const extra = foundTeams.filter((t) => !EXPECTED_TEAMS.includes(t));
  if (missing.length === 0 && extra.length === 0) {
    console.log("✅ All 16 team names match PDF exactly");
  } else {
    if (missing.length > 0) {
      console.log(`❌ Missing teams (${missing.length}):`);
      missing.forEach((t) => console.log(`   - ${t}`));
    }
    if (extra.length > 0) {
      console.log(`❌ Extra teams (${extra.length}):`);
      extra.forEach((t) => console.log(`   - ${t}`));
    }
  }
  return missing.length === 0 && extra.length === 0;
}

function verifyBattingFields(data) {
  console.log("\n⚾ BATTING FIELDS VERIFICATION");
  console.log("═".repeat(60));
  let allCorrect = true;
  let totalBatters = 0;
  data.teams.forEach((team) => {
    const batters = team.batting || [];
    totalBatters += batters.length;
    batters.forEach((batter, idx) => {
      const fields = Object.keys(batter);
      const missing = EXPECTED_BATTING_FIELDS.filter(
        (f) => !fields.includes(f)
      );
      if (missing.length > 0) {
        allCorrect = false;
        console.log(
          `❌ ${team.name} - Batter #${idx + 1}: Missing ${missing.join(", ")}`
        );
      }
    });
  });
  if (allCorrect) {
    console.log(`✅ All ${totalBatters} batters have correct 27 fields`);
  }
  return allCorrect;
}

function verifyPitchingFields(data) {
  console.log("\n🥎 PITCHING FIELDS VERIFICATION");
  console.log("═".repeat(60));
  let allCorrect = true;
  let totalPitchers = 0;
  data.teams.forEach((team) => {
    const pitchers = team.pitching || [];
    totalPitchers += pitchers.length;
    pitchers.forEach((pitcher, idx) => {
      const fields = Object.keys(pitcher);
      const missing = EXPECTED_PITCHING_FIELDS.filter(
        (f) => !fields.includes(f)
      );
      if (missing.length > 0) {
        allCorrect = false;
        console.log(
          `❌ ${team.name} - Pitcher #${idx + 1}: Missing ${missing.join(", ")}`
        );
      }
    });
  });
  if (allCorrect) {
    console.log(`✅ All ${totalPitchers} pitchers have correct 27 fields`);
  }
  return allCorrect;
}

function verifyPlayerCounts(data) {
  console.log("\n👥 PLAYER COUNT VERIFICATION");
  console.log("═".repeat(60));
  let totalBatters = 0;
  let totalPitchers = 0;
  data.teams.forEach((team) => {
    const batterCount = (team.batting || []).length;
    const pitcherCount = (team.pitching || []).length;
    totalBatters += batterCount;
    totalPitchers += pitcherCount;
    console.log(
      `   ${team.name.padEnd(30)} Batters: ${String(batterCount).padStart(
        2
      )}  Pitchers: ${String(pitcherCount).padStart(2)}`
    );
  });
  console.log("─".repeat(60));
  console.log(
    `   ${"TOTAL".padEnd(30)} Batters: ${String(totalBatters).padStart(
      2
    )}  Pitchers: ${String(totalPitchers).padStart(2)}`
  );
  const expectedBatters = 198;
  const expectedPitchers = 167;
  if (totalBatters === expectedBatters && totalPitchers === expectedPitchers) {
    console.log(`\n✅ Player counts match PDF exactly!`);
  } else {
    console.log(
      `\n❌ Batters: ${totalBatters}/${expectedBatters}, Pitchers: ${totalPitchers}/${expectedPitchers}`
    );
  }
  return totalBatters === expectedBatters && totalPitchers === expectedPitchers;
}

function main() {
  console.log(
    "\n╔═══════════════════════════════════════════════════════════╗"
  );
  console.log("║   NBC WORLD SERIES 2025 DATA VERIFICATION               ║");
  console.log("╚═══════════════════════════════════════════════════════════╝");
  const data = loadJSON();
  const results = {
    teamCount: verifyTeamCount(data),
    teamNames: verifyTeamNames(data),
    playerCounts: verifyPlayerCounts(data),
    battingFields: verifyBattingFields(data),
    pitchingFields: verifyPitchingFields(data),
  };
  console.log(
    "\n╔═══════════════════════════════════════════════════════════╗"
  );
  console.log("║   VERIFICATION SUMMARY                                    ║");
  console.log(
    "╚═══════════════════════════════════════════════════════════╝\n"
  );
  [
    ["Team Count", results.teamCount],
    ["Team Names", results.teamNames],
    ["Player Counts", results.playerCounts],
    ["Batting Fields", results.battingFields],
    ["Pitching Fields", results.pitchingFields],
  ].forEach(([name, passed]) => {
    console.log(`   ${passed ? "✅" : "❌"} ${name}`);
  });
  const allPassed = Object.values(results).every((r) => r === true);
  console.log(
    allPassed
      ? "\n🎉 ALL CHECKS PASSED! Data is ready for import.\n"
      : "\n⚠️  SOME CHECKS FAILED. Please review issues above.\n"
  );
}

main();
