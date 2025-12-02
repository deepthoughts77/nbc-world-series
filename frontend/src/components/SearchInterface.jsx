import React, { useState } from "react";
import axios from "axios";
import "./SearchInterface.css";

const SearchInterface = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("ask"); // Default to 'ask' mode for natural language

  const handleSearch = async (e) => {
    e.preventDefault();

    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      alert("Please enter at least 2 characters");
      return;
    }

    setLoading(true);
    setResults(null);
    setAnswer("");

    try {
      if (mode === "search") {
        // Simple keyword search
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL || ""}/api/search`,
          {
            params: { q: trimmedQuery },
          }
        );
        console.log("=== SEARCH MODE RESPONSE ===");
        console.log(response.data);
        setResults(response.data.results);
      } else {
        // Natural language question
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL || ""}/api/search/ask`,
          {
            question: trimmedQuery,
          }
        );

        console.log("=== FRONTEND RECEIVED ===");
        console.log("Full Response:", response.data);
        console.log("Answer:", response.data.answer);
        console.log("Data:", response.data.data);
        console.log("Success:", response.data.success);

        setAnswer(response.data.answer);

        // Set results properly for player stats display
        if (response.data.data) {
          setResults(response.data);
        } else {
          setResults(null);
        }
      }
    } catch (error) {
      console.error("Search error:", error);
      console.error("Error response:", error.response?.data);
      alert(`Search failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-interface">
      <div className="search-header">
        <h1>🔍 NBC World Series Database</h1>
        <p>Search 90 years of baseball history</p>
      </div>

      <div className="mode-toggle">
        <button
          className={mode === "search" ? "active" : ""}
          onClick={() => setMode("search")}
        >
          Simple Search
        </button>
        <button
          className={mode === "ask" ? "active" : ""}
          onClick={() => setMode("ask")}
        >
          Ask a Question
        </button>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            mode === "search"
              ? "Search for players, teams, or years..."
              : 'Ask a question like "Who won in 2024?" or "Jake Gutierrez stats"'
          }
          className="search-input"
        />
        <button type="submit" disabled={loading} className="search-btn">
          {loading ? "Searching..." : mode === "search" ? "Search" : "Ask"}
        </button>
      </form>

      {mode === "search" && (
        <div className="example-queries">
          <span>Try:</span>
          <button onClick={() => setQuery("Hutchinson")}>Hutchinson</button>
          <button onClick={() => setQuery("2024")}>2024</button>
          <button onClick={() => setQuery("Jake Gutierrez")}>
            Jake Gutierrez
          </button>
        </div>
      )}

      {mode === "ask" && (
        <div className="example-queries">
          <span>Try:</span>
          <button onClick={() => setQuery("Jake Gutierrez stats")}>
            Jake Gutierrez stats
          </button>
          <button
            onClick={() =>
              setQuery("Who had the highest batting average in 2025?")
            }
          >
            Highest batting average
          </button>
          <button onClick={() => setQuery("Top 5 home run hitters")}>
            Top home run hitters
          </button>
          <button onClick={() => setQuery("Lowest ERA in 2025")}>
            Lowest ERA
          </button>
        </div>
      )}

      {answer && (
        <div className="answer-box">
          <h3>Answer:</h3>
          <p>{answer}</p>
        </div>
      )}

      {/* Player Stats Display - Single Player Lookup */}
      {results && results.data && !Array.isArray(results.data) && (
        <div className="result-section">
          <div className="result-card player-stats-card">
            <h3>
              {results.data.first_name} {results.data.last_name}
            </h3>
            <p className="team-info">
              {results.data.team_name || "Unknown Team"} - 2025 Season
            </p>

            {results.data.avg !== null && (
              <div className="stats-section">
                <h4>⚾ Batting Statistics</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">AVG</span>
                    <span className="stat-value">
                      {results.data.avg
                        ? `.${Math.round(results.data.avg * 1000)
                            .toString()
                            .padStart(3, "0")}`
                        : ".000"}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">GP</span>
                    <span className="stat-value">{results.data.gp || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">AB</span>
                    <span className="stat-value">{results.data.ab || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">R</span>
                    <span className="stat-value">{results.data.r || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">H</span>
                    <span className="stat-value">{results.data.h || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">2B</span>
                    <span className="stat-value">
                      {results.data["2b"] || 0}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">3B</span>
                    <span className="stat-value">
                      {results.data["3b"] || 0}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">HR</span>
                    <span className="stat-value">{results.data.hr || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">RBI</span>
                    <span className="stat-value">{results.data.rbi || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">BB</span>
                    <span className="stat-value">{results.data.bb || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">SO</span>
                    <span className="stat-value">{results.data.so || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">SB</span>
                    <span className="stat-value">{results.data.sb || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">OBP</span>
                    <span className="stat-value">
                      {results.data.obp
                        ? `.${Math.round(results.data.obp * 1000)
                            .toString()
                            .padStart(3, "0")}`
                        : ".000"}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">SLG</span>
                    <span className="stat-value">
                      {results.data.slg
                        ? `.${Math.round(results.data.slg * 1000)
                            .toString()
                            .padStart(3, "0")}`
                        : ".000"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {results.data.era !== null && (
              <div className="stats-section">
                <h4>🥎 Pitching Statistics</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">ERA</span>
                    <span className="stat-value">
                      {results.data.era
                        ? parseFloat(results.data.era).toFixed(2)
                        : "0.00"}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">W</span>
                    <span className="stat-value">{results.data.w || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">L</span>
                    <span className="stat-value">{results.data.l || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">SV</span>
                    <span className="stat-value">{results.data.sv || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">G</span>
                    <span className="stat-value">{results.data.g || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">GS</span>
                    <span className="stat-value">{results.data.gs || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">IP</span>
                    <span className="stat-value">{results.data.ip || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">H</span>
                    <span className="stat-value">{results.data.p_h || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">R</span>
                    <span className="stat-value">{results.data.p_r || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">ER</span>
                    <span className="stat-value">{results.data.er || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">BB</span>
                    <span className="stat-value">{results.data.p_bb || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">SO</span>
                    <span className="stat-value">{results.data.p_so || 0}</span>
                  </div>
                </div>
              </div>
            )}

            {results.data.avg === null && results.data.era === null && (
              <p className="no-stats">
                No 2025 stats available for this player.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Leaderboard Results - Array of Players */}
      {results &&
        results.results &&
        Array.isArray(results.results) &&
        results.results.length > 0 && (
          <div className="result-section">
            <h3 className="leaderboard-title">{results.message}</h3>
            <div className="result-list">
              {results.results.map((player, idx) => (
                <div key={idx} className="result-card leaderboard-card">
                  <div className="rank-badge">{idx + 1}</div>
                  <div className="player-info">
                    <h4>
                      {player.first_name} {player.last_name}
                    </h4>
                    <p className="team-name">{player.team_name}</p>
                  </div>
                  <div className="stat-highlight">
                    {player.avg !== undefined && (
                      <>
                        <span className="stat-label">AVG</span>
                        <span className="stat-value">
                          {player.avg
                            ? `.${Math.round(player.avg * 1000)
                                .toString()
                                .padStart(3, "0")}`
                            : ".000"}
                        </span>
                      </>
                    )}
                    {player.hr !== undefined && (
                      <>
                        <span className="stat-label">HR</span>
                        <span className="stat-value">{player.hr || 0}</span>
                      </>
                    )}
                    {player.era !== undefined && (
                      <>
                        <span className="stat-label">ERA</span>
                        <span className="stat-value">
                          {player.era
                            ? parseFloat(player.era).toFixed(2)
                            : "0.00"}
                        </span>
                      </>
                    )}
                    {player.so !== undefined && player.era !== undefined && (
                      <>
                        <span className="stat-label">SO</span>
                        <span className="stat-value">{player.so || 0}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Legacy search results */}
      {results && mode === "search" && (
        <div className="search-results">
          {/* Players */}
          {results.players && results.players.length > 0 && (
            <div className="result-section">
              <h3>Players ({results.players.length})</h3>
              <div className="result-list">
                {results.players.map((player) => (
                  <div key={player.id} className="result-card">
                    <h4>{player.name}</h4>
                    <p>
                      {player.team_name} ({player.year})
                    </p>
                    {player.batting_avg > 0 && (
                      <p>
                        AVG: .{player.batting_avg} | Hits: {player.hits} | RBI:{" "}
                        {player.rbi}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Teams */}
          {results.teams && results.teams.length > 0 && (
            <div className="result-section">
              <h3>Teams ({results.teams.length})</h3>
              <div className="result-list">
                {results.teams.map((team) => (
                  <div key={team.id} className="result-card">
                    <h4>{team.name}</h4>
                    <p>
                      {team.city}, {team.state}
                    </p>
                    <p className="league">{team.league}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Championships */}
          {results.championships && results.championships.length > 0 && (
            <div className="result-section">
              <h3>Championships ({results.championships.length})</h3>
              <div className="result-list">
                {results.championships.map((champ, idx) => (
                  <div key={idx} className="result-card">
                    <h4>{champ.year} Champion</h4>
                    <p>
                      <strong>{champ.champion}</strong>
                    </p>
                    {champ.championship_score && (
                      <p>Score: {champ.championship_score}</p>
                    )}
                    {champ.mvp && <p>MVP: {champ.mvp}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {(!results.players || results.players.length === 0) &&
            (!results.teams || results.teams.length === 0) &&
            (!results.championships || results.championships.length === 0) &&
            !results.data && (
              <p className="no-results">No results found for "{query}"</p>
            )}
        </div>
      )}
    </div>
  );
};

export default SearchInterface;
