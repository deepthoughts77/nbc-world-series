// Hook to fetch championship details for a given year
import { useState, useEffect } from "react";
import { API } from "../api/apiClient";

export function useChampionshipDetail(year) {
  const [champ, setChamp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!year) return; // Don't fetch if no year
    let stop = false;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await API.get(`/championships/${year}`);
        if (!stop) {
          setChamp(res.data.data);
        }
      } catch (e) {
        if (!stop) setErr("Could not load championship details.");
        console.error(e);
      } finally {
        if (!stop) setLoading(false);
      }
    }
    load();
    return () => {
      stop = true;
    };
  }, [year]);

  return { champ, loading, err };
}
