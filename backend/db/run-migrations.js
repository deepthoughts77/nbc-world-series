import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  console.log('íº€ Running database migrations...\n');
  
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).sort();
  
  for (const file of files) {
    if (!file.endsWith('.js')) continue;
    
    console.log(`í³„ Running migration: ${file}\n`);
    
    const migrationPath = path.join(migrationsDir, file);
    
    // Run each migration as a separate process
    await new Promise((resolve, reject) => {
      const child = spawn('node', [migrationPath], {
        stdio: 'inherit',
        env: process.env
      });
      
      child.on('exit', (code) => {
        if (code === 0) {
          console.log(`\nâœ… ${file} completed\n`);
          resolve();
        } else {
          reject(new Error(`${file} failed with code ${code}`));
        }
      });
      
      child.on('error', reject);
    });
  }
  
  console.log('í¾‰ All migrations completed successfully!');
}

runMigrations().catch(error => {
  console.error('âŒ Migration failed:', error.message);
  process.exit(1);
});
