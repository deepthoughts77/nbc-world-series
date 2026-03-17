// frontend/src/pages/PlayerProfile.jsx
//
// Route: /players/:id
// Data:  GET /api/players/:id  (playerController.getPlayerById)
//
// Response shape:
// {
//   player:  { id, firstName, lastName, fullName, isHallOfFame, mlbTeam }
//   batting: { stats: [...], career: {...} }
//   pitching:{ stats: [...], career: {...} }
//   teams:   [{ name, city, state, batting_years, pitching_years }]
// }

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Trophy, Award } from "lucide-react";
import { API } from "../api";
import { Container } from "../components/common/Container";
import { Skeleton } from "../components/common/Skeleton";

// ── Formatters ────────────────────────────────────────────────────────────

const fmtAvg = (v) => {
  if (v === null || v === undefined || v === "") return ".000";
  const n = parseFloat(v);
  if (isNaN(n)) return ".000";
  return n.toFixed(3).replace(/^0/, "");
};

const fmtEra = (v) => {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "string" && v.toLowerCase().includes("inf")) return "∞";
  const n = parseFloat(v);
  return isNaN(n) ? "—" : n.toFixed(2);
};

const fmtIp = (v) => {
  if (v === null || v === undefined || v === "") return "—";
  const n = parseFloat(v);
  return isNaN(n) ? "—" : n.toFixed(1);
};

const safe = (v, fallback = "—") =>
  v === null || v === undefined || v === "" ? fallback : v;

// ── Sub-components ────────────────────────────────────────────────────────

function ErrorBox({ message }) {
  return (
    <div
      style={{
        background: "#FEF2F2",
        border: "1px solid #FECACA",
        borderRadius: 8,
        padding: "16px 20px",
        color: "#DC2626",
        fontSize: 14,
        fontWeight: 500,
        marginTop: 16,
      }}
    >
      {message || "An error occurred loading this player."}
    </div>
  );
}

function StatBox({ label, value, highlight }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "16px 12px",
        background: highlight ? "#1D4ED8" : "#F8FAFC",
        border: `1px solid ${highlight ? "#1D4ED8" : "#E2E8F0"}`,
        borderRadius: 8,
      }}
    >
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: highlight ? "#FFFFFF" : "#0F172A",
          fontFamily: "'IBM Plex Mono', monospace",
          letterSpacing: "-0.02em",
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: highlight ? "#BFDBFE" : "#64748B",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 16,
        paddingBottom: 10,
        borderBottom: "2px solid #E2E8F0",
      }}
    >
      <div
        style={{
          width: 4,
          height: 20,
          background: "#1D4ED8",
          borderRadius: 2,
        }}
      />
      <h2
        style={{
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: "#0F172A",
          textTransform: "uppercase",
          margin: 0,
        }}
      >
        {title}
      </h2>
    </div>
  );
}

// ── Batting stats table ───────────────────────────────────────────────────

