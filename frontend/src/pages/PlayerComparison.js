// frontend/src/pages/PlayerComparison.js
//
// Route: /compare
// Allows selecting two players and comparing their NBC career stats side by side.
// Data: GET /api/players/:id (same endpoint used by PlayerProfile)

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, X, ArrowLeftRight, User, TrendingUp } from "lucide-react";
import { API } from "../api";
import { Container } from "../components/common/Container";

// ── Formatters ────────────────────────────────────────────────────────────
const fmtAvg = (v) => {
  if (v === null || v === undefined || v === "") return ".000";
  const n = parseFloat(v);
  if (isNaN(n)) return ".000";
  return n.toFixed(3).replace(/^0\./, ".");
};
const fmtEra = (v) => {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "string" && v.toLowerCase().includes("inf")) return "∞";
  const n = parseFloat(v);
  return isNaN(n) ? "—" : n.toFixed(2);
};
const safeDisplay = (v, fallback = "—") =>
  v === null || v === undefined || v === "" ? fallback : v;

// ── Player search autocomplete ────────────────────────────────────────────
function PlayerSearchBox({ label, player, onSelect, onClear, accentColor }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const debounce = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = useCallback((q) => {
    setQuery(q);
    clearTimeout(debounce.current);
    if (q.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    debounce.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await API.get("/players/search", { params: { q } });
        setResults(Array.isArray(res.data) ? res.data : []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  const handleSelect = useCallback(
    async (p) => {
      setQuery("");
      setResults([]);
      setOpen(false);
      try {
        const res = await API.get(`/players/${p.id}`);
        onSelect(res.data);
      } catch (e) {
        console.error("Failed to load player", e);
      }
    },
    [onSelect],
  );

  if (player) {
    const hasBatting = player.batting?.stats?.length > 0;
    const hasPitching = player.pitching?.stats?.length > 0;
    const cb = player.batting?.career;
    const cp = player.pitching?.career;
    const playerId = player.player?.id;

    return (
      <div
        style={{
          background: "#FFFFFF",
          border: `2px solid ${accentColor}`,
          borderRadius: 12,
          overflow: "hidden",
          flex: 1,
        }}
      >
        {/* Player header */}
        <div
          style={{
            background: accentColor,
            padding: "20px 20px 16px",
            position: "relative",
          }}
        >
          <button
            onClick={onClear}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "rgba(255,255,255,0.2)",
              border: "none",
              borderRadius: "50%",
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#FFFFFF",
            }}
          >
            <X size={14} />
          </button>

          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 900,
              color: "#FFFFFF",
              marginBottom: 10,
            }}
          >
            {(player.player.firstName?.[0] || "?").toUpperCase()}
          </div>

          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.7)",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            {label}
          </div>

          {/* Clickable player name */}
          {playerId ? (
            <Link
              to={`/players/${playerId}`}
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#FFFFFF",
                lineHeight: 1.2,
                textDecoration: "underline",
                textDecorationColor: "rgba(255,255,255,0.4)",
                display: "block",
              }}
            >
              {player.player.fullName}
            </Link>
          ) : (
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#FFFFFF",
                lineHeight: 1.2,
              }}
            >
              {player.player.fullName}
            </div>
          )}

          {player.player.isHallOfFame && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                marginTop: 6,
                background: "rgba(255,255,255,0.2)",
                borderRadius: 20,
                padding: "2px 10px",
                fontSize: 10,
                fontWeight: 700,
                color: "#FFFFFF",
              }}
            >
              ⭐ Hall of Fame
            </div>
          )}
        </div>

        {/* Quick career stats + View Full Profile link */}
        <div style={{ padding: "14px 20px 16px", background: "#F8FAFC" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {hasBatting &&
              cb &&
              [
                { label: "AVG", value: fmtAvg(cb.career_avg) },
                { label: "HR", value: safeDisplay(cb.total_hr, "0") },
                { label: "RBI", value: safeDisplay(cb.total_rbi, "0") },
                { label: "Seasons", value: safeDisplay(cb.seasons, "0") },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    textAlign: "center",
                    flex: "1 1 60px",
                    background: "#FFFFFF",
                    borderRadius: 8,
                    border: "1px solid #E2E8F0",
                    padding: "8px 6px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: accentColor,
                      fontFamily: "monospace",
                    }}
                  >
                    {value}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#94A3B8",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            {hasPitching &&
              cp &&
              !hasBatting &&
              [
                { label: "ERA", value: fmtEra(cp.career_era) },
                { label: "W", value: safeDisplay(cp.total_w, "0") },
                { label: "SO", value: safeDisplay(cp.total_so, "0") },
                { label: "Seasons", value: safeDisplay(cp.seasons, "0") },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    textAlign: "center",
                    flex: "1 1 60px",
                    background: "#FFFFFF",
                    borderRadius: 8,
                    border: "1px solid #E2E8F0",
                    padding: "8px 6px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: accentColor,
                      fontFamily: "monospace",
                    }}
                  >
                    {value}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#94A3B8",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
          </div>

          {/* View full profile button */}
          {playerId && (
            <Link
              to={`/players/${playerId}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                marginTop: 12,
                fontSize: 11,
                fontWeight: 700,
                color: accentColor,
                textDecoration: "none",
                background: `${accentColor}12`,
                borderRadius: 20,
                padding: "4px 12px",
                border: `1px solid ${accentColor}30`,
              }}
            >
              View Full Profile →
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        background: "#FFFFFF",
        border: `2px dashed ${accentColor}44`,
        borderRadius: 12,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: 180,
      }}
      ref={ref}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: `${accentColor}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
        }}
      >
        <User size={22} color={accentColor} />
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#64748B",
          marginBottom: 12,
        }}
      >
        {label}
      </div>

      <div style={{ position: "relative", width: "100%", maxWidth: 320 }}>
        <Search
          size={14}
          style={{
            position: "absolute",
            left: 10,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#9CA3AF",
            pointerEvents: "none",
          }}
        />
        <input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search player name…"
          style={{
            width: "100%",
            boxSizing: "border-box",
            background: "#F8FAFC",
            border: `1px solid ${accentColor}44`,
            borderRadius: 8,
            fontSize: 13,
            padding: "9px 10px 9px 32px",
            outline: "none",
            color: "#0F172A",
          }}
        />
        {open && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: 8,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              zIndex: 50,
              maxHeight: 240,
              overflowY: "auto",
            }}
          >
            {loading ? (
              <div
                style={{ padding: "12px 14px", fontSize: 12, color: "#94A3B8" }}
              >
                Searching…
              </div>
            ) : results.length === 0 ? (
              <div
                style={{ padding: "12px 14px", fontSize: 12, color: "#94A3B8" }}
              >
                No players found
              </div>
            ) : (
              results.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid #F1F5F9",
                    padding: "10px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#0F172A",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#F8FAFC")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {p.full_name}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Comparison row ────────────────────────────────────────────────────────
function CompareRow({ label, val1, val2, higherIsBetter = true, fmt, tip }) {
  const n1 = parseFloat(val1);
  const n2 = parseFloat(val2);
  const valid = !isNaN(n1) && !isNaN(n2) && (n1 !== 0 || n2 !== 0);

  let p1Wins = false,
    p2Wins = false;
  if (valid) {
    if (higherIsBetter) {
      p1Wins = n1 > n2;
      p2Wins = n2 > n1;
    } else {
      p1Wins = n1 < n2;
      p2Wins = n2 < n1;
    }
  }

  const display = (v) => {
    if (v === null || v === undefined || v === "") return "—";
    if (fmt) return fmt(v);
    return v;
  };

  const barMax = valid ? Math.max(n1, n2) : 1;
  const bar1 = valid ? (n1 / barMax) * 100 : 0;
  const bar2 = valid ? (n2 / barMax) * 100 : 0;

  return (
    <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
      <td
        style={{
          padding: "10px 16px",
          textAlign: "right",
          width: "28%",
          fontWeight: p1Wins ? 800 : 400,
          fontSize: 14,
          color: p1Wins ? "#1D4ED8" : "#374151",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 6,
          }}
        >
          {p1Wins && <TrendingUp size={13} color="#1D4ED8" />}
          {display(val1)}
        </div>
        {valid && (
          <div
            style={{
              height: 3,
              background: "#E2E8F0",
              borderRadius: 2,
              marginTop: 4,
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 2,
                background: p1Wins ? "#1D4ED8" : "#94A3B8",
                width: `${bar1}%`,
                marginLeft: "auto",
                transition: "width 0.4s ease",
              }}
            />
          </div>
        )}
      </td>

      <td
        style={{
          padding: "10px 8px",
          textAlign: "center",
          width: "22%",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: "#94A3B8",
          textTransform: "uppercase",
        }}
        title={tip}
      >
        {label}
      </td>

      <td
        style={{
          padding: "10px 16px",
          textAlign: "left",
          width: "28%",
          fontWeight: p2Wins ? 800 : 400,
          fontSize: 14,
          color: p2Wins ? "#DC2626" : "#374151",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {display(val2)}
          {p2Wins && <TrendingUp size={13} color="#DC2626" />}
        </div>
        {valid && (
          <div
            style={{
              height: 3,
              background: "#E2E8F0",
              borderRadius: 2,
              marginTop: 4,
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 2,
                background: p2Wins ? "#DC2626" : "#94A3B8",
                width: `${bar2}%`,
                transition: "width 0.4s ease",
              }}
            />
          </div>
        )}
      </td>
    </tr>
  );
}

function SectionHeader({ title }) {
  return (
    <tr>
      <td
        colSpan={3}
        style={{
          padding: "14px 16px 8px",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#64748B",
          background: "#F8FAFC",
          borderBottom: "1px solid #E2E8F0",
          borderTop: "2px solid #E2E8F0",
        }}
      >
        {title}
      </td>
    </tr>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function PlayerComparison() {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [activeTab, setActiveTab] = useState("batting");

  const hasBatting1 = player1?.batting?.stats?.length > 0;
  const hasBatting2 = player2?.batting?.stats?.length > 0;
  const hasPitching1 = player1?.pitching?.stats?.length > 0;
  const hasPitching2 = player2?.pitching?.stats?.length > 0;

  const showBatting = hasBatting1 || hasBatting2;
  const showPitching = hasPitching1 || hasPitching2;

  useEffect(() => {
    if (activeTab === "batting" && !showBatting && showPitching)
      setActiveTab("pitching");
    if (activeTab === "pitching" && !showPitching && showBatting)
      setActiveTab("batting");
  }, [showBatting, showPitching, activeTab]);

  const cb1 = player1?.batting?.career;
  const cb2 = player2?.batting?.career;
  const cp1 = player1?.pitching?.career;
  const cp2 = player2?.pitching?.career;

  const bothSelected = player1 && player2;

  const handleSwap = () => {
    const tmp = player1;
    setPlayer1(player2);
    setPlayer2(tmp);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC" }}>
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)",
          borderBottom: "4px solid #1D4ED8",
          paddingTop: 48,
          paddingBottom: 36,
        }}
      >
        <Container>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              color: "#60A5FA",
              fontWeight: 700,
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            NBC World Series · Player Tools
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 8,
            }}
          >
            <h1
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 900,
                color: "#F8FAFC",
                margin: 0,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Player Comparison
            </h1>
            <div
              style={{
                background: "#1D4ED8",
                borderRadius: 20,
                padding: "3px 10px",
                fontSize: 10,
                fontWeight: 700,
                color: "#BFDBFE",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Career Stats
            </div>
          </div>
          <p
            style={{
              fontSize: 14,
              color: "#94A3B8",
              margin: 0,
              lineHeight: 1.7,
            }}
          >
            Select two players to compare their complete NBC World Series career
            statistics side by side.
          </p>
        </Container>
      </div>

      <Container>
        <div style={{ paddingTop: 32, paddingBottom: 64 }}>
          {/* ── Player selectors ─────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "stretch",
              marginBottom: 28,
              flexWrap: "wrap",
            }}
          >
            <PlayerSearchBox
              label="Player 1"
              player={player1}
              onSelect={setPlayer1}
              onClear={() => setPlayer1(null)}
              accentColor="#1D4ED8"
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <button
                onClick={handleSwap}
                disabled={!bothSelected}
                title="Swap players"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: bothSelected ? "#1D4ED8" : "#E2E8F0",
                  border: "none",
                  cursor: bothSelected ? "pointer" : "default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: bothSelected ? "#FFFFFF" : "#94A3B8",
                  transition: "all 0.2s",
                }}
              >
                <ArrowLeftRight size={16} />
              </button>
            </div>
            <PlayerSearchBox
              label="Player 2"
              player={player2}
              onSelect={setPlayer2}
              onClear={() => setPlayer2(null)}
              accentColor="#DC2626"
            />
          </div>

          {/* ── Comparison table ─────────────────────────────────────── */}
          {bothSelected ? (
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              {/* Tab bar */}
              {showBatting && showPitching && (
                <div
                  style={{
                    display: "flex",
                    borderBottom: "2px solid #E2E8F0",
                    background: "#F8FAFC",
                  }}
                >
                  {showBatting && (
                    <button
                      onClick={() => setActiveTab("batting")}
                      style={{
                        flex: 1,
                        padding: "14px 20px",
                        background:
                          activeTab === "batting" ? "#FFFFFF" : "transparent",
                        border: "none",
                        borderBottom:
                          activeTab === "batting"
                            ? "2px solid #1D4ED8"
                            : "2px solid transparent",
                        marginBottom: -2,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                        color: activeTab === "batting" ? "#1D4ED8" : "#64748B",
                      }}
                    >
                      ⚾ Batting
                    </button>
                  )}
                  {showPitching && (
                    <button
                      onClick={() => setActiveTab("pitching")}
                      style={{
                        flex: 1,
                        padding: "14px 20px",
                        background:
                          activeTab === "pitching" ? "#FFFFFF" : "transparent",
                        border: "none",
                        borderBottom:
                          activeTab === "pitching"
                            ? "2px solid #1D4ED8"
                            : "2px solid transparent",
                        marginBottom: -2,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                        color: activeTab === "pitching" ? "#1D4ED8" : "#64748B",
                      }}
                    >
                      🥎 Pitching
                    </button>
                  )}
                </div>
              )}

              {/* Column headers — clickable player names */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto 1fr",
                  background: "#F1F5F9",
                  padding: "12px 16px",
                  borderBottom: "1px solid #E2E8F0",
                }}
              >
                <Link
                  to={`/players/${player1.player.id}`}
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: "#1D4ED8",
                    textAlign: "right",
                    paddingRight: 8,
                    textDecoration: "none",
                  }}
                >
                  {player1.player.fullName} ↗
                </Link>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#94A3B8",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    padding: "0 8px",
                    whiteSpace: "nowrap",
                  }}
                >
                  vs
                </div>
                <Link
                  to={`/players/${player2.player.id}`}
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: "#DC2626",
                    textAlign: "left",
                    paddingLeft: 8,
                    textDecoration: "none",
                  }}
                >
                  ↗ {player2.player.fullName}
                </Link>
              </div>

              {/* Stats table */}
              {activeTab === "batting" && (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    <SectionHeader title="Career Batting Summary" />
                    <CompareRow
                      label="Seasons"
                      val1={cb1?.seasons}
                      val2={cb2?.seasons}
                      tip="Seasons played"
                    />
                    <CompareRow
                      label="Games"
                      val1={cb1?.total_gp}
                      val2={cb2?.total_gp}
                      tip="Games played"
                    />
                    <CompareRow
                      label="AB"
                      val1={cb1?.total_ab}
                      val2={cb2?.total_ab}
                      tip="At Bats"
                    />
                    <CompareRow
                      label="Hits"
                      val1={cb1?.total_h}
                      val2={cb2?.total_h}
                      tip="Total Hits"
                    />
                    <CompareRow
                      label="AVG"
                      val1={cb1?.career_avg}
                      val2={cb2?.career_avg}
                      fmt={fmtAvg}
                      tip="Career Batting Average"
                    />
                    <CompareRow
                      label="OBP"
                      val1={cb1?.career_obp}
                      val2={cb2?.career_obp}
                      fmt={fmtAvg}
                      tip="On-Base Percentage"
                    />
                    <CompareRow
                      label="SLG"
                      val1={cb1?.career_slg}
                      val2={cb2?.career_slg}
                      fmt={fmtAvg}
                      tip="Slugging Percentage"
                    />
                    <SectionHeader title="Power & Production" />
                    <CompareRow
                      label="HR"
                      val1={cb1?.total_hr}
                      val2={cb2?.total_hr}
                      tip="Home Runs"
                    />
                    <CompareRow
                      label="RBI"
                      val1={cb1?.total_rbi}
                      val2={cb2?.total_rbi}
                      tip="Runs Batted In"
                    />
                    <CompareRow
                      label="Runs"
                      val1={cb1?.total_r}
                      val2={cb2?.total_r}
                      tip="Runs Scored"
                    />
                    <CompareRow
                      label="2B"
                      val1={cb1?.total_2b}
                      val2={cb2?.total_2b}
                      tip="Doubles"
                    />
                    <CompareRow
                      label="3B"
                      val1={cb1?.total_3b}
                      val2={cb2?.total_3b}
                      tip="Triples"
                    />
                    <SectionHeader title="Plate Discipline & Speed" />
                    <CompareRow
                      label="BB"
                      val1={cb1?.total_bb}
                      val2={cb2?.total_bb}
                      tip="Walks"
                    />
                    <CompareRow
                      label="SO"
                      val1={cb1?.total_so}
                      val2={cb2?.total_so}
                      higherIsBetter={false}
                      tip="Strikeouts (lower is better)"
                    />
                    <CompareRow
                      label="SB"
                      val1={cb1?.total_sb}
                      val2={cb2?.total_sb}
                      tip="Stolen Bases"
                    />
                  </tbody>
                </table>
              )}

              {activeTab === "pitching" && (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    <SectionHeader title="Career Pitching Summary" />
                    <CompareRow
                      label="Seasons"
                      val1={cp1?.seasons}
                      val2={cp2?.seasons}
                      tip="Seasons pitched"
                    />
                    <CompareRow
                      label="APP"
                      val1={cp1?.total_app}
                      val2={cp2?.total_app}
                      tip="Appearances"
                    />
                    <CompareRow
                      label="ERA"
                      val1={cp1?.career_era}
                      val2={cp2?.career_era}
                      higherIsBetter={false}
                      fmt={fmtEra}
                      tip="Earned Run Average (lower is better)"
                    />
                    <CompareRow
                      label="W"
                      val1={cp1?.total_w}
                      val2={cp2?.total_w}
                      tip="Wins"
                    />
                    <CompareRow
                      label="L"
                      val1={cp1?.total_l}
                      val2={cp2?.total_l}
                      higherIsBetter={false}
                      tip="Losses (lower is better)"
                    />
                    <SectionHeader title="Volume & Control" />
                    <CompareRow
                      label="IP"
                      val1={cp1?.total_ip}
                      val2={cp2?.total_ip}
                      tip="Innings Pitched"
                    />
                    <CompareRow
                      label="SO"
                      val1={cp1?.total_so}
                      val2={cp2?.total_so}
                      tip="Strikeouts"
                    />
                    <CompareRow
                      label="BB"
                      val1={cp1?.total_bb}
                      val2={cp2?.total_bb}
                      higherIsBetter={false}
                      tip="Walks (lower is better)"
                    />
                    <CompareRow
                      label="H"
                      val1={cp1?.total_h}
                      val2={cp2?.total_h}
                      higherIsBetter={false}
                      tip="Hits Allowed (lower is better)"
                    />
                    <CompareRow
                      label="ER"
                      val1={cp1?.total_er}
                      val2={cp2?.total_er}
                      higherIsBetter={false}
                      tip="Earned Runs (lower is better)"
                    />
                    <SectionHeader title="Special" />
                    <CompareRow
                      label="SV"
                      val1={cp1?.total_sv}
                      val2={cp2?.total_sv}
                      tip="Saves"
                    />
                    <CompareRow
                      label="CG"
                      val1={cp1?.total_cg}
                      val2={cp2?.total_cg}
                      tip="Complete Games"
                    />
                    <CompareRow
                      label="SHO"
                      val1={cp1?.total_sho}
                      val2={cp2?.total_sho}
                      tip="Shutouts"
                    />
                  </tbody>
                </table>
              )}

              {/* Legend */}
              <div
                style={{
                  padding: "12px 16px",
                  background: "#F8FAFC",
                  borderTop: "1px solid #E2E8F0",
                  display: "flex",
                  gap: 20,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11,
                    color: "#64748B",
                  }}
                >
                  <TrendingUp size={12} color="#1D4ED8" />
                  <span style={{ color: "#1D4ED8", fontWeight: 700 }}>
                    {player1.player.firstName}
                  </span>{" "}
                  leads
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11,
                    color: "#64748B",
                  }}
                >
                  <TrendingUp size={12} color="#DC2626" />
                  <span style={{ color: "#DC2626", fontWeight: 700 }}>
                    {player2.player.firstName}
                  </span>{" "}
                  leads
                </div>
                <div
                  style={{ fontSize: 11, color: "#94A3B8", marginLeft: "auto" }}
                >
                  Hover any stat label for its definition
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "60px 24px",
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "#EFF6FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <ArrowLeftRight size={28} color="#1D4ED8" />
              </div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#0F172A",
                  margin: "0 0 8px",
                }}
              >
                Select two players to compare
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "#64748B",
                  margin: 0,
                  maxWidth: 360,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                Search for any player by name using the fields above. Their
                complete NBC World Series career stats will appear here side by
                side.
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
