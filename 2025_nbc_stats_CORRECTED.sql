-- ============================================================
-- 2025 NBC WORLD SERIES COMPLETE STATISTICS - CORRECTED
-- ============================================================
-- CORRECTED: Uses batting_stats (not player_stats)
-- CORRECTED: Proper apostrophe escaping for team names
-- Teams: All 16 teams (Champion to 15th place)
-- ============================================================

BEGIN;

-- ============================================================
-- BATTING STATISTICS (203 records)
-- ============================================================

-- Hutchinson Monarchs: Jake Gutierrez
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Hutchinson Monarchs', 'Jake Gutierrez', '27', NULL,
    7, 29, 11, 16, 
    3, 0, 0, 10, 
    1, 0, 14, 0, 
    1, 0.933,
    0.552, 7, 7, 19, 
    0.655, 3, 0, 3, 
    1, 0.559, 2, 1, 
    0.933
);

-- Hutchinson Monarchs: Drew Bugner
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Hutchinson Monarchs', 'Drew Bugner', '13', NULL,
    7, 30, 10, 14, 
    2, 0, 0, 11, 
    1, 0, 10, 11, 
    0, 1.000,
    0.467, 7, 7, 16, 
    0.533, 3, 0, 5, 
    4, 0.500, 1, 1, 
    1.000
);

-- Hutchinson Monarchs: Blake Bradford
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Hutchinson Monarchs', 'Blake Bradford', '10', NULL,
    6, 18, 6, 7, 
    2, 0, 0, 3, 
    1, 0, 4, 5, 
    0, 1.000,
    0.389, 6, 6, 9, 
    0.500, 3, 5, 1, 
    0, 0.577, 0, 2, 
    1.000
);

-- Hutchinson Monarchs: Jaden Gustafson
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Hutchinson Monarchs', 'Jaden Gustafson', '14', NULL,
    7, 26, 9, 10, 
    4, 1, 0, 8, 
    1, 0, 10, 1, 
    0, 1.000,
    0.385, 7, 7, 16, 
    0.615, 5, 0, 1, 
    0, 0.484, 0, 1, 
    1.000
);

-- Hutchinson Monarchs: Dylan Bell
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Hutchinson Monarchs', 'Dylan Bell', '18', NULL,
    7, 19, 8, 7, 
    2, 0, 1, 5, 
    1, 0, 14, 0, 
    1, 0.933,
    0.368, 7, 7, 12, 
    0.632, 4, 4, 5, 
    0, 0.556, 0, 1, 
    0.933
);

-- Hutchinson Monarchs: Tyson Vassart
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Hutchinson Monarchs', 'Tyson Vassart', '36', NULL,
    6, 22, 3, 6, 
    2, 0, 0, 6, 
    0, 0, 0, 0, 
    0, NULL,
    0.273, 6, 6, 8, 
    0.364, 2, 2, 5, 
    2, 0.370, 1, 0, 
    NULL
);

-- Hutchinson Monarchs: Keegan Demmer
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Hutchinson Monarchs', 'Keegan Demmer', '20', NULL,
    5, 15, 3, 4, 
    1, 0, 0, 3, 
    0, 0, 32, 2, 
    0, 1.000,
    0.267, 5, 4, 5, 
    0.333, 5, 0, 5, 
    1, 0.450, 0, 0, 
    1.000
);

-- Hutchinson Monarchs: AJ Mustow
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Hutchinson Monarchs', 'AJ Mustow', '35', NULL,
    6, 21, 4, 4, 
    0, 1, 0, 5, 
    0, 0, 22, 4, 
    0, 1.000,
    0.190, 6, 5, 6, 
    0.286, 1, 1, 6, 
    0, 0.261, 0, 0, 
    1.000
);

-- Hutchinson Monarchs: Jake Knox
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Hutchinson Monarchs', 'Jake Knox', '33', NULL,
    4, 10, 1, 4, 
    1, 0, 0, 3, 
    0, 0, 27, 3, 
    0, 1.000,
    0.400, 4, 3, 5, 
    0.500, 0, 1, 2, 
    0, 0.455, 0, 0, 
    1.000
);

-- Hutchinson Monarchs: JJ Spafford
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Hutchinson Monarchs', 'JJ Spafford', '2', NULL,
    5, 13, 5, 4, 
    0, 0, 0, 1, 
    2, 1, 3, 6, 
    1, 0.900,
    0.308, 5, 4, 4, 
    0.308, 3, 0, 3, 
    0, 0.438, 0, 2, 
    0.900
);

-- Hutchinson Monarchs: Joey Senstock
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Hutchinson Monarchs', 'Joey Senstock', '11', NULL,
    5, 15, 3, 3, 
    2, 0, 0, 2, 
    0, 0, 0, 13, 
    0, 1.000,
    0.200, 5, 4, 5, 
    0.333, 2, 0, 8, 
    0, 0.294, 0, 0, 
    1.000
);

-- Hutchinson Monarchs: Jackson Legg
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Hutchinson Monarchs', 'Jackson Legg', '21', NULL,
    5, 10, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 22, 0, 
    0, 1.000,
    0.000, 5, 3, 0, 
    0.000, 1, 1, 2, 
    0, 0.167, 0, 0, 
    1.000
);

-- Hutchinson Monarchs: Jarrett Herrmann
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Hutchinson Monarchs', 'Jarrett Herrmann', '3', NULL,
    3, 3, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 4, 0, 
    2, 0.667,
    0.000, 3, 0, 0, 
    0.000, 0, 0, 2, 
    0, 0.000, 0, 0, 
    0.667
);

-- Lonestar Kraken TX: Kenner Lauterbach
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Lonestar Kraken TX', 'Kenner Lauterbach', '42', NULL,
    7, 23, 6, 9, 
    1, 0, 0, 0, 
    0, 0, 6, 18, 
    3, 0.889,
    0.391, 7, 6, 10, 
    0.435, 1, 0, 4, 
    0, 0.417, 0, 0, 
    0.889
);

-- Lonestar Kraken TX: Kado Robardy
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Lonestar Kraken TX', 'Kado Robardy', '2', NULL,
    7, 18, 8, 7, 
    1, 0, 0, 3, 
    2, 0, 9, 0, 
    1, 0.900,
    0.389, 7, 7, 8, 
    0.444, 9, 0, 1, 
    0, 0.593, 0, 3, 
    0.900
);

-- Lonestar Kraken TX: Preston Curtis
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Lonestar Kraken TX', 'Preston Curtis', '13', NULL,
    6, 24, 4, 9, 
    3, 0, 0, 10, 
    3, 0, 11, 0, 
    0, 1.000,
    0.375, 6, 6, 12, 
    0.500, 2, 1, 3, 
    0, 0.429, 1, 3, 
    1.000
);

-- Lonestar Kraken TX: JT Simonelli
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Lonestar Kraken TX', 'JT Simonelli', '67', NULL,
    7, 27, 7, 8, 
    2, 0, 0, 3, 
    1, 0, 21, 1, 
    2, 0.917,
    0.296, 7, 7, 10, 
    0.370, 4, 3, 9, 
    1, 0.429, 1, 2, 
    0.917
);

-- Lonestar Kraken TX: Chase Pendley
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Lonestar Kraken TX', 'Chase Pendley', '1', NULL,
    6, 17, 6, 5, 
    2, 0, 0, 5, 
    2, 0, 6, 15, 
    0, 1.000,
    0.294, 6, 6, 7, 
    0.412, 8, 2, 4, 
    1, 0.517, 2, 3, 
    1.000
);

-- Lonestar Kraken TX: Ethan Ho
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Lonestar Kraken TX', 'Ethan Ho', '20', NULL,
    6, 26, 3, 7, 
    3, 0, 1, 4, 
    0, 0, 49, 1, 
    2, 0.962,
    0.269, 6, 6, 13, 
    0.500, 2, 0, 7, 
    2, 0.321, 0, 0, 
    0.962
);

-- Lonestar Kraken TX: Josh Livingston
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Lonestar Kraken TX', 'Josh Livingston', '45', NULL,
    7, 27, 5, 6, 
    1, 0, 2, 11, 
    1, 0, 38, 10, 
    0, 1.000,
    0.222, 7, 7, 13, 
    0.481, 6, 0, 8, 
    0, 0.343, 2, 1, 
    1.000
);

-- Lonestar Kraken TX: Diego Gonzalez
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Lonestar Kraken TX', 'Diego Gonzalez', '9', NULL,
    6, 21, 3, 3, 
    0, 0, 1, 4, 
    0, 0, 21, 0, 
    0, 1.000,
    0.143, 6, 5, 6, 
    0.286, 4, 1, 3, 
    0, 0.296, 1, 0, 
    1.000
);

-- Lonestar Kraken TX: Major Brignon
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Lonestar Kraken TX', 'Major Brignon', '21', NULL,
    7, 15, 5, 2, 
    0, 1, 0, 4, 
    1, 3, 6, 10, 
    0, 1.000,
    0.133, 7, 6, 4, 
    0.267, 4, 2, 6, 
    0, 0.381, 0, 2, 
    1.000
);

-- Lonestar Kraken TX: Jax Marshall
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Lonestar Kraken TX', 'Jax Marshall', '56', NULL,
    6, 12, 3, 3, 
    0, 1, 0, 1, 
    2, 0, 6, 0, 
    0, 1.000,
    0.250, 6, 5, 5, 
    0.417, 5, 1, 5, 
    0, 0.500, 0, 2, 
    1.000
);

-- Lonestar Kraken TX: Jacob Manaska
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Lonestar Kraken TX', 'Jacob Manaska', '5', NULL,
    1, 4, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 0, 1, 
    0, 1.000,
    0.000, 1, 1, 0, 
    0.000, 0, 0, 2, 
    0, 0.000, 0, 0, 
    1.000
);

-- Lonestar Kraken TX: Grant Nekuza
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Lonestar Kraken TX', 'Grant Nekuza', '0', NULL,
    2, 2, 0, 0, 
    0, 0, 0, 0, 
    1, 0, 0, 0, 
    0, NULL,
    0.000, 2, 1, 0, 
    0.000, 2, 0, 1, 
    0, 0.500, 0, 1, 
    NULL
);

-- Lonestar Kraken TX: Micah Melott
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Lonestar Kraken TX', 'Micah Melott', '00', NULL,
    2, 1, 2, 0, 
    0, 0, 0, 0, 
    0, 0, 1, 1, 
    0, 1.000,
    0.000, 2, 0, 0, 
    0.000, 0, 0, 1, 
    0, 0.000, 0, 0, 
    1.000
);

-- Hays Larks: Thomas Lyssy
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Hays Larks', 'Thomas Lyssy', '15', NULL,
    5, 20, 4, 7, 
    0, 0, 0, 5, 
    0, 0, 2, 7, 
    1, 0.900,
    0.350, 5, 5, 7, 
    0.350, 3, 1, 4, 
    0, 0.440, 1, 0, 
    0.900
);

-- Hays Larks: Taber Stokes
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Hays Larks', 'Taber Stokes', '6', NULL,
    5, 24, 5, 8, 
    2, 0, 1, 6, 
    4, 0, 9, 14, 
    2, 0.920,
    0.333, 5, 5, 13, 
    0.542, 1, 0, 5, 
    0, 0.360, 0, 5, 
    0.920
);

-- Hays Larks: Trent Baker
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Hays Larks', 'Trent Baker', '2', NULL,
    4, 14, 6, 4, 
    2, 0, 0, 3, 
    10, 0, 4, 1, 
    2, 0.714,
    0.286, 4, 4, 6, 
    0.429, 5, 2, 3, 
    0, 0.524, 0, 11, 
    0.714
);

-- Hays Larks: Wilbert Espinal
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Hays Larks', 'Wilbert Espinal', '33', NULL,
    5, 13, 0, 3, 
    1, 0, 0, 2, 
    0, 0, 0, 0, 
    0, NULL,
    0.231, 5, 3, 4, 
    0.308, 4, 0, 5, 
    0, 0.412, 0, 0, 
    NULL
);

-- Hays Larks: Kaleb Duncan
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Hays Larks', 'Kaleb Duncan', '12', NULL,
    5, 19, 2, 4, 
    0, 0, 0, 1, 
    3, 0, 11, 1, 
    0, 1.000,
    0.211, 5, 5, 4, 
    0.211, 6, 0, 3, 
    0, 0.400, 0, 3, 
    1.000
);

-- Hays Larks: Lane Sparks
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Hays Larks', 'Lane Sparks', '8', NULL,
    5, 21, 3, 4, 
    2, 0, 0, 4, 
    6, 0, 8, 0, 
    1, 0.889,
    0.190, 5, 5, 6, 
    0.286, 5, 0, 10, 
    0, 0.346, 0, 6, 
    0.889
);

-- Hays Larks: Jackson Babcock
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Hays Larks', 'Jackson Babcock', '5', NULL,
    4, 13, 2, 2, 
    1, 0, 0, 2, 
    0, 0, 21, 3, 
    1, 0.960,
    0.154, 4, 3, 3, 
    0.231, 1, 0, 2, 
    0, 0.200, 1, 0, 
    0.960
);

-- Hays Larks: CJ Reid
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Hays Larks', 'CJ Reid', '1', NULL,
    5, 16, 3, 2, 
    1, 0, 0, 4, 
    1, 0, 9, 8, 
    0, 1.000,
    0.125, 5, 5, 3, 
    0.188, 5, 0, 5, 
    0, 0.333, 0, 2, 
    1.000
);

-- Hays Larks: Brady Kreutzer
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Hays Larks', 'Brady Kreutzer', '4', NULL,
    4, 10, 4, 1, 
    0, 0, 0, 0, 
    1, 0, 1, 0, 
    0, 1.000,
    0.100, 4, 3, 1, 
    0.100, 5, 0, 4, 
    0, 0.400, 0, 1, 
    1.000
);

-- Hays Larks: Lorenzo Rios
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Hays Larks', 'Lorenzo Rios', '21', NULL,
    3, 11, 3, 5, 
    0, 0, 0, 2, 
    1, 1, 32, 2, 
    0, 1.000,
    0.455, 3, 3, 5, 
    0.455, 1, 1, 2, 
    0, 0.538, 0, 1, 
    1.000
);

-- Hays Larks: Paul Smith
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Hays Larks', 'Paul Smith', '25', NULL,
    3, 11, 4, 4, 
    0, 1, 0, 0, 
    1, 0, 18, 1, 
    0, 1.000,
    0.364, 3, 2, 6, 
    0.545, 1, 0, 1, 
    0, 0.417, 0, 1, 
    1.000
);

-- Hays Larks: Dylan LaRue
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Hays Larks', 'Dylan LaRue', '26', NULL,
    3, 10, 4, 2, 
    1, 0, 0, 3, 
    0, 0, 19, 4, 
    0, 1.000,
    0.200, 3, 2, 3, 
    0.300, 2, 0, 1, 
    0, 0.333, 0, 0, 
    1.000
);

