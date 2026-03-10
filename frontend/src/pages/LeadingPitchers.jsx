// src/pages/LeadingPitchers.jsx
import { useState, useEffect } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const DECADES = [
  { label: "All", value: "" },
  { label: "2020s", value: "2020" },
  { label: "2010s", value: "2010" },
  { label: "2000s", value: "2000" },
  { label: "1990s", value: "1990" },
  { label: "1980s", value: "1980" },
  { label: "1970s", value: "1970" },
  { label: "1960s", value: "1960" },
  { label: "1950s", value: "1950" },
  { label: "1940s", value: "1940" },
  { label: "1930s", value: "1930" },
];

// Notable pitchers worth highlighting
const NOTABLE = new Set([
  "Satchel Paige",
  "Tug McGraw",
  "Johnny Antonelli",
  "Pat Gillick",
  "Mike Harkey",
  "Larry Gura",
  "Randy Jones",
  "Mike Moore",
]);

export default function LeadingPitchers() {
  const [pitchers, setPitchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDecade, setSelectedDecade] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const fetchPitchers = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (selectedDecade) params.set("decade", selectedDecade);
        if (search) params.set("search", search);
        const res = await fetch(`${API_BASE}/api/leading-pitchers?${params}`);
        if (!res.ok) throw new Error("Failed to fetch data");
        const json = await res.json();
        setPitchers(json.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPitchers();
  }, [selectedDecade, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const handleClear = () => {
    setSearchInput("");
    setSearch("");
    setSelectedDecade("");
  };

  const formatStats = (p) => {
    if (p.notes && !p.innings_pitched) return p.notes;
    const parts = [];
    if (p.innings_pitched) parts.push(`${p.innings_pitched} IP`);
    if (p.earned_runs !== null && p.earned_runs !== undefined)
      parts.push(`${p.earned_runs} ER`);
    if (p.strikeouts) parts.push(`${p.strikeouts} K`);
    return parts.join(" · ") || "—";
  };

  const isNotable = (name) => [...NOTABLE].some((n) => name.includes(n));

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>NBC World Series</h1>
        <h2 style={styles.subtitle}>Leading Pitchers · 1935–2025</h2>
        <p style={styles.description}>
          The top pitcher award has been given since the first tournament in
          1935, beginning with Satchel Paige. Nine decades of diamond history.
        </p>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        {/* Decade filter */}
        <div style={styles.decadeFilter}>
          {DECADES.map((d) => (
            <button
              key={d.value}
              onClick={() => setSelectedDecade(d.value)}
              style={{
                ...styles.decadeBtn,
                ...(selectedDecade === d.value ? styles.decadeBtnActive : {}),
              }}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} style={styles.searchRow}>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search pitcher or team…"
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchBtn}>
            Search
          </button>
          {(search || selectedDecade) && (
            <button type="button" onClick={handleClear} style={styles.clearBtn}>
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Stats bar */}
      {!loading && !error && (
        <div style={styles.statsBar}>
          <span style={styles.statItem}>
            <strong>{pitchers.length}</strong> records shown
          </span>
          <span style={styles.statDivider}>·</span>
          <span style={styles.statItem}>
            <strong>
              {pitchers.filter((p) => p.earned_runs === 0).length}
            </strong>{" "}
            with 0 ER
          </span>
          <span style={styles.statDivider}>·</span>
          <span style={styles.statItem}>
            Spanning <strong>1935 – 2025</strong>
          </span>
        </div>
      )}

      {/* Content */}
      {loading && (
        <div style={styles.center}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Loading history…</p>
        </div>
      )}

      {error && (
        <div style={styles.errorBox}>
          <span>⚠️ {error}</span>
        </div>
      )}

      {!loading && !error && pitchers.length === 0 && (
        <div style={styles.center}>
          <p style={{ color: "#aaa", fontSize: "1.1rem" }}>No results found.</p>
        </div>
      )}

      {!loading && !error && pitchers.length > 0 && (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={{ ...styles.th, width: "70px" }}>Year</th>
                <th style={styles.th}>Pitcher</th>
                <th style={styles.th}>Team</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Stats</th>
              </tr>
            </thead>
            <tbody>
              {pitchers.map((p, i) => {
                const notable = isNotable(p.pitcher);
                return (
                  <tr
                    key={p.id}
                    style={{
                      ...styles.tr,
                      background: notable
                        ? "rgba(212, 175, 55, 0.07)"
                        : i % 2 === 0
                          ? "#0e1520"
                          : "#111b28",
                    }}
                  >
                    <td style={styles.yearCell}>
                      <span style={styles.yearBadge}>{p.year}</span>
                    </td>
                    <td style={styles.pitcherCell}>
                      {notable && <span style={styles.starIcon}>★ </span>}
                      <span
                        style={
                          notable ? styles.notableName : styles.regularName
                        }
                      >
                        {p.pitcher}
                      </span>
                    </td>
                    <td style={styles.teamCell}>{p.team}</td>
                    <td style={styles.statsCell}>
                      <span
                        style={
                          p.earned_runs === 0 ? styles.zeroER : styles.statsText
                        }
                      >
                        {formatStats(p)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer note */}
      <p style={styles.footerNote}>
        Data sourced from{" "}
        <a
          href="https://nbcbaseball.com/past-champs-awards/"
          target="_blank"
          rel="noreferrer"
          style={styles.link}
        >
          nbcbaseball.com
        </a>
        . ★ denotes historically notable MLB-connected players.
      </p>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #0a1016 0%, #0d1520 100%)",
    color: "#e8edf2",
    fontFamily: "'Georgia', serif",
    padding: "0 0 60px 0",
  },
  header: {
    background:
      "linear-gradient(135deg, #0d1f35 0%, #1a3a5c 50%, #0d1f35 100%)",
    borderBottom: "3px solid #d4af37",
    padding: "50px 24px 40px",
    textAlign: "center",
  },
  title: {
    fontSize: "0.85rem",
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    color: "#d4af37",
    marginBottom: "8px",
    fontFamily: "'Arial', sans-serif",
    fontWeight: 600,
  },
  subtitle: {
    fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
    color: "#ffffff",
    margin: "0 0 12px 0",
    fontWeight: 700,
    letterSpacing: "0.03em",
  },
  description: {
    color: "#8fa3b8",
    fontSize: "0.95rem",
    maxWidth: "560px",
    margin: "0 auto",
    lineHeight: 1.6,
    fontFamily: "'Arial', sans-serif",
  },
  controls: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "28px 20px 0",
  },
  decadeFilter: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "16px",
  },
  decadeBtn: {
    padding: "6px 14px",
    borderRadius: "20px",
    border: "1px solid #2a4060",
    background: "transparent",
    color: "#8fa3b8",
    fontSize: "0.82rem",
    cursor: "pointer",
    fontFamily: "'Arial', sans-serif",
    transition: "all 0.15s ease",
  },
  decadeBtnActive: {
    background: "#1a3a5c",
    borderColor: "#d4af37",
    color: "#d4af37",
  },
  searchRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "8px",
  },
  searchInput: {
    flex: 1,
    padding: "9px 14px",
    borderRadius: "6px",
    border: "1px solid #2a4060",
    background: "#0d1520",
    color: "#e8edf2",
    fontSize: "0.9rem",
    fontFamily: "'Arial', sans-serif",
    outline: "none",
  },
  searchBtn: {
    padding: "9px 18px",
    borderRadius: "6px",
    border: "1px solid #d4af37",
    background: "#d4af37",
    color: "#0a1016",
    fontWeight: 700,
    fontSize: "0.85rem",
    cursor: "pointer",
    fontFamily: "'Arial', sans-serif",
  },
  clearBtn: {
    padding: "9px 14px",
    borderRadius: "6px",
    border: "1px solid #2a4060",
    background: "transparent",
    color: "#8fa3b8",
    fontSize: "0.85rem",
    cursor: "pointer",
    fontFamily: "'Arial', sans-serif",
  },
  statsBar: {
    maxWidth: "900px",
    margin: "16px auto 0",
    padding: "10px 20px",
    display: "flex",
    gap: "12px",
    alignItems: "center",
    background: "rgba(26, 58, 92, 0.25)",
    borderRadius: "6px",
    fontFamily: "'Arial', sans-serif",
    fontSize: "0.82rem",
    color: "#8fa3b8",
  },
  statItem: { color: "#8fa3b8" },
  statDivider: { color: "#2a4060" },
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "60px 20px",
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid #1a3a5c",
    borderTop: "3px solid #d4af37",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    marginBottom: "12px",
  },
  loadingText: {
    color: "#8fa3b8",
    fontFamily: "'Arial', sans-serif",
  },
  errorBox: {
    maxWidth: "900px",
    margin: "24px auto",
    padding: "16px 20px",
    background: "rgba(180, 50, 50, 0.15)",
    border: "1px solid rgba(180, 50, 50, 0.4)",
    borderRadius: "6px",
    color: "#f08080",
    fontFamily: "'Arial', sans-serif",
  },
  tableWrapper: {
    maxWidth: "900px",
    margin: "20px auto 0",
    padding: "0 20px",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.9rem",
  },
  thead: {
    background: "#0d1f35",
    borderBottom: "2px solid #d4af37",
  },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontFamily: "'Arial', sans-serif",
    fontWeight: 700,
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#d4af37",
  },
  tr: {
    borderBottom: "1px solid #1a2a3a",
    transition: "background 0.1s ease",
  },
  yearCell: {
    padding: "12px 16px",
    verticalAlign: "middle",
  },
  yearBadge: {
    display: "inline-block",
    padding: "3px 8px",
    background: "rgba(212, 175, 55, 0.12)",
    border: "1px solid rgba(212, 175, 55, 0.3)",
    borderRadius: "4px",
    color: "#d4af37",
    fontWeight: 700,
    fontSize: "0.82rem",
    fontFamily: "'Arial', sans-serif",
    letterSpacing: "0.03em",
  },
  pitcherCell: {
    padding: "12px 16px",
    verticalAlign: "middle",
    fontWeight: 500,
  },
  starIcon: {
    color: "#d4af37",
    fontSize: "0.85rem",
  },
  notableName: {
    color: "#f0d060",
    fontWeight: 600,
  },
  regularName: {
    color: "#d0dae6",
  },
  teamCell: {
    padding: "12px 16px",
    color: "#8fa3b8",
    fontFamily: "'Arial', sans-serif",
    fontSize: "0.85rem",
    verticalAlign: "middle",
  },
  statsCell: {
    padding: "12px 16px",
    textAlign: "right",
    fontFamily: "'Arial', sans-serif",
    fontSize: "0.82rem",
    verticalAlign: "middle",
  },
  statsText: {
    color: "#8fa3b8",
  },
  zeroER: {
    color: "#4caf7d",
    fontWeight: 600,
  },
  footerNote: {
    maxWidth: "900px",
    margin: "28px auto 0",
    padding: "0 20px",
    fontSize: "0.78rem",
    color: "#4a6080",
    fontFamily: "'Arial', sans-serif",
    textAlign: "center",
  },
  link: {
    color: "#5a8fbf",
    textDecoration: "none",
  },
};
