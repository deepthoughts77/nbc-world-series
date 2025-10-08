CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  pool TEXT,
  record TEXT,
  home_record TEXT,
  away_record TEXT
);

CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  team_id INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  jersey_no TEXT,
  name TEXT NOT NULL,
  UNIQUE(team_id, name)
);

CREATE TABLE IF NOT EXISTS batting_stats (
  id SERIAL PRIMARY KEY,
  player_id INT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  season_key TEXT NOT NULL,        -- e.g., 'NBC-2025'
  gp INT, gs INT, ab INT, r INT, h INT,
  "2b" INT, "3b" INT, hr INT, rbi INT, tb INT,
  slg NUMERIC, bb INT, hbp INT, so INT, gdp INT,
  obp NUMERIC, sf INT, sh INT, sb INT, att INT,
  UNIQUE(player_id, season_key)
);

CREATE TABLE IF NOT EXISTS pitching_stats (
  id SERIAL PRIMARY KEY,
  player_id INT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  season_key TEXT NOT NULL,
  era NUMERIC, w INT, l INT, app INT, gs INT, cg INT, sho INT, cbo INT, sv INT,
  ip NUMERIC, h INT, r INT, er INT, bb INT, so INT, "2b" INT, "3b" INT, hr INT,
  wp INT, hbp INT, bk INT, sfa INT, sha INT,
  UNIQUE(player_id, season_key)
);
