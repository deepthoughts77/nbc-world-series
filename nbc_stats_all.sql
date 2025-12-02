--
-- PostgreSQL database dump
--

\restrict mr0zi0FfWfujYwMQagmeRUFlb6n6F8EednVXOfAlTv40C25bIB12QFH6CJV0FZx

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
    year integer,
    jersey_num character varying(3),
    doubles integer,
    triples integer,
    ab integer,
    b_avg numeric(4,3)
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
-- Name: batting_stats id; Type: DEFAULT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.batting_stats ALTER COLUMN id SET DEFAULT nextval('public.batting_stats_id_seq'::regclass);


--
-- Name: pitching_stats id; Type: DEFAULT; Schema: public; Owner: nbc_admin
--

ALTER TABLE ONLY public.pitching_stats ALTER COLUMN id SET DEFAULT nextval('public.pitching_stats_id_seq'::regclass);


--
-- Data for Name: batting_stats; Type: TABLE DATA; Schema: public; Owner: nbc_admin
--

COPY public.batting_stats (id, player_id, season_key, gp, gs, ab, r, h, "2b", "3b", hr, rbi, tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, team_id, year, cs, jersey_num, avg, sb_att, fld, "position", po, a, e) FROM stdin;
1412	153	2025_hutchinson_monarchs_jake_gutierrez	7	7	29	11	16	3	0	0	10	19	0.655	3	0	3	1	0.559	2	0	1	1	3	2025	\N	27	0.552	\N	0.933	\N	14	0	1
1413	155	2025_hutchinson_monarchs_drew_bugner	7	7	30	10	14	2	0	0	11	16	0.533	3	0	5	4	0.500	1	0	1	1	3	2025	\N	13	0.467	\N	1.000	\N	10	11	0
1414	156	2025_hutchinson_monarchs_blake_bradford	6	6	18	6	7	2	0	0	3	9	0.500	3	5	1	0	0.577	0	0	1	2	3	2025	\N	10	0.389	\N	1.000	\N	4	5	0
1415	158	2025_hutchinson_monarchs_jaden_gustafson	7	7	26	9	10	4	1	0	8	16	0.615	5	0	1	0	0.484	0	0	1	1	3	2025	\N	14	0.385	\N	1.000	\N	10	1	0
1416	157	2025_hutchinson_monarchs_dylan_bell	7	7	19	8	7	2	0	1	5	12	0.632	4	4	5	0	0.556	0	0	1	1	3	2025	\N	18	0.368	\N	0.933	\N	14	0	1
1417	453	2025_hutchinson_monarchs_tyson_vassart	6	6	22	3	6	2	0	0	6	8	0.364	2	2	5	2	0.370	1	0	0	0	3	2025	\N	36	0.273	\N	0.000	\N	0	0	0
1418	388	2025_hutchinson_monarchs_keegan_demmer	5	4	15	3	4	1	0	0	3	5	0.333	5	0	5	1	0.450	0	0	0	0	3	2025	\N	20	0.267	\N	1.000	\N	32	2	0
1419	257	2025_hutchinson_monarchs_aj_mustow	6	5	21	4	4	0	1	0	5	6	0.286	1	1	6	0	0.261	0	0	0	0	3	2025	\N	35	0.190	\N	1.000	\N	22	4	0
1420	360	2025_hutchinson_monarchs_jake_knox	4	3	10	1	4	1	0	0	3	5	0.500	0	1	2	0	0.455	0	0	0	0	3	2025	\N	33	0.400	\N	1.000	\N	27	3	0
1421	344	2025_hutchinson_monarchs_jj_spafford	5	4	13	5	4	0	0	0	1	4	0.308	3	0	3	0	0.438	0	1	2	2	3	2025	\N	2	0.308	\N	0.900	\N	3	6	1
1422	370	2025_hutchinson_monarchs_joey_senstock	5	4	15	3	3	2	0	0	2	5	0.333	2	0	8	0	0.294	0	0	0	0	3	2025	\N	11	0.200	\N	1.000	\N	0	13	0
1423	351	2025_hutchinson_monarchs_jackson_legg	5	3	10	0	0	0	0	0	0	0	0.000	1	1	2	0	0.167	0	0	0	0	3	2025	\N	21	0.000	\N	1.000	\N	22	0	0
1424	363	2025_hutchinson_monarchs_jarrett_herrmann	3	0	3	0	0	0	0	0	0	0	0.000	0	0	2	0	0.000	0	0	0	0	3	2025	\N	3	0.000	\N	0.667	\N	4	0	2
1425	389	2025_lonestar_kraken_tx_kenner_lauterbach	7	6	23	6	9	1	0	0	0	10	0.435	1	0	4	0	0.417	0	0	0	0	163	2025	\N	42	0.391	\N	0.889	\N	6	18	3
1426	382	2025_lonestar_kraken_tx_kado_robardy	7	7	18	8	7	1	0	0	3	8	0.444	9	0	1	0	0.593	0	0	2	3	163	2025	\N	2	0.389	\N	0.900	\N	9	0	1
1427	424	2025_lonestar_kraken_tx_preston_curtis	6	6	24	4	9	3	0	0	10	12	0.500	2	1	3	0	0.429	1	0	3	3	163	2025	\N	13	0.375	\N	1.000	\N	11	0	0
1428	345	2025_lonestar_kraken_tx_jt_simonelli	7	7	27	7	8	2	0	0	3	10	0.370	4	3	9	1	0.429	1	0	1	2	163	2025	\N	67	0.296	\N	0.917	\N	21	1	2
1429	285	2025_lonestar_kraken_tx_chase_pendley	6	6	17	6	5	2	0	0	5	7	0.412	8	2	4	1	0.517	2	0	2	3	163	2025	\N	1	0.294	\N	1.000	\N	6	15	0
1430	319	2025_lonestar_kraken_tx_ethan_ho	6	6	26	3	7	3	0	1	4	13	0.500	2	0	7	2	0.321	0	0	0	0	163	2025	\N	20	0.269	\N	0.962	\N	49	1	2
1431	375	2025_lonestar_kraken_tx_josh_livingston	7	7	27	5	6	1	0	2	11	13	0.481	6	0	8	0	0.343	2	0	1	1	163	2025	\N	45	0.222	\N	1.000	\N	38	10	0
1432	306	2025_lonestar_kraken_tx_diego_gonzalez	6	5	21	3	3	0	0	1	4	6	0.286	4	1	3	0	0.296	1	0	0	0	163	2025	\N	9	0.143	\N	1.000	\N	21	0	0
1433	401	2025_lonestar_kraken_tx_major_brignon	7	6	15	5	2	0	1	0	4	4	0.267	4	2	6	0	0.381	0	3	1	2	163	2025	\N	21	0.133	\N	1.000	\N	6	10	0
1434	364	2025_lonestar_kraken_tx_jax_marshall	6	5	12	3	3	0	1	0	1	5	0.417	5	1	5	0	0.500	0	0	2	2	163	2025	\N	56	0.250	\N	1.000	\N	6	0	0
1435	354	2025_lonestar_kraken_tx_jacob_manaska	1	1	4	0	0	0	0	0	0	0	0.000	0	0	2	0	0.000	0	0	0	0	163	2025	\N	5	0.000	\N	1.000	\N	0	1	0
1436	332	2025_lonestar_kraken_tx_grant_nekuza	2	1	2	0	0	0	0	0	0	0	0.000	2	0	1	0	0.500	0	0	1	1	163	2025	\N	0	0.000	\N	0.000	\N	0	0	0
1437	409	2025_lonestar_kraken_tx_micah_melott	2	0	1	2	0	0	0	0	0	0	0.000	0	0	1	0	0.000	0	0	0	0	163	2025	\N	00	0.000	\N	1.000	\N	1	1	0
1438	1716	2025_hays_larks_karson_liggins	6	6	26	9	11	3	1	0	3	16	0.615	2	0	2	1	0.464	0	0	3	5	6	2025	\N	8	0.423	\N	0.920	\N	9	14	2
1439	1717	2025_hays_larks_hector_garcia	6	6	20	7	8	1	0	0	2	9	0.450	5	1	2	0	0.520	0	0	7	9	6	2025	\N	12	0.400	\N	1.000	\N	11	0	0
1440	1718	2025_hays_larks_zane_zurbrugg	6	6	24	5	9	4	0	0	6	13	0.542	3	0	4	0	0.444	0	0	0	1	6	2025	\N	14	0.375	\N	1.000	\N	13	1	0
1441	1719	2025_hays_larks_grant_evans	6	6	26	7	8	2	1	0	3	12	0.462	2	0	5	0	0.357	0	0	3	4	6	2025	\N	32	0.308	\N	1.000	\N	9	0	0
1442	1720	2025_hays_larks_jack_andrus	6	6	21	4	5	1	0	0	5	6	0.286	5	0	4	1	0.375	1	0	0	0	6	2025	\N	25	0.238	\N	0.976	\N	39	1	1
1443	1721	2025_hays_larks_cash_jones	6	6	22	3	5	0	0	0	3	5	0.227	6	0	4	1	0.393	0	1	0	0	6	2025	\N	24	0.227	\N	0.750	\N	2	4	2
1444	1722	2025_hays_larks_parker_palkovic	5	5	22	4	4	1	1	0	4	7	0.318	1	1	6	1	0.240	0	0	0	1	6	2025	\N	16	0.182	\N	0.813	\N	3	10	3
1445	1723	2025_hays_larks_noah_carlson	5	5	18	1	3	0	0	0	0	3	0.167	2	0	2	0	0.250	0	0	0	0	6	2025	\N	2	0.167	\N	0.963	\N	10	16	1
1446	1724	2025_hays_larks_jackson_kelley	6	6	15	4	2	0	0	0	0	2	0.133	7	0	4	0	0.391	0	1	1	1	6	2025	\N	10	0.133	\N	1.000	\N	12	0	0
37	153	2024_3	7	\N	29	11	16	3	0	0	10	\N	0.655	3	\N	3	\N	0.559	\N	\N	4	\N	3	2024	0	\N	\N	\N	\N	\N	\N	\N	\N
38	154	2024_3	7	\N	21	10	11	3	0	0	8	\N	0.667	6	\N	3	\N	0.643	\N	\N	2	\N	3	2024	1	\N	\N	\N	\N	\N	\N	\N	\N
39	155	2024_3	7	\N	24	8	11	1	0	0	5	\N	0.5	4	\N	2	\N	0.517	\N	\N	1	\N	3	2024	0	\N	\N	\N	\N	\N	\N	\N	\N
40	156	2024_3	7	\N	26	6	10	4	0	0	9	\N	0.538	3	\N	4	\N	0.448	\N	\N	0	\N	3	2024	0	\N	\N	\N	\N	\N	\N	\N	\N
41	157	2024_3	7	\N	23	7	8	2	0	0	6	\N	0.435	5	\N	7	\N	0.464	\N	\N	3	\N	3	2024	0	\N	\N	\N	\N	\N	\N	\N	\N
42	158	2024_3	7	\N	23	4	7	1	0	0	7	\N	0.348	2	\N	6	\N	0.36	\N	\N	0	\N	3	2024	0	\N	\N	\N	\N	\N	\N	\N	\N
43	159	2024_3	7	\N	20	5	6	2	0	0	4	\N	0.4	3	\N	4	\N	0.391	\N	\N	0	\N	3	2024	0	\N	\N	\N	\N	\N	\N	\N	\N
1447	1725	2025_hays_larks_darien_hinojosa	4	3	13	3	6	2	0	0	3	8	0.615	1	0	3	0	0.500	0	0	0	0	6	2025	\N	13	0.462	\N	1.000	\N	3	0	0
1448	1726	2025_hays_larks_nick_voelker	3	2	7	2	2	0	0	0	0	2	0.286	0	0	1	0	0.286	0	0	0	0	6	2025	\N	21	0.286	\N	1.000	\N	1	2	0
1449	1727	2025_hays_larks_brayden_loftin	2	0	2	0	0	0	0	0	0	0	0.000	0	0	1	0	0.000	0	0	0	0	6	2025	\N	20	0.000	\N	1.000	\N	0	1	0
1450	1739	2025_seattle_studs_grant_larson	5	5	16	5	8	1	0	1	6	12	0.750	4	1	2	0	0.609	2	0	0	0	165	2025	\N	6	0.500	\N	1.000	\N	2	6	0
1451	1740	2025_seattle_studs_adam_cabrera	4	3	12	4	4	1	0	0	2	5	0.417	1	1	1	1	0.429	0	0	0	0	165	2025	\N	16	0.333	\N	0.933	\N	4	10	1
1452	1741	2025_seattle_studs_jack_machtemes	5	5	19	4	5	1	0	0	3	6	0.316	2	0	3	0	0.333	0	0	0	0	165	2025	\N	22	0.263	\N	1.000	\N	5	0	0
1453	1742	2025_seattle_studs_luke_wilson	5	5	19	3	4	3	0	0	1	7	0.368	2	0	3	0	0.286	0	0	0	0	165	2025	\N	18	0.211	\N	1.000	\N	9	0	0
1454	1743	2025_seattle_studs_cade_fergus	5	5	20	2	4	0	0	0	3	4	0.200	2	0	1	0	0.273	0	0	0	0	165	2025	\N	20	0.200	\N	0.917	\N	12	10	2
1455	1744	2025_seattle_studs_cole_johnson	5	5	19	0	3	1	0	0	2	4	0.211	1	0	5	1	0.200	0	0	0	1	165	2025	\N	24	0.158	\N	1.000	\N	38	2	0
1456	1745	2025_seattle_studs_ryan_gallagher	4	4	18	3	2	1	0	0	1	3	0.167	0	0	6	0	0.111	0	0	0	0	165	2025	\N	9	0.111	\N	0.714	\N	2	8	4
1457	1746	2025_seattle_studs_carson_binder	4	3	9	2	3	0	0	0	0	3	0.333	2	0	3	0	0.455	0	0	0	0	165	2025	\N	4	0.333	\N	1.000	\N	0	2	0
1458	1747	2025_seattle_studs_jackson_anderson	4	2	7	2	2	0	0	0	0	2	0.286	1	0	3	0	0.375	0	0	0	0	165	2025	\N	29	0.286	\N	1.000	\N	11	1	0
1459	1748	2025_seattle_studs_payton_strampe	4	3	9	1	1	0	0	0	0	1	0.111	1	0	2	0	0.200	0	0	0	0	165	2025	\N	3	0.111	\N	1.000	\N	3	0	0
1460	1749	2025_seattle_studs_finn_strom	2	0	3	0	0	0	0	0	0	0	0.000	0	0	2	0	0.000	0	0	0	0	165	2025	\N	15	0.000	\N	0.000	\N	0	0	0
1461	1750	2025_seattle_studs_luke_foltz	2	0	1	0	0	0	0	0	0	0	0.000	0	0	0	0	0.000	0	0	0	0	165	2025	\N	25	0.000	\N	0.667	\N	0	2	1
1462	1761	2025_alaska_goldpanners_luke_jewett	4	4	19	5	8	2	0	1	5	13	0.684	1	0	5	1	0.450	0	0	0	1	166	2025	\N	9	0.421	\N	0.800	\N	4	0	1
1463	1762	2025_alaska_goldpanners_cody_jefferis	4	4	17	2	7	1	0	0	2	8	0.471	1	0	1	2	0.444	0	0	0	0	166	2025	\N	3	0.412	\N	1.000	\N	17	0	0
1464	1763	2025_alaska_goldpanners_conner_thurman	4	4	17	5	7	1	0	0	0	8	0.471	2	0	4	0	0.474	0	0	5	5	166	2025	\N	13	0.412	\N	0.750	\N	2	1	1
1465	1764	2025_alaska_goldpanners_emilio_gonzalez	4	4	16	2	6	1	0	0	2	7	0.438	0	0	2	0	0.375	0	0	0	0	166	2025	\N	25	0.375	\N	0.889	\N	3	5	1
1466	1765	2025_alaska_goldpanners_cole_klecker	4	4	15	2	5	0	0	0	2	5	0.333	2	0	1	0	0.412	0	0	1	1	166	2025	\N	7	0.333	\N	1.000	\N	6	7	0
1467	1766	2025_alaska_goldpanners_tyler_thomas	4	4	17	1	5	2	0	0	3	7	0.412	1	0	4	0	0.333	0	0	0	1	166	2025	\N	33	0.294	\N	1.000	\N	8	0	0
1468	1767	2025_alaska_goldpanners_everett_smith	4	4	15	1	4	0	0	1	2	7	0.467	1	0	3	0	0.313	0	0	1	1	166	2025	\N	23	0.267	\N	1.000	\N	9	0	0
1469	1768	2025_alaska_goldpanners_peyton_holt	4	4	15	1	3	0	0	0	2	3	0.200	0	0	2	0	0.200	0	0	0	0	166	2025	\N	10	0.200	\N	1.000	\N	26	1	0
1470	1769	2025_alaska_goldpanners_troy_pragnell	4	4	13	3	2	1	0	0	1	3	0.231	3	0	3	0	0.313	0	0	0	0	166	2025	\N	15	0.154	\N	0.938	\N	4	11	1
1471	1770	2025_alaska_goldpanners_ayden_anderson	3	0	2	0	0	0	0	0	0	0	0.000	0	0	1	0	0.000	0	0	0	0	166	2025	\N	6	0.000	\N	1.000	\N	0	1	0
1472	1771	2025_alaska_goldpanners_ben_johnson	1	0	2	0	0	0	0	0	0	0	0.000	0	0	2	0	0.000	0	0	0	0	166	2025	\N	24	0.000	\N	0.000	\N	0	0	0
1473	1783	2025_santa_barbara_foresters_ryan_galanie	5	5	19	6	7	1	0	2	5	14	0.737	1	0	8	0	0.400	0	0	0	0	2	2025	\N	25	0.368	\N	1.000	\N	8	0	0
1474	1784	2025_santa_barbara_foresters_grant_delauter	5	5	17	5	6	1	0	0	2	7	0.412	2	0	3	0	0.421	0	0	2	2	2	2025	\N	27	0.353	\N	1.000	\N	10	0	0
1475	1785	2025_santa_barbara_foresters_ty_griesser	5	5	19	5	6	1	0	2	8	13	0.684	3	0	6	0	0.409	0	0	0	0	2	2025	\N	24	0.316	\N	1.000	\N	3	0	0
1476	1786	2025_santa_barbara_foresters_caleb_cotter	5	5	18	3	5	0	0	0	2	5	0.278	2	1	3	0	0.381	0	0	1	1	2	2025	\N	13	0.278	\N	0.939	\N	13	18	2
1477	1787	2025_santa_barbara_foresters_william_jacobson	5	5	19	2	4	0	0	0	3	4	0.211	0	0	2	1	0.211	0	0	0	0	2	2025	\N	6	0.211	\N	0.875	\N	6	8	2
1478	1788	2025_santa_barbara_foresters_tanner_holden	5	5	17	4	3	2	0	0	2	5	0.294	1	1	4	0	0.263	0	0	0	0	2	2025	\N	5	0.176	\N	1.000	\N	5	0	0
1479	1789	2025_santa_barbara_foresters_jake_moberg	4	4	12	1	2	0	0	0	1	2	0.167	0	1	3	1	0.231	0	0	0	0	2	2025	\N	22	0.167	\N	1.000	\N	28	2	0
1480	1790	2025_santa_barbara_foresters_matthew_futterman	5	5	13	1	2	1	0	0	0	3	0.231	1	0	1	1	0.214	0	0	0	0	2	2025	\N	20	0.154	\N	0.889	\N	7	1	1
1481	1791	2025_santa_barbara_foresters_tommy_mcauliff	5	5	11	2	1	0	0	0	0	1	0.091	3	0	3	0	0.286	0	0	0	0	2	2025	\N	17	0.091	\N	1.000	\N	3	12	0
1482	1792	2025_santa_barbara_foresters_rhett_rutledge	3	2	9	2	2	0	0	0	0	2	0.222	0	0	2	0	0.222	0	0	0	0	2	2025	\N	10	0.222	\N	0.000	\N	0	0	0
1483	1793	2025_santa_barbara_foresters_jamar_fairweather	1	0	2	0	0	0	0	0	0	0	0.000	0	0	1	0	0.000	0	0	0	0	2	2025	\N	1	0.000	\N	0.000	\N	0	0	0
1484	1805	2025_derby_twins_bryce_mathews	4	4	15	4	5	0	0	1	2	8	0.533	2	0	3	0	0.412	0	0	1	1	168	2025	\N	13	0.333	\N	1.000	\N	9	0	0
1485	1806	2025_derby_twins_jacob_nolan	4	4	16	2	5	1	0	0	1	6	0.375	1	0	4	0	0.353	0	0	0	0	168	2025	\N	15	0.313	\N	1.000	\N	2	7	0
1486	1807	2025_derby_twins_drew_ehrhard	4	4	17	4	5	1	0	0	0	6	0.353	0	0	2	0	0.294	0	0	3	3	168	2025	\N	8	0.294	\N	1.000	\N	9	0	0
1487	1808	2025_derby_twins_connor_woods	4	4	14	2	4	0	0	1	2	7	0.500	1	1	2	0	0.375	0	0	0	0	168	2025	\N	24	0.286	\N	1.000	\N	30	3	0
1488	1809	2025_derby_twins_ryan_tinsley	4	4	15	2	4	2	0	0	3	6	0.400	1	0	1	1	0.313	0	0	0	0	168	2025	\N	21	0.267	\N	1.000	\N	13	0	0
1489	1810	2025_derby_twins_coy_goetz	4	4	17	4	4	2	0	0	3	6	0.353	2	0	3	0	0.316	0	0	0	0	168	2025	\N	5	0.235	\N	1.000	\N	0	10	0
1490	1811	2025_derby_twins_luke_jessen	4	4	19	2	4	0	0	0	1	4	0.211	0	0	3	0	0.211	0	0	0	0	168	2025	\N	4	0.211	\N	1.000	\N	2	10	0
1491	1812	2025_derby_twins_carter_foos	4	4	16	0	2	0	0	0	1	2	0.125	0	0	4	0	0.125	0	0	0	0	168	2025	\N	12	0.125	\N	0.875	\N	2	5	1
1492	1813	2025_derby_twins_luke_eck	4	4	13	0	1	0	0	0	1	1	0.077	1	1	3	2	0.200	0	0	0	0	168	2025	\N	1	0.077	\N	0.941	\N	5	11	1
1493	1814	2025_derby_twins_reed_jackson	2	0	2	0	0	0	0	0	0	0	0.000	0	0	1	0	0.000	0	0	0	0	168	2025	\N	17	0.000	\N	0.500	\N	1	0	1
1494	1815	2025_derby_twins_derek_craft	1	0	1	0	0	0	0	0	0	0	0.000	0	0	1	0	0.000	0	0	0	0	168	2025	\N	16	0.000	\N	0.000	\N	0	0	0
1495	1826	2025_san_diego_stars_darius_perry	4	4	17	5	6	1	0	1	4	10	0.588	0	0	5	0	0.353	0	0	1	1	169	2025	\N	22	0.353	\N	1.000	\N	5	0	0
1496	1827	2025_san_diego_stars_braylin_marine	4	4	15	2	5	0	0	0	1	5	0.333	2	0	2	0	0.412	0	0	1	1	169	2025	\N	1	0.333	\N	0.800	\N	4	0	1
1497	1828	2025_san_diego_stars_nick_gile	4	4	16	4	5	1	0	0	0	6	0.375	1	0	4	1	0.353	0	0	4	4	169	2025	\N	12	0.313	\N	1.000	\N	8	0	0
1498	1829	2025_san_diego_stars_tyler_lee	4	4	17	2	4	1	0	0	2	5	0.294	1	0	2	0	0.278	0	0	0	0	169	2025	\N	17	0.235	\N	0.857	\N	6	6	2
1499	1830	2025_san_diego_stars_gage_ragland	4	4	15	3	3	0	0	0	1	3	0.200	2	1	3	0	0.333	0	0	0	0	169	2025	\N	20	0.200	\N	0.857	\N	2	10	2
1500	1831	2025_san_diego_stars_derrick_cherry	4	4	17	3	3	0	1	0	2	5	0.294	1	0	6	0	0.222	0	0	0	0	169	2025	\N	16	0.176	\N	1.000	\N	21	2	0
1501	1832	2025_san_diego_stars_brantley_bell	4	4	16	1	2	1	0	0	1	3	0.188	1	0	5	0	0.176	0	0	0	0	169	2025	\N	28	0.125	\N	1.000	\N	7	0	0
1502	1833	2025_san_diego_stars_cj_rodriguez	4	4	9	1	1	0	0	0	1	1	0.111	3	0	2	0	0.333	0	0	2	2	169	2025	\N	11	0.111	\N	1.000	\N	2	0	0
1503	1834	2025_san_diego_stars_preston_allen	4	4	11	0	1	0	0	0	1	1	0.091	1	0	3	1	0.167	0	0	0	0	169	2025	\N	23	0.091	\N	0.889	\N	4	4	1
1504	1835	2025_san_diego_stars_ryan_loera	2	0	2	0	0	0	0	0	0	0	0.000	0	0	0	0	0.000	0	0	0	0	169	2025	\N	10	0.000	\N	0.750	\N	2	1	1
1505	1836	2025_san_diego_stars_jace_kaminska	1	0	2	1	0	0	0	0	0	0	0.000	0	0	1	0	0.000	0	0	0	0	169	2025	\N	3	0.000	\N	0.000	\N	0	0	0
1506	1848	2025_junction_city_brigade_michael_curry	4	4	18	4	7	1	0	0	3	8	0.444	2	0	2	0	0.450	0	0	0	0	318	2025	\N	12	0.389	\N	1.000	\N	0	1	0
1507	1849	2025_junction_city_brigade_mason_maners	4	4	15	2	5	2	0	0	2	7	0.467	2	0	2	0	0.412	0	0	0	0	318	2025	\N	9	0.333	\N	1.000	\N	9	0	0
1508	1850	2025_junction_city_brigade_jake_goracke	4	4	17	3	5	2	0	0	2	7	0.412	1	0	2	1	0.333	0	0	0	0	318	2025	\N	13	0.294	\N	1.000	\N	7	0	0
1509	1851	2025_junction_city_brigade_leighton_lewis	4	4	18	1	5	0	0	0	2	5	0.278	0	0	4	0	0.278	0	0	2	2	318	2025	\N	3	0.278	\N	0.968	\N	26	4	1
1510	1852	2025_junction_city_brigade_landon_jarmer	4	4	17	2	4	1	0	0	2	5	0.294	1	0	2	0	0.278	0	0	1	1	318	2025	\N	20	0.235	\N	0.800	\N	1	11	3
1511	1853	2025_junction_city_brigade_brooks_brack	4	4	15	3	3	0	0	0	0	3	0.200	1	1	1	0	0.294	0	0	1	1	318	2025	\N	15	0.200	\N	1.000	\N	3	0	0
1512	1854	2025_junction_city_brigade_bradey_simmons	4	4	17	1	3	1	0	0	1	4	0.235	0	0	3	0	0.176	0	0	0	0	318	2025	\N	5	0.176	\N	1.000	\N	5	8	0
1513	1855	2025_junction_city_brigade_chris_camarillo	4	4	13	2	2	0	0	0	0	2	0.154	2	0	4	0	0.267	0	0	0	0	318	2025	\N	10	0.154	\N	0.900	\N	1	8	1
1514	1856	2025_junction_city_brigade_jackson_loftin	4	4	15	0	2	0	0	0	0	2	0.133	0	0	4	0	0.133	0	0	0	0	318	2025	\N	23	0.133	\N	1.000	\N	2	8	0
1515	1857	2025_junction_city_brigade_kaden_ottley	2	0	1	0	0	0	0	0	0	0	0.000	0	0	1	0	0.000	0	0	0	0	318	2025	\N	6	0.000	\N	0.000	\N	0	0	0
1516	1868	2025_top_prospect_academy_gunner_troutwine	4	4	15	1	5	0	0	0	0	5	0.333	1	0	2	1	0.375	0	0	0	0	326	2025	\N	2	0.333	\N	1.000	\N	1	0	0
1517	1869	2025_top_prospect_academy_tate_hays	4	4	13	3	4	2	0	0	1	6	0.462	3	0	2	0	0.438	0	0	1	1	326	2025	\N	24	0.308	\N	0.900	\N	9	0	1
1518	1870	2025_top_prospect_academy_max_muncy	4	4	18	3	5	2	0	0	2	7	0.389	1	0	3	0	0.316	0	0	0	0	326	2025	\N	30	0.278	\N	1.000	\N	3	4	0
1519	1871	2025_top_prospect_academy_brycen_pratt	4	4	15	3	4	0	0	0	1	4	0.267	2	0	1	0	0.353	0	0	2	2	326	2025	\N	15	0.267	\N	0.889	\N	7	1	1
1520	1872	2025_top_prospect_academy_jace_colvin	4	4	17	1	4	0	0	1	3	7	0.412	0	0	5	0	0.235	0	0	0	0	326	2025	\N	3	0.235	\N	0.909	\N	4	6	1
1521	1873	2025_top_prospect_academy_dylan_oconnell	4	4	17	1	4	1	0	0	2	5	0.294	1	0	5	0	0.278	0	0	0	0	326	2025	\N	9	0.235	\N	0.857	\N	4	2	1
1522	1874	2025_top_prospect_academy_kamden_cobian	4	4	17	0	3	0	0	0	2	3	0.176	0	0	4	2	0.176	0	0	0	0	326	2025	\N	13	0.176	\N	0.964	\N	26	1	1
1523	1875	2025_top_prospect_academy_trent_temple	4	4	16	0	2	0	0	0	1	2	0.125	0	0	4	1	0.125	0	0	0	0	326	2025	\N	27	0.125	\N	0.875	\N	2	12	2
1524	1876	2025_top_prospect_academy_jaylon_brown	4	4	11	1	1	0	0	0	0	1	0.091	2	1	2	0	0.286	0	0	0	0	326	2025	\N	22	0.091	\N	0.900	\N	1	8	1
1525	1877	2025_top_prospect_academy_rhett_culver	2	1	1	0	0	0	0	0	0	0	0.000	0	0	0	0	0.000	0	0	0	0	326	2025	\N	8	0.000	\N	0.000	\N	0	0	0
1526	1888	2025_seattle_blackfins_will_frisch	4	4	20	4	9	1	0	1	4	13	0.650	0	0	5	0	0.450	0	0	0	0	324	2025	\N	17	0.450	\N	1.000	\N	7	0	0
1527	1889	2025_seattle_blackfins_jack_blomgren	4	4	15	2	6	1	0	1	4	10	0.667	0	1	3	0	0.438	0	0	0	0	324	2025	\N	33	0.400	\N	0.917	\N	10	1	1
1528	1890	2025_seattle_blackfins_colton_stiles	4	4	15	3	6	1	0	0	2	7	0.467	2	0	3	0	0.471	0	0	0	0	324	2025	\N	27	0.400	\N	1.000	\N	4	0	0
1529	1891	2025_seattle_blackfins_caden_kendle	4	4	16	2	5	1	0	0	2	6	0.375	1	0	3	0	0.353	0	0	0	0	324	2025	\N	3	0.313	\N	0.857	\N	1	5	1
1530	1892	2025_seattle_blackfins_grady_sievers	4	4	17	1	4	1	0	0	1	5	0.294	0	0	4	0	0.235	0	0	1	1	324	2025	\N	7	0.235	\N	0.909	\N	1	9	1
1531	1893	2025_seattle_blackfins_will_verdung	4	4	13	1	3	2	0	0	2	5	0.385	3	0	3	0	0.375	0	0	0	0	324	2025	\N	2	0.231	\N	1.000	\N	22	4	0
1532	1894	2025_seattle_blackfins_gavin_silva	4	4	14	1	3	1	0	0	1	4	0.286	2	0	2	0	0.313	0	0	0	0	324	2025	\N	23	0.214	\N	0.833	\N	5	0	1
1533	1895	2025_seattle_blackfins_easton_amundson	4	4	16	2	3	0	0	0	0	3	0.188	0	0	2	0	0.188	0	0	1	1	324	2025	\N	44	0.188	\N	0.889	\N	3	5	1
1534	1896	2025_seattle_blackfins_quinn_eddy	4	4	11	1	2	0	0	0	0	2	0.182	3	0	2	0	0.357	0	0	0	0	324	2025	\N	22	0.182	\N	1.000	\N	2	0	0
1535	1897	2025_seattle_blackfins_colin_adams	2	0	3	0	0	0	0	0	0	0	0.000	0	0	2	0	0.000	0	0	0	0	324	2025	\N	15	0.000	\N	0.000	\N	0	0	0
1536	1898	2025_seattle_blackfins_jack_whitmer	1	0	2	0	0	0	0	0	0	0	0.000	0	0	0	0	0.000	0	0	0	0	324	2025	\N	11	0.000	\N	0.000	\N	0	0	0
1537	1907	2025_lonestar_tx_baseball_club_beau_burrows	4	4	15	5	7	1	0	0	3	8	0.533	3	0	1	0	0.556	0	0	1	1	320	2025	\N	17	0.467	\N	0.889	\N	8	0	1
1538	1908	2025_lonestar_tx_baseball_club_case_salyars	4	4	17	1	6	1	0	0	3	7	0.412	0	0	5	0	0.353	0	0	0	0	320	2025	\N	1	0.353	\N	0.900	\N	3	6	1
1539	1909	2025_lonestar_tx_baseball_club_holden_powell	4	4	15	1	5	1	0	0	2	6	0.400	0	0	3	0	0.333	0	0	0	0	320	2025	\N	9	0.333	\N	0.700	\N	2	5	3
1540	1910	2025_lonestar_tx_baseball_club_michael_hearne	4	4	14	1	4	0	0	0	2	4	0.286	2	0	1	0	0.375	0	0	0	0	320	2025	\N	2	0.286	\N	0.938	\N	8	7	1
1541	1911	2025_lonestar_tx_baseball_club_hayden_schilling	4	4	15	1	4	1	0	0	0	5	0.333	0	0	2	0	0.267	0	0	0	0	320	2025	\N	21	0.267	\N	1.000	\N	7	0	0
1542	1912	2025_lonestar_tx_baseball_club_nolan_worel	4	4	12	3	3	1	0	0	0	4	0.333	4	0	3	0	0.438	0	0	1	1	320	2025	\N	11	0.250	\N	1.000	\N	8	0	0
1543	1913	2025_lonestar_tx_baseball_club_brody_gaddis	4	4	15	0	2	0	0	0	0	2	0.133	0	0	5	1	0.133	0	0	0	0	320	2025	\N	5	0.133	\N	0.920	\N	23	0	2
1544	1914	2025_lonestar_tx_baseball_club_bryan_castro	4	4	9	0	1	0	0	0	0	1	0.111	2	1	3	0	0.308	0	0	1	1	320	2025	\N	8	0.111	\N	1.000	\N	3	9	0
1545	1915	2025_lonestar_tx_baseball_club_grant_laake	2	0	2	0	0	0	0	0	0	0	0.000	1	0	2	0	0.333	0	0	0	0	320	2025	\N	3	0.000	\N	0.000	\N	0	0	0
1546	1916	2025_lonestar_tx_baseball_club_luke_finn	1	0	1	0	0	0	0	0	0	0	0.000	0	0	1	0	0.000	0	0	0	0	320	2025	\N	10	0.000	\N	0.000	\N	0	0	0
1547	1926	2025_dodge_city_as_bo_anderson	4	4	14	1	5	1	0	0	1	6	0.429	1	0	0	0	0.400	0	0	0	0	232	2025	\N	12	0.357	\N	0.833	\N	3	2	1
1548	1927	2025_dodge_city_as_noah_nichols	4	4	15	0	4	1	0	0	1	5	0.333	0	0	3	0	0.267	0	0	0	0	232	2025	\N	9	0.267	\N	1.000	\N	7	0	0
1549	1928	2025_dodge_city_as_kameron_ojile	4	4	13	0	3	0	0	0	2	3	0.231	2	0	2	0	0.333	0	0	0	0	232	2025	\N	13	0.231	\N	1.000	\N	22	2	0
1550	1929	2025_dodge_city_as_mason_mcdaniel	4	4	14	1	3	2	0	0	1	5	0.357	0	0	3	0	0.214	0	0	0	0	232	2025	\N	20	0.214	\N	1.000	\N	7	0	0
1551	1930	2025_dodge_city_as_hayden_clark	4	4	12	1	2	0	0	0	0	2	0.167	3	0	0	0	0.313	0	0	1	1	232	2025	\N	7	0.167	\N	0.857	\N	2	4	1
1552	1931	2025_dodge_city_as_mason_nothnagel	4	4	9	2	1	0	0	0	0	1	0.111	3	0	2	1	0.333	0	0	1	1	232	2025	\N	27	0.111	\N	0.909	\N	2	8	1
1553	1932	2025_dodge_city_as_carson_schulz	4	4	10	1	1	0	0	0	0	1	0.100	4	0	4	0	0.357	0	0	0	0	232	2025	\N	2	0.100	\N	1.000	\N	8	0	0
1554	1933	2025_dodge_city_as_hayden_frack	4	4	15	1	1	0	0	0	0	1	0.067	0	0	5	0	0.067	0	0	0	0	232	2025	\N	24	0.067	\N	0.923	\N	3	9	1
1555	1934	2025_dodge_city_as_hank_smith	3	0	2	0	0	0	0	0	0	0	0.000	0	0	1	0	0.000	0	0	0	0	232	2025	\N	22	0.000	\N	1.000	\N	1	0	0
1556	1935	2025_dodge_city_as_trevor_schaffer	2	0	1	0	0	0	0	0	0	0	0.000	0	0	0	0	0.000	0	0	0	0	232	2025	\N	19	0.000	\N	1.000	\N	1	1	0
1557	1945	2025_btl_hornets_carter_putz	4	4	16	2	7	2	0	0	4	9	0.563	1	0	1	0	0.471	0	0	0	0	185	2025	\N	12	0.438	\N	1.000	\N	8	0	0
1558	1946	2025_btl_hornets_jaxson_terry	4	4	16	1	5	1	0	0	2	6	0.375	0	0	1	2	0.313	0	0	0	0	185	2025	\N	19	0.313	\N	0.923	\N	4	8	1
1559	1947	2025_btl_hornets_caleb_lile	4	4	15	2	3	0	0	0	0	3	0.200	0	1	2	1	0.250	0	0	0	0	185	2025	\N	3	0.200	\N	0.800	\N	3	5	2
1560	1948	2025_btl_hornets_jaxon_coker	4	4	16	2	3	0	0	0	2	3	0.188	1	0	4	1	0.235	0	0	2	2	185	2025	\N	5	0.188	\N	1.000	\N	7	0	0
1561	1949	2025_btl_hornets_ryne_mckenzie	4	4	15	0	2	0	0	0	1	2	0.133	0	0	3	0	0.133	0	0	0	0	185	2025	\N	13	0.133	\N	1.000	\N	7	0	0
1562	1950	2025_btl_hornets_ben_parker	4	4	15	1	2	1	0	0	1	3	0.200	0	0	4	0	0.133	0	0	0	0	185	2025	\N	4	0.133	\N	0.929	\N	6	7	1
1563	1951	2025_btl_hornets_carson_wiegand	4	4	9	1	1	0	0	0	0	1	0.111	2	0	2	0	0.273	0	0	1	1	185	2025	\N	1	0.111	\N	0.875	\N	2	5	1
1564	1952	2025_btl_hornets_collin_riner	4	4	11	0	1	0	0	0	0	1	0.091	2	0	3	0	0.231	0	0	0	0	185	2025	\N	7	0.091	\N	0.967	\N	25	4	1
1565	1953	2025_btl_hornets_aiden_henry	2	0	2	0	0	0	0	0	0	0	0.000	0	0	2	0	0.000	0	0	0	0	185	2025	\N	22	0.000	\N	0.000	\N	0	0	0
1566	1954	2025_btl_hornets_dylan_bohl	1	0	1	0	0	0	0	0	0	0	0.000	0	0	1	0	0.000	0	0	0	0	185	2025	\N	28	0.000	\N	0.000	\N	0	0	0
1567	1964	2025_mvp_oklahoma_cade_denton	4	4	18	1	7	2	0	0	1	9	0.500	0	0	1	1	0.389	0	0	0	0	189	2025	\N	10	0.389	\N	1.000	\N	8	0	0
1568	1965	2025_mvp_oklahoma_daxton_poe	4	4	17	3	5	0	1	1	3	9	0.529	0	0	2	1	0.294	0	0	0	0	189	2025	\N	21	0.294	\N	1.000	\N	3	0	0
1569	1966	2025_mvp_oklahoma_easton_kerr	4	4	18	1	4	0	0	0	0	4	0.222	0	0	3	0	0.222	0	0	1	1	189	2025	\N	8	0.222	\N	1.000	\N	2	8	0
1570	1967	2025_mvp_oklahoma_jayce_ferris	4	4	15	0	3	0	0	0	2	3	0.200	2	0	4	0	0.294	0	0	0	0	189	2025	\N	11	0.200	\N	0.750	\N	0	3	1
1571	1968	2025_mvp_oklahoma_hudson_wilhelm	4	4	17	0	3	0	0	0	1	3	0.176	0	0	1	0	0.176	0	0	0	0	189	2025	\N	7	0.176	\N	1.000	\N	9	0	0
1572	1969	2025_mvp_oklahoma_kash_mayberry	4	4	12	1	2	0	0	0	0	2	0.167	3	0	4	0	0.333	0	0	2	2	189	2025	\N	18	0.167	\N	1.000	\N	8	0	0
1573	1970	2025_mvp_oklahoma_kannon_wright	4	4	15	2	2	0	0	0	0	2	0.133	2	0	1	0	0.235	0	0	1	1	189	2025	\N	2	0.133	\N	1.000	\N	1	12	0
1574	1971	2025_mvp_oklahoma_kade_gentry	4	4	17	0	2	0	0	0	0	2	0.118	0	0	7	0	0.118	0	0	0	0	189	2025	\N	9	0.118	\N	1.000	\N	30	2	0
1575	1972	2025_mvp_oklahoma_tanner_muse	2	0	2	0	0	0	0	0	0	0	0.000	0	0	2	0	0.000	0	0	0	0	189	2025	\N	16	0.000	\N	0.000	\N	0	0	0
1576	1973	2025_mvp_oklahoma_austin_lowry	2	0	1	0	0	0	0	0	0	0	0.000	0	0	0	0	0.000	0	0	0	0	189	2025	\N	24	0.000	\N	0.000	\N	0	0	0
1577	1983	2025_gpx_tx_legends_walker_buchanan	4	4	17	2	5	1	0	0	2	6	0.353	0	1	3	1	0.333	0	0	0	1	315	2025	\N	8	0.294	\N	0.833	\N	5	0	1
1578	1984	2025_gpx_tx_legends_tanner_hinkle	4	4	15	2	4	1	0	0	1	5	0.333	2	0	2	0	0.353	0	0	0	0	315	2025	\N	13	0.267	\N	0.857	\N	5	1	1
1579	1985	2025_gpx_tx_legends_landon_hearn	4	4	16	2	3	0	0	0	0	3	0.188	1	0	5	1	0.235	0	0	1	1	315	2025	\N	1	0.188	\N	0.900	\N	9	0	1
1580	1986	2025_gpx_tx_legends_tyler_moody	4	4	16	2	3	0	0	1	2	6	0.375	0	0	6	0	0.188	0	0	0	0	315	2025	\N	22	0.188	\N	1.000	\N	24	3	0
1581	1987	2025_gpx_tx_legends_cade_cole	4	4	17	2	3	0	0	0	2	3	0.176	0	0	5	0	0.176	0	0	0	0	315	2025	\N	9	0.176	\N	0.923	\N	2	10	1
1582	1988	2025_gpx_tx_legends_easton_clark	4	4	12	2	2	2	0	0	0	4	0.333	2	0	1	0	0.286	0	0	0	0	315	2025	\N	12	0.167	\N	1.000	\N	2	4	0
1583	1989	2025_gpx_tx_legends_kolby_branch	4	4	17	0	2	0	0	0	1	2	0.118	0	0	3	1	0.118	0	0	0	0	315	2025	\N	2	0.118	\N	0.786	\N	3	8	3
1584	1990	2025_gpx_tx_legends_preston_payne	4	4	17	0	1	0	0	0	1	1	0.059	0	0	4	0	0.059	0	0	0	0	315	2025	\N	7	0.059	\N	0.909	\N	5	5	1
1585	1991	2025_gpx_tx_legends_hayden_turner	2	0	3	0	0	0	0	0	0	0	0.000	0	0	1	0	0.000	0	0	0	0	315	2025	\N	11	0.000	\N	1.000	\N	0	2	0
1586	1992	2025_gpx_tx_legends_dalton_davis	1	0	1	0	0	0	0	0	0	0	0.000	0	0	0	0	0.000	0	0	0	0	315	2025	\N	3	0.000	\N	0.000	\N	0	0	0
\.


