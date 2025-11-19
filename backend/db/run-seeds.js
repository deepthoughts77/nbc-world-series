// backend/db/run-seeds.js

// Import seeds in the order you want them to run
import { run as seedCompleteChampionships } from "./seeds/010_seed_complete_championships.js";
import { run as seedModernWood } from "./seeds/020_seed_modern_wood_records.js";
import { run as seed2025Data } from "./seeds/030_seed_2025_data.js";
import { run as seedPlayerStats } from "./seeds/040_seed_player_stats.js";

const seeds = [
  { name: "010_seed_complete_championships", run: seedCompleteChampionships },
  { name: "020_seed_modern_wood_records", run: seedModernWood },
  { name: "030_seed_2025_data", run: seed2025Data },
  { name: "040_seed_player_stats", run: seedPlayerStats },
];

async function main() {
  console.log("=======================================");
  console.log("   Running database seed scripts");
  console.log("=======================================");

  for (const seed of seeds) {
    console.log(`\n Running seed: ${seed.name}`);
    try {
      await seed.run();
      console.log(`Finished: ${seed.name}`);
    } catch (err) {
      console.error(`Seed failed: ${seed.name}`);
      console.error(err);
      // Fail fast: if one seed fails, stop the whole process
      process.exit(1);
    }
  }

  console.log("\n All seeds completed successfully.\n");
  process.exit(0);
}

main().catch((err) => {
  console.error(" Unexpected error in run-seeds:", err);
  process.exit(1);
});
