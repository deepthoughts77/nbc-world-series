-- Migration: Add 2025 NBC World Series columns
-- This adds all the additional stat columns needed for 2025 data

-- ============================================================
-- BATTING_STATS TABLE UPDATES
-- ============================================================

-- Add jersey number and position (if not exists)
ALTER TABLE batting_stats 
ADD COLUMN IF NOT EXISTS jersey_num INTEGER,
ADD COLUMN IF NOT EXISTS position VARCHAR(10);

-- Add missing batting statistics columns
ALTER TABLE batting_stats 
ADD COLUMN IF NOT EXISTS gs INTEGER,         -- Games Started
ADD COLUMN IF NOT EXISTS tb INTEGER,         -- Total Bases
ADD COLUMN IF NOT EXISTS hbp INTEGER,        -- Hit By Pitch
ADD COLUMN IF NOT EXISTS gdp INTEGER,        -- Ground into Double Play
ADD COLUMN IF NOT EXISTS sf INTEGER,         -- Sacrifice Flies
ADD COLUMN IF NOT EXISTS sh INTEGER,         -- Sacrifice Hits
ADD COLUMN IF NOT EXISTS att INTEGER,        -- Steal Attempts
ADD COLUMN IF NOT EXISTS po INTEGER,         -- Putouts
ADD COLUMN IF NOT EXISTS a INTEGER,          -- Assists
ADD COLUMN IF NOT EXISTS e INTEGER,          -- Errors
ADD COLUMN IF NOT EXISTS fld DECIMAL(5,3);   -- Fielding Percentage

-- Add calculated stat columns (if not already present)
ALTER TABLE batting_stats 
ADD COLUMN IF NOT EXISTS avg DECIMAL(5,3),   -- Batting Average
ADD COLUMN IF NOT EXISTS slg DECIMAL(5,3),   -- Slugging Percentage
ADD COLUMN IF NOT EXISTS obp DECIMAL(5,3);   -- On-Base Percentage

-- ============================================================
-- PITCHING_STATS TABLE UPDATES
-- ============================================================

-- Add jersey number (if not exists)
ALTER TABLE pitching_stats 
ADD COLUMN IF NOT EXISTS jersey_num INTEGER;

-- Add missing pitching statistics columns
ALTER TABLE pitching_stats 
ADD COLUMN IF NOT EXISTS gs INTEGER,         -- Games Started
ADD COLUMN IF NOT EXISTS cg INTEGER,         -- Complete Games
ADD COLUMN IF NOT EXISTS sho INTEGER,        -- Shutouts
ADD COLUMN IF NOT EXISTS cbo INTEGER,        -- Combined Shutouts
ADD COLUMN IF NOT EXISTS sv INTEGER,         -- Saves
ADD COLUMN IF NOT EXISTS "2b" INTEGER,       -- Doubles Allowed
ADD COLUMN IF NOT EXISTS "3b" INTEGER,       -- Triples Allowed
ADD COLUMN IF NOT EXISTS ab INTEGER,         -- At Bats Against
ADD COLUMN IF NOT EXISTS b_avg DECIMAL(5,3), -- Batting Average Against
ADD COLUMN IF NOT EXISTS wp INTEGER,         -- Wild Pitches
ADD COLUMN IF NOT EXISTS hbp INTEGER,        -- Hit Batters
ADD COLUMN IF NOT EXISTS bk INTEGER,         -- Balks
ADD COLUMN IF NOT EXISTS sfa INTEGER,        -- Sacrifice Flies Allowed
ADD COLUMN IF NOT EXISTS sha INTEGER,        -- Sacrifice Hits Allowed
ADD COLUMN IF NOT EXISTS era DECIMAL(6,2);   -- Earned Run Average

-- ============================================================
-- UPDATE EXISTING PLAYER_STATS FOR COMPATIBILITY
-- ============================================================

-- Add year column if it doesn't exist (for backwards compatibility)
ALTER TABLE player_stats 
ADD COLUMN IF NOT EXISTS year INTEGER;

-- ============================================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================================

