import React, { useState } from "react";
import axios from "axios";
import SearchResults from "./SearchResults";
import "./SearchInterface.css";

const EXAMPLE_QUERIES = {
  search: ["Hutchinson", "2024", "Jake Gutierrez"],
  ask: [
    "Jake Gutierrez stats",
    "Who had the highest batting average in 2025?",
    "Top 5 home run hitters",
    "Lowest ERA in 2025",
    "Who won in 2024?",
    "Most championships all time",
  ],
};

const SearchInterface = () => {
  const [query, setQuery] = useState("");
  const [payload, setPayload] = useState(null); // full API response object
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("ask");

  const handleSearch = async (e) => {
    e?.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      alert("Please enter at least 2 characters");
      return;
    }

    setLoading(true);
    setPayload(null);

    try {
      if (mode === "search") {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL || ""}/api/search`,
          { params: { q: trimmed } },
        );
        // Wrap keyword-search results in a shape SearchResults can display
        setPayload({ ...data, queryType: "keyword_search", answer: "" });
      } else {
        const { data } = await axios.post(
          `${process.env.REACT_APP_API_URL || ""}/api/search/ask`,
          { question: trimmed },
        );
        setPayload(data);
      }
    } catch (error) {
      console.error("Search error:", error);
      alert(`Search failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const pickExample = (q) => {
    setQuery(q);
    // Auto-submit after state settles
    setTimeout(
      () => document.getElementById("search-form")?.requestSubmit(),
      0,
    );
  };

  const examples = EXAMPLE_QUERIES[mode] || [];

  return (
    <div className="search-interface">
      <div className="search-header">
        <h1>🔍 NBC World Series Database</h1>
        <p>Search 90 years of baseball history</p>
      </div>

      {/* Mode toggle */}
      <div className="mode-toggle">
        <button
          className={mode === "search" ? "active" : ""}
          onClick={() => {
            setMode("search");
            setPayload(null);
          }}
        >
          Simple Search
        </button>
        <button
          className={mode === "ask" ? "active" : ""}
          onClick={() => {
            setMode("ask");
            setPayload(null);
          }}
        >
          Ask a Question
        </button>
      </div>

      {/* Search form */}
      <form id="search-form" onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            mode === "search"
              ? "Search for players, teams, or years…"
              : 'Ask a question like "Who won in 2024?" or "Jake Gutierrez stats"'
          }
          className="search-input"
        />
        <button type="submit" disabled={loading} className="search-btn">
          {loading ? "Searching…" : mode === "search" ? "Search" : "Ask"}
        </button>
      </form>

      {/* Example chips */}
      <div className="example-queries">
        <span>Try:</span>
        {examples.map((q) => (
          <button key={q} onClick={() => pickExample(q)}>
            {q}
          </button>
        ))}
      </div>

      {/* ── Results ── */}
      {payload && mode === "ask" && <SearchResults searchResults={payload} />}

      {/* Simple search mode — keyword results only (no SearchResults needed) */}
      {payload && mode === "search" && (
        <div className="search-results">
          {payload.players?.length > 0 && (
            <div className="result-section">
              <h3>Players ({payload.players.length})</h3>
              <div className="result-list">
                {payload.players.map((p) => (
                  <div key={p.id} className="result-card">
                    <h4>{p.name}</h4>
                    <p>
                      {p.team_name} ({p.year})
                    </p>
                    {p.avg > 0 && (
                      <p>
                        AVG: {parseFloat(p.avg).toFixed(3)} | H: {p.h} | RBI:{" "}
                        {p.rbi}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {payload.teams?.length > 0 && (
            <div className="result-section">
              <h3>Teams ({payload.teams.length})</h3>
              <div className="result-list">
                {payload.teams.map((t) => (
                  <div key={t.id} className="result-card">
                    <h4>{t.name}</h4>
                    <p>
                      {t.city}, {t.state}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {payload.championships?.length > 0 && (
            <div className="result-section">
              <h3>Championships ({payload.championships.length})</h3>
              <div className="result-list">
                {payload.championships.map((c, i) => (
                  <div key={i} className="result-card">
                    <h4>
                      {c.year} Champion: {c.champion_name || c.champion}
                    </h4>
                    {(c.mvp_names?.length > 0 || c.mvp) && (
                      <p>MVP: {c.mvp_names?.join(" & ") || c.mvp}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!payload.players?.length &&
            !payload.teams?.length &&
            !payload.championships?.length && (
              <p className="no-results">No results found for "{query}".</p>
            )}
        </div>
      )}
    </div>
  );
};

export default SearchInterface;
