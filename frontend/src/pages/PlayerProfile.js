//frontend/src/pages/PlayerProfile.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Calendar, TrendingUp, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { API } from "../api";
import { Container } from "../components/common/Container";
import { Card, CardBody } from "../components/common/Card";
import { Skeleton } from "../components/common/Skeleton";
import { BannerError } from "../components/common/BannerError";

// ── Formatters ────────────────────────────────────────────────────────────
function fmtAvg(v) {
  const n = parseFloat(v);
  if (!v || isNaN(n)) return ".000";
  return n.toFixed(3).replace(/^0\./, ".");
}
function fmtEra(v) {
  const n = parseFloat(v);
  if (!v || isNaN(n)) return "0.00";
  return n.toFixed(2);
}

// ── Team link helpers ─────────────────────────────────────────────────────
// Real teams (team_id set) → /teams/:id
// Historical code-only teams → /player-stats?team=CODE
// In future, aliases will map codes to real team IDs without breaking anything
function getTeamLink(stat) {
  if (stat?.team_id) return `/teams/${stat.team_id}`;
  if (stat?.team_name)
    return `/player-stats?team=${encodeURIComponent(stat.team_name)}`;
  return "/player-stats";
}

function getTeamCardLink(team) {
  if (team?.id) return `/teams/${team.id}`;
  if (team?.name) return `/player-stats?team=${encodeURIComponent(team.name)}`;
  return "/player-stats";
}

