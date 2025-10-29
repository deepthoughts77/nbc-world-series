import React, { useState } from "react";
import axios from "axios";
import "./SearchInterface.css";

const SearchInterface = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("search"); // 'search' or 'ask'

  const handleSearch = async (e) => {
    e.preventDefault();

    if (query.length < 2) {
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
          `${process.env.REACT_APP_API_URL}/search`,
          {
            params: { q: query },
          }
        );
        setResults(response.data.results);
      } else {
        // Natural language question
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/search/ask`,
          {
            question: query,
          }
        );
        setAnswer(response.data.answer);
        setResults(
          response.data.data ? { answer: [response.data.data] } : null
        );
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("Search failed. Please try again.");
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
              : 'Ask a question like "Who won in 2024?" or "Stats for Jake Gutierrez"'
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
          <button onClick={() => setQuery("Who won in 2024?")}>
            Who won in 2024?
          </button>
          <button onClick={() => setQuery("Stats for Jake Gutierrez")}>
            Stats for Jake Gutierrez
          </button>
          <button onClick={() => setQuery("Top batters in 2024")}>
            Top batters
          </button>
        </div>
      )}

      {answer && (
        <div className="answer-box">
          <h3>Answer:</h3>
          <p>{answer}</p>
        </div>
      )}

      {results && (
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
            (!results.championships || results.championships.length === 0) && (
              <p className="no-results">No results found for "{query}"</p>
            )}
        </div>
      )}
    </div>
  );
};

export default SearchInterface;
