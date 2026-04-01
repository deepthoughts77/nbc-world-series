// frontend/src/pages/SearchResults.js
//
// Route: /search?q=...
// Runs both unified entity search AND natural language search simultaneously.
// Shows a natural language answer card + full results table above grouped entity results.

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  Search,
  User,
  Users,
  Trophy,
  FileText,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { API } from "../api";
import { Container } from "../components/common/Container";

// ── Group config ──────────────────────────────────────────────────────────
const GROUPS = {
  players: {
    label: "Players",
    icon: User,
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  teams: {
    label: "Teams",
    icon: Users,
    color: "#059669",
    bg: "#ECFDF5",
  },
  championships: {
    label: "Championships",
    icon: Trophy,
    color: "#D97706",
    bg: "#FEF3C7",
  },
  documents: {
    label: "Documents",
    icon: FileText,
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
};

// ── Highlight matching text ───────────────────────────────────────────────
function Highlight({ text, query }) {
  if (!text || !query) return <span>{text}</span>;
  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi",
  );
  const parts = String(text).split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            style={{ background: "#FEF08A", borderRadius: 2, padding: "0 1px" }}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
}

// ── Result item ───────────────────────────────────────────────────────────
function ResultItem({ item, type, query }) {
  const group = GROUPS[type];
  const Icon = group.icon;

  let href = "#";
  let primary = item.name;
  let secondary = null;
  let meta = null;

  if (type === "players") {
    href = `/players/${item.id}`;
    secondary = item.subtitle ? `Most recent team: ${item.subtitle}` : null;
    meta = item.year ? `Last played: ${item.year}` : null;
  } else if (type === "teams") {
    href = `/teams/${item.id}`;
    secondary = item.subtitle || null;
    meta =
      item.champ_count > 0
        ? `${item.champ_count} championship${item.champ_count !== 1 ? "s" : ""}`
        : null;
  } else if (type === "championships") {
    href = `/championships/${item.name}`;
    primary = `${item.name} Championship`;
    secondary = item.champion_name ? `Champion: ${item.champion_name}` : null;
    meta = item.mvp_name ? `MVP: ${item.mvp_name}` : null;
  } else if (type === "documents") {
    href = item.file_url || "#";
    secondary = item.subtitle || null;
    meta = item.year ? `${item.year}` : null;
  }

  const isExternal = type === "documents";

  const content = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        borderBottom: "1px solid #F1F5F9",
        transition: "background 0.15s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: group.bg,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={16} color={group.color} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#0F172A",
            marginBottom: 2,
          }}
        >
          <Highlight text={primary} query={query} />
        </div>
        {secondary && (
          <div style={{ fontSize: 12, color: "#64748B" }}>
            <Highlight text={secondary} query={query} />
          </div>
        )}
      </div>

      <div
        style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}
      >
        {meta && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: group.color,
              background: group.bg,
              borderRadius: 20,
              padding: "2px 8px",
            }}
          >
            {meta}
          </span>
        )}
        <ChevronRight size={14} color="#CBD5E1" />
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", display: "block" }}
      >
        {content}
      </a>
    );
  }

  return (
    <Link to={href} style={{ textDecoration: "none", display: "block" }}>
      {content}
    </Link>
  );
}

// ── Group section ─────────────────────────────────────────────────────────
function ResultGroup({ type, items, query }) {
  const group = GROUPS[type];
  const Icon = group.icon;

  if (!items || items.length === 0) return null;

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 16px",
          background: group.bg,
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        <Icon size={14} color={group.color} />
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: group.color,
          }}
        >
          {group.label}
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 11,
            fontWeight: 600,
            color: "#94A3B8",
          }}
        >
          {items.length} result{items.length !== 1 ? "s" : ""}
        </span>
      </div>

      {items.map((item, i) => (
        <ResultItem
          key={`${type}-${item.id || i}`}
          item={item}
          type={type}
          query={query}
        />
      ))}
    </div>
  );
}

