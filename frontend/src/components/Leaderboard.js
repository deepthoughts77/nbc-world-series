// components/Leaderboard.jsx
import React, { useState, useEffect } from "react";
import "./Leaderboard.css";

const Leaderboard = ({ year, type = "batting", stat = "avg", limit = 10 }) => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/leaderboards/${type}/${year}?stat=${stat}&limit=${limit}`
        );
        const data = await response.json();
        setLeaders(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, [year, type, stat, limit]);

  const formatStat = (value, statType) => {
    if (value === null || value === undefined) return "--";

    switch (statType) {
      case "avg":
      case "obp":
      case "slg":
      case "ops":
        return value.toFixed(3).substring(1);
      case "era":
      case "whip":
        return value.toFixed(2);
      default:
        return value;
    }
  };

  const getStatLabel = (statKey) => {
    const labels = {
      avg: "AVG",
      obp: "OBP",
      slg: "SLG",
      ops: "OPS",
      hr: "HR",
      rbi: "RBI",
      era: "ERA",
      so: "SO",
      whip: "WHIP",
    };
    return labels[statKey] || statKey.toUpperCase();
  };

  if (loading) {
    return <div className="leaderboard-loading">Loading...</div>;
  }

  return (
    <div className="leaderboard">
      <h3>
        {year} {getStatLabel(stat)} Leaders
      </h3>
      <div className="leaderboard-list">
        {leaders.map((player, index) => (
          <div key={index} className="leaderboard-item">
            <span className="rank">{index + 1}</span>
            <div className="player-info">
              <span className="name">{player.player_name}</span>
              <span className="team">{player.team_name}</span>
            </div>
            <span className="stat-value">{formatStat(player[stat], stat)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
