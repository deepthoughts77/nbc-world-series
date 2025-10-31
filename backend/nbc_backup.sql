--
-- PostgreSQL database dump
--

\restrict Ve8Yk2gw4uo02UZxgqjtC7XLsyjFefbN3Oal3iGdm2hHrm7sd9nNhbzOPiqbB1U

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
-- Data for Name: alltime_records; Type: TABLE DATA; Schema: public; Owner: nbc_admin
--

COPY public.alltime_records (id, era, category, subcategory, record_type, team_name, player_name, year, value_numeric, value_text, description, created_at) FROM stdin;
1	modern_wood	team_batting	highest_batting_average	single_tournament	San Diego CA Stars	\N	2010	0.379	.379	6 games played	2025-10-10 15:24:59.138878
2	modern_wood	team_batting	most_runs_scored	single_tournament	Liberal KS	\N	2015	89.000	89	11 games played	2025-10-10 15:24:59.138878
3	modern_wood	team_batting	most_hits	single_tournament	Liberal KS	\N	2015	122.000	122	11 games played	2025-10-10 15:24:59.138878
4	modern_wood	team_batting	most_home_runs	single_tournament	Santa Barbara CA Foresters	\N	2010	11.000	11	7 games played	2025-10-10 15:24:59.138878
5	modern_wood	individual_batting	highest_batting_average	single_tournament	Great Bend KS Bat Cats	Grant Nottlemann	2023	0.750	.750	5 GP, 12 H, 16 AB	2025-10-10 15:24:59.138878
6	modern_wood	individual_batting	most_hits	single_tournament	Liberal KS	Gavin Wehby	2015	19.000	19	11 games played	2025-10-10 15:24:59.138878
7	modern_wood	individual_batting	most_rbis	single_tournament	Anchorage AK Glacier Pilots	Gunnar Glad	2009	17.000	17	9 games played	2025-10-10 15:24:59.138878
8	modern_wood	individual_batting	most_home_runs	single_tournament	Hays KS Larks	Nolan Reimold	2004	4.000	4	Tournament record	2025-10-10 15:24:59.138878
9	modern_wood	individual_pitching	most_strikeouts	single_tournament	Aloha OR Knights	Tommy Hanson	2005	27.000	27	Tournament record	2025-10-10 15:24:59.138878
10	modern_wood	team_pitching	lowest_era	single_tournament	San Diego CA Force	\N	2012	0.960	0.96	4 games played	2025-10-10 15:24:59.138878
\.


--
-- Data for Name: awards; Type: TABLE DATA; Schema: public; Owner: nbc_admin
--

COPY public.awards (id, name, year, player_id, team_id, description) FROM stdin;
\.


--
-- Data for Name: batting_stats; Type: TABLE DATA; Schema: public; Owner: nbc_admin
--

COPY public.batting_stats (id, player_id, season_key, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, team_id, year, cs) FROM stdin;
37	153	2024_3	7	\N	29	11	16	3	0	0	10	\N	0.655	3	\N	3	\N	0.559	\N	\N	4	\N	3	2024	0
38	154	2024_3	7	\N	21	10	11	3	0	0	8	\N	0.667	6	\N	3	\N	0.643	\N	\N	2	\N	3	2024	1
39	155	2024_3	7	\N	24	8	11	1	0	0	5	\N	0.5	4	\N	2	\N	0.517	\N	\N	1	\N	3	2024	0
40	156	2024_3	7	\N	26	6	10	4	0	0	9	\N	0.538	3	\N	4	\N	0.448	\N	\N	0	\N	3	2024	0
41	157	2024_3	7	\N	23	7	8	2	0	0	6	\N	0.435	5	\N	7	\N	0.464	\N	\N	3	\N	3	2024	0
42	158	2024_3	7	\N	23	4	7	1	0	0	7	\N	0.348	2	\N	6	\N	0.36	\N	\N	0	\N	3	2024	0
43	159	2024_3	7	\N	20	5	6	2	0	0	4	\N	0.4	3	\N	4	\N	0.391	\N	\N	0	\N	3	2024	0
\.


--
-- Data for Name: championships; Type: TABLE DATA; Schema: public; Owner: nbc_admin
--

