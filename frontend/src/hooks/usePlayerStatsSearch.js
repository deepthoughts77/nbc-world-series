// src/hooks/usePlayerStatsSearch.js
import { useQuery } from "@tanstack/react-query";
import { API } from "../api/apiClient";

const fetchPlayerStatsSearch = async (query) => {
  const res = await API.get("/player-stats/search", {
    params: { q: query },
  });

  // your API wrapper usually returns { data: {...} }
  return res.data.data || [];
};

export function usePlayerStatsSearch(query) {
  return useQuery({
    queryKey: ["player-stats-search", query],
    queryFn: () => fetchPlayerStatsSearch(query),
    enabled: !!query && query.trim().length > 0,
  });
}
