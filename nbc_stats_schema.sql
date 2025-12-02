--
-- PostgreSQL database dump
--

\restrict KD3vRGCl0bz458E0C8wpgMW8RXQJa6a8NhkPIl9RQs1kGjQtgGeRhaPUR2jnpgS

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: batting_stats; Type: TABLE; Schema: public; Owner: -
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
    cs integer,
    jersey_num character varying(3),
    avg numeric(4,3),
    sb_att integer,
    fld numeric(4,3),
    "position" character varying(10),
    po integer,
    a integer,
    e integer
);


--
-- Name: batting_stats_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.batting_stats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: batting_stats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.batting_stats_id_seq OWNED BY public.batting_stats.id;


--
-- Name: pitching_stats; Type: TABLE; Schema: public; Owner: -
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
    year integer,
    jersey_num character varying(3),
    doubles integer,
    triples integer,
    ab integer,
    b_avg numeric(4,3)
);


--
-- Name: pitching_stats_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pitching_stats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pitching_stats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pitching_stats_id_seq OWNED BY public.pitching_stats.id;


--
-- Name: batting_stats id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.batting_stats ALTER COLUMN id SET DEFAULT nextval('public.batting_stats_id_seq'::regclass);


--
-- Name: pitching_stats id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pitching_stats ALTER COLUMN id SET DEFAULT nextval('public.pitching_stats_id_seq'::regclass);


--
-- Name: batting_stats batting_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.batting_stats
    ADD CONSTRAINT batting_stats_pkey PRIMARY KEY (id);


--
-- Name: batting_stats batting_stats_player_id_season_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.batting_stats
    ADD CONSTRAINT batting_stats_player_id_season_key_key UNIQUE (player_id, season_key);


--
-- Name: pitching_stats pitching_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pitching_stats
    ADD CONSTRAINT pitching_stats_pkey PRIMARY KEY (id);


--
-- Name: pitching_stats pitching_stats_player_id_season_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pitching_stats
    ADD CONSTRAINT pitching_stats_player_id_season_key_key UNIQUE (player_id, season_key);


--
-- Name: batting_stats_player_team_year_uq; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX batting_stats_player_team_year_uq ON public.batting_stats USING btree (player_id, team_id, year);


--
-- Name: pitching_stats_player_team_year_uq; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX pitching_stats_player_team_year_uq ON public.pitching_stats USING btree (player_id, team_id, year);


--
-- Name: batting_stats batting_stats_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.batting_stats
    ADD CONSTRAINT batting_stats_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- Name: batting_stats batting_stats_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.batting_stats
    ADD CONSTRAINT batting_stats_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
-- Name: pitching_stats pitching_stats_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pitching_stats
    ADD CONSTRAINT pitching_stats_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- Name: pitching_stats pitching_stats_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pitching_stats
    ADD CONSTRAINT pitching_stats_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict KD3vRGCl0bz458E0C8wpgMW8RXQJa6a8NhkPIl9RQs1kGjQtgGeRhaPUR2jnpgS

