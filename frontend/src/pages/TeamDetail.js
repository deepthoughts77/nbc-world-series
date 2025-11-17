import React, { useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { Users, Trophy } from "lucide-react";
import { useTeamDetail } from "../hooks/useTeamDetail";
import { fmt } from "../utils/formatters";
import { Container } from "../components/common/Container";
import { SectionTitle } from "../components/common/SectionTitle";
import { Card, CardBody } from "../components/common/Card";
import { BannerError } from "../components/common/BannerError";
import { Skeleton } from "../components/common/Skeleton";

export default function TeamDetail() {
  const { teamSlug } = useParams();
  const teamName = decodeURIComponent(teamSlug || "");
  const [activeTab, setActiveTab] = useState("batting");

  const { team, championships, playerStats, loading, err } =
    useTeamDetail(teamName);

  if (loading) {
    return (
      <Container className="py-12">
        <Skeleton className="h-56" />
      </Container>
    );
  }

  if (err) {
    return (
      <Container className="py-12">
        <BannerError message={err} />
      </Container>
    );
  }

  return (
    <Container className="py-12 space-y-8">
      <NavLink
        to="/teams"
        className="text-blue-600 hover:underline text-sm inline-flex items-center gap-1"
      >
        ← Back to Teams
      </NavLink>

      {/* Header card */}
      <Card>
        <CardBody className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <Users size={14} />
              Team Profile
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {team?.name || teamName}
            </h1>
            <p className="mt-1 text-gray-600">
              {team?.city || "Unknown city"}, {team?.state || "Unknown state"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Championships
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {fmt(Number(team?.championships_won) || 0)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Appearances
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {fmt(Number(team?.appearances) || championships.length)}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Championship history */}
      <Card>
        <CardBody>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Trophy className="text-yellow-600" size={18} />
            Championship History
          </h2>
          {championships.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Year</th>
                    <th className="px-4 py-2 text-left font-semibold">
                      Result
                    </th>
                    <th className="px-4 py-2 text-left font-semibold">
                      Opponent
                    </th>
                    <th className="px-4 py-2 text-left font-semibold">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {championships
                    .sort((a, b) => (b.year || 0) - (a.year || 0))
                    .map((c) => {
                      const champName = c.champion_name || c.champion || "";
                      const isChamp =
                        champName.toLowerCase() === teamName.toLowerCase();

                      return (
                        <tr key={c.year}>
                          <td className="px-4 py-2 font-semibold">{c.year}</td>
                          <td className="px-4 py-2">
                            {isChamp ? "Champion" : "Runner-up"}
                          </td>
                          <td className="px-4 py-2">
                            {isChamp
                              ? c.runner_up_name || c.runner_up || "—"
                              : champName}
                          </td>
                          <td className="px-4 py-2">
                            {c.championship_score || "—"}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 text-sm">
              No championship appearances found yet.
            </p>
          )}
        </CardBody>
      </Card>

      {/* 1966 stats snippet */}
      <div className="pt-8">
        <SectionTitle
          eyebrow="Statistics"
          title={`1966 Player Stats`}
          desc="Batting and pitching stats for this team from the 1966 tournament."
        />

        <div className="mb-4 inline-flex rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
          <button
            type="button"
            onClick={() => setActiveTab("batting")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "batting"
                ? "bg-white text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Batting
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pitching")}
            className={`px-4 py-2 text-sm font-medium border-l border-gray-200 ${
              activeTab === "pitching"
                ? "bg-white text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Pitching
          </button>
        </div>

        <Card>
          <CardBody>
            {playerStats.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs md:text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">
                        Player
                      </th>
                      <th className="px-2 py-2 text-right font-semibold">G</th>
                      <th className="px-2 py-2 text-right font-semibold">AB</th>
                      <th className="px-2 py-2 text-right font-semibold">H</th>
                      <th className="px-2 py-2 text-right font-semibold">HR</th>
                      <th className="px-3 py-2 text-right font-semibold">
                        AVG
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {playerStats.map((p, idx) => (
                      <tr key={p.id ?? `${p.player_name}-${idx}`}>
                        <td className="px-4 py-2">
                          <div className="font-medium text-gray-900">
                            {p.player_name}
                          </div>
                          {p.position && (
                            <div className="text-[11px] text-gray-500">
                              {p.position}
                            </div>
                          )}
                        </td>
                        <td className="px-2 py-2 text-right">{p.g}</td>
                        <td className="px-2 py-2 text-right">{p.ab}</td>
                        <td className="px-2 py-2 text-right">{p.h}</td>
                        <td className="px-2 py-2 text-right">{p.hr}</td>
                        <td className="px-3 py-2 text-right">{p.pct || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600 text-sm">
                No player stats available yet for 1966.
              </p>
            )}
          </CardBody>
        </Card>
      </div>
    </Container>
  );
}
