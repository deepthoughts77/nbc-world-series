import { useState, useEffect } from "react";
import { API } from "../api/apiClient";
import { pickArray } from "../utils/data";

export function useHome() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let stop = false;
    async function load() {
      try {
        const [s, c] = await Promise.all([
          API.get("/statistics/overview"),
          API.get("/championships"),
        ]);
        if (stop) return;
        setStats(s.data || {});
        setRecent(pickArray(c).slice(0, 3));
      } catch (e) {
        setErr("We couldn't load the latest overview. Please try again.");
        console.error("Home load error:", e);
      } finally {
        if (!stop) setLoading(false);
      }
    }
    load();
    return () => {
      stop = true;
    };
  }, []);

  return { stats, recent, loading, err };
}