-- Hays Larks: Julio Ramos
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Hays Larks', 'Julio Ramos', '24', NULL,
    1, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 0, 2, 
    0, 1.000,
    0.000, 1, 0, 0, 
    0.000, 0, 0, 0, 
    0, 0.000, 0, 0, 
    1.000
);

-- Seattle Studs: Jackson Copeland
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Seattle Studs', 'Jackson Copeland', '16', NULL,
    5, 17, 3, 11, 
    3, 0, 0, 4, 
    1, 0, 44, 2, 
    0, 1.000,
    0.647, 5, 5, 14, 
    0.824, 2, 1, 1, 
    0, 0.700, 0, 1, 
    1.000
);

-- Seattle Studs: Bradley Carl
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Seattle Studs', 'Bradley Carl', '4', NULL,
    5, 19, 4, 6, 
    4, 0, 0, 1, 
    2, 0, 13, 0, 
    1, 0.929,
    0.316, 5, 5, 10, 
    0.526, 1, 1, 6, 
    0, 0.381, 0, 2, 
    0.929
);

-- Seattle Studs: Gage Thompson
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Seattle Studs', 'Gage Thompson', '6', NULL,
    5, 15, 2, 3, 
    0, 0, 0, 2, 
    0, 0, 6, 8, 
    0, 1.000,
    0.200, 5, 5, 3, 
    0.200, 0, 1, 8, 
    0, 0.250, 0, 0, 
    1.000
);

-- Seattle Studs: Ben Schnurman
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Seattle Studs', 'Ben Schnurman', '23', NULL,
    5, 18, 1, 3, 
    1, 0, 0, 3, 
    0, 0, 0, 0, 
    0, NULL,
    0.167, 5, 5, 4, 
    0.222, 0, 1, 7, 
    1, 0.200, 1, 0, 
    NULL
);

-- Seattle Studs: Ryan Spero
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Seattle Studs', 'Ryan Spero', '14', NULL,
    4, 13, 2, 2, 
    0, 0, 0, 0, 
    1, 1, 8, 0, 
    0, 1.000,
    0.154, 4, 4, 2, 
    0.154, 2, 1, 6, 
    0, 0.313, 0, 1, 
    1.000
);

-- Seattle Studs: Chris Parkin
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Seattle Studs', 'Chris Parkin', '27', NULL,
    5, 18, 1, 2, 
    1, 0, 0, 2, 
    1, 0, 1, 6, 
    0, 1.000,
    0.111, 5, 5, 3, 
    0.167, 1, 1, 4, 
    0, 0.190, 1, 3, 
    1.000
);

-- Seattle Studs: Kailand Halstead
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Seattle Studs', 'Kailand Halstead', '37', NULL,
    1, 3, 3, 2, 
    0, 0, 1, 1, 
    0, 0, 15, 0, 
    0, 1.000,
    0.667, 1, 1, 5, 
    1.667, 1, 0, 1, 
    0, 0.750, 0, 0, 
    1.000
);

-- Seattle Studs: Joel Fernandez
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Seattle Studs', 'Joel Fernandez', '24', NULL,
    2, 7, 1, 3, 
    1, 0, 0, 0, 
    0, 0, 12, 0, 
    0, 1.000,
    0.429, 2, 2, 4, 
    0.571, 1, 0, 2, 
    1, 0.500, 0, 0, 
    1.000
);

-- Seattle Studs: Jake Gallagher
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Seattle Studs', 'Jake Gallagher', '8', NULL,
    3, 10, 0, 2, 
    1, 0, 0, 1, 
    0, 0, 4, 14, 
    0, 1.000,
    0.200, 3, 3, 3, 
    0.300, 2, 0, 3, 
    0, 0.333, 0, 0, 
    1.000
);

-- Seattle Studs: Tristan Ringrose
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Seattle Studs', 'Tristan Ringrose', '3', NULL,
    3, 11, 1, 2, 
    0, 1, 0, 1, 
    0, 0, 4, 0, 
    0, 1.000,
    0.182, 3, 3, 4, 
    0.364, 1, 0, 5, 
    0, 0.250, 0, 0, 
    1.000
);

-- Seattle Studs: Chandler Stocking
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Seattle Studs', 'Chandler Stocking', '7', NULL,
    3, 8, 1, 1, 
    0, 0, 0, 0, 
    0, 0, 7, 10, 
    1, 0.944,
    0.125, 3, 3, 1, 
    0.125, 1, 0, 0, 
    0, 0.222, 0, 0, 
    0.944
);

-- Seattle Studs: Jack Bergstrom
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Seattle Studs', 'Jack Bergstrom', '5', NULL,
    3, 9, 0, 1, 
    0, 0, 0, 0, 
    0, 0, 11, 3, 
    0, 1.000,
    0.111, 3, 3, 1, 
    0.111, 0, 0, 0, 
    0, 0.111, 0, 0, 
    1.000
);

-- Seattle Studs: Rutger Youch
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Seattle Studs', 'Rutger Youch', '32', NULL,
    1, 2, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 4, 0, 
    0, 1.000,
    0.000, 1, 1, 0, 
    0.000, 0, 0, 0, 
    1, 0.000, 0, 0, 
    1.000
);

-- Alaska Goldpanners: Matthew Pinal
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Alaska Goldpanners', 'Matthew Pinal', '22', NULL,
    3, 15, 5, 10, 
    2, 0, 0, 3, 
    0, 0, 0, 3, 
    0, 1.000,
    0.667, 3, 3, 12, 
    0.800, 0, 0, 2, 
    0, 0.667, 0, 0, 
    1.000
);

-- Alaska Goldpanners: Christian Olea
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Alaska Goldpanners', 'Christian Olea', '27', NULL,
    3, 12, 3, 6, 
    0, 0, 0, 0, 
    1, 0, 19, 7, 
    1, 0.963,
    0.500, 3, 3, 6, 
    0.500, 2, 0, 1, 
    0, 0.571, 0, 1, 
    0.963
);

-- Alaska Goldpanners: Ian Armstrong
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Alaska Goldpanners', 'Ian Armstrong', '38', NULL,
    3, 13, 4, 6, 
    3, 0, 1, 6, 
    0, 0, 29, 2, 
    0, 1.000,
    0.462, 3, 3, 12, 
    0.923, 1, 1, 0, 
    0, 0.533, 0, 0, 
    1.000
);

-- Alaska Goldpanners: Vincent Venverloh
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Alaska Goldpanners', 'Vincent Venverloh', '16', NULL,
    3, 11, 0, 4, 
    2, 0, 0, 2, 
    0, 0, 5, 2, 
    0, 1.000,
    0.364, 3, 3, 6, 
    0.545, 1, 2, 0, 
    0, 0.500, 0, 0, 
    1.000
);

-- Alaska Goldpanners: Owen Meli
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Alaska Goldpanners', 'Owen Meli', '25', NULL,
    3, 11, 6, 4, 
    1, 0, 1, 4, 
    1, 0, 5, 0, 
    0, 1.000,
    0.364, 3, 3, 8, 
    0.727, 3, 1, 2, 
    0, 0.533, 0, 1, 
    1.000
);

-- Alaska Goldpanners: David Shackelford
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Alaska Goldpanners', 'David Shackelford', '12', NULL,
    3, 11, 2, 3, 
    1, 0, 0, 1, 
    1, 0, 6, 1, 
    0, 1.000,
    0.273, 3, 3, 4, 
    0.364, 2, 0, 4, 
    0, 0.385, 0, 1, 
    1.000
);

-- Alaska Goldpanners: Cole Clark
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Alaska Goldpanners', 'Cole Clark', '9', NULL,
    3, 10, 1, 0, 
    0, 0, 0, 1, 
    0, 0, 2, 2, 
    2, 0.667,
    0.000, 3, 2, 0, 
    0.000, 1, 0, 1, 
    0, 0.091, 0, 1, 
    0.667
);

-- Alaska Goldpanners: Garrett Davidson
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Alaska Goldpanners', 'Garrett Davidson', '3', NULL,
    1, 1, 1, 1, 
    1, 0, 0, 0, 
    0, 0, 1, 0, 
    0, 1.000,
    1.000, 1, 1, 2, 
    2.000, 1, 0, 0, 
    0, 1.000, 0, 0, 
    1.000
);

-- Alaska Goldpanners: Jamie Mullin
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Alaska Goldpanners', 'Jamie Mullin', '35', NULL,
    2, 7, 1, 2, 
    1, 0, 1, 3, 
    0, 0, 0, 2, 
    1, 0.667,
    0.286, 2, 2, 6, 
    0.857, 0, 0, 3, 
    1, 0.286, 0, 0, 
    0.667
);

-- Alaska Goldpanners: Hunter Friedberg
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Alaska Goldpanners', 'Hunter Friedberg', '5', NULL,
    3, 4, 1, 1, 
    0, 0, 0, 1, 
    1, 0, 5, 0, 
    0, 1.000,
    0.250, 3, 1, 1, 
    0.250, 4, 0, 2, 
    0, 0.625, 0, 1, 
    1.000
);

-- Alaska Goldpanners: Alex Garcia
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Alaska Goldpanners', 'Alex Garcia', '11', NULL,
    2, 7, 2, 1, 
    0, 0, 0, 3, 
    0, 0, 2, 5, 
    1, 0.875,
    0.143, 2, 1, 1, 
    0.143, 0, 0, 0, 
    1, 0.125, 1, 0, 
    0.875
);

-- Alaska Goldpanners: Sam Stevenson
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Alaska Goldpanners', 'Sam Stevenson', '8', NULL,
    3, 6, 1, 0, 
    0, 0, 0, 0, 
    0, 0, 4, 4, 
    0, 1.000,
    0.000, 3, 2, 0, 
    0.000, 2, 0, 2, 
    0, 0.250, 0, 1, 
    1.000
);

-- Santa Barbara Foresters: Sawyer Farr
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Santa Barbara Foresters', 'Sawyer Farr', '5', NULL,
    4, 10, 4, 6, 
    2, 0, 1, 2, 
    2, 0, 5, 7, 
    0, 1.000,
    0.600, 4, 4, 11, 
    1.100, 3, 1, 3, 
    0, 0.714, 0, 3, 
    1.000
);

-- Santa Barbara Foresters: Easton Moomau
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Santa Barbara Foresters', 'Easton Moomau', '23', NULL,
    4, 16, 1, 8, 
    2, 0, 0, 6, 
    0, 0, 7, 5, 
    1, 0.923,
    0.500, 4, 4, 10, 
    0.625, 1, 0, 0, 
    0, 0.529, 0, 0, 
    0.923
);

-- Santa Barbara Foresters: Caden Miller
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Santa Barbara Foresters', 'Caden Miller', '4', NULL,
    4, 9, 3, 4, 
    1, 0, 0, 4, 
    5, 0, 24, 0, 
    0, 1.000,
    0.444, 4, 4, 5, 
    0.556, 4, 0, 2, 
    0, 0.615, 0, 5, 
    1.000
);

-- Santa Barbara Foresters: Brenton Clark
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Santa Barbara Foresters', 'Brenton Clark', '6', NULL,
    4, 16, 5, 5, 
    2, 1, 1, 2, 
    1, 0, 9, 0, 
    0, 1.000,
    0.313, 4, 4, 12, 
    0.750, 0, 0, 4, 
    1, 0.313, 0, 1, 
    1.000
);

-- Santa Barbara Foresters: Terrence Kiel II
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Santa Barbara Foresters', 'Terrence Kiel II', '2', NULL,
    4, 10, 3, 3, 
    0, 0, 0, 1, 
    2, 0, 4, 0, 
    0, 1.000,
    0.300, 4, 4, 3, 
    0.300, 4, 0, 1, 
    0, 0.467, 1, 3, 
    1.000
);

-- Santa Barbara Foresters: Xavier Esquer
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Santa Barbara Foresters', 'Xavier Esquer', '12', NULL,
    4, 11, 5, 3, 
    0, 0, 0, 3, 
    3, 1, 6, 7, 
    0, 1.000,
    0.273, 4, 4, 3, 
    0.273, 5, 1, 1, 
    1, 0.529, 0, 5, 
    1.000
);

-- Santa Barbara Foresters: Mic Paul
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Santa Barbara Foresters', 'Mic Paul', '15', NULL,
    4, 13, 2, 3, 
    2, 0, 1, 3, 
    0, 0, 3, 0, 
    0, 1.000,
    0.231, 4, 4, 8, 
    0.615, 2, 0, 2, 
    0, 0.333, 0, 0, 
    1.000
);

-- Santa Barbara Foresters: Cole Chamberlain
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Santa Barbara Foresters', 'Cole Chamberlain', '8', NULL,
    4, 15, 2, 3, 
    1, 0, 0, 1, 
    2, 0, 3, 0, 
    0, 1.000,
    0.200, 4, 4, 4, 
    0.267, 1, 2, 4, 
    0, 0.333, 0, 2, 
    1.000
);

-- Santa Barbara Foresters: Caleb Hoover
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Santa Barbara Foresters', 'Caleb Hoover', '14', NULL,
    2, 2, 3, 1, 
    0, 0, 0, 0, 
    0, 0, 0, 0, 
    0, NULL,
    0.500, 2, 1, 1, 
    0.500, 2, 0, 1, 
    0, 0.750, 0, 0, 
    NULL
);

-- Santa Barbara Foresters: Zane Becker
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Santa Barbara Foresters', 'Zane Becker', '17', NULL,
    3, 9, 2, 2, 
    0, 0, 0, 2, 
    0, 0, 20, 1, 
    0, 1.000,
    0.222, 3, 2, 2, 
    0.222, 0, 0, 3, 
    1, 0.222, 0, 0, 
    1.000
);

-- Santa Barbara Foresters: Vince Gamberdella
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Santa Barbara Foresters', 'Vince Gamberdella', '18', NULL,
    1, 2, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 8, 0, 
    0, 1.000,
    0.000, 1, 1, 0, 
    0.000, 0, 0, 0, 
    0, 0.000, 0, 0, 
    1.000
);

-- Santa Barbara Foresters: Jonny Rodriguez
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Santa Barbara Foresters', 'Jonny Rodriguez', '31', NULL,
    1, 0, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 0, 0, 
    0, NULL,
    0.000, 1, 0, 0, 
    0.000, 0, 0, 0, 
    0, 0.000, 0, 0, 
    NULL
);

-- Derby Twins: Noah Allison
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Derby Twins', 'Noah Allison', '19', NULL,
    5, 19, 1, 7, 
    3, 0, 0, 8, 
    2, 0, 0, 6, 
    0, 1.000,
    0.368, 5, 5, 10, 
    0.526, 0, 0, 3, 
    0, 0.350, 1, 2, 
    1.000
);

-- Derby Twins: Kyle Walker
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Derby Twins', 'Kyle Walker', '5', NULL,
    5, 19, 6, 7, 
    2, 0, 0, 1, 
    0, 0, 13, 11, 
    4, 0.857,
    0.368, 5, 5, 9, 
    0.474, 3, 0, 3, 
    0, 0.455, 0, 0, 
    0.857
);

