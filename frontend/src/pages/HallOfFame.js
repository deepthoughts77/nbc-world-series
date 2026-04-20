// frontend/src/pages/HallOfFame.js
import React, { useMemo, useState } from "react";
import {
  Trophy,
  Users,
  Star,
  Search,
  Award,
  ChevronUp,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { useHallOfFame } from "../hooks/useHallOfFame";
import { Container } from "../components/common/Container";
import { BannerError } from "../components/common/BannerError";
import { Skeleton } from "../components/common/Skeleton";

const CATEGORY_META = {
  Player: { color: "#1D4ED8", bg: "#EFF6FF", label: "PLAYER" },
  Coach: { color: "#065F46", bg: "#ECFDF5", label: "COACH" },
  Contributor: { color: "#6B21A8", bg: "#F5F3FF", label: "CONTRIB." },
};

function getCatMeta(cat) {
  return CATEGORY_META[cat] || CATEGORY_META.Contributor;
}

function SortIcon({ active, dir }) {
  if (!active) return <span style={{ opacity: 0.3, fontSize: 11 }}>↕</span>;
  return dir === "asc" ? (
    <ChevronUp size={13} style={{ color: "#B45309" }} />
  ) : (
    <ChevronDown size={13} style={{ color: "#B45309" }} />
  );
}

function getBioLinkLabel(url) {
  if (!url) return null;
  if (url.includes("baseball-reference.com")) return "baseball-reference.com";
  return "baseball-reference.com";
}

function MicroBadge({ color, bg, border, children }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: "0.05em",
        padding: "2px 5px",
        borderRadius: 3,
        color,
        background: bg,
        border: border || `1px solid ${color}33`,
        marginLeft: 5,
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

export default function HallOfFame() {
  const { members, loading, err } = useHallOfFame();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState("year");
  const [sortDir, setSortDir] = useState("desc");

  function handleSort(col) {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir(col === "year" ? "desc" : "asc");
    }
  }

  const stats = useMemo(() => {
    const byCategory = { Player: 0, Coach: 0, Contributor: 0 };
    members.forEach((m) => {
      const c = m.category || "Contributor";
      byCategory[c] = (byCategory[c] || 0) + 1;
    });
    return { total: members.length, byCategory };
  }, [members]);

  const rows = useMemo(() => {
    let out = [...members];
    if (categoryFilter !== "all") {
      out = out.filter((m) => (m.category || "Contributor") === categoryFilter);
    }
    if (search.trim()) {
      const t = search.toLowerCase();
      out = out.filter(
        (m) =>
          (m.inductee_name || m.name || "").toLowerCase().includes(t) ||
          (m.nbc_teams || "").toLowerCase().includes(t) ||
          (m.nbc_awards || "").toLowerCase().includes(t) ||
          (m.mlb_teams || "").toLowerCase().includes(t),
      );
    }
    out.sort((a, b) => {
      const nameA = (a.inductee_name || a.name || "").toLowerCase();
      const nameB = (b.inductee_name || b.name || "").toLowerCase();
      const yearA = a.induction_year || 0;
      const yearB = b.induction_year || 0;
      const catA = (a.category || "Contributor").toLowerCase();
      const catB = (b.category || "Contributor").toLowerCase();
      let cmp = 0;
      if (sortCol === "name") cmp = nameA.localeCompare(nameB);
      else if (sortCol === "year") cmp = yearA - yearB;
      else if (sortCol === "cat") cmp = catA.localeCompare(catB);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return out;
  }, [members, categoryFilter, search, sortCol, sortDir]);

  const bioCount = rows.filter((m) => m.bio_url).length;

  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <Container>
          <div style={s.eyebrow}>NBC WORLD SERIES · LEGACY</div>
          <h1 style={s.h1}>Hall of Fame</h1>
          <p style={s.subtitle}>
            Honoring the legends who shaped the NBC World Series through
            exceptional performance, leadership, and dedication.
          </p>
        </Container>
      </div>

      <Container>
        <div style={s.body}>
          {/* ── Stat rail ─────────────────────────────────────────────── */}
          <div style={s.statRail}>
            {[
              {
                label: "Total Inductees",
                value: stats.total,
                icon: <Star size={22} color="#D97706" />,
                accent: "#D97706",
              },
              {
                label: "Players",
                value: stats.byCategory.Player,
                icon: <Users size={22} color="#1D4ED8" />,
                accent: "#1D4ED8",
              },
              {
                label: "Coaches",
                value: stats.byCategory.Coach,
                icon: <Award size={22} color="#065F46" />,
                accent: "#065F46",
              },
              {
                label: "Contributors",
                value: stats.byCategory.Contributor,
                icon: <Trophy size={22} color="#6B21A8" />,
                accent: "#6B21A8",
              },
            ].map(({ label, value, icon, accent }) => (
              <div key={label} style={s.statCell}>
                <div
                  style={{
                    ...s.statIconWrap,
                    borderColor: accent + "33",
                    background: accent + "0D",
                  }}
                >
                  {icon}
                </div>
                <div style={{ ...s.statValue, color: accent }}>{value}</div>
                <div style={s.statLabel}>{label}</div>
              </div>
            ))}
          </div>

          {/* ── Toolbar ───────────────────────────────────────────────── */}
          <div style={s.toolbar}>
            <div style={s.searchWrap}>
              <Search size={15} style={s.searchIcon} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, NBC team, award, or MLB team…"
                style={s.searchInput}
              />
            </div>
            <div style={s.pillGroup}>
              {[
                { val: "all", label: "All" },
                { val: "Player", label: "Players" },
                { val: "Coach", label: "Coaches" },
                { val: "Contributor", label: "Contributors" },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  onClick={() => setCategoryFilter(val)}
                  style={{
                    ...s.pill,
                    ...(categoryFilter === val ? s.pillActive : {}),
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <div style={s.toolbarRight}>
              {(search || categoryFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setCategoryFilter("all");
                  }}
                  style={s.clearBtn}
                >
                  Clear
                </button>
              )}
              <span style={s.resultCount}>
                {rows.length} of {stats.total}
              </span>
            </div>
          </div>

          {err && (
            <div style={{ marginBottom: 16 }}>
              <BannerError message={err} />
            </div>
          )}

          {/* ── Table ─────────────────────────────────────────────────── */}
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr style={s.theadRow}>
                  <th
                    style={{ ...s.th, textAlign: "left", cursor: "pointer" }}
                    onClick={() => handleSort("name")}
                  >
                    <span style={s.thInner}>
                      Inductee{" "}
                      <SortIcon active={sortCol === "name"} dir={sortDir} />
                    </span>
                  </th>
                  <th
                    style={{
                      ...s.th,
                      textAlign: "left",
                      cursor: "pointer",
                      width: 140,
                    }}
                    onClick={() => handleSort("cat")}
                  >
                    <span style={s.thInner}>
                      Role <SortIcon active={sortCol === "cat"} dir={sortDir} />
                    </span>
                  </th>
                  <th
                    style={{
                      ...s.th,
                      textAlign: "right",
                      cursor: "pointer",
                      width: 100,
                    }}
                    onClick={() => handleSort("year")}
                  >
                    <span style={{ ...s.thInner, justifyContent: "flex-end" }}>
                      Inducted{" "}
                      <SortIcon active={sortCol === "year"} dir={sortDir} />
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  [...Array(10)].map((_, i) => (
                    <tr key={i} style={i % 2 === 0 ? s.trEven : s.trOdd}>
                      <td colSpan={3} style={s.td}>
                        <Skeleton className="h-4 w-full" />
                      </td>
                    </tr>
                  ))
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={s.emptyCell}>
                      <Search
                        size={32}
                        style={{ color: "#9CA3AF", marginBottom: 10 }}
                      />
                      <div style={{ color: "#6B7280", marginBottom: 12 }}>
                        No inductees match
                        {search ? ` "${search}"` : " this filter"}
                      </div>
                      <button
                        onClick={() => {
                          setSearch("");
                          setCategoryFilter("all");
                        }}
                        style={s.emptyBtn}
                      >
                        Clear Filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  rows.map((m, i) => {
                    const name = m.inductee_name || m.name || "Unknown";
                    const year = m.induction_year || "—";
                    const cat = m.category || "Contributor";
                    const meta = getCatMeta(cat);
                    const isEven = i % 2 === 0;
                    const hasBio = !!m.bio_url;
                    const bioLabel = getBioLinkLabel(m.bio_url);
                    const roleLabel = m.primary_role
                      ? m.primary_role.split(",")[0].trim()
                      : meta.label;

                    return (
                      <tr
                        key={m.id ?? `${name}-${i}`}
                        style={{
                          ...(isEven ? s.trEven : s.trOdd),
                          cursor: hasBio ? "pointer" : "default",
                        }}
                        onClick={
                          hasBio
                            ? () =>
                                window.open(
                                  m.bio_url,
                                  "_blank",
                                  "noopener,noreferrer",
                                )
                            : undefined
                        }
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#FEF3C7")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = isEven
                            ? s.trEven.background
                            : s.trOdd.background)
                        }
                      >
                        {/* ── Name cell ─────────────────────────── */}
                        <td style={{ ...s.td, verticalAlign: "top" }}>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 4,
                            }}
                          >
                            {/* Name + badges row */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                flexWrap: "wrap",
                              }}
                            >
                              <Star
                                size={11}
                                style={{
                                  color: "#D97706",
                                  marginRight: 7,
                                  flexShrink: 0,
                                }}
                              />
                              <span style={hasBio ? s.nameLink : s.namePlain}>
                                {name}
                              </span>
                              {m.deceased && (
                                <MicroBadge color="#6B7280" bg="#F3F4F6">
                                  †
                                </MicroBadge>
                              )}
                              {m.cooperstown && (
                                <MicroBadge color="#92400E" bg="#FEF3C7">
                                  ⭐ COOP HOF
                                </MicroBadge>
                              )}
                              {m.mlb_teams && (
                                <MicroBadge color="#065F46" bg="#ECFDF5">
                                  MLB
                                </MicroBadge>
                              )}
                              {hasBio && (
                                <>
                                  <ExternalLink
                                    size={10}
                                    style={{
                                      color: "#D97706",
                                      marginLeft: 6,
                                      flexShrink: 0,
                                    }}
                                  />
                                  <span style={s.bioHint}>{bioLabel}</span>
                                </>
                              )}
                            </div>

                            {/* NBC teams */}
                            {m.nbc_teams && (
                              <div style={s.subLine}>
                                <span style={s.subLabel}>NBC Teams: </span>
                                <span style={{ color: "#374151" }}>
                                  {m.nbc_teams}
                                </span>
                              </div>
                            )}

                            {/* Awards */}
                            {m.nbc_awards && (
                              <div style={s.subLine}>
                                <span
                                  style={{ ...s.subLabel, color: "#92400E" }}
                                >
                                  Awards:{" "}
                                </span>
                                <span style={{ color: "#B45309" }}>
                                  {m.nbc_awards}
                                </span>
                              </div>
                            )}

                            {/* MLB teams */}
                            {m.mlb_teams && (
                              <div style={s.subLine}>
                                <span
                                  style={{ ...s.subLabel, color: "#064E3B" }}
                                >
                                  MLB:{" "}
                                </span>
                                <span style={{ color: "#065F46" }}>
                                  {m.mlb_teams}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* ── Role cell ─────────────────────────── */}
                        <td
                          style={{
                            ...s.td,
                            verticalAlign: "top",
                            paddingTop: 13,
                          }}
                        >
                          <span
                            style={{
                              ...s.badge,
                              background: meta.bg,
                              color: meta.color,
                              border: `1px solid ${meta.color}33`,
                            }}
                          >
                            {roleLabel.toUpperCase()}
                          </span>
                        </td>

                        {/* ── Year cell ─────────────────────────── */}
                        <td
                          style={{
                            ...s.td,
                            ...s.tdYear,
                            verticalAlign: "top",
                            paddingTop: 13,
                          }}
                        >
                          {year}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {!loading && rows.length > 0 && (
            <div style={s.footNote}>
              NBC Hall of Fame · {stats.total} inductees · 1991–present
              {bioCount > 0 && (
                <span style={{ color: "#D97706", marginLeft: 8 }}>
                  · {bioCount} with bios
                </span>
              )}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "#F9FAFB",
    fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif",
    color: "#111827",
  },
  pageHeader: {
    background: "#1F2937",
    borderBottom: "4px solid #D97706",
    paddingTop: 48,
    paddingBottom: 36,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: "0.2em",
    color: "#D97706",
    fontWeight: 700,
    marginBottom: 10,
    fontFamily: "'IBM Plex Mono', monospace",
  },
  h1: {
    fontSize: "clamp(2rem, 5vw, 3rem)",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    margin: "0 0 12px",
    color: "#F9FAFB",
    lineHeight: 1.1,
  },
  subtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    maxWidth: 520,
    lineHeight: 1.7,
    margin: 0,
  },
  body: { paddingTop: 32, paddingBottom: 64 },
  statRail: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
    marginBottom: 24,
  },
  statCell: {
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    padding: "20px 16px",
    textAlign: "center",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  statIconWrap: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    border: "1px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 10px",
  },
  statValue: {
    fontSize: 34,
    fontWeight: 900,
    lineHeight: 1,
    letterSpacing: "-0.02em",
    marginBottom: 4,
  },
  statLabel: { fontSize: 12, color: "#6B7280", fontWeight: 600 },
  toolbar: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
    padding: "12px 16px",
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  searchWrap: { position: "relative", flex: "1 1 200px", minWidth: 180 },
  searchIcon: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#9CA3AF",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    background: "#F9FAFB",
    border: "1px solid #D1D5DB",
    borderRadius: 6,
    color: "#111827",
    fontSize: 13,
    fontFamily: "inherit",
    padding: "8px 10px 8px 34px",
    outline: "none",
    boxSizing: "border-box",
  },
  pillGroup: { display: "flex", gap: 6, flexWrap: "wrap" },
  pill: {
    background: "#F3F4F6",
    border: "1px solid #E5E7EB",
    borderRadius: 6,
    color: "#374151",
    fontSize: 12,
    fontFamily: "inherit",
    fontWeight: 600,
    padding: "6px 14px",
    cursor: "pointer",
  },
  pillActive: {
    background: "#1F2937",
    border: "1px solid #1F2937",
    color: "#FFFFFF",
  },
  toolbarRight: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  clearBtn: {
    background: "transparent",
    border: "1px solid #D1D5DB",
    borderRadius: 6,
    color: "#6B7280",
    fontSize: 12,
    fontFamily: "inherit",
    fontWeight: 600,
    padding: "6px 12px",
    cursor: "pointer",
  },
  resultCount: { fontSize: 12, color: "#9CA3AF", whiteSpace: "nowrap" },
  tableWrap: {
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 13,
    background: "#FFFFFF",
  },
  theadRow: { background: "#1F2937" },
  th: {
    padding: "12px 16px",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "#9CA3AF",
    borderBottom: "3px solid #D97706",
    userSelect: "none",
    textTransform: "uppercase",
  },
  thInner: { display: "inline-flex", alignItems: "center", gap: 4 },
  trEven: { background: "#FFFFFF", transition: "background 0.1s" },
  trOdd: { background: "#F9FAFB", transition: "background 0.1s" },
  td: {
    padding: "11px 16px",
    borderBottom: "1px solid #F3F4F6",
    verticalAlign: "middle",
  },
  tdYear: {
    textAlign: "right",
    fontVariantNumeric: "tabular-nums",
    fontWeight: 700,
    color: "#D97706",
    fontFamily: "'IBM Plex Mono', monospace",
    letterSpacing: "0.03em",
  },
  badge: {
    display: "inline-block",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.08em",
    padding: "3px 8px",
    borderRadius: 4,
  },
  namePlain: { fontWeight: 600, color: "#111827" },
  nameLink: { color: "#1D4ED8", fontWeight: 600 },
  bioHint: {
    fontSize: 10,
    color: "#D97706",
    marginLeft: 4,
    fontWeight: 600,
    letterSpacing: "0.04em",
  },
  subLine: { fontSize: 11, color: "#6B7280", lineHeight: 1.5, paddingLeft: 18 },
  subLabel: { fontWeight: 700, color: "#9CA3AF", marginRight: 2 },
  emptyCell: {
    padding: "48px 16px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  emptyBtn: {
    background: "#1F2937",
    border: "none",
    borderRadius: 6,
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "inherit",
    fontWeight: 600,
    padding: "8px 16px",
    cursor: "pointer",
  },
  footNote: {
    marginTop: 16,
    fontSize: 11,
    color: "#9CA3AF",
    letterSpacing: "0.06em",
    textAlign: "right",
  },
};
