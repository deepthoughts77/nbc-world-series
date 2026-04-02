//frontend/src/pages/TeamYearDetail.js
import React, { useEffect, useState, useMemo } from "react";
import { useParams, NavLink, Link } from "react-router-dom";
import { Users, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
import { Container } from "../components/common/Container";
import { Card, CardBody } from "../components/common/Card";
import { BannerError } from "../components/common/BannerError";
import { Skeleton } from "../components/common/Skeleton";

const API = process.env.REACT_APP_API_URL || "";

function fmt3(v) {
  const n = parseFloat(v);
  if (isNaN(n)) return v ?? "—";
  return n.toFixed(3).replace(/^0\./, ".");
}
function fmt2(v) {
  const n = parseFloat(v);
  if (isNaN(n)) return v ?? "—";
  return n.toFixed(2);
}
function val(v) {
  return v != null && v !== "" ? v : "—";
}

function getPlayerName(p) {
  return (
    `${p.first_name || p.player_name?.split(" ")[0] || ""} ${
      p.last_name || p.player_name?.split(" ").slice(1).join(" ") || ""
    }`.trim() ||
    p.player_name ||
    "Unknown Player"
  );
}

function getPlayerLink(p) {
  const playerId = p.player_id || p.id;
  return playerId ? `/players/${playerId}` : null;
}

// ── Sortable header cell ──────────────────────────────────────────────────
function SortTh({
  label,
  tip,
  col,
  sortKey,
  sortDir,
  onSort,
  align = "right",
}) {
  const active = sortKey === col;
  return (
    <th
      title={tip || label}
      onClick={() => onSort(col)}
      className={`px-3 py-2 font-semibold cursor-pointer select-none transition-colors
        ${active ? "text-blue-600" : "text-gray-600 hover:text-gray-900"}
        ${col === "player" ? "text-left sticky left-0 bg-gray-50 min-w-[140px]" : "text-right"}
      `}
    >
      <span className="inline-flex items-center gap-1 justify-end w-full">
        {col === "player" && <span>{label}</span>}
        {active ? (
          sortDir === "asc" ? (
            <ChevronUp size={11} />
          ) : (
            <ChevronDown size={11} />
          )
        ) : null}
        {col !== "player" && <span>{label}</span>}
      </span>
    </th>
  );
}

// ── Batting table ─────────────────────────────────────────────────────────
function BattingTable({ rows }) {
  const [sortKey, setSortKey] = useState("avg");
  const [sortDir, setSortDir] = useState("desc");

  const COLS = [
    { label: "Player", col: "player", tip: "Player Name" },
    { label: "GP", col: "gp", tip: "Games Played" },
    { label: "AB", col: "ab", tip: "At Bats" },
    { label: "H", col: "h", tip: "Hits" },
    { label: "2B", col: "2b", tip: "Doubles" },
    { label: "3B", col: "3b", tip: "Triples" },
    { label: "HR", col: "hr", tip: "Home Runs" },
    { label: "R", col: "r", tip: "Runs Scored" },
    { label: "RBI", col: "rbi", tip: "Runs Batted In" },
    { label: "BB", col: "bb", tip: "Walks (Base on Balls)" },
    { label: "SO", col: "so", tip: "Strikeouts" },
    { label: "SB", col: "sb", tip: "Stolen Bases" },
    {
      label: "AVG",
      col: "avg",
      tip: "Batting Average — Hits divided by At Bats",
    },
    {
      label: "OBP",
      col: "obp",
      tip: "On-Base Percentage — How often a batter reaches base",
    },
    {
      label: "SLG",
      col: "slg",
      tip: "Slugging Percentage — Total bases divided by At Bats",
    },
  ];

  const handleSort = (col) => {
    if (col === "player") {
      setSortKey("player");
      setSortDir((d) =>
        sortKey === "player" ? (d === "asc" ? "desc" : "asc") : "asc",
      );
    } else {
      if (sortKey === col) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(col);
        setSortDir("desc");
      }
    }
  };

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      if (sortKey === "player") {
        const an = getPlayerName(a).toLowerCase();
        const bn = getPlayerName(b).toLowerCase();
        return sortDir === "asc" ? an.localeCompare(bn) : bn.localeCompare(an);
      }
      const av = parseFloat(
        a[sortKey] ?? a[sortKey === "gp" ? "g" : sortKey] ?? -1,
      );
      const bv = parseFloat(
        b[sortKey] ?? b[sortKey === "gp" ? "g" : sortKey] ?? -1,
      );
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

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
          <tr className="bg-gray-50 border-b">
            {COLS.map(({ label, col, tip }) => (
              <SortTh
                key={col}
                label={label}
                col={col}
                tip={tip}
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
              />
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sorted.map((p, i) => {
            const playerName = getPlayerName(p);
            const playerLink = getPlayerLink(p);
            return (
              <tr key={i} className="hover:bg-blue-50 transition-colors">
                <td className="px-3 py-2 sticky left-0 bg-white">
                  {playerLink ? (
                    <Link
                      to={playerLink}
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      {playerName}
                    </Link>
                  ) : (
                    <div className="font-semibold text-gray-900">
                      {playerName}
                    </div>
                  )}
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Pitching table ────────────────────────────────────────────────────────
function PitchingTable({ rows }) {
  const [sortKey, setSortKey] = useState("era");
  const [sortDir, setSortDir] = useState("asc");

  const COLS = [
    { label: "Player", col: "player", tip: "Player Name" },
    { label: "APP", col: "app", tip: "Appearances (games pitched)" },
    { label: "W", col: "w", tip: "Wins" },
    { label: "L", col: "l", tip: "Losses" },
    { label: "SV", col: "sv", tip: "Saves" },
    { label: "IP", col: "ip", tip: "Innings Pitched" },
    { label: "H", col: "h", tip: "Hits Allowed" },
    { label: "R", col: "r", tip: "Runs Allowed" },
    { label: "ER", col: "er", tip: "Earned Runs Allowed" },
    { label: "BB", col: "bb", tip: "Walks (Base on Balls)" },
    { label: "SO", col: "so", tip: "Strikeouts" },
    { label: "CG", col: "cg", tip: "Complete Games" },
    { label: "SHO", col: "sho", tip: "Shutouts" },
    {
      label: "ERA",
      col: "era",
      tip: "Earned Run Average — Earned runs allowed per 9 innings",
    },
    { label: "WHIP", col: "whip", tip: "Walks plus Hits per Inning Pitched" },
  ];

  const handleSort = (col) => {
    if (col === "player") {
      setSortKey("player");
      setSortDir((d) =>
        sortKey === "player" ? (d === "asc" ? "desc" : "asc") : "asc",
      );
    } else {
      if (sortKey === col) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(col);
        // ERA, WHIP, L default asc (lower is better); rest default desc
        setSortDir(
          ["era", "whip", "l", "bb", "er", "r", "h"].includes(col)
            ? "asc"
            : "desc",
        );
      }
    }
  };

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      if (sortKey === "player") {
        const an = getPlayerName(a).toLowerCase();
        const bn = getPlayerName(b).toLowerCase();
        return sortDir === "asc" ? an.localeCompare(bn) : bn.localeCompare(an);
      }
      const av = parseFloat(a[sortKey] ?? -1);
      const bv = parseFloat(b[sortKey] ?? -1);
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

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
          <tr className="bg-gray-50 border-b">
            {COLS.map(({ label, col, tip }) => (
              <SortTh
                key={col}
                label={label}
                col={col}
                tip={tip}
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
              />
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sorted.map((p, i) => {
            const playerName = getPlayerName(p);
            const playerLink = getPlayerLink(p);
            return (
              <tr key={i} className="hover:bg-blue-50 transition-colors">
                <td className="px-3 py-2 sticky left-0 bg-white">
                  {playerLink ? (
                    <Link
                      to={playerLink}
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      {playerName}
                    </Link>
                  ) : (
                    <div className="font-semibold text-gray-900">
                      {playerName}
                    </div>
                  )}
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
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
        <NavLink
          to={`/teams/${teamSlug}/totals`}
          className="text-blue-600 hover:underline"
        >
          Season Totals
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

      <p className="text-xs text-gray-400 text-center">
        Click any column header to sort. Hover for full stat definition.
      </p>
    </Container>
  );
}