-- Derby Twins: Damian Garcia
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Derby Twins', 'Damian Garcia', '16', NULL,
    5, 16, 3, 4, 
    0, 0, 1, 3, 
    0, 0, 31, 3, 
    2, 0.944,
    0.250, 5, 5, 7, 
    0.438, 2, 1, 2, 
    0, 0.350, 1, 0, 
    0.944
);

-- Derby Twins: Connor Rabe
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Derby Twins', 'Connor Rabe', '14', NULL,
    4, 12, 2, 3, 
    0, 0, 0, 0, 
    0, 0, 20, 5, 
    1, 0.962,
    0.250, 4, 4, 3, 
    0.250, 2, 1, 4, 
    0, 0.400, 0, 0, 
    0.962
);

-- Derby Twins: Kole Dudding
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Derby Twins', 'Kole Dudding', '13', NULL,
    4, 12, 0, 3, 
    1, 0, 0, 1, 
    0, 0, 4, 9, 
    0, 1.000,
    0.250, 4, 4, 4, 
    0.333, 1, 0, 2, 
    0, 0.286, 1, 0, 
    1.000
);

-- Derby Twins: Peanut Brazzle
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Derby Twins', 'Peanut Brazzle', '6', NULL,
    5, 18, 3, 4, 
    1, 0, 0, 1, 
    2, 0, 13, 0, 
    1, 0.929,
    0.222, 5, 5, 5, 
    0.278, 4, 0, 4, 
    0, 0.364, 0, 3, 
    0.929
);

-- Derby Twins: Cade Sutherland
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Derby Twins', 'Cade Sutherland', '40', NULL,
    4, 15, 0, 2, 
    0, 0, 0, 1, 
    0, 0, 7, 1, 
    0, 1.000,
    0.133, 4, 4, 2, 
    0.133, 0, 0, 3, 
    1, 0.125, 1, 0, 
    1.000
);

-- Derby Twins: Kade Sheldon
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Derby Twins', 'Kade Sheldon', '7', NULL,
    3, 9, 2, 4, 
    0, 0, 0, 0, 
    0, 1, 6, 0, 
    0, 1.000,
    0.444, 3, 3, 4, 
    0.444, 1, 0, 1, 
    0, 0.500, 0, 0, 
    1.000
);

-- Derby Twins: Elias Leon
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Derby Twins', 'Elias Leon', '26', NULL,
    4, 12, 0, 3, 
    0, 0, 0, 0, 
    1, 0, 5, 0, 
    0, 1.000,
    0.250, 4, 3, 3, 
    0.250, 0, 0, 4, 
    1, 0.250, 0, 1, 
    1.000
);

-- Derby Twins: Jackson Syring
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Derby Twins', 'Jackson Syring', '9', NULL,
    3, 8, 2, 2, 
    1, 0, 0, 0, 
    1, 0, 9, 1, 
    0, 1.000,
    0.250, 3, 3, 3, 
    0.375, 3, 0, 0, 
    0, 0.455, 0, 3, 
    1.000
);

-- Derby Twins: Teigan Munce
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Derby Twins', 'Teigan Munce', '31', NULL,
    2, 6, 0, 1, 
    0, 0, 0, 0, 
    0, 0, 3, 0, 
    0, 1.000,
    0.167, 2, 2, 1, 
    0.167, 1, 0, 2, 
    1, 0.286, 0, 0, 
    1.000
);

-- Derby Twins: Jackson Ellison
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Derby Twins', 'Jackson Ellison', '2', NULL,
    2, 5, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 3, 1, 
    0, 1.000,
    0.000, 2, 1, 0, 
    0.000, 0, 0, 2, 
    0, 0.000, 0, 0, 
    1.000
);

-- Derby Twins: Dawson Robbins
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Derby Twins', 'Dawson Robbins', '20', NULL,
    1, 2, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 7, 1, 
    1, 0.889,
    0.000, 1, 1, 0, 
    0.000, 1, 0, 0, 
    1, 0.333, 0, 0, 
    0.889
);

-- San Diego Stars: Justin Tucker
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'San Diego Stars', 'Justin Tucker', '23', NULL,
    5, 15, 5, 6, 
    3, 1, 0, 2, 
    0, 0, 17, 0, 
    0, 1.000,
    0.400, 5, 5, 11, 
    0.733, 4, 4, 1, 
    0, 0.609, 0, 0, 
    1.000
);

-- San Diego Stars: Logan Aguilar
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'San Diego Stars', 'Logan Aguilar', '27', NULL,
    5, 17, 5, 5, 
    0, 0, 0, 2, 
    0, 0, 9, 10, 
    1, 0.950,
    0.294, 5, 5, 5, 
    0.294, 5, 1, 2, 
    0, 0.478, 0, 0, 
    0.950
);

-- San Diego Stars: Ethan Wright
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'San Diego Stars', 'Ethan Wright', '2', NULL,
    5, 17, 3, 4, 
    0, 0, 0, 2, 
    0, 1, 17, 1, 
    0, 1.000,
    0.235, 5, 5, 4, 
    0.235, 2, 1, 1, 
    3, 0.350, 0, 0, 
    1.000
);

-- San Diego Stars: Raph Dunne
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'San Diego Stars', 'Raph Dunne', '34', NULL,
    4, 14, 1, 3, 
    0, 0, 0, 2, 
    0, 0, 7, 7, 
    1, 0.933,
    0.214, 4, 4, 3, 
    0.214, 1, 2, 1, 
    0, 0.333, 1, 0, 
    0.933
);

-- San Diego Stars: Joe Anderson
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'San Diego Stars', 'Joe Anderson', '4', NULL,
    5, 17, 2, 3, 
    0, 0, 0, 4, 
    0, 0, 3, 4, 
    0, 1.000,
    0.176, 5, 4, 3, 
    0.176, 2, 1, 4, 
    0, 0.286, 1, 0, 
    1.000
);

-- San Diego Stars: Frank Giacalone
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'San Diego Stars', 'Frank Giacalone', '35', NULL,
    5, 17, 5, 3, 
    0, 0, 1, 7, 
    0, 0, 28, 2, 
    1, 0.968,
    0.176, 5, 5, 6, 
    0.353, 2, 1, 8, 
    0, 0.273, 2, 0, 
    0.968
);

-- San Diego Stars: Landen Bailey
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'San Diego Stars', 'Landen Bailey', '5', NULL,
    5, 20, 3, 3, 
    0, 0, 0, 5, 
    0, 1, 28, 5, 
    1, 0.971,
    0.150, 5, 5, 3, 
    0.150, 1, 1, 3, 
    1, 0.227, 0, 0, 
    0.971
);

-- San Diego Stars: Nico Salmeri
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'San Diego Stars', 'Nico Salmeri', '44', NULL,
    1, 4, 2, 3, 
    0, 0, 0, 2, 
    0, 0, 0, 0, 
    0, NULL,
    0.750, 1, 1, 3, 
    0.750, 1, 0, 0, 
    0, 0.800, 0, 0, 
    NULL
);

-- San Diego Stars: Carter Lockwood
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'San Diego Stars', 'Carter Lockwood', '13', NULL,
    3, 9, 2, 3, 
    0, 0, 0, 2, 
    0, 0, 4, 3, 
    0, 1.000,
    0.333, 3, 3, 3, 
    0.333, 2, 0, 1, 
    1, 0.455, 0, 0, 
    1.000
);

-- San Diego Stars: Will James
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'San Diego Stars', 'Will James', '21', NULL,
    4, 10, 3, 3, 
    0, 0, 0, 0, 
    0, 0, 4, 0, 
    0, 1.000,
    0.300, 4, 3, 3, 
    0.300, 2, 2, 5, 
    0, 0.500, 0, 0, 
    1.000
);

-- San Diego Stars: Kayden Henson
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'San Diego Stars', 'Kayden Henson', '30', NULL,
    1, 4, 0, 1, 
    0, 0, 0, 0, 
    0, 0, 0, 1, 
    0, 1.000,
    0.250, 1, 1, 1, 
    0.250, 0, 0, 1, 
    0, 0.250, 0, 0, 
    1.000
);

-- San Diego Stars: Gavin Gamino
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'San Diego Stars', 'Gavin Gamino', '9', NULL,
    4, 13, 0, 1, 
    1, 0, 0, 2, 
    0, 0, 0, 2, 
    1, 0.667,
    0.077, 4, 3, 2, 
    0.154, 0, 0, 4, 
    0, 0.077, 0, 0, 
    0.667
);

-- San Diego Stars: Mike Clark
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'San Diego Stars', 'Mike Clark', '19', NULL,
    1, 3, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 6, 0, 
    0, 1.000,
    0.000, 1, 1, 0, 
    0.000, 1, 0, 2, 
    0, 0.250, 0, 0, 
    1.000
);

-- Junction City Brigade: Peyton Firgens
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Junction City Brigade', 'Peyton Firgens', '32', NULL,
    4, 15, 4, 7, 
    1, 0, 0, 2, 
    1, 0, 4, 13, 
    1, 0.944,
    0.467, 4, 4, 8, 
    0.533, 3, 0, 0, 
    0, 0.556, 0, 1, 
    0.944
);

-- Junction City Brigade: Gannon White
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Junction City Brigade', 'Gannon White', '10', NULL,
    4, 19, 3, 7, 
    0, 0, 0, 2, 
    1, 0, 6, 0, 
    1, 0.857,
    0.368, 4, 4, 7, 
    0.368, 1, 1, 3, 
    0, 0.429, 0, 2, 
    0.857
);

-- Junction City Brigade: Chad Pantuso
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Junction City Brigade', 'Chad Pantuso', '7', NULL,
    4, 17, 6, 5, 
    0, 0, 1, 3, 
    3, 0, 3, 5, 
    1, 0.889,
    0.294, 4, 4, 8, 
    0.471, 3, 0, 2, 
    0, 0.400, 0, 3, 
    0.889
);

-- Junction City Brigade: Brayden Harpole
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Junction City Brigade', 'Brayden Harpole', '20', NULL,
    4, 15, 2, 4, 
    1, 0, 0, 1, 
    0, 0, 27, 1, 
    0, 1.000,
    0.267, 4, 4, 5, 
    0.333, 2, 0, 6, 
    0, 0.353, 0, 0, 
    1.000
);

-- Junction City Brigade: Kyler Horsman
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Junction City Brigade', 'Kyler Horsman', '38', NULL,
    4, 17, 2, 4, 
    0, 0, 1, 5, 
    2, 0, 0, 0, 
    0, NULL,
    0.235, 4, 4, 7, 
    0.412, 2, 0, 2, 
    1, 0.316, 0, 3, 
    NULL
);

-- Junction City Brigade: Ian Luce
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Junction City Brigade', 'Ian Luce', '4', NULL,
    4, 13, 2, 3, 
    2, 0, 0, 5, 
    1, 0, 8, 0, 
    0, 1.000,
    0.231, 4, 4, 5, 
    0.385, 3, 0, 0, 
    0, 0.375, 0, 1, 
    1.000
);

-- Junction City Brigade: Gabe Yonto
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Junction City Brigade', 'Gabe Yonto', '3', NULL,
    4, 15, 3, 2, 
    0, 0, 0, 1, 
    4, 0, 10, 0, 
    0, 1.000,
    0.133, 4, 4, 2, 
    0.133, 2, 3, 2, 
    0, 0.350, 0, 5, 
    1.000
);

-- Junction City Brigade: Logan Myers
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Junction City Brigade', 'Logan Myers', '40', NULL,
    4, 11, 5, 1, 
    0, 0, 0, 1, 
    2, 0, 10, 9, 
    1, 0.950,
    0.091, 4, 4, 1, 
    0.091, 3, 3, 1, 
    1, 0.412, 0, 2, 
    0.950
);

-- Junction City Brigade: Garryn Plummer
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Junction City Brigade', 'Garryn Plummer', '5', NULL,
    3, 8, 2, 3, 
    0, 0, 0, 2, 
    0, 0, 21, 2, 
    0, 1.000,
    0.375, 3, 2, 3, 
    0.375, 1, 1, 2, 
    1, 0.500, 0, 0, 
    1.000
);

-- Junction City Brigade: Eli Kellogg
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Junction City Brigade', 'Eli Kellogg', '26', NULL,
    2, 5, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 15, 1, 
    0, 1.000,
    0.000, 2, 2, 0, 
    0.000, 2, 0, 0, 
    0, 0.286, 0, 0, 
    1.000
);

-- Junction City Brigade: Gus Keller
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Junction City Brigade', 'Gus Keller', '8', NULL,
    1, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 0, 0, 
    0, NULL,
    0.000, 1, 0, 0, 
    0.000, 0, 0, 0, 
    0, 0.000, 0, 0, 
    NULL
);

-- Junction City Brigade: Gam Jones
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Junction City Brigade', 'Gam Jones', '11', NULL,
    2, 1, 1, 0, 
    0, 0, 0, 0, 
    1, 0, 0, 0, 
    1, NULL,
    0.000, 2, 0, 0, 
    0.000, 0, 0, 1, 
    0, 0.000, 0, 1, 
    NULL
);

-- Top Prospect Academy: Roman Cariaga
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Top Prospect Academy', 'Roman Cariaga', '22', NULL,
    4, 14, 5, 8, 
    0, 0, 2, 4, 
    1, 0, 7, 0, 
    0, 1.000,
    0.571, 4, 4, 14, 
    1.000, 2, 0, 2, 
    0, 0.625, 0, 1, 
    1.000
);

-- Top Prospect Academy: Jameson Lucky
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Top Prospect Academy', 'Jameson Lucky', '7', NULL,
    4, 14, 3, 6, 
    0, 0, 0, 0, 
    2, 0, 11, 1, 
    1, 0.923,
    0.429, 4, 4, 6, 
    0.429, 1, 1, 3, 
    0, 0.500, 0, 2, 
    0.923
);

-- Top Prospect Academy: Aidan LeMasters
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Top Prospect Academy', 'Aidan LeMasters', '9', NULL,
    4, 14, 1, 6, 
    1, 0, 0, 3, 
    2, 0, 6, 4, 
    1, 0.909,
    0.429, 4, 4, 7, 
    0.500, 2, 0, 2, 
    0, 0.471, 1, 3, 
    0.909
);

-- Top Prospect Academy: Levi Risenhoover
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Top Prospect Academy', 'Levi Risenhoover', '13', NULL,
    4, 15, 8, 5, 
    1, 0, 2, 5, 
    0, 0, 13, 0, 
    0, 1.000,
    0.333, 4, 4, 12, 
    0.800, 0, 3, 1, 
    0, 0.444, 0, 0, 
    1.000
);

-- Top Prospect Academy: Luke Regas
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Top Prospect Academy', 'Luke Regas', '11', NULL,
    4, 16, 2, 4, 
    1, 0, 0, 2, 
    0, 0, 22, 0, 
    2, 0.917,
    0.250, 4, 4, 5, 
    0.313, 1, 1, 2, 
    0, 0.333, 0, 1, 
    0.917
);

