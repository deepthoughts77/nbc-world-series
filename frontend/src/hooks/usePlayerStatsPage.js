// frontend/src/hooks/usePlayerStatsPage.js
import { useState, useEffect } from "react";
import { API } from "../api";

// helper: supports both array responses and { data: [...] } wrappers
function pickArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.rows)) return payload.rows;
  if (Array.isArray(payload?.records)) return payload.records;
  return [];
}

export function usePlayerStatsPage() {
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [battingRows, setBattingRows] = useState([]);
  const [pitchingRows, setPitchingRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Load available years
  useEffect(() => {
    let stop = false;

    async function loadYears() {
      try {
        const res = await API.get("/player-stats/years");
        if (stop) return;

        const ys = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.years)
            ? res.data.years
            : [];

        const nums = ys
          .map((y) => Number(y))
          .filter((n) => Number.isFinite(n))
          .sort((a, b) => b - a);

        setAvailableYears(nums);
        if (nums.length > 0) setSelectedYear(nums[0]);
      } catch (e) {
        console.error("Error loading player-stats years:", e);
        if (!stop) setErr("Could not load available years.");
      }
    }

    loadYears();
    return () => {
      stop = true;
    };
  }, []);

  // Load stats whenever selectedYear changes
  useEffect(() => {
    if (!selectedYear) return;
    let stop = false;

    async function loadStats() {
      setLoading(true);
      setErr("");

      try {
        // Batting rows come from /api/player-stats/:year (playerStatsController.js)
        const battingRes = await API.get(`/player-stats/${selectedYear}`);

        // Pitching rows come from your existing /api/pitching-stats?year=YYYY route
        const pitchingRes = await API.get("/pitching-stats", {
          params: { year: selectedYear },
        });

        if (stop) return;

        setBattingRows(pickArray(battingRes.data));
        setPitchingRows(pickArray(pitchingRes.data));
      } catch (e) {
        console.error("Error loading player stats:", e);
        if (!stop) setErr(`Could not load player stats for ${selectedYear}.`);
      } finally {
        if (!stop) setLoading(false);
      }
    }

    loadStats();
    return () => {
      stop = true;
    };
  }, [selectedYear]);

  return {
    availableYears,
    selectedYear,
    setSelectedYear,
    battingRows,
    pitchingRows,
    loading,
    err,
  };
}
