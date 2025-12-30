// frontend/src/pages/PlayerStatsPage.js
import React, { useEffect, useMemo, useState } from "react";
import { Search, User } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { API } from "../api";
import { Container } from "../components/common/Container";
import { SectionTitle } from "../components/common/SectionTitle";
import { Card, CardBody } from "../components/common/Card";
import { BannerError } from "../components/common/BannerError";

const YEARS = [2025, 2024, 2023, 2022, 2021, 2020];

export default function PlayerStatsPage() {
  const navigate = useNavigate();

  // leaders state
  const [mode, setMode] = useState("batting"); // "batting" | "pitching"
  const [year, setYear] = useState(2025);
  const [players, setPlayers] = useState([]);
  const [teamFilter, setTeamFilter] = useState("all");
  const [sort, setSort] = useState("avg"); // batting: avg, team; pitching: era, team
  const [order, setOrder] = useState("desc");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // player history search state
  const [playerSearchQuery, setPlayerSearchQuery] = useState("");
  const [playerSearchResults, setPlayerSearchResults] = useState([]);
  const [playerSearchLoading, setPlayerSearchLoading] = useState(false);
  const [showPlayerSearch, setShowPlayerSearch] = useState(false);

  // ---------- Load leaders from backend ----------
  useEffect(() => {
    let cancelled = false;

    async function loadLeaders() {
      setLoading(true);
      setErr("");

      try {
        const endpoint =
          mode === "batting"
            ? "/players/batting-leaders"
            : "/players/pitching-leaders";

        const params = {
          year,
          sort,
          order,
        };

        if (teamFilter !== "all") {
          params.teamId = teamFilter;
        }

        const res = await API.get(endpoint, { params });

        if (!cancelled) {
          setPlayers(res.data.players || []);
        }
      } catch (e) {
        console.error("Failed to load leaders", e);
        if (!cancelled) {
          setErr("Could not load leaders. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadLeaders();
    return () => {
      cancelled = true;
    };
  }, [mode, year, sort, order, teamFilter]);

  // Unique list of teams from current results (for dropdown)
  const teamOptions = useMemo(() => {
    const map = new Map();
    players.forEach((p) => {
      if (p.team_id && p.team_name) {
        map.set(p.team_id, p.team_name);
      }
    });
    return Array.from(map.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([id, name]) => ({ id, name }));
  }, [players]);

  // ---------- Cross-year player history search ----------
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

  const handlePlayerClick = (playerId) => {
    navigate(`/players/${playerId}`);
  };

  // ---------- Sorting helpers ----------
  const handleSort = (stat) => {
    // stat can be "team", "avg", "era"
    if (sort === stat) {
      // toggle direction
      setOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSort(stat);
      // default direction based on stat
      if (stat === "era" || stat === "team") {
        setOrder("asc");
      } else {
        setOrder("desc");
      }
    }
  };

  const sortArrow =
    sort === "team" || sort === "avg" || sort === "era"
      ? order === "desc"
        ? "▼"
        : "▲"
      : "";

  const handleModeChange = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setTeamFilter("all");
    if (newMode === "batting") {
      setSort("avg");
      setOrder("desc");
    } else {
      setSort("era");
      setOrder("asc");
    }
  };

  // ---------- Render ----------
  return (
    <Container className="py-12">
      <SectionTitle
        eyebrow="Box Scores"
        title="Player Statistics – Leaders"
        desc="Sort by team, batting, or pitching statistics for each NBC World Series season."
      />

      {/* Cross-Year Player History Search */}
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
                        onClick={() => handlePlayerClick(player.id)}
                        className="flex items-center gap-2 p-3 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <User size={16} className="text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {player.full_name ||
                            `${player.first_name} ${player.last_name}`}
                        </span>
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

      {/* Filter bar (Year, Tournament, Team, Hitting/Pitching toggle) */}
      <Card className="mb-4">
        <CardBody className="flex flex-wrap items-center gap-4">
          {/* Year */}
          <div>
            <label
              htmlFor="year"
              className="block text-xs font-semibold text-gray-600 mb-1"
            >
              Year
            </label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Tournament label */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Tournament
            </label>
            <div className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50">
              NBC World Series
            </div>
          </div>

          {/* Team filter */}
          <div>
            <label
              htmlFor="team-filter"
              className="block text-xs font-semibold text-gray-600 mb-1"
            >
              Team
            </label>
            <select
              id="team-filter"
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm min-w-[180px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={teamOptions.length === 0}
            >
              <option value="all">All teams</option>
              {teamOptions.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1" />

          {/* Hitting / Pitching toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
            <button
              type="button"
              onClick={() => handleModeChange("batting")}
              className={`px-3 py-1 text-[11px] md:text-xs font-semibold rounded-full ${
                mode === "batting"
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Hitting
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("pitching")}
              className={`px-3 py-1 text-[11px] md:text-xs font-semibold rounded-full ${
                mode === "pitching"
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Pitching
            </button>
          </div>
        </CardBody>
      </Card>

      {err && (
        <div className="mb-4">
          <BannerError message={err} />
        </div>
      )}

      {/* Leaders table */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white shadow-sm">
        <table className="min-w-full text-xs md:text-sm">
          <thead className="bg-slate-900 text-slate-100">
            {mode === "batting" ? (
              <tr>
                <th className="px-3 py-2 text-left font-semibold">#</th>
                <th className="px-3 py-2 text-left font-semibold">Player</th>
                <th
                  className="px-3 py-2 text-left font-semibold cursor-pointer select-none"
                  onClick={() => handleSort("team")}
                >
                  Team{" "}
                  {sort === "team" && (
                    <span className="inline-block ml-0.5">{sortArrow}</span>
                  )}
                </th>
                <th className="px-3 py-2 text-right font-semibold">G</th>
                <th className="px-3 py-2 text-right font-semibold">AB</th>
                <th className="px-3 py-2 text-right font-semibold">R</th>
                <th className="px-3 py-2 text-right font-semibold">H</th>
                <th className="px-3 py-2 text-right font-semibold">HR</th>
                <th className="px-3 py-2 text-right font-semibold">RBI</th>
                <th
                  className="px-3 py-2 text-right font-semibold cursor-pointer select-none"
                  onClick={() => handleSort("avg")}
                >
                  AVG{" "}
                  {sort === "avg" && (
                    <span className="inline-block ml-0.5">{sortArrow}</span>
                  )}
                </th>
                <th className="px-3 py-2 text-right font-semibold">OBP</th>
                <th className="px-3 py-2 text-right font-semibold">SLG</th>
              </tr>
            ) : (
              <tr>
                <th className="px-3 py-2 text-left font-semibold">#</th>
                <th className="px-3 py-2 text-left font-semibold">Pitcher</th>
                <th
                  className="px-3 py-2 text-left font-semibold cursor-pointer select-none"
                  onClick={() => handleSort("team")}
                >
                  Team{" "}
                  {sort === "team" && (
                    <span className="inline-block ml-0.5">{sortArrow}</span>
                  )}
                </th>
                <th className="px-3 py-2 text-right font-semibold">G</th>
                <th className="px-3 py-2 text-right font-semibold">GS</th>
                <th className="px-3 py-2 text-right font-semibold">W</th>
                <th className="px-3 py-2 text-right font-semibold">L</th>
                <th className="px-3 py-2 text-right font-semibold">SV</th>
                <th className="px-3 py-2 text-right font-semibold">IP</th>
                <th className="px-3 py-2 text-right font-semibold">SO</th>
                <th
                  className="px-3 py-2 text-right font-semibold cursor-pointer select-none"
                  onClick={() => handleSort("era")}
                >
                  ERA{" "}
                  {sort === "era" && (
                    <span className="inline-block ml-0.5">{sortArrow}</span>
                  )}
                </th>
                <th className="px-3 py-2 text-right font-semibold">B/AVG</th>
              </tr>
            )}
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={12}
                  className="px-4 py-6 text-center text-slate-500"
                >
                  Loading leaders…
                </td>
              </tr>
            )}

            {!loading && !err && players.length === 0 && (
              <tr>
                <td
                  colSpan={12}
                  className="px-4 py-6 text-center text-slate-500"
                >
                  No leaders found for {year}.
                </td>
              </tr>
            )}

            {!loading &&
              !err &&
              players.map((p, idx) =>
                mode === "batting" ? (
                  <tr
                    key={`${p.player_id}-${p.team_id}-${p.year}-bat`}
                    className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
                  >
                    <td className="px-3 py-2 text-right text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <Link
                        to={`/players/${p.player_id}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {p.first_name} {p.last_name}
                      </Link>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-slate-600">
                      {p.team_name}
                    </td>
                    <td className="px-3 py-2 text-right">{p.gp}</td>
                    <td className="px-3 py-2 text-right">{p.ab}</td>
                    <td className="px-3 py-2 text-right">{p.r}</td>
                    <td className="px-3 py-2 text-right">{p.h}</td>
                    <td className="px-3 py-2 text-right">{p.hr}</td>
                    <td className="px-3 py-2 text-right">{p.rbi}</td>
                    <td className="px-3 py-2 text-right font-semibold">
                      {Number(p.avg || 0).toFixed(3)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {p.obp != null ? Number(p.obp).toFixed(3) : "—"}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {p.slg != null ? Number(p.slg).toFixed(3) : "—"}
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={`${p.player_id}-${p.team_id}-${p.year}-pit`}
                    className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
                  >
                    <td className="px-3 py-2 text-right text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <Link
                        to={`/players/${p.player_id}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {p.first_name} {p.last_name}
                      </Link>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-slate-600">
                      {p.team_name}
                    </td>
                    <td className="px-3 py-2 text-right">{p.app}</td>
                    <td className="px-3 py-2 text-right">{p.gs}</td>
                    <td className="px-3 py-2 text-right">{p.w}</td>
                    <td className="px-3 py-2 text-right">{p.l}</td>
                    <td className="px-3 py-2 text-right">{p.sv}</td>
                    <td className="px-3 py-2 text-right">{p.ip}</td>
                    <td className="px-3 py-2 text-right">{p.so}</td>
                    <td className="px-3 py-2 text-right font-semibold">
                      {p.era != null ? Number(p.era).toFixed(2) : "—"}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {p.b_avg != null ? Number(p.b_avg).toFixed(3) : "—"}
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
