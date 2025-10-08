-- --- Tournaments (idempotent)
INSERT INTO tournaments (year, start_date, end_date, location, total_teams)
VALUES
  (2019, '2019-08-01', '2019-08-10', 'Wichita, KS', 2),
  (2020, '2020-08-01', '2020-08-10', 'Wichita, KS', 2),
  (2021, '2021-08-01', '2021-08-10', 'Wichita, KS', 2),
  (2022, '2022-08-01', '2022-08-10', 'Wichita, KS', 2),
  (2023, '2023-08-01', '2023-08-10', 'Wichita, KS', 2)
ON CONFLICT (year) DO NOTHING;

-- Helper: get team ids
-- (These SELECTs are used inline below)
-- Champion/Runner-up team name pairs for each year:
-- 2019: Champion = Seattle Cheney Studs, Runner-Up = Santa Barbara Foresters
-- 2020: Champion = Santa Barbara Foresters, Runner-Up = Liberal Bee Jays
-- 2021: Champion = Santa Barbara Foresters, Runner-Up = Hays Larks
-- 2022: Champion = Santa Barbara Foresters, Runner-Up = Hutchinson Monarchs
-- 2023: Champion = Hutchinson Monarchs,   Runner-Up = Santa Barbara Foresters

-- --- Link teams to tournaments with finish positions (1=champion, 2=runner-up)

-- 2019
INSERT INTO tournament_teams (tournament_id, team_id, finish_position, wins, losses)
SELECT t.id, champ.id, 1, 5, 2
FROM tournaments t, LATERAL (SELECT id FROM teams WHERE name='Seattle Cheney Studs') champ
WHERE t.year=2019
  AND NOT EXISTS (
    SELECT 1 FROM tournament_teams tt WHERE tt.tournament_id=t.id AND tt.team_id=champ.id
  );

INSERT INTO tournament_teams (tournament_id, team_id, finish_position, wins, losses)
SELECT t.id, ru.id, 2, 4, 3
FROM tournaments t, LATERAL (SELECT id FROM teams WHERE name='Santa Barbara Foresters') ru
WHERE t.year=2019
  AND NOT EXISTS (
    SELECT 1 FROM tournament_teams tt WHERE tt.tournament_id=t.id AND tt.team_id=ru.id
  );

-- 2020
INSERT INTO tournament_teams (tournament_id, team_id, finish_position, wins, losses)
SELECT t.id, champ.id, 1, 5, 1
FROM tournaments t, LATERAL (SELECT id FROM teams WHERE name='Santa Barbara Foresters') champ
WHERE t.year=2020
  AND NOT EXISTS (
    SELECT 1 FROM tournament_teams tt WHERE tt.tournament_id=t.id AND tt.team_id=champ.id
  );

INSERT INTO tournament_teams (tournament_id, team_id, finish_position, wins, losses)
SELECT t.id, ru.id, 2, 4, 2
FROM tournaments t, LATERAL (SELECT id FROM teams WHERE name='Liberal Bee Jays') ru
WHERE t.year=2020
  AND NOT EXISTS (
    SELECT 1 FROM tournament_teams tt WHERE tt.tournament_id=t.id AND tt.team_id=ru.id
  );

-- 2021
INSERT INTO tournament_teams (tournament_id, team_id, finish_position, wins, losses)
SELECT t.id, champ.id, 1, 6, 1
FROM tournaments t, LATERAL (SELECT id FROM teams WHERE name='Santa Barbara Foresters') champ
WHERE t.year=2021
  AND NOT EXISTS (
    SELECT 1 FROM tournament_teams tt WHERE tt.tournament_id=t.id AND tt.team_id=champ.id
  );

INSERT INTO tournament_teams (tournament_id, team_id, finish_position, wins, losses)
SELECT t.id, ru.id, 2, 5, 2
FROM tournaments t, LATERAL (SELECT id FROM teams WHERE name='Hays Larks') ru
WHERE t.year=2021
  AND NOT EXISTS (
    SELECT 1 FROM tournament_teams tt WHERE tt.tournament_id=t.id AND tt.team_id=ru.id
  );

-- 2022
INSERT INTO tournament_teams (tournament_id, team_id, finish_position, wins, losses)
SELECT t.id, champ.id, 1, 6, 1
FROM tournaments t, LATERAL (SELECT id FROM teams WHERE name='Santa Barbara Foresters') champ
WHERE t.year=2022
  AND NOT EXISTS (
    SELECT 1 FROM tournament_teams tt WHERE tt.tournament_id=t.id AND tt.team_id=champ.id
  );

INSERT INTO tournament_teams (tournament_id, team_id, finish_position, wins, losses)
SELECT t.id, ru.id, 2, 5, 2
FROM tournaments t, LATERAL (SELECT id FROM teams WHERE name='Hutchinson Monarchs') ru
WHERE t.year=2022
  AND NOT EXISTS (
    SELECT 1 FROM tournament_teams tt WHERE tt.tournament_id=t.id AND tt.team_id=ru.id
  );

-- 2023
INSERT INTO tournament_teams (tournament_id, team_id, finish_position, wins, losses)
SELECT t.id, champ.id, 1, 6, 1
FROM tournaments t, LATERAL (SELECT id FROM teams WHERE name='Hutchinson Monarchs') champ
WHERE t.year=2023
  AND NOT EXISTS (
    SELECT 1 FROM tournament_teams tt WHERE tt.tournament_id=t.id AND tt.team_id=champ.id
  );

INSERT INTO tournament_teams (tournament_id, team_id, finish_position, wins, losses)
SELECT t.id, ru.id, 2, 5, 2
FROM tournaments t, LATERAL (SELECT id FROM teams WHERE name='Santa Barbara Foresters') ru
WHERE t.year=2023
  AND NOT EXISTS (
    SELECT 1 FROM tournament_teams tt WHERE tt.tournament_id=t.id AND tt.team_id=ru.id
  );

-- --- Update championships with runner-up + score (idempotent)
UPDATE championships c
SET runner_up_team_id = ru.id,
    championship_score = s.score
FROM (
  VALUES
    (2019, 'Santa Barbara Foresters', '3-1'),
    (2020, 'Liberal Bee Jays',       '4-2'),
    (2021, 'Hays Larks',             '6-4'),
    (2022, 'Hutchinson Monarchs',    '7-5'),
    (2023, 'Santa Barbara Foresters','5-3')
) AS s(year, runner_up_name, score)
JOIN teams ru ON ru.name = s.runner_up_name
WHERE c.year = s.year
  AND (c.runner_up_team_id IS DISTINCT FROM ru.id OR c.championship_score IS DISTINCT FROM s.score);
