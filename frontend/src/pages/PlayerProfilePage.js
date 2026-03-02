// frontend/src/pages/PlayerProfilePage.js
import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Container } from "../components/common/Container";
import { SectionTitle } from "../components/common/SectionTitle";
import { Card, CardBody } from "../components/common/Card";
import { BannerError } from "../components/common/BannerError";
import { Skeleton } from "../components/common/Skeleton";
import { API } from "../api";

function pickArray(v) {
  if (Array.isArray(v)) return v;
  if (Array.isArray(v?.data)) return v.data;
  if (Array.isArray(v?.rows)) return v.rows;
  return [];
}

function unwrapPayload(payload) {
  // Supports:
  // 1) { success: true, data: {...} }
  // 2) {...} direct
  if (!payload) return null;
  if (payload.success === true && payload.data) return payload.data;
  return payload;
}

// ---- Formatting helpers ----
// Baseball style: ".333"
function fmtAvg3(v) {
  if (v === null || v === undefined || v === "") return "—";
  const n = Number(v);
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(3).replace(/^0/, "");
}

// Fielding pct: ".975"
function fmtPct3(v) {
  if (v === null || v === undefined || v === "") return "—";
  const n = Number(v);
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(3).replace(/^0/, "");
}

// 2-decimal numeric: "4.67"
function fmt2(v) {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "string" && v.toLowerCase().includes("inf")) return "∞";
  const n = Number(v);
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(2);
}