-- Top Prospect Academy: Jaxon James
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Top Prospect Academy', 'Jaxon James', '1', NULL,
    4, 16, 1, 4, 
    1, 0, 0, 4, 
    0, 0, 7, 5, 
    3, 0.800,
    0.250, 4, 4, 5, 
    0.313, 1, 0, 8, 
    0, 0.294, 0, 0, 
    0.800
);

-- Top Prospect Academy: Grant Moore
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Top Prospect Academy', 'Grant Moore', '14', NULL,
    3, 9, 1, 2, 
    0, 0, 0, 0, 
    1, 0, 9, 0, 
    0, 1.000,
    0.222, 3, 3, 2, 
    0.222, 3, 1, 1, 
    2, 0.462, 0, 1, 
    1.000
);

-- Top Prospect Academy: Rohan Culmer
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Top Prospect Academy', 'Rohan Culmer', '16', NULL,
    4, 15, 2, 3, 
    0, 0, 0, 2, 
    1, 0, 5, 5, 
    0, 1.000,
    0.200, 4, 4, 3, 
    0.200, 2, 0, 5, 
    0, 0.294, 0, 1, 
    1.000
);

-- Top Prospect Academy: Justin Vasquez
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Top Prospect Academy', 'Justin Vasquez', '2', NULL,
    1, 1, 0, 1, 
    1, 0, 0, 0, 
    0, 0, 0, 0, 
    0, NULL,
    1.000, 1, 0, 2, 
    2.000, 0, 0, 0, 
    0, 1.000, 0, 0, 
    NULL
);

-- Top Prospect Academy: Angel Gutierrez
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Top Prospect Academy', 'Angel Gutierrez', '12', NULL,
    4, 8, 0, 2, 
    0, 0, 0, 1, 
    1, 0, 2, 1, 
    6, 0.333,
    0.250, 4, 2, 2, 
    0.250, 0, 0, 3, 
    0, 0.250, 0, 1, 
    0.333
);

-- Top Prospect Academy: Decarlo Delancy
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Top Prospect Academy', 'Decarlo Delancy', '23', NULL,
    3, 5, 2, 1, 
    0, 0, 0, 0, 
    0, 0, 1, 0, 
    0, 1.000,
    0.200, 3, 1, 1, 
    0.200, 1, 1, 1, 
    1, 0.429, 0, 0, 
    1.000
);

-- Top Prospect Academy: Hunter Sandifer
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Top Prospect Academy', 'Hunter Sandifer', '19', NULL,
    2, 6, 0, 1, 
    0, 0, 0, 1, 
    0, 0, 10, 0, 
    0, 1.000,
    0.167, 2, 2, 1, 
    0.167, 2, 0, 4, 
    0, 0.375, 0, 0, 
    1.000
);

-- Seattle Blackfins: Jeffrey Perran
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Seattle Blackfins', 'Jeffrey Perran', '17', NULL,
    4, 12, 2, 3, 
    0, 0, 0, 0, 
    1, 0, 5, 0, 
    0, 1.000,
    0.250, 4, 4, 3, 
    0.250, 3, 0, 2, 
    0, 0.400, 0, 1, 
    1.000
);

-- Seattle Blackfins: Paxton Bigby
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Seattle Blackfins', 'Paxton Bigby', '32', NULL,
    4, 13, 1, 3, 
    0, 0, 0, 4, 
    1, 0, 27, 0, 
    1, 0.964,
    0.231, 4, 4, 3, 
    0.231, 1, 1, 0, 
    0, 0.313, 1, 1, 
    0.964
);

-- Seattle Blackfins: JT Starkus
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Seattle Blackfins', 'JT Starkus', '24', NULL,
    4, 14, 1, 3, 
    1, 0, 0, 1, 
    0, 0, 0, 0, 
    0, NULL,
    0.214, 4, 4, 4, 
    0.286, 0, 1, 5, 
    0, 0.267, 0, 0, 
    NULL
);

-- Seattle Blackfins: Michael Singleton
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Seattle Blackfins', 'Michael Singleton', '18', NULL,
    4, 11, 3, 2, 
    0, 0, 0, 0, 
    0, 0, 2, 4, 
    0, 1.000,
    0.182, 4, 4, 2, 
    0.182, 3, 1, 3, 
    0, 0.400, 0, 0, 
    1.000
);

-- Seattle Blackfins: Harrison Kaufman
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Seattle Blackfins', 'Harrison Kaufman', '7', NULL,
    4, 14, 0, 2, 
    0, 0, 0, 0, 
    0, 0, 9, 8, 
    0, 1.000,
    0.143, 4, 4, 2, 
    0.143, 1, 0, 4, 
    0, 0.200, 0, 0, 
    1.000
);

-- Seattle Blackfins: Breadon Requa
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Seattle Blackfins', 'Breadon Requa', '28', NULL,
    1, 2, 0, 1, 
    0, 0, 0, 0, 
    0, 0, 9, 1, 
    1, 0.909,
    0.500, 1, 1, 1, 
    0.500, 0, 0, 0, 
    1, 0.500, 0, 0, 
    0.909
);

-- Seattle Blackfins: Brayden Larson
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Seattle Blackfins', 'Brayden Larson', '3', NULL,
    2, 5, 1, 2, 
    0, 0, 0, 1, 
    0, 0, 3, 6, 
    0, 1.000,
    0.400, 2, 2, 2, 
    0.400, 1, 0, 1, 
    0, 0.500, 0, 0, 
    1.000
);

-- Seattle Blackfins: Cole Hoffman
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Seattle Blackfins', 'Cole Hoffman', '50', NULL,
    1, 3, 1, 1, 
    0, 0, 0, 1, 
    1, 0, 3, 0, 
    0, 1.000,
    0.333, 1, 1, 1, 
    0.333, 2, 0, 0, 
    0, 0.600, 0, 1, 
    1.000
);

-- Seattle Blackfins: Brody Bluhm
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Seattle Blackfins', 'Brody Bluhm', '16', NULL,
    3, 8, 1, 2, 
    0, 1, 1, 4, 
    1, 1, 6, 0, 
    2, 0.750,
    0.250, 3, 2, 7, 
    0.875, 1, 0, 4, 
    0, 0.333, 0, 1, 
    0.750
);

-- Seattle Blackfins: Joshua Williams
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Seattle Blackfins', 'Joshua Williams', '13', NULL,
    4, 8, 0, 2, 
    1, 0, 0, 0, 
    0, 0, 8, 0, 
    2, 0.800,
    0.250, 4, 3, 3, 
    0.375, 0, 2, 4, 
    1, 0.400, 0, 0, 
    0.800
);

-- Seattle Blackfins: Joshua Carter
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Seattle Blackfins', 'Joshua Carter', '42', NULL,
    2, 5, 1, 1, 
    0, 0, 0, 0, 
    1, 0, 2, 3, 
    1, 0.833,
    0.200, 2, 2, 1, 
    0.200, 1, 2, 3, 
    0, 0.500, 0, 2, 
    0.833
);

-- Seattle Blackfins: Cooper Barrow
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Seattle Blackfins', 'Cooper Barrow', '6', NULL,
    3, 8, 2, 1, 
    0, 0, 0, 0, 
    0, 0, 14, 3, 
    0, 1.000,
    0.125, 3, 3, 1, 
    0.125, 1, 0, 0, 
    0, 0.222, 0, 0, 
    1.000
);

-- Seattle Blackfins: Keegan Agen
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Seattle Blackfins', 'Keegan Agen', '5', NULL,
    2, 5, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 3, 0, 
    0, 1.000,
    0.000, 2, 2, 0, 
    0.000, 0, 0, 4, 
    0, 0.000, 0, 0, 
    1.000
);

-- Seattle Blackfins: Jordan Singleton
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Seattle Blackfins', 'Jordan Singleton', '34', NULL,
    2, 4, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 0, 0, 
    0, NULL,
    0.000, 2, 0, 0, 
    0.000, 0, 0, 3, 
    0, 0.000, 0, 0, 
    NULL
);

-- Lonestar TX Baseball Club: Tony DeJesus
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Lonestar TX Baseball Club', 'Tony DeJesus', '20', NULL,
    4, 12, 2, 5, 
    0, 0, 0, 3, 
    0, 0, 5, 11, 
    0, 1.000,
    0.417, 4, 4, 5, 
    0.417, 3, 0, 1, 
    0, 0.533, 0, 0, 
    1.000
);

-- Lonestar TX Baseball Club: Robby Lopez
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Lonestar TX Baseball Club', 'Robby Lopez', '8', NULL,
    4, 12, 3, 5, 
    1, 0, 1, 3, 
    0, 0, 16, 1, 
    3, 0.850,
    0.417, 4, 4, 9, 
    0.750, 2, 2, 3, 
    1, 0.563, 0, 0, 
    0.850
);

-- Lonestar TX Baseball Club: John Gonzales
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Lonestar TX Baseball Club', 'John Gonzales', '44', NULL,
    3, 10, 4, 4, 
    1, 0, 0, 1, 
    0, 0, 27, 0, 
    0, 1.000,
    0.400, 3, 3, 5, 
    0.500, 1, 1, 1, 
    1, 0.500, 0, 0, 
    1.000
);

-- Lonestar TX Baseball Club: DJ Pinkerton
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Lonestar TX Baseball Club', 'DJ Pinkerton', '9', NULL,
    4, 18, 2, 4, 
    1, 0, 1, 5, 
    0, 0, 9, 0, 
    0, 1.000,
    0.222, 4, 4, 8, 
    0.444, 0, 0, 4, 
    0, 0.222, 0, 0, 
    1.000
);

-- Lonestar TX Baseball Club: Ben Merriman
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Lonestar TX Baseball Club', 'Ben Merriman', '32', NULL,
    4, 11, 2, 2, 
    0, 0, 0, 0, 
    0, 0, 7, 0, 
    0, 1.000,
    0.182, 4, 4, 2, 
    0.182, 4, 1, 4, 
    0, 0.438, 0, 2, 
    1.000
);

-- Lonestar TX Baseball Club: Sage Sanders
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Lonestar TX Baseball Club', 'Sage Sanders', '11', NULL,
    4, 12, 3, 2, 
    0, 0, 0, 1, 
    0, 0, 2, 11, 
    0, 1.000,
    0.167, 4, 4, 2, 
    0.167, 2, 2, 3, 
    0, 0.375, 0, 0, 
    1.000
);

-- Lonestar TX Baseball Club: Maverick McAllist
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Lonestar TX Baseball Club', 'Maverick McAllist', '2', NULL,
    4, 10, 3, 1, 
    0, 0, 0, 1, 
    0, 0, 6, 0, 
    0, 1.000,
    0.100, 4, 4, 1, 
    0.100, 2, 1, 0, 
    0, 0.308, 0, 1, 
    1.000
);

-- Lonestar TX Baseball Club: Nico Ruedas
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Lonestar TX Baseball Club', 'Nico Ruedas', '29', NULL,
    4, 16, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 6, 7, 
    0, 1.000,
    0.000, 4, 4, 0, 
    0.000, 0, 1, 4, 
    0, 0.059, 0, 1, 
    1.000
);

-- Lonestar TX Baseball Club: Matthew Fletcher
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Lonestar TX Baseball Club', 'Matthew Fletcher', '5', NULL,
    3, 9, 2, 6, 
    0, 0, 0, 5, 
    1, 0, 4, 1, 
    1, 0.833,
    0.667, 3, 3, 6, 
    0.667, 1, 0, 0, 
    0, 0.636, 1, 1, 
    0.833
);

-- Lonestar TX Baseball Club: Travis Starkey
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Lonestar TX Baseball Club', 'Travis Starkey', '28', NULL,
    2, 5, 1, 1, 
    0, 0, 0, 0, 
    0, 0, 8, 1, 
    0, 1.000,
    0.200, 2, 2, 1, 
    0.200, 0, 1, 3, 
    0, 0.333, 0, 0, 
    1.000
);

-- Lonestar TX Baseball Club: David Fluitt
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Lonestar TX Baseball Club', 'David Fluitt', '12', NULL,
    3, 2, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 0, 0, 
    0, NULL,
    0.000, 3, 0, 0, 
    0.000, 1, 0, 2, 
    0, 0.333, 0, 0, 
    NULL
);

-- Lonestar TX Baseball Club: Owen Curtis
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Lonestar TX Baseball Club', 'Owen Curtis', '4', NULL,
    2, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 0, 0, 
    0, NULL,
    0.000, 2, 0, 0, 
    0.000, 0, 0, 0, 
    1, 0.000, 0, 0, 
    NULL
);

-- Dodge City A's: Kayne Carlos
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Dodge City A''s', 'Kayne Carlos', '19', NULL,
    3, 9, 1, 5, 
    1, 0, 0, 1, 
    0, 0, 6, 4, 
    1, 0.909,
    0.556, 3, 3, 6, 
    0.667, 1, 1, 2, 
    0, 0.636, 0, 0, 
    0.909
);

-- Dodge City A's: Matt Perez
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Dodge City A''s', 'Matt Perez', '27', NULL,
    3, 11, 1, 4, 
    2, 0, 0, 3, 
    0, 0, 7, 2, 
    0, 1.000,
    0.364, 3, 3, 6, 
    0.545, 0, 0, 0, 
    0, 0.333, 1, 0, 
    1.000
);

-- Dodge City A's: Isaiah Velazco
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Dodge City A''s', 'Isaiah Velazco', '16', NULL,
    3, 11, 1, 3, 
    2, 0, 0, 1, 
    1, 0, 11, 0, 
    0, 1.000,
    0.273, 3, 3, 5, 
    0.455, 0, 1, 2, 
    0, 0.333, 0, 1, 
    1.000
);

-- Dodge City A's: Jacobe Radcliffe
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Dodge City A''s', 'Jacobe Radcliffe', '15', NULL,
    3, 9, 3, 2, 
    0, 0, 0, 1, 
    2, 0, 8, 0, 
    0, 1.000,
    0.222, 3, 3, 2, 
    0.222, 2, 0, 0, 
    0, 0.364, 0, 2, 
    1.000
);

-- Dodge City A's: Edward Gregory Jr
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Dodge City A''s', 'Edward Gregory Jr', '6', NULL,
    3, 8, 3, 1, 
    0, 1, 0, 1, 
    0, 0, 7, 7, 
    0, 1.000,
    0.125, 3, 3, 3, 
    0.375, 4, 1, 5, 
    0, 0.462, 0, 0, 
    1.000
);

-- Dodge City A's: Blake Coleman
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Dodge City A''s', 'Blake Coleman', '24', NULL,
    3, 10, 3, 1, 
    0, 0, 0, 2, 
    0, 0, 11, 2, 
    0, 1.000,
    0.100, 3, 3, 1, 
    0.100, 1, 1, 1, 
    0, 0.250, 0, 0, 
    1.000
);

