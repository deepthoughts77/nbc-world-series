// frontend/src/pages/Home.js
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Trophy,
  Users,
  Star,
  Calendar,
  Search,
  Award,
  Medal,
  ChevronRight,
  AlertCircle,
  BookOpen,
  Archive,
} from "lucide-react";
import { API } from "../api/apiClient";
import { fmt } from "../utils/formatters";
import { useHome } from "../hooks/useHome";
import { Container } from "../components/common/Container";
import { BannerError } from "../components/common/BannerError";
import SearchResults from "../components/SearchResults";

const NEXT_TOURNAMENT = { year: 2026, dates: "July 23 – August 1" };

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap');

  :root {
    --navy:       #0a1628;
    --navy-mid:   #122040;
    --navy-light: #1a2f55;
    --gold:       #c9973a;
    --gold-light: #e3b55a;
    --gold-pale:  #f5e6c8;
    --parchment:  #f7f3eb;
    --cream:      #faf8f3;
    --ink:        #1a1a2e;
    --ink-mid:    #2d2d42;
    --ink-soft:   #5a5a72;
    --rule:       #d4c9b0;
    --rule-light: #ede6d6;
    --red-accent: #8b1a1a;
  }

  .hp { font-family: 'Libre Baskerville', Georgia, serif; background: var(--cream); color: var(--ink); }

  /* ── Masthead ── */
  .hp-masthead {
    background: var(--navy);
    border-bottom: 3px solid var(--gold);
    position: relative;
    overflow: hidden;
  }
  .hp-masthead::before {
    content: '';
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(201,151,58,0.05) 39px, rgba(201,151,58,0.05) 40px),
      repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(201,151,58,0.03) 59px, rgba(201,151,58,0.03) 60px);
  }

  /* ── Typography ── */
  .hp-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68rem; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--gold-light); opacity: 0.9;
  }
  .hp-headline {
    font-family: 'Playfair Display', Georgia, serif;
    font-weight: 900; line-height: 1.0; letter-spacing: -0.03em; color: white;
  }
  .hp-headline-gold { color: var(--gold-light); font-style: italic; }
  .hp-sub {
    font-family: 'Libre Baskerville', Georgia, serif;
    font-style: italic; color: rgba(255,255,255,0.5);
    font-size: 1.05rem; line-height: 1.75;
  }

  /* ── Ornamental rule ── */
  .hp-rule-ornate { display: flex; align-items: center; gap: 12px; }
  .hp-rule-ornate::before,
  .hp-rule-ornate::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0.35;
  }
  .hp-rule-ornate-inner {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem; letter-spacing: 0.16em;
    color: var(--gold-light); opacity: 0.85;
    text-transform: uppercase; white-space: nowrap;
  }

  /* ── Medallion stats ── */
  .hp-medallion {
    border: 1px solid rgba(201,151,58,0.2);
    background: rgba(255,255,255,0.04);
    padding: 16px 22px;
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
    transition: background 0.2s;
  }
  .hp-medallion:hover { background: rgba(255,255,255,0.07); }
  .hp-medallion-val {
    font-family: 'Playfair Display', serif;
    font-size: 2rem; font-weight: 900; color: white; line-height: 1;
  }
  .hp-medallion-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.12em;
    text-transform: uppercase; color: rgba(255,255,255,0.55); margin-top: 4px;
  }

  /* ── Hero CTA buttons ── */
  .hp-btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--gold); color: var(--navy);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
    padding: 15px 32px; text-decoration: none; transition: all 0.2s;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  }
  .hp-btn-primary:hover { background: var(--gold-light); transform: translateY(-1px); }

  .hp-btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    border: 1px solid rgba(255,255,255,0.22); color: rgba(255,255,255,0.75);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 15px 32px; text-decoration: none; transition: all 0.2s;
    background: rgba(255,255,255,0.05);
  }
  .hp-btn-ghost:hover { background: rgba(255,255,255,0.12); color: white; border-color: rgba(255,255,255,0.4); }

  /* ── Search section (improved from v2) ── */
  .hp-search-wrap {
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 24px rgba(10,22,40,0.10), 0 1px 4px rgba(10,22,40,0.06);
    overflow: hidden;
    border: 1px solid var(--rule);
  }
  .hp-search-input {
    font-family: 'Libre Baskerville', Georgia, serif;
    font-size: 0.95rem;
    background: transparent; border: none;
    padding: 16px 40px 16px 48px;
    color: var(--ink); outline: none; width: 100%;
  }
  .hp-search-input::placeholder { color: var(--ink-soft); opacity: 0.65; }
  .hp-search-btn {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
    background: var(--navy); color: white; border: none;
    padding: 16px 28px; cursor: pointer; transition: background 0.2s;
    white-space: nowrap; display: inline-flex; align-items: center; gap: 8px; flex-shrink: 0;
    border-radius: 0 8px 8px 0;
  }
  .hp-search-btn:hover { background: var(--navy-light); }
  .hp-search-btn:disabled { background: var(--ink-soft); cursor: not-allowed; }

  .hp-hint-tag {
    font-family: 'JetBrains Mono', monospace; font-size: 0.62rem; letter-spacing: 0.07em;
    padding: 5px 12px; border-radius: 20px;
    border: 1px solid var(--rule); background: white; color: var(--ink-soft);
    cursor: pointer; transition: all 0.15s;
  }
  .hp-hint-tag:hover { background: var(--parchment); color: var(--ink); border-color: var(--gold); }

  /* ── Stat cards ── */
  .hp-stat-card {
    background: white; border: 1px solid var(--rule-light);
    border-top: 3px solid var(--gold); padding: 24px;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .hp-stat-card:hover { box-shadow: 0 6px 24px rgba(10,22,40,0.08); transform: translateY(-2px); }
  .hp-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 2.8rem; font-weight: 900; color: var(--navy);
    line-height: 1; letter-spacing: -0.03em;
  }
  .hp-stat-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.58rem; letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--ink-soft); margin-top: 7px;
  }
  .hp-stat-sub {
    font-family: 'Libre Baskerville', serif; font-style: italic;
    font-size: 0.79rem; color: var(--ink-soft); margin-top: 3px;
  }

  /* ── Champion cards (v1 style, cleaner button) ── */
  .hp-champ-card {
    background: white; border: 1px solid var(--rule-light);
    overflow: hidden; transition: transform 0.2s, box-shadow 0.2s;
  }
  .hp-champ-card:hover { transform: translateY(-5px); box-shadow: 0 20px 56px rgba(10,22,40,0.13); }
  .hp-champ-card-header {
    background: var(--navy); padding: 20px 24px;
    display: flex; align-items: flex-start; justify-content: space-between;
  }
  .hp-champ-year {
    font-family: 'Playfair Display', serif;
    font-size: 2.6rem; font-weight: 900; color: var(--gold-light); line-height: 1;
  }
  .hp-champ-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem; font-weight: 700; color: var(--ink);
    margin-bottom: 4px; line-height: 1.3;
  }
  .hp-champ-meta {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.58rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-soft);
  }
  .hp-champ-detail {
    font-family: 'Libre Baskerville', serif;
    font-size: 0.82rem; color: var(--ink-soft);
    display: flex; align-items: flex-start; gap: 8px; line-height: 1.5;
  }
  /* Cleaner button — flat with subtle border, no clip-path */
  .hp-champ-btn {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    margin-top: 18px; padding: 11px 0;
    background: transparent;
    border: 1.5px solid var(--navy);
    color: var(--navy);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.63rem; letter-spacing: 0.12em; text-transform: uppercase;
    text-decoration: none; transition: all 0.18s; width: 100%;
  }
  .hp-champ-btn:hover { background: var(--navy); color: white; }

  /* ── Quick links ── */
  .hp-quicklink {
    display: flex; align-items: center; gap: 14px; padding: 16px 18px;
    background: white; border: 1px solid var(--rule-light);
    border-left: 3px solid var(--gold);
    text-decoration: none; color: var(--ink); transition: all 0.18s;
  }
  .hp-quicklink:hover { background: var(--parchment); border-left-color: var(--navy); transform: translateX(3px); }
  .hp-quicklink-label {
    font-family: 'Playfair Display', serif; font-weight: 700;
    font-size: 0.95rem; color: var(--ink);
  }
  .hp-quicklink-sub {
    font-family: 'Libre Baskerville', serif; font-style: italic;
    font-size: 0.75rem; color: var(--ink-soft); margin-top: 1px;
  }

  /* ── Section headings ── */
  .hp-section-head {
    font-family: 'Playfair Display', serif;
    font-size: 1.9rem; font-weight: 700; color: var(--navy);
    letter-spacing: -0.01em; line-height: 1.2;
  }
  .hp-section-kicker {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.58rem; letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 8px; display: block;
  }
  .hp-divider { border: none; border-top: 1px solid var(--rule-light); margin: 0; }

  /* ── Legacy numbers ── */
  .hp-legacy-num {
    font-family: 'Playfair Display', serif;
    font-size: 3rem; font-weight: 900; color: var(--gold-light);
    line-height: 1; letter-spacing: -0.03em;
  }
  .hp-legacy-label {
    font-family: 'Libre Baskerville', serif; font-style: italic;
    color: rgba(255,255,255,0.5); font-size: 0.85rem; margin-top: 4px;
  }

  /* ── Animations ── */
  @keyframes hp-fadein {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hp-fadein   { animation: hp-fadein 0.6s ease both; }
  .hp-fadein-2 { animation: hp-fadein 0.6s 0.15s ease both; }
  .hp-fadein-3 { animation: hp-fadein 0.6s 0.3s ease both; }

  @media (max-width: 768px) {
    .hp-section-head { font-size: 1.5rem; }
    .hp-grid-2 { grid-template-columns: 1fr !important; }
  }
`;

export default function Home() {
  const { stats, recent, loading, err } = useHome();
  const [recordsOverview, setRecordsOverview] = useState(null);
  const [recordsErr, setRecordsErr] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    let stop = false;
    API.get("/records/overview")
      .then((r) => {
        if (!stop) setRecordsOverview(r.data);
      })
      .catch(() => {
        if (!stop) setRecordsErr("Could not load records.");
      });
    return () => {
      stop = true;
    };
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchError("");
    setSearchResults(null);
    try {
      const r = await API.post("/search/ask", { question: searchQuery });
      setSearchResults(r?.data ?? {});
    } catch {
      setSearchError("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const mostChampsCount =
    recordsOverview?.most_championships?.championships != null
      ? `${recordsOverview.most_championships.championships}×`
      : null;
  const mostChampsName = recordsOverview?.most_championships?.name ?? null;

  const W = { maxWidth: 1280, margin: "0 auto", padding: "0 32px" };

  return (
    <div className="hp">
      <style>{STYLES}</style>

      {/* ══════════════════════════════════════════════════════════════
          MASTHEAD — archival record-book style (from v1)
          with improved spacing (from v2 feedback)
      ══════════════════════════════════════════════════════════════ */}
      <section className="hp-masthead">
        <div
          style={{
            ...W,
            padding: "72px 32px 64px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Top ornamental rule */}
          <div
            className="hp-rule-ornate hp-fadein"
            style={{ marginBottom: 36 }}
          >
            <span className="hp-rule-ornate-inner">
              Wichita, Kansas · Est. 1935 · National Baseball Congress
            </span>
          </div>

          {/* Title */}
          <div className="hp-fadein" style={{ maxWidth: 780 }}>
            <p className="hp-eyebrow" style={{ marginBottom: 16 }}>
              Official Historical Archive · Wichita State University Libraries
              Special Collections
            </p>
            <h1
              className="hp-headline"
              style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", marginBottom: 22 }}
            >
              NBC World Series
              <br />
              <span className="hp-headline-gold">Record Book</span>
            </h1>
            <p className="hp-sub" style={{ maxWidth: 520, marginBottom: 44 }}>
              Nine decades of amateur baseball history — championships,
              statistics, and player records preserved for future generations.
            </p>

            {/* CTAs — cleaner spacing from v2 feedback */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 14,
                marginBottom: 60,
              }}
            >
              <NavLink to="/championships" className="hp-btn-primary">
                <Trophy size={15} /> Championship History
              </NavLink>
              <NavLink to="/archives" className="hp-btn-ghost">
                <Archive size={15} /> Document Archive
              </NavLink>
            </div>
          </div>

          {/* Medallion stats */}
          <div
            className="hp-fadein-2"
            style={{ display: "flex", flexWrap: "wrap", gap: 10 }}
          >
            {[
              {
                val: fmt(stats?.total_championships ?? 91),
                label: "Championships Awarded",
              },
              { val: "1935", label: "Founded" },
              {
                val: fmt(stats?.total_teams || "400+"),
                label: "Organizations",
              },
              { val: "800+", label: "MLB Alumni" },
              {
                val: `${NEXT_TOURNAMENT.dates}, ${NEXT_TOURNAMENT.year}`,
                label: "Next Tournament",
              },
            ].map(({ val, label }) => (
              <div key={label} className="hp-medallion">
                <div className="hp-medallion-val">{val}</div>
                <div className="hp-medallion-label">{label}</div>
              </div>
            ))}
          </div>

          {/* Bottom ornamental rule */}
          <div className="hp-rule-ornate hp-fadein-3" style={{ marginTop: 44 }}>
            <span className="hp-rule-ornate-inner">
              America's Premier Amateur Baseball Tournament
            </span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SEARCH — improved modern readability (from v2 feedback)
          Rounded card, larger input, pill hint tags
      ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "var(--parchment)",
          borderBottom: "2px solid var(--rule)",
          padding: "52px 0",
        }}
      >
        <div style={{ ...W, position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <span className="hp-section-kicker">Tournament Database</span>
              <h2 className="hp-section-head">Search Championship History</h2>
              <p
                style={{
                  fontFamily: "'Libre Baskerville', serif",
                  fontStyle: "italic",
                  color: "var(--ink-soft)",
                  fontSize: "0.88rem",
                  marginTop: 10,
                }}
              >
                Query 91 years of records, player stats, and historical
                milestones
              </p>
            </div>

            {/* Rounded search card — more modern from v2 */}
            <div className="hp-search-wrap">
              <form
                onSubmit={handleSearch}
                style={{ display: "flex", alignItems: "stretch" }}
              >
                <div style={{ position: "relative", flex: 1 }}>
                  <Search
                    size={16}
                    style={{
                      position: "absolute",
                      left: 16,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--ink-soft)",
                      pointerEvents: "none",
                    }}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (!e.target.value.trim()) {
                        setSearchResults(null);
                        setSearchError("");
                      }
                    }}
                    placeholder="Who won the 1947 championship? Who holds the strikeout record?…"
                    className="hp-search-input"
                    disabled={searching}
                  />
                  {/* X button to clear results */}
                  {(searchQuery || searchResults) && !searching && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSearchResults(null);
                        setSearchError("");
                      }}
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--ink-soft)",
                        padding: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        opacity: 0.6,
                      }}
                      title="Clear search"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 1L13 13M13 1L1 13"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={searching || !searchQuery.trim()}
                  className="hp-search-btn"
                >
                  {searching ? (
                    <>
                      <div
                        style={{
                          width: 13,
                          height: 13,
                          border: "2px solid rgba(255,255,255,0.35)",
                          borderTopColor: "white",
                          borderRadius: "50%",
                          animation: "spin 0.7s linear infinite",
                        }}
                      />
                      Searching
                    </>
                  ) : (
                    <>
                      <Search size={13} />
                      Search
                    </>
                  )}
                </button>
              </form>

              {(searchError || searchResults) && (
                <div style={{ padding: "0 20px 20px" }}>
                  {searchError && (
                    <div
                      style={{
                        marginTop: 14,
                        padding: "10px 14px",
                        background: "#fef2f2",
                        border: "1px solid #fecaca",
                        borderRadius: 6,
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start",
                      }}
                    >
                      <AlertCircle
                        size={15}
                        style={{
                          color: "#dc2626",
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      />
                      <p
                        style={{
                          fontSize: "0.84rem",
                          color: "#dc2626",
                          margin: 0,
                        }}
                      >
                        {searchError}
                      </p>
                    </div>
                  )}
                  {searchResults && (
                    <SearchResults searchResults={searchResults} />
                  )}
                </div>
              )}
            </div>

            {/* Pill hint tags — click to instantly run that search */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 16,
                justifyContent: "center",
              }}
            >
              {[
                "Who won the most championships?",
                "Who won in 1947?",
                "Liberal Bee Jays",
                "Santa Barbara Foresters",
                "Most home runs all time",
                "Championship streaks",
              ].map((hint) => (
                <button
                  key={hint}
                  className="hp-hint-tag"
                  onClick={async () => {
                    setSearchQuery(hint);
                    setSearching(true);
                    setSearchError("");
                    setSearchResults(null);
                    try {
                      const r = await API.post("/search/ask", {
                        question: hint,
                      });
                      setSearchResults(r?.data ?? {});
                    } catch {
                      setSearchError("Search failed. Please try again.");
                    } finally {
                      setSearching(false);
                    }
                  }}
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          STATS RAIL
      ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "var(--cream)",
          padding: "52px 0",
          borderBottom: "1px solid var(--rule-light)",
        }}
      >
        <div style={W}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 14,
            }}
          >
            {loading
              ? [1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{
                      height: 110,
                      background: "var(--rule-light)",
                      borderRadius: 2,
                    }}
                  />
                ))
              : [
                  {
                    num: fmt(stats?.total_championships ?? 0),
                    label: "Championships",
                    sub: "1935 – 2025",
                  },
                  {
                    num: fmt(stats?.total_teams || 0),
                    label: "Participating Teams",
                    sub: "From across America",
                  },
                  {
                    num: "800+",
                    label: "MLB Alumni",
                    sub: "Started their careers here",
                  },
                  {
                    num: mostChampsCount ?? "—",
                    label: "Most Championships",
                    sub: mostChampsName ?? "—",
                  },
                ].map(({ num, label, sub }) => (
                  <div key={label} className="hp-stat-card">
                    <div className="hp-stat-num">{num}</div>
                    <div className="hp-stat-label">{label}</div>
                    <div className="hp-stat-sub">{sub}</div>
                  </div>
                ))}
          </div>
          {(err || recordsErr) && (
            <div style={{ marginTop: 18 }}>
              <BannerError message={err || recordsErr} />
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          RECENT CHAMPIONS — v1 cards with cleaner button (from feedback)
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ background: "var(--parchment)", padding: "64px 0" }}>
        <div style={W}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 28,
            }}
          >
            <div>
              <span className="hp-section-kicker">Latest Winners</span>
              <h2 className="hp-section-head">Recent Champions</h2>
            </div>
            <NavLink
              to="/championships"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.63rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--navy)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 4,
                borderBottom: "1px solid var(--gold)",
                paddingBottom: 2,
              }}
            >
              Full History <ChevronRight size={12} />
            </NavLink>
          </div>
          <hr className="hp-divider" style={{ marginBottom: 28 }} />

          {loading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 18,
              }}
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{ height: 300, background: "var(--rule-light)" }}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 18,
              }}
            >
              {recent.map((r, idx) => {
                const mvpLabel =
                  Array.isArray(r.mvp_names) && r.mvp_names.length > 0
                    ? r.mvp_names.join(" & ")
                    : r.mvp || null;
                return (
                  <div key={r.year} className="hp-champ-card">
                    {/* Dark navy header — v1 style */}
                    <div className="hp-champ-card-header">
                      <div>
                        <div
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.54rem",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            color: "rgba(201,151,58,0.6)",
                            marginBottom: 6,
                          }}
                        >
                          {idx === 0
                            ? "Reigning Champion"
                            : `${r.year} Champion`}
                        </div>
                        <div className="hp-champ-year">{r.year}</div>
                      </div>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          background: "rgba(201,151,58,0.12)",
                          border: "1px solid rgba(201,151,58,0.25)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Trophy
                          size={18}
                          style={{ color: "var(--gold-light)" }}
                        />
                      </div>
                    </div>

                    {/* Body */}
                    <div style={{ padding: "18px 22px 22px" }}>
                      <div className="hp-champ-name">
                        {r.champion_name || r.champion}
                      </div>
                      {(r.champion_city || r.city) && (
                        <div
                          className="hp-champ-meta"
                          style={{ marginBottom: 14 }}
                        >
                          {r.champion_city || r.city},{" "}
                          {r.champion_state || r.state}
                        </div>
                      )}
                      <hr className="hp-divider" style={{ marginBottom: 13 }} />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        {(r.runner_up_name || r.runner_up) && (
                          <div className="hp-champ-detail">
                            <Medal
                              size={12}
                              style={{
                                color: "var(--ink-soft)",
                                flexShrink: 0,
                                marginTop: 2,
                              }}
                            />
                            <span>
                              <span
                                style={{
                                  fontFamily: "'JetBrains Mono', monospace",
                                  fontSize: "0.55rem",
                                  letterSpacing: "0.1em",
                                  textTransform: "uppercase",
                                }}
                              >
                                Runner-up ·{" "}
                              </span>
                              {r.runner_up_name || r.runner_up}
                            </span>
                          </div>
                        )}
                        {mvpLabel && (
                          <div className="hp-champ-detail">
                            <Award
                              size={12}
                              style={{
                                color: "var(--gold)",
                                flexShrink: 0,
                                marginTop: 2,
                              }}
                            />
                            <span>
                              <span
                                style={{
                                  fontFamily: "'JetBrains Mono', monospace",
                                  fontSize: "0.55rem",
                                  letterSpacing: "0.1em",
                                  textTransform: "uppercase",
                                }}
                              >
                                MVP ·{" "}
                              </span>
                              {mvpLabel}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Cleaner outlined button — improvement from feedback */}
                      <NavLink
                        to={`/championships/${r.year}`}
                        className="hp-champ-btn"
                      >
                        View Full Record <ChevronRight size={11} />
                      </NavLink>
                    </div>
                  </div>
                );
              })}
              {!recent.length && (
                <p
                  style={{
                    gridColumn: "1/-1",
                    textAlign: "center",
                    color: "var(--ink-soft)",
                    fontStyle: "italic",
                    padding: "40px 0",
                  }}
                >
                  No recent results available.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          QUICK LINKS + ABOUT
      ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "white",
          padding: "64px 0",
          borderTop: "1px solid var(--rule-light)",
        }}
      >
        <div style={W}>
          <div
            className="hp-grid-2"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 56,
              alignItems: "start",
            }}
          >
            {/* Quick links */}
            <div>
              <span className="hp-section-kicker">Explore the Archive</span>
              <h2 className="hp-section-head" style={{ marginBottom: 22 }}>
                What Are You Looking For?
              </h2>
              <hr className="hp-divider" style={{ marginBottom: 22 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {[
                  {
                    to: "/hall-of-fame",
                    icon: <Star size={17} style={{ color: "var(--gold)" }} />,
                    label: "Hall of Fame",
                    sub: "141 inductees · Players, managers & contributors",
                  },
                  {
                    to: "/player-stats",
                    icon: <Award size={17} style={{ color: "var(--navy)" }} />,
                    label: "Player Statistics",
                    sub: "Batting & pitching records · 2000–2025",
                  },
                  {
                    to: "/head-to-head",
                    icon: (
                      <Trophy
                        size={17}
                        style={{ color: "var(--red-accent)" }}
                      />
                    ),
                    label: "Head-to-Head Records",
                    sub: "All-time matchup records between any two teams",
                  },
                  {
                    to: "/archives",
                    icon: (
                      <BookOpen size={17} style={{ color: "var(--gold)" }} />
                    ),
                    label: "Document Archive",
                    sub: "Scanned annuals & programs · 1935–present",
                  },
                  {
                    to: "/document-search",
                    icon: <Search size={17} style={{ color: "var(--navy)" }} />,
                    label: "Search Documents",
                    sub: "Full-text search across all scanned materials",
                  },
                  {
                    to: "/records",
                    icon: (
                      <Archive size={17} style={{ color: "var(--ink-soft)" }} />
                    ),
                    label: "Records & Milestones",
                    sub: "No-hitters, home run leaders & all-time bests",
                  },
                ].map(({ to, icon, label, sub }) => (
                  <NavLink key={to} to={to} className="hp-quicklink">
                    <div style={{ flexShrink: 0 }}>{icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="hp-quicklink-label">{label}</div>
                      <div className="hp-quicklink-sub">{sub}</div>
                    </div>
                    <ChevronRight
                      size={13}
                      style={{ color: "var(--rule)", flexShrink: 0 }}
                    />
                  </NavLink>
                ))}
              </div>
            </div>

            {/* About + legacy */}
            <div>
              <span className="hp-section-kicker">Tournament Information</span>
              <h2 className="hp-section-head" style={{ marginBottom: 22 }}>
                About the NBC World Series
              </h2>
              <hr className="hp-divider" style={{ marginBottom: 22 }} />

              <p
                style={{
                  fontFamily: "'Libre Baskerville', serif",
                  fontSize: "0.9rem",
                  lineHeight: 1.9,
                  color: "var(--ink-mid)",
                  marginBottom: 26,
                }}
              >
                The National Baseball Congress World Series is America's premier
                amateur baseball tournament, held annually in Wichita, Kansas
                since 1935. Over nine decades it has served as a proving ground
                for future Major League talent and a celebration of the amateur
                game at its finest.
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                  marginBottom: 28,
                }}
              >
                {[
                  {
                    icon: (
                      <Calendar size={15} style={{ color: "var(--gold)" }} />
                    ),
                    label: "Next Tournament",
                    val: `${NEXT_TOURNAMENT.dates}, ${NEXT_TOURNAMENT.year}`,
                  },
                  {
                    icon: <Users size={15} style={{ color: "var(--gold)" }} />,
                    label: "Format",
                    val: "16 teams · Pool play + single elimination",
                  },
                  {
                    icon: <Trophy size={15} style={{ color: "var(--gold)" }} />,
                    label: "Duration",
                    val: "10 days of championship baseball",
                  },
                  {
                    icon: <Star size={15} style={{ color: "var(--gold)" }} />,
                    label: "Notable Alumni",
                    val: "Satchel Paige · Barry Bonds · Roger Clemens",
                  },
                ].map(({ icon, label, val }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      gap: 14,
                      alignItems: "flex-start",
                      padding: "14px 0",
                      borderBottom: "1px solid var(--rule-light)",
                    }}
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        background: "var(--parchment)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      {icon}
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.57rem",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "var(--ink-soft)",
                          marginBottom: 3,
                        }}
                      >
                        {label}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Libre Baskerville', serif",
                          fontSize: "0.87rem",
                          color: "var(--ink-mid)",
                        }}
                      >
                        {val}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  background: "var(--navy)",
                  padding: "24px 26px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 22,
                }}
              >
                {[
                  { num: "800+", label: "MLB alumni developed" },
                  { num: "45,000+", label: "Fans attend annually" },
                  { num: "90+", label: "Years of continuous play" },
                  { num: "141", label: "Hall of Fame inductees" },
                ].map(({ num, label }) => (
                  <div key={label}>
                    <div className="hp-legacy-num">{num}</div>
                    <div className="hp-legacy-label">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        style={{
          background: "var(--navy)",
          padding: "18px 32px",
          borderTop: "1px solid rgba(201,151,58,0.25)",
        }}
      >
        <div style={W}>
          <div className="hp-rule-ornate">
            <span className="hp-rule-ornate-inner">
              National Baseball Congress World Series · Historical Archive ·
              Wichita State University Libraries Special Collections
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
