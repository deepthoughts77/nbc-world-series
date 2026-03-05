import React, { useEffect, useState } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { Users, Trophy, Calendar, ChevronRight } from "lucide-react";
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
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!teamSlug) return;
    setLoading(true);
    setErr(null);

    // teamSlug may be a numeric ID (from Teams list) or a URL-encoded name
    const isId = /^\d+$/.test(teamSlug);
    const teamUrl = isId
      ? `${API}/api/teams/${teamSlug}`
      : `${API}/api/teams/by-name/${encodeURIComponent(decodeURIComponent(teamSlug))}`;

    fetch(teamUrl)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(async (teamData) => {
        // backend may wrap in { team: {...} } or return the object directly
        const t = teamData.team ?? teamData;
        setTeam(t);
        const [champsRes, yearsRes] = await Promise.all([
          fetch(`${API}/api/teams/${t.id}/championships`).then((r) => r.json()),
          fetch(`${API}/api/teams/${t.id}/years`).then((r) => r.json()),
        ]);
        setChamps(Array.isArray(champsRes) ? champsRes : []);
        setYears(
          Array.isArray(yearsRes)
            ? [...yearsRes]
                .map(Number)
                .filter(Boolean)
                .sort((a, b) => b - a)
            : [],
        );
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
  const teamName = team?.name || decodeURIComponent(teamSlug || "");

  return (
    <Container className="py-12 space-y-8">
      <NavLink
        to="/teams"
        className="text-blue-600 hover:underline text-sm inline-flex items-center gap-1"
      >
        ← Back to Teams
      </NavLink>

      {/* ── Header ── */}
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
                Appearances
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {appearCount}
              </div>
            </div>
            {appearCount > 0 && (
              <div className="text-center">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Win Rate
                </div>
                <div className="text-3xl font-bold text-gray-700">
                  {((champCount / appearCount) * 100).toFixed(0)}%
                </div>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* ── Championship History ── */}
      {championships.length > 0 && (
        <Card>
          <CardBody>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Trophy className="text-yellow-500" size={18} /> Championship
              History
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
                              className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                                isChamp
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
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

      {/* ── Available Years ── */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <Calendar size={20} className="text-blue-600" />
          <h2 className="text-xl font-bold">Player Statistics by Year</h2>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Select a year to view batting and pitching stats for all players on
          this team.
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
            {years.map((year) => {
              const isChampYear = championships.some(
                (c) => c.year === year && c.champion_team_id === team?.id,
              );
              return (
                <button
                  key={year}
                  onClick={() => navigate(`/teams/${teamSlug}/${year}`)}
                  className="group relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                  style={
                    isChampYear
                      ? { borderColor: "#f59e0b", background: "#fffbeb" }
                      : { borderColor: "#e5e7eb", background: "#fff" }
                  }
                >
                  {isChampYear && (
                    <div className="absolute -top-2 -right-2 text-xs">🏆</div>
                  )}
                  <span
                    className={`text-2xl font-bold ${isChampYear ? "text-yellow-700" : "text-gray-800"}`}
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
