// frontend/src/pages/TeamDetail.js
import React, { useEffect, useState } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { Users, Trophy, Calendar, ChevronRight, BarChart3 } from "lucide-react";
import { Container } from "../components/common/Container";
import { Card, CardBody } from "../components/common/Card";
import { BannerError } from "../components/common/BannerError";
import { Skeleton } from "../components/common/Skeleton";

const API = process.env.REACT_APP_API_URL || "";

export default function TeamDetail() {
  const { teamSlug } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [championships, setChamps] = useState([]);
  const [years, setYears] = useState([]); // [{year, is_champion, is_runner_up}]
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!teamSlug) return;
    setLoading(true);
    setErr(null);

    const isId = /^\d+$/.test(teamSlug);
    const teamUrl = isId
      ? `${API}/api/teams/${teamSlug}`
      : `${API}/api/teams/by-name/${encodeURIComponent(decodeURIComponent(teamSlug))}`;

    fetch(teamUrl)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(async (teamData) => {
        const t = teamData.team ?? teamData;
        setTeam(t);
        const [champsRes, yearsRes] = await Promise.all([
          fetch(`${API}/api/teams/${t.id}/championships`).then((r) => r.json()),
          fetch(`${API}/api/teams/${t.id}/years`).then((r) => r.json()),
        ]);
        setChamps(Array.isArray(champsRes) ? champsRes : []);
        // yearsRes is now [{year, is_champion, is_runner_up}] or plain numbers
        if (Array.isArray(yearsRes)) {
          if (yearsRes.length === 0) {
            setYears([]);
          } else if (typeof yearsRes[0] === "object") {
            setYears([...yearsRes].sort((a, b) => b.year - a.year));
          } else {
            // fallback: plain year numbers
            setYears(
              [...yearsRes]
                .map((y) => ({
                  year: Number(y),
                  is_champion: false,
                  is_runner_up: false,
                }))
                .filter((y) => y.year)
                .sort((a, b) => b.year - a.year),
            );
          }
        }
      })
      .catch(() => setErr("Failed to load team data."))
      .finally(() => setLoading(false));
  }, [teamSlug]);

  if (loading)
    return (
      <Container className="py-12 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40" />
        <Skeleton className="h-64" />
      </Container>
    );

  if (err)
    return (
      <Container className="py-12">
        <BannerError message={err} />
      </Container>
    );

  const champCount = Number(team?.championships_won) || 0;
  const appearCount =
    Number(team?.finals_appearances ?? team?.appearances) ||
    championships.length;
  const tourneyYears = Number(team?.tournament_years) || years.length;
  const firstYear = team?.first_year;
  const lastYear = team?.last_year;
  const teamName = team?.name || decodeURIComponent(teamSlug || "");

  return (
    <Container className="py-12 space-y-8">
      <NavLink
        to="/teams"
        className="text-blue-600 hover:underline text-sm inline-flex items-center gap-1"
      >
        ← Back to Teams
      </NavLink>

      {/* ── Team header card ──────────────────────────────────────── */}
      <Card>
        <CardBody className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <Users size={14} /> Team Profile
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {teamName}
            </h1>
            <p className="mt-1 text-gray-500 text-sm">
              {[team?.city, team?.state].filter(Boolean).join(", ") ||
                "Location unknown"}
            </p>
            {tourneyYears > 0 && (
              <p className="mt-1 text-gray-400 text-xs font-mono">
                {tourneyYears} tournament season{tourneyYears !== 1 ? "s" : ""}
                {firstYear && lastYear && firstYear !== lastYear
                  ? ` · ${firstYear}–${lastYear}`
                  : firstYear
                    ? ` · ${firstYear}`
                    : ""}
              </p>
            )}
            <NavLink
              to={`/teams/${teamSlug}/totals`}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              <BarChart3 size={16} />
              View Team Totals
            </NavLink>
          </div>

          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Championships
              </div>
              <div className="text-3xl font-bold text-yellow-600">
                {champCount}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Finals
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {appearCount}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Seasons
              </div>
              <div className="text-3xl font-bold text-gray-700">
                {tourneyYears || "—"}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* ── Championship history ──────────────────────────────────── */}
      {championships.length > 0 && (
        <Card>
          <CardBody>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Trophy className="text-yellow-500" size={18} />
              Championship History
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left">
                    <th className="px-4 py-2 font-semibold text-gray-600">
                      Year
                    </th>
                    <th className="px-4 py-2 font-semibold text-gray-600">
                      Result
                    </th>
                    <th className="px-4 py-2 font-semibold text-gray-600">
                      Opponent
                    </th>
                    <th className="px-4 py-2 font-semibold text-gray-600">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[...championships]
                    .sort((a, b) => (b.year || 0) - (a.year || 0))
                    .map((c) => {
                      const isChamp =
                        c.champion_team_id === team?.id ||
                        (c.champion_name || "").toLowerCase() ===
                          teamName.toLowerCase();
                      return (
                        <tr key={c.year} className="hover:bg-gray-50">
                          <td className="px-4 py-2 font-semibold">{c.year}</td>
                          <td className="px-4 py-2">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${isChamp ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}
                            >
                              {isChamp ? "🏆 Champion" : "Runner-up"}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-gray-700">
                            {isChamp
                              ? c.runner_up_name || "—"
                              : c.champion_name || "—"}
                          </td>
                          <td className="px-4 py-2 text-gray-500">
                            {c.championship_score || "—"}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ── Player stats by year ──────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Calendar size={20} className="text-blue-600" />
          <h2 className="text-xl font-bold">Tournament Seasons</h2>
          {tourneyYears > 0 && (
            <span className="text-sm text-gray-400 font-mono">
              {tourneyYears} season{tourneyYears !== 1 ? "s" : ""}
              {firstYear && lastYear && firstYear !== lastYear
                ? ` · ${firstYear}–${lastYear}`
                : ""}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Select a year to view batting and pitching stats for all players on
          this team. 🏆 = Championship · 🥈 = Runner-up
        </p>

        {years.length === 0 ? (
          <Card>
            <CardBody className="py-12 text-center text-gray-500">
              <div className="text-4xl mb-3">📋</div>
              <p className="font-semibold text-gray-700 mb-1">
                No statistics available yet
              </p>
              {champCount > 0 && (
                <p className="text-sm text-gray-400">
                  This team has {champCount} championship
                  {champCount !== 1 ? "s" : ""} on record — player stats coming
                  soon.
                </p>
              )}
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {years.map(({ year, is_champion, is_runner_up }) => {
              const isChamp = is_champion;
              const isRunnerUp = is_runner_up;
              const isSpecial = isChamp || isRunnerUp;

              return (
                <button
                  key={year}
                  onClick={() => navigate(`/teams/${teamSlug}/${year}`)}
                  className="group relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                  style={
                    isChamp
                      ? { borderColor: "#f59e0b", background: "#fffbeb" }
                      : isRunnerUp
                        ? { borderColor: "#93c5fd", background: "#eff6ff" }
                        : { borderColor: "#e5e7eb", background: "#fff" }
                  }
                >
                  {isChamp && (
                    <div
                      className="absolute -top-2 -right-2 text-xs"
                      title="Champion"
                    >
                      🏆
                    </div>
                  )}
                  {isRunnerUp && !isChamp && (
                    <div
                      className="absolute -top-2 -right-2 text-xs"
                      title="Runner-up"
                    >
                      🥈
                    </div>
                  )}
                  <span
                    className={`text-2xl font-bold ${isChamp ? "text-yellow-700" : isRunnerUp ? "text-blue-700" : "text-gray-800"}`}
                  >
                    {year}
                  </span>
                  <span className="text-xs text-gray-400 mt-1 group-hover:text-blue-500 transition-colors flex items-center gap-0.5">
                    View stats <ChevronRight size={10} />
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Container>
  );
}