COPY public.championships (id, year, champion_team_id, runner_up_team_id, championship_score, mvp_player_id, leading_pitcher_id) FROM stdin;
22	2025	3	163	21-4	153	\N
21	2024	6	3	9-4	169	160
1	2023	3	2	5-3	154	\N
2	2022	2	165	3-1	170	\N
3	2021	2	6	6-5	171	\N
4	2020	2	165	8-4	172	\N
5	2019	165	186	3-1	173	\N
106	2018	2	232	\N	174	\N
105	2017	231	233	\N	175	\N
104	2016	2	6	\N	176	\N
103	2015	165	4	\N	177	\N
102	2014	2	165	\N	178	\N
25	1937	249	248	\N	\N	\N
26	1938	248	249	\N	\N	\N
27	1939	247	250	\N	\N	\N
28	1940	251	250	\N	\N	\N
29	1941	251	252	\N	\N	\N
30	1942	253	252	\N	\N	\N
31	1943	254	255	\N	\N	\N
32	1944	256	255	\N	\N	\N
33	1945	255	257	\N	\N	\N
34	1946	258	259	\N	\N	\N
35	1947	260	261	\N	\N	\N
36	1948	260	262	\N	\N	\N
37	1949	260	261	\N	\N	\N
38	1950	263	264	\N	\N	\N
39	1951	265	266	\N	\N	\N
40	1952	267	268	\N	\N	\N
41	1953	268	253	\N	\N	\N
42	1954	253	269	\N	\N	\N
43	1955	253	265	\N	\N	\N
44	1956	270	271	\N	\N	\N
45	1957	265	270	\N	\N	\N
46	1958	272	273	\N	\N	\N
47	1959	274	275	\N	\N	\N
48	1960	276	277	\N	\N	\N
49	1961	277	276	\N	\N	\N
50	1962	278	279	\N	\N	\N
51	1963	278	277	\N	\N	\N
52	1964	280	279	\N	\N	\N
53	1965	278	281	\N	\N	\N
54	1966	282	283	\N	\N	\N
55	1967	282	284	\N	\N	\N
56	1968	281	285	\N	\N	\N
57	1969	286	281	\N	\N	\N
58	1970	276	286	\N	\N	\N
59	1971	286	279	\N	\N	\N
60	1972	279	286	\N	\N	\N
61	1973	279	281	\N	\N	\N
62	1974	279	282	\N	\N	\N
63	1975	282	279	\N	\N	\N
64	1976	279	286	\N	\N	\N
65	1977	287	279	\N	\N	\N
66	1978	282	288	\N	\N	\N
67	1979	281	289	\N	\N	\N
68	1980	279	281	\N	\N	\N
69	1981	290	281	\N	\N	\N
70	1982	289	286	\N	\N	\N
71	1983	291	279	\N	\N	\N
72	1984	291	281	\N	\N	\N
73	1985	281	292	\N	\N	\N
74	1986	286	291	\N	\N	\N
75	1987	293	294	\N	\N	\N
76	1988	295	296	\N	\N	\N
77	1989	294	276	\N	\N	\N
78	1990	294	296	\N	\N	\N
79	1991	286	297	\N	\N	\N
80	1992	296	281	\N	\N	\N
81	1993	297	298	\N	\N	\N
82	1994	297	294	\N	\N	\N
83	1995	299	300	\N	\N	\N
84	1996	301	302	\N	\N	\N
85	1997	293	303	\N	\N	\N
86	1998	301	303	\N	\N	\N
87	1999	304	297	\N	\N	\N
88	2000	281	300	\N	\N	\N
89	2001	286	300	\N	\N	\N
90	2002	279	286	\N	\N	\N
91	2003	228	305	\N	\N	\N
92	2004	306	293	\N	\N	\N
93	2005	307	305	\N	\N	\N
94	2006	305	308	\N	\N	\N
95	2007	309	300	\N	\N	\N
96	2008	305	310	\N	\N	\N
97	2009	301	286	\N	\N	\N
98	2010	281	310	2-1	182	\N
99	2011	305	297	4-2	256	\N
100	2012	305	310	6-2	180	\N
101	2013	305	310	6-2	180	\N
23	1935	246	247	\N	\N	\N
24	1936	247	248	\N	\N	\N
\.


--
-- Data for Name: hall_of_fame; Type: TABLE DATA; Schema: public; Owner: nbc_admin
--

COPY public.hall_of_fame (id, inductee_name, induction_year, player_id, category, bio, name) FROM stdin;
1	Kevin Hooper	2024	\N	Player	\N	Kevin Hooper
2	Mike Blue	2024	\N	Player	\N	Mike Blue
3	Bruce Konopka	2024	\N	Player	\N	Bruce Konopka
\.


--
-- Data for Name: mlb_alumni; Type: TABLE DATA; Schema: public; Owner: nbc_admin
--

COPY public.mlb_alumni (id, player_id, mlb_teams, nbc_teams, nbc_years, active) FROM stdin;
\.


--
-- Data for Name: pitching_stats; Type: TABLE DATA; Schema: public; Owner: nbc_admin
--

COPY public.pitching_stats (id, player_id, season_key, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, team_id, year) FROM stdin;
26	160	2024_3	0.71	2	0	3	2	\N	\N	\N	0	12.2	8	2	1	1	16	\N	\N	\N	\N	\N	\N	\N	\N	3	2024
27	161	2024_3	1	1	0	3	2	\N	\N	\N	0	10	7	3	1	4	11	\N	\N	\N	\N	\N	\N	\N	\N	3	2024
28	162	2024_3	3	1	1	3	1	\N	\N	\N	0	9	8	4	3	2	10	\N	\N	\N	\N	\N	\N	\N	\N	3	2024
29	163	2024_3	0	0	0	2	0	\N	\N	\N	1	5.1	3	1	0	2	7	\N	\N	\N	\N	\N	\N	\N	\N	3	2024
30	164	2024_3	2.57	1	0	3	0	\N	\N	\N	0	7	5	2	2	3	8	\N	\N	\N	\N	\N	\N	\N	\N	3	2024
\.


