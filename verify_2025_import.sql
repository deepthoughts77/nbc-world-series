-- ============================================================
-- VERIFICATION: 2025 NBC World Series Import
-- ============================================================

\echo '============================================================'
\echo 'VERIFICATION: 2025 NBC World Series Data'
\echo '============================================================'

\echo ''
\echo '1. RECORD COUNTS'
\echo '------------------------------------------------------------'

SELECT 
    'Batting stats (2025)' as metric,
    COUNT(*) as count
FROM batting_stats
WHERE year = 2025
UNION ALL
SELECT 
    'Pitching stats (2025)',
    COUNT(*)
FROM pitching_stats
WHERE year = 2025
UNION ALL
SELECT
    'Unique teams (2025)',
    COUNT(DISTINCT team_id)
FROM batting_stats
WHERE year = 2025
UNION ALL
SELECT
    'Unique players (2025)',
    COUNT(DISTINCT player_id)
FROM (
    SELECT player_id FROM batting_stats WHERE year = 2025
    UNION
    SELECT player_id FROM pitching_stats WHERE year = 2025
) players;

\echo ''
\echo '2. TEAM LIST'
\echo '------------------------------------------------------------'

SELECT DISTINCT t.name, COUNT(b.id) as batting_records
FROM teams t
JOIN batting_stats b ON t.id = b.team_id
WHERE b.year = 2025
GROUP BY t.name
ORDER BY t.name;

\echo ''
\echo '3. TOP BATTERS (by AVG, min 10 AB)'
\echo '------------------------------------------------------------'

SELECT 
    p.first_name || ' ' || p.last_name as player,
    t.name as team,
    b.avg,
    b.obp,
    b.slg,
    b.hr,
    b.rbi
FROM batting_stats b
JOIN players p ON b.player_id = p.id
JOIN teams t ON b.team_id = t.id
WHERE b.year = 2025 AND b.ab >= 10
ORDER BY b.avg DESC NULLS LAST
LIMIT 10;

\echo ''
\echo '4. TOP PITCHERS (by ERA, min 3 IP)'
\echo '------------------------------------------------------------'

SELECT 
    p.first_name || ' ' || p.last_name as player,
    t.name as team,
    ps.era,
    ps.w,
    ps.l,
    ps.ip,
    ps.so
FROM pitching_stats ps
JOIN players p ON ps.player_id = p.id
JOIN teams t ON ps.team_id = t.id
WHERE ps.year = 2025 AND ps.ip >= 3
ORDER BY ps.era ASC NULLS LAST
LIMIT 10;

\echo ''
\echo '5. CHECK FOR ISSUES'
\echo '------------------------------------------------------------'

SELECT 
    'Missing player_id' as issue,
    COUNT(*) as count
FROM batting_stats
WHERE year = 2025 AND player_id IS NULL
UNION ALL
SELECT 
    'Missing team_id',
    COUNT(*)
FROM batting_stats
WHERE year = 2025 AND team_id IS NULL
UNION ALL
SELECT 
    'Missing season_key',
    COUNT(*)
FROM batting_stats
WHERE year = 2025 AND season_key IS NULL;

\echo ''
\echo '============================================================'
\echo 'Expected Results:'
\echo '  - Batting: 203 records'
\echo '  - Pitching: 128 records'
\echo '  - Teams: 16'
\echo '  - Players: ~205 unique'
\echo '  - No missing FKs or season_keys'
\echo '============================================================'
