import React, { useEffect, useMemo, useState } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { BarChart3, ChevronRight } from "lucide-react";
import { Container } from "../components/common/Container";
import { Card, CardBody } from "../components/common/Card";
import { BannerError } from "../components/common/BannerError";
import { Skeleton } from "../components/common/Skeleton";

const API = process.env.REACT_APP_API_URL || "";

function fmt3(v) {
  const n = parseFloat(v);
  if (isNaN(n)) return v ?? "—";
  return n.toFixed(3).replace(/^0/, ".");
}
function fmt2(v) {
  const n = parseFloat(v);
  if (isNaN(n)) return v ?? "—";
  return n.toFixed(2);
}
function val(v) {
  return v != null && v !== "" ? v : "—";
}

function SortableHeader({
  label,
  col,
  sortKey,
  sortDir,
  setSortKey,
  setSortDir,
  align = "right",
}) {
  const active = sortKey === col;

  function handleClick() {
    if (active) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(col);
      setSortDir(col === "year" ? "desc" : "desc");
    }
  }

  return (
    <th
      onClick={handleClick}
      className={`px-3 py-2 font-semibold text-gray-600 cursor-pointer select-none ${
        align === "left" ? "text-left" : "text-right"
      }`}
    >
      {label} {active ? (sortDir === "asc" ? "▲" : "▼") : ""}
    </th>
  );
}

