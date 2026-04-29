// frontend/src/pages/HeadToHead.js
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Search, Trophy, Minus, X, ChevronDown } from "lucide-react";
import { API } from "../api/apiClient";
import { Container } from "../components/common/Container";
import { BannerError } from "../components/common/BannerError";
import { Skeleton } from "../components/common/Skeleton";

// ── Searchable team picker ────────────────────────────────────────────────
// Shows all teams when open with no query, filters as you type.
// Uses a input-driven search so the full 465-team list is always accessible.
function TeamPicker({ label, value, onChange, teams, excludeTeam }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  const filtered = teams
    .filter((t) => t !== excludeTeam)
    .filter(
      (t) =>
        query.trim() === "" ||
        t.toLowerCase().includes(query.trim().toLowerCase()),
    );

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function select(team) {
    onChange(team);
    setQuery("");
    setOpen(false);
  }

  function clear(e) {
    e.stopPropagation();
    onChange("");
    setQuery("");
    setOpen(false);
  }

  function handleBoxClick() {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 20);
  }

  return (
    <div
      style={{
        flex: "1 1 220px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        position: "relative",
      }}
      ref={wrapRef}
    >
      <label style={s.selectorLabel}>{label}</label>

      {/* Input trigger */}
      <div
        onClick={handleBoxClick}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "0 10px",
          border: `2px solid ${open ? "#1D4ED8" : "#D1D5DB"}`,
          borderRadius: 8,
          background: "#FFFFFF",
          cursor: "pointer",
          minHeight: 44,
          transition: "border-color 0.15s",
        }}
      >
        <Search size={14} style={{ color: "#9CA3AF", flexShrink: 0 }} />

        {value && !open ? (
          <span
            style={{
              flex: 1,
              fontSize: 14,
              color: "#111827",
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {value}
          </span>
        ) : (
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={value || "Type to search all teams…"}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: 14,
              fontFamily: "inherit",
              color: "#111827",
              background: "transparent",
              padding: "8px 0",
            }}
          />
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            flexShrink: 0,
          }}
        >
          {value && (
            <button
              type="button"
              onClick={clear}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#9CA3AF",
                padding: 2,
                display: "flex",
              }}
              title="Clear"
            >
              <X size={13} />
            </button>
          )}
          <ChevronDown
            size={14}
            style={{
              color: "#9CA3AF",
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 0.15s",
            }}
          />
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 300,
            background: "#FFFFFF",
            border: "1px solid #D1D5DB",
            borderRadius: 8,
            boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Sticky search bar inside dropdown */}
          <div
            style={{
              padding: "8px 10px",
              borderBottom: "1px solid #E5E7EB",
              background: "#F9FAFB",
              flexShrink: 0,
            }}
          >
            <div style={{ position: "relative" }}>
              <Search
                size={13}
                style={{
                  position: "absolute",
                  left: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9CA3AF",
                  pointerEvents: "none",
                }}
              />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${teams.length - (excludeTeam ? 1 : 0)} teams…`}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  border: "1px solid #E5E7EB",
                  borderRadius: 6,
                  fontSize: 13,
                  padding: "7px 8px 7px 28px",
                  outline: "none",
                  background: "white",
                  fontFamily: "inherit",
                }}
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9CA3AF",
                    padding: 0,
                    display: "flex",
                  }}
                >
                  <X size={12} />
                </button>
              )}
            </div>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 5 }}>
              {query
                ? `${filtered.length} match${filtered.length !== 1 ? "es" : ""}`
                : `${filtered.length} teams — scroll or type to filter`}
            </div>
          </div>

          {/* Scrollable team list */}
          <div style={{ maxHeight: 300, overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div
                style={{
                  padding: "16px",
                  fontSize: 13,
                  color: "#9CA3AF",
                  textAlign: "center",
                }}
              >
                No teams match "{query}"
              </div>
            ) : (
              filtered.map((team) => (
                <div
                  key={team}
                  onClick={() => select(team)}
                  style={{
                    padding: "9px 14px",
                    fontSize: 13,
                    cursor: "pointer",
                    color: team === value ? "#1D4ED8" : "#111827",
                    fontWeight: team === value ? 700 : 400,
                    background: team === value ? "#EFF6FF" : "transparent",
                    borderBottom: "1px solid #F3F4F6",
                  }}
                  onMouseEnter={(e) => {
                    if (team !== value)
                      e.currentTarget.style.background = "#F8FAFC";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      team === value ? "#EFF6FF" : "transparent";
                  }}
                >
                  {team}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function HeadToHead() {
  const [teams, setTeams] = useState([]);
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/head-to-head/teams")
      .then(({ data }) => setTeams(data.data || []))
      .catch(() => setError("Failed to load team list."))
      .finally(() => setLoadingTeams(false));
  }, []);

  const handleSearch = useCallback(
    async (e) => {
      e.preventDefault();
      if (!team1 || !team2 || team1 === team2) return;
      setLoading(true);
      setError("");
      setResult(null);
      try {
        const { data } = await API.get("/head-to-head", {
          params: { team1, team2 },
        });
        setResult(data);
      } catch {
        setError("Failed to load head-to-head data.");
      } finally {
        setLoading(false);
      }
    },
    [team1, team2],
  );

  const team1Pct =
    result && result.total_games > 0
      ? Math.round((result.team1_wins / result.total_games) * 100)
      : 0;
  const team2Pct = result ? 100 - team1Pct : 0;

  return (
    <div style={s.page}>
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div style={s.header}>
        <Container>
          <div style={s.eyebrow}>NBC WORLD SERIES · STATISTICS</div>
          <h1 style={s.h1}>Head-to-Head</h1>
          <p style={s.subtitle}>
            Compare any two teams' all-time record against each other in the NBC
            World Series (2000–2024).
          </p>
        </Container>
      </div>

      <Container>
        <div style={s.body}>
          {/* ── Team selector ───────────────────────────────────────── */}
          <form onSubmit={handleSearch}>
            <div style={s.selectorWrap}>
              {loadingTeams ? (
                <>
                  <div style={{ flex: "1 1 220px" }}>
                    <Skeleton className="h-10" />
                  </div>
                  <div style={s.vsBadge}>VS</div>
                  <div style={{ flex: "1 1 220px" }}>
                    <Skeleton className="h-10" />
                  </div>
                </>
              ) : (
                <>
                  {/* Use position:relative wrappers so dropdowns position correctly */}
                  <div style={{ flex: "1 1 220px", position: "relative" }}>
                    <TeamPicker
                      label="TEAM 1"
                      value={team1}
                      onChange={setTeam1}
                      teams={teams}
                      excludeTeam={team2}
                    />
                  </div>

                  <div style={s.vsBadge}>VS</div>

                  <div style={{ flex: "1 1 220px", position: "relative" }}>
                    <TeamPicker
                      label="TEAM 2"
                      value={team2}
                      onChange={setTeam2}
                      teams={teams}
                      excludeTeam={team1}
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={!team1 || !team2 || team1 === team2 || loading}
                style={{
                  ...s.searchBtn,
                  ...(!team1 || !team2 || team1 === team2
                    ? s.searchBtnDisabled
                    : {}),
                }}
              >
                <Search size={15} />
                {loading ? "Loading…" : "Compare"}
              </button>
            </div>
          </form>

          {error && (
            <div style={{ marginBottom: 16 }}>
              <BannerError message={error} />
            </div>
          )}

          {/* ── Results ─────────────────────────────────────────────── */}
          {loading && (
            <div style={{ marginTop: 32 }}>
              <Skeleton className="h-40" />
            </div>
          )}

          {result && !loading && (
            <div style={{ marginTop: 32 }}>
              {result.total_games === 0 ? (
                <div style={s.noGames}>
                  <Minus
                    size={40}
                    style={{ color: "#9CA3AF", marginBottom: 12 }}
                  />
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#374151",
                      marginBottom: 6,
                    }}
                  >
                    No games found
                  </div>
                  <div style={{ fontSize: 13, color: "#9CA3AF" }}>
                    {result.team1} and {result.team2} have not played each other
                    in the NBC World Series (2000–2024).
                  </div>
                </div>
              ) : (
                <>
                  {/* ── Scoreboard ──────────────────────────────────── */}
                  <div style={s.scoreboard}>
                    <div style={s.scoreTeam}>
                      <div style={s.scoreTeamName}>{result.team1}</div>
                      <div
                        style={{
                          ...s.scoreNum,
                          color:
                            result.team1_wins >= result.team2_wins
                              ? "#D97706"
                              : "#6B7280",
                        }}
                      >
                        {result.team1_wins}
                      </div>
                      <div style={s.scoreLabel}>wins</div>
                    </div>

                    <div style={s.scoreCenter}>
                      <div style={s.scoreTotalGames}>{result.total_games}</div>
                      <div style={s.scoreTotalLabel}>games played</div>
                      <div style={s.winBar}>
                        <div
                          style={{ ...s.winBarFill1, width: `${team1Pct}%` }}
                        />
                        <div
                          style={{ ...s.winBarFill2, width: `${team2Pct}%` }}
                        />
                      </div>
                      <div style={s.winBarLabels}>
                        <span style={{ color: "#D97706" }}>{team1Pct}%</span>
                        <span style={{ color: "#1D4ED8" }}>{team2Pct}%</span>
                      </div>
                    </div>

                    <div style={s.scoreTeam}>
                      <div style={s.scoreTeamName}>{result.team2}</div>
                      <div
                        style={{
                          ...s.scoreNum,
                          color:
                            result.team2_wins >= result.team1_wins
                              ? "#1D4ED8"
                              : "#6B7280",
                        }}
                      >
                        {result.team2_wins}
                      </div>
                      <div style={s.scoreLabel}>wins</div>
                    </div>
                  </div>

                  {/* ── Game log ──────────────────────────────────────── */}
                  <div style={{ marginTop: 24 }}>
                    <div style={s.gameLogHeader}>
                      Game-by-Game Results
                      <span style={s.gameLogCount}>
                        {result.total_games} games
                      </span>
                    </div>
                    <div style={{ overflowX: "auto" }}>
                      <table style={s.table}>
                        <thead>
                          <tr style={s.theadRow}>
                            {["Year", "Date", "Winner", "Score", "Loser"].map(
                              (h) => (
                                <th key={h} style={s.th}>
                                  {h}
                                </th>
                              ),
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {result.games.map((g, i) => {
                            const team1Won =
                              g.winning_team.toLowerCase() ===
                              result.team1.toLowerCase();
                            return (
                              <tr
                                key={i}
                                style={{
                                  background:
                                    i % 2 === 0 ? "#FFFFFF" : "#F9FAFB",
                                  borderBottom: "1px solid #F3F4F6",
                                }}
                              >
                                <td
                                  style={{
                                    ...s.td,
                                    fontFamily: "monospace",
                                    fontWeight: 700,
                                  }}
                                >
                                  {g.year}
                                </td>
                                <td style={{ ...s.td, color: "#9CA3AF" }}>
                                  {g.game_date
                                    ? new Date(g.game_date).toLocaleDateString(
                                        "en-US",
                                        { month: "short", day: "numeric" },
                                      )
                                    : "—"}
                                </td>
                                <td
                                  style={{
                                    ...s.td,
                                    fontWeight: 700,
                                    color: team1Won ? "#D97706" : "#1D4ED8",
                                  }}
                                >
                                  <Trophy
                                    size={11}
                                    style={{
                                      display: "inline",
                                      marginRight: 4,
                                    }}
                                  />
                                  {g.winning_team}
                                </td>
                                <td
                                  style={{
                                    ...s.td,
                                    fontFamily: "monospace",
                                    fontWeight: 700,
                                    color: "#111827",
                                  }}
                                >
                                  {g.winning_score ?? "—"}–
                                  {g.losing_score ?? "—"}
                                </td>
                                <td style={{ ...s.td, color: "#6B7280" }}>
                                  {g.losing_team}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Info box (before first search) ──────────────────────── */}
          {!result && !loading && !error && (
            <div style={s.infoBox}>
              <Trophy
                size={32}
                style={{ color: "#D97706", marginBottom: 12 }}
              />
              <h3 style={s.infoTitle}>All-Time Head-to-Head Records</h3>
              <p style={s.infoText}>
                Select any two teams to see their complete head-to-head record
                in the NBC World Series. Type to search across all 456 teams,
                includes every game result from 2000 through 2024.
              </p>
              <div style={s.infoStats}>
                <div style={s.infoStat}>
                  <div style={s.infoStatNum}>1,587</div>
                  <div style={s.infoStatLabel}>Games</div>
                </div>
                <div style={s.infoStat}>
                  <div style={s.infoStatNum}>456</div>
                  <div style={s.infoStatLabel}>Teams</div>
                </div>
                <div style={s.infoStat}>
                  <div style={s.infoStatNum}>25</div>
                  <div style={s.infoStatLabel}>Years</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────
const s = {
  page: {
    minHeight: "100vh",
    background: "#F9FAFB",
    fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif",
    color: "#111827",
  },
  header: {
    background: "#1F2937",
    borderBottom: "4px solid #D97706",
    paddingTop: 48,
    paddingBottom: 36,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: "0.2em",
    color: "#D97706",
    fontWeight: 700,
    marginBottom: 10,
    fontFamily: "'IBM Plex Mono', monospace",
  },
  h1: {
    fontSize: "clamp(2rem, 5vw, 3rem)",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    margin: "0 0 12px",
    color: "#F9FAFB",
    lineHeight: 1.1,
  },
  subtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    maxWidth: 520,
    lineHeight: 1.7,
    margin: 0,
  },
  body: { paddingTop: 32, paddingBottom: 64 },

  selectorWrap: {
    display: "flex",
    alignItems: "flex-end",
    gap: 12,
    flexWrap: "wrap",
    padding: "24px",
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  selectorLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#6B7280",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  vsBadge: {
    flexShrink: 0,
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "#1F2937",
    color: "#D97706",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
    fontSize: 12,
    letterSpacing: "0.05em",
    marginBottom: 2,
  },
  searchBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 24px",
    background: "#1F2937",
    color: "#FFFFFF",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "inherit",
    cursor: "pointer",
    flexShrink: 0,
    height: 42,
  },
  searchBtnDisabled: { background: "#9CA3AF", cursor: "not-allowed" },

  scoreboard: {
    display: "flex",
    alignItems: "center",
    gap: 24,
    padding: "32px 24px",
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    flexWrap: "wrap",
  },
  scoreTeam: { flex: 1, textAlign: "center", minWidth: 140 },
  scoreTeamName: {
    fontSize: 15,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 8,
    lineHeight: 1.3,
  },
  scoreNum: {
    fontSize: 72,
    fontWeight: 900,
    lineHeight: 1,
    letterSpacing: "-0.04em",
  },
  scoreLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: 600,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  scoreCenter: { flex: "0 0 140px", textAlign: "center" },
  scoreTotalGames: { fontSize: 28, fontWeight: 900, color: "#111827" },
  scoreTotalLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 12,
  },
  winBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    display: "flex",
    marginBottom: 4,
    background: "#F3F4F6",
  },
  winBarFill1: {
    height: "100%",
    background: "#D97706",
    transition: "width 0.5s ease",
  },
  winBarFill2: {
    height: "100%",
    background: "#1D4ED8",
    transition: "width 0.5s ease",
  },
  winBarLabels: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 11,
    fontWeight: 700,
  },

  gameLogHeader: {
    fontSize: 14,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 12,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  gameLogCount: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: 600,
    background: "#F3F4F6",
    padding: "2px 8px",
    borderRadius: 4,
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 13,
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: 10,
    overflow: "hidden",
  },
  theadRow: { background: "#1F2937" },
  th: {
    padding: "10px 14px",
    textAlign: "left",
    fontSize: 11,
    fontWeight: 700,
    color: "#9CA3AF",
    borderBottom: "3px solid #D97706",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  td: { padding: "9px 14px", verticalAlign: "middle" },

  noGames: {
    textAlign: "center",
    padding: "60px 24px",
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  infoBox: {
    marginTop: 32,
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: 12,
    padding: "40px 32px",
    textAlign: "center",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#111827",
    margin: "0 0 12px",
  },
  infoText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 1.7,
    maxWidth: 480,
    margin: "0 0 28px",
  },
  infoStats: { display: "flex", gap: 40 },
  infoStat: { textAlign: "center" },
  infoStatNum: {
    fontSize: 28,
    fontWeight: 900,
    color: "#D97706",
    lineHeight: 1,
  },
  infoStatLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
    fontWeight: 600,
  },
};
