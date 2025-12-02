import React, { useState, useEffect, useRef } from "react";
import { Search, TrendingUp, Award, X } from "lucide-react";
import { Card, CardBody } from "./common/Card";

/**
 * Natural Language Search Component
 * Allows users to search for player stats using natural language
 */
export default function NaturalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  // Fetch search suggestions
  useEffect(() => {
    fetch("/api/search/suggestions")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSuggestions(data.suggestions);
        }
      })
      .catch((err) => console.error("Failed to load suggestions:", err));
  }, []);

  // Handle search
  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setShowSuggestions(false);

    try {
      const response = await fetch("/api/search/natural", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await response.json();

      if (data.success) {
        setResults(data);
      } else {
        setError(data.error || "Search failed");
      }
    } catch (err) {
      setError("Failed to search. Please try again.");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  // Clear results
  const clearResults = () => {
    setResults(null);
    setError(null);
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Input */}
      <Card className="mb-6">
        <CardBody>
          <div className="relative">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Ask about player stats... (e.g., 'Jake Gutierrez stats' or 'highest batting average 2025')"
                className="flex-1 px-2 py-3 text-base focus:outline-none"
              />
              {query && (
                <button
                  onClick={clearResults}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
              <button
                onClick={() => handleSearch()}
                disabled={loading || !query.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && !results && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                <div className="p-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
                    Try asking:
                  </p>
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm text-gray-700 transition-colors"
                    >
                      <Search className="w-3 h-3 inline mr-2 text-gray-400" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardBody>
            <p className="text-red-800">{error}</p>
          </CardBody>
        </Card>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-4">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">
              {results.message}
            </h3>
            <span className="text-sm text-gray-500">
              {results.count} {results.count === 1 ? "result" : "results"}
            </span>
          </div>

          {/* Player Lookup Result */}
          {results.intent?.type === "player_lookup" && results.results[0] && (
            <PlayerStatsCard player={results.results[0]} />
          )}

          {/* Leaderboard Results */}
          {(results.intent?.type === "batting_stat" ||
            results.intent?.type === "pitching_stat") && (
            <LeaderboardResults
              results={results.results}
              type={results.intent.type}
              stat={results.intent.stat}
            />
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Player Stats Card - Shows detailed stats for a single player
 */
function PlayerStatsCard({ player }) {
  const hasBattingStats = player.avg !== null;
  const hasPitchingStats = player.era !== null;

  return (
    <Card>
      <CardBody>
        <div className="space-y-6">
          {/* Player Header */}
          <div>
            <h4 className="text-2xl font-bold text-gray-900">
              {player.first_name} {player.last_name}
            </h4>
            <p className="text-gray-600">{player.team_name}</p>
          </div>

          {/* Batting Stats */}
          {hasBattingStats && (
            <div>
              <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Batting Statistics
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <StatItem
                  label="AVG"
                  value={player.avg?.toFixed(3) || ".000"}
                />
                <StatItem label="HR" value={player.hr || 0} />
                <StatItem label="RBI" value={player.rbi || 0} />
                <StatItem label="H" value={player.h || 0} />
                <StatItem label="R" value={player.r || 0} />
                <StatItem label="AB" value={player.ab || 0} />
                <StatItem
                  label="OBP"
                  value={player.obp?.toFixed(3) || ".000"}
                />
                <StatItem
                  label="SLG"
                  value={player.slg?.toFixed(3) || ".000"}
                />
                <StatItem label="BB" value={player.bb || 0} />
                <StatItem label="SO" value={player.so || 0} />
                <StatItem label="SB" value={player.sb || 0} />
                <StatItem label="GP" value={player.gp || 0} />
              </div>
            </div>
          )}

          {/* Pitching Stats */}
          {hasPitchingStats && (
            <div>
              <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Pitching Statistics
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <StatItem
                  label="ERA"
                  value={player.era?.toFixed(2) || "0.00"}
                />
                <StatItem label="W" value={player.w || 0} />
                <StatItem label="L" value={player.l || 0} />
                <StatItem label="SV" value={player.sv || 0} />
                <StatItem label="G" value={player.g || 0} />
                <StatItem label="GS" value={player.gs || 0} />
                <StatItem label="IP" value={player.ip || 0} />
                <StatItem label="SO" value={player.p_so || 0} />
                <StatItem label="H" value={player.p_h || 0} />
                <StatItem label="ER" value={player.er || 0} />
                <StatItem label="BB" value={player.p_bb || 0} />
                <StatItem label="HBP" value={player.p_hbp || 0} />
              </div>
            </div>
          )}

          {!hasBattingStats && !hasPitchingStats && (
            <p className="text-gray-600 text-center py-4">
              No 2025 stats available for this player.
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

/**
 * Leaderboard Results - Shows ranking of multiple players
 */
function LeaderboardResults({ results, type, stat }) {
  const isBatting = type === "batting_stat";

  return (
    <div className="space-y-2">
      {results.map((player, idx) => (
        <Card key={idx} className="hover:shadow-md transition-shadow">
          <CardBody className="py-3">
            <div className="flex items-center gap-4">
              {/* Rank */}
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">{idx + 1}</span>
              </div>

              {/* Player Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">
                  {player.first_name} {player.last_name}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  {player.team_name}
                </p>
              </div>

              {/* Primary Stat */}
              <div className="flex-shrink-0 text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  {stat?.toUpperCase() || "Stat"}
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatStatValue(player[stat], stat)}
                </p>
              </div>

              {/* Additional Stats */}
              {isBatting ? (
                <div className="hidden md:flex gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">HR:</span>
                    <span className="ml-1 font-semibold">{player.hr || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">RBI:</span>
                    <span className="ml-1 font-semibold">
                      {player.rbi || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">H:</span>
                    <span className="ml-1 font-semibold">{player.h || 0}</span>
                  </div>
                </div>
              ) : (
                <div className="hidden md:flex gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">W:</span>
                    <span className="ml-1 font-semibold">{player.w || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">SO:</span>
                    <span className="ml-1 font-semibold">{player.so || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">IP:</span>
                    <span className="ml-1 font-semibold">{player.ip || 0}</span>
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

/**
 * Single Stat Display Item
 */
function StatItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-lg font-bold text-gray-900">{value}</p>
    </div>
  );
}

/**
 * Format stat values based on type
 */
function formatStatValue(value, stat) {
  if (value === null || value === undefined) return "—";

  if (stat === "avg" || stat === "obp" || stat === "slg") {
    return value.toFixed(3);
  }

  if (stat === "era") {
    return value.toFixed(2);
  }

  return value;
}
