// frontend/src/pages/DocumentSearch.js
import React, { useState, useCallback } from "react";
import { Search, FileText, ExternalLink, Calendar } from "lucide-react";
import { API } from "../api/apiClient";
import { Container } from "../components/common/Container";
import { BannerError } from "../components/common/BannerError";

export default function DocumentSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(
    async (e) => {
      e.preventDefault();
      if (!query.trim() || query.trim().length < 2) return;
      setLoading(true);
      setError("");
      setResults(null);
      try {
        const { data } = await API.get("/documents/search", {
          params: { q: query.trim(), limit: 25 },
        });
        setResults(data.data || []);
        setSearched(true);
      } catch {
        setError("Search failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [query],
  );

  return (
    <div style={s.page}>
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div style={s.header}>
        <Container>
          <div style={s.eyebrow}>NBC WORLD SERIES · ARCHIVES</div>
          <h1 style={s.h1}>Document Search</h1>
          <p style={s.subtitle}>
            Search the full text of all scanned NBC World Series documents —
            tournament programs, annuals, and historical records from the WSU
            Libraries Special Collections.
          </p>
        </Container>
      </div>

      <Container>
        <div style={s.body}>
          {/* ── Search Box ──────────────────────────────────────────── */}
          <form onSubmit={handleSearch} style={s.searchForm}>
            <div style={s.searchWrap}>
              <Search size={18} style={s.searchIcon} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a player name, team, or any keyword…"
                style={s.searchInput}
                disabled={loading}
                autoFocus
              />
              <button
                type="submit"
                disabled={loading || query.trim().length < 2}
                style={{
                  ...s.searchBtn,
                  ...(loading || query.trim().length < 2
                    ? s.searchBtnDisabled
                    : {}),
                }}
              >
                {loading ? "Searching…" : "Search"}
              </button>
            </div>
            <p style={s.hint}>
              Try names like "Satchel Paige", team names, or topics like
              "batting average" or "championship"
            </p>
          </form>

          {error && (
            <div style={{ marginBottom: 16 }}>
              <BannerError message={error} />
            </div>
          )}

          {/* ── Results ─────────────────────────────────────────────── */}
          {results !== null && (
            <div>
              <div style={s.resultsMeta}>
                {results.length === 0 ? (
                  <span>No documents found for "{query}"</span>
                ) : (
                  <span>
                    {results.length} document{results.length !== 1 ? "s" : ""}{" "}
                    found for <strong>"{query}"</strong>
                  </span>
                )}
              </div>

              {results.length === 0 && searched && (
                <div style={s.empty}>
                  <FileText
                    size={40}
                    style={{ color: "#9CA3AF", marginBottom: 12 }}
                  />
                  <div style={{ color: "#6B7280", marginBottom: 8 }}>
                    No documents matched your search
                  </div>
                  <div style={{ fontSize: 13, color: "#9CA3AF" }}>
                    Try different keywords, a player's last name only, or a year
                  </div>
                </div>
              )}

              <div style={s.resultsList}>
                {results.map((doc) => (
                  <ResultCard key={doc.id} doc={doc} query={query} />
                ))}
              </div>
            </div>
          )}

          {/* ── Info box (before first search) ──────────────────────── */}
          {results === null && !loading && (
            <div style={s.infoBox}>
              <FileText
                size={32}
                style={{ color: "#D97706", marginBottom: 12 }}
              />
              <h3 style={s.infoTitle}>Search the Historical Archive</h3>
              <p style={s.infoText}>
                This search box queries the full text of all scanned documents
                in the NBC World Series archive — including Official Baseball
                Annuals dating back to 1935, tournament programs, and historical
                records held by WSU Libraries Special Collections. Results show
                the exact pages where your search term was found.
              </p>
              <div style={s.infoStats}>
                <div style={s.infoStat}>
                  <div style={s.infoStatNum}>9</div>
                  <div style={s.infoStatLabel}>Documents</div>
                </div>
                <div style={s.infoStat}>
                  <div style={s.infoStatNum}>750+</div>
                  <div style={s.infoStatLabel}>Pages Indexed</div>
                </div>
                <div style={s.infoStat}>
                  <div style={s.infoStatNum}>WSU</div>
                  <div style={s.infoStatLabel}>Special Collections</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

// ── Result card with page number links ───────────────────────────────────
function ResultCard({ doc, query }) {
  const pages = doc.matching_pages || [];

  // Build a direct PDF page URL
  function pageUrl(pageNum) {
    const base = doc.file_url || "";
    return `${base}#page=${pageNum}`;
  }

  return (
    <div style={s.resultCard}>
      <div style={s.resultTop}>
        <div style={s.resultMeta}>
          <span style={s.yearBadge}>{doc.display_year || doc.year}</span>
          <span style={s.typeBadge}>{formatDocType(doc.doc_type)}</span>
          {doc.page_count && (
            <span style={s.typeBadge}>{doc.page_count} pages total</span>
          )}
        </div>
        <a
          href={doc.file_url}
          target="_blank"
          rel="noopener noreferrer"
          style={s.openLink}
        >
          Open PDF <ExternalLink size={13} style={{ marginLeft: 4 }} />
        </a>
      </div>

      <h3 style={s.resultTitle}>{doc.title}</h3>

      {doc.source_name && (
        <div style={s.sourceLine}>
          <Calendar size={12} style={{ marginRight: 4, flexShrink: 0 }} />
          {doc.source_name}
        </div>
      )}

      {/* Snippet */}
      {doc.snippet && (
        <div
          style={s.snippet}
          dangerouslySetInnerHTML={{
            __html: doc.snippet
              .replace(
                /<b>/g,
                '<mark style="background:#FEF9C3;padding:0 2px;border-radius:2px">',
              )
              .replace(/<\/b>/g, "</mark>"),
          }}
        />
      )}

      {/* Page number links */}
      {pages.length > 0 && (
        <div style={s.pagesWrap}>
          <span style={s.pagesLabel}>
            Found on {pages.length === 1 ? "page" : "pages"}:
          </span>
          <div style={s.pagesList}>
            {pages.map((pageNum) => (
              <a
                key={pageNum}
                href={pageUrl(pageNum)}
                target="_blank"
                rel="noopener noreferrer"
                style={s.pageLink}
                title={`Open PDF at page ${pageNum}`}
              >
                p.{pageNum}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function formatDocType(type) {
  const map = {
    tournament_program: "Tournament Program",
    annual: "Annual",
    other: "Historical Document",
    stats: "Statistics",
  };
  return map[type] || type || "Document";
}

// ── Styles ────────────────────────────────────────────────────────────────
const s = {
  page: {
    minHeight: "100vh",
    background: "#F9FAFB",
    fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif",
    color: "#111827",
  },
  header: {
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
    maxWidth: 560,
    lineHeight: 1.7,
    margin: 0,
  },
  body: { paddingTop: 32, paddingBottom: 64 },
  searchForm: { marginBottom: 32 },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#FFFFFF",
    border: "2px solid #E5E7EB",
    borderRadius: 10,
    padding: "6px 6px 6px 16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  searchIcon: { color: "#9CA3AF", flexShrink: 0 },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 15,
    fontFamily: "inherit",
    color: "#111827",
    background: "transparent",
    padding: "8px 0",
  },
  searchBtn: {
    background: "#1F2937",
    color: "#FFFFFF",
    border: "none",
    borderRadius: 7,
    padding: "10px 24px",
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "inherit",
    cursor: "pointer",
    flexShrink: 0,
  },
  searchBtnDisabled: { background: "#9CA3AF", cursor: "not-allowed" },
  hint: { fontSize: 12, color: "#9CA3AF", marginTop: 8, marginLeft: 2 },
  resultsMeta: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: "1px solid #E5E7EB",
  },
  resultsList: { display: "flex", flexDirection: "column", gap: 16 },
  resultCard: {
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: 10,
    padding: "20px 24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  resultTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  resultMeta: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    flexWrap: "wrap",
  },
  yearBadge: {
    fontSize: 11,
    fontWeight: 700,
    color: "#D97706",
    background: "#FEF3C7",
    border: "1px solid #FDE68A",
    borderRadius: 4,
    padding: "2px 8px",
    fontFamily: "'IBM Plex Mono', monospace",
  },
  typeBadge: {
    fontSize: 11,
    fontWeight: 600,
    color: "#4B5563",
    background: "#F3F4F6",
    border: "1px solid #E5E7EB",
    borderRadius: 4,
    padding: "2px 8px",
  },
  openLink: {
    display: "inline-flex",
    alignItems: "center",
    fontSize: 13,
    color: "#1D4ED8",
    fontWeight: 600,
    textDecoration: "none",
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#111827",
    margin: "0 0 6px",
  },
  sourceLine: {
    fontSize: 12,
    color: "#9CA3AF",
    display: "flex",
    alignItems: "center",
    marginBottom: 10,
  },
  snippet: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 1.7,
    background: "#F9FAFB",
    border: "1px solid #F3F4F6",
    borderRadius: 6,
    padding: "10px 14px",
    marginTop: 8,
    marginBottom: 12,
  },
  pagesWrap: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
    paddingTop: 12,
    borderTop: "1px solid #F3F4F6",
  },
  pagesLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#6B7280",
    whiteSpace: "nowrap",
  },
  pagesList: { display: "flex", flexWrap: "wrap", gap: 6 },
  pageLink: {
    display: "inline-block",
    fontSize: 11,
    fontWeight: 700,
    color: "#1D4ED8",
    background: "#EFF6FF",
    border: "1px solid #BFDBFE",
    borderRadius: 4,
    padding: "3px 8px",
    textDecoration: "none",
    fontFamily: "'IBM Plex Mono', monospace",
    transition: "background 0.15s",
  },
  empty: {
    textAlign: "center",
    padding: "60px 24px",
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  infoBox: {
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: 10,
    padding: "40px 32px",
    textAlign: "center",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#111827",
    margin: "0 0 12px",
  },
  infoText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 1.7,
    maxWidth: 520,
    margin: "0 0 28px",
  },
  infoStats: { display: "flex", gap: 40 },
  infoStat: { textAlign: "center" },
  infoStatNum: {
    fontSize: 28,
    fontWeight: 900,
    color: "#D97706",
    lineHeight: 1,
  },
  infoStatLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
    fontWeight: 600,
  },
};
