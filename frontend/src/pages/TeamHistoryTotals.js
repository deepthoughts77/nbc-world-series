// frontend/src/pages/TeamHistoryTotals.js
//
// Route: /teams/:teamSlug/totals
// Shows batting and pitching totals for a single team across all years.
// Data from: GET /api/teams/:id/totals/batting and /api/teams/:id/totals/pitching

import React, { useEffect, useState, useMemo } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { BarChart3, ChevronUp, ChevronDown } from "lucide-react";
import { API } from "../api";
import { Container } from "../components/common/Container";
import { Card, CardBody } from "../components/common/Card";
import { BannerError } from "../components/common/BannerError";
import { Skeleton } from "../components/common/Skeleton";

// ── Formatters ────────────────────────────────────────────────────────────
function fmt3(v) {
  const n = parseFloat(v);
  if (isNaN(n)) return "—";
  return n.toFixed(3).replace(/^0\./, ".");
}
function fmt2(v) {
  const n = parseFloat(v);
  if (isNaN(n)) return "—";
  return n.toFixed(2);
}
function val(v) {
  return v != null && v !== "" ? v : "—";
}

// ── Glossaries ────────────────────────────────────────────────────────────
const BATTING_GLOSSARY = {
  year: "Season Year",
  gp: "Games Played",
  ab: "At Bats",
  h: "Hits",
  "2b": "Doubles",
  "3b": "Triples",
  hr: "Home Runs",
  r: "Runs Scored",
  rbi: "Runs Batted In",
  bb: "Walks (Base on Balls)",
  so: "Strikeouts",
  sb: "Stolen Bases",
  avg: "Batting Average — Hits divided by At Bats",
  obp: "On-Base Percentage — How often a batter reaches base",
  slg: "Slugging Percentage — Total bases divided by At Bats",
};

const PITCHING_GLOSSARY = {
  year: "Season Year",
  app: "Appearances (games pitched)",
  w: "Wins",
  l: "Losses",
  sv: "Saves",
  ip: "Innings Pitched",
  h: "Hits Allowed",
  r: "Runs Allowed",
  er: "Earned Runs Allowed",
  bb: "Walks (Base on Balls)",
  so: "Strikeouts",
  cg: "Complete Games",
  sho: "Shutouts",
  era: "Earned Run Average — Earned runs allowed per 9 innings",
  whip: "Walks plus Hits per Inning Pitched",
};

