import React, { useState, useMemo } from "react";
import { Search, ChevronRight, User } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { usePlayerStatsPage } from "../hooks/usePlayerStatsPage";
import { Container } from "../components/common/Container";
import { SectionTitle } from "../components/common/SectionTitle";
import { Card, CardBody } from "../components/common/Card";
import { BannerError } from "../components/common/BannerError";
import { Skeleton } from "../components/common/Skeleton";
import { PlayerStatsTable } from "../components/player-stats/PlayerStatsTable";

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

  // View-specific state
  const [teamFilter, setTeamFilter] = useState("");
  const [search, setSearch] = useState("");
  const [expandedTeam, setExpandedTeam] = useState(null);

  // Player search state
  const [playerSearchQuery, setPlayerSearchQuery] = useState("");
  const [playerSearchResults, setPlayerSearchResults] = useState([]);
  const [playerSearchLoading, setPlayerSearchLoading] = useState(false);
  const [showPlayerSearch, setShowPlayerSearch] = useState(false);

  // Memo: Get team list from batting data
  const allTeams = useMemo(() => {
    const set = new Set();
    battingRows.forEach((r) => {
      if (r.team_name) set.add(r.team_name);
    });
    return Array.from(set).sort();
  }, [battingRows]);

  // Memo: Filter and group stats for display
  const teams = useMemo(() => {
    const normalize = (v) => (v ? String(v).toLowerCase() : "");
    const teamF = normalize(teamFilter);
    const q = normalize(search);

    const filteredBattingRows = battingRows.filter((r) => {
      if (teamF && normalize(r.team_name) !== teamF) return false;
      if (!q) return true;
      const name = normalize(r.player_name);
      const pos = normalize(r.position);
      return name.includes(q) || pos.includes(q);
    });

    // Group rows by team_name
    const byTeam = filteredBattingRows.reduce((acc, row) => {
      const key = row.team_name || "Unknown Team";
      if (!acc[key]) acc[key] = [];
      acc[key].push(row);
      return acc;
    }, {});

    return Object.entries(byTeam)
      .map(([teamName, players]) => ({
        teamName,
        players,
      }))
      .sort((a, b) => a.teamName.localeCompare(b.teamName));
  }, [battingRows, teamFilter, search]);

  // Helper to get pitchers for a specific team (filtered)
  const getPitchersForTeam = (teamName) => {
    const normalize = (v) => (v ? String(v).toLowerCase() : "");
    const q = normalize(search);

    return pitchingRows.filter((r) => {
      if (normalize(r.team_name) !== normalize(teamName)) return false;
      if (!q) return true;
      return normalize(r.player_name).includes(q);
    });
  };

  // Player search across all years
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

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value || null);
  };

  const noData = !battingRows.length && !pitchingRows.length;

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
            across all years
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

          {/* Player Search Results */}
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

      {/* Controls bar */}
      <Card className="mb-6">
        <CardBody className="flex flex-wrap gap-4 items-end">
          {/* Year selector */}
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

          {/* Team filter */}
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

          {/* Player search (current year) */}
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

      {/* Error Message */}
      {err && (
        <div className="mb-4">
          <BannerError message={err} />
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      )}

      {/* No Data Message */}
      {!loading && !err && noData && (
        <Card>
          <CardBody>
            <p className="text-gray-600 text-center py-8">
              No player stats found for {selectedYear}.
            </p>
          </CardBody>
        </Card>
      )}

      {/* No Results Message */}
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

      {/* Stats Tables */}
      {!loading && teams.length > 0 && (
        <div className="space-y-6">
          {teams.map((team) => {
            const isOpen = expandedTeam === team.teamName;
            const pitchers = getPitchersForTeam(team.teamName);

            // Calculate team batting totals
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
            const avg = battingTotals.ab
              ? (battingTotals.h / battingTotals.ab).toFixed(3).slice(1)
              : "---";

            return (
              <Card key={team.teamName} className="overflow-hidden">
                {/* Team header / accordion toggle */}
                <button
                  type="button"
                  onClick={() => setExpandedTeam(isOpen ? null : team.teamName)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors border-b border-gray-200"
                >
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {team.teamName}
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

                {/* Expanded content */}
                {isOpen && (
                  <div>
                    {/* BATTING TABLE */}
                    <PlayerStatsTable players={team.players} />

                    {/* PITCHING TABLE */}
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
                                <th className="px-4 py-2 text-left font-semibold sticky left-0 bg-gray-50 z-10">
                                  Pitcher
                                </th>
                                <th className="px-2 py-2 text-center font-semibold">
                                  No.
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  ERA
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  W
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  L
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  APP
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  GS
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  CG
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  SHO
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  CBO
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  SV
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  IP
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  H
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  R
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  ER
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  BB
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  SO
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  2B
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  3B
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  HR
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  AB
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  B/Avg
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  WP
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  HBP
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  BK
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  SFA
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  SHA
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {pitchers.map((p, idx) => {
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
                                    key={p.id ?? p.player_id ?? p.player_name}
                                    className={
                                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    }
                                  >
                                    <td className="px-4 py-1.5 font-medium sticky left-0 bg-inherit">
                                      {/* UPDATED: Make pitcher names clickable */}
                                      <Link
                                        to={`/players/${p.id || p.player_id}`}
                                        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                      >
                                        {p.player_name}
                                      </Link>
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
