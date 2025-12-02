// components/PitchingStatsTable.jsx
import React, { useState, useEffect } from "react";
import "./PitchingStatsTable.css";

const PitchingStatsTable = ({ year }) => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: "era",
    direction: "asc",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/pitching/${year}`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching pitching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [year]);

  const isModernStats = year >= 2025;

  const formatStat = (value, decimals = 2) => {
    if (value === null || value === undefined) return "--";
    return value.toFixed(decimals);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedStats = [...stats].sort((a, b) => {
      const aVal = a[key] ?? Infinity;
      const bVal = b[key] ?? Infinity;

      if (direction === "asc") {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

    setStats(sortedStats);
  };

  const SortableHeader = ({ label, sortKey }) => (
    <th onClick={() => handleSort(sortKey)} className="sortable">
      {label}
      {sortConfig.key === sortKey && (
        <span className="sort-indicator">
          {sortConfig.direction === "desc" ? " ↓" : " ↑"}
        </span>
      )}
    </th>
  );

  if (loading) {
    return <div className="loading">Loading pitching statistics...</div>;
  }

  return (
    <div className="pitching-stats-container">
      <h2>{year} Pitching Statistics</h2>

      <div className="table-responsive">
        <table className="stats-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Team</th>

              {/* Modern stats (2025+) */}
              {isModernStats && (
                <>
                  <SortableHeader label="ERA" sortKey="era" />
                  <th className="sortable" onClick={() => handleSort("whip")}>
                    WHIP
                  </th>
                  <th
                    className="sortable"
                    onClick={() => handleSort("k_per_9")}
                  >
                    K/9
                  </th>
                </>
              )}

              {/* Traditional stats */}
              <SortableHeader label="W" sortKey="w" />
              <SortableHeader label="L" sortKey="l" />

              {isModernStats && (
                <>
                  <SortableHeader label="APP" sortKey="app" />
                  <SortableHeader label="GS" sortKey="gs" />
                  <SortableHeader label="SV" sortKey="sv" />
                </>
              )}

              <SortableHeader label="IP" sortKey="ip" />
              <SortableHeader label="H" sortKey="h" />
              <SortableHeader label="R" sortKey="r" />
              <SortableHeader label="ER" sortKey="er" />
              <SortableHeader label="BB" sortKey="bb" />
              <SortableHeader label="SO" sortKey="so" />
            </tr>
          </thead>

          <tbody>
            {stats.map((player, index) => (
              <tr key={player.id}>
                <td className="rank">{index + 1}</td>
                <td className="player-name">
                  {player.first_name} {player.last_name}
                  {player.jersey_num && (
                    <span className="jersey-num">#{player.jersey_num}</span>
                  )}
                </td>
                <td className="team-name">{player.team_name}</td>

                {isModernStats && (
                  <>
                    <td className="highlight">{formatStat(player.era, 2)}</td>
                    <td className="highlight">{formatStat(player.whip, 2)}</td>
                    <td className="highlight">
                      {formatStat(player.k_per_9, 1)}
                    </td>
                  </>
                )}

                <td>{player.w || "--"}</td>
                <td>{player.l || "--"}</td>

                {isModernStats && (
                  <>
                    <td>{player.app || "--"}</td>
                    <td>{player.gs || "--"}</td>
                    <td>{player.sv || "--"}</td>
                  </>
                )}

                <td>{formatStat(player.ip, 1)}</td>
                <td>{player.h || "--"}</td>
                <td>{player.r || "--"}</td>
                <td>{player.er || "--"}</td>
                <td>{player.bb || "--"}</td>
                <td>{player.so || "--"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModernStats && (
        <div className="stats-legend">
          <h4>Modern Statistics Glossary:</h4>
          <ul>
            <li>
              <strong>ERA</strong>: Earned Run Average ((ER × 9) / IP)
            </li>
            <li>
              <strong>WHIP</strong>: Walks + Hits per Inning Pitched ((BB + H) /
              IP)
            </li>
            <li>
              <strong>K/9</strong>: Strikeouts per 9 Innings ((SO × 9) / IP)
            </li>
            <li>
              <strong>APP</strong>: Appearances (total games pitched)
            </li>
            <li>
              <strong>GS</strong>: Games Started
            </li>
            <li>
              <strong>SV</strong>: Saves
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PitchingStatsTable;
