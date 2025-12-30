// frontend/src/pages/BattingLeadersPage.jsx
import React, { useEffect, useState } from "react";
import { API } from "../api";
import { Container } from "../components/common/Container";

const YEARS = [2025, 2024, 2023, 2022, 2021, 2020];

export default function BattingLeadersPage() {
  const [year, setYear] = useState(2025);
  const [sort, setSort] = useState("avg");
  const [order, setOrder] = useState("desc"); // NBC sorts best AVG first
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load leaders when filters change
  useEffect(() => {
    let cancelled = false;

    async function loadLeaders() {
      setLoading(true);
      setError("");

      try {
        const res = await API.get("/players/batting-leaders", {
          params: { year, sort, order },
        });
        if (!cancelled) {
          setPlayers(res.data.players || []);
        }
      } catch (err) {
        console.error("Failed to load batting leaders", err);
        if (!cancelled) {
          setError("Could not load batting leaders. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadLeaders();
    return () => {
      cancelled = true;
    };
  }, [year, sort, order]);

  // Click AVG header to toggle desc/asc
  const toggleAvgSort = () => {
    setSort("avg");
    setOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const sortArrow = sort === "avg" ? (order === "desc" ? "▼" : "▲") : "";

  return (
    <Container className="py-10">
      {/* Page title */}
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight mb-1">
          Batting Leaders
        </h1>
        <p className="text-sm text-slate-500">
          Qualified hitters sorted by batting average for {year}.
        </p>
      </header>

      {/* Filter bar – similar concept to MLB’s top row */}
      <div className="mb-6 flex flex-wrap items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
        {/* Year selector */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            Year
          </span>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="rounded border border-slate-300 bg-white px-2 py-1 text-xs md:text-sm"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Tournament label (static, like MLB's "MLB" dropdown) */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            Tournament
          </span>
          <span className="rounded border border-slate-200 bg-white px-3 py-1 text-xs md:text-sm">
            NBC World Series
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Hitting / Pitching toggle (pitching disabled for now) */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-full p-1">
          <button className="px-3 py-1 text-[11px] md:text-xs font-semibold rounded-full bg-slate-900 text-white">
            Hitting
          </button>
          <button
            className="px-3 py-1 text-[11px] md:text-xs font-medium rounded-full text-slate-400 cursor-not-allowed"
            title="Pitching leaders not implemented yet"
          >
            Pitching
          </button>
        </div>
      </div>

      {/* Leaders table */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white shadow-sm">
        <table className="min-w-full text-xs md:text-sm">
          <thead className="bg-slate-900 text-slate-100">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">#</th>
              <th className="px-3 py-2 text-left font-semibold">Player</th>
              <th className="px-3 py-2 text-left font-semibold">Team</th>
              <th className="px-3 py-2 text-right font-semibold">G</th>
              <th className="px-3 py-2 text-right font-semibold">AB</th>
              <th className="px-3 py-2 text-right font-semibold">R</th>
              <th className="px-3 py-2 text-right font-semibold">H</th>
              <th className="px-3 py-2 text-right font-semibold">HR</th>
              <th className="px-3 py-2 text-right font-semibold">RBI</th>
              {/* Sortable AVG header */}
              <th
                className="px-3 py-2 text-right font-semibold cursor-pointer select-none"
                onClick={toggleAvgSort}
              >
                AVG{" "}
                {sortArrow && (
                  <span className="inline-block align-middle ml-0.5">
                    {sortArrow}
                  </span>
                )}
              </th>
              <th className="px-3 py-2 text-right font-semibold">OBP</th>
              <th className="px-3 py-2 text-right font-semibold">SLG</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={12}
                  className="px-4 py-6 text-center text-slate-500"
                >
                  Loading leaders…
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={12} className="px-4 py-6 text-center text-red-600">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && players.length === 0 && (
              <tr>
                <td
                  colSpan={12}
                  className="px-4 py-6 text-center text-slate-500"
                >
                  No batting leaders found for {year}.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              players.map((p, idx) => (
                <tr
                  key={`${p.player_id}-${p.team_id}-${p.year}`}
                  className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
                >
                  <td className="px-3 py-2 text-right text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {p.first_name} {p.last_name}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-slate-600">
                    {p.team_name}
                  </td>
                  <td className="px-3 py-2 text-right">{p.gp}</td>
                  <td className="px-3 py-2 text-right">{p.ab}</td>
                  <td className="px-3 py-2 text-right">{p.r}</td>
                  <td className="px-3 py-2 text-right">{p.h}</td>
                  <td className="px-3 py-2 text-right">{p.hr}</td>
                  <td className="px-3 py-2 text-right">{p.rbi}</td>
                  <td className="px-3 py-2 text-right font-semibold">
                    {Number(p.avg || 0).toFixed(3)}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {p.obp != null ? Number(p.obp).toFixed(3) : "—"}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {p.slg != null ? Number(p.slg).toFixed(3) : "—"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