--
-- Data for Name: pitching_stats; Type: TABLE DATA; Schema: public; Owner: nbc_admin
--

COPY public.pitching_stats (id, player_id, season_key, era, w, l, app, gs, cg, sho, cbo, sv, ip, h, r, er, bb, so, "2b", "3b", hr, wp, hbp, bk, sfa, sha, team_id, year, jersey_num, doubles, triples, ab, b_avg) FROM stdin;
585	160	2025_hutchinson_monarchs_bradyn_mcclure	0.71	2	0	2	2	1	1	0	0	12.2	6	1	1	1	16	4	0	0	0	0	1	0	0	3	2025	19	\N	\N	44	0.136
586	161	2025_hutchinson_monarchs_ethan_giesbrecht	1.80	1	0	2	2	0	0	0	0	10.0	5	2	2	6	8	2	0	0	0	0	0	1	1	3	2025	28	\N	\N	31	0.161
587	1692	2025_hutchinson_monarchs_pryce_bender	7.20	1	1	2	2	0	0	0	0	10.0	10	8	8	4	9	3	1	1	0	0	0	0	0	3	2025	6	\N	\N	41	0.244
588	1693	2025_hutchinson_monarchs_carson_umphres	0.00	1	0	1	1	0	0	1	0	5.0	2	0	0	0	5	1	0	0	0	1	0	0	0	3	2025	17	\N	\N	17	0.118
589	1694	2025_hutchinson_monarchs_kyle_holzer	0.00	0	0	3	0	0	0	0	0	4.0	2	1	0	1	5	0	0	0	0	0	0	0	0	3	2025	39	\N	\N	15	0.133
590	1695	2025_hutchinson_monarchs_ayden_benson	0.00	0	0	2	0	0	0	0	0	2.0	3	2	0	0	3	1	0	0	0	0	0	0	0	3	2025	29	\N	\N	10	0.300
591	1696	2025_hutchinson_monarchs_mitchell_johnson	0.00	1	0	2	0	0	0	0	1	2.0	0	0	0	1	2	0	0	0	0	0	0	0	1	3	2025	25	\N	\N	5	0.000
592	1697	2025_hutchinson_monarchs_riley_dickey	0.00	0	0	1	0	0	0	1	0	2.0	1	0	0	1	1	0	0	0	0	0	0	0	0	3	2025	37	\N	\N	7	0.143
593	1698	2025_hutchinson_monarchs_daegan_vinduska	0.00	0	0	1	0	0	0	0	0	1.2	0	0	0	2	0	0	0	0	0	0	0	0	0	3	2025	4	\N	\N	4	0.000
594	1699	2025_hutchinson_monarchs_karter_chamberlin	0.00	0	0	1	0	0	0	0	0	1.1	1	0	0	1	1	1	0	0	0	0	0	0	0	3	2025	24	\N	\N	4	0.250
595	1700	2025_hutchinson_monarchs_bradyn_pacha	2.70	0	0	3	0	0	0	0	0	3.1	1	1	1	2	7	1	0	0	1	0	0	0	0	3	2025	38	\N	\N	11	0.091
596	1701	2025_hutchinson_monarchs_whitney_rhodes	18.00	0	0	1	0	0	0	0	0	1.0	2	2	2	2	3	0	0	0	1	0	0	0	0	3	2025	16	\N	\N	5	0.400
597	1702	2025_hutchinson_monarchs_aiden_sowers	18.00	0	0	1	0	0	0	0	0	1.0	2	2	2	0	0	1	0	0	0	1	0	0	0	3	2025	31	\N	\N	5	0.400
598	1703	2025_hutchinson_monarchs_cole_toureau	\N	0	0	1	0	0	0	0	0	0.0	1	2	2	3	0	0	0	0	0	0	0	0	0	3	2025	7	\N	\N	1	1.000
599	1704	2025_lonestar_kraken_tx_kendall_hoffman	1.00	1	0	2	1	0	0	0	0	9.0	3	1	1	4	8	1	0	0	0	2	1	0	1	163	2025	95	\N	\N	27	0.111
600	409	2025_lonestar_kraken_tx_micah_melott	1.23	1	0	2	1	0	0	0	0	7.1	7	3	1	2	5	0	0	0	0	3	0	0	0	163	2025	00	\N	\N	27	0.259
601	1705	2025_lonestar_kraken_tx_trent_collier	2.16	1	0	3	2	0	0	0	0	8.1	3	2	2	5	15	0	0	0	0	1	1	0	0	163	2025	19	\N	\N	28	0.107
602	1706	2025_lonestar_kraken_tx_brett_foss	7.56	1	0	4	1	0	0	0	0	8.1	9	8	7	4	6	3	0	0	1	1	0	0	0	163	2025	48	\N	\N	32	0.281
603	332	2025_lonestar_kraken_tx_grant_nekuza	0.00	0	0	1	0	0	0	0	0	2.0	1	0	0	0	1	0	0	0	0	0	0	0	0	163	2025	0	\N	\N	7	0.143
604	1707	2025_lonestar_kraken_tx_brandon_manaska	0.00	0	0	1	0	0	0	0	0	1.0	0	0	0	3	0	0	0	0	0	0	0	0	0	163	2025	69	\N	\N	2	0.000
605	382	2025_lonestar_kraken_tx_kado_robardy	0.00	0	0	1	0	0	0	0	0	1.0	1	0	0	0	0	0	0	0	0	0	0	0	0	163	2025	2	\N	\N	3	0.333
606	1708	2025_lonestar_kraken_tx_kade_irons	2.25	0	0	2	0	0	0	0	0	4.0	1	3	1	4	4	0	0	0	1	1	1	1	0	163	2025	15	\N	\N	11	0.091
607	1709	2025_lonestar_kraken_tx_spencer_coon	4.50	0	0	3	0	0	0	0	0	4.0	4	2	2	5	2	1	0	1	0	0	0	0	1	163	2025	44	\N	\N	15	0.267
608	1710	2025_lonestar_kraken_tx_ethan_blakeney	6.75	0	0	3	0	0	0	0	0	2.2	2	2	2	1	4	0	0	0	1	0	0	0	0	163	2025	55	\N	\N	10	0.200
609	1711	2025_lonestar_kraken_tx_bryce_mcguire	9.00	0	1	2	1	0	0	0	0	2.0	5	6	2	1	1	2	0	0	2	0	0	0	0	163	2025	18	\N	\N	14	0.357
26	160	2024_3	0.71	2	0	3	2	\N	\N	\N	0	12.2	8	2	1	1	16	\N	\N	\N	\N	\N	\N	\N	\N	3	2024	\N	\N	\N	\N	\N
27	161	2024_3	1	1	0	3	2	\N	\N	\N	0	10	7	3	1	4	11	\N	\N	\N	\N	\N	\N	\N	\N	3	2024	\N	\N	\N	\N	\N
28	162	2024_3	3	1	1	3	1	\N	\N	\N	0	9	8	4	3	2	10	\N	\N	\N	\N	\N	\N	\N	\N	3	2024	\N	\N	\N	\N	\N
29	163	2024_3	0	0	0	2	0	\N	\N	\N	1	5.1	3	1	0	2	7	\N	\N	\N	\N	\N	\N	\N	\N	3	2024	\N	\N	\N	\N	\N
30	164	2024_3	2.57	1	0	3	0	\N	\N	\N	0	7	5	2	2	3	8	\N	\N	\N	\N	\N	\N	\N	\N	3	2024	\N	\N	\N	\N	\N
610	1712	2025_lonestar_kraken_tx_dillon_precht	11.57	1	0	2	0	0	0	0	0	2.1	6	3	3	0	3	2	0	0	1	1	0	2	0	163	2025	25	\N	\N	11	0.545
611	1713	2025_lonestar_kraken_tx_logan_reid	11.57	0	1	2	1	0	0	0	0	2.1	1	3	3	5	3	0	0	0	0	1	0	0	0	163	2025	3	\N	\N	7	0.143
612	1714	2025_lonestar_kraken_tx_nick_fein	15.43	0	0	2	0	0	0	0	0	2.1	2	4	4	4	5	0	0	0	1	0	0	1	0	163	2025	6	\N	\N	8	0.250
613	1715	2025_lonestar_kraken_tx_matthew_hedrick	27.00	0	0	3	0	0	0	0	0	2.1	6	7	7	4	4	2	0	0	3	1	0	1	0	163	2025	4	\N	\N	12	0.500
614	1728	2025_hays_larks_tyler_cedeno	0.00	2	0	2	2	1	1	0	0	11.0	5	1	0	3	9	2	0	0	0	0	0	0	0	6	2025	1	\N	\N	38	0.132
615	1729	2025_hays_larks_john_wuthrich	2.08	1	0	2	2	0	0	0	0	8.2	5	2	2	7	9	1	0	0	0	0	0	1	0	6	2025	30	\N	\N	29	0.172
616	1730	2025_hays_larks_jake_sims	3.00	0	0	2	1	0	0	0	0	6.0	4	2	2	2	6	2	0	0	0	0	0	0	0	6	2025	15	\N	\N	20	0.200
617	1731	2025_hays_larks_chase_phillips	5.06	0	1	2	1	0	0	0	0	5.1	9	5	3	1	4	2	0	0	0	0	0	0	0	6	2025	9	\N	\N	24	0.375
618	1732	2025_hays_larks_tyson_neighbors	0.00	0	0	1	0	0	0	0	0	5.0	2	0	0	1	7	0	0	0	0	0	0	0	0	6	2025	19	\N	\N	17	0.118
619	1733	2025_hays_larks_diego_del_castillo	0.00	0	0	2	0	0	0	0	0	3.0	2	0	0	1	2	0	0	0	0	0	0	0	0	6	2025	11	\N	\N	11	0.182
620	1734	2025_hays_larks_easton_haigler	1.80	0	0	2	0	0	0	0	0	5.0	2	1	1	1	4	0	0	0	0	0	0	0	0	6	2025	5	\N	\N	18	0.111
621	1735	2025_hays_larks_mitch_mccarty	3.86	1	1	2	0	0	0	0	0	4.2	6	2	2	0	6	1	0	0	0	0	0	0	1	6	2025	18	\N	\N	20	0.300
622	1736	2025_hays_larks_bryson_brown	4.50	0	0	3	0	0	0	0	1	4.0	4	2	2	3	2	1	0	0	1	0	0	0	0	6	2025	28	\N	\N	15	0.267
623	1737	2025_hays_larks_kolton_roberds	10.80	0	0	2	0	0	0	0	0	1.2	4	2	2	0	1	0	0	0	0	1	0	0	0	6	2025	23	\N	\N	8	0.500
624	1738	2025_hays_larks_josiah_jenkins	13.50	0	0	2	0	0	0	0	0	1.1	1	2	2	4	1	0	0	0	1	1	0	0	0	6	2025	29	\N	\N	5	0.200
625	1751	2025_seattle_studs_michael_prosek	0.00	1	0	1	1	1	1	0	0	7.0	2	0	0	2	10	0	0	0	0	0	0	0	0	165	2025	37	\N	\N	24	0.083
626	1752	2025_seattle_studs_jacob_toscano	0.00	1	0	1	1	0	0	0	0	5.0	2	0	0	2	4	1	0	0	0	0	0	0	0	165	2025	28	\N	\N	17	0.118
627	1753	2025_seattle_studs_logan_smith	1.93	1	0	2	1	0	0	0	0	4.2	2	1	1	1	3	0	0	0	1	0	0	0	0	165	2025	26	\N	\N	16	0.125
628	1754	2025_seattle_studs_chase_watkins	2.57	0	1	2	1	0	0	0	0	7.0	6	4	2	4	6	0	0	0	2	0	0	0	1	165	2025	33	\N	\N	25	0.240
629	1755	2025_seattle_studs_nathan_roe	8.31	0	1	2	1	0	0	0	0	4.1	9	5	4	1	2	2	0	0	0	0	0	1	0	165	2025	32	\N	\N	21	0.429
630	1756	2025_seattle_studs_mason_moore	0.00	0	0	1	0	0	0	0	0	2.0	1	0	0	0	2	0	0	0	0	0	0	0	0	165	2025	11	\N	\N	7	0.143
631	1757	2025_seattle_studs_ty_yukumoto	3.00	0	0	2	0	0	0	0	0	3.0	2	1	1	0	2	0	0	0	0	0	0	0	0	165	2025	39	\N	\N	10	0.200
632	1758	2025_seattle_studs_stone_miyao	3.86	0	0	3	0	0	0	0	0	4.2	4	2	2	3	7	1	0	0	1	0	0	0	0	165	2025	17	\N	\N	16	0.250
633	1759	2025_seattle_studs_connor_baune	6.00	0	0	2	0	0	0	0	0	3.0	3	2	2	0	5	0	0	0	0	0	0	0	0	165	2025	21	\N	\N	12	0.250
634	1760	2025_seattle_studs_grayson_bass	9.00	0	0	2	0	0	0	0	0	2.0	3	2	2	2	1	1	0	0	0	0	0	0	0	165	2025	23	\N	\N	9	0.333
635	1772	2025_alaska_goldpanners_kasey_ball	1.93	1	0	1	1	0	0	0	0	4.2	5	1	1	1	3	0	0	0	0	0	0	0	0	166	2025	20	\N	\N	18	0.278
636	1773	2025_alaska_goldpanners_jack_erb	3.86	0	1	1	1	0	0	0	0	4.2	4	2	2	2	3	0	0	0	0	0	0	0	0	166	2025	11	\N	\N	17	0.235
637	1774	2025_alaska_goldpanners_tyler_bosma	7.20	0	1	1	1	0	0	0	0	5.0	7	4	4	0	4	1	0	0	0	0	0	0	0	166	2025	32	\N	\N	21	0.333
638	1775	2025_alaska_goldpanners_jack_vradenburg	8.44	1	0	1	1	0	0	0	0	5.1	9	6	5	2	4	1	0	1	0	0	0	0	0	166	2025	12	\N	\N	24	0.375
639	1776	2025_alaska_goldpanners_tommy_howell	0.00	0	0	2	0	0	0	0	1	2.0	1	0	0	0	2	1	0	0	0	0	0	0	0	166	2025	26	\N	\N	7	0.143
640	1777	2025_alaska_goldpanners_kyle_feland	0.00	0	0	1	0	0	0	0	0	1.0	0	0	0	1	1	0	0	0	0	0	0	0	0	166	2025	2	\N	\N	3	0.000
641	1778	2025_alaska_goldpanners_garrett_pennington	0.00	0	0	1	0	0	0	0	0	1.0	0	0	0	0	1	0	0	0	0	0	0	0	0	166	2025	4	\N	\N	3	0.000
642	1779	2025_alaska_goldpanners_ashton_mcgee	2.25	0	0	1	0	0	0	0	0	4.0	2	1	1	2	2	1	0	0	0	1	0	0	0	166	2025	30	\N	\N	13	0.154
643	1780	2025_alaska_goldpanners_danny_depa	6.75	0	0	1	0	0	0	0	0	1.1	2	1	1	2	1	0	0	0	1	0	0	0	0	166	2025	8	\N	\N	6	0.333
644	1781	2025_alaska_goldpanners_ethan_hosier	18.00	0	0	1	0	0	0	0	0	1.0	3	2	2	1	0	0	0	0	0	0	0	0	0	166	2025	17	\N	\N	6	0.500
645	1782	2025_alaska_goldpanners_matt_desoto	27.00	0	0	1	0	0	0	0	0	0.1	2	1	1	0	0	0	0	0	0	0	0	0	0	166	2025	28	\N	\N	3	0.667
646	1794	2025_santa_barbara_foresters_ryan_costeines	1.35	1	0	2	2	0	0	0	0	6.2	2	1	1	5	5	1	0	0	1	1	0	0	0	2	2025	18	\N	\N	22	0.091
647	1795	2025_santa_barbara_foresters_mason_minks	1.50	1	0	2	1	0	0	0	0	6.0	4	1	1	2	6	0	0	0	0	0	0	0	0	2	2025	26	\N	\N	22	0.182
648	1796	2025_santa_barbara_foresters_ryan_olejniczak	4.26	1	1	2	2	0	0	0	0	6.1	6	4	3	0	6	0	0	0	1	0	0	1	0	2	2025	7	\N	\N	23	0.261
649	1797	2025_santa_barbara_foresters_ike_irish	6.00	0	1	1	0	0	0	0	0	3.0	4	3	2	0	2	0	0	0	1	0	0	0	0	2	2025	14	\N	\N	13	0.308
650	1798	2025_santa_barbara_foresters_tommy_lane	9.00	0	0	1	0	0	0	0	0	2.0	3	2	2	1	3	0	0	0	0	0	0	0	0	2	2025	35	\N	\N	9	0.333
651	1799	2025_santa_barbara_foresters_chandler_jozwiak	0.00	0	0	1	0	0	0	0	0	1.0	0	0	0	0	2	0	0	0	0	0	0	0	0	2	2025	12	\N	\N	3	0.000
652	1800	2025_santa_barbara_foresters_gabe_perez	0.00	0	0	1	0	0	0	0	0	1.0	0	0	0	2	0	0	0	0	0	1	0	0	0	2	2025	15	\N	\N	2	0.000
653	1801	2025_santa_barbara_foresters_will_golsan	0.00	0	0	1	0	0	0	0	0	1.0	0	0	0	0	2	0	0	0	0	0	0	0	0	2	2025	21	\N	\N	3	0.000
654	1802	2025_santa_barbara_foresters_mason_molina	0.00	0	0	1	0	0	0	0	0	1.0	2	0	0	0	0	0	0	0	0	0	0	0	0	2	2025	23	\N	\N	5	0.400
655	1803	2025_santa_barbara_foresters_connor_bradshaw	6.00	0	0	3	0	0	0	0	1	3.0	1	2	2	4	3	0	0	0	2	1	0	0	0	2	2025	9	\N	\N	9	0.111
656	1804	2025_santa_barbara_foresters_jack_richardson	13.50	0	0	1	0	0	0	0	0	0.2	1	1	1	2	1	0	0	0	1	0	0	0	0	2	2025	28	\N	\N	3	0.333
657	1816	2025_derby_twins_jaxon_dale	0.00	1	0	1	1	0	0	0	0	5.0	2	0	0	1	6	0	0	0	1	0	0	0	0	168	2025	19	\N	\N	17	0.118
658	1817	2025_derby_twins_devin_fontenot	1.29	1	0	1	1	0	0	0	0	7.0	3	1	1	0	10	1	0	0	0	1	0	1	0	168	2025	3	\N	\N	24	0.125
659	1818	2025_derby_twins_trenton_kluck	4.50	0	1	1	1	0	0	0	0	4.0	4	2	2	1	2	1	0	0	0	0	0	0	0	168	2025	20	\N	\N	15	0.267
660	1819	2025_derby_twins_teegan_hynek	5.40	0	1	1	1	0	0	0	0	5.0	6	3	3	3	2	0	0	0	0	0	0	1	0	168	2025	7	\N	\N	20	0.300
661	1820	2025_derby_twins_nate_webb	0.00	0	0	1	0	0	0	0	0	1.0	0	0	0	0	1	0	0	0	0	0	0	0	0	168	2025	23	\N	\N	3	0.000
662	1821	2025_derby_twins_hayden_wilmes	0.00	0	0	1	0	0	0	0	0	1.0	0	0	0	1	0	0	0	0	0	0	0	0	0	168	2025	33	\N	\N	2	0.000
663	1822	2025_derby_twins_tanner_spangler	3.00	0	0	1	0	0	0	0	0	3.0	2	1	1	0	2	0	0	0	0	0	0	0	0	168	2025	34	\N	\N	10	0.200
664	1823	2025_derby_twins_william_howell	3.38	0	0	3	0	0	0	0	1	2.2	1	1	1	0	3	0	0	0	0	0	0	0	0	168	2025	22	\N	\N	9	0.111
665	1824	2025_derby_twins_preston_boyd	6.75	0	0	1	0	0	0	0	0	1.1	3	1	1	0	0	0	0	0	0	0	0	0	0	168	2025	10	\N	\N	7	0.429
666	1825	2025_derby_twins_kannon_edwards	9.00	0	0	2	0	0	0	0	0	1.0	0	1	1	3	0	0	0	0	0	1	0	0	0	168	2025	9	\N	\N	3	0.000
667	1837	2025_san_diego_stars_payton_harden	1.69	1	0	1	1	0	0	0	0	5.1	3	1	1	2	8	0	0	0	0	0	0	0	0	169	2025	27	\N	\N	19	0.158
668	1838	2025_san_diego_stars_jackson_landingham	1.93	1	0	1	1	0	0	0	0	4.2	4	1	1	1	2	1	0	0	0	0	0	0	0	169	2025	2	\N	\N	17	0.235
669	1839	2025_san_diego_stars_joey_gonzalez	3.60	0	1	2	1	0	0	0	0	5.0	5	3	2	3	1	1	0	0	1	0	0	0	0	169	2025	15	\N	\N	18	0.278
670	1840	2025_san_diego_stars_hayden_welch	6.00	0	1	1	1	0	0	0	0	3.0	7	2	2	0	2	1	0	0	0	0	0	0	0	169	2025	26	\N	\N	15	0.467
671	1841	2025_san_diego_stars_blake_burke	0.00	0	0	1	0	0	0	0	0	1.0	1	0	0	1	0	0	0	0	0	0	0	0	0	169	2025	30	\N	\N	4	0.250
672	1842	2025_san_diego_stars_lucas_dunn	0.00	0	0	1	0	0	0	0	0	1.0	0	0	0	0	2	0	0	0	0	0	0	0	0	169	2025	5	\N	\N	3	0.000
673	1843	2025_san_diego_stars_caden_favors	2.25	0	0	2	0	0	0	0	1	4.0	3	1	1	1	4	0	0	0	0	0	0	0	0	169	2025	24	\N	\N	14	0.214
674	1844	2025_san_diego_stars_brennan_holt	3.00	0	0	2	0	0	0	0	0	3.0	3	1	1	0	4	1	0	0	0	0	0	0	0	169	2025	8	\N	\N	11	0.273
675	1845	2025_san_diego_stars_jackson_appel	6.75	0	0	1	0	0	0	0	0	1.1	2	1	1	2	0	0	0	0	0	0	0	0	0	169	2025	13	\N	\N	6	0.333
676	1846	2025_san_diego_stars_luke_osterberg	9.00	0	0	2	0	0	0	0	0	2.0	3	2	2	0	1	1	0	0	1	0	0	0	0	169	2025	21	\N	\N	9	0.333
677	1847	2025_san_diego_stars_jake_fincher	27.00	0	0	1	0	0	0	0	0	0.1	0	1	1	2	1	0	0	0	2	0	0	0	0	169	2025	7	\N	\N	1	0.000
678	1858	2025_junction_city_brigade_caden_henke	1.42	0	0	1	1	0	0	0	0	6.1	4	1	1	0	8	0	0	0	0	0	0	0	0	318	2025	19	\N	\N	23	0.174
679	1859	2025_junction_city_brigade_kamdon_willits	3.18	0	1	1	1	0	0	0	0	5.2	6	2	2	2	3	1	0	0	0	0	0	0	0	318	2025	24	\N	\N	22	0.273
680	1860	2025_junction_city_brigade_carter_nelson	5.40	1	0	1	1	0	0	0	0	5.0	6	3	3	2	3	2	0	0	0	0	0	0	0	318	2025	29	\N	\N	20	0.300
681	1861	2025_junction_city_brigade_logan_cacy	7.36	0	1	1	1	0	0	0	0	3.2	7	4	3	1	3	1	0	0	0	0	0	1	0	318	2025	8	\N	\N	17	0.412
682	1862	2025_junction_city_brigade_dylan_kirkpatrick	0.00	0	0	1	0	0	0	0	0	1.0	0	0	0	0	0	0	0	0	0	0	0	0	0	318	2025	7	\N	\N	3	0.000
683	1863	2025_junction_city_brigade_mason_waite	0.00	0	0	1	0	0	0	0	0	1.0	1	0	0	1	1	1	0	0	0	0	0	0	0	318	2025	16	\N	\N	4	0.250
684	1864	2025_junction_city_brigade_dawson_price	0.00	0	0	1	0	0	0	0	0	1.0	0	0	0	0	0	0	0	0	0	0	0	0	0	318	2025	27	\N	\N	3	0.000
685	1865	2025_junction_city_brigade_colin_coultrup	0.00	0	0	1	0	0	0	0	0	0.2	1	0	0	0	1	0	0	0	0	0	0	0	0	318	2025	17	\N	\N	3	0.333
686	1866	2025_junction_city_brigade_cooper_weeks	9.00	0	0	2	0	0	0	0	0	1.0	1	1	1	0	1	0	0	0	0	0	0	0	0	318	2025	1	\N	\N	4	0.250
687	1867	2025_junction_city_brigade_brady_petz	27.00	0	0	1	0	0	0	0	0	0.1	2	1	1	0	0	1	0	0	0	0	0	0	0	318	2025	14	\N	\N	3	0.667
688	1878	2025_top_prospect_academy_eli_drennan	3.18	1	1	2	2	0	0	0	0	5.2	5	2	2	2	6	1	0	0	0	0	0	0	0	326	2025	16	\N	\N	21	0.238
689	1879	2025_top_prospect_academy_brenham_romine	4.15	0	1	1	1	0	0	0	0	4.1	7	2	2	0	3	2	0	0	0	0	0	0	0	326	2025	1	\N	\N	18	0.389
690	1880	2025_top_prospect_academy_gage_maddox	4.91	0	1	1	1	0	0	0	0	3.2	5	3	2	2	0	1	0	0	0	0	0	1	0	326	2025	25	\N	\N	15	0.333
691	1881	2025_top_prospect_academy_nico_booth	0.00	0	0	1	0	0	0	0	0	3.0	2	0	0	0	4	0	0	0	0	0	0	0	0	326	2025	21	\N	\N	11	0.182
692	1882	2025_top_prospect_academy_cameron_mcadams	0.00	0	0	1	0	0	0	0	0	2.0	1	0	0	0	1	0	0	0	0	0	0	0	0	326	2025	12	\N	\N	7	0.143
693	1883	2025_top_prospect_academy_jaxon_gonzales	0.00	0	0	1	0	0	0	0	0	1.0	0	0	0	1	3	0	0	0	0	0	0	0	0	326	2025	11	\N	\N	3	0.000
694	1884	2025_top_prospect_academy_matthew_alaniz	2.25	0	0	2	0	0	0	0	0	4.0	3	1	1	1	1	0	0	0	0	0	0	0	0	326	2025	18	\N	\N	14	0.214
695	1885	2025_top_prospect_academy_jacob_quintanilla	4.50	0	0	2	0	0	0	0	0	2.0	2	1	1	0	0	1	0	0	0	0	0	0	0	326	2025	4	\N	\N	8	0.250
696	1886	2025_top_prospect_academy_hudson_hassler	9.00	0	0	2	0	0	0	0	0	2.0	1	2	2	4	2	0	0	0	1	1	0	0	0	326	2025	20	\N	\N	7	0.143
697	1887	2025_top_prospect_academy_aaron_taylor	18.00	0	0	1	0	0	0	0	0	1.0	3	2	2	1	1	0	0	0	0	0	0	0	0	326	2025	28	\N	\N	6	0.500
698	1899	2025_seattle_blackfins_gage_goodwin	4.50	0	1	1	1	0	0	0	0	4.0	3	2	2	1	2	0	0	0	0	0	0	0	0	324	2025	14	\N	\N	14	0.214
699	1900	2025_seattle_blackfins_payton_hendershot	5.40	0	1	1	1	0	0	0	0	5.0	8	3	3	0	4	2	0	0	0	0	0	1	0	324	2025	25	\N	\N	22	0.364
700	1901	2025_seattle_blackfins_cooper_binger	7.36	0	1	1	1	0	0	0	0	3.2	6	5	3	2	4	2	0	0	0	0	0	2	0	324	2025	26	\N	\N	16	0.375
701	1902	2025_seattle_blackfins_ryder_chaney	12.27	1	0	1	0	0	0	0	0	3.2	7	5	5	1	2	2	0	1	0	0	0	0	0	324	2025	9	\N	\N	17	0.412
702	1903	2025_seattle_blackfins_max_debiec	0.00	0	0	1	0	0	0	0	0	1.0	0	0	0	0	0	0	0	0	0	0	0	0	0	324	2025	5	\N	\N	3	0.000
703	1904	2025_seattle_blackfins_grady_mclaughlin	0.00	0	0	1	0	0	0	0	0	1.0	1	0	0	0	1	0	0	0	0	0	0	0	0	324	2025	21	\N	\N	4	0.250
704	1905	2025_seattle_blackfins_keaton_malaski	0.00	0	0	1	0	0	0	0	0	1.0	1	0	0	1	1	0	0	0	0	0	0	0	0	324	2025	24	\N	\N	4	0.250
705	1906	2025_seattle_blackfins_jojo_armenta	6.75	0	0	2	0	0	0	0	0	1.1	1	1	1	2	2	0	0	0	1	0	0	0	0	324	2025	30	\N	\N	5	0.200
706	1750	2025_seattle_blackfins_luke_foltz	27.00	0	0	2	0	0	0	0	0	0.2	2	2	2	1	1	0	0	0	1	0	0	0	0	324	2025	1	\N	\N	4	0.500
707	1917	2025_lonestar_tx_baseball_club_will_geerdes	3.86	0	1	1	1	0	0	0	0	4.2	4	2	2	1	3	1	0	0	0	0	0	0	0	320	2025	24	\N	\N	18	0.222
708	1918	2025_lonestar_tx_baseball_club_elija_pena	4.50	0	1	1	1	0	0	0	0	4.0	5	2	2	0	3	1	0	0	0	0	0	0	0	320	2025	19	\N	\N	16	0.313
709	1919	2025_lonestar_tx_baseball_club_weston_loftin	6.75	0	1	1	1	0	0	0	0	2.2	4	2	2	0	1	1	0	0	0	0	0	0	0	320	2025	26	\N	\N	11	0.364
710	1920	2025_lonestar_tx_baseball_club_colton_campbell	7.71	0	1	1	1	0	0	0	0	2.1	4	2	2	1	2	1	0	0	0	0	0	0	0	320	2025	14	\N	\N	10	0.400
711	1921	2025_lonestar_tx_baseball_club_jackson_sexton	0.00	0	0	2	0	0	0	0	0	2.0	1	0	0	1	3	0	0	0	0	0	0	0	0	320	2025	28	\N	\N	7	0.143
712	1922	2025_lonestar_tx_baseball_club_brayden_bouchey	0.00	0	0	1	0	0	0	0	0	1.0	2	0	0	0	0	0	0	0	0	0	0	0	0	320	2025	4	\N	\N	5	0.400
713	1923	2025_lonestar_tx_baseball_club_thomas_arredondo	0.00	0	0	1	0	0	0	0	0	1.0	0	0	0	0	0	0	0	0	0	0	0	0	0	320	2025	16	\N	\N	3	0.000
714	1924	2025_lonestar_tx_baseball_club_cooper_cox	13.50	0	0	2	0	0	0	0	0	2.0	4	3	3	0	2	0	0	0	0	0	0	0	0	320	2025	22	\N	\N	10	0.400
715	1925	2025_lonestar_tx_baseball_club_brayden_benitez	18.00	0	0	2	0	0	0	0	0	1.0	2	2	2	2	0	0	0	0	0	0	0	0	0	320	2025	29	\N	\N	5	0.400
716	1936	2025_dodge_city_as_jordan_sicking	2.08	0	1	1	1	0	0	0	0	4.1	1	1	1	2	5	0	0	0	0	0	0	0	1	232	2025	18	\N	\N	14	0.071
717	1937	2025_dodge_city_as_nathaniel_lehr	7.71	0	1	1	1	0	0	0	0	2.1	4	2	2	0	0	0	0	0	0	0	0	0	0	232	2025	8	\N	\N	10	0.400
718	1938	2025_dodge_city_as_reid_turner	8.44	0	1	1	1	0	0	0	0	5.1	9	6	5	2	2	1	0	0	0	0	0	2	0	232	2025	5	\N	\N	24	0.375
719	1939	2025_dodge_city_as_rhett_meisner	9.00	0	1	1	1	0	0	0	0	4.0	7	5	4	1	2	1	0	0	0	0	0	0	0	232	2025	11	\N	\N	18	0.389
720	1940	2025_dodge_city_as_colton_koelzer	0.00	0	0	1	0	0	0	0	0	1.0	1	0	0	0	0	1	0	0	0	0	0	0	0	232	2025	21	\N	\N	4	0.250
721	1941	2025_dodge_city_as_jake_rein	0.00	0	0	1	0	0	0	0	0	1.0	2	0	0	0	0	1	0	0	0	0	0	0	0	232	2025	30	\N	\N	5	0.400
722	1942	2025_dodge_city_as_seth_rowan	6.75	0	0	2	0	0	0	0	0	1.1	1	1	1	1	1	0	0	0	0	0	0	0	0	232	2025	1	\N	\N	5	0.200
723	1943	2025_dodge_city_as_brody_beetch	13.50	0	0	2	0	0	0	0	0	2.0	3	3	3	2	1	1	0	0	0	0	0	0	0	232	2025	16	\N	\N	9	0.333
724	1944	2025_dodge_city_as_devin_hoch	27.00	0	0	1	0	0	0	0	0	1.0	3	3	3	1	1	0	0	0	1	0	0	0	0	232	2025	23	\N	\N	6	0.500
725	1955	2025_btl_hornets_kendyn_good	4.76	0	1	1	1	0	0	0	0	5.2	9	4	3	1	3	2	0	0	0	0	0	1	0	185	2025	6	\N	\N	24	0.375
726	1956	2025_btl_hornets_ethan_warren	5.40	0	1	1	1	0	0	0	0	5.0	7	3	3	0	2	1	0	0	0	0	0	0	0	185	2025	15	\N	\N	21	0.333
727	1957	2025_btl_hornets_colby_brandt	6.00	0	1	1	1	0	0	0	0	3.0	5	3	2	1	1	1	0	0	0	0	0	1	0	185	2025	11	\N	\N	13	0.385
728	1958	2025_btl_hornets_cade_olson	7.71	0	1	1	1	0	0	0	0	2.1	3	2	2	2	2	0	0	0	0	0	0	0	0	185	2025	24	\N	\N	9	0.333
729	1959	2025_btl_hornets_braxton_gann	0.00	0	0	1	0	0	0	0	0	1.0	1	0	0	1	0	0	0	0	0	0	0	0	0	185	2025	10	\N	\N	4	0.250
730	1960	2025_btl_hornets_trevin_williams	0.00	0	0	1	0	0	0	0	0	1.0	1	0	0	0	0	0	0	0	0	0	0	0	0	185	2025	27	\N	\N	4	0.250
731	1961	2025_btl_hornets_caleb_goracke	9.00	0	0	2	0	0	0	0	0	2.0	3	2	2	1	3	0	0	0	0	0	0	0	0	185	2025	14	\N	\N	9	0.333
732	1962	2025_btl_hornets_trey_nusz	13.50	0	0	2	0	0	0	0	0	2.0	3	3	3	2	1	1	0	0	1	0	0	0	0	185	2025	20	\N	\N	9	0.333
733	1963	2025_btl_hornets_tyson_doyle	54.00	0	0	1	0	0	0	0	0	0.1	2	2	2	1	0	1	0	0	0	0	0	0	0	185	2025	23	\N	\N	3	0.667
734	1974	2025_mvp_oklahoma_brayton_bingham	1.29	0	1	1	1	0	0	0	0	7.0	3	1	1	1	8	0	0	0	0	0	0	0	0	189	2025	4	\N	\N	25	0.120
735	1975	2025_mvp_oklahoma_dilan_lopez	2.57	0	1	1	1	0	0	0	0	7.0	6	2	2	0	5	0	0	0	1	0	0	0	0	189	2025	22	\N	\N	26	0.231
736	1976	2025_mvp_oklahoma_hayden_harmon	4.15	0	1	1	1	0	0	0	0	4.1	6	3	2	2	3	1	0	0	0	0	0	0	0	189	2025	27	\N	\N	18	0.333
737	1977	2025_mvp_oklahoma_matthew_robison	10.50	0	1	1	1	0	0	0	0	3.0	6	4	3	1	2	1	0	0	1	0	0	1	1	189	2025	13	\N	\N	15	0.400
738	1978	2025_mvp_oklahoma_cale_stotts	0.00	0	0	1	0	0	0	0	0	2.0	1	0	0	0	3	0	0	0	0	0	0	0	0	189	2025	23	\N	\N	7	0.143
739	1979	2025_mvp_oklahoma_brodie_elliott	0.00	0	0	1	0	0	0	0	0	1.0	0	0	0	0	2	0	0	0	0	0	0	0	0	189	2025	5	\N	\N	3	0.000
740	1980	2025_mvp_oklahoma_justin_chavez	6.00	0	0	2	0	0	0	0	0	3.0	4	2	2	1	2	0	0	0	0	0	0	0	0	189	2025	15	\N	\N	13	0.308
741	1981	2025_mvp_oklahoma_tyler_lindley	9.00	0	0	2	0	0	0	0	0	2.0	3	2	2	1	1	1	0	0	0	0	0	0	0	189	2025	20	\N	\N	9	0.333
742	1982	2025_mvp_oklahoma_jayce_jones	13.50	0	0	2	0	0	0	0	0	2.0	4	3	3	0	1	0	0	0	1	0	0	0	0	189	2025	14	\N	\N	10	0.400
743	1993	2025_gpx_tx_legends_kyler_barnes	2.08	0	1	1	1	0	0	0	0	4.1	3	1	1	2	4	1	0	0	0	1	0	0	0	315	2025	15	\N	\N	16	0.188
744	1994	2025_gpx_tx_legends_bo_burrow	4.76	0	1	1	1	0	0	0	0	5.2	6	3	3	1	4	0	0	0	0	0	0	0	0	315	2025	4	\N	\N	22	0.273
745	1995	2025_gpx_tx_legends_justin_davis	6.75	0	1	1	1	0	0	0	0	2.2	5	2	2	0	2	1	0	0	0	0	0	0	0	315	2025	23	\N	\N	12	0.417
746	1996	2025_gpx_tx_legends_ryker_chaney	10.80	0	1	1	1	0	0	0	0	3.1	8	5	4	0	2	2	0	0	0	0	0	1	0	315	2025	5	\N	\N	17	0.471
747	1997	2025_gpx_tx_legends_case_roebuck	0.00	0	0	1	0	0	0	0	0	1.0	0	0	0	1	1	0	0	0	0	0	0	0	0	315	2025	25	\N	\N	3	0.000
748	1998	2025_gpx_tx_legends_connor_oneal	0.00	0	0	1	0	0	0	0	0	1.0	0	0	0	0	1	0	0	0	0	0	0	0	0	315	2025	20	\N	\N	3	0.000
749	1999	2025_gpx_tx_legends_marcus_holguin	9.00	0	0	2	0	0	0	0	0	2.0	4	2	2	0	1	0	0	0	0	0	0	0	0	315	2025	10	\N	\N	10	0.400
750	2000	2025_gpx_tx_legends_easton_dowell	13.50	0	0	2	0	0	0	0	0	2.0	5	3	3	1	3	2	0	0	0	0	0	0	0	315	2025	14	\N	\N	10	0.500
751	2001	2025_gpx_tx_legends_cristian_lopez	27.00	0	0	2	0	0	0	0	0	1.0	4	3	3	0	0	2	0	0	0	0	0	0	0	315	2025	17	\N	\N	7	0.571
\.


--
-- Name: batting_stats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nbc_admin
--

SELECT pg_catalog.setval('public.batting_stats_id_seq', 1586, true);


--
-- Name: pitching_stats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nbc_admin
--

SELECT pg_catalog.setval('public.pitching_stats_id_seq', 751, true);


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
-- Name: batting_stats_player_team_year_uq; Type: INDEX; Schema: public; Owner: nbc_admin
--

CREATE UNIQUE INDEX batting_stats_player_team_year_uq ON public.batting_stats USING btree (player_id, team_id, year);


--
-- Name: pitching_stats_player_team_year_uq; Type: INDEX; Schema: public; Owner: nbc_admin
--

CREATE UNIQUE INDEX pitching_stats_player_team_year_uq ON public.pitching_stats USING btree (player_id, team_id, year);


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
-- PostgreSQL database dump complete
--

\unrestrict mr0zi0FfWfujYwMQagmeRUFlb6n6F8EednVXOfAlTv40C25bIB12QFH6CJV0FZx