-- Dodge City A's: Nolan Huff
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Dodge City A''s', 'Nolan Huff', '21', NULL,
    1, 1, 1, 1, 
    0, 0, 0, 0, 
    0, 0, 0, 0, 
    0, NULL,
    1.000, 1, 0, 1, 
    1.000, 0, 0, 0, 
    0, 1.000, 0, 0, 
    NULL
);

-- Dodge City A's: Ryne Buckley
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Dodge City A''s', 'Ryne Buckley', '10', NULL,
    1, 2, 2, 1, 
    0, 0, 1, 5, 
    0, 0, 0, 0, 
    0, NULL,
    0.500, 1, 1, 4, 
    2.000, 1, 1, 0, 
    0, 0.750, 0, 0, 
    NULL
);

-- Dodge City A's: Zach Hoskins
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Dodge City A''s', 'Zach Hoskins', '9', NULL,
    2, 4, 1, 1, 
    1, 0, 0, 3, 
    0, 1, 0, 0, 
    1, NULL,
    0.250, 2, 1, 2, 
    0.500, 0, 1, 0, 
    0, 0.400, 0, 0, 
    NULL
);

-- Dodge City A's: Paxton Huff
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Dodge City A''s', 'Paxton Huff', '13', NULL,
    3, 5, 2, 1, 
    0, 0, 0, 0, 
    0, 0, 5, 0, 
    0, 1.000,
    0.200, 3, 2, 1, 
    0.200, 2, 0, 1, 
    0, 0.429, 0, 0, 
    1.000
);

-- Dodge City A's: Jadin Moreno
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Dodge City A''s', 'Jadin Moreno', '23', NULL,
    3, 6, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 2, 0, 
    0, 1.000,
    0.000, 3, 2, 0, 
    0.000, 0, 1, 4, 
    0, 0.143, 0, 0, 
    1.000
);

-- Dodge City A's: Dominic Roberts
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Dodge City A''s', 'Dominic Roberts', '4', NULL,
    1, 3, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 2, 0, 
    0, 1.000,
    0.000, 1, 1, 0, 
    0.000, 0, 0, 1, 
    0, 0.000, 0, 0, 
    1.000
);

-- Dodge City A's: Edwin Silverio
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Dodge City A''s', 'Edwin Silverio', '1', NULL,
    1, 3, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 0, 3, 
    0, 1.000,
    0.000, 1, 1, 0, 
    0.000, 0, 0, 0, 
    0, 0.000, 0, 0, 
    1.000
);

-- Dodge City A's: Kevin Hammond
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'Dodge City A''s', 'Kevin Hammond', '34', NULL,
    1, 2, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 3, 1, 
    0, 1.000,
    0.000, 1, 1, 0, 
    0.000, 0, 0, 0, 
    0, 0.000, 0, 0, 
    1.000
);

-- BTL Hornets: Holden Groebl
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'BTL Hornets', 'Holden Groebl', '6', NULL,
    3, 5, 1, 2, 
    1, 0, 0, 1, 
    0, 0, 10, 6, 
    0, 1.000,
    0.400, 3, 3, 3, 
    0.600, 4, 0, 1, 
    0, 0.667, 0, 1, 
    1.000
);

-- BTL Hornets: Tyler Coffin
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'BTL Hornets', 'Tyler Coffin', '3', NULL,
    3, 8, 2, 3, 
    0, 0, 0, 1, 
    2, 0, 8, 10, 
    0, 1.000,
    0.375, 3, 3, 3, 
    0.375, 1, 0, 3, 
    0, 0.444, 0, 2, 
    1.000
);

-- BTL Hornets: Josh Holmes
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'BTL Hornets', 'Josh Holmes', '1', NULL,
    3, 8, 2, 2, 
    0, 0, 0, 0, 
    0, 0, 8, 0, 
    0, 1.000,
    0.250, 3, 3, 2, 
    0.250, 1, 0, 1, 
    0, 0.333, 0, 0, 
    1.000
);

-- BTL Hornets: Cade Martinez
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'BTL Hornets', 'Cade Martinez', '2', NULL,
    3, 9, 1, 2, 
    1, 0, 0, 3, 
    0, 0, 6, 4, 
    0, 1.000,
    0.222, 3, 3, 3, 
    0.333, 0, 0, 0, 
    0, 0.222, 0, 0, 
    1.000
);

-- BTL Hornets: Micah Kobuszewski
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'BTL Hornets', 'Micah Kobuszewski', '24', NULL,
    3, 7, 2, 1, 
    0, 0, 0, 0, 
    1, 0, 3, 1, 
    0, 1.000,
    0.143, 3, 3, 1, 
    0.143, 2, 0, 0, 
    0, 0.333, 0, 1, 
    1.000
);

-- BTL Hornets: Quinn Groebl
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'BTL Hornets', 'Quinn Groebl', '7', NULL,
    3, 5, 0, 0, 
    0, 0, 0, 1, 
    0, 0, 4, 2, 
    0, 1.000,
    0.000, 3, 3, 0, 
    0.000, 3, 0, 1, 
    0, 0.333, 1, 0, 
    1.000
);

-- BTL Hornets: Eli Sitzer
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'BTL Hornets', 'Eli Sitzer', '21', NULL,
    3, 6, 1, 2, 
    0, 0, 0, 0, 
    0, 0, 3, 0, 
    0, 1.000,
    0.333, 3, 3, 2, 
    0.333, 1, 0, 2, 
    0, 0.429, 0, 0, 
    1.000
);

-- BTL Hornets: Clayton Anderson
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'BTL Hornets', 'Clayton Anderson', '4', NULL,
    2, 4, 1, 1, 
    0, 0, 0, 0, 
    0, 0, 4, 0, 
    0, 1.000,
    0.250, 2, 2, 1, 
    0.250, 0, 1, 2, 
    0, 0.400, 0, 0, 
    1.000
);

-- BTL Hornets: Cooper Schwindt
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'BTL Hornets', 'Cooper Schwindt', '18', NULL,
    3, 7, 0, 1, 
    0, 0, 0, 2, 
    0, 0, 7, 1, 
    0, 1.000,
    0.143, 3, 2, 1, 
    0.143, 0, 0, 2, 
    0, 0.143, 0, 0, 
    1.000
);

-- BTL Hornets: Tanner Pachorek
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'BTL Hornets', 'Tanner Pachorek', '5', NULL,
    2, 3, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 3, 2, 
    0, 1.000,
    0.000, 2, 2, 0, 
    0.000, 0, 0, 2, 
    0, 0.000, 0, 0, 
    1.000
);

-- BTL Hornets: Gabe Pitts
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'BTL Hornets', 'Gabe Pitts', '27', NULL,
    1, 0, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 0, 0, 
    0, NULL,
    0.000, 1, 0, 0, 
    0.000, 0, 0, 0, 
    0, 0.000, 0, 0, 
    NULL
);

-- MVP Oklahoma: Hutch Russell
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'MVP Oklahoma', 'Hutch Russell', '10', NULL,
    2, 8, 1, 4, 
    0, 0, 0, 1, 
    1, 0, 3, 4, 
    0, 1.000,
    0.500, 2, 2, 4, 
    0.500, 0, 0, 2, 
    0, 0.500, 0, 1, 
    1.000
);

-- MVP Oklahoma: Connor Cavnar
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'MVP Oklahoma', 'Connor Cavnar', '19', NULL,
    2, 5, 2, 2, 
    1, 0, 0, 2, 
    0, 0, 0, 0, 
    0, NULL,
    0.400, 2, 2, 3, 
    0.600, 0, 1, 1, 
    0, 0.429, 1, 0, 
    NULL
);

-- MVP Oklahoma: Carson Miller
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'MVP Oklahoma', 'Carson Miller', '40', NULL,
    2, 5, 2, 2, 
    1, 0, 0, 0, 
    0, 0, 4, 0, 
    0, 1.000,
    0.400, 2, 2, 3, 
    0.600, 1, 2, 1, 
    0, 0.625, 0, 0, 
    1.000
);

-- MVP Oklahoma: Tanner Norman
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'MVP Oklahoma', 'Tanner Norman', '2', NULL,
    2, 7, 1, 2, 
    0, 0, 0, 2, 
    0, 0, 11, 2, 
    0, 1.000,
    0.286, 2, 2, 2, 
    0.286, 2, 0, 1, 
    0, 0.444, 0, 0, 
    1.000
);

-- MVP Oklahoma: Rayner Beene
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'MVP Oklahoma', 'Rayner Beene', '6', NULL,
    2, 8, 2, 2, 
    1, 0, 0, 1, 
    1, 0, 4, 4, 
    1, 0.889,
    0.250, 2, 2, 3, 
    0.375, 1, 0, 0, 
    0, 0.333, 0, 1, 
    0.889
);

-- MVP Oklahoma: Ashton Hartwig
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'MVP Oklahoma', 'Ashton Hartwig', '8', NULL,
    2, 8, 0, 0, 
    0, 0, 0, 1, 
    0, 0, 9, 0, 
    1, 0.900,
    0.000, 2, 2, 0, 
    0.000, 0, 1, 0, 
    0, 0.111, 0, 0, 
    0.900
);

-- MVP Oklahoma: Eli Hill
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'MVP Oklahoma', 'Eli Hill', '11', NULL,
    1, 4, 1, 1, 
    0, 0, 0, 0, 
    0, 0, 3, 3, 
    1, 0.857,
    0.250, 1, 1, 1, 
    0.250, 1, 0, 1, 
    0, 0.400, 0, 0, 
    0.857
);

-- MVP Oklahoma: Brand Wilson
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'MVP Oklahoma', 'Brand Wilson', '29', NULL,
    1, 5, 0, 1, 
    0, 0, 0, 1, 
    0, 0, 0, 0, 
    0, NULL,
    0.200, 1, 1, 1, 
    0.200, 0, 0, 2, 
    0, 0.200, 0, 0, 
    NULL
);

-- MVP Oklahoma: Graham Hylton
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'MVP Oklahoma', 'Graham Hylton', '13', NULL,
    1, 4, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 6, 0, 
    0, 1.000,
    0.000, 1, 1, 0, 
    0.000, 1, 0, 1, 
    0, 0.200, 0, 0, 
    1.000
);

-- MVP Oklahoma: Holden Lough
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'MVP Oklahoma', 'Holden Lough', '32', NULL,
    2, 4, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 0, 0, 
    0, NULL,
    0.000, 2, 1, 0, 
    0.000, 0, 0, 3, 
    0, 0.000, 0, 0, 
    NULL
);

-- MVP Oklahoma: Tanner Fallwell
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'MVP Oklahoma', 'Tanner Fallwell', '42', NULL,
    1, 3, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 3, 0, 
    0, 1.000,
    0.000, 1, 1, 0, 
    0.000, 0, 0, 3, 
    0, 0.000, 0, 0, 
    1.000
);

-- MVP Oklahoma: Creed Muirhead
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'MVP Oklahoma', 'Creed Muirhead', '7', NULL,
    1, 3, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 8, 1, 
    0, 1.000,
    0.000, 1, 1, 0, 
    0.000, 0, 0, 1, 
    0, 0.000, 0, 0, 
    1.000
);

-- GPX TX Legends: Dayton Tockey
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'GPX TX Legends', 'Dayton Tockey', '33', NULL,
    3, 12, 2, 6, 
    2, 0, 0, 3, 
    0, 0, 11, 2, 
    0, 1.000,
    0.500, 3, 3, 8, 
    0.667, 3, 0, 5, 
    0, 0.600, 0, 1, 
    1.000
);

-- GPX TX Legends: Jackson Rainey
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'GPX TX Legends', 'Jackson Rainey', '11', NULL,
    2, 7, 5, 3, 
    2, 0, 0, 2, 
    0, 0, 2, 1, 
    0, 1.000,
    0.429, 2, 2, 5, 
    0.714, 1, 1, 1, 
    0, 0.556, 0, 0, 
    1.000
);

-- GPX TX Legends: Raphael Pelletier
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'GPX TX Legends', 'Raphael Pelletier', '46', NULL,
    3, 12, 1, 4, 
    2, 0, 0, 1, 
    0, 0, 21, 3, 
    1, 0.960,
    0.333, 3, 3, 6, 
    0.500, 0, 0, 1, 
    1, 0.333, 0, 0, 
    0.960
);

-- GPX TX Legends: Rhenn Andrewartha
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'GPX TX Legends', 'Rhenn Andrewartha', '28', NULL,
    3, 6, 2, 2, 
    0, 0, 0, 2, 
    0, 0, 6, 1, 
    0, 1.000,
    0.333, 3, 2, 2, 
    0.333, 3, 0, 2, 
    0, 0.556, 0, 0, 
    1.000
);

-- GPX TX Legends: Caleb Small
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'GPX TX Legends', 'Caleb Small', '43', NULL,
    3, 8, 1, 2, 
    1, 0, 0, 2, 
    1, 0, 3, 0, 
    0, 1.000,
    0.250, 3, 2, 3, 
    0.375, 1, 0, 4, 
    1, 0.300, 1, 2, 
    1.000
);

-- GPX TX Legends: Joe Sandusky
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'GPX TX Legends', 'Joe Sandusky', '1', NULL,
    3, 14, 3, 3, 
    2, 0, 0, 2, 
    1, 0, 8, 10, 
    0, 1.000,
    0.214, 3, 3, 5, 
    0.357, 0, 1, 4, 
    0, 0.267, 0, 1, 
    1.000
);

-- GPX TX Legends: Hudson Hartgrove
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'GPX TX Legends', 'Hudson Hartgrove', '14', NULL,
    3, 14, 2, 3, 
    1, 0, 1, 4, 
    1, 0, 5, 6, 
    3, 0.786,
    0.214, 3, 3, 7, 
    0.500, 1, 0, 3, 
    0, 0.267, 0, 1, 
    0.786
);

-- GPX TX Legends: Colby Fowler
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'GPX TX Legends', 'Colby Fowler', '2', NULL,
    3, 10, 4, 2, 
    2, 0, 0, 0, 
    1, 1, 8, 0, 
    0, 1.000,
    0.200, 3, 3, 4, 
    0.400, 3, 0, 1, 
    0, 0.385, 0, 2, 
    1.000
);

-- GPX TX Legends: Chase Fricke
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'GPX TX Legends', 'Chase Fricke', '56', NULL,
    3, 7, 1, 1, 
    0, 0, 0, 0, 
    0, 0, 1, 0, 
    1, 0.500,
    0.143, 3, 3, 1, 
    0.143, 2, 1, 3, 
    0, 0.400, 0, 0, 
    0.500
);

-- GPX TX Legends: Nano Mendoza
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'GPX TX Legends', 'Nano Mendoza', '36', NULL,
    2, 5, 1, 2, 
    0, 0, 0, 2, 
    0, 0, 1, 1, 
    0, 1.000,
    0.400, 2, 1, 2, 
    0.400, 1, 0, 1, 
    0, 0.500, 0, 0, 
    1.000
);

-- GPX TX Legends: RJ Cardenas
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'GPX TX Legends', 'RJ Cardenas', '5', NULL,
    3, 6, 1, 2, 
    0, 0, 0, 2, 
    2, 0, 10, 6, 
    1, 0.941,
    0.333, 3, 2, 2, 
    0.333, 2, 0, 0, 
    0, 0.500, 0, 2, 
    0.941
);

