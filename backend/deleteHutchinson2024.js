import { pool } from './src/db.js';

async function deleteHutchinson() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Get Hutchinson team ID for 2024
    const teamResult = await client.query(
      "SELECT id FROM teams WHERE name LIKE '%Hutchinson%'"
    );
    
    if (teamResult.rows.length === 0) {
      console.log('‚ùå Hutchinson team not found');
      return;
    }
    
    const teamId = teamResult.rows[0].id;
    console.log(`Ì¥ç Found Hutchinson team ID: ${teamId}`);
    
    // Delete batting stats for 2024
    const battingResult = await client.query(
      'DELETE FROM batting_stats WHERE team_id = $1 AND year = 2024',
      [teamId]
    );
    console.log(`Ì∑ëÔ∏è  Deleted ${battingResult.rowCount} batting records`);
    
    // Delete pitching stats for 2024
    const pitchingResult = await client.query(
      'DELETE FROM pitching_stats WHERE team_id = $1 AND year = 2024',
      [teamId]
    );
    console.log(`Ì∑ëÔ∏è  Deleted ${pitchingResult.rowCount} pitching records`);
    
    await client.query('COMMIT');
    console.log('‚úÖ Hutchinson Monarchs 2024 data deleted successfully!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('‚ùå Error:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

deleteHutchinson();