// ── NL Results table ──────────────────────────────────────────────────────
function NLResultsTable({ data }) {
  if (!data || data.length === 0) return null;

  const HIDDEN_KEYS = ["id", "player_id", "team_id"];
  const keys = Object.keys(data[0]).filter((k) => !HIDDEN_KEYS.includes(k));

  const formatVal = (v) => {
    if (v === null || v === undefined) return "—";
    if (Array.isArray(v))
      return v.slice(0, 5).join(", ") + (v.length > 5 ? "…" : "");
    if (typeof v === "number" && !Number.isInteger(v))
      return parseFloat(v).toFixed(3).replace(/^0\./, ".");
    return String(v);
  };

  const formatKey = (k) =>
    k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          padding: "10px 16px",
          background: "#F8FAFC",
          borderBottom: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#64748B",
          }}
        >
          Full Results
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#94A3B8",
            marginLeft: "auto",
          }}
        >
          {data.length} record{data.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr
              style={{
                background: "#F8FAFC",
                borderBottom: "2px solid #E2E8F0",
              }}
            >
              <th
                style={{
                  padding: "8px 12px",
                  textAlign: "left",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#94A3B8",
                  whiteSpace: "nowrap",
                }}
              >
                #
              </th>
              {keys.map((k) => (
                <th
                  key={k}
                  style={{
                    padding: "8px 12px",
                    textAlign: "left",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#94A3B8",
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatKey(k)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                style={{
                  background: i % 2 === 0 ? "#FFFFFF" : "#F8FAFC",
                  borderBottom: "1px solid #F1F5F9",
                }}
              >
                <td
                  style={{
                    padding: "8px 12px",
                    color: "#94A3B8",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {i + 1}
                </td>
                {keys.map((k) => (
                  <td
                    key={k}
                    style={{
                      padding: "8px 12px",
                      color: "#374151",
                      whiteSpace: "nowrap",
                      fontWeight:
                        k === "player_name" || k === "team_name" ? 600 : 400,
                    }}
                  >
                    {formatVal(row[k])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const q = searchParams.get("q") || "";

  const [inputVal, setInputVal] = useState(q);
  const [results, setResults] = useState(null);
  const [nlAnswer, setNlAnswer] = useState(null);
  const [nlResults, setNlResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const doSearch = useCallback(async (query) => {
    if (!query || query.length < 2) return;
    setLoading(true);
    setError("");
    setNlAnswer(null);
    setNlResults(null);
    try {
      const [entityRes, nlRes] = await Promise.all([
        API.get(`/search?q=${encodeURIComponent(query)}`),
        API.post("/search/ask", { query }).catch(() => null),
      ]);

      setResults(entityRes.data);

      const nlAnswerText = nlRes?.data?.answer || "";
      const isMeaningfulAnswer =
        nlRes?.data?.success &&
        nlAnswerText.length > 10 &&
        !nlAnswerText.includes("No results found") &&
        !nlAnswerText.includes("Try asking about") &&
        !nlAnswerText.includes("couldn't find a specific answer") &&
        !nlAnswerText.includes("No results found for");

      if (isMeaningfulAnswer) {
        setNlAnswer(nlRes.data.answer);
        if (
          Array.isArray(nlRes.data.results) &&
          nlRes.data.results.length > 0
        ) {
          setNlResults(nlRes.data.results);
        }
      }
    } catch (err) {
      setError("Search failed. Please try again.");
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (q) {
      setInputVal(q);
      doSearch(q);
    }
  }, [q, doSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim().length < 2) return;
    setSearchParams({ q: inputVal.trim() });
  };

  const total = results
    ? Object.values(results.results || {}).reduce(
        (s, arr) => s + (arr?.length || 0),
        0,
      )
    : 0;

  const hasAnything = total > 0 || !!nlAnswer;

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC" }}>
      {/* ── Search header ─────────────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)",
          borderBottom: "4px solid #1D4ED8",
          paddingTop: 40,
          paddingBottom: 32,
        }}
      >
        <Container>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              color: "#60A5FA",
              fontWeight: 700,
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            NBC World Series · Search
          </div>
          <h1
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              fontWeight: 900,
              color: "#F8FAFC",
              margin: "0 0 20px",
              lineHeight: 1.1,
            }}
          >
            Search the Archive
          </h1>

          <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
            <div style={{ position: "relative", display: "flex", gap: 10 }}>
              <div style={{ position: "relative", flex: 1 }}>
                <Search
                  size={18}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94A3B8",
                    pointerEvents: "none",
                  }}
                />
                <input
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Search players, teams, championships… or ask a question"
                  autoFocus
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 500,
                    padding: "12px 16px 12px 44px",
                    color: "#F8FAFC",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3B82F6")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.2)")
                  }
                />
              </div>
              <button
                type="submit"
                style={{
                  background: "#1D4ED8",
                  border: "none",
                  borderRadius: 8,
                  color: "#FFFFFF",
                  fontSize: 14,
                  fontWeight: 700,
                  padding: "12px 20px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Search
              </button>
            </div>
          </form>
        </Container>
      </div>

      <Container>
        <div style={{ paddingTop: 28, paddingBottom: 64 }}>
          {/* Loading */}
          {loading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                justifyContent: "center",
                padding: "48px 0",
                color: "#64748B",
                fontSize: 14,
              }}
            >
              <Loader2
                size={20}
                style={{ animation: "spin 1s linear infinite" }}
              />
              Searching…
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: 8,
                padding: "12px 16px",
                color: "#DC2626",
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              <AlertCircle size={15} /> {error}
            </div>
          )}

          {/* Results summary */}
          {(results || nlAnswer) && !loading && (
            <div
              style={{
                fontSize: 13,
                color: "#64748B",
                marginBottom: 20,
                fontWeight: 500,
              }}
            >
              {!hasAnything
                ? `No results found for "${q}"`
                : total > 0
                  ? `${total} result${total !== 1 ? "s" : ""} for "${q}"`
                  : `Answer found for "${q}"`}
            </div>
          )}

          {/* ── Natural language answer card ────────────────────────── */}
          {nlAnswer && !loading && (
            <div
              style={{
                background: "linear-gradient(135deg, #EFF6FF, #F0FDF4)",
                border: "1px solid #BFDBFE",
                borderLeft: "4px solid #1D4ED8",
                borderRadius: 10,
                padding: "16px 20px",
                marginBottom: 16,
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#1D4ED8",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                ✦
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#1D4ED8",
                    marginBottom: 8,
                  }}
                >
                  Answer
                </div>
                <div
                  style={{ fontSize: 14, color: "#0F172A", lineHeight: 1.8 }}
                  dangerouslySetInnerHTML={{
                    __html: nlAnswer.replace(
                      /\*\*(.+?)\*\*/g,
                      "<strong>$1</strong>",
                    ),
                  }}
                />
              </div>
            </div>
          )}

          {/* ── NL full results table ────────────────────────────────── */}
          {nlResults && !loading && <NLResultsTable data={nlResults} />}

          {/* ── Grouped entity results ───────────────────────────────── */}
          {results && total > 0 && !loading && (
            <div>
              {nlAnswer && (
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#94A3B8",
                    margin: "20px 0 12px",
                  }}
                >
                  Also Found
                </div>
              )}
              {["players", "teams", "championships", "documents"].map(
                (type) => (
                  <ResultGroup
                    key={type}
                    type={type}
                    items={results.results[type]}
                    query={q}
                  />
                ),
              )}
            </div>
          )}

          {/* ── No results at all ────────────────────────────────────── */}
          {results && !hasAnything && !loading && (
            <div
              style={{
                textAlign: "center",
                padding: "48px 24px",
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: 10,
              }}
            >
              <Search
                size={36}
                style={{ color: "#CBD5E1", marginBottom: 12 }}
              />
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#374151",
                  margin: "0 0 8px",
                }}
              >
                No results for "{q}"
              </h3>
              <p style={{ fontSize: 13, color: "#94A3B8", margin: "0 0 20px" }}>
                Try a player name, team name, year, or a question like{" "}
                <em>"Who won in 2024?"</em>
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  justifyContent: "center",
                }}
              >
                {[
                  "Jake Gutierrez",
                  "Hutchinson Monarchs",
                  "2024",
                  "Most MVPs",
                  "Who won in 2023?",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setInputVal(s);
                      setSearchParams({ q: s });
                    }}
                    style={{
                      background: "#F1F5F9",
                      border: "1px solid #E2E8F0",
                      borderRadius: 20,
                      padding: "6px 14px",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#374151",
                      cursor: "pointer",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Empty state — no query yet ───────────────────────────── */}
          {!q && !loading && !results && (
            <div
              style={{
                textAlign: "center",
                padding: "64px 24px",
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: 10,
              }}
            >
              <Search
                size={40}
                style={{ color: "#CBD5E1", marginBottom: 16 }}
              />
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#374151",
                  margin: "0 0 8px",
                }}
              >
                Search the NBC World Series archive
              </h3>
              <p style={{ fontSize: 13, color: "#94A3B8", margin: "0 0 6px" }}>
                Find players, teams, championships, and historical documents.
              </p>
              <p style={{ fontSize: 12, color: "#CBD5E1", margin: "0 0 20px" }}>
                You can also ask questions like{" "}
                <em>"Who has the most MVPs?"</em> or <em>"Who won in 2018?"</em>
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  justifyContent: "center",
                }}
              >
                {[
                  "Jake Gutierrez",
                  "Hutchinson Monarchs",
                  "Who won in 2024?",
                  "Most MVPs",
                  "1967 Annual",
                  "Best ERA 2025",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setInputVal(s);
                      setSearchParams({ q: s });
                    }}
                    style={{
                      background: "#F1F5F9",
                      border: "1px solid #E2E8F0",
                      borderRadius: 20,
                      padding: "6px 14px",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#374151",
                      cursor: "pointer",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
