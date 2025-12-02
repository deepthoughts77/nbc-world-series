import { useState, useEffect } from "react";
import { API } from "../api/apiClient";

export function useRecords() {
  const [records, setRecords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let stop = false;

    API.get("/records/overview")
      .then((r) => !stop && setRecords(r.data))
      .catch((e) => {
        setErr("Could not load records.");
        console.error(e);
      })
      .finally(() => !stop && setLoading(false));
    return () => {
      stop = true;
    };
  }, []);

  return { records, loading, err };
}
