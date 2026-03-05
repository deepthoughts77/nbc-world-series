import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { Users, ChevronRight } from "lucide-react";
import { Container } from "../components/common/Container";
import { Card, CardBody } from "../components/common/Card";
import { BannerError } from "../components/common/BannerError";
import { Skeleton } from "../components/common/Skeleton";

const API = process.env.REACT_APP_API_URL || "";

function fmt3(v) {
  const n = parseFloat(v);
  if (isNaN(n)) return v ?? "—";
  return n.toFixed(3).replace(/^0/, "");
}
function fmt2(v) {
  const n = parseFloat(v);
  if (isNaN(n)) return v ?? "—";
  return n.toFixed(2);
}
function val(v) {
  return v != null && v !== "" ? v : "—";
}

function BattingTable({ rows }) {
  if (!rows.length)
    return (
      <p className="text-gray-500 text-sm py-8 text-center">
        No batting stats available for this year.
      </p>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs md:text-sm whitespace-nowrap">
        <thead>
          <tr className="bg-gray-50 border-b text-left">
            {[
              "Player",
              "GP",
              "AB",
              "H",
              "2B",
              "3B",
              "HR",
              "R",
              "RBI",
              "BB",
              "SO",
              "SB",
              "AVG",
              "OBP",
              "SLG",
            ].map((h) => (
              <th
                key={h}
                className={`px-3 py-2 font-semibold text-gray-600 ${
                  h === "Player"
                    ? "text-left sticky left-0 bg-gray-50 min-w-[140px]"
                    : "text-right"
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((p, i) => (
            <tr key={i} className="hover:bg-blue-50 transition-colors">
              <td className="px-3 py-2 sticky left-0 bg-white">
                <div className="font-semibold text-gray-900">
                  {p.first_name || p.player_name?.split(" ")[0] || ""}{" "}
                  {p.last_name ||
                    p.player_name?.split(" ").slice(1).join(" ") ||
                    ""}
                </div>
                {p.jersey_num && (
                  <div className="text-[10px] text-gray-400">
                    #{p.jersey_num}
                  </div>
                )}
              </td>
              <td className="px-3 py-2 text-right">{val(p.gp ?? p.g)}</td>
              <td className="px-3 py-2 text-right">{val(p.ab)}</td>
              <td className="px-3 py-2 text-right">{val(p.h)}</td>
              <td className="px-3 py-2 text-right">{val(p["2b"])}</td>
              <td className="px-3 py-2 text-right">{val(p["3b"])}</td>
              <td className="px-3 py-2 text-right">{val(p.hr)}</td>
              <td className="px-3 py-2 text-right">{val(p.r)}</td>
              <td className="px-3 py-2 text-right">{val(p.rbi)}</td>
              <td className="px-3 py-2 text-right">{val(p.bb)}</td>
              <td className="px-3 py-2 text-right">{val(p.so)}</td>
              <td className="px-3 py-2 text-right">{val(p.sb)}</td>
              <td className="px-3 py-2 text-right font-semibold">
                {fmt3(p.avg)}
              </td>
              <td className="px-3 py-2 text-right">{fmt3(p.obp)}</td>
              <td className="px-3 py-2 text-right">{fmt3(p.slg)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PitchingTable({ rows }) {
  if (!rows.length)
    return (
      <p className="text-gray-500 text-sm py-8 text-center">
        No pitching stats available for this year.
      </p>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs md:text-sm whitespace-nowrap">
        <thead>
          <tr className="bg-gray-50 border-b text-left">
            {[
              "Player",
              "APP",
              "W",
              "L",
              "SV",
              "IP",
              "H",
              "R",
              "ER",
              "BB",
              "SO",
              "CG",
              "SHO",
              "ERA",
              "WHIP",
            ].map((h) => (
              <th
                key={h}
                className={`px-3 py-2 font-semibold text-gray-600 ${
                  h === "Player"
                    ? "text-left sticky left-0 bg-gray-50 min-w-[140px]"
                    : "text-right"
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((p, i) => (
            <tr key={i} className="hover:bg-blue-50 transition-colors">
              <td className="px-3 py-2 sticky left-0 bg-white">
                <div className="font-semibold text-gray-900">
                  {p.first_name || p.player_name?.split(" ")[0] || ""}{" "}
                  {p.last_name ||
                    p.player_name?.split(" ").slice(1).join(" ") ||
                    ""}
                </div>
                {p.jersey_num && (
                  <div className="text-[10px] text-gray-400">
                    #{p.jersey_num}
                  </div>
                )}
              </td>
              <td className="px-3 py-2 text-right">{val(p.app)}</td>
              <td className="px-3 py-2 text-right">{val(p.w)}</td>
              <td className="px-3 py-2 text-right">{val(p.l)}</td>
              <td className="px-3 py-2 text-right">{val(p.sv)}</td>
              <td className="px-3 py-2 text-right">{val(p.ip)}</td>
              <td className="px-3 py-2 text-right">{val(p.h)}</td>
              <td className="px-3 py-2 text-right">{val(p.r)}</td>
              <td className="px-3 py-2 text-right">{val(p.er)}</td>
              <td className="px-3 py-2 text-right">{val(p.bb)}</td>
              <td className="px-3 py-2 text-right">{val(p.so)}</td>
              <td className="px-3 py-2 text-right">{val(p.cg)}</td>
              <td className="px-3 py-2 text-right">{val(p.sho)}</td>
              <td className="px-3 py-2 text-right font-semibold">
                {fmt2(p.era)}
              </td>
              <td className="px-3 py-2 text-right">
                {p.whip != null ? fmt2(p.whip) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function TeamYearDetail() {
  const { teamSlug, year } = useParams();

  const [team, setTeam] = useState(null);
  const [batting, setBatting] = useState([]);
  const [pitching, setPitching] = useState([]);
  const [activeTab, setActiveTab] = useState("batting");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!teamSlug || !year) return;
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
        const [batRes, pitRes] = await Promise.all([
          fetch(`${API}/api/teams/${t.id}/batting?year=${year}`).then((r) =>
            r.json(),
          ),
          fetch(`${API}/api/teams/${t.id}/pitching?year=${year}`).then((r) =>
            r.json(),
          ),
        ]);
        setBatting(Array.isArray(batRes) ? batRes : []);
        setPitching(Array.isArray(pitRes) ? pitRes : []);
      })
      .catch(() => setErr("Failed to load stats."))
      .finally(() => setLoading(false));
  }, [teamSlug, year]);

  if (loading)
    return (
      <Container className="py-12 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40" />
        <Skeleton className="h-96" />
      </Container>
    );

  if (err)
    return (
      <Container className="py-12">
        <BannerError message={err} />
      </Container>
    );

  const teamName = team?.name || decodeURIComponent(teamSlug || "");

  return (
    <Container className="py-12 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500">
        <NavLink to="/teams" className="text-blue-600 hover:underline">
          Teams
        </NavLink>
        <ChevronRight size={14} />
        <NavLink
          to={`/teams/${teamSlug}`}
          className="text-blue-600 hover:underline"
        >
          {teamName}
        </NavLink>
        <ChevronRight size={14} />
        <span className="font-semibold text-gray-800">{year} Season</span>
      </nav>

      {/* Header */}
      <Card>
        <CardBody className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <Users size={14} /> {year} Season Stats
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {teamName}
            </h1>
            <p className="mt-1 text-gray-500 text-sm">
              {[team?.city, team?.state].filter(Boolean).join(", ")}
            </p>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Batters
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {batting.length}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Pitchers
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {pitching.length}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tabs */}
      <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
        {["batting", "pitching"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 text-sm font-semibold capitalize transition-colors ${
              activeTab === tab
                ? "bg-white text-blue-700 shadow-sm"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            } ${tab === "pitching" ? "border-l border-gray-200" : ""}`}
          >
            {tab === "batting" ? "⚾ Batting" : "🥎 Pitching"}
          </button>
        ))}
      </div>

      {/* Stats Table */}
      <Card>
        <CardBody className="p-0">
          {activeTab === "batting" ? (
            <BattingTable rows={batting} />
          ) : (
            <PitchingTable rows={pitching} />
          )}
        </CardBody>
      </Card>
    </Container>
  );
}
