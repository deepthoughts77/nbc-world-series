import React, { useState, useEffect } from "react";
import "./BattingStatsTable.css";

const BattingStatsTable = ({ year }) => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "avg",
    direction: "desc",
  });

  // Fetch data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching batting stats for ${year}...`);

        const response = await fetch(`/api/batting/${year}`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`Received ${data.length} batting records`);
        setStats(data);
      } catch (err) {
        console.error("Error fetching batting stats:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (year) {
      fetchStats();
    }
  }, [year]);

  // Determine which columns to show based on year
  const isModernStats = year >= 2025;

  // Format numbers for display
  const formatStat = (value, decimals = 3) => {
    if (value === null || value === undefined) return "--";
    if (decimals === 3) {
      // Batting average format (without leading zero)
      const num = parseFloat(value);
      if (isNaN(num)) return "--";
      return num.toFixed(3).substring(1); // ".333" format
    }
    return parseFloat(value).toFixed(decimals);
  };

  // Calculate OPS
  const calculateOPS = (obp, slg) => {
    if (!obp || !slg) return "--";
    const ops = parseFloat(obp) + parseFloat(slg);
    return formatStat(ops, 3);
  };

  // Sorting function
  const handleSort = (key) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });

    const sortedStats = [...stats].sort((a, b) => {
      const aVal = a[key] ?? -Infinity;
      const bVal = b[key] ?? -Infinity;

      if (direction === "asc") {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

    setStats(sortedStats);
  };

  // Column header with sort indicator
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
    return (
      <div className="batting-stats-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading batting statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="batting-stats-container">
        <div className="error-message">
          <h3>⚠️ Error Loading Data</h3>
          <p>{error}</p>
          <p className="error-hint">
            Check console (F12) for details. Make sure backend is running on
            port 5000.
          </p>
        </div>
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="batting-stats-container">
        <div className="no-data-message">
          <h3>No Data Available</h3>
          <p>No batting statistics found for {year}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="batting-stats-container">
      <h2 className="stats-title">{year} Batting Statistics</h2>
      <p className="stats-count">{stats.length} players</p>

      <div className="table-responsive">
        <table className="stats-table">
          <thead>
            <tr>
              <th className="rank-col">Rank</th>
              <th className="player-col">Player</th>
              <th className="team-col">Team</th>

              {/* Always show these basic stats */}
              <SortableHeader label="G" sortKey="gp" />
              <SortableHeader label="AB" sortKey="ab" />
              <SortableHeader label="H" sortKey="h" />
              <SortableHeader label="R" sortKey="r" />

              {/* Modern stats (2025+) */}
              {isModernStats && (
                <>
                  <SortableHeader label="AVG" sortKey="avg" />
                  <SortableHeader label="OBP" sortKey="obp" />
                  <SortableHeader label="SLG" sortKey="slg" />
                  <th
                    className="sortable highlight-col"
                    onClick={() => handleSort("ops")}
                  >
                    OPS
                    {sortConfig.key === "ops" && (
                      <span className="sort-indicator">
                        {sortConfig.direction === "desc" ? " ↓" : " ↑"}
                      </span>
                    )}
                  </th>
                </>
              )}

              {/* Traditional stats */}
              <SortableHeader label="2B" sortKey="doubles" />
              <SortableHeader label="3B" sortKey="triples" />
              <SortableHeader label="HR" sortKey="hr" />
              <SortableHeader label="RBI" sortKey="rbi" />

              {isModernStats && (
                <>
                  <SortableHeader label="BB" sortKey="bb" />
                  <SortableHeader label="SO" sortKey="so" />
                </>
              )}

              <SortableHeader label="SB" sortKey="sb" />
            </tr>
          </thead>

          <tbody>
            {stats.map((player, index) => (
              <tr key={player.id || index}>
                <td className="rank-col">{index + 1}</td>
                <td className="player-col">
                  <span className="player-name">
                    {player.first_name} {player.last_name}
                  </span>
                  {player.jersey_num && (
                    <span className="jersey-num">#{player.jersey_num}</span>
                  )}
                </td>
                <td className="team-col">{player.team_name}</td>

                <td>{player.gp || player.g || "--"}</td>
                <td>{player.ab || "--"}</td>
                <td>{player.h || "--"}</td>
                <td>{player.r || "--"}</td>

                {isModernStats && (
                  <>
                    <td className="highlight-stat">{formatStat(player.avg)}</td>
                    <td className="highlight-stat">{formatStat(player.obp)}</td>
                    <td className="highlight-stat">{formatStat(player.slg)}</td>
                    <td className="highlight-stat-strong">
                      {calculateOPS(player.obp, player.slg)}
                    </td>
                  </>
                )}

                <td>{player.doubles || player["2b"] || "--"}</td>
                <td>{player.triples || player["3b"] || "--"}</td>
                <td>{player.hr || "--"}</td>
                <td>{player.rbi || "--"}</td>

                {isModernStats && (
                  <>
                    <td>{player.bb || "--"}</td>
                    <td>{player.so || "--"}</td>
                  </>
                )}

                <td>{player.sb || "--"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModernStats && (
        <div className="stats-legend">
          <h4>Modern Statistics Glossary</h4>
          <div className="legend-grid">
            <div className="legend-item">
              <strong>AVG:</strong> Batting Average (H/AB)
            </div>
            <div className="legend-item">
              <strong>OBP:</strong> On-Base Percentage
            </div>
            <div className="legend-item">
              <strong>SLG:</strong> Slugging Percentage
            </div>
            <div className="legend-item">
              <strong>OPS:</strong> On-Base Plus Slugging
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BattingStatsTable;
