-- NBC World Series Database Schema (Upgraded)
-- - SERIAL -> IDENTITY columns
-- - Added indexes on foreign keys for performance
-- - Added date/year CHECK constraints on tournaments
-- - Kept your original table/column names and layout

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    state VARCHAR(50),
    league VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Players table
CREATE TABLE IF NOT EXISTS players (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
    is_hall_of_fame BOOLEAN DEFAULT FALSE,
    mlb_team VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    year INTEGER NOT NULL UNIQUE,
    start_date DATE,
    end_date DATE,
    location VARCHAR(100) DEFAULT 'Wichita, KS',
    total_teams INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_tourn_dates CHECK (
        start_date IS NULL OR end_date IS NULL OR end_date >= start_date
    ),
    CONSTRAINT chk_year_range CHECK (
        year BETWEEN 1900 AND (EXTRACT(YEAR FROM CURRENT_DATE)::INT + 1)
    )
);

-- Tournament Teams (junction table)
CREATE TABLE IF NOT EXISTS tournament_teams (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    finish_position INTEGER,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    UNIQUE(tournament_id, team_id)
);

-- Championships table
CREATE TABLE IF NOT EXISTS championships (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    year INTEGER NOT NULL UNIQUE,
    champion_team_id INTEGER REFERENCES teams(id),
    runner_up_team_id INTEGER REFERENCES teams(id),
    championship_score VARCHAR(20),
    mvp_player_id INTEGER REFERENCES players(id),
    leading_pitcher_id INTEGER REFERENCES players(id)
);

-- Player Teams (junction table for player history)
CREATE TABLE IF NOT EXISTS player_teams (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    tournament_id INTEGER REFERENCES tournaments(id),
    year INTEGER,
    position VARCHAR(50),
    stats JSONB -- Store batting/pitching stats as JSON
);

-- Awards table
CREATE TABLE IF NOT EXISTS awards (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    year INTEGER,
    player_id INTEGER REFERENCES players(id),
    team_id INTEGER REFERENCES teams(id),
    description TEXT
);

-- Records table
CREATE TABLE IF NOT EXISTS records (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    value VARCHAR(100),
    player_id INTEGER REFERENCES players(id),
    team_id INTEGER REFERENCES teams(id),
    year INTEGER,
    description TEXT,
    is_current BOOLEAN DEFAULT TRUE
);

-- Hall of Fame table
CREATE TABLE IF NOT EXISTS hall_of_fame (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    inductee_name VARCHAR(100) NOT NULL,
    induction_year INTEGER NOT NULL,
    player_id INTEGER REFERENCES players(id),
    category VARCHAR(50), -- Player, Coach, Contributor, etc.
    bio TEXT
);

-- MLB Alumni tracking
CREATE TABLE IF NOT EXISTS mlb_alumni (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    player_id INTEGER REFERENCES players(id) UNIQUE,
    mlb_teams TEXT[], -- Array of MLB teams
    nbc_teams TEXT[], -- Array of NBC teams played for
    nbc_years INTEGER[], -- Years played in NBC
    active BOOLEAN DEFAULT FALSE
);

-- Existing indexes (kept)
CREATE INDEX IF NOT EXISTS idx_tournaments_year ON tournaments(year);
CREATE INDEX IF NOT EXISTS idx_championships_year ON championships(year);
CREATE INDEX IF NOT EXISTS idx_player_teams_player ON player_teams(player_id);
CREATE INDEX IF NOT EXISTS idx_player_teams_team ON player_teams(team_id);
CREATE INDEX IF NOT EXISTS idx_awards_player ON awards(player_id);
CREATE INDEX IF NOT EXISTS idx_awards_year ON awards(year);

-- Additional FK/lookup indexes for performance (new)
CREATE INDEX IF NOT EXISTS idx_tt_tournament ON tournament_teams(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tt_team ON tournament_teams(team_id);

CREATE INDEX IF NOT EXISTS idx_champs_champion ON championships(champion_team_id);
CREATE INDEX IF NOT EXISTS idx_champs_runnerup ON championships(runner_up_team_id);
CREATE INDEX IF NOT EXISTS idx_champs_mvp ON championships(mvp_player_id);
CREATE INDEX IF NOT EXISTS idx_champs_pitcher ON championships(leading_pitcher_id);

CREATE INDEX IF NOT EXISTS idx_pt_tournament ON player_teams(tournament_id);

CREATE INDEX IF NOT EXISTS idx_records_team ON records(team_id);
CREATE INDEX IF NOT EXISTS idx_records_player ON records(player_id);

-- Update trigger for updated_at on teams (kept)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_teams_updated_at ON teams;
CREATE TRIGGER update_teams_updated_at
BEFORE UPDATE ON teams
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
