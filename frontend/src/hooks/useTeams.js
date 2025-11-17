import { useState, useEffect } from "react";
import { API } from "../api/apiClient";
import { pickArray } from "../utils/data";

export function useTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let stop = false;
    API.get("/teams")
      .then((res) => !stop && setTeams(pickArray(res)))
      .catch((e) => {
        setErr("We couldn't load teams at the moment.");
        console.error(e);
      })
      .finally(() => !stop && setLoading(false));
    return () => {
      stop = true;
    };
  }, []);

  return { teams, loading, err };
}
