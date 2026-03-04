// frontend/src/hooks/useTeamDetail.js
import { useEffect, useMemo, useRef, useState } from "react";
import { API } from "../api";

/**
 * Team detail loader:
 * - Team record (best-effort; supports multiple backend shapes)
 * - Championship history (best-effort)
 * - Years = union(player-stats years + championship years)
 * - Stats are loaded ONLY for selectedYear (batting/pitching), using player-stats endpoints first
 */

const uniqSortedNums = (arr) => {
  const set = new Set();
  (arr || []).forEach((x) => {
    const n = Number(x);
    if (!Number.isNaN(n) && Number.isFinite(n)) set.add(n);
  });
  return Array.from(set).sort((a, b) => a - b);
};

const pickArray = (res) => {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.data)) return d.data;
  if (Array.isArray(d?.rows)) return d.rows;
  return [];
};

async function safeGet(url, config) {
  try {
    return await API.get(url, config);
  } catch (e) {
    return null;
  }
}

async function loadTeamByName(name) {
  // Try a few patterns so you stop getting 404 if the backend route differs.
  const enc = encodeURIComponent(name);

  // 1) /teams/by-name/:name
  let res = await safeGet(`/teams/by-name/${enc}`);
  if (res?.data) return res.data?.data ?? res.data;

  // 2) /teams/by-name?name=
  res = await safeGet(`/teams/by-name`, { params: { name } });
  if (res?.data) return res.data?.data ?? res.data;

  // 3) /teams/search?name=
  res = await safeGet(`/teams/search`, { params: { name } });
  if (res?.data) {
    const arr = pickArray(res);
    if (arr[0]) return arr[0];
  }

  // Fallback minimal team object (so page doesn’t crash)
  return { id: null, name };
}

async function loadChampionships(team) {
  const teamId = team?.id;

  // Prefer team-id endpoint if available
  if (teamId != null) {
    const res = await safeGet(`/teams/${teamId}/championships`);
    if (res) return pickArray(res);
  }

  // Fallback: try name-based endpoint patterns
  let res = await safeGet(`/teams/championships`, {
    params: { team: team?.name },
  });
  if (res) return pickArray(res);

  res = await safeGet(`/championships`, { params: { team: team?.name } });
  if (res) return pickArray(res);

  return [];
}

async function loadPlayerStatsYears(teamName) {
  // Ideal: a dedicated endpoint
  let res = await safeGet(`/player-stats/years`, {
    params: { team: teamName },
  });
  if (res) {
    const arr = pickArray(res);
    if (arr.length) return uniqSortedNums(arr);
  }

  // Fallback: if you only have 2020-2025 data, test those years by checking if batting/pitching returns any rows
  const candidates = [2020, 2021, 2022, 2023, 2024, 2025];
  const hits = [];

  for (const y of candidates) {
    // try batting only to keep it light
    // if backend doesn’t support it, this just returns null and we skip
    // (still okay)
    // eslint-disable-next-line no-await-in-loop
    const bat = await safeGet(`/player-stats/batting`, {
      params: { team: teamName, year: y },
    });
    const rows = pickArray(bat);
    if (rows.length) hits.push(y);
  }

  return uniqSortedNums(hits);
}

async function loadStatsForYear({ teamId, teamName, year }) {
  // Use Player Stats endpoints FIRST (same source as PlayerStatsPage)
  let bat = await safeGet(`/player-stats/batting`, {
    params: { team: teamName, year },
  });
  let pit = await safeGet(`/player-stats/pitching`, {
    params: { team: teamName, year },
  });

  // Fallback to team-id endpoints if you have them
  if ((!bat || pickArray(bat).length === 0) && teamId != null) {
    bat = await safeGet(`/teams/${teamId}/batting`, { params: { year } });
  }
  if ((!pit || pickArray(pit).length === 0) && teamId != null) {
    pit = await safeGet(`/teams/${teamId}/pitching`, { params: { year } });
  }

  return {
    batting: pickArray(bat),
    pitching: pickArray(pit),
  };
}

export function useTeamDetail(teamName) {
  const [team, setTeam] = useState(null);
  const [championships, setChampionships] = useState([]);
  const [years, setYears] = useState([]);

  const [selectedYear, setSelectedYear] = useState(null);
  const [tab, setTab] = useState("batting");

  const [batting, setBatting] = useState([]);
  const [pitching, setPitching] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [err, setErr] = useState("");

  const activeReq = useRef(0);

  const champByYear = useMemo(() => {
    const map = new Map();
    (championships || []).forEach((c) => {
      const y = Number(c?.year);
      if (!Number.isNaN(y)) map.set(y, c);
    });
    return map;
  }, [championships]);

  // Initial load: team + championships + years union
  useEffect(() => {
    const name = (teamName || "").trim();
    if (!name) {
      setLoading(false);
      setErr("Missing team name.");
      return;
    }

    let cancelled = false;
    const reqId = ++activeReq.current;

    async function load() {
      setLoading(true);
      setErr("");

      try {
        const t = await loadTeamByName(name);
        if (cancelled || activeReq.current !== reqId) return;
        setTeam(t);

        const champs = await loadChampionships(t);
        if (cancelled || activeReq.current !== reqId) return;
        setChampionships(champs);

        const champYears = uniqSortedNums(champs.map((c) => c?.year));
        const statYears = await loadPlayerStatsYears(t?.name || name);
        if (cancelled || activeReq.current !== reqId) return;

        const unionYears = uniqSortedNums([
          ...(statYears || []),
          ...(champYears || []),
        ]);
        setYears(unionYears);

        // Default selected year:
        // - prefer most recent available union year
        // - else null
        const latest = unionYears.length
          ? unionYears[unionYears.length - 1]
          : null;
        setSelectedYear(latest);
      } catch (e) {
        if (cancelled || activeReq.current !== reqId) return;
        console.error("useTeamDetail load error:", e);
        setErr("Failed to load team details.");
      } finally {
        if (!cancelled && activeReq.current === reqId) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [teamName]);

  // Load stats ONLY for selectedYear
  useEffect(() => {
    const name = (team?.name || teamName || "").trim();
    if (!name || !selectedYear) {
      setBatting([]);
      setPitching([]);
      return;
    }

    let cancelled = false;
    const reqId = ++activeReq.current;

    async function loadStats() {
      setStatsLoading(true);
      try {
        const res = await loadStatsForYear({
          teamId: team?.id ?? null,
          teamName: name,
          year: Number(selectedYear),
        });
        if (cancelled || activeReq.current !== reqId) return;

        setBatting(Array.isArray(res.batting) ? res.batting : []);
        setPitching(Array.isArray(res.pitching) ? res.pitching : []);
      } catch (e) {
        if (cancelled || activeReq.current !== reqId) return;
        console.error("useTeamDetail stats error:", e);
        setBatting([]);
        setPitching([]);
      } finally {
        if (!cancelled && activeReq.current === reqId) setStatsLoading(false);
      }
    }

    loadStats();

    return () => {
      cancelled = true;
    };
  }, [team?.id, team?.name, teamName, selectedYear]);

  return {
    team,
    championships,
    years,
    champByYear,

    selectedYear,
    setSelectedYear,
    tab,
    setTab,

    batting,
    pitching,
    loading,
    statsLoading,
    err,
  };
}
