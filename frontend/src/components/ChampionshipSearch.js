import React, { useState } from "react";
import { Search as SearchIcon, Loader } from "lucide-react";
import { useSearch } from "../hooks/useSearch";

function ChampionshipSearch() {
  const [query, setQuery] = useState("");
  const { search, loading, error, result } = useSearch();

  const handleSubmit = (e) => {
    e.preventDefault();
    search(query);
  };

  const exampleQueries = [
    "Who won the most consecutive championships?",
    "Who has the highest batting average?",
    "How many championships has Santa Barbara won?",
    "Who hit the most home runs?",
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold inline-block mb-3">
        TOURNAMENT DATABASE SEARCH
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Search Championship History
      </h3>
      <p className="text-gray-600 mb-6">
        Query 90 years of tournament data, records, and statistics
      </p>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="relative mb-4">
            <SearchIcon
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your question about NBC World Series history..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={18} />
                Searching...
              </>
            ) : (
              <>
                <SearchIcon size={18} />
                Search Database
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <div className="text-red-600 font-semibold text-sm">
              Search Error
            </div>
          </div>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && result.success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-900 whitespace-pre-wrap">{result.answer}</p>
          </div>
          {result.data && result.data.length > 0 && (
            <div className="mt-4 text-xs text-gray-500">
              Found {result.data.length} result
              {result.data.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      )}

      {/* Example Queries */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Example Queries:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {exampleQueries.map((example, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(example)}
              className="text-left text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChampionshipSearch;