export default function PlayerProfilePage() {
  const { id } = useParams();
  const [data, setData] = useState(null); // normalized payload
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchPlayer() {
      setLoading(true);
      setErr(null);

      try {
        const res = await API.get(`/players/${id}`);
        const raw = unwrapPayload(res.data);

        if (!raw) throw new Error("Failed to load player data.");

        // normalize common field-name differences
        const player = raw.player || raw;
        const fullName =
          player.fullName ||
          player.full_name ||
          raw.fullName ||
          raw.full_name ||
          raw.player?.fullName ||
          raw.player?.full_name ||
          (player.first_name && player.last_name
            ? `${player.first_name} ${player.last_name}`
            : null) ||
          (player.firstName && player.lastName
            ? `${player.firstName} ${player.lastName}`
            : null) ||
          "Player";

        const batting = raw.batting || {};
        const pitching = raw.pitching || {};

        // arrays might be batting.stats OR batting.rows OR batting.data
        const battingStats =
          pickArray(batting.stats) ||
          pickArray(batting.rows) ||
          pickArray(batting.data) ||
          pickArray(raw.batting_stats) ||
          [];

        const pitchingStats =
          pickArray(pitching.stats) ||
          pickArray(pitching.rows) ||
          pickArray(pitching.data) ||
          pickArray(raw.pitching_stats) ||
          [];

        const battingCareer =
          batting.career || raw.batting_career || raw.career_batting || null;
        const pitchingCareer =
          pitching.career || raw.pitching_career || raw.career_pitching || null;

        const teams = pickArray(raw.teams);

        const normalized = {
          player: {
            ...player,
            fullName,
          },
          batting: {
            ...batting,
            stats: battingStats,
            career: battingCareer,
          },
          pitching: {
            ...pitching,
            stats: pitchingStats,
            career: pitchingCareer,
          },
          teams,
        };

        if (!cancelled) setData(normalized);
      } catch (e) {
        if (!cancelled) {
          // axios error shape fallback
          const msg =
            e?.response?.status === 404
              ? "Player not found."
              : e?.response?.data?.error ||
                e?.message ||
                "Failed to load player.";
          setErr(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (id) fetchPlayer();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const battingStats = data?.batting?.stats || [];
  const pitchingStats = data?.pitching?.stats || [];
  const battingCareer = data?.batting?.career || null;
  const pitchingCareer = data?.pitching?.career || null;
  const teams = data?.teams || [];

  const headline = data?.player?.fullName || "Player";

  const summary = useMemo(() => {
    const seasons = Math.max(
      Number(battingCareer?.seasons || 0),
      Number(pitchingCareer?.seasons || 0),
    );
    const teamsCount = Math.max(
      Number(battingCareer?.teams_count || 0),
      Number(pitchingCareer?.teams_count || 0),
    );
    return { seasons, teamsCount };
  }, [battingCareer, pitchingCareer]);

  return (
    <Container className="py-12">
      <div className="mb-4">
        <Link
          to="/player-stats"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Player Stats
        </Link>
      </div>

      <SectionTitle
        eyebrow="Player Profile"
        title={headline}
        desc="Complete NBC World Series history across all seasons and teams."
      />

      {err && (
        <div className="mb-4">
          <BannerError message={err} />
        </div>
      )}

      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      )}

      {!loading && !err && data && (
        <div className="space-y-8">
          <Card>
            <CardBody>
              <div className="flex flex-wrap gap-6 items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {headline}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {summary.seasons || 0} NBC World Series season
                    {summary.seasons === 1 ? "" : "s"} ·{" "}
                    {summary.teamsCount || 0} team
                    {summary.teamsCount === 1 ? "" : "s"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  {battingCareer && (
                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">
                        Career Batting
                      </div>
                      <div className="font-semibold text-gray-900">
                        AVG {fmtAvg3(battingCareer.career_avg)} · OBP{" "}
                        {fmtAvg3(battingCareer.career_obp)} · SLG{" "}
                        {fmtAvg3(battingCareer.career_slg)}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        GP {battingCareer.total_gp || 0}, AB{" "}
                        {battingCareer.total_ab || 0}, H{" "}
                        {battingCareer.total_h || 0}, HR{" "}
                        {battingCareer.total_hr || 0}, RBI{" "}
                        {battingCareer.total_rbi || 0}
                      </div>
                    </div>
                  )}

                  {pitchingCareer && (
                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">
                        Career Pitching
                      </div>
                      <div className="font-semibold text-gray-900">
                        ERA {fmt2(pitchingCareer.career_era)} · W{" "}
                        {pitchingCareer.total_w || 0} · L{" "}
                        {pitchingCareer.total_l || 0} · SV{" "}
                        {pitchingCareer.total_sv || 0}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        APP {pitchingCareer.total_app || 0}, IP{" "}
                        {fmt2(pitchingCareer.total_ip)}, SO{" "}
                        {pitchingCareer.total_so || 0}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>

          {teams.length > 0 && (
            <Card>
              <CardBody>
                <h3 className="text-sm font-bold text-gray-800 mb-3">
                  Teams Played For
                </h3>
                <ul className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 text-sm">
                  {teams.map((t, idx) => (
                    <li
                      key={`${t.name || "team"}-${idx}`}
                      className="border border-gray-200 rounded-lg px-3 py-2"
                    >
                      <div className="font-semibold text-gray-900">
                        {t.name || "—"}
                      </div>
                      <div className="text-xs text-gray-600">
                        {t.city || "—"}
                        {t.state ? `, ${t.state}` : ""}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {Array.isArray(t.batting_years) &&
                          t.batting_years.length > 0 && (
                            <span className="mr-2">
                              Batting: {t.batting_years.join(", ")}
                            </span>
                          )}
                        {Array.isArray(t.pitching_years) &&
                          t.pitching_years.length > 0 && (
                            <span>Pitching: {t.pitching_years.join(", ")}</span>
                          )}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}

          {battingStats.length > 0 && (
            <Card>
              <CardBody>
                <h3 className="text-sm font-bold text-gray-800 mb-3">
                  Season Batting Stats
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1400px] text-xs md:text-sm">
                    <thead className="bg-gray-50">
                      <tr className="border-b border-gray-200 text-gray-700">
                        <th className="px-3 py-2 text-left font-semibold">
                          Year
                        </th>
                        <th className="px-3 py-2 text-left font-semibold">
                          Team
                        </th>
                        <th className="px-2 py-2 text-center font-semibold">
                          No.
                        </th>
                        <th className="px-2 py-2 text-center font-semibold">
                          Pos
                        </th>
                        <th className="px-2 py-2 text-right font-semibold">
                          GP
                        </th>
                        <th className="px-2 py-2 text-right font-semibold">
                          AB
                        </th>
                        <th className="px-2 py-2 text-right font-semibold">
                          R
                        </th>
                        <th className="px-2 py-2 text-right font-semibold">
                          H
                        </th>
                        <th className="px-2 py-2 text-right font-semibold">
                          2B
                        </th>
                        <th className="px-2 py-2 text-right font-semibold">
                          3B
                        </th>
                        <th className="px-2 py-2 text-right font-semibold">
                          HR
                        </th>
                        <th className="px-2 py-2 text-right font-semibold">
                          RBI
                        </th>
                        <th className="px-2 py-2 text-right font-semibold">
                          SB
                        </th>

                        {/* 1966 CSV columns */}
                        <th className="px-2 py-2 text-right font-semibold">
                          SH
                        </th>
                        <th className="px-2 py-2 text-right font-semibold">
                          PO
                        </th>
                        <th className="px-2 py-2 text-right font-semibold">
                          A
                        </th>
                        <th className="px-2 py-2 text-right font-semibold">
                          E
                        </th>
                        <th className="px-2 py-2 text-right font-semibold">
                          Pct
                        </th>

                        <th className="px-2 py-2 text-right font-semibold">
                          AVG
                        </th>
                        <th className="px-2 py-2 text-right font-semibold">
                          OBP
                        </th>
                        <th className="px-2 py-2 text-right font-semibold">
                          SLG
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {battingStats.map((row, idx) => (
                        <tr
                          key={`${row.year || "y"}-${row.team_name || "t"}-${idx}`}
                          className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          <td className="px-3 py-1.5">{row.year ?? "—"}</td>

                          <td className="px-3 py-1.5">
                            {row.team_name || "—"}
                            {row.city || row.state
                              ? ` (${row.city || "—"}${row.state ? `, ${row.state}` : ""})`
                              : ""}
                          </td>

                          <td className="px-2 py-1.5 text-center">
                            {row.jersey_num || "—"}
                          </td>

                          <td className="px-2 py-1.5 text-center">
                            {row.position || "—"}
                          </td>

                          <td className="px-2 py-1.5 text-right">
                            {row.gp ?? "—"}
                          </td>
                          <td className="px-2 py-1.5 text-right">
                            {row.ab ?? "—"}
                          </td>
                          <td className="px-2 py-1.5 text-right">
                            {row.r ?? "—"}
                          </td>
                          <td className="px-2 py-1.5 text-right">
                            {row.h ?? "—"}
                          </td>

                          <td className="px-2 py-1.5 text-right">
                            {row.doubles ?? row["2b"] ?? "—"}
                          </td>
                          <td className="px-2 py-1.5 text-right">
                            {row.triples ?? row["3b"] ?? "—"}
                          </td>

                          <td className="px-2 py-1.5 text-right">
                            {row.hr ?? "—"}
                          </td>
                          <td className="px-2 py-1.5 text-right">
                            {row.rbi ?? "—"}
                          </td>
                          <td className="px-2 py-1.5 text-right">
                            {row.sb ?? "—"}
                          </td>

                          <td className="px-2 py-1.5 text-right">
                            {row.sh ?? "—"}
                          </td>
                          <td className="px-2 py-1.5 text-right">
                            {row.po ?? "—"}
                          </td>
                          <td className="px-2 py-1.5 text-right">
                            {row.a ?? "—"}
                          </td>
                          <td className="px-2 py-1.5 text-right">
                            {row.e ?? "—"}
                          </td>
                          <td className="px-2 py-1.5 text-right">
                            {fmtPct3(row.fld)}
                          </td>

                          <td className="px-2 py-1.5 text-right">
                            {fmtAvg3(row.avg)}
                          </td>
                          <td className="px-2 py-1.5 text-right">
                            {fmtAvg3(row.obp)}
                          </td>
                          <td className="px-2 py-1.5 text-right">
                            {fmtAvg3(row.slg)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          )}

          {pitchingStats.length > 0 && (
            <Card>
              <CardBody>
                <h3 className="text-sm font-bold text-gray-800 mb-3">
                  Season Pitching Stats
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1200px] text-xs md:text-sm">
                    <thead className="bg-gray-50">
                      <tr className="border-b border-gray-200 text-gray-700">
                        <th className="px-3 py-2 text-left font-semibold">
                          Year
                        </th>
                        <th className="px-3 py-2 text-left font-semibold">
                          Team
                        </th>
                        <th className="px-2 py-2 text-center font-semibold">
                          No.
                        </th>
                        <th className="px-2 py-2 text-right font-semibold">
                          ERA
                        </th>
                        <th className="px-2 py-2 text-right font-semibold">
                          W
                        </th>
                        <th className="px-2 py-2 text-right font-semibold">
                          L
                        </th>
                        <th className="px-2 py-2 text-right font-semibold">
                          APP
                        </th>
                        <th className="px-2 py-2 text-right font-semibold">
                          GS
                        </th>
                        <th className="px-2 py-2 text-right font-semibold">
                          SV
                        </th>

                        {/* ✅ IP is formatted to 2 decimals */}
                        <th className="px-2 py-2 text-right font-semibold">
                          IP
                        </th>

                        <th className="px-2 py-2 text-right font-semibold">
                          H
                        </th>
                        <th className="px-2 py-2 text-right font-semibold">
                          ER
                        </th>
                        <th className="px-2 py-2 text-right font-semibold">
                          BB
                        </th>
                        <th className="px-2 py-2 text-right font-semibold">
                          SO
                        </th>
                        <th className="px-2 py-2 text-right font-semibold">
                          HR
                        </th>
                        <th className="px-2 py-2 text-right font-semibold">
                          B/Avg
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {pitchingStats.map((row, idx) => (
                        <tr
                          key={`${row.year || "y"}-${row.team_name || "t"}-${idx}`}
                          className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          <td className="px-3 py-1.5">{row.year ?? "—"}</td>

                          <td className="px-3 py-1.5">
                            {row.team_name || "—"}
                            {row.city || row.state
                              ? ` (${row.city || "—"}${row.state ? `, ${row.state}` : ""})`
                              : ""}
                          </td>

                          <td className="px-2 py-1.5 text-center">
                            {row.jersey_num || "—"}
                          </td>

                          <td className="px-2 py-1.5 text-right font-medium">
                            {fmt2(row.era)}
                          </td>

                          <td className="px-2 py-1.5 text-right">
                            {row.w ?? "—"}
                          </td>
                          <td className="px-2 py-1.5 text-right">
                            {row.l ?? "—"}
                          </td>
                          <td className="px-2 py-1.5 text-right">
                            {row.app ?? "—"}
                          </td>
                          <td className="px-2 py-1.5 text-right">
                            {row.gs ?? "—"}
                          </td>
                          <td className="px-2 py-1.5 text-right">
                            {row.sv ?? "—"}
                          </td>

                          {/* ✅ IP formatted */}
                          <td className="px-2 py-1.5 text-right">
                            {fmt2(row.ip)}
                          </td>

                          <td className="px-2 py-1.5 text-right">
                            {row.h ?? "—"}
                          </td>
                          <td className="px-2 py-1.5 text-right">
                            {row.er ?? "—"}
                          </td>
                          <td className="px-2 py-1.5 text-right">
                            {row.bb ?? "—"}
                          </td>
                          <td className="px-2 py-1.5 text-right">
                            {row.so ?? "—"}
                          </td>
                          <td className="px-2 py-1.5 text-right">
                            {row.hr ?? "—"}
                          </td>

                          <td className="px-2 py-1.5 text-right">
                            {fmtAvg3(row.b_avg)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          )}

          {!battingStats.length && !pitchingStats.length && (
            <Card>
              <CardBody>
                <p className="text-center text-gray-600 py-8">
                  No stats found for this player yet.
                </p>
              </CardBody>
            </Card>
          )}
        </div>
      )}
    </Container>
  );
}
