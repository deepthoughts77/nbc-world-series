--
-- PostgreSQL database dump
--

\restrict kWdiEkoQG5cWlnDJmHspeHdyu3SkWFjOi0sksRzU1QSOLZ8LSrRzBQfwgqRCwz7

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: nbc_admin
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO nbc_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: nbc_admin
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO nbc_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alltime_records; Type: TABLE; Schema: public; Owner: nbc_admin
--

CREATE TABLE public.alltime_records (
    id integer NOT NULL,
    era character varying(50) NOT NULL,
    category character varying(50) NOT NULL,
    subcategory character varying(100) NOT NULL,
    record_type character varying(50) NOT NULL,
    team_name character varying(100),
    player_name character varying(100),
    year integer,
    value_numeric numeric(10,3),
    value_text character varying(100),
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.alltime_records OWNER TO nbc_admin;

--
-- Name: alltime_records_id_seq; Type: SEQUENCE; Schema: public; Owner: nbc_admin
--

CREATE SEQUENCE public.alltime_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alltime_records_id_seq OWNER TO nbc_admin;

--
-- Name: alltime_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nbc_admin
--

ALTER SEQUENCE public.alltime_records_id_seq OWNED BY public.alltime_records.id;


--
-- Name: awards; Type: TABLE; Schema: public; Owner: nbc_admin
--

CREATE TABLE public.awards (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    year integer,
    player_id integer,
    team_id integer,
    description text
);


ALTER TABLE public.awards OWNER TO nbc_admin;

--
-- Name: awards_id_seq; Type: SEQUENCE; Schema: public; Owner: nbc_admin
--

ALTER TABLE public.awards ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.awards_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: batting_stats; Type: TABLE; Schema: public; Owner: nbc_admin
--

CREATE TABLE public.batting_stats (
    id integer NOT NULL,
    player_id integer NOT NULL,
    season_key text NOT NULL,
    gp integer,
    gs integer,
    ab integer,
    r integer,
    h integer,
    "2b" integer,
    "3b" integer,
    hr integer,
    rbi integer,
    tb integer,
    slg numeric,
    bb integer,
    hbp integer,
    so integer,
    gdp integer,
    obp numeric,
    sf integer,
    sh integer,
    sb integer,
    att integer,
    team_id integer,
    year integer,
    cs integer
);


ALTER TABLE public.batting_stats OWNER TO nbc_admin;

--
-- Name: batting_stats_id_seq; Type: SEQUENCE; Schema: public; Owner: nbc_admin
--

CREATE SEQUENCE public.batting_stats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.batting_stats_id_seq OWNER TO nbc_admin;

--
-- Name: batting_stats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nbc_admin
--

ALTER SEQUENCE public.batting_stats_id_seq OWNED BY public.batting_stats.id;


--
-- Name: championships; Type: TABLE; Schema: public; Owner: nbc_admin
--

CREATE TABLE public.championships (
    id integer NOT NULL,
    year integer NOT NULL,
    champion_team_id integer,
    runner_up_team_id integer,
    championship_score character varying(20),
    mvp_player_id integer,
    leading_pitcher_id integer
);


ALTER TABLE public.championships OWNER TO nbc_admin;

--
-- Name: championships_id_seq; Type: SEQUENCE; Schema: public; Owner: nbc_admin
--

ALTER TABLE public.championships ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.championships_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: hall_of_fame; Type: TABLE; Schema: public; Owner: nbc_admin
--

CREATE TABLE public.hall_of_fame (
    id integer NOT NULL,
    inductee_name character varying(100) NOT NULL,
    induction_year integer NOT NULL,
    player_id integer,
    category character varying(50) DEFAULT ''::character varying NOT NULL,
    bio text,
    name text
);


ALTER TABLE public.hall_of_fame OWNER TO nbc_admin;

--
-- Name: hall_of_fame_id_seq; Type: SEQUENCE; Schema: public; Owner: nbc_admin
--

ALTER TABLE public.hall_of_fame ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.hall_of_fame_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: mlb_alumni; Type: TABLE; Schema: public; Owner: nbc_admin
--

CREATE TABLE public.mlb_alumni (
    id integer NOT NULL,
    player_id integer,
    mlb_teams text[],
    nbc_teams text[],
    nbc_years integer[],
    active boolean DEFAULT false
);


ALTER TABLE public.mlb_alumni OWNER TO nbc_admin;

--
-- Name: mlb_alumni_id_seq; Type: SEQUENCE; Schema: public; Owner: nbc_admin
--

ALTER TABLE public.mlb_alumni ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.mlb_alumni_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: pitching_stats; Type: TABLE; Schema: public; Owner: nbc_admin
--

CREATE TABLE public.pitching_stats (
    id integer NOT NULL,
    player_id integer NOT NULL,
    season_key text NOT NULL,
    era numeric,
    w integer,
    l integer,
    app integer,
    gs integer,
    cg integer,
    sho integer,
    cbo integer,
    sv integer,
    ip numeric,
    h integer,
    r integer,
    er integer,
    bb integer,
    so integer,
    "2b" integer,
    "3b" integer,
    hr integer,
    wp integer,
    hbp integer,
    bk integer,
    sfa integer,
    sha integer,
    team_id integer,
    year integer
);


ALTER TABLE public.pitching_stats OWNER TO nbc_admin;

--
-- Name: pitching_stats_id_seq; Type: SEQUENCE; Schema: public; Owner: nbc_admin
--

CREATE SEQUENCE public.pitching_stats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pitching_stats_id_seq OWNER TO nbc_admin;

--
-- Name: pitching_stats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nbc_admin
--

ALTER SEQUENCE public.pitching_stats_id_seq OWNED BY public.pitching_stats.id;


--
-- Name: player_career_stats; Type: TABLE; Schema: public; Owner: nbc_admin
--

CREATE TABLE public.player_career_stats (
    id integer NOT NULL,
    player_id integer,
    tournaments_played integer DEFAULT 0,
    total_games integer DEFAULT 0,
    batting_avg numeric(4,3),
    total_hits integer,
    total_runs integer,
    total_rbis integer,
    total_home_runs integer,
    total_stolen_bases integer,
    pitching_wins integer,
    pitching_losses integer,
    pitching_era numeric(4,2),
    pitching_strikeouts integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.player_career_stats OWNER TO nbc_admin;

--
-- Name: player_career_stats_id_seq; Type: SEQUENCE; Schema: public; Owner: nbc_admin
--

CREATE SEQUENCE public.player_career_stats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.player_career_stats_id_seq OWNER TO nbc_admin;

--
-- Name: player_career_stats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nbc_admin
--

ALTER SEQUENCE public.player_career_stats_id_seq OWNED BY public.player_career_stats.id;


--
-- Name: player_teams; Type: TABLE; Schema: public; Owner: nbc_admin
--

CREATE TABLE public.player_teams (
    id integer NOT NULL,
    player_id integer,
    team_id integer,
    tournament_id integer,
    year integer,
    "position" character varying(50),
    stats jsonb
);


ALTER TABLE public.player_teams OWNER TO nbc_admin;

--
-- Name: player_teams_id_seq; Type: SEQUENCE; Schema: public; Owner: nbc_admin
--

ALTER TABLE public.player_teams ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.player_teams_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: players; Type: TABLE; Schema: public; Owner: nbc_admin
--

CREATE TABLE public.players (
    id integer NOT NULL,
    first_name character varying(50),
    last_name character varying(50) NOT NULL,
    is_hall_of_fame boolean DEFAULT false,
    mlb_team character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    team_id integer,
    "position" character varying(10)
);


ALTER TABLE public.players OWNER TO nbc_admin;

--
-- Name: players_id_seq; Type: SEQUENCE; Schema: public; Owner: nbc_admin
--

ALTER TABLE public.players ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.players_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: records; Type: TABLE; Schema: public; Owner: nbc_admin
--

CREATE TABLE public.records (
    id integer NOT NULL,
    category character varying(100) NOT NULL,
    subcategory character varying(100),
    value character varying(100),
    player_id integer,
    team_id integer,
    year integer,
    description text,
    is_current boolean DEFAULT true
);


ALTER TABLE public.records OWNER TO nbc_admin;

--
-- Name: records_id_seq; Type: SEQUENCE; Schema: public; Owner: nbc_admin
--

ALTER TABLE public.records ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.records_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: single_game_records; Type: TABLE; Schema: public; Owner: nbc_admin
--

CREATE TABLE public.single_game_records (
    id integer NOT NULL,
    year integer NOT NULL,
    date date,
    category character varying(50) NOT NULL,
    stat_name character varying(100) NOT NULL,
    team_name character varying(100),
    player_name character varying(100),
    opponent character varying(100),
    value_numeric numeric(10,3),
    value_text character varying(100),
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.single_game_records OWNER TO nbc_admin;

--
-- Name: single_game_records_id_seq; Type: SEQUENCE; Schema: public; Owner: nbc_admin
--

CREATE SEQUENCE public.single_game_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.single_game_records_id_seq OWNER TO nbc_admin;

--
-- Name: single_game_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nbc_admin
--

ALTER SEQUENCE public.single_game_records_id_seq OWNED BY public.single_game_records.id;


--
-- Name: teams; Type: TABLE; Schema: public; Owner: nbc_admin
--

CREATE TABLE public.teams (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    city character varying(100),
    state character varying(50),
    league character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.teams OWNER TO nbc_admin;

--
-- Name: teams_id_seq; Type: SEQUENCE; Schema: public; Owner: nbc_admin
--

ALTER TABLE public.teams ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.teams_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tournament_records; Type: TABLE; Schema: public; Owner: nbc_admin
--

CREATE TABLE public.tournament_records (
    id integer NOT NULL,
    year integer NOT NULL,
    category character varying(50) NOT NULL,
    subcategory character varying(100) NOT NULL,
    record_type character varying(50) NOT NULL,
    team_id integer,
    player_id integer,
    value_numeric numeric(10,3),
    value_text character varying(100),
    games_played integer,
    description text,
    source character varying(50) DEFAULT 'official'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tournament_records OWNER TO nbc_admin;

--
-- Name: tournament_records_id_seq; Type: SEQUENCE; Schema: public; Owner: nbc_admin
--

CREATE SEQUENCE public.tournament_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tournament_records_id_seq OWNER TO nbc_admin;

--
-- Name: tournament_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nbc_admin
--

ALTER SEQUENCE public.tournament_records_id_seq OWNED BY public.tournament_records.id;


--
-- Name: tournament_teams; Type: TABLE; Schema: public; Owner: nbc_admin
--

CREATE TABLE public.tournament_teams (
    id integer NOT NULL,
    tournament_id integer,
    team_id integer,
    finish_position integer,
    wins integer DEFAULT 0,
    losses integer DEFAULT 0
);


ALTER TABLE public.tournament_teams OWNER TO nbc_admin;

--
-- Name: tournament_teams_id_seq; Type: SEQUENCE; Schema: public; Owner: nbc_admin
--

ALTER TABLE public.tournament_teams ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tournament_teams_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tournaments; Type: TABLE; Schema: public; Owner: nbc_admin
--

CREATE TABLE public.tournaments (
    id integer NOT NULL,
    year integer NOT NULL,
    start_date date,
    end_date date,
    location character varying(100) DEFAULT 'Wichita, KS'::character varying,
    total_teams integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    attendance integer,
    CONSTRAINT chk_tourn_dates CHECK (((start_date IS NULL) OR (end_date IS NULL) OR (end_date >= start_date))),
    CONSTRAINT chk_year_range CHECK (((year >= 1900) AND (year <= ((EXTRACT(year FROM CURRENT_DATE))::integer + 1))))
);


ALTER TABLE public.tournaments OWNER TO nbc_admin;

--
-- Name: tournaments_id_seq; Type: SEQUENCE; Schema: public; Owner: nbc_admin
--

ALTER TABLE public.tournaments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tournaments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: vw_batting_expanded; Type: VIEW; Schema: public; Owner: nbc_admin
--

CREATE VIEW public.vw_batting_expanded AS
 SELECT bs.player_id,
    bs.team_id,
    t.name AS team,
    bs.year,
    p.first_name,
    p.last_name,
    bs.gp,
    bs.gs,
    bs.ab,
    bs.r,
    bs.h,
    bs."2b" AS doubles,
    bs."3b" AS triples,
    bs.hr,
    bs.rbi,
    bs.bb,
    bs.so,
    bs.sb,
    bs.cs,
    bs.obp,
    bs.slg,
        CASE
            WHEN ((bs.obp IS NOT NULL) AND (bs.slg IS NOT NULL)) THEN (bs.obp + bs.slg)
            ELSE NULL::numeric
        END AS ops
   FROM ((public.batting_stats bs
     JOIN public.players p ON ((p.id = bs.player_id)))
     JOIN public.teams t ON ((t.id = bs.team_id)));


ALTER VIEW public.vw_batting_expanded OWNER TO nbc_admin;

--
-- Name: vw_championships; Type: VIEW; Schema: public; Owner: nbc_admin
--

CREATE VIEW public.vw_championships AS
 SELECT c.year,
    t1.id AS champion_team_id,
    t1.name AS champion,
    t2.id AS runner_up_team_id,
    t2.name AS runner_up,
    c.championship_score,
    c.mvp_player_id,
    (((p1.first_name)::text || ' '::text) || (p1.last_name)::text) AS mvp,
    c.leading_pitcher_id,
    (((p2.first_name)::text || ' '::text) || (p2.last_name)::text) AS leading_pitcher
   FROM ((((public.championships c
     LEFT JOIN public.teams t1 ON ((t1.id = c.champion_team_id)))
     LEFT JOIN public.teams t2 ON ((t2.id = c.runner_up_team_id)))
     LEFT JOIN public.players p1 ON ((p1.id = c.mvp_player_id)))
     LEFT JOIN public.players p2 ON ((p2.id = c.leading_pitcher_id)));


ALTER VIEW public.vw_championships OWNER TO nbc_admin;

--
-- Name: vw_pitching_expanded; Type: VIEW; Schema: public; Owner: nbc_admin
--

CREATE VIEW public.vw_pitching_expanded AS
 SELECT ps.player_id,
    ps.team_id,
    t.name AS team,
    ps.year,
    p.first_name,
    p.last_name,
    ps.w,
    ps.l,
    ps.app AS gp,
    ps.gs,
    ps.sv,
    ps.ip,
    ps.h,
    ps.r,
    ps.er,
    ps.bb,
    ps.so,
    ps.era
   FROM ((public.pitching_stats ps
     JOIN public.players p ON ((p.id = ps.player_id)))
     JOIN public.teams t ON ((t.id = ps.team_id)));


ALTER VIEW public.vw_pitching_expanded OWNER TO nbc_admin;

--
-- Name: alltime_records id; Type: DEFAULT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.alltime_records ALTER COLUMN id SET DEFAULT nextval('public.alltime_records_id_seq'::regclass);


--
-- Name: batting_stats id; Type: DEFAULT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.batting_stats ALTER COLUMN id SET DEFAULT nextval('public.batting_stats_id_seq'::regclass);


--
-- Name: pitching_stats id; Type: DEFAULT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.pitching_stats ALTER COLUMN id SET DEFAULT nextval('public.pitching_stats_id_seq'::regclass);


--
-- Name: player_career_stats id; Type: DEFAULT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.player_career_stats ALTER COLUMN id SET DEFAULT nextval('public.player_career_stats_id_seq'::regclass);


--
-- Name: single_game_records id; Type: DEFAULT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.single_game_records ALTER COLUMN id SET DEFAULT nextval('public.single_game_records_id_seq'::regclass);


--
-- Name: tournament_records id; Type: DEFAULT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.tournament_records ALTER COLUMN id SET DEFAULT nextval('public.tournament_records_id_seq'::regclass);


--
-- Name: alltime_records alltime_records_era_category_subcategory_record_type_key; Type: CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.alltime_records
    ADD CONSTRAINT alltime_records_era_category_subcategory_record_type_key UNIQUE (era, category, subcategory, record_type);


--
-- Name: alltime_records alltime_records_pkey; Type: CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.alltime_records
    ADD CONSTRAINT alltime_records_pkey PRIMARY KEY (id);


--
-- Name: awards awards_pkey; Type: CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.awards
    ADD CONSTRAINT awards_pkey PRIMARY KEY (id);


--
-- Name: batting_stats batting_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.batting_stats
    ADD CONSTRAINT batting_stats_pkey PRIMARY KEY (id);


--
-- Name: batting_stats batting_stats_player_id_season_key_key; Type: CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.batting_stats
    ADD CONSTRAINT batting_stats_player_id_season_key_key UNIQUE (player_id, season_key);


--
-- Name: championships championships_pkey; Type: CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.championships
    ADD CONSTRAINT championships_pkey PRIMARY KEY (id);


--
-- Name: championships championships_year_key; Type: CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.championships
    ADD CONSTRAINT championships_year_key UNIQUE (year);


--
-- Name: championships championships_year_unique; Type: CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.championships
    ADD CONSTRAINT championships_year_unique UNIQUE (year);


--
-- Name: hall_of_fame hall_of_fame_pkey; Type: CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.hall_of_fame
    ADD CONSTRAINT hall_of_fame_pkey PRIMARY KEY (id);


--
-- Name: hall_of_fame hof_unique; Type: CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.hall_of_fame
    ADD CONSTRAINT hof_unique UNIQUE (inductee_name, induction_year, category);


--
-- Name: mlb_alumni mlb_alumni_pkey; Type: CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.mlb_alumni
    ADD CONSTRAINT mlb_alumni_pkey PRIMARY KEY (id);


--
-- Name: mlb_alumni mlb_alumni_player_id_key; Type: CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.mlb_alumni
    ADD CONSTRAINT mlb_alumni_player_id_key UNIQUE (player_id);


--
-- Name: pitching_stats pitching_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.pitching_stats
    ADD CONSTRAINT pitching_stats_pkey PRIMARY KEY (id);


--
-- Name: pitching_stats pitching_stats_player_id_season_key_key; Type: CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.pitching_stats
    ADD CONSTRAINT pitching_stats_player_id_season_key_key UNIQUE (player_id, season_key);


--
-- Name: player_career_stats player_career_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.player_career_stats
    ADD CONSTRAINT player_career_stats_pkey PRIMARY KEY (id);


--
-- Name: player_career_stats player_career_stats_player_id_key; Type: CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.player_career_stats
    ADD CONSTRAINT player_career_stats_player_id_key UNIQUE (player_id);


--
-- Name: player_teams player_teams_pkey; Type: CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.player_teams
    ADD CONSTRAINT player_teams_pkey PRIMARY KEY (id);


--
-- Name: players players_pkey; Type: CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_pkey PRIMARY KEY (id);


--
-- Name: records records_pkey; Type: CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.records
    ADD CONSTRAINT records_pkey PRIMARY KEY (id);


--
-- Name: single_game_records single_game_records_pkey; Type: CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.single_game_records
    ADD CONSTRAINT single_game_records_pkey PRIMARY KEY (id);


--
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- Name: teams teams_unique; Type: CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_unique UNIQUE (name, city, state);


--
-- Name: tournament_records tournament_records_pkey; Type: CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.tournament_records
    ADD CONSTRAINT tournament_records_pkey PRIMARY KEY (id);


--
-- Name: tournament_records tournament_records_year_category_subcategory_record_type_key; Type: CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.tournament_records
    ADD CONSTRAINT tournament_records_year_category_subcategory_record_type_key UNIQUE (year, category, subcategory, record_type);


--
-- Name: tournament_teams tournament_teams_pkey; Type: CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.tournament_teams
    ADD CONSTRAINT tournament_teams_pkey PRIMARY KEY (id);


--
-- Name: tournament_teams tournament_teams_tournament_id_team_id_key; Type: CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.tournament_teams
    ADD CONSTRAINT tournament_teams_tournament_id_team_id_key UNIQUE (tournament_id, team_id);


--
-- Name: tournaments tournaments_pkey; Type: CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.tournaments
    ADD CONSTRAINT tournaments_pkey PRIMARY KEY (id);


--
-- Name: tournaments tournaments_year_key; Type: CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.tournaments
    ADD CONSTRAINT tournaments_year_key UNIQUE (year);


--
-- Name: teams unique_team_triplet; Type: CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT unique_team_triplet UNIQUE (name, city, state);


--
-- Name: batting_stats_player_team_year_uq; Type: INDEX; Schema: public; Owner: nbc_admin
--

CREATE UNIQUE INDEX batting_stats_player_team_year_uq ON public.batting_stats USING btree (player_id, team_id, year);


--
-- Name: hall_of_fame_inductee_year_uq; Type: INDEX; Schema: public; Owner: nbc_admin
--

CREATE UNIQUE INDEX hall_of_fame_inductee_year_uq ON public.hall_of_fame USING btree (inductee_name, induction_year);


--
-- Name: hall_of_fame_name_year_uq; Type: INDEX; Schema: public; Owner: nbc_admin
--

CREATE UNIQUE INDEX hall_of_fame_name_year_uq ON public.hall_of_fame USING btree (name, induction_year);


--
-- Name: idx_awards_player; Type: INDEX; Schema: public; Owner: nbc_admin
--

CREATE INDEX idx_awards_player ON public.awards USING btree (player_id);


--
-- Name: idx_awards_year; Type: INDEX; Schema: public; Owner: nbc_admin
--

CREATE INDEX idx_awards_year ON public.awards USING btree (year);


--
-- Name: idx_championships_year; Type: INDEX; Schema: public; Owner: nbc_admin
--

CREATE INDEX idx_championships_year ON public.championships USING btree (year);


--
-- Name: idx_champs_champion; Type: INDEX; Schema: public; Owner: nbc_admin
--

CREATE INDEX idx_champs_champion ON public.championships USING btree (champion_team_id);


--
-- Name: idx_champs_mvp; Type: INDEX; Schema: public; Owner: nbc_admin
--

CREATE INDEX idx_champs_mvp ON public.championships USING btree (mvp_player_id);


--
-- Name: idx_champs_pitcher; Type: INDEX; Schema: public; Owner: nbc_admin
--

CREATE INDEX idx_champs_pitcher ON public.championships USING btree (leading_pitcher_id);


--
-- Name: idx_champs_runnerup; Type: INDEX; Schema: public; Owner: nbc_admin
--

CREATE INDEX idx_champs_runnerup ON public.championships USING btree (runner_up_team_id);


--
-- Name: idx_player_teams_player; Type: INDEX; Schema: public; Owner: nbc_admin
--

CREATE INDEX idx_player_teams_player ON public.player_teams USING btree (player_id);


--
-- Name: idx_player_teams_team; Type: INDEX; Schema: public; Owner: nbc_admin
--

CREATE INDEX idx_player_teams_team ON public.player_teams USING btree (team_id);


--
-- Name: idx_pt_tournament; Type: INDEX; Schema: public; Owner: nbc_admin
--

CREATE INDEX idx_pt_tournament ON public.player_teams USING btree (tournament_id);


--
-- Name: idx_records_player; Type: INDEX; Schema: public; Owner: nbc_admin
--

CREATE INDEX idx_records_player ON public.records USING btree (player_id);


--
-- Name: idx_records_team; Type: INDEX; Schema: public; Owner: nbc_admin
--

CREATE INDEX idx_records_team ON public.records USING btree (team_id);


--
-- Name: idx_tournaments_year; Type: INDEX; Schema: public; Owner: nbc_admin
--

CREATE INDEX idx_tournaments_year ON public.tournaments USING btree (year);


--
-- Name: idx_tt_team; Type: INDEX; Schema: public; Owner: nbc_admin
--

CREATE INDEX idx_tt_team ON public.tournament_teams USING btree (team_id);


--
-- Name: idx_tt_tournament; Type: INDEX; Schema: public; Owner: nbc_admin
--

CREATE INDEX idx_tt_tournament ON public.tournament_teams USING btree (tournament_id);


--
-- Name: pitching_stats_player_team_year_uq; Type: INDEX; Schema: public; Owner: nbc_admin
--

CREATE UNIQUE INDEX pitching_stats_player_team_year_uq ON public.pitching_stats USING btree (player_id, team_id, year);


--
-- Name: players_first_last_uq; Type: INDEX; Schema: public; Owner: nbc_admin
--

CREATE UNIQUE INDEX players_first_last_uq ON public.players USING btree (first_name, last_name);


--
-- Name: teams_name_uq; Type: INDEX; Schema: public; Owner: nbc_admin
--

CREATE UNIQUE INDEX teams_name_uq ON public.teams USING btree (name);


--
-- Name: teams update_teams_updated_at; Type: TRIGGER; Schema: public; Owner: nbc_admin
--

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: awards awards_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.awards
    ADD CONSTRAINT awards_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id);


--
-- Name: awards awards_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.awards
    ADD CONSTRAINT awards_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id);


--
-- Name: batting_stats batting_stats_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.batting_stats
    ADD CONSTRAINT batting_stats_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- Name: batting_stats batting_stats_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.batting_stats
    ADD CONSTRAINT batting_stats_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
-- Name: championships championships_champion_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.championships
    ADD CONSTRAINT championships_champion_team_id_fkey FOREIGN KEY (champion_team_id) REFERENCES public.teams(id);


--
-- Name: championships championships_leading_pitcher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.championships
    ADD CONSTRAINT championships_leading_pitcher_id_fkey FOREIGN KEY (leading_pitcher_id) REFERENCES public.players(id);


--
-- Name: championships championships_mvp_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.championships
    ADD CONSTRAINT championships_mvp_player_id_fkey FOREIGN KEY (mvp_player_id) REFERENCES public.players(id);


--
-- Name: championships championships_runner_up_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.championships
    ADD CONSTRAINT championships_runner_up_team_id_fkey FOREIGN KEY (runner_up_team_id) REFERENCES public.teams(id);


--
-- Name: hall_of_fame hall_of_fame_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.hall_of_fame
    ADD CONSTRAINT hall_of_fame_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id);


--
-- Name: mlb_alumni mlb_alumni_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.mlb_alumni
    ADD CONSTRAINT mlb_alumni_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id);


--
-- Name: pitching_stats pitching_stats_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.pitching_stats
    ADD CONSTRAINT pitching_stats_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- Name: pitching_stats pitching_stats_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.pitching_stats
    ADD CONSTRAINT pitching_stats_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
-- Name: player_career_stats player_career_stats_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.player_career_stats
    ADD CONSTRAINT player_career_stats_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- Name: player_teams player_teams_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.player_teams
    ADD CONSTRAINT player_teams_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- Name: player_teams player_teams_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.player_teams
    ADD CONSTRAINT player_teams_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
-- Name: player_teams player_teams_tournament_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.player_teams
    ADD CONSTRAINT player_teams_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id);


--
-- Name: players players_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE SET NULL;


--
-- Name: records records_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.records
    ADD CONSTRAINT records_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id);


--
-- Name: records records_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.records
    ADD CONSTRAINT records_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id);


--
-- Name: tournament_records tournament_records_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.tournament_records
    ADD CONSTRAINT tournament_records_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- Name: tournament_records tournament_records_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.tournament_records
    ADD CONSTRAINT tournament_records_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
-- Name: tournament_teams tournament_teams_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.tournament_teams
    ADD CONSTRAINT tournament_teams_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
-- Name: tournament_teams tournament_teams_tournament_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.tournament_teams
    ADD CONSTRAINT tournament_teams_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict kWdiEkoQG5cWlnDJmHspeHdyu3SkWFjOi0sksRzU1QSOLZ8LSrRzBQfwgqRCwz7

