-- ============================================================
-- MIGRATION: Add Modern Statistics Columns
-- Backward compatible - adds columns with NULL defaults
-- CORRECTED: Uses batting_stats (not player_stats)
-- ============================================================

BEGIN;

-- Add new columns to batting_stats
ALTER TABLE batting_stats ADD COLUMN IF NOT EXISTS jersey_num VARCHAR(3);
ALTER TABLE batting_stats ADD COLUMN IF NOT EXISTS avg DECIMAL(4,3);
ALTER TABLE batting_stats ADD COLUMN IF NOT EXISTS gp INTEGER;
ALTER TABLE batting_stats ADD COLUMN IF NOT EXISTS gs INTEGER;
ALTER TABLE batting_stats ADD COLUMN IF NOT EXISTS tb INTEGER;
ALTER TABLE batting_stats ADD COLUMN IF NOT EXISTS slg DECIMAL(4,3);
ALTER TABLE batting_stats ADD COLUMN IF NOT EXISTS bb INTEGER;
ALTER TABLE batting_stats ADD COLUMN IF NOT EXISTS hbp INTEGER;
ALTER TABLE batting_stats ADD COLUMN IF NOT EXISTS so INTEGER;
ALTER TABLE batting_stats ADD COLUMN IF NOT EXISTS gdp INTEGER;
ALTER TABLE batting_stats ADD COLUMN IF NOT EXISTS obp DECIMAL(4,3);
ALTER TABLE batting_stats ADD COLUMN IF NOT EXISTS sf INTEGER;
ALTER TABLE batting_stats ADD COLUMN IF NOT EXISTS sb_att INTEGER;
ALTER TABLE batting_stats ADD COLUMN IF NOT EXISTS fld DECIMAL(4,3);

-- Add new columns to pitching_stats
ALTER TABLE pitching_stats ADD COLUMN IF NOT EXISTS jersey_num VARCHAR(3);
ALTER TABLE pitching_stats ADD COLUMN IF NOT EXISTS era DECIMAL(5,2);
ALTER TABLE pitching_stats ADD COLUMN IF NOT EXISTS app INTEGER;
ALTER TABLE pitching_stats ADD COLUMN IF NOT EXISTS gs INTEGER;
ALTER TABLE pitching_stats ADD COLUMN IF NOT EXISTS cg INTEGER;
ALTER TABLE pitching_stats ADD COLUMN IF NOT EXISTS sho INTEGER;
ALTER TABLE pitching_stats ADD COLUMN IF NOT EXISTS cbo INTEGER;
ALTER TABLE pitching_stats ADD COLUMN IF NOT EXISTS sv INTEGER;
ALTER TABLE pitching_stats ADD COLUMN IF NOT EXISTS doubles INTEGER;
ALTER TABLE pitching_stats ADD COLUMN IF NOT EXISTS triples INTEGER;
ALTER TABLE pitching_stats ADD COLUMN IF NOT EXISTS hr INTEGER;
ALTER TABLE pitching_stats ADD COLUMN IF NOT EXISTS ab INTEGER;
ALTER TABLE pitching_stats ADD COLUMN IF NOT EXISTS b_avg DECIMAL(4,3);
ALTER TABLE pitching_stats ADD COLUMN IF NOT EXISTS bk INTEGER;
ALTER TABLE pitching_stats ADD COLUMN IF NOT EXISTS sfa INTEGER;
ALTER TABLE pitching_stats ADD COLUMN IF NOT EXISTS sha INTEGER;

COMMIT;

-- Migration complete
SELECT 'Migration complete! New columns added to batting_stats and pitching_stats.' AS status;