function BattingTotalsTable({
  rows,
  teamSlug,
  onYearClick,
  sortKey,
  sortDir,
  setSortKey,
  setSortDir,
}) {
  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];

      if (sortKey === "year") {
        return sortDir === "asc"
          ? Number(av) - Number(bv)
          : Number(bv) - Number(av);
      }

      const an = parseFloat(av ?? 0);
      const bn = parseFloat(bv ?? 0);
      return sortDir === "asc" ? an - bn : bn - an;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  if (!rows.length) {
    return (
      <p className="text-gray-500 text-sm py-8 text-center">
        No batting totals available.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs md:text-sm whitespace-nowrap">
        <thead>
          <tr className="bg-gray-50 border-b">
            <SortableHeader
              label="Year"
              col="year"
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
              align="left"
            />
            <SortableHeader
              label="GP"
              col="gp"
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
            />
            <SortableHeader
              label="AB"
              col="ab"
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
            />
            <SortableHeader
              label="H"
              col="h"
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
            />
            <SortableHeader
              label="2B"
              col="doubles"
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
            />
            <SortableHeader
              label="3B"
              col="triples"
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
            />
            <SortableHeader
              label="HR"
              col="hr"
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
            />
            <SortableHeader
              label="R"
              col="r"
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
            />
            <SortableHeader
              label="RBI"
              col="rbi"
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
            />
            <SortableHeader
              label="BB"
              col="bb"
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
            />
            <SortableHeader
              label="SO"
              col="so"
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
            />
            <SortableHeader
              label="SB"
              col="sb"
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
            />
            <SortableHeader
              label="AVG"
              col="avg"
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
            />
            <SortableHeader
              label="OBP"
              col="obp"
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
            />
            <SortableHeader
              label="SLG"
              col="slg"
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
            />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sortedRows.map((row, i) => (
            <tr key={i} className="hover:bg-blue-50 transition-colors">
              <td className="px-3 py-2 font-semibold text-blue-600">
                <button
                  onClick={() => onYearClick(row.year)}
                  className="hover:underline"
                >
                  {row.year}
                </button>
              </td>
              <td className="px-3 py-2 text-right">{val(row.gp)}</td>
              <td className="px-3 py-2 text-right">{val(row.ab)}</td>
              <td className="px-3 py-2 text-right">{val(row.h)}</td>
              <td className="px-3 py-2 text-right">{val(row.doubles)}</td>
              <td className="px-3 py-2 text-right">{val(row.triples)}</td>
              <td className="px-3 py-2 text-right">{val(row.hr)}</td>
              <td className="px-3 py-2 text-right">{val(row.r)}</td>
              <td className="px-3 py-2 text-right">{val(row.rbi)}</td>
              <td className="px-3 py-2 text-right">{val(row.bb)}</td>
              <td className="px-3 py-2 text-right">{val(row.so)}</td>
              <td className="px-3 py-2 text-right">{val(row.sb)}</td>
              <td className="px-3 py-2 text-right font-semibold">
                {fmt3(row.avg)}
              </td>
              <td className="px-3 py-2 text-right">{fmt3(row.obp)}</td>
              <td className="px-3 py-2 text-right">{fmt3(row.slg)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PitchingTotalsTable({
  rows,
  onYearClick,
  sortKey,
  sortDir,
  setSortKey,
  setSortDir,
}) {
  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];

      if (sortKey === "year") {
        return sortDir === "asc"
          ? Number(av) - Number(bv)
          : Number(bv) - Number(av);
      }

      const an = parseFloat(av ?? 0);
      const bn = parseFloat(bv ?? 0);
      return sortDir === "asc" ? an - bn : bn - an;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  if (!rows.length) {
    return (
      <p className="text-gray-500 text-sm py-8 text-center">
        No pitching totals available.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs md:text-sm whitespace-nowrap">
        <thead>
          <tr className="bg-gray-50 border-b">
            <SortableHeader
              label="Year"
              col="year"
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
              align="left"
            />
            <SortableHeader
              label="APP"
              col="app"
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
            />
            <SortableHeader
              label="W"
              col="w"
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
            />
            <SortableHeader
              label="L"
              col="l"
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
            />
            <SortableHeader
              label="SV"
              col="sv"
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
            />
            <SortableHeader
              label="IP"
              col="ip"
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
            />
            <SortableHeader
              label="H"
              col="h"
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
            />
            <SortableHeader
              label="R"
              col="r"
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
            />
            <SortableHeader
              label="ER"
              col="er"
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
            />
            <SortableHeader
              label="BB"
              col="bb"
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
            />
            <SortableHeader
              label="SO"
              col="so"
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
            />
            <SortableHeader
              label="CG"
              col="cg"
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
            />
            <SortableHeader
              label="SHO"
              col="sho"
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
            />
            <SortableHeader
              label="ERA"
              col="era"
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
            />
            <SortableHeader
              label="WHIP"
              col="whip"
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
            />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sortedRows.map((row, i) => (
            <tr key={i} className="hover:bg-blue-50 transition-colors">
              <td className="px-3 py-2 font-semibold text-blue-600">
                <button
                  onClick={() => onYearClick(row.year)}
                  className="hover:underline"
                >
                  {row.year}
                </button>
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
              <td className="px-3 py-2 text-right font-semibold">
                {fmt2(row.era)}
              </td>
              <td className="px-3 py-2 text-right">{fmt2(row.whip)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function TeamTotals() {
  const { teamSlug } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [battingTotals, setBattingTotals] = useState([]);
  const [pitchingTotals, setPitchingTotals] = useState([]);
  const [activeTab, setActiveTab] = useState("batting");
  const [sortKey, setSortKey] = useState("year");
  const [sortDir, setSortDir] = useState("desc");
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

        const [batRes, pitRes] = await Promise.all([
          fetch(`${API}/api/teams/${t.id}/batting-totals-by-year`).then((r) =>
            r.json(),
          ),
          fetch(`${API}/api/teams/${t.id}/pitching-totals-by-year`).then((r) =>
            r.json(),
          ),
        ]);

        setBattingTotals(Array.isArray(batRes) ? batRes : []);
        setPitchingTotals(Array.isArray(pitRes) ? pitRes : []);
      })
      .catch(() => setErr("Failed to load team totals."))
      .finally(() => setLoading(false));
  }, [teamSlug]);

  function handleYearClick(year) {
    navigate(`/teams/${teamSlug}/${year}`);
  }

  if (loading) {
    return (
      <Container className="py-12 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40" />
        <Skeleton className="h-96" />
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

  const teamName = team?.name || decodeURIComponent(teamSlug || "");

  return (
    <Container className="py-12 space-y-6">
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
        <span className="font-semibold text-gray-800">Totals by Year</span>
      </nav>

      <Card>
        <CardBody className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <BarChart3 size={14} /> Team Totals by Year
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {teamName}
            </h1>
            <p className="mt-1 text-gray-500 text-sm">
              {[team?.city, team?.state].filter(Boolean).join(", ")}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Click a year to view that season’s player stats
          </div>
        </CardBody>
      </Card>

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

      <Card>
        <CardBody className="p-0">
          {activeTab === "batting" ? (
            <BattingTotalsTable
              rows={battingTotals}
              teamSlug={teamSlug}
              onYearClick={handleYearClick}
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
            />
          ) : (
            <PitchingTotalsTable
              rows={pitchingTotals}
              onYearClick={handleYearClick}
              sortKey={sortKey}
              sortDir={sortDir}
              setSortKey={setSortKey}
              setSortDir={setSortDir}
            />
          )}
        </CardBody>
      </Card>
    </Container>
  );
}