// ── Career Summary Card ───────────────────────────────────────────────────
function CareerSummary({ batting, pitching }) {
  const hasBatCareer = batting?.career && Number(batting.career.seasons) > 0;
  const hasPitCareer = pitching?.career && Number(pitching.career.seasons) > 0;

  if (!hasBatCareer && !hasPitCareer) return null;

  return (
    <Card className="mb-8" style={{ border: "2px solid #1D4ED8" }}>
      <CardBody>
        <h2
          className="text-xl font-bold mb-5 flex items-center gap-2"
          style={{ color: "#1D4ED8" }}
        >
          <Star size={20} />
          Career Summary
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hasBatCareer && (
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                ⚾ Batting
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Seasons", value: batting.career.seasons },
                  { label: "Games", value: batting.career.total_gp },
                  {
                    label: "AVG",
                    value: fmtAvg(batting.career.career_avg),
                    highlight: true,
                  },
                  { label: "Hits", value: batting.career.total_h },
                  { label: "HR", value: batting.career.total_hr },
                  { label: "RBI", value: batting.career.total_rbi },
                  { label: "Runs", value: batting.career.total_r },
                  { label: "SB", value: batting.career.total_sb },
                  { label: "OBP", value: fmtAvg(batting.career.career_obp) },
                  { label: "SLG", value: fmtAvg(batting.career.career_slg) },
                  { label: "AB", value: batting.career.total_ab },
                  { label: "BB", value: batting.career.total_bb },
                ].map(({ label, value, highlight }) => (
                  <div
                    key={label}
                    className="text-center p-2 rounded-lg"
                    style={{ background: "#F8FAFC" }}
                  >
                    <div
                      className="text-lg font-bold"
                      style={{ color: highlight ? "#1D4ED8" : "#0F172A" }}
                    >
                      {value ?? "—"}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasPitCareer && (
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                🥎 Pitching
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Seasons", value: pitching.career.seasons },
                  {
                    label: "Record",
                    value: `${pitching.career.total_w}-${pitching.career.total_l}`,
                  },
                  {
                    label: "ERA",
                    value: fmtEra(pitching.career.career_era),
                    highlight: true,
                  },
                  { label: "APP", value: pitching.career.total_app },
                  { label: "IP", value: pitching.career.total_ip },
                  { label: "SO", value: pitching.career.total_so },
                  { label: "SV", value: pitching.career.total_sv },
                  { label: "BB", value: pitching.career.total_bb },
                  { label: "H", value: pitching.career.total_h },
                  { label: "ER", value: pitching.career.total_er },
                  { label: "CG", value: pitching.career.total_cg },
                  { label: "SHO", value: pitching.career.total_sho },
                ].map(({ label, value, highlight }) => (
                  <div
                    key={label}
                    className="text-center p-2 rounded-lg"
                    style={{ background: "#F0FDF4" }}
                  >
                    <div
                      className="text-lg font-bold"
                      style={{ color: highlight ? "#059669" : "#0F172A" }}
                    >
                      {value ?? "—"}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function PlayerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await API.get(`/players/${id}`);
        setPlayer(response.data);
      } catch (err) {
        const status = err?.response?.status;
        const msg =
          err?.response?.data?.error || err?.message || "Failed to load player";
        setError(status === 404 ? "Player not found." : msg);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPlayer();
  }, [id]);

  if (loading) {
    return (
      <Container className="py-12">
        <Skeleton className="h-12 w-64 mb-8" />
        <Skeleton className="h-48 w-full mb-6" />
        <Skeleton className="h-96 w-full" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-12">
        <BannerError message={error} />
        <button
          onClick={() => navigate("/player-stats")}
          className="mt-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Back to Player Stats
        </button>
      </Container>
    );
  }

  if (!player) return null;

  const hasBatting = player.batting?.stats?.length > 0;
  const hasPitching = player.pitching?.stats?.length > 0;

  const allYears = [
    ...(player.batting?.stats?.map((s) => s.year) || []),
    ...(player.pitching?.stats?.map((s) => s.year) || []),
  ].filter(Boolean);
  const minYear = allYears.length ? Math.min(...allYears) : null;
  const maxYear = allYears.length ? Math.max(...allYears) : null;
  const yearRange =
    minYear && maxYear
      ? minYear === maxYear
        ? String(minYear)
        : `${minYear} – ${maxYear}`
      : null;

  return (
    <Container className="py-12">
      <button
        onClick={() => navigate("/player-stats")}
        className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Player Stats
      </button>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <h1 className="text-4xl font-bold text-gray-900">
            {player.player.fullName}
          </h1>
          {player.player.isHallOfFame && (
            <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
              <Trophy size={16} />
              Hall of Fame{" "}
              {player.player.hofYear ? `(${player.player.hofYear})` : ""}
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 text-gray-500 flex-wrap">
          {player.player.mlbTeam && (
            <span className="text-lg">MLB Alumni: {player.player.mlbTeam}</span>
          )}
          {yearRange && (
            <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
              {yearRange}
            </span>
          )}
          {player.teams?.length > 0 && (
            <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
              {player.teams.length} team{player.teams.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      <CareerSummary batting={player.batting} pitching={player.pitching} />

      {/* Teams Played For */}
      {player.teams && player.teams.length > 0 && (
        <Card className="mb-8">
          <CardBody>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={20} />
              Teams
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {player.teams.map((team, idx) => {
                const allTeamYears = [
                  ...(team.batting_years || []),
                  ...(team.pitching_years || []),
                ]
                  .filter((v, i, arr) => arr.indexOf(v) === i)
                  .sort();

                return (
                  <Link
                    key={idx}
                    to={getTeamCardLink(team)}
                    className="block border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-colors"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <h3 className="font-bold text-gray-900 hover:text-blue-600 transition-colors">
                      {team.name}
                    </h3>
                    {team.city && team.state && (
                      <p className="text-sm text-gray-600">
                        {team.city}, {team.state}
                      </p>
                    )}
                    {!team.id && (
                      <p className="text-xs text-gray-400 mt-1">
                        Historical team
                      </p>
                    )}
                    <p className="text-sm text-blue-600 mt-2">
                      {allTeamYears.join(", ")}
                    </p>
                  </Link>
                );
              })}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Batting Stats */}
      {hasBatting && (
        <Card className="mb-8">
          <CardBody>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp size={24} />
              Batting Statistics
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Year",
                      "Team",
                      "G",
                      "AB",
                      "AVG",
                      "H",
                      "2B",
                      "3B",
                      "HR",
                      "RBI",
                      "R",
                      "BB",
                      "SO",
                      "SB",
                    ].map((h) => (
                      <th
                        key={h}
                        className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase ${h === "Year" || h === "Team" ? "text-left" : "text-center"}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {player.batting.stats.map((stat, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {stat.year}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <Link
                          to={getTeamLink(stat)}
                          className="text-blue-600 hover:underline"
                        >
                          {stat.team_name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {stat.gp || 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {stat.ab || 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-center font-semibold text-blue-600">
                        {fmtAvg(stat.avg)}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {stat.h || 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {stat.doubles || 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {stat.triples || 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {stat.hr || 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {stat.rbi || 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {stat.r || 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {stat.bb || 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {stat.so || 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {stat.sb || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Pitching Stats */}
      {hasPitching && (
        <Card className="mb-8">
          <CardBody>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp size={24} />
              Pitching Statistics
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Year",
                      "Team",
                      "W",
                      "L",
                      "ERA",
                      "APP",
                      "GS",
                      "IP",
                      "H",
                      "R",
                      "ER",
                      "BB",
                      "SO",
                      "SV",
                    ].map((h) => (
                      <th
                        key={h}
                        className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase ${h === "Year" || h === "Team" ? "text-left" : "text-center"}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {player.pitching.stats.map((stat, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {stat.year}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <Link
                          to={getTeamLink(stat)}
                          className="text-blue-600 hover:underline"
                        >
                          {stat.team_name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {stat.w || 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {stat.l || 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-center font-semibold text-blue-600">
                        {fmtEra(stat.era)}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {stat.app || 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {stat.gs || 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {stat.ip || "0.0"}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {stat.h || 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {stat.r || 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {stat.er || 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {stat.bb || 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {stat.so || 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {stat.sv || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}

      {!hasBatting && !hasPitching && (
        <Card>
          <CardBody>
            <p className="text-center text-gray-500 py-8">
              No statistics on record for this player.
            </p>
          </CardBody>
        </Card>
      )}
    </Container>
  );
}
