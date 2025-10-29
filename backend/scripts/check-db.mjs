import 'dotenv/config';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

try {
  const { rows } = await pool.query('select current_user, current_database(), now() as time');
  console.log('DB OK:', rows[0]);
} catch (e) {
  console.error('DB error:', e.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
