-- ============================================================
-- VERIFICATION QUERIES - Check 2025 NBC Data Import
-- ============================================================

\echo '============================================================'
\echo 'VERIFICATION: 2025 NBC World Series Data Import'
\echo '============================================================'

\echo ''
\echo '1. CHECK RECORD COUNTS'
\echo '------------------------------------------------------------'

SELECT 
    'batting_stats' as table_name,
    COUNT(*) FILTER (WHERE year = 2025) as records_2025,
    COUNT(*) as total_records
FROM batting_stats
UNION ALL
SELECT 
    'pitching_stats',
    COUNT(*) FILTER (WHERE year = 2025),
    COUNT(*)
FROM pitching_stats;

\echo ''
\echo '2. CHECK NEW COLUMNS EXIST'
\echo '------------------------------------------------------------'

SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'batting_stats' 
AND column_name IN ('jersey_num', 'avg', 'obp', 'slg', 'ops')
ORDER BY column_name;

\echo ''
\echo '3. LIST ALL 2025 TEAMS'
\echo '------------------------------------------------------------'

SELECT DISTINCT team_name, COUNT(*) as players
FROM batting_stats
WHERE year = 2025
GROUP BY team_name
ORDER BY team_name;

\echo ''
\echo '4. SAMPLE 2025 BATTING DATA (Top 5 by AVG)'
\echo '------------------------------------------------------------'

SELECT player_name, team_name, avg, obp, slg, hr, rbi
FROM batting_stats
WHERE year = 2025 AND ab >= 10
ORDER BY avg DESC NULLS LAST
LIMIT 5;

\echo ''
\echo '5. SAMPLE 2025 PITCHING DATA (Top 5 by ERA)'
\echo '------------------------------------------------------------'

SELECT player_name, team_name, era, w, l, ip, so
FROM pitching_stats
WHERE year = 2025 AND ip >= 3
ORDER BY era ASC NULLS LAST
LIMIT 5;

\echo ''
\echo '6. CHECK FOR NULL REQUIRED FIELDS'
\echo '------------------------------------------------------------'

SELECT 
    'batting_stats' as table_name,
    COUNT(*) FILTER (WHERE year IS NULL) as null_year,
    COUNT(*) FILTER (WHERE team_name IS NULL) as null_team,
    COUNT(*) FILTER (WHERE player_name IS NULL) as null_player
FROM batting_stats WHERE year = 2025
UNION ALL
SELECT 
    'pitching_stats',
    COUNT(*) FILTER (WHERE year IS NULL),
    COUNT(*) FILTER (WHERE team_name IS NULL),
    COUNT(*) FILTER (WHERE player_name IS NULL)
FROM pitching_stats WHERE year = 2025;

\echo ''
\echo '7. VERIFY HISTORICAL DATA UNTOUCHED'
\echo '------------------------------------------------------------'

SELECT 
    year,
    COUNT(*) as records,
    COUNT(avg) as has_avg,
    COUNT(obp) as has_obp
FROM batting_stats
WHERE year < 2025
GROUP BY year
ORDER BY year;

\echo ''
\echo '============================================================'
\echo 'Verification Complete!'
\echo '============================================================'
\echo 'Expected Results:'
\echo '  - batting_stats 2025: 203 records'
\echo '  - pitching_stats 2025: 128 records'
\echo '  - 16 unique teams'
\echo '  - No NULL in required fields'
\echo '  - Historical data has NULL for new columns'
\echo '============================================================'
