-- ================================================
-- NBC World Series Database Migration
-- Add 2025 Statistics Columns
-- ================================================
-- This migration adds new columns to support 2025 modern statistics
-- while maintaining backward compatibility with historical data (1966, etc.)

-- ================================================
-- PLAYER_STATS TABLE - Add Advanced Batting Stats
-- ================================================

ALTER TABLE player_stats 
ADD COLUMN IF NOT EXISTS jersey_num VARCHAR(3),
ADD COLUMN IF NOT EXISTS avg DECIMAL(4,3),
ADD COLUMN IF NOT EXISTS gp INTEGER,
ADD COLUMN IF NOT EXISTS gs INTEGER,
ADD COLUMN IF NOT EXISTS tb INTEGER,
ADD COLUMN IF NOT EXISTS slg DECIMAL(4,3),
ADD COLUMN IF NOT EXISTS bb INTEGER,
ADD COLUMN IF NOT EXISTS hbp INTEGER,
ADD COLUMN IF NOT EXISTS so INTEGER,
ADD COLUMN IF NOT EXISTS gdp INTEGER,
ADD COLUMN IF NOT EXISTS obp DECIMAL(4,3),
ADD COLUMN IF NOT EXISTS sf INTEGER,
ADD COLUMN IF NOT EXISTS sb_att INTEGER,
ADD COLUMN IF NOT EXISTS fld DECIMAL(4,3);

-- ================================================
-- PITCHING_STATS TABLE - Add Advanced Pitching Stats  
-- ================================================

ALTER TABLE pitching_stats
ADD COLUMN IF NOT EXISTS jersey_num VARCHAR(3),
ADD COLUMN IF NOT EXISTS era DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS app INTEGER,
ADD COLUMN IF NOT EXISTS gs INTEGER,
ADD COLUMN IF NOT EXISTS cg INTEGER,
ADD COLUMN IF NOT EXISTS sho INTEGER,
ADD COLUMN IF NOT EXISTS cbo INTEGER,
ADD COLUMN IF NOT EXISTS sv INTEGER,
ADD COLUMN IF NOT EXISTS doubles INTEGER,
ADD COLUMN IF NOT EXISTS triples INTEGER,
ADD COLUMN IF NOT EXISTS hr INTEGER,
ADD COLUMN IF NOT EXISTS ab INTEGER,
ADD COLUMN IF NOT EXISTS b_avg DECIMAL(4,3),
ADD COLUMN IF NOT EXISTS bk INTEGER,
ADD COLUMN IF NOT EXISTS sfa INTEGER,
ADD COLUMN IF NOT EXISTS sha INTEGER;

-- ================================================
-- Verify Migration
-- ================================================
SELECT 'Migration complete! New columns added.' AS status;