--
-- Data for Name: player_career_stats; Type: TABLE DATA; Schema: public; Owner: nbc_admin
--

COPY public.player_career_stats (id, player_id, tournaments_played, total_games, batting_avg, total_hits, total_runs, total_rbis, total_home_runs, total_stolen_bases, pitching_wins, pitching_losses, pitching_era, pitching_strikeouts, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: player_teams; Type: TABLE DATA; Schema: public; Owner: nbc_admin
--

COPY public.player_teams (id, player_id, team_id, tournament_id, year, "position", stats) FROM stdin;
1	1	3	5	2023	INF	{"AVG": ".315", "RBI": 12}
3	1	3	5	2023	INF	{"AVG": ".315", "RBI": 12}
150	153	3	14	2024	OF	\N
151	154	3	14	2024	2B	\N
152	155	3	14	2024	SS	\N
153	156	3	14	2024	3B	\N
154	157	3	14	2024	OF	\N
155	158	3	14	2024	1B	\N
156	159	3	14	2024	C	\N
157	160	3	14	2024	P	\N
158	161	3	14	2024	P	\N
159	162	3	14	2024	P	\N
160	163	3	14	2024	P	\N
161	164	3	14	2024	P	\N
\.


--
-- Data for Name: players; Type: TABLE DATA; Schema: public; Owner: nbc_admin
--

COPY public.players (id, first_name, last_name, is_hall_of_fame, mlb_team, created_at, team_id, "position") FROM stdin;
1	Kevin	Hooper	t	Detroit Tigers	2025-09-06 23:21:04.350124	\N	\N
2	Mike	Blue	t	\N	2025-09-06 23:21:04.352016	\N	\N
3	Bruce	Konopka	t	\N	2025-09-06 23:21:04.352531	\N	\N
153	Jake	Gutierrez	f	\N	2025-10-08 15:19:28.541329	\N	\N
154	Max	Buettenback	f	\N	2025-10-08 15:19:28.541329	\N	\N
155	Drew	Bugner	f	\N	2025-10-08 15:19:28.541329	\N	\N
156	Blake	Bradford	f	\N	2025-10-08 15:19:28.541329	\N	\N
157	Dylan	Bell	f	\N	2025-10-08 15:19:28.541329	\N	\N
158	Jaden	Gustafson	f	\N	2025-10-08 15:19:28.541329	\N	\N
159	Ethan	Lively	f	\N	2025-10-08 15:19:28.541329	\N	\N
160	Bradyn	McClure	f	\N	2025-10-08 15:19:28.541329	\N	\N
161	Ethan	Giesbrecht	f	\N	2025-10-08 15:19:28.541329	\N	\N
162	Kaedyn	Trevino	f	\N	2025-10-08 15:19:28.541329	\N	\N
163	Jack	Stetler	f	\N	2025-10-08 15:19:28.541329	\N	\N
164	Tyler	Satter	f	\N	2025-10-08 15:19:28.541329	\N	\N
165	Matthew	Pinal	f	\N	2025-10-10 15:21:31.398114	166	OF
166	Lane	Haworth	f	\N	2025-10-10 15:21:31.398114	186	IF
167	Andre	Jackson	f	\N	2025-10-10 15:21:31.398114	163	OF
168	Bailey	Viscardi	f	\N	2025-10-10 15:21:31.398114	169	P
169	Garrett	Gruell	f	\N	2025-10-13 12:39:16.927859	\N	\N
170	Gavin	Kash	f	\N	2025-10-13 12:39:16.927859	\N	\N
171	Justin	Eckhardt	f	\N	2025-10-13 12:39:16.927859	\N	\N
172	Sean	Johnson	f	\N	2025-10-13 12:39:16.927859	\N	\N
173	Henry	Cheney	f	\N	2025-10-13 12:39:16.927859	\N	\N
174	Patrick	Mathis	f	\N	2025-10-13 12:39:16.927859	\N	\N
175	Ryan	Langerhans	f	\N	2025-10-13 12:39:16.927859	\N	\N
176	Jacob	Patterson	f	\N	2025-10-13 12:39:16.927859	\N	\N
177	Connor	Savage	f	\N	2025-10-13 12:39:16.927859	\N	\N
178	Jon	Duplantier	f	\N	2025-10-13 12:39:16.927859	\N	\N
179	David	Benson	f	\N	2025-10-13 12:39:16.927859	\N	\N
180	Zach	Fish	f	\N	2025-10-13 12:39:16.927859	\N	\N
181	Mitch	Mormann	f	\N	2025-10-13 12:39:16.927859	\N	\N
182	Paul	Gonzalez	f	\N	2025-10-13 12:39:16.927859	\N	\N
183	Jake	Sabol	f	\N	2025-10-13 12:39:16.927859	\N	\N
184	Kevin	Keyes	f	\N	2025-10-13 12:39:16.927859	\N	\N
185	Brad	Arnett	f	\N	2025-10-13 12:39:16.927859	\N	\N
186	Jon	Qualls	f	\N	2025-10-13 12:39:16.927859	\N	\N
187	Matt	Whitaker	f	\N	2025-10-13 12:39:16.927859	\N	\N
188	Ryan	Anetsberger	f	\N	2025-10-13 12:39:16.927859	\N	\N
189	Chang-Wei	Tu	f	\N	2025-10-13 12:39:16.927859	\N	\N
190	Blake	Gill	f	\N	2025-10-13 12:39:16.927859	\N	\N
191	Jeff	Francis	f	\N	2025-10-13 12:39:16.927859	\N	\N
192	Cory	Metzler	f	\N	2025-10-13 12:39:16.927859	\N	\N
193	Marco	Cunningham	f	\N	2025-10-13 12:39:16.927859	\N	\N
194	Jason	Aspito	f	\N	2025-10-13 12:39:16.927859	\N	\N
195	Jeff	Juarez	f	\N	2025-10-13 12:39:16.927859	\N	\N
196	Kevin	Frederick	f	\N	2025-10-13 12:39:16.927859	\N	\N
197	Lance	Berkman	f	\N	2025-10-13 12:39:16.927859	\N	\N
198	Jesse	Zepeda	f	\N	2025-10-13 12:39:16.927859	\N	\N
199	Jeff	Poor	f	\N	2025-10-13 12:39:16.927859	\N	\N
200	Mike	Kane	f	\N	2025-10-13 12:39:16.927859	\N	\N
201	Chris	Hmielewski	f	\N	2025-10-13 12:39:16.927859	\N	\N
202	Jim	Huslig	f	\N	2025-10-13 12:39:16.927859	\N	\N
203	Dave	Wong	f	\N	2025-10-13 12:39:16.927859	\N	\N
204	Ken	Kremer	f	\N	2025-10-13 12:39:16.927859	\N	\N
205	Steve	Bales	f	\N	2025-10-13 12:39:16.927859	\N	\N
206	Kerry	Richardson	f	\N	2025-10-13 12:39:16.927859	\N	\N
207	Bill	Bates	f	\N	2025-10-13 12:39:16.927859	\N	\N
208	Curtis	Morgan	f	\N	2025-10-13 12:39:16.927859	\N	\N
209	Dave	Hengle	f	\N	2025-10-13 12:39:16.927859	\N	\N
210	Keith	Mucha	f	\N	2025-10-13 12:39:16.927859	\N	\N
211	Kevin	McReynolds	f	\N	2025-10-13 12:39:16.927859	\N	\N
212	Gary	D'Onofrio	f	\N	2025-10-13 12:39:16.927859	\N	\N
213	Bob	Ferris	f	\N	2025-10-13 12:39:16.927859	\N	\N
214	Bob	Skube	f	\N	2025-10-13 12:39:16.927859	\N	\N
215	Greg	Harris	f	\N	2025-10-13 12:39:16.927859	\N	\N
216	Mike	Colbern	f	\N	2025-10-13 12:39:16.927859	\N	\N
217	Steve	Kemp	f	\N	2025-10-13 12:39:16.927859	\N	\N
218	Lee	Iorg	f	\N	2025-10-13 12:39:16.927859	\N	\N
219	Kerry	Dineen	f	\N	2025-10-13 12:39:16.927859	\N	\N
220	Bruce	Bochte	f	\N	2025-10-13 12:39:16.927859	\N	\N
221	Al	Gerhardt	f	\N	2025-10-13 12:39:16.927859	\N	\N
222	Chris	Chambliss	f	\N	2025-10-13 12:39:16.927859	\N	\N
223	Joe	Tanner	f	\N	2025-10-13 12:39:16.927859	\N	\N
224	Frank	Duffy	f	\N	2025-10-13 12:39:16.927859	\N	\N
225	Ray	Henningsen	f	\N	2025-10-13 12:39:16.927859	\N	\N
226	Bob	Boyd	f	\N	2025-10-13 12:39:16.927859	\N	\N
227	Dick	Sanders	f	\N	2025-10-13 12:39:16.927859	\N	\N
228	Sam	Suplizio	f	\N	2025-10-13 12:39:16.927859	\N	\N
229	Rocky	Krsnich	f	\N	2025-10-13 12:39:16.927859	\N	\N
230	Al	Ware	f	\N	2025-10-13 12:39:16.927859	\N	\N
231	Bob	Seltzer	f	\N	2025-10-13 12:39:16.927859	\N	\N
232	Clyde	Girrens	f	\N	2025-10-13 12:39:16.927859	\N	\N
233	Jim	O'Rourke	f	\N	2025-10-13 12:39:16.927859	\N	\N
234	Wilmer	Fields	f	\N	2025-10-13 12:39:16.927859	\N	\N
235	Clyde	McCullough	f	\N	2025-10-13 12:39:16.927859	\N	\N
236	Daryl	Spencer	f	\N	2025-10-13 12:39:16.927859	\N	\N
237	Donnie	Lee	f	\N	2025-10-13 12:39:16.927859	\N	\N
238	Robert	McKee	f	\N	2025-10-13 12:39:16.927859	\N	\N
239	Danny	O'Connell	f	\N	2025-10-13 12:39:16.927859	\N	\N
240	Steve	Rapech	f	\N	2025-10-13 12:39:16.927859	\N	\N
241	Pat	Scantlebury	f	\N	2025-10-13 12:39:16.927859	\N	\N
242	Bill	Ricks	f	\N	2025-10-13 12:39:16.927859	\N	\N
243	Veo	Story	f	\N	2025-10-13 12:39:16.927859	\N	\N
244	Bruno	Konopka	f	\N	2025-10-13 12:39:16.927859	\N	\N
245	Les	Lollis	f	\N	2025-10-13 12:39:16.927859	\N	\N
246	Cot	Deal	f	\N	2025-10-13 12:39:16.927859	\N	\N
247	George	Archie	f	\N	2025-10-13 12:39:16.927859	\N	\N
248	Ed	Borom	f	\N	2025-10-13 12:39:16.927859	\N	\N
249	Red	Barkley	f	\N	2025-10-13 12:39:16.927859	\N	\N
250	Vance	Cauble	f	\N	2025-10-13 12:39:16.927859	\N	\N
251	Roy	Helser	f	\N	2025-10-13 12:39:16.927859	\N	\N
252	Andy	Johnson	f	\N	2025-10-13 12:39:16.927859	\N	\N
253	Claude	Gilchrist	f	\N	2025-10-13 12:39:16.927859	\N	\N
254	Harry	White	f	\N	2025-10-13 12:39:16.927859	\N	\N
255	Satchel	Paige	f	\N	2025-10-13 12:39:16.927859	\N	\N
256	Mitch	Morman	f	\N	2025-10-15 13:39:19.414871	\N	\N
\.


--
-- Data for Name: records; Type: TABLE DATA; Schema: public; Owner: nbc_admin
--

COPY public.records (id, category, subcategory, value, player_id, team_id, year, description, is_current) FROM stdin;
\.


--
-- Data for Name: single_game_records; Type: TABLE DATA; Schema: public; Owner: nbc_admin
--

COPY public.single_game_records (id, year, date, category, stat_name, team_name, player_name, opponent, value_numeric, value_text, description, created_at) FROM stdin;
\.


--
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: nbc_admin
--

COPY public.teams (id, name, city, state, league, created_at, updated_at) FROM stdin;
198	Ft. Riley CRTC	Ft. Riley	KS	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
4	Liberal Bee Jays	Liberal	KS	Rocky Mountain Collegiate League	2025-09-05 16:17:17.884329	2025-09-05 16:17:17.884329
5	Seattle Cheney Studs	Seattle	WA	Pacific International League	2025-09-05 16:17:17.885208	2025-09-05 16:17:17.885208
199	Enid AFB Enidairs	Enid	OK	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
200	Carmichael Firemen	Carmichael	CA	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
201	Golden Coors	Golden	CO	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
202	Chatham Blanketeers	Chatham	NC	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
203	Ft. Wayne G-E Club	Ft. Wayne	IN	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
3	Hutchinson Monarchs	Hutchinson	KS	Jayhawk Collegiate League	2025-09-05 16:17:17.883308	2025-10-08 15:19:28.541329
163	Lonestar Kraken TX	Texas	TX	Texas Collegiate League	2025-10-08 15:19:28.541329	2025-10-08 15:19:28.541329
6	Hays Larks	Hays	KS	Rocky Mountain Collegiate League	2025-09-05 16:17:17.886032	2025-10-08 15:19:28.541329
165	Seattle Studs	Seattle	WA	Pacific International League	2025-10-08 15:19:28.541329	2025-10-08 15:19:28.541329
166	Alaska Goldpanners	Fairbanks	AK	Alaska Baseball League	2025-10-08 15:19:28.541329	2025-10-08 15:19:28.541329
2	Santa Barbara Foresters	Santa Barbara	CA	California Collegiate League	2025-09-05 16:17:17.877807	2025-10-08 15:19:28.541329
168	Derby Twins	Derby	KS	Kansas Collegiate League	2025-10-08 15:19:28.541329	2025-10-08 15:19:28.541329
169	San Diego Stars	San Diego	CA	Western Baseball Association	2025-10-08 15:19:28.541329	2025-10-08 15:19:28.541329
170	Waynesboro Generals	Waynesboro	VA	Valley Baseball League	2025-10-08 15:19:28.541329	2025-10-08 15:19:28.541329
171	Holyoke Blue Sox	Holyoke	MA	New England Collegiate League	2025-10-08 15:19:28.541329	2025-10-08 15:19:28.541329
172	Milwaukee Brewers Scout Team	Milwaukee	WI	MLB Scout Team	2025-10-08 15:19:28.541329	2025-10-08 15:19:28.541329
173	Boston Blue Sox	Boston	MA	New England Collegiate League	2025-10-08 15:19:28.541329	2025-10-08 15:19:28.541329
174	El Dorado Broncos	El Dorado	KS	Kansas Collegiate League	2025-10-08 15:19:28.541329	2025-10-08 15:19:28.541329
175	Clarinda A's	Clarinda	IA	MINK League	2025-10-08 15:19:28.541329	2025-10-08 15:19:28.541329
176	Wichita Sluggers	Wichita	KS	Kansas Collegiate League	2025-10-08 15:19:28.541329	2025-10-08 15:19:28.541329
177	Boulder Collegians	Boulder	CO	Rocky Mountain Collegiate League	2025-10-08 15:19:28.541329	2025-10-08 15:19:28.541329
184	Dallas Lonestar Kraken	Dallas	TX	NBC	2025-10-10 15:21:31.398114	2025-10-10 15:21:31.398114
185	BTL Hornets	Wichita	KS	NBC	2025-10-10 15:21:31.398114	2025-10-10 15:21:31.398114
186	Kansas Cannons	Wichita	KS	NBC	2025-10-10 15:21:31.398114	2025-10-10 15:21:31.398114
187	Top Prospect Academy TX	Grapevine	TX	NBC	2025-10-10 15:21:31.398114	2025-10-10 15:21:31.398114
188	GPS TX Legends	Dallas	TX	NBC	2025-10-10 15:21:31.398114	2025-10-10 15:21:31.398114
189	MVP Oklahoma	Oklahoma City	OK	NBC	2025-10-10 15:21:31.398114	2025-10-10 15:21:31.398114
190	Duncan Cementers	Duncan	OK	NBC	2025-10-13 12:21:05.352451	2025-10-13 12:21:05.352451
191	Buford Bona Allens	Buford	GA	NBC	2025-10-13 12:21:05.352451	2025-10-13 12:21:05.352451
192	Enid Champlin Refiners	Enid	OK	NBC	2025-10-13 12:21:05.352451	2025-10-13 12:21:05.352451
193	Bismarck Corwin-Churchills	Bismarck	ND	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
194	Enid Eason Oilers	Enid	OK	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
195	Silverton Red Sox	Silverton	OR	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
196	Enid Champlins	Enid	OK	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
197	Wichita Boeing Bombers	Wichita	KS	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
204	Ft. Wayne Capeharts	Ft. Wayne	IN	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
205	Sinton Plymouth Oilers	Sinton	TX	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
206	Ft. Meyer Colonials	Ft. Meyer	VA	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
207	Ft. Leonard Wood Hilltoppers	Ft. Leonard Wood	MO	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
208	Casa Grande Cotton Kings	Casa Grande	AZ	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
209	Alpine Cowboys	Alpine	TX	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
210	Ft. Wayne Dairymen	Ft. Wayne	IN	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
211	Drain Black Sox	Drain	OR	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
212	Wichita Weller	Wichita	KS	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
213	Tampa Gibsonton	Tampa	FL	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
214	Grand Rapids Sullivans	Grand Rapids	MI	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
215	Wichita Rapid Transit	Wichita	KS	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
216	Fairbanks Goldpanners	Fairbanks	AK	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
217	Wichita Service Auto Glass	Wichita	KS	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
218	Rapid Transit Dreamliners	Wichita	KS	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
219	Jackson Braves	Jackson	MS	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
220	Anchorage Glacier Pilots	Anchorage	AK	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
221	Kenai Peninsula Oilers	Kenai	AK	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
222	Santa Maria Indians	Santa Maria	CA	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
223	Mat-Su Miners	Wasilla	AK	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
224	Everett Merchants	Everett	WA	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
225	Midlothian White Sox	Midlothian	IL	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
226	Nevada Griffons	Nevada	MO	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
227	Dallas Phillies	Dallas	TX	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
228	Chinese Taipei	Taipei	TW	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
229	Aloha Knights	Aloha	OR	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
230	Havasu Heat	Lake Havasu City	AZ	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
231	Kansas Stars	Wichita	KS	NBC	2025-10-13 12:29:59.421929	2025-10-13 12:29:59.421929
232	Dodge City A's	Dodge City	KS	NBC	2025-10-13 12:43:33.730301	2025-10-13 12:43:33.730301
233	Valley Center Diamond Dawgs	Valley Center	KS	NBC	2025-10-13 12:43:33.730301	2025-10-13 12:43:33.730301
234	San Diego Force	San Diego	CA	NBC	2025-10-13 12:43:33.730301	2025-10-13 12:43:33.730301
235	Beatrice Bruins	Beatrice	NE	NBC	2025-10-13 12:43:33.730301	2025-10-13 12:43:33.730301
236	Prairie Gravel	Prairie	IL	NBC	2025-10-13 12:43:33.730301	2025-10-13 12:43:33.730301
237	San Diego Waves	San Diego	CA	NBC	2025-10-13 12:43:33.730301	2025-10-13 12:43:33.730301
238	USA National Team	Various	USA	NBC	2025-10-13 12:43:33.730301	2025-10-13 12:43:33.730301
239	Elkhart Dusters	Elkhart	KS	NBC	2025-10-13 12:43:33.730301	2025-10-13 12:43:33.730301
240	Dallas Mustangs	Dallas	TX	NBC	2025-10-13 12:43:33.730301	2025-10-13 12:43:33.730301
241	Wichita Broncos	Wichita	KS	NBC	2025-10-13 12:43:33.730301	2025-10-13 12:43:33.730301
242	Hutchinson Broncs	Hutchinson	KS	NBC	2025-10-13 12:43:33.730301	2025-10-13 12:43:33.730301
243	Rapid City Post 22	Rapid City	SD	NBC	2025-10-13 12:43:33.730301	2025-10-13 12:43:33.730301
244	Tallahassee Tigers	Tallahassee	FL	NBC	2025-10-13 12:43:33.730301	2025-10-13 12:43:33.730301
245	Eureka Crabs	Eureka	CA	NBC	2025-10-13 12:43:33.730301	2025-10-13 12:43:33.730301
246	Bismarck ND Corwin-Churchills	Bismarck	ND	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
247	Duncan OK Halliburtons	Duncan	OK	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
248	Buford GA Bona Allens	Buford	GA	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
249	Enid OK Eason Oilers	Enid	OK	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
250	Mt. Pleasant TX Cubs	Mt. Pleasant	TX	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
251	Enid OK Champlins	Enid	OK	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
252	Waco TX Dons	Waco	TX	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
253	Wichita KS Boeing Bombers	Wichita	KS	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
254	Camp Wheeler GA Spokes	Camp Wheeler	GA	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
255	Enid OK Army Air Field	Enid	OK	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
256	Sherman Field KS Flyers	Sherman Field	KS	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
257	Orlando FL Army Air Base	Orlando	FL	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
258	St. Joseph MI Auscos	St. Joseph	MI	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
259	Carmichael CA Firemen	Carmichael	CA	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
260	Ft. Wayne IN G-E Club	Ft. Wayne	IN	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
261	Golden CO Coors	Golden	CO	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
262	Elkin NC Chatham Blanketeers	Elkin	NC	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
263	Ft. Wayne IN G-E Capehearts	Ft. Wayne	IN	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
264	Elk City OK Elks	Elk City	OK	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
265	Sinton TX Plymouth Oilers	Sinton	TX	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
266	Atwater CA Packers	Atwater	CA	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
267	Ft. Myer VA Military Dist. of WA	Ft. Myer	VA	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
268	Ft. Leonard Wood MO Hilltoppers	Ft. Leonard Wood	MO	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
269	Springfield MO Generals	Springfield	MO	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
270	Ft. Wayne IN Dairymen	Ft. Wayne	IN	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
271	Deming WA Loggers	Deming	WA	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
272	Drain OR Black Sox	Drain	OR	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
273	Alpine TX Cowboys	Alpine	TX	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
274	Houston TX Fed Mart	Houston	TX	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
275	Elgin IL Athletics	Elgin	IL	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
276	Grand Rapids MI Sullivans	Grand Rapids	MI	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
277	Ponchatoula LA Athletics	Ponchatoula	LA	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
278	Wichita KS Dreamliners	Wichita	KS	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
279	Fairbanks AK Goldpanners	Fairbanks	AK	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
280	Wichita KS Glassmen	Wichita	KS	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
281	Liberal KS Bee Jays	Liberal	KS	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
282	Boulder CO Collegians	Boulder	CO	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
283	West Point MS Packers	West Point	MS	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
284	Honolulu HI Islanders	Honolulu	HI	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
285	Jackson MS Braves	Jackson	MS	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
286	Anchorage AK Glacier Pilots	Anchorage	AK	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
287	Kenai AK Oilers	Kenai	AK	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
288	Rapid City SD Macy's Diesels	Rapid City	SD	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
289	Santa Maria CA Indians	Santa Maria	CA	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
290	Clarinda IA A's	Clarinda	IA	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
291	Grand Rapids MI Sullivan-Polynesians	Grand Rapids	MI	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
292	North Pole AK Nicks	North Pole	AK	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
293	Mat-Su AK Miners	Mat-Su	AK	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
294	Wichita KS Broncos	Wichita	KS	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
295	Everett WA Merchants	Everett	WA	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
296	Midlothian IL White Sox	Midlothian	IL	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
297	Kenai AK Peninsula Oilers	Kenai	AK	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
298	Beatrice NE Bruins	Beatrice	NE	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
299	Team USA	\N	\N	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
300	Hays KS Larks	Hays	KS	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
301	El Dorado KS Broncos	El Dorado	KS	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
302	Tacoma WA Timbers	Tacoma	WA	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
303	Nevada MO Griffons	Nevada	MO	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
304	Dallas TX Phillies	Dallas	TX	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
305	Santa Barbara CA Foresters	Santa Barbara	CA	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
306	Aloha OR Knights	Aloha	OR	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
307	Prairie Gravel IL	\N	\N	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
308	Derby KS Twins	Derby	KS	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
309	Havasu AZ Heat	Havasu	AZ	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
310	Seattle WA Studs	Seattle	WA	NBC	2025-10-15 13:39:19.414871	2025-10-15 13:39:19.414871
\.


--
-- Data for Name: tournament_records; Type: TABLE DATA; Schema: public; Owner: nbc_admin
--

COPY public.tournament_records (id, year, category, subcategory, record_type, team_id, player_id, value_numeric, value_text, games_played, description, source, created_at) FROM stdin;
\.


--
-- Data for Name: tournament_teams; Type: TABLE DATA; Schema: public; Owner: nbc_admin
--

COPY public.tournament_teams (id, tournament_id, team_id, finish_position, wins, losses) FROM stdin;
1	1	5	1	5	2
2	1	2	2	4	3
3	2	2	1	5	1
4	2	4	2	4	2
5	3	2	1	6	1
6	3	6	2	5	2
7	4	2	1	6	1
8	4	3	2	5	2
9	5	3	1	6	1
10	5	2	2	5	2
139	14	3	\N	0	0
140	14	163	\N	0	0
141	14	6	\N	0	0
142	14	165	\N	0	0
143	14	166	\N	0	0
144	14	2	\N	0	0
145	14	168	\N	0	0
146	14	169	\N	0	0
147	14	170	\N	0	0
148	14	171	\N	0	0
149	14	172	\N	0	0
150	14	173	\N	0	0
151	14	174	\N	0	0
152	14	175	\N	0	0
153	14	176	\N	0	0
154	14	177	\N	0	0
\.


--
-- Data for Name: tournaments; Type: TABLE DATA; Schema: public; Owner: nbc_admin
--

COPY public.tournaments (id, year, start_date, end_date, location, total_teams, created_at, attendance) FROM stdin;
1	2019	2019-08-01	2019-08-10	Wichita, KS	2	2025-09-05 16:30:41.056523	\N
2	2020	2020-08-01	2020-08-10	Wichita, KS	2	2025-09-05 16:30:41.056523	\N
3	2021	2021-08-01	2021-08-10	Wichita, KS	2	2025-09-05 16:30:41.056523	\N
4	2022	2022-08-01	2022-08-10	Wichita, KS	2	2025-09-05 16:30:41.056523	\N
5	2023	2023-08-01	2023-08-10	Wichita, KS	2	2025-09-05 16:30:41.056523	\N
14	2024	2024-07-25	2024-08-03	Wichita, KS	\N	2025-10-08 15:19:28.541329	\N
\.


--
-- Name: alltime_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nbc_admin
--

SELECT pg_catalog.setval('public.alltime_records_id_seq', 10, true);


--
-- Name: awards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nbc_admin
--

SELECT pg_catalog.setval('public.awards_id_seq', 1, false);


--
-- Name: batting_stats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nbc_admin
--

SELECT pg_catalog.setval('public.batting_stats_id_seq', 43, true);


--
-- Name: championships_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nbc_admin
--

SELECT pg_catalog.setval('public.championships_id_seq', 106, true);


--
-- Name: hall_of_fame_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nbc_admin
--

SELECT pg_catalog.setval('public.hall_of_fame_id_seq', 13, true);


--
-- Name: mlb_alumni_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nbc_admin
--

SELECT pg_catalog.setval('public.mlb_alumni_id_seq', 1, false);


--
-- Name: pitching_stats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nbc_admin
--

SELECT pg_catalog.setval('public.pitching_stats_id_seq', 30, true);


--
-- Name: player_career_stats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nbc_admin
--

SELECT pg_catalog.setval('public.player_career_stats_id_seq', 1, false);


--
-- Name: player_teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nbc_admin
--

SELECT pg_catalog.setval('public.player_teams_id_seq', 161, true);


--
-- Name: players_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nbc_admin
--

SELECT pg_catalog.setval('public.players_id_seq', 256, true);


--
-- Name: records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nbc_admin
--

SELECT pg_catalog.setval('public.records_id_seq', 1, false);


--
-- Name: single_game_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nbc_admin
--

SELECT pg_catalog.setval('public.single_game_records_id_seq', 1, false);


--
-- Name: teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nbc_admin
--

SELECT pg_catalog.setval('public.teams_id_seq', 310, true);


--
-- Name: tournament_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nbc_admin
--

SELECT pg_catalog.setval('public.tournament_records_id_seq', 1, false);


--
-- Name: tournament_teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nbc_admin
--

SELECT pg_catalog.setval('public.tournament_teams_id_seq', 154, true);


--
-- Name: tournaments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nbc_admin
--

SELECT pg_catalog.setval('public.tournaments_id_seq', 14, true);


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

\unrestrict Ve8Yk2gw4uo02UZxgqjtC7XLsyjFefbN3Oal3iGdm2hHrm7sd9nNhbzOPiqbB1U

