// frontend/src/pages/PlayerStatsPage.js
import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Search, ChevronRight, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePlayerStatsPage } from "../hooks/usePlayerStatsPage";
import { Container } from "../components/common/Container";
import { SectionTitle } from "../components/common/SectionTitle";
import { Card, CardBody } from "../components/common/Card";
import { BannerError } from "../components/common/BannerError";
import { Skeleton } from "../components/common/Skeleton";
import { PlayerStatsTable } from "../components/player-stats/PlayerStatsTable";
import { API } from "../api";

export default function PlayerStatsPage() {
  const navigate = useNavigate();

  const {
    availableYears,
    selectedYear,
    setSelectedYear,
    battingRows,
    pitchingRows,
    loading,
    err,
  } = usePlayerStatsPage();

  const [teamFilter, setTeamFilter] = useState("");
  const [search, setSearch] = useState("");
  const [expandedTeam, setExpandedTeam] = useState(null);

  // Player search state (cross-year)
  const [playerSearchQuery, setPlayerSearchQuery] = useState("");
  const [playerSearchResults, setPlayerSearchResults] = useState([]);
  const [playerSearchLoading, setPlayerSearchLoading] = useState(false);
  const [showPlayerSearch, setShowPlayerSearch] = useState(false);

  // Champion team logic
  const [championTeamName, setChampionTeamName] = useState(null);
  const hasForcedDefaultYear = useRef(false);
  const hasSetInitialExpandedTeam = useRef(false);

  // ✅ Pitching sort per team: { [teamName]: { field, dir } }
  const [pitchSortByTeam, setPitchSortByTeam] = useState({});

  // ---------- Force default year 2025 once ----------
  useEffect(() => {
    if (hasForcedDefaultYear.current) return;
    if (!availableYears || !availableYears.length) return;

    if (availableYears.includes(2025) && selectedYear !== 2025) {
      setSelectedYear(2025);
    }

    hasForcedDefaultYear.current = true;
  }, [availableYears, selectedYear, setSelectedYear]);

  // ---------- Fetch champion team for the current year ----------
  useEffect(() => {
    if (!selectedYear) return;

    async function fetchChampion() {
      try {
        const res = await API.get(`/championships/${selectedYear}`);
        const data = res.data || {};

        const name =
          data.champion_team_name ||
          data.championTeamName ||
          data.champion_team?.name ||
          data.champion_team?.team_name ||
          null;

        setChampionTeamName(name);
      } catch (e) {
        console.error("Failed to load champion for year", selectedYear, e);
        setChampionTeamName(null);
      } finally {
        hasSetInitialExpandedTeam.current = false;
      }
    }

    fetchChampion();
  }, [selectedYear]);

  // ---------- Normalize rows (don’t trust id fields blindly) ----------
  const normalizedBattingRows = useMemo(() => {
    return (battingRows || []).map((r) => ({
      ...r,
      player_name: r.player_name || r.full_name || r.name || "",
      team_name: r.team_name || r.team || "",
    }));
  }, [battingRows]);

  const normalizedPitchingRows = useMemo(() => {
    return (pitchingRows || []).map((r) => ({
      ...r,
      player_name: r.player_name || r.full_name || r.name || "",
      team_name: r.team_name || r.team || "",
    }));
  }, [pitchingRows]);

  // ---------- Team list ----------
  const allTeams = useMemo(() => {
    const s = new Set();
    normalizedBattingRows.forEach((r) => {
      if (r.team_name) s.add(r.team_name);
    });
    return Array.from(s).sort();
  }, [normalizedBattingRows]);

  // ---------- Filter + group ----------
  const teams = useMemo(() => {
    const normalize = (v) => (v ? String(v).toLowerCase() : "");
    const teamF = normalize(teamFilter);
    const q = normalize(search);

    const filteredBattingRows = normalizedBattingRows.filter((r) => {
      if (teamF && normalize(r.team_name) !== teamF) return false;
      if (!q) return true;
      const name = normalize(r.player_name);
      const pos = normalize(r.position);
      return name.includes(q) || pos.includes(q);
    });

    const byTeam = filteredBattingRows.reduce((acc, row) => {
      const key = row.team_name || "Unknown Team";
      if (!acc[key]) acc[key] = [];
      acc[key].push(row);
      return acc;
    }, {});

    return Object.entries(byTeam)
      .map(([teamName, players]) => ({ teamName, players }))
      .sort((a, b) => a.teamName.localeCompare(b.teamName));
  }, [normalizedBattingRows, teamFilter, search]);

  // ---------- Auto expand champion team ----------
  useEffect(() => {
    if (hasSetInitialExpandedTeam.current) return;
    if (!championTeamName) return;
    if (!teams || !teams.length) return;

    const match = teams.find(
      (t) => t.teamName.toLowerCase() === championTeamName.toLowerCase()
    );
    if (match) {
      setExpandedTeam(match.teamName);
      hasSetInitialExpandedTeam.current = true;
    }
  }, [championTeamName, teams]);

  // ---------- Get pitchers for a team (filtered) ----------
  const getPitchersForTeam = useCallback(
    (teamName) => {
      const normalize = (v) => (v ? String(v).toLowerCase() : "");
      const teamNameNorm = normalize(teamName);
      const teamFilterNorm = normalize(teamFilter);
      const q = normalize(search);

      return normalizedPitchingRows.filter((r) => {
        if (normalize(r.team_name) !== teamNameNorm) return false;
        if (teamFilterNorm && teamFilterNorm !== teamNameNorm) return false;
        if (!q) return true;
        return normalize(r.player_name).includes(q);
      });
    },
    [normalizedPitchingRows, teamFilter, search]
  );

  // ---------- Cross-year player search (top card) ----------
  const handlePlayerSearch = async (query) => {
    setPlayerSearchQuery(query);

    if (!query || query.length < 2) {
      setPlayerSearchResults([]);
      setShowPlayerSearch(false);
      return;
    }

    setPlayerSearchLoading(true);
    setShowPlayerSearch(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/players/search?q=${encodeURIComponent(
          query
        )}`
      );
      if (response.ok) {
        const data = await response.json();
        setPlayerSearchResults(data);
      }
    } catch (error) {
      console.error("Player search error:", error);
    } finally {
      setPlayerSearchLoading(false);
    }
  };

  const handlePlayerClickFromSearch = (playerId) => {
    navigate(`/players/${playerId}`);
  };

  // ---------- THE IMPORTANT PART: Resolve correct player id before navigating ----------
  const resolveAndNavigateToPlayer = useCallback(
    async (row) => {
      if (!row) return;

      const normalizeName = (s) =>
        String(s || "")
          .trim()
          .toLowerCase()
          .replace(/\s+/g, " ");

      const nameMatches = (rowName, apiName) => {
        const a = normalizeName(rowName);
        const b = normalizeName(apiName);
        if (!a || !b) return false;
        return a === b;
      };

      const rowName = row.player_name || "";
      const candidates = [
        row.player_id,
        row.playerId,
        row.player?.id,
        row.id,
      ].filter(Boolean);

      // 1) Try candidate ids but VERIFY against /players/:id name
      for (const id of candidates) {
        try {
          const res = await fetch(
            `${process.env.REACT_APP_API_URL}/players/${id}`
          );
          if (!res.ok) continue;
          const data = await res.json();

          const apiFullName =
            data.full_name ||
            data.player?.full_name ||
            (data.first_name && data.last_name
              ? `${data.first_name} ${data.last_name}`
              : "") ||
            (data.player?.first_name && data.player?.last_name
              ? `${data.player.first_name} ${data.player.last_name}`
              : "");

          if (nameMatches(rowName, apiFullName)) {
            navigate(`/players/${id}`);
            return;
          }
        } catch (e) {}
      }

      // 2) Fallback: use /players/search?q=NAME and pick best exact match
      try {
        const res = await fetch(
          `${
            process.env.REACT_APP_API_URL
          }/players/search?q=${encodeURIComponent(rowName)}`
        );
        if (!res.ok) return;

        const list = await res.json();
        if (!Array.isArray(list) || list.length === 0) return;

        const exact = list.find((p) =>
          nameMatches(
            rowName,
            p.full_name || `${p.first_name || ""} ${p.last_name || ""}`.trim()
          )
        );

        const pick = exact || list[0];
        if (pick?.id) {
          navigate(`/players/${pick.id}`);
        }
      } catch (e) {
        console.error("Could not resolve player id for:", rowName, e);
      }
    },
    [navigate]
  );

  const handleYearChange = (e) => {
    const value = e.target.value || null;
    setSelectedYear(value ? Number(value) : null);
    setTeamFilter("");
    setSearch("");
    setExpandedTeam(null);

    // optional: reset pitching sorts when changing year
    setPitchSortByTeam({});
  };

  const noData =
    !normalizedBattingRows.length && !normalizedPitchingRows.length;

  // =========================
  // ✅ Pitching sorting helpers
  // =========================
  const pitchingNumericFields = useMemo(
    () => [
      "jersey_num",
      "era",
      "w",
      "l",
      "app",
      "gs",
      "cg",
      "sho",
      "cbo",
      "sv",
      "ip",
      "h",
      "r",
      "er",
      "bb",
      "so",
      "doubles",
      "triples",
      "hr",
      "ab",
      "b_avg",
      "wp",
      "hbp",
      "bk",
      "sfa",
      "sha",
    ],
    []
  );

  const pitIsNumeric = useCallback(
    (field) => pitchingNumericFields.includes(field),
    [pitchingNumericFields]
  );

  const pitGetValue = useCallback((p, field) => {
    switch (field) {
      case "player_name":
        return p.player_name || "";
      case "jersey_num":
        return p.jersey_num;
      case "doubles":
        return p.doubles ?? p["2b"];
      case "triples":
        return p.triples ?? p["3b"];
      default:
        return p[field];
    }
  }, []);

  const pitToNumber = useCallback((v) => {
    if (v === null || v === undefined || v === "" || v === "—") return NaN;
    if (typeof v === "string" && v.toLowerCase().includes("inf"))
      return Infinity;
    if (typeof v === "number") return v;
    const n = parseFloat(v);
    return Number.isNaN(n) ? NaN : n;
  }, []);

  const getPitchSortSpec = useCallback(
    (teamName) => pitchSortByTeam[teamName] || { field: "era", dir: "asc" },
    [pitchSortByTeam]
  );

  const pitchArrow = useCallback(
    (teamName, field) => {
      const spec = getPitchSortSpec(teamName);
      if (spec.field !== field) return "";
      return spec.dir === "desc" ? "▼" : "▲";
    },
    [getPitchSortSpec]
  );

  const handlePitchSort = useCallback(
    (teamName, field) => {
      setPitchSortByTeam((prev) => {
        const current = prev[teamName] || { field: "era", dir: "asc" };

        // toggle
        if (current.field === field) {
          const nextDir = current.dir === "asc" ? "desc" : "asc";
          return { ...prev, [teamName]: { field, dir: nextDir } };
        }

        // new field default direction
        let dir = "asc";
        if (field === "era") dir = "asc"; // lower ERA better
        else dir = pitIsNumeric(field) ? "desc" : "asc";

        return { ...prev, [teamName]: { field, dir } };
      });
    },
    [pitIsNumeric]
  );

  const sortPitchers = useCallback(
    (pitchers, spec) => {
      if (!pitchers || pitchers.length === 0) return [];
      const list = [...pitchers];
      const numeric = pitIsNumeric(spec.field);

      list.sort((a, b) => {
        const aRaw = pitGetValue(a, spec.field);
        const bRaw = pitGetValue(b, spec.field);

        const aMissing =
          aRaw === null || aRaw === undefined || aRaw === "" || aRaw === "—";
        const bMissing =
          bRaw === null || bRaw === undefined || bRaw === "" || bRaw === "—";

        if (aMissing && bMissing) return 0;
        if (aMissing) return 1;
        if (bMissing) return -1;

        let cmp;
        if (numeric) {
          const aNum = pitToNumber(aRaw);
          const bNum = pitToNumber(bRaw);

          if (Number.isNaN(aNum) && Number.isNaN(bNum)) cmp = 0;
          else if (Number.isNaN(aNum)) cmp = 1;
          else if (Number.isNaN(bNum)) cmp = -1;
          else cmp = aNum - bNum;
        } else {
          cmp = String(aRaw).localeCompare(String(bRaw));
        }

        return spec.dir === "asc" ? cmp : -cmp;
      });

      return list;
    },
    [pitGetValue, pitIsNumeric, pitToNumber]
  );

  return (
    <Container className="py-12">
      <SectionTitle
        eyebrow="Box Scores"
        title="Player Statistics"
        desc="Detailed individual player statistics by team and year. Data currently available for 2020 through 2025."
      />

      {/* Cross-Year Player Search */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex items-center gap-2 mb-3">
            <User size={20} className="text-blue-600" />
            <h3 className="font-bold text-gray-900">Find Player History</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Search for any player to see their complete NBC World Series history
            across all years.
          </p>
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={playerSearchQuery}
              onChange={(e) => handlePlayerSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by player name (e.g., 'Jake Gutierrez')"
            />
          </div>

          {showPlayerSearch && (
            <div className="mt-4">
              {playerSearchLoading ? (
                <div className="text-center py-4 text-gray-600">
                  Searching...
                </div>
              ) : playerSearchResults.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-2">
                    Found {playerSearchResults.length} player
                    {playerSearchResults.length !== 1 ? "s" : ""}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                    {playerSearchResults.map((player) => (
                      <button
                        key={player.id}
                        onClick={() => handlePlayerClickFromSearch(player.id)}
                        className="flex items-center gap-2 p-3 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <User size={16} className="text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {player.full_name ||
                            `${player.first_name} ${player.last_name}`}
                        </span>
                        <ChevronRight
                          size={16}
                          className="ml-auto text-gray-400"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-600">
                  No players found matching "{playerSearchQuery}"
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Controls */}
      <Card className="mb-6">
        <CardBody className="flex flex-wrap gap-4 items-end">
          <div>
            <label
              htmlFor="year-select"
              className="block text-xs font-semibold text-gray-600 mb-1"
            >
              Year
            </label>
            <select
              id="year-select"
              value={selectedYear ?? ""}
              onChange={handleYearChange}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="team-select"
              className="block text-xs font-semibold text-gray-600 mb-1"
            >
              Team
            </label>
            <select
              id="team-select"
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              disabled={loading || allTeams.length === 0}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm min-w-[180px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All teams</option>
              {allTeams.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[180px]">
            <label
              htmlFor="player-search"
              className="block text-xs font-semibold text-gray-600 mb-1"
            >
              Filter {selectedYear} players
            </label>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                id="player-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={loading}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Filter by name or position"
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {err && (
        <div className="mb-4">
          <BannerError message={err} />
        </div>
      )}

      {loading && (
        <div className="space-y-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      )}

      {!loading && !err && noData && (
        <Card>
          <CardBody>
            <p className="text-gray-600 text-center py-8">
              No player stats found for {selectedYear}.
            </p>
          </CardBody>
        </Card>
      )}

      {!loading && !err && !noData && teams.length === 0 && (
        <Card>
          <CardBody>
            <p className="text-gray-600 text-center py-8">
              No player stats found for {selectedYear}
              {teamFilter ? ` (${teamFilter})` : ""}
              {search ? ` matching "${search}"` : ""}.
            </p>
          </CardBody>
        </Card>
      )}

      {!loading && teams.length > 0 && (
        <div className="space-y-6">
          {teams.map((team) => {
            const isOpen = expandedTeam === team.teamName;
            const pitchers = getPitchersForTeam(team.teamName);

            // ✅ sorted version for THIS team's pitching table
            const pitSpec = getPitchSortSpec(team.teamName);
            const sortedPitchers = sortPitchers(pitchers, pitSpec);

            const battingTotals = team.players.reduce(
              (acc, p) => {
                const toNum = (v) =>
                  typeof v === "number" ? v : parseInt(v, 10) || 0;
                acc.ab += toNum(p.ab);
                acc.h += toNum(p.h);
                acc.hr += toNum(p.hr);
                acc.rbi += toNum(p.rbi);
                return acc;
              },
              { ab: 0, h: 0, hr: 0, rbi: 0 }
            );

            const avg =
              battingTotals.ab > 0
                ? (battingTotals.h / battingTotals.ab).toFixed(3).slice(1)
                : "---";

            const isChampion =
              championTeamName &&
              team.teamName.toLowerCase() === championTeamName.toLowerCase();

            return (
              <Card key={team.teamName} className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedTeam(isOpen ? null : team.teamName)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors border-b border-gray-200"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold text-gray-900">
                        {team.teamName}
                      </div>
                      {isChampion && (
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-[11px] font-semibold text-yellow-800">
                          {selectedYear} Champion
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1">
                      Team totals – AB {battingTotals.ab}, H {battingTotals.h},
                      HR {battingTotals.hr}, RBI {battingTotals.rbi}, AVG .{avg}
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className={`text-gray-400 transform transition-transform ${
                      isOpen ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div>
                    {/* Batting */}
                    <PlayerStatsTable
                      players={team.players}
                      onPlayerClick={resolveAndNavigateToPlayer}
                    />

                    {/* Pitching */}
                    {pitchers.length > 0 && (
                      <div className="mt-6 border-t border-gray-200 pt-4">
                        <div className="px-6 mb-3">
                          <h3 className="text-sm font-bold text-gray-700">
                            Pitchers
                          </h3>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[1800px] text-xs md:text-sm">
                            <thead className="bg-gray-50">
                              <tr className="border-b border-gray-200 text-gray-700">
                                <th
                                  className="px-4 py-2 text-left font-semibold sticky left-0 bg-gray-50 z-10 cursor-pointer"
                                  onClick={() =>
                                    handlePitchSort(
                                      team.teamName,
                                      "player_name"
                                    )
                                  }
                                >
                                  <span className="inline-flex items-center">
                                    Pitcher{" "}
                                    {pitchArrow(
                                      team.teamName,
                                      "player_name"
                                    ) && (
                                      <span className="ml-0.5 text-[10px]">
                                        {pitchArrow(
                                          team.teamName,
                                          "player_name"
                                        )}
                                      </span>
                                    )}
                                  </span>
                                </th>

                                <th
                                  className="px-2 py-2 text-center font-semibold cursor-pointer"
                                  onClick={() =>
                                    handlePitchSort(team.teamName, "jersey_num")
                                  }
                                >
                                  <span className="inline-flex items-center">
                                    No.{" "}
                                    {pitchArrow(
                                      team.teamName,
                                      "jersey_num"
                                    ) && (
                                      <span className="ml-0.5 text-[10px]">
                                        {pitchArrow(
                                          team.teamName,
                                          "jersey_num"
                                        )}
                                      </span>
                                    )}
                                  </span>
                                </th>

                                {[
                                  ["era", "ERA"],
                                  ["w", "W"],
                                  ["l", "L"],
                                  ["app", "APP"],
                                  ["gs", "GS"],
                                  ["cg", "CG"],
                                  ["sho", "SHO"],
                                  ["cbo", "CBO"],
                                  ["sv", "SV"],
                                  ["ip", "IP"],
                                  ["h", "H"],
                                  ["r", "R"],
                                  ["er", "ER"],
                                  ["bb", "BB"],
                                  ["so", "SO"],
                                  ["doubles", "2B"],
                                  ["triples", "3B"],
                                  ["hr", "HR"],
                                  ["ab", "AB"],
                                  ["b_avg", "B/Avg"],
                                  ["wp", "WP"],
                                  ["hbp", "HBP"],
                                  ["bk", "BK"],
                                  ["sfa", "SFA"],
                                  ["sha", "SHA"],
                                ].map(([field, label]) => (
                                  <th
                                    key={field}
                                    className="px-2 py-2 text-right font-semibold cursor-pointer"
                                    onClick={() =>
                                      handlePitchSort(team.teamName, field)
                                    }
                                  >
                                    <span className="inline-flex items-center">
                                      {label}{" "}
                                      {pitchArrow(team.teamName, field) && (
                                        <span className="ml-0.5 text-[10px]">
                                          {pitchArrow(team.teamName, field)}
                                        </span>
                                      )}
                                    </span>
                                  </th>
                                ))}
                              </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                              {sortedPitchers.map((p, idx) => {
                                const formatBAvg = (val) => {
                                  if (val === null || val === undefined)
                                    return "—";
                                  const num = Number(val);
                                  if (Number.isNaN(num)) return val;
                                  return num.toFixed(3).slice(1);
                                };

                                const formatEra = (val) => {
                                  if (val === null || val === undefined)
                                    return "—";
                                  if (
                                    typeof val === "string" &&
                                    val.toLowerCase().includes("inf")
                                  )
                                    return "∞";
                                  const num = Number(val);
                                  if (Number.isNaN(num)) return val;
                                  return num.toFixed(2);
                                };

                                const safeDisplay = (val) => {
                                  if (val === null || val === undefined)
                                    return "—";
                                  return val;
                                };

                                return (
                                  <tr
                                    key={
                                      p.id ??
                                      p.player_id ??
                                      p.player_name ??
                                      idx
                                    }
                                    className={
                                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    }
                                  >
                                    <td className="px-4 py-1.5 font-medium sticky left-0 bg-inherit">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          resolveAndNavigateToPlayer(p)
                                        }
                                        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors text-left"
                                      >
                                        {p.player_name}
                                      </button>
                                    </td>

                                    <td className="px-2 py-1.5 text-center">
                                      {p.jersey_num || "—"}
                                    </td>

                                    <td className="px-2 py-1.5 text-right font-medium text-blue-600">
                                      {formatEra(p.era)}
                                    </td>
                                    <td className="px-2 py-1.5 text-right">
                                      {safeDisplay(p.w)}
                                    </td>
                                    <td className="px-2 py-1.5 text-right">
                                      {safeDisplay(p.l)}
                                    </td>
                                    <td className="px-2 py-1.5 text-right">
                                      {safeDisplay(p.app)}
                                    </td>
                                    <td className="px-2 py-1.5 text-right">
                                      {safeDisplay(p.gs)}
                                    </td>
                                    <td className="px-2 py-1.5 text-right">
                                      {safeDisplay(p.cg)}
                                    </td>
                                    <td className="px-2 py-1.5 text-right">
                                      {safeDisplay(p.sho)}
                                    </td>
                                    <td className="px-2 py-1.5 text-right">
                                      {safeDisplay(p.cbo)}
                                    </td>
                                    <td className="px-2 py-1.5 text-right">
                                      {safeDisplay(p.sv)}
                                    </td>
                                    <td className="px-2 py-1.5 text-right">
                                      {safeDisplay(p.ip)}
                                    </td>
                                    <td className="px-2 py-1.5 text-right">
                                      {safeDisplay(p.h)}
                                    </td>
                                    <td className="px-2 py-1.5 text-right">
                                      {safeDisplay(p.r)}
                                    </td>
                                    <td className="px-2 py-1.5 text-right">
                                      {safeDisplay(p.er)}
                                    </td>
                                    <td className="px-2 py-1.5 text-right">
                                      {safeDisplay(p.bb)}
                                    </td>
                                    <td className="px-2 py-1.5 text-right">
                                      {safeDisplay(p.so)}
                                    </td>
                                    <td className="px-2 py-1.5 text-right">
                                      {safeDisplay(p.doubles || p["2b"])}
                                    </td>
                                    <td className="px-2 py-1.5 text-right">
                                      {safeDisplay(p.triples || p["3b"])}
                                    </td>
                                    <td className="px-2 py-1.5 text-right">
                                      {safeDisplay(p.hr)}
                                    </td>
                                    <td className="px-2 py-1.5 text-right">
                                      {safeDisplay(p.ab)}
                                    </td>
                                    <td className="px-2 py-1.5 text-right">
                                      {formatBAvg(p.b_avg)}
                                    </td>
                                    <td className="px-2 py-1.5 text-right">
                                      {safeDisplay(p.wp)}
                                    </td>
                                    <td className="px-2 py-1.5 text-right">
                                      {safeDisplay(p.hbp)}
                                    </td>
                                    <td className="px-2 py-1.5 text-right">
                                      {safeDisplay(p.bk)}
                                    </td>
                                    <td className="px-2 py-1.5 text-right">
                                      {safeDisplay(p.sfa)}
                                    </td>
                                    <td className="px-2 py-1.5 text-right">
                                      {safeDisplay(p.sha)}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>

                          {/* tiny helper line so you can see current sort while testing */}
                          {/* <div className="px-6 py-2 text-xs text-gray-400">
                            Sorting: {pitSpec.field} ({pitSpec.dir})
                          </div> */}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </Container>
  );
}