// ── Sortable column header ────────────────────────────────────────────────
function Th({ label, col, tip, sortKey, sortDir, onSort, align = "right" }) {
  const active = sortKey === col;
  return (
    <th
      title={tip || label}
      onClick={() => onSort(col)}
      style={{
        padding: "10px 12px",
        textAlign: align === "left" ? "left" : "right",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: active ? "#1D4ED8" : "#64748B",
        cursor: "pointer",
        userSelect: "none",
        whiteSpace: "nowrap",
        borderBottom: "2px solid #E2E8F0",
        background: "#F8FAFC",
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        {label}
        {active ? (
          sortDir === "asc" ? (
            <ChevronUp size={12} />
          ) : (
            <ChevronDown size={12} />
          )
        ) : null}
      </span>
    </th>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function TeamHistoryTotals() {
  const { teamSlug } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [batting, setBatting] = useState([]);
  const [pitching, setPitching] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [activeTab, setActiveTab] = useState("batting");
  const [sortKey, setSortKey] = useState("year");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    if (!teamSlug) return;
    setLoading(true);
    setErr(null);

    const isId = /^\d+$/.test(teamSlug);
    const endpoint = isId
      ? `/teams/${teamSlug}`
      : `/teams/by-name/${encodeURIComponent(decodeURIComponent(teamSlug))}`;

    API.get(endpoint)
      .then(async (teamRes) => {
        const t = teamRes.data?.team ?? teamRes.data;
        setTeam(t);

        const [batRes, pitRes] = await Promise.all([
          API.get(`/teams/${t.id}/totals/batting`),
          API.get(`/teams/${t.id}/totals/pitching`),
        ]);

        setBatting(Array.isArray(batRes.data) ? batRes.data : []);
        setPitching(Array.isArray(pitRes.data) ? pitRes.data : []);
      })
      .catch(() => setErr("Failed to load team history."))
      .finally(() => setLoading(false));
  }, [teamSlug]);

  const handleSort = (col) => {
    if (sortKey === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(col);
      setSortDir(
        col === "year"
          ? "desc"
          : col === "era" || col === "whip"
            ? "asc"
            : "desc",
      );
    }
  };

  const rows = activeTab === "batting" ? batting : pitching;

  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const av =
        sortKey === "year" ? Number(a.year) : parseFloat(a[sortKey] ?? 0);
      const bv =
        sortKey === "year" ? Number(b.year) : parseFloat(b[sortKey] ?? 0);
      if (isNaN(av) && isNaN(bv)) return 0;
      if (isNaN(av)) return 1;
      if (isNaN(bv)) return -1;
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  const teamName = team?.name || decodeURIComponent(teamSlug || "");

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Container className="py-12 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-24" />
        <Skeleton className="h-96" />
      </Container>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (err) {
    return (
      <Container className="py-12">
        <BannerError message={err} />
      </Container>
    );
  }

  const thProps = { sortKey, sortDir, onSort: handleSort };

  return (
    <Container className="py-12 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
        <NavLink to="/teams" className="text-blue-600 hover:underline">
          Teams
        </NavLink>
        <span>/</span>
        <NavLink
          to={`/teams/${teamSlug}`}
          className="text-blue-600 hover:underline"
        >
          {teamName}
        </NavLink>
        <span>/</span>
        <span className="font-semibold text-gray-800">
          Season Totals History
        </span>
      </nav>

      {/* Header card */}
      <Card>
        <CardBody className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <BarChart3 size={14} /> Season Totals History
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {teamName}
            </h1>
            <p className="mt-1 text-gray-500 text-sm">
              {[team?.city, team?.state].filter(Boolean).join(", ") || ""}
              {"  "}Year-by-year team totals. Click on any season for more
              details.
            </p>
          </div>
          <div className="flex gap-4 text-center">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Seasons
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {batting.length}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Championships
              </div>
              <div className="text-2xl font-bold text-yellow-600">
                {Number(team?.championships_won) || 0}
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
            onClick={() => {
              setActiveTab(tab);
              setSortKey("year");
              setSortDir("desc");
            }}
            className={`px-6 py-2.5 text-sm font-semibold capitalize transition-colors ${
              activeTab === tab
                ? "bg-white text-blue-700 shadow-sm"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            } ${tab === "pitching" ? "border-l border-gray-200" : ""}`}
          >
            {tab === "batting" ? "⚾ Batting Totals" : "🥎 Pitching Totals"}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardBody className="p-0">
          {sortedRows.length === 0 ? (
            <p className="text-center text-gray-500 py-12">
              No {activeTab} totals on record for this team.
            </p>
          ) : (
            <div className="overflow-x-auto">
              {activeTab === "batting" ? (
                <table className="w-full text-xs md:text-sm whitespace-nowrap">
                  <thead>
                    <tr>
                      <Th
                        label="Year"
                        col="year"
                        tip={BATTING_GLOSSARY.year}
                        align="left"
                        {...thProps}
                      />
                      <Th
                        label="GP"
                        col="gp"
                        tip={BATTING_GLOSSARY.gp}
                        {...thProps}
                      />
                      <Th
                        label="AB"
                        col="ab"
                        tip={BATTING_GLOSSARY.ab}
                        {...thProps}
                      />
                      <Th
                        label="H"
                        col="h"
                        tip={BATTING_GLOSSARY.h}
                        {...thProps}
                      />
                      <Th
                        label="2B"
                        col="2b"
                        tip={BATTING_GLOSSARY["2b"]}
                        {...thProps}
                      />
                      <Th
                        label="3B"
                        col="3b"
                        tip={BATTING_GLOSSARY["3b"]}
                        {...thProps}
                      />
                      <Th
                        label="HR"
                        col="hr"
                        tip={BATTING_GLOSSARY.hr}
                        {...thProps}
                      />
                      <Th
                        label="R"
                        col="r"
                        tip={BATTING_GLOSSARY.r}
                        {...thProps}
                      />
                      <Th
                        label="RBI"
                        col="rbi"
                        tip={BATTING_GLOSSARY.rbi}
                        {...thProps}
                      />
                      <Th
                        label="BB"
                        col="bb"
                        tip={BATTING_GLOSSARY.bb}
                        {...thProps}
                      />
                      <Th
                        label="SO"
                        col="so"
                        tip={BATTING_GLOSSARY.so}
                        {...thProps}
                      />
                      <Th
                        label="SB"
                        col="sb"
                        tip={BATTING_GLOSSARY.sb}
                        {...thProps}
                      />
                      <Th
                        label="AVG"
                        col="avg"
                        tip={BATTING_GLOSSARY.avg}
                        {...thProps}
                      />
                      <Th
                        label="OBP"
                        col="obp"
                        tip={BATTING_GLOSSARY.obp}
                        {...thProps}
                      />
                      <Th
                        label="SLG"
                        col="slg"
                        tip={BATTING_GLOSSARY.slg}
                        {...thProps}
                      />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sortedRows.map((row, i) => (
                      <tr
                        key={row.year}
                        className="hover:bg-blue-50 transition-colors cursor-pointer"
                        onClick={() =>
                          navigate(`/teams/${teamSlug}/${row.year}`)
                        }
                      >
                        <td className="px-3 py-2 font-bold text-blue-600">
                          {row.year}
                        </td>
                        <td className="px-3 py-2 text-right">{val(row.gp)}</td>
                        <td className="px-3 py-2 text-right">{val(row.ab)}</td>
                        <td className="px-3 py-2 text-right">{val(row.h)}</td>
                        <td className="px-3 py-2 text-right">
                          {val(row.doubles ?? row["2b"])}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {val(row.triples ?? row["3b"])}
                        </td>
                        <td className="px-3 py-2 text-right">{val(row.hr)}</td>
                        <td className="px-3 py-2 text-right">{val(row.r)}</td>
                        <td className="px-3 py-2 text-right">{val(row.rbi)}</td>
                        <td className="px-3 py-2 text-right">{val(row.bb)}</td>
                        <td className="px-3 py-2 text-right">{val(row.so)}</td>
                        <td className="px-3 py-2 text-right">{val(row.sb)}</td>
                        <td className="px-3 py-2 text-right font-semibold text-blue-600">
                          {fmt3(row.avg)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {fmt3(row.obp)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {fmt3(row.slg)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-xs md:text-sm whitespace-nowrap">
                  <thead>
                    <tr>
                      <Th
                        label="Year"
                        col="year"
                        tip={PITCHING_GLOSSARY.year}
                        align="left"
                        {...thProps}
                      />
                      <Th
                        label="APP"
                        col="app"
                        tip={PITCHING_GLOSSARY.app}
                        {...thProps}
                      />
                      <Th
                        label="W"
                        col="w"
                        tip={PITCHING_GLOSSARY.w}
                        {...thProps}
                      />
                      <Th
                        label="L"
                        col="l"
                        tip={PITCHING_GLOSSARY.l}
                        {...thProps}
                      />
                      <Th
                        label="SV"
                        col="sv"
                        tip={PITCHING_GLOSSARY.sv}
                        {...thProps}
                      />
                      <Th
                        label="IP"
                        col="ip"
                        tip={PITCHING_GLOSSARY.ip}
                        {...thProps}
                      />
                      <Th
                        label="H"
                        col="h"
                        tip={PITCHING_GLOSSARY.h}
                        {...thProps}
                      />
                      <Th
                        label="R"
                        col="r"
                        tip={PITCHING_GLOSSARY.r}
                        {...thProps}
                      />
                      <Th
                        label="ER"
                        col="er"
                        tip={PITCHING_GLOSSARY.er}
                        {...thProps}
                      />
                      <Th
                        label="BB"
                        col="bb"
                        tip={PITCHING_GLOSSARY.bb}
                        {...thProps}
                      />
                      <Th
                        label="SO"
                        col="so"
                        tip={PITCHING_GLOSSARY.so}
                        {...thProps}
                      />
                      <Th
                        label="CG"
                        col="cg"
                        tip={PITCHING_GLOSSARY.cg}
                        {...thProps}
                      />
                      <Th
                        label="SHO"
                        col="sho"
                        tip={PITCHING_GLOSSARY.sho}
                        {...thProps}
                      />
                      <Th
                        label="ERA"
                        col="era"
                        tip={PITCHING_GLOSSARY.era}
                        {...thProps}
                      />
                      <Th
                        label="WHIP"
                        col="whip"
                        tip={PITCHING_GLOSSARY.whip}
                        {...thProps}
                      />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sortedRows.map((row, i) => (
                      <tr
                        key={row.year}
                        className="hover:bg-blue-50 transition-colors cursor-pointer"
                        onClick={() =>
                          navigate(`/teams/${teamSlug}/${row.year}`)
                        }
                      >
                        <td className="px-3 py-2 font-bold text-blue-600">
                          {row.year}
                        </td>
                        <td className="px-3 py-2 text-right">{val(row.app)}</td>
                        <td className="px-3 py-2 text-right">{val(row.w)}</td>
                        <td className="px-3 py-2 text-right">{val(row.l)}</td>
                        <td className="px-3 py-2 text-right">{val(row.sv)}</td>
                        <td className="px-3 py-2 text-right">{val(row.ip)}</td>
                        <td className="px-3 py-2 text-right">{val(row.h)}</td>
                        <td className="px-3 py-2 text-right">{val(row.r)}</td>
                        <td className="px-3 py-2 text-right">{val(row.er)}</td>
                        <td className="px-3 py-2 text-right">{val(row.bb)}</td>
                        <td className="px-3 py-2 text-right">{val(row.so)}</td>
                        <td className="px-3 py-2 text-right">{val(row.cg)}</td>
                        <td className="px-3 py-2 text-right">{val(row.sho)}</td>
                        <td className="px-3 py-2 text-right font-semibold text-blue-600">
                          {fmt2(row.era)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {fmt2(row.whip)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Footer note */}
      <p className="text-xs text-gray-400 text-center">
        Hover any column header to see its full definition.
      </p>
    </Container>
  );
}
