import { useState, useEffect } from "react";
import { API } from "../api/apiClient";
import { pickArray } from "../utils/data";

export function usePlayerStatsPage() {
  const [availableYears, setAvailableYears] = useState(["1966"]);
  const [selectedYear, setSelectedYear] = useState("1966");
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
        const d = res.data;
        const ys = Array.isArray(d)
          ? d
          : Array.isArray(d?.years)
          ? d.years
          : [];

        const yStrings = ys.map(String).sort((a, b) => b.localeCompare(a));
        if (yStrings.length > 0) {
          setAvailableYears(yStrings);
          setSelectedYear(yStrings[0]); // Default to newest year
        }
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
        const [battingRes, pitchingRes] = await Promise.all([
          API.get("/player-stats", { params: { year: selectedYear } }),
          API.get("/pitching-stats", { params: { year: selectedYear } }),
        ]);
        if (stop) return;

        setBattingRows(pickArray(battingRes));
        setPitchingRows(pickArray(pitchingRes));
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
