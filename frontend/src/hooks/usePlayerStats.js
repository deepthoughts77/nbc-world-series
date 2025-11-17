import { useState, useEffect, useMemo } from "react";
import { API } from "../api/apiClient"; // Use the central API client
import { pickArray } from "../utils/data"; // Use the central data parser

export function usePlayerStats() {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [loadingYears, setLoadingYears] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState(null);
  const [rawStats, setRawStats] = useState([]); // Store raw server response

  // Effect 1: Fetch available years on mount
  useEffect(() => {
    let stop = false;
    async function fetchYears() {
      try {
        setLoadingYears(true);
        setError(null);
        const res = await API.get("/player-stats/years");
        if (stop) return;

        const data = pickArray(res).sort((a, b) => b - a); // Sort newest first
        setYears(data);

        if (data.length > 0) {
          setSelectedYear(data[0]); // Default to most recent year
        }
      } catch (err) {
        console.error(err);
        if (!stop) setError(err.message || "Failed to load years");
      } finally {
        if (!stop) setLoadingYears(false);
      }
    }
    fetchYears();
    return () => {
      stop = true;
    };
  }, []);

  // Effect 2: Fetch stats when selectedYear changes
  useEffect(() => {
    if (!selectedYear) return;
    let stop = false;

    async function fetchStats() {
      try {
        setLoadingStats(true);
        setError(null);
        const res = await API.get("/player-stats", {
          params: { year: selectedYear },
        });
        if (stop) return;
        setRawStats(pickArray(res));
      } catch (err) {
        console.error(err);
        if (!stop) setError(err.message || "Failed to load player stats");
      } finally {
        if (!stop) setLoadingStats(false);
      }
    }
    fetchStats();
    return () => {
      stop = true;
    };
  }, [selectedYear]);

  // Memo: Process raw stats into teams only when rawStats changes
  const teams = useMemo(() => {
    const byTeam = rawStats.reduce((acc, row) => {
      const key = row.team_name || "Unknown Team";
      if (!acc[key]) acc[key] = [];
      acc[key].push(row);
      return acc;
    }, {});

    return Object.entries(byTeam)
      .map(([teamName, players]) => ({
        teamName,
        players: players.sort((a, b) =>
          (a.player_name || "").localeCompare(b.player_name || "")
        ),
      }))
      .sort((a, b) => a.teamName.localeCompare(b.teamName));
  }, [rawStats]);

  // Return everything the Page component needs
  return {
    years,
    selectedYear,
    setSelectedYear,
    loadingYears,
    loadingStats,
    error,
    teams,
  };
}