-- GPX TX Legends: Dyllon King
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'GPX TX Legends', 'Dyllon King', '55', NULL,
    1, 3, 1, 1, 
    0, 0, 0, 0, 
    0, 0, 0, 0, 
    0, NULL,
    0.333, 1, 0, 1, 
    0.333, 1, 0, 0, 
    0, 0.500, 0, 1, 
    NULL
);

-- GPX TX Legends: Xander Covar
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'GPX TX Legends', 'Xander Covar', '6', NULL,
    2, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 0, 0, 
    0, NULL,
    0.000, 2, 0, 0, 
    0.000, 1, 0, 0, 
    0, 0.500, 0, 0, 
    NULL
);

-- GPX TX Legends: Matthew Pazak
INSERT INTO batting_stats (
    year, team_name, player_name, jersey_num, position,
    g, ab, r, h, "2b", "3b", hr, rbi, sb, sh, po, a, e, pct,
    avg, gp, gs, tb, slg, bb, hbp, so, gdp, obp, sf, sb_att, fld
) VALUES (
    2025, 'GPX TX Legends', 'Matthew Pazak', '15', NULL,
    1, 0, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 1, 0, 
    0, 1.000,
    0.000, 1, 0, 0, 
    0.000, 0, 0, 0, 
    0, 0.000, 0, 0, 
    1.000
);


-- ============================================================
-- PITCHING STATISTICS (128 records)  
-- ============================================================

-- Hutchinson Monarchs: Keegan Demmer
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Hutchinson Monarchs', 'Keegan Demmer', '20', NULL,
    2, 1, 0, 13.0, 
    9, 0, 0, 1, 
    17, 0, 0,
    0.00, 2, 1, 1, 
    1, 0, 0, 1, 
    0, 0, 47, 0.191, 
    0, 0, 0
);

-- Hutchinson Monarchs: AJ Mustow
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Hutchinson Monarchs', 'AJ Mustow', '35', NULL,
    2, 1, 0, 7.0, 
    1, 0, 0, 0, 
    12, 0, 0,
    0.00, 2, 1, 0, 
    0, 0, 0, 0, 
    0, 0, 22, 0.045, 
    0, 0, 0
);

-- Hutchinson Monarchs: Jackson Legg
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Hutchinson Monarchs', 'Jackson Legg', '21', NULL,
    2, 1, 0, 12.0, 
    7, 0, 0, 3, 
    10, 1, 2,
    0.00, 2, 1, 1, 
    0, 0, 0, 1, 
    0, 0, 41, 0.171, 
    0, 0, 0
);

-- Hutchinson Monarchs: Joey Senstock
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Hutchinson Monarchs', 'Joey Senstock', '11', NULL,
    2, 1, 0, 12.2, 
    13, 2, 1, 3, 
    7, 1, 1,
    0.71, 2, 1, 0, 
    0, 0, 0, 3, 
    0, 0, 47, 0.277, 
    0, 0, 0
);

-- Hutchinson Monarchs: Jake Knox
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Hutchinson Monarchs', 'Jake Knox', '33', NULL,
    2, 1, 0, 9.1, 
    5, 2, 2, 5, 
    7, 0, 1,
    1.93, 2, 2, 0, 
    0, 0, 0, 1, 
    0, 0, 30, 0.167, 
    0, 0, 0
);

-- Hutchinson Monarchs: JJ Spafford
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Hutchinson Monarchs', 'JJ Spafford', '2', NULL,
    3, 0, 0, 4.1, 
    3, 1, 1, 0, 
    5, 0, 0,
    2.08, 3, 0, 0, 
    0, 0, 1, 0, 
    0, 0, 14, 0.214, 
    0, 0, 0
);

-- Hutchinson Monarchs: Blake Bradford
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Hutchinson Monarchs', 'Blake Bradford', '10', NULL,
    2, 0, 0, 8.0, 
    11, 5, 5, 3, 
    2, 1, 3,
    5.63, 2, 0, 0, 
    0, 0, 0, 2, 
    0, 0, 33, 0.333, 
    0, 0, 0
);

-- Hutchinson Monarchs: Drew Bugner
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Hutchinson Monarchs', 'Drew Bugner', '13', NULL,
    2, 0, 0, 3.2, 
    6, 3, 3, 0, 
    2, 0, 0,
    7.36, 2, 0, 0, 
    0, 0, 0, 1, 
    0, 0, 16, 0.375, 
    0, 0, 0
);

-- Hutchinson Monarchs: Jarrett Herrmann
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Hutchinson Monarchs', 'Jarrett Herrmann', '3', NULL,
    1, 0, 0, 1.0, 
    3, 1, 1, 0, 
    1, 0, 0,
    9.00, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 6, 0.500, 
    0, 0, 0
);

-- Hutchinson Monarchs: Jaden Gustafson
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Hutchinson Monarchs', 'Jaden Gustafson', '14', NULL,
    1, 0, 0, 1.2, 
    2, 2, 2, 1, 
    1, 0, 0,
    10.80, 1, 0, 0, 
    0, 0, 0, 1, 
    0, 0, 7, 0.286, 
    0, 0, 0
);

-- Hutchinson Monarchs: Dylan Bell
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Hutchinson Monarchs', 'Dylan Bell', '18', NULL,
    1, 0, 0, 0.2, 
    1, 1, 1, 1, 
    0, 0, 0,
    13.50, 1, 0, 0, 
    0, 0, 0, 1, 
    0, 0, 3, 0.333, 
    0, 0, 0
);

-- Hutchinson Monarchs: Jake Gutierrez
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Hutchinson Monarchs', 'Jake Gutierrez', '27', NULL,
    1, 0, 0, 0.1, 
    1, 1, 1, 0, 
    0, 0, 0,
    27.00, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 2, 0.500, 
    0, 0, 0
);

-- Hutchinson Monarchs: Tyson Vassart
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Hutchinson Monarchs', 'Tyson Vassart', '36', NULL,
    1, 0, 0, 0.0, 
    3, 2, 2, 0, 
    0, 0, 0,
    NULL, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 3, 1.000, 
    0, 0, 0
);

-- Lonestar Kraken TX: Jacob Manaska
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Lonestar Kraken TX', 'Jacob Manaska', '5', NULL,
    2, 1, 0, 11.0, 
    7, 0, 0, 2, 
    11, 1, 0,
    0.00, 2, 2, 0, 
    0, 0, 0, 1, 
    1, 0, 39, 0.179, 
    0, 0, 0
);

-- Lonestar Kraken TX: Josh Livingston
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Lonestar Kraken TX', 'Josh Livingston', '45', NULL,
    2, 1, 0, 6.0, 
    5, 0, 0, 1, 
    4, 0, 0,
    0.00, 2, 1, 0, 
    0, 0, 0, 0, 
    0, 0, 20, 0.250, 
    0, 0, 0
);

-- Lonestar Kraken TX: Grant Nekuza
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Lonestar Kraken TX', 'Grant Nekuza', '0', NULL,
    2, 1, 0, 5.0, 
    1, 0, 0, 0, 
    5, 0, 0,
    0.00, 2, 1, 0, 
    0, 0, 0, 0, 
    1, 0, 15, 0.067, 
    0, 0, 0
);

-- Lonestar Kraken TX: Major Brignon
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Lonestar Kraken TX', 'Major Brignon', '21', NULL,
    3, 1, 0, 9.0, 
    5, 2, 1, 0, 
    9, 1, 1,
    1.00, 3, 1, 0, 
    0, 0, 0, 0, 
    1, 0, 31, 0.161, 
    0, 0, 0
);

-- Lonestar Kraken TX: Jax Marshall
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Lonestar Kraken TX', 'Jax Marshall', '56', NULL,
    3, 0, 1, 7.1, 
    10, 4, 4, 4, 
    10, 0, 0,
    4.91, 3, 1, 0, 
    0, 0, 0, 2, 
    0, 0, 30, 0.333, 
    0, 0, 0
);

-- Lonestar Kraken TX: Chase Pendley
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Lonestar Kraken TX', 'Chase Pendley', '1', NULL,
    2, 0, 0, 1.2, 
    3, 1, 1, 0, 
    2, 0, 0,
    5.40, 2, 0, 0, 
    0, 0, 0, 1, 
    0, 0, 8, 0.375, 
    0, 0, 0
);

-- Lonestar Kraken TX: Kado Robardy
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Lonestar Kraken TX', 'Kado Robardy', '2', NULL,
    3, 0, 0, 3.0, 
    4, 2, 2, 1, 
    2, 0, 0,
    6.00, 3, 0, 0, 
    0, 0, 1, 1, 
    0, 0, 13, 0.308, 
    0, 0, 0
);

-- Lonestar Kraken TX: JT Simonelli
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Lonestar Kraken TX', 'JT Simonelli', '67', NULL,
    2, 0, 0, 1.1, 
    3, 1, 1, 0, 
    2, 0, 0,
    6.75, 2, 0, 0, 
    0, 0, 0, 1, 
    0, 0, 6, 0.500, 
    0, 0, 0
);

-- Lonestar Kraken TX: Micah Melott
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Lonestar Kraken TX', 'Micah Melott', '00', NULL,
    1, 0, 0, 1.0, 
    2, 1, 1, 0, 
    1, 0, 0,
    9.00, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 5, 0.400, 
    0, 0, 0
);

-- Lonestar Kraken TX: Diego Gonzalez
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Lonestar Kraken TX', 'Diego Gonzalez', '9', NULL,
    1, 0, 1, 3.1, 
    7, 4, 4, 0, 
    3, 1, 0,
    10.80, 1, 1, 0, 
    0, 0, 0, 1, 
    0, 1, 17, 0.412, 
    0, 0, 0
);

-- Lonestar Kraken TX: Kenner Lauterbach
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Lonestar Kraken TX', 'Kenner Lauterbach', '42', NULL,
    1, 0, 0, 0.2, 
    1, 1, 1, 1, 
    0, 0, 0,
    13.50, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 2, 0.500, 
    0, 0, 0
);

-- Lonestar Kraken TX: Preston Curtis
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Lonestar Kraken TX', 'Preston Curtis', '13', NULL,
    1, 0, 0, 0.2, 
    1, 1, 1, 1, 
    1, 0, 0,
    13.50, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 2, 0.500, 
    0, 0, 0
);

-- Lonestar Kraken TX: Ethan Ho
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Lonestar Kraken TX', 'Ethan Ho', '20', NULL,
    1, 0, 0, 1.0, 
    2, 2, 2, 1, 
    0, 1, 0,
    18.00, 1, 0, 0, 
    0, 0, 0, 1, 
    0, 1, 5, 0.400, 
    0, 0, 0
);

-- Lonestar Kraken TX: Sage Wimberly
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Lonestar Kraken TX', 'Sage Wimberly', '19', NULL,
    1, 0, 0, 1.0, 
    4, 2, 2, 0, 
    0, 1, 0,
    18.00, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 6, 0.667, 
    0, 0, 0
);

-- Lonestar Kraken TX: Dakota Johnson
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Lonestar Kraken TX', 'Dakota Johnson', '10', NULL,
    1, 0, 0, 0.1, 
    1, 1, 1, 1, 
    0, 0, 0,
    27.00, 1, 0, 0, 
    0, 0, 0, 1, 
    0, 0, 2, 0.500, 
    0, 0, 0
);

-- Hays Larks: Paul Smith
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Hays Larks', 'Paul Smith', '25', NULL,
    2, 1, 0, 7.0, 
    3, 0, 0, 0, 
    14, 0, 0,
    0.00, 2, 1, 0, 
    0, 0, 0, 0, 
    0, 0, 24, 0.125, 
    0, 0, 0
);

-- Hays Larks: Dylan LaRue
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Hays Larks', 'Dylan LaRue', '26', NULL,
    2, 1, 0, 6.0, 
    4, 0, 0, 2, 
    7, 0, 0,
    0.00, 2, 1, 0, 
    0, 0, 0, 0, 
    0, 0, 21, 0.190, 
    0, 0, 0
);

-- Hays Larks: Lorenzo Rios
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Hays Larks', 'Lorenzo Rios', '21', NULL,
    2, 1, 0, 12.0, 
    9, 2, 2, 1, 
    4, 0, 0,
    1.50, 2, 1, 1, 
    1, 0, 0, 2, 
    0, 0, 42, 0.214, 
    0, 0, 0
);

-- Hays Larks: Thomas Lyssy
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Hays Larks', 'Thomas Lyssy', '15', NULL,
    2, 0, 0, 2.0, 
    2, 1, 1, 1, 
    2, 0, 0,
    4.50, 2, 0, 0, 
    0, 0, 0, 1, 
    0, 0, 7, 0.286, 
    0, 0, 0
);

-- Hays Larks: Julio Ramos
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Hays Larks', 'Julio Ramos', '24', NULL,
    3, 0, 1, 8.0, 
    13, 7, 5, 2, 
    5, 2, 1,
    5.63, 3, 1, 0, 
    0, 0, 0, 2, 
    0, 2, 36, 0.361, 
    0, 0, 0
);

-- Hays Larks: Jackson Babcock
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Hays Larks', 'Jackson Babcock', '5', NULL,
    2, 0, 0, 1.2, 
    5, 2, 2, 0, 
    2, 1, 0,
    10.80, 2, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 8, 0.625, 
    0, 0, 0
);

-- Hays Larks: CJ Reid
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Hays Larks', 'CJ Reid', '1', NULL,
    1, 0, 0, 0.2, 
    1, 1, 1, 0, 
    0, 1, 1,
    13.50, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 3, 0.333, 
    0, 0, 0
);

-- Hays Larks: Taber Stokes
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Hays Larks', 'Taber Stokes', '6', NULL,
    1, 0, 0, 2.0, 
    6, 5, 5, 1, 
    4, 0, 0,
    22.50, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 12, 0.500, 
    0, 0, 0
);

-- Hays Larks: Brady Kreutzer
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Hays Larks', 'Brady Kreutzer', '4', NULL,
    1, 0, 0, 0.1, 
    3, 2, 2, 1, 
    0, 0, 0,
    54.00, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 4, 0.750, 
    0, 0, 0
);

-- Seattle Studs: Jackson Copeland
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Seattle Studs', 'Jackson Copeland', '16', NULL,
    2, 1, 0, 11.0, 
    4, 0, 0, 0, 
    16, 0, 0,
    0.00, 2, 2, 0, 
    0, 0, 0, 1, 
    0, 0, 36, 0.111, 
    0, 0, 0
);

-- Seattle Studs: Joel Fernandez
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Seattle Studs', 'Joel Fernandez', '24', NULL,
    2, 1, 0, 7.0, 
    4, 1, 1, 0, 
    10, 0, 0,
    1.29, 2, 1, 0, 
    0, 0, 0, 1, 
    0, 0, 25, 0.160, 
    0, 0, 0
);

