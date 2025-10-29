import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query('select id, name from teams order by id');
    res.json(rows);
  } catch (e) {
    console.error('GET /teams error:', e);
    res.status(500).json({ error: 'DB query failed' });
  }
});

export default router;
