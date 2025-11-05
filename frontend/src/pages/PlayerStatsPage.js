import React, { useEffect, useState } from "react";

const API_BASE = ""; // leave empty if you already proxy /api → backend
// If you need full URL, e.g. const API_BASE = "http://localhost:5000";

const statColumns = [
  { key: "g", label: "G" },
  { key: "ab", label: "AB" },
  { key: "r", label: "R" },
  { key: "h", label: "H" },
  { key: "2b", label: "2B" },
  { key: "3b", label: "3B" },
  { key: "hr", label: "HR" },
  { key: "sb", label: "SB" },
  { key: "sh", label: "SH" },
  { key: "rbi", label: "RBI" },
  { key: "po", label: "PO" },
  { key: "a", label: "A" },
  { key: "e", label: "E" },
  { key: "pct", label: "Pct" },
];

export default function PlayerStatsPage() {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [loadingYears, setLoadingYears] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState(null);
  const [teams, setTeams] = useState([]); // [{ teamName, players: [...] }]

  // Fetch available years on mount
  useEffect(() => {
    async function fetchYears() {
      try {
        setLoadingYears(true);
        const res = await fetch(`${API_BASE}/api/player-stats/years`);
        if (!res.ok) throw new Error("Failed to load years");
        const data = await res.json(); // e.g. [1966]
        setYears(data);
        if (data.length > 0) {
          // default to most recent year
          setSelectedYear(data[0]);
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load years");
      } finally {
        setLoadingYears(false);
      }
    }

    fetchYears();
  }, []);

  // Fetch stats when selectedYear changes
  useEffect(() => {
    if (!selectedYear) return;

    async function fetchStats() {
      try {
        setLoadingStats(true);
        setError(null);

        const res = await fetch(
          `${API_BASE}/api/player-stats?year=${selectedYear}`
        );
        if (!res.ok) throw new Error("Failed to load player stats");
        const rows = await res.json();

        // Group rows by team_name
        const byTeam = rows.reduce((acc, row) => {
          const key = row.team_name || "Unknown Team";
          if (!acc[key]) acc[key] = [];
          acc[key].push(row);
          return acc;
        }, {});

        const teamArray = Object.entries(byTeam)
          .map(([teamName, players]) => ({
            teamName,
            players: players.sort((a, b) =>
              (a.player_name || "").localeCompare(b.player_name || "")
            ),
          }))
          .sort((a, b) => a.teamName.localeCompare(b.teamName));

        setTeams(teamArray);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load player stats");
      } finally {
        setLoadingStats(false);
      }
    }

    fetchStats();
  }, [selectedYear]);

  const handleYearChange = (e) => {
    const value = e.target.value;
    setSelectedYear(value ? Number(value) : null);
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <h1 style={{ marginBottom: "0.5rem" }}>
        Player Stats (NBC World Series)
      </h1>
      <p style={{ marginBottom: "1rem", color: "#555" }}>
        Detailed individual player statistics by team and year. Currently loaded
        from the 1966 NBC annual.
      </p>

      {/* Year selector */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <label htmlFor="year-select" style={{ fontWeight: 600 }}>
          Year:
        </label>
        {loadingYears ? (
          <span>Loading years…</span>
        ) : (
          <select
            id="year-select"
            value={selectedYear ?? ""}
            onChange={handleYearChange}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Error / loading */}
      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
      )}
      {loadingStats && <div>Loading player stats…</div>}

      {/* Teams + tables */}
      {!loadingStats && !error && teams.length === 0 && (
        <div>No player stats found for {selectedYear}.</div>
      )}

      {!loadingStats &&
        teams.map((team) => (
          <div
            key={team.teamName}
            style={{
              marginBottom: "2rem",
              padding: "1rem",
              borderRadius: "8px",
              border: "1px solid #ddd",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <h2 style={{ marginBottom: "0.5rem" }}>{team.teamName}</h2>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.9rem",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      borderBottom: "1px solid #ccc",
                      padding: "0.35rem",
                    }}
                  >
                    Player
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      borderBottom: "1px solid #ccc",
                      padding: "0.35rem",
                    }}
                  >
                    Pos
                  </th>
                  {statColumns.map((col) => (
                    <th
                      key={col.key}
                      style={{
                        textAlign: "right",
                        borderBottom: "1px solid #ccc",
                        padding: "0.35rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {team.players.map((p) => (
                  <tr key={p.id}>
                    <td
                      style={{
                        padding: "0.3rem",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {p.player_name}
                    </td>
                    <td
                      style={{
                        padding: "0.3rem",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {p.position}
                    </td>
                    {statColumns.map((col) => (
                      <td
                        key={col.key}
                        style={{
                          padding: "0.3rem",
                          borderBottom: "1px solid #eee",
                          textAlign: "right",
                        }}
                      >
                        {p[col.key] === null ||
                        p[col.key] === undefined ||
                        p[col.key] === ""
                          ? "—"
                          : p[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
    </div>
  );
}
