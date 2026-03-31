import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import { API } from "../api";
import { Container } from "../components/common/Container";
import { Card, CardBody } from "../components/common/Card";
import { BannerError } from "../components/common/BannerError";
import { Skeleton } from "../components/common/Skeleton";

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
      setSortDir(col === "team_name" ? "asc" : "desc");
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

export default function TeamTotalsPage() {
  const navigate = useNavigate();

  const [year, setYear] = useState(2025);
  const [activeTab, setActiveTab] = useState("batting");
  const [battingRows, setBattingRows] = useState([]);
  const [pitchingRows, setPitchingRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [sortKey, setSortKey] = useState("team_name");
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setErr(null);

        const [batRes, pitRes] = await Promise.all([
          API.get(`/teams/totals/batting?year=${year}`),
          API.get(`/teams/totals/pitching?year=${year}`),
        ]);

        setBattingRows(Array.isArray(batRes.data) ? batRes.data : []);
        setPitchingRows(Array.isArray(pitRes.data) ? pitRes.data : []);
      } catch (_e) {
        setErr("Failed to load team totals.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [year]);

  const rows = activeTab === "batting" ? battingRows : pitchingRows;

  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      if (sortKey === "team_name") {
        const av = a.team_name || "";
        const bv = b.team_name || "";
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }

      const av = parseFloat(a[sortKey] ?? 0);
      const bv = parseFloat(b[sortKey] ?? 0);
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  if (loading) {
    return (
      <Container className="py-12 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-24" />
        <Skeleton className="h-96" />
      </Container>
    );
  }

  return (
    <Container className="py-12 space-y-6">
      <nav className="text-sm text-gray-500">
        <NavLink to="/" className="text-blue-600 hover:underline">
          Home
        </NavLink>{" "}
        / <span className="font-semibold text-gray-800">Team Totals</span>
      </nav>

      <Card>
        <CardBody className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <BarChart3 size={14} /> Team Totals
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Team Totals by Year
            </h1>
            <p className="mt-1 text-gray-500 text-sm">
              One page with sortable totals for every team.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Year</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              {[2025, 2024, 2023, 2022, 2021, 2020].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </CardBody>
      </Card>

      {err && <BannerError message={err} />}

      <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
        {["batting", "pitching"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSortKey("team_name");
              setSortDir("asc");
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
          <div className="overflow-x-auto">
            {activeTab === "batting" ? (
              <table className="w-full text-xs md:text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <SortableHeader
                      label="Team"
                      col="team_name"
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
                          onClick={() => navigate(`/teams/${row.team_id}`)}
                          className="hover:underline text-left"
                        >
                          {row.team_name}
                        </button>
                      </td>
                      <td className="px-3 py-2 text-right">{val(row.gp)}</td>
                      <td className="px-3 py-2 text-right">{val(row.ab)}</td>
                      <td className="px-3 py-2 text-right">{val(row.h)}</td>
                      <td className="px-3 py-2 text-right">
                        {val(row.doubles)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {val(row.triples)}
                      </td>
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
            ) : (
              <table className="w-full text-xs md:text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <SortableHeader
                      label="Team"
                      col="team_name"
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
                          onClick={() => navigate(`/teams/${row.team_id}`)}
                          className="hover:underline text-left"
                        >
                          {row.team_name}
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
            )}
          </div>
        </CardBody>
      </Card>
    </Container>
  );
}