function BattingTable({ stats }) {
  if (!stats || stats.length === 0) return null;

  const cols = [
    { key: "year", label: "Year", right: false },
    { key: "team_name", label: "Team", right: false },
    { key: "gp", label: "G", right: true },
    { key: "ab", label: "AB", right: true },
    { key: "r", label: "R", right: true },
    { key: "h", label: "H", right: true },
    { key: "doubles", label: "2B", right: true },
    { key: "triples", label: "3B", right: true },
    { key: "hr", label: "HR", right: true },
    { key: "rbi", label: "RBI", right: true },
    { key: "sb", label: "SB", right: true },
    { key: "sh", label: "SH", right: true },
    { key: "bb", label: "BB", right: true },
    { key: "so", label: "SO", right: true },
    { key: "po", label: "PO", right: true },
    { key: "a", label: "A", right: true },
    { key: "e", label: "E", right: true },
    { key: "avg", label: "AVG", right: true, fmt: fmtAvg },
    { key: "obp", label: "OBP", right: true, fmt: fmtAvg },
    { key: "slg", label: "SLG", right: true, fmt: fmtAvg },
  ];

  return (
    <div
      style={{
        overflowX: "auto",
        borderRadius: 8,
        border: "1px solid #E2E8F0",
      }}
    >
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
      >
        <thead>
          <tr style={{ background: "#F1F5F9" }}>
            {cols.map((c) => (
              <th
                key={c.key}
                style={{
                  padding: "9px 12px",
                  textAlign: c.right ? "right" : "left",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#64748B",
                  textTransform: "uppercase",
                  borderBottom: "2px solid #E2E8F0",
                  whiteSpace: "nowrap",
                }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stats.map((row, i) => (
            <tr
              key={`${row.year}-${row.team_name}-${i}`}
              style={{ background: i % 2 === 0 ? "#FFFFFF" : "#F8FAFC" }}
            >
              {cols.map((c) => {
                let val = row[c.key];
                if (c.fmt) val = c.fmt(val);
                else val = safe(val);
                const isAvg = ["avg", "obp", "slg"].includes(c.key);
                return (
                  <td
                    key={c.key}
                    style={{
                      padding: "8px 12px",
                      textAlign: c.right ? "right" : "left",
                      borderBottom: "1px solid #F1F5F9",
                      fontFamily: c.right
                        ? "'IBM Plex Mono', monospace"
                        : "inherit",
                      fontSize: 13,
                      fontWeight: isAvg ? 700 : 400,
                      color: isAvg ? "#1D4ED8" : "#0F172A",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Pitching stats table ──────────────────────────────────────────────────

function PitchingTable({ stats }) {
  if (!stats || stats.length === 0) return null;

  const cols = [
    { key: "year", label: "Year", right: false },
    { key: "team_name", label: "Team", right: false },
    { key: "w", label: "W", right: true },
    { key: "l", label: "L", right: true },
    { key: "app", label: "APP", right: true },
    { key: "gs", label: "GS", right: true },
    { key: "sv", label: "SV", right: true },
    { key: "ip", label: "IP", right: true, fmt: fmtIp },
    { key: "h", label: "H", right: true },
    { key: "r", label: "R", right: true },
    { key: "er", label: "ER", right: true },
    { key: "bb", label: "BB", right: true },
    { key: "so", label: "SO", right: true },
    { key: "wp", label: "WP", right: true },
    { key: "hbp", label: "HBP", right: true },
    { key: "era", label: "ERA", right: true, fmt: fmtEra },
    { key: "b_avg", label: "BAA", right: true, fmt: fmtAvg },
  ];

  return (
    <div
      style={{
        overflowX: "auto",
        borderRadius: 8,
        border: "1px solid #E2E8F0",
      }}
    >
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
      >
        <thead>
          <tr style={{ background: "#F1F5F9" }}>
            {cols.map((c) => (
              <th
                key={c.key}
                style={{
                  padding: "9px 12px",
                  textAlign: c.right ? "right" : "left",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#64748B",
                  textTransform: "uppercase",
                  borderBottom: "2px solid #E2E8F0",
                  whiteSpace: "nowrap",
                }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stats.map((row, i) => (
            <tr
              key={`${row.year}-${row.team_name}-${i}`}
              style={{ background: i % 2 === 0 ? "#FFFFFF" : "#F8FAFC" }}
            >
              {cols.map((c) => {
                let val = row[c.key];
                if (c.fmt) val = c.fmt(val);
                else val = safe(val);
                const isKey = ["era", "b_avg"].includes(c.key);
                return (
                  <td
                    key={c.key}
                    style={{
                      padding: "8px 12px",
                      textAlign: c.right ? "right" : "left",
                      borderBottom: "1px solid #F1F5F9",
                      fontFamily: c.right
                        ? "'IBM Plex Mono', monospace"
                        : "inherit",
                      fontSize: 13,
                      fontWeight: isKey ? 700 : 400,
                      color: isKey ? "#1D4ED8" : "#0F172A",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────

export default function PlayerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!id) {
      setErr("No player ID provided.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErr("");
    setData(null);

    API.get(`/players/${id}`)
      .then((response) => {
        // axios puts the response body in response.data
        const payload = response.data;

        if (!payload) {
          setErr("Empty response from server.");
          return;
        }

        if (!payload.player) {
          setErr(`Unexpected response format for player ${id}.`);
          return;
        }

        setData(payload);
      })
      .catch((error) => {
        const status = error?.response?.status;
        const message =
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Unknown error";

        if (status === 404) {
          setErr("Player not found.");
        } else {
          setErr(
            `Failed to load player (${status || "network error"}): ${message}`,
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Container className="py-12">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Skeleton className="h-40" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </Container>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (err) {
    return (
      <div style={{ minHeight: "100vh", background: "#F8FAFC" }}>
        <Container className="py-12">
          <button onClick={() => navigate(-1)} style={backBtnStyle}>
            <ArrowLeft size={16} style={{ marginRight: 4 }} /> Back to Player
            Stats
          </button>
          <ErrorBox message={err} />
        </Container>
      </div>
    );
  }

  if (!data) return null;

  const { player, batting, pitching, teams } = data;
  const hasBatting = Array.isArray(batting?.stats) && batting.stats.length > 0;
  const hasPitching =
    Array.isArray(pitching?.stats) && pitching.stats.length > 0;
  const cb = batting?.career || null;
  const cp = pitching?.career || null;

  const allYears = [
    ...new Set([
      ...(batting?.stats || []).map((s) => s.year),
      ...(pitching?.stats || []).map((s) => s.year),
    ]),
  ].sort((a, b) => a - b);

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC" }}>
      {/* ── Hero header ─────────────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)",
          borderBottom: "4px solid #1D4ED8",
        }}
      >
        <Container>
          {/* Back button */}
          <div style={{ paddingTop: 20, paddingBottom: 4 }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 6,
                color: "#94A3B8",
                fontSize: 12,
                fontWeight: 600,
                padding: "5px 12px",
                cursor: "pointer",
                letterSpacing: "0.04em",
              }}
            >
              <ArrowLeft size={14} /> Back
            </button>
          </div>

          {/* Player identity */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 24,
              padding: "24px 0 32px",
              flexWrap: "wrap",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                fontWeight: 900,
                color: "#FFFFFF",
                flexShrink: 0,
                border: "3px solid rgba(255,255,255,0.15)",
              }}
            >
              {(
                player.firstName?.[0] ||
                player.fullName?.[0] ||
                "?"
              ).toUpperCase()}
            </div>

            {/* Name + badges */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  color: "#60A5FA",
                  fontWeight: 700,
                  marginBottom: 6,
                  textTransform: "uppercase",
                }}
              >
                NBC World Series
              </div>
              <h1
                style={{
                  fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                  fontWeight: 900,
                  color: "#F8FAFC",
                  margin: "0 0 10px",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                {player.fullName}
              </h1>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {player.isHallOfFame && (
                  <span style={badge("#F59E0B")}>
                    <Star size={11} /> Hall of Fame
                  </span>
                )}
                {hasBatting && hasPitching && (
                  <span style={badge("#8B5CF6")}>
                    <Award size={11} /> Two-Way Player
                  </span>
                )}
                {hasBatting && !hasPitching && (
                  <span style={badge("#10B981")}>Position Player</span>
                )}
                {hasPitching && !hasBatting && (
                  <span style={badge("#EF4444")}>Pitcher</span>
                )}
                {allYears.length > 0 && (
                  <span style={badge("#64748B")}>
                    {allYears.length === 1
                      ? `${allYears[0]}`
                      : `${allYears[0]}–${allYears[allYears.length - 1]}`}
                  </span>
                )}
              </div>
            </div>

            {/* Career stat pills */}
            {cb && Number(cb.total_ab) > 0 && (
              <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {[
                  { label: "AVG", value: fmtAvg(cb.career_avg) },
                  { label: "HR", value: safe(cb.total_hr, "0") },
                  { label: "RBI", value: safe(cb.total_rbi, "0") },
                  { label: "Seasons", value: safe(cb.seasons, "0") },
                ].map(({ label, value }) => (
                  <div key={label} style={statPill}>
                    <div style={statPillValue}>{value}</div>
                    <div style={statPillLabel}>{label}</div>
                  </div>
                ))}
              </div>
            )}

            {cp && Number(cp.total_app) > 0 && (
              <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {[
                  { label: "ERA", value: fmtEra(cp.career_era) },
                  {
                    label: "W-L",
                    value: `${safe(cp.total_w, 0)}-${safe(cp.total_l, 0)}`,
                  },
                  { label: "SO", value: safe(cp.total_so, "0") },
                  { label: "Seasons", value: safe(cp.seasons, "0") },
                ].map(({ label, value }) => (
                  <div key={label} style={statPill}>
                    <div style={statPillValue}>{value}</div>
                    <div style={statPillLabel}>{label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </div>

      {/* ── Body ────────────────────────────────────────────────────── */}
      <Container>
        <div style={{ paddingTop: 32, paddingBottom: 64 }}>
          {/* NBC Appearances */}
          {Array.isArray(teams) && teams.length > 0 && (
            <div style={card}>
              <SectionHeader title="NBC Appearances" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: 10,
                }}
              >
                {teams.map((t, i) => {
                  const years = [
                    ...(t.batting_years || []),
                    ...(t.pitching_years || []),
                  ];
                  const uniq = [...new Set(years)].sort((a, b) => a - b);
                  return (
                    <div
                      key={i}
                      style={{
                        padding: "14px 16px",
                        background: "#F1F5F9",
                        borderRadius: 8,
                        border: "1px solid #E2E8F0",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 13,
                          color: "#0F172A",
                          marginBottom: 4,
                        }}
                      >
                        {t.name}
                      </div>
                      {(t.city || t.state) && (
                        <div
                          style={{
                            fontSize: 11,
                            color: "#64748B",
                            marginBottom: 4,
                          }}
                        >
                          {[t.city, t.state].filter(Boolean).join(", ")}
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: 11,
                          color: "#1D4ED8",
                          fontWeight: 600,
                          fontFamily: "'IBM Plex Mono', monospace",
                        }}
                      >
                        {uniq.length > 0 ? uniq.join(", ") : "—"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Career Batting */}
          {cb && Number(cb.total_ab) > 0 && (
            <div style={card}>
              <SectionHeader title="Career Batting Summary" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
                  gap: 8,
                  marginBottom: 24,
                }}
              >
                <StatBox label="AVG" value={fmtAvg(cb.career_avg)} highlight />
                <StatBox label="OBP" value={fmtAvg(cb.career_obp)} />
                <StatBox label="SLG" value={fmtAvg(cb.career_slg)} />
                <StatBox label="G" value={safe(cb.total_gp, "0")} />
                <StatBox label="AB" value={safe(cb.total_ab, "0")} />
                <StatBox label="H" value={safe(cb.total_h, "0")} />
                <StatBox label="2B" value={safe(cb.total_2b, "0")} />
                <StatBox label="3B" value={safe(cb.total_3b, "0")} />
                <StatBox label="HR" value={safe(cb.total_hr, "0")} />
                <StatBox label="RBI" value={safe(cb.total_rbi, "0")} />
                <StatBox label="R" value={safe(cb.total_r, "0")} />
                <StatBox label="BB" value={safe(cb.total_bb, "0")} />
                <StatBox label="SO" value={safe(cb.total_so, "0")} />
                <StatBox label="SB" value={safe(cb.total_sb, "0")} />
                <StatBox label="Seasons" value={safe(cb.seasons, "0")} />
              </div>
              <SectionHeader title="Year-by-Year Batting" />
              <BattingTable stats={batting.stats} />
            </div>
          )}

          {/* Career Pitching */}
          {cp && Number(cp.total_app) > 0 && (
            <div style={card}>
              <SectionHeader title="Career Pitching Summary" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
                  gap: 8,
                  marginBottom: 24,
                }}
              >
                <StatBox label="ERA" value={fmtEra(cp.career_era)} highlight />
                <StatBox label="W" value={safe(cp.total_w, "0")} />
                <StatBox label="L" value={safe(cp.total_l, "0")} />
                <StatBox label="APP" value={safe(cp.total_app, "0")} />
                <StatBox label="GS" value={safe(cp.total_gs, "0")} />
                <StatBox label="SV" value={safe(cp.total_sv, "0")} />
                <StatBox label="IP" value={fmtIp(cp.total_ip)} />
                <StatBox label="SO" value={safe(cp.total_so, "0")} />
                <StatBox label="BB" value={safe(cp.total_bb, "0")} />
                <StatBox label="H" value={safe(cp.total_h, "0")} />
                <StatBox label="ER" value={safe(cp.total_er, "0")} />
                <StatBox label="CG" value={safe(cp.total_cg, "0")} />
                <StatBox label="SHO" value={safe(cp.total_sho, "0")} />
                <StatBox label="Seasons" value={safe(cp.seasons, "0")} />
              </div>
              <SectionHeader title="Year-by-Year Pitching" />
              <PitchingTable stats={pitching.stats} />
            </div>
          )}

          {/* No stats fallback */}
          {!hasBatting && !hasPitching && (
            <div style={{ ...card, textAlign: "center", padding: 48 }}>
              <Trophy
                size={40}
                style={{ color: "#CBD5E1", marginBottom: 12 }}
              />
              <p style={{ color: "#64748B", fontSize: 14 }}>
                No statistics on record for this player.
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

// ── Style constants ───────────────────────────────────────────────────────

const card = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 12,
  padding: "24px",
  marginBottom: 20,
  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
};

const backBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  background: "transparent",
  border: "1px solid #E2E8F0",
  borderRadius: 6,
  color: "#64748B",
  fontSize: 12,
  fontWeight: 600,
  padding: "5px 12px",
  cursor: "pointer",
  marginBottom: 16,
};

const statPill = {
  textAlign: "center",
  padding: "10px 16px",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 8,
  minWidth: 70,
};

const statPillValue = {
  fontSize: 20,
  fontWeight: 800,
  color: "#F8FAFC",
  fontFamily: "'IBM Plex Mono', monospace",
  lineHeight: 1,
  marginBottom: 3,
};

const statPillLabel = {
  fontSize: 9,
  fontWeight: 700,
  color: "#94A3B8",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

function badge(color) {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    background: color + "22",
    border: `1px solid ${color}55`,
    color: color,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.06em",
    padding: "3px 10px",
    borderRadius: 20,
  };
}