-- Batting stats indexes
CREATE INDEX IF NOT EXISTS idx_batting_stats_year ON batting_stats(year);
CREATE INDEX IF NOT EXISTS idx_batting_stats_team ON batting_stats(team_id);
CREATE INDEX IF NOT EXISTS idx_batting_stats_player ON batting_stats(player_id);
CREATE INDEX IF NOT EXISTS idx_batting_stats_year_team ON batting_stats(year, team_id);

-- Pitching stats indexes
CREATE INDEX IF NOT EXISTS idx_pitching_stats_year ON pitching_stats(year);
CREATE INDEX IF NOT EXISTS idx_pitching_stats_team ON pitching_stats(team_id);
CREATE INDEX IF NOT EXISTS idx_pitching_stats_player ON pitching_stats(player_id);
CREATE INDEX IF NOT EXISTS idx_pitching_stats_year_team ON pitching_stats(year, team_id);

-- ============================================================
-- CREATE VIEWS FOR EASY QUERYING
-- ============================================================

-- Drop old views if they exist
DROP VIEW IF EXISTS player_stats_all CASCADE;
DROP VIEW IF EXISTS pitching_stats_all CASCADE;

-- Complete batting stats view
CREATE OR REPLACE VIEW player_stats_all AS
SELECT 
  b.id,
  b.year,
  t.name AS team_name,
  CONCAT(p.first_name, ' ', p.last_name) AS player_name,
  b.jersey_num,
  b.position,
  b.avg,
  b.gp,
  b.gs,
  b.ab,
  b.r,
  b.h,
  b."2b",
  b."3b",
  b.hr,
  b.rbi,
  b.tb,
  b.slg,
  b.bb,
  b.hbp,
  b.so,
  b.gdp,
  b.obp,
  b.sf,
  b.sh,
  b.sb,
  b.att,
  b.po,
  b.a,
  b.e,
  b.fld
FROM batting_stats b
JOIN players p ON b.player_id = p.id
JOIN teams t ON b.team_id = t.id;

-- Complete pitching stats view
CREATE OR REPLACE VIEW pitching_stats_all AS
SELECT 
  ps.id,
  ps.year,
  t.name AS team_name,
  CONCAT(p.first_name, ' ', p.last_name) AS player_name,
  ps.jersey_num,
  ps.app AS g,
  ps.w,
  ps.l,
  ps.app,
  ps.gs,
  ps.cg,
  ps.sho,
  ps.cbo,
  ps.sv,
  ps.ip,
  ps.h,
  ps.r,
  ps.er,
  ps.bb,
  ps.so,
  ps."2b" AS doubles,
  ps."3b" AS triples,
  ps.hr,
  ps.ab,
  ps.b_avg,
  ps.wp,
  ps.hbp,
  ps.bk,
  ps.sfa,
  ps.sha,
  ps.era
FROM pitching_stats ps
JOIN players p ON ps.player_id = p.id
JOIN teams t ON ps.team_id = t.id;

-- ============================================================
-- GRANT PERMISSIONS (adjust as needed for your setup)
-- ============================================================

-- Grant SELECT on views to your application user
-- GRANT SELECT ON player_stats_all TO your_app_user;
-- GRANT SELECT ON pitching_stats_all TO your_app_user;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Check batting_stats structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'batting_stats'
ORDER BY ordinal_position;

-- Check pitching_stats structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'pitching_stats'
ORDER BY ordinal_position;

-- Verify indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename IN ('batting_stats', 'pitching_stats')
ORDER BY tablename, indexname;

-- ============================================================
-- NOTES
-- ============================================================

/*
This migration adds all columns necessary for 2025 NBC World Series data:

BATTING ADDITIONS:
- jersey_num, position (player info)
- gs, tb, hbp, gdp, sf, sh, att (stats)
- po, a, e, fld (fielding)
- avg, slg, obp (calculated stats)

PITCHING ADDITIONS:
- jersey_num (player info)
- gs, cg, sho, cbo, sv (game stats)
- 2b, 3b, ab, b_avg (opponent batting)
- wp, hbp, bk, sfa, sha (additional stats)
- era (earned run average)

All columns use IF NOT EXISTS to safely run on existing databases.
Views provide easy access to complete stat sets with joined data.
*/