-- Seattle Studs: Bradley Carl
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Seattle Studs', 'Bradley Carl', '4', NULL,
    2, 0, 0, 4.2, 
    4, 2, 2, 2, 
    4, 0, 0,
    3.86, 2, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 17, 0.235, 
    0, 0, 0
);

-- Seattle Studs: Jake Gallagher
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Seattle Studs', 'Jake Gallagher', '8', NULL,
    2, 0, 1, 6.0, 
    9, 5, 3, 1, 
    7, 0, 0,
    4.50, 2, 1, 0, 
    0, 0, 0, 1, 
    0, 0, 27, 0.333, 
    0, 0, 0
);

-- Seattle Studs: Tristan Ringrose
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Seattle Studs', 'Tristan Ringrose', '3', NULL,
    2, 1, 0, 3.1, 
    5, 2, 2, 1, 
    4, 0, 0,
    5.40, 2, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 15, 0.333, 
    0, 0, 0
);

-- Seattle Studs: Chandler Stocking
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Seattle Studs', 'Chandler Stocking', '7', NULL,
    2, 0, 0, 3.1, 
    5, 3, 3, 0, 
    2, 0, 0,
    8.10, 2, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 14, 0.357, 
    0, 0, 0
);

-- Seattle Studs: Gage Thompson
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Seattle Studs', 'Gage Thompson', '6', NULL,
    1, 0, 1, 5.0, 
    12, 8, 6, 0, 
    5, 2, 0,
    10.80, 1, 1, 0, 
    0, 0, 0, 1, 
    1, 1, 25, 0.480, 
    0, 0, 0
);

-- Seattle Studs: Jack Bergstrom
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Seattle Studs', 'Jack Bergstrom', '5', NULL,
    1, 0, 0, 0.2, 
    2, 1, 1, 0, 
    0, 0, 0,
    13.50, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 3, 0.667, 
    0, 0, 0
);

-- Seattle Studs: Chris Parkin
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Seattle Studs', 'Chris Parkin', '27', NULL,
    1, 0, 0, 0.1, 
    1, 1, 1, 1, 
    0, 0, 0,
    27.00, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 1, 1.000, 
    0, 0, 0
);

-- Alaska Goldpanners: Alex Garcia
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Alaska Goldpanners', 'Alex Garcia', '11', NULL,
    2, 1, 0, 6.0, 
    4, 0, 0, 0, 
    5, 0, 0,
    0.00, 2, 1, 0, 
    0, 0, 0, 1, 
    0, 0, 22, 0.182, 
    0, 0, 0
);

-- Alaska Goldpanners: Sam Stevenson
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Alaska Goldpanners', 'Sam Stevenson', '8', NULL,
    2, 1, 0, 6.0, 
    5, 2, 2, 3, 
    6, 0, 0,
    3.00, 2, 1, 0, 
    0, 0, 0, 0, 
    0, 0, 24, 0.208, 
    0, 0, 0
);

-- Alaska Goldpanners: Hunter Friedberg
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Alaska Goldpanners', 'Hunter Friedberg', '5', NULL,
    2, 0, 0, 3.0, 
    5, 2, 2, 0, 
    4, 0, 0,
    6.00, 2, 0, 0, 
    0, 0, 0, 0, 
    0, 1, 14, 0.357, 
    0, 0, 0
);

-- Alaska Goldpanners: David Shackelford
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Alaska Goldpanners', 'David Shackelford', '12', NULL,
    2, 0, 1, 4.2, 
    8, 4, 4, 1, 
    2, 0, 1,
    7.71, 2, 1, 0, 
    0, 0, 0, 1, 
    0, 0, 21, 0.381, 
    0, 0, 0
);

-- Alaska Goldpanners: Vincent Venverloh
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Alaska Goldpanners', 'Vincent Venverloh', '16', NULL,
    1, 0, 0, 0.2, 
    1, 1, 1, 1, 
    0, 1, 1,
    13.50, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 3, 0.333, 
    0, 0, 0
);

-- Alaska Goldpanners: Jamie Mullin
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Alaska Goldpanners', 'Jamie Mullin', '35', NULL,
    1, 0, 0, 0.1, 
    1, 1, 1, 0, 
    1, 0, 0,
    27.00, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 2, 0.500, 
    0, 0, 0
);

-- Alaska Goldpanners: Cole Clark
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Alaska Goldpanners', 'Cole Clark', '9', NULL,
    1, 0, 0, 0.1, 
    1, 1, 1, 1, 
    1, 0, 0,
    27.00, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 1, 2, 0.500, 
    0, 0, 0
);

-- Santa Barbara Foresters: Sawyer Farr
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Santa Barbara Foresters', 'Sawyer Farr', '5', NULL,
    2, 1, 0, 6.0, 
    4, 0, 0, 1, 
    8, 0, 0,
    0.00, 2, 1, 0, 
    0, 0, 0, 1, 
    0, 0, 21, 0.190, 
    0, 0, 0
);

-- Santa Barbara Foresters: Easton Moomau
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Santa Barbara Foresters', 'Easton Moomau', '23', NULL,
    2, 1, 0, 4.0, 
    5, 1, 1, 1, 
    4, 0, 1,
    2.25, 2, 1, 0, 
    0, 0, 0, 2, 
    0, 0, 16, 0.313, 
    0, 0, 0
);

-- Santa Barbara Foresters: Jonny Rodriguez
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Santa Barbara Foresters', 'Jonny Rodriguez', '31', NULL,
    2, 1, 0, 6.0, 
    6, 2, 2, 1, 
    6, 1, 0,
    3.00, 2, 1, 0, 
    0, 0, 0, 1, 
    0, 0, 22, 0.273, 
    0, 0, 0
);

-- Santa Barbara Foresters: Xavier Esquer
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Santa Barbara Foresters', 'Xavier Esquer', '12', NULL,
    2, 0, 0, 2.0, 
    2, 1, 1, 0, 
    2, 0, 1,
    4.50, 2, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 7, 0.286, 
    0, 0, 0
);

-- Santa Barbara Foresters: Brenton Clark
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Santa Barbara Foresters', 'Brenton Clark', '6', NULL,
    1, 0, 0, 1.1, 
    3, 1, 1, 0, 
    2, 0, 0,
    6.75, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 6, 0.500, 
    0, 0, 0
);

-- Santa Barbara Foresters: Caleb Hoover
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Santa Barbara Foresters', 'Caleb Hoover', '14', NULL,
    2, 0, 1, 4.2, 
    8, 5, 4, 1, 
    5, 2, 0,
    7.71, 2, 1, 0, 
    0, 0, 0, 3, 
    0, 0, 21, 0.381, 
    0, 0, 0
);

-- Santa Barbara Foresters: Terrence Kiel II
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Santa Barbara Foresters', 'Terrence Kiel II', '2', NULL,
    1, 0, 0, 1.0, 
    1, 1, 1, 2, 
    2, 0, 0,
    9.00, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 4, 0.250, 
    0, 0, 0
);

-- Santa Barbara Foresters: Caden Miller
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Santa Barbara Foresters', 'Caden Miller', '4', NULL,
    1, 0, 0, 1.2, 
    4, 2, 2, 0, 
    1, 1, 0,
    10.80, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 8, 0.500, 
    0, 0, 0
);

-- Santa Barbara Foresters: Mic Paul
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Santa Barbara Foresters', 'Mic Paul', '15', NULL,
    1, 0, 0, 1.2, 
    3, 2, 2, 0, 
    0, 0, 1,
    10.80, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 7, 0.429, 
    0, 0, 0
);

-- Santa Barbara Foresters: Cole Chamberlain
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Santa Barbara Foresters', 'Cole Chamberlain', '8', NULL,
    1, 0, 0, 0.1, 
    2, 1, 1, 0, 
    0, 1, 0,
    27.00, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 3, 0.667, 
    0, 0, 0
);

-- Santa Barbara Foresters: Zane Becker
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Santa Barbara Foresters', 'Zane Becker', '17', NULL,
    1, 0, 0, 0.0, 
    1, 1, 1, 0, 
    0, 0, 0,
    NULL, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 1, 1, 1.000, 
    0, 0, 0
);

-- Derby Twins: Dawson Robbins
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Derby Twins', 'Dawson Robbins', '20', NULL,
    2, 1, 0, 12.0, 
    9, 0, 0, 0, 
    16, 0, 0,
    0.00, 2, 2, 1, 
    0, 0, 0, 0, 
    0, 0, 42, 0.214, 
    0, 0, 0
);

-- Derby Twins: Teigan Munce
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Derby Twins', 'Teigan Munce', '31', NULL,
    2, 1, 0, 5.0, 
    3, 0, 0, 1, 
    7, 0, 0,
    0.00, 2, 1, 0, 
    0, 0, 0, 0, 
    0, 0, 17, 0.176, 
    0, 0, 0
);

-- Derby Twins: Jackson Ellison
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Derby Twins', 'Jackson Ellison', '2', NULL,
    3, 1, 1, 8.2, 
    12, 5, 4, 1, 
    5, 0, 0,
    4.15, 3, 1, 0, 
    0, 0, 1, 3, 
    0, 0, 35, 0.343, 
    0, 0, 0
);

-- Derby Twins: Kade Sheldon
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Derby Twins', 'Kade Sheldon', '7', NULL,
    2, 0, 0, 2.0, 
    2, 1, 1, 0, 
    3, 0, 0,
    4.50, 2, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 7, 0.286, 
    0, 0, 0
);

-- Derby Twins: Damian Garcia
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Derby Twins', 'Damian Garcia', '16', NULL,
    1, 0, 0, 1.0, 
    3, 1, 1, 0, 
    1, 0, 0,
    9.00, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 5, 0.600, 
    0, 0, 0
);

-- Derby Twins: Jackson Syring
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Derby Twins', 'Jackson Syring', '9', NULL,
    1, 0, 0, 1.0, 
    1, 1, 1, 0, 
    1, 1, 0,
    9.00, 1, 0, 0, 
    0, 0, 0, 1, 
    0, 0, 4, 0.250, 
    0, 0, 0
);

-- Derby Twins: Kyle Walker
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Derby Twins', 'Kyle Walker', '5', NULL,
    2, 0, 1, 4.2, 
    11, 9, 8, 2, 
    2, 1, 0,
    15.43, 2, 1, 0, 
    0, 0, 0, 5, 
    1, 0, 22, 0.500, 
    0, 0, 0
);

-- Derby Twins: Kole Dudding
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Derby Twins', 'Kole Dudding', '13', NULL,
    1, 0, 0, 0.1, 
    1, 1, 1, 1, 
    0, 0, 0,
    27.00, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 2, 0.500, 
    0, 0, 0
);

-- San Diego Stars: Raph Dunne
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'San Diego Stars', 'Raph Dunne', '34', NULL,
    2, 1, 0, 5.0, 
    2, 0, 0, 1, 
    10, 0, 0,
    0.00, 2, 1, 0, 
    0, 0, 0, 0, 
    0, 0, 16, 0.125, 
    0, 0, 0
);

-- San Diego Stars: Carter Lockwood
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'San Diego Stars', 'Carter Lockwood', '13', NULL,
    2, 1, 0, 4.0, 
    5, 1, 1, 0, 
    3, 0, 1,
    2.25, 2, 1, 0, 
    0, 0, 0, 2, 
    0, 0, 15, 0.333, 
    0, 0, 0
);

-- San Diego Stars: Will James
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'San Diego Stars', 'Will James', '21', NULL,
    2, 0, 0, 2.2, 
    5, 2, 2, 0, 
    3, 0, 0,
    6.75, 2, 0, 0, 
    0, 0, 0, 0, 
    0, 1, 12, 0.417, 
    0, 0, 0
);

-- San Diego Stars: Landen Bailey
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'San Diego Stars', 'Landen Bailey', '5', NULL,
    2, 0, 1, 4.2, 
    9, 4, 4, 1, 
    6, 0, 2,
    7.71, 2, 1, 0, 
    0, 0, 0, 1, 
    0, 1, 21, 0.429, 
    0, 0, 0
);

-- San Diego Stars: Joe Anderson
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'San Diego Stars', 'Joe Anderson', '4', NULL,
    3, 0, 1, 5.1, 
    11, 7, 6, 2, 
    4, 1, 1,
    10.12, 3, 1, 0, 
    0, 0, 0, 1, 
    0, 1, 25, 0.440, 
    0, 0, 0
);

-- San Diego Stars: Ethan Wright
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'San Diego Stars', 'Ethan Wright', '2', NULL,
    1, 0, 0, 1.2, 
    4, 2, 2, 1, 
    0, 0, 0,
    10.80, 1, 0, 0, 
    0, 0, 0, 1, 
    0, 0, 8, 0.500, 
    0, 0, 0
);

-- San Diego Stars: Gavin Gamino
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'San Diego Stars', 'Gavin Gamino', '9', NULL,
    1, 0, 0, 0.2, 
    2, 1, 1, 0, 
    0, 0, 0,
    13.50, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 3, 0.667, 
    0, 0, 0
);

-- San Diego Stars: Kayden Henson
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'San Diego Stars', 'Kayden Henson', '30', NULL,
    1, 0, 0, 1.0, 
    3, 2, 2, 0, 
    0, 0, 0,
    18.00, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 5, 0.600, 
    0, 0, 0
);

-- San Diego Stars: Logan Aguilar
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'San Diego Stars', 'Logan Aguilar', '27', NULL,
    1, 0, 0, 0.1, 
    1, 1, 1, 1, 
    0, 0, 0,
    27.00, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 2, 0.500, 
    0, 0, 0
);

-- Junction City Brigade: Garryn Plummer
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Junction City Brigade', 'Garryn Plummer', '5', NULL,
    2, 1, 0, 6.0, 
    1, 0, 0, 0, 
    12, 0, 0,
    0.00, 2, 1, 0, 
    0, 0, 0, 0, 
    0, 0, 19, 0.053, 
    0, 0, 0
);

-- Junction City Brigade: Eli Kellogg
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Junction City Brigade', 'Eli Kellogg', '26', NULL,
    2, 1, 0, 7.1, 
    5, 2, 2, 0, 
    11, 0, 0,
    2.45, 2, 1, 0, 
    0, 0, 0, 1, 
    0, 0, 26, 0.192, 
    0, 0, 0
);

-- Junction City Brigade: Gus Keller
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Junction City Brigade', 'Gus Keller', '8', NULL,
    2, 0, 0, 3.1, 
    4, 2, 2, 0, 
    2, 1, 0,
    5.40, 2, 0, 0, 
    0, 0, 1, 0, 
    0, 1, 13, 0.308, 
    0, 0, 0
);

-- Junction City Brigade: Gam Jones
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Junction City Brigade', 'Gam Jones', '11', NULL,
    2, 0, 1, 5.1, 
    8, 4, 4, 1, 
    5, 0, 1,
    6.75, 2, 1, 0, 
    0, 0, 0, 2, 
    0, 2, 22, 0.364, 
    0, 0, 0
);

