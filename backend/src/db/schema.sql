CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT,
  state TEXT,
  league TEXT
);

CREATE TABLE IF NOT EXISTS championships (
  id SERIAL PRIMARY KEY,
  year INT UNIQUE NOT NULL,
  champion_team_id INT REFERENCES teams(id),
  runner_up_team_id INT REFERENCES teams(id),
  championship_score TEXT,
  mvp_player_id INT
);
CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  team_id INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  jersey_no TEXT,
  name TEXT NOT NULL,
  position TEXT,
  UNIQUE(team_id, name)
);

