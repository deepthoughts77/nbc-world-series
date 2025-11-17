import { useState, useEffect } from "react";
import { API } from "../api/apiClient";
import { pickArray } from "../utils/data";

export function useHallOfFame() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let stop = false;
    API.get("/hall-of-fame")
      .then((r) => !stop && setMembers(pickArray(r)))
      .catch((e) => {
        setErr("Unable to load Hall of Fame members.");
        console.error(e);
      })
      .finally(() => !stop && setLoading(false));
    return () => {
      stop = true;
    };
  }, []);

  return { members, loading, err };
}