-- Junction City Brigade: Brayden Harpole
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Junction City Brigade', 'Brayden Harpole', '20', NULL,
    1, 0, 0, 1.0, 
    2, 1, 1, 0, 
    2, 0, 0,
    9.00, 1, 0, 0, 
    0, 0, 0, 1, 
    0, 0, 5, 0.400, 
    0, 0, 0
);

-- Junction City Brigade: Gannon White
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Junction City Brigade', 'Gannon White', '10', NULL,
    1, 0, 0, 0.1, 
    3, 1, 1, 0, 
    1, 0, 0,
    27.00, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 1, 4, 0.750, 
    0, 0, 0
);

-- Junction City Brigade: Ian Luce
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Junction City Brigade', 'Ian Luce', '4', NULL,
    1, 0, 0, 0.1, 
    1, 1, 1, 1, 
    1, 0, 0,
    27.00, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 2, 0.500, 
    0, 0, 0
);

-- Top Prospect Academy: Hunter Sandifer
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Top Prospect Academy', 'Hunter Sandifer', '19', NULL,
    2, 1, 0, 6.0, 
    4, 0, 0, 0, 
    8, 0, 0,
    0.00, 2, 1, 0, 
    0, 0, 0, 1, 
    0, 0, 21, 0.190, 
    0, 0, 0
);

-- Top Prospect Academy: Decarlo Delancy
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Top Prospect Academy', 'Decarlo Delancy', '23', NULL,
    2, 1, 0, 6.0, 
    5, 1, 1, 1, 
    2, 0, 1,
    1.50, 2, 1, 0, 
    0, 0, 0, 1, 
    0, 0, 20, 0.250, 
    0, 0, 0
);

-- Top Prospect Academy: Angel Gutierrez
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Top Prospect Academy', 'Angel Gutierrez', '12', NULL,
    2, 1, 0, 4.0, 
    2, 1, 1, 1, 
    6, 0, 0,
    2.25, 2, 1, 0, 
    0, 0, 0, 0, 
    0, 0, 13, 0.154, 
    0, 0, 0
);

-- Top Prospect Academy: Grant Moore
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Top Prospect Academy', 'Grant Moore', '14', NULL,
    2, 0, 1, 6.0, 
    9, 4, 4, 1, 
    4, 1, 0,
    6.00, 2, 1, 0, 
    0, 0, 0, 1, 
    0, 1, 26, 0.346, 
    0, 0, 0
);

-- Top Prospect Academy: Luke Regas
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Top Prospect Academy', 'Luke Regas', '11', NULL,
    1, 0, 0, 1.0, 
    2, 1, 1, 0, 
    0, 0, 0,
    9.00, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 4, 0.500, 
    0, 0, 0
);

-- Top Prospect Academy: Jameson Lucky
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Top Prospect Academy', 'Jameson Lucky', '7', NULL,
    1, 0, 0, 0.1, 
    1, 1, 1, 1, 
    0, 0, 0,
    27.00, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 2, 0.500, 
    0, 0, 0
);

-- Top Prospect Academy: Aidan LeMasters
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Top Prospect Academy', 'Aidan LeMasters', '9', NULL,
    1, 0, 0, 0.1, 
    1, 1, 1, 1, 
    0, 0, 0,
    27.00, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 2, 0.500, 
    0, 0, 0
);

-- Seattle Blackfins: Brody Bluhm
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Seattle Blackfins', 'Brody Bluhm', '16', NULL,
    2, 1, 0, 6.0, 
    2, 0, 0, 1, 
    6, 0, 0,
    0.00, 2, 1, 0, 
    0, 0, 0, 0, 
    0, 0, 20, 0.100, 
    0, 0, 0
);

-- Seattle Blackfins: Brayden Larson
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Seattle Blackfins', 'Brayden Larson', '3', NULL,
    2, 1, 0, 6.0, 
    4, 0, 0, 0, 
    4, 0, 0,
    0.00, 2, 1, 0, 
    0, 0, 0, 0, 
    0, 0, 21, 0.190, 
    0, 0, 0
);

-- Seattle Blackfins: Joshua Carter
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Seattle Blackfins', 'Joshua Carter', '42', NULL,
    2, 0, 0, 3.2, 
    2, 1, 1, 0, 
    4, 0, 0,
    2.45, 2, 0, 0, 
    0, 0, 1, 0, 
    0, 0, 13, 0.154, 
    0, 0, 0
);

-- Seattle Blackfins: Joshua Williams
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Seattle Blackfins', 'Joshua Williams', '13', NULL,
    2, 0, 1, 5.1, 
    11, 5, 4, 2, 
    3, 1, 0,
    6.75, 2, 1, 0, 
    0, 0, 0, 2, 
    1, 1, 25, 0.440, 
    0, 0, 0
);

-- Seattle Blackfins: Cooper Barrow
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Seattle Blackfins', 'Cooper Barrow', '6', NULL,
    1, 0, 0, 1.2, 
    3, 2, 2, 0, 
    0, 0, 0,
    10.80, 1, 0, 0, 
    0, 0, 0, 0, 
    1, 0, 7, 0.429, 
    0, 0, 0
);

-- Seattle Blackfins: Cole Hoffman
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Seattle Blackfins', 'Cole Hoffman', '50', NULL,
    1, 0, 0, 0.1, 
    1, 1, 1, 1, 
    1, 0, 0,
    27.00, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 2, 0.500, 
    0, 0, 0
);

-- Lonestar TX Baseball Club: Travis Starkey
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Lonestar TX Baseball Club', 'Travis Starkey', '28', NULL,
    2, 1, 0, 5.0, 
    0, 0, 0, 0, 
    7, 0, 0,
    0.00, 2, 1, 0, 
    0, 0, 0, 0, 
    0, 0, 15, 0.000, 
    0, 0, 0
);

-- Lonestar TX Baseball Club: David Fluitt
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Lonestar TX Baseball Club', 'David Fluitt', '12', NULL,
    2, 1, 0, 3.2, 
    5, 2, 2, 2, 
    6, 1, 1,
    4.91, 2, 1, 0, 
    0, 0, 0, 0, 
    0, 1, 14, 0.357, 
    0, 0, 0
);

-- Lonestar TX Baseball Club: Matthew Fletcher
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Lonestar TX Baseball Club', 'Matthew Fletcher', '5', NULL,
    2, 0, 0, 3.1, 
    4, 2, 2, 1, 
    4, 0, 0,
    5.40, 2, 0, 0, 
    0, 0, 1, 1, 
    0, 0, 13, 0.308, 
    0, 0, 0
);

-- Lonestar TX Baseball Club: Owen Curtis
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Lonestar TX Baseball Club', 'Owen Curtis', '4', NULL,
    2, 0, 1, 3.2, 
    6, 3, 3, 2, 
    2, 0, 1,
    7.36, 2, 1, 0, 
    0, 0, 0, 0, 
    0, 0, 15, 0.400, 
    0, 0, 0
);

-- Lonestar TX Baseball Club: Tony DeJesus
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Lonestar TX Baseball Club', 'Tony DeJesus', '20', NULL,
    1, 0, 0, 1.2, 
    3, 2, 2, 1, 
    1, 0, 0,
    10.80, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 8, 0.375, 
    0, 0, 0
);

-- Lonestar TX Baseball Club: Nico Ruedas
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Lonestar TX Baseball Club', 'Nico Ruedas', '29', NULL,
    1, 0, 0, 0.2, 
    3, 1, 1, 0, 
    0, 0, 0,
    13.50, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 4, 0.750, 
    0, 0, 0
);

-- Lonestar TX Baseball Club: Ben Merriman
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Lonestar TX Baseball Club', 'Ben Merriman', '32', NULL,
    1, 0, 0, 0.1, 
    2, 1, 1, 0, 
    0, 1, 0,
    27.00, 1, 0, 0, 
    0, 0, 0, 1, 
    0, 0, 3, 0.667, 
    0, 0, 0
);

-- Dodge City A's: Paxton Huff
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Dodge City A''s', 'Paxton Huff', '13', NULL,
    2, 1, 0, 4.0, 
    4, 1, 1, 1, 
    3, 0, 0,
    2.25, 2, 1, 0, 
    0, 0, 0, 1, 
    0, 0, 15, 0.267, 
    0, 0, 0
);

-- Dodge City A's: Dominic Roberts
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Dodge City A''s', 'Dominic Roberts', '4', NULL,
    2, 1, 0, 4.0, 
    6, 3, 3, 1, 
    3, 0, 0,
    6.75, 2, 1, 0, 
    0, 0, 0, 2, 
    0, 0, 17, 0.353, 
    0, 0, 0
);

-- Dodge City A's: Zach Hoskins
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Dodge City A''s', 'Zach Hoskins', '9', NULL,
    2, 0, 1, 5.0, 
    8, 6, 6, 2, 
    5, 3, 1,
    10.80, 2, 1, 0, 
    0, 0, 0, 2, 
    0, 0, 22, 0.364, 
    0, 0, 0
);

-- Dodge City A's: Ryne Buckley
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Dodge City A''s', 'Ryne Buckley', '10', NULL,
    1, 0, 0, 0.2, 
    3, 1, 1, 0, 
    0, 0, 0,
    13.50, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 4, 0.750, 
    0, 0, 0
);

-- Dodge City A's: Jadin Moreno
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Dodge City A''s', 'Jadin Moreno', '23', NULL,
    1, 0, 0, 1.0, 
    3, 2, 2, 0, 
    2, 0, 0,
    18.00, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 5, 0.600, 
    0, 0, 0
);

-- Dodge City A's: Kevin Hammond
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'Dodge City A''s', 'Kevin Hammond', '34', NULL,
    1, 0, 0, 0.0, 
    1, 1, 1, 1, 
    0, 0, 0,
    NULL, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 1, 1.000, 
    0, 0, 0
);

-- BTL Hornets: Gabe Pitts
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'BTL Hornets', 'Gabe Pitts', '27', NULL,
    2, 1, 0, 4.0, 
    3, 1, 1, 3, 
    7, 0, 0,
    2.25, 2, 1, 0, 
    0, 0, 0, 0, 
    0, 0, 14, 0.214, 
    0, 0, 0
);

-- BTL Hornets: Clayton Anderson
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'BTL Hornets', 'Clayton Anderson', '4', NULL,
    2, 1, 0, 3.2, 
    8, 3, 3, 0, 
    3, 0, 0,
    7.36, 2, 1, 0, 
    0, 0, 0, 0, 
    0, 0, 18, 0.444, 
    0, 0, 0
);

-- BTL Hornets: Tanner Pachorek
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'BTL Hornets', 'Tanner Pachorek', '5', NULL,
    2, 0, 1, 4.0, 
    6, 4, 4, 1, 
    5, 0, 0,
    9.00, 2, 1, 0, 
    0, 0, 0, 1, 
    0, 0, 17, 0.353, 
    0, 0, 0
);

-- BTL Hornets: Eli Sitzer
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'BTL Hornets', 'Eli Sitzer', '21', NULL,
    1, 0, 0, 0.1, 
    3, 1, 1, 0, 
    0, 0, 0,
    27.00, 1, 0, 0, 
    0, 0, 0, 1, 
    0, 0, 4, 0.750, 
    0, 0, 0
);

-- MVP Oklahoma: Tanner Fallwell
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'MVP Oklahoma', 'Tanner Fallwell', '42', NULL,
    2, 1, 0, 4.0, 
    4, 2, 2, 1, 
    3, 0, 0,
    4.50, 2, 1, 0, 
    0, 0, 0, 2, 
    0, 0, 15, 0.267, 
    0, 0, 0
);

-- MVP Oklahoma: Graham Hylton
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'MVP Oklahoma', 'Graham Hylton', '13', NULL,
    2, 0, 1, 4.0, 
    7, 4, 4, 1, 
    4, 0, 0,
    9.00, 2, 1, 0, 
    0, 0, 0, 1, 
    0, 0, 18, 0.389, 
    0, 0, 0
);

-- MVP Oklahoma: Brand Wilson
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'MVP Oklahoma', 'Brand Wilson', '29', NULL,
    1, 0, 0, 1.0, 
    4, 2, 2, 0, 
    0, 0, 0,
    18.00, 1, 0, 0, 
    0, 0, 0, 1, 
    0, 0, 6, 0.667, 
    0, 0, 0
);

-- MVP Oklahoma: Holden Lough
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'MVP Oklahoma', 'Holden Lough', '32', NULL,
    1, 0, 0, 0.1, 
    2, 1, 1, 0, 
    0, 0, 0,
    27.00, 1, 0, 0, 
    0, 0, 0, 1, 
    0, 0, 3, 0.667, 
    0, 0, 0
);

-- GPX TX Legends: Hudson Hartgrove
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'GPX TX Legends', 'Hudson Hartgrove', '14', NULL,
    2, 1, 0, 4.0, 
    1, 1, 1, 3, 
    5, 0, 1,
    2.25, 2, 1, 0, 
    0, 0, 0, 0, 
    0, 0, 13, 0.077, 
    0, 0, 0
);

-- GPX TX Legends: RJ Cardenas
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'GPX TX Legends', 'RJ Cardenas', '5', NULL,
    2, 1, 0, 4.0, 
    4, 2, 2, 2, 
    7, 0, 0,
    4.50, 2, 1, 0, 
    0, 0, 0, 1, 
    0, 1, 15, 0.267, 
    0, 0, 0
);

-- GPX TX Legends: Dyllon King
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'GPX TX Legends', 'Dyllon King', '55', NULL,
    2, 0, 1, 6.0, 
    9, 4, 4, 2, 
    2, 0, 0,
    6.00, 2, 1, 0, 
    0, 0, 0, 3, 
    0, 0, 27, 0.333, 
    0, 0, 0
);

-- GPX TX Legends: Colby Fowler
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'GPX TX Legends', 'Colby Fowler', '2', NULL,
    1, 0, 0, 1.0, 
    3, 2, 2, 0, 
    2, 0, 0,
    18.00, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 5, 0.600, 
    0, 0, 0
);

-- GPX TX Legends: Xander Covar
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'GPX TX Legends', 'Xander Covar', '6', NULL,
    1, 0, 0, 1.0, 
    3, 2, 2, 0, 
    0, 0, 0,
    18.00, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 5, 0.600, 
    0, 0, 0
);

-- GPX TX Legends: Caleb Small
INSERT INTO pitching_stats (
    year, team_name, player_name, jersey_num, position,
    g, w, l, ip, h, r, er, bb, so, wp, hb,
    era, app, gs, cg, sho, cbo, sv, doubles, triples, hr, ab, b_avg, bk, sfa, sha
) VALUES (
    2025, 'GPX TX Legends', 'Caleb Small', '43', NULL,
    1, 0, 0, 0.1, 
    2, 1, 1, 0, 
    1, 0, 0,
    27.00, 1, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 3, 0.667, 
    0, 0, 0
);


COMMIT;

-- ============================================================
-- IMPORT COMPLETE - 331 records inserted
-- ============================================================
SELECT 'Import successful! 2025 NBC World Series data loaded.' AS status;
-- ============================================================
