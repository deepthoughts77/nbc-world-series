import { useState, useEffect } from "react";
import { API } from "../api/apiClient";
import { pickArray } from "../utils/data";

export function useTeamDetail(teamName) {
  const [team, setTeam] = useState(null);
  const [championships, setChampionships] = useState([]);
  const [playerStats, setPlayerStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!teamName) return; // Don't run if teamName isn't set
    let stop = false;

    async function load() {
      setLoading(true);
      setErr("");

      try {
        const [teamsRes, champsRes, statsRes] = await Promise.all([
          API.get("/teams"),
          API.get("/championships"),
          API.get("/player-stats", { params: { year: 1966 } }), // for now only 1966
        ]);

        if (stop) return;

        const teams = pickArray(teamsRes);
        const allChamps = pickArray(champsRes);
        const allStats = pickArray(statsRes);

        const t = teams.find(
          (x) => (x.name || "").toLowerCase() === teamName.toLowerCase()
        );
        setTeam(t || { name: teamName });

        const relatedChamps = allChamps.filter((c) => {
          const champ = (c.champion_name || c.champion || "").toLowerCase();
          const runner = (c.runner_up_name || c.runner_up || "").toLowerCase();
          const name = teamName.toLowerCase();
          return champ.includes(name) || runner.includes(name);
        });
        setChampionships(relatedChamps);

        const stats = allStats.filter(
          (s) => (s.team_name || "").toLowerCase() === teamName.toLowerCase()
        );
        setPlayerStats(stats);
      } catch (e) {
        console.error("TeamDetail load error:", e);
        setErr("Could not load team details.");
      } finally {
        if (!stop) setLoading(false);
      }
    }

    load();
    return () => {
      stop = true;
    };
  }, [teamName]);

  return { team, championships, playerStats, loading, err };
}
