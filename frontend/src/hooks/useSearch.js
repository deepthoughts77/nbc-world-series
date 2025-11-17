import { useState } from "react";
import { API } from "../api/apiClient";

export function useSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const search = async (query) => {
    if (!query || !query.trim()) {
      setError("Please enter a search query");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await API.post("/search/ask", { question: query });
      setResult(response.data);
    } catch (err) {
      console.error("Search error:", err);
      setError(err.response?.data?.error || "Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setResult(null);
    setError(null);
  };

  return { search, loading, error, result, clear };
}
