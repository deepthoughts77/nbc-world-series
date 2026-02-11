// frontend/src/hooks/useChampionships.js
import { useEffect, useState } from "react";
import { API } from "../api/apiClient";

// helper: supports both array responses and { data: [...] } wrappers
function pickArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.rows)) return payload.rows;
  return [];
}

export function useChampionships() {
  const [years, setYears] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    async function run() {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        const res = await API.get("/championships");
        const arr = pickArray(res.data);

        if (!alive) return;
        setYears(arr);
      } catch (e) {
        if (!alive) return;
        setIsError(true);
        setError(e);
        setYears([]);
      } finally {
        if (!alive) return;
        setIsLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, []);

  return {
    years,
    isLoading,
    isError,
    error: error || { message: "Unknown error" },
  };
}
