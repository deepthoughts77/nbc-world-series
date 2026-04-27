// frontend/src/pages/Archives.jsx
//
// Route: /archives
// NBC World Series Document Archive — Digital access portal for
// Wichita State University Libraries Special Collections.

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Search,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Trophy,
  Clipboard,
  BarChart2,
  FolderOpen,
  FileSearch,
} from "lucide-react";
import { API } from "../api";
import { Container } from "../components/common/Container";
import { Skeleton } from "../components/common/Skeleton";

// ── Backend origin helper ─────────────────────────────────────────────────
const API_ORIGIN = process.env.REACT_APP_API_ORIGIN || "http://localhost:5000";

function getDocumentUrl(fileUrl) {
  if (!fileUrl) return "#";
  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://"))
    return fileUrl;
  return `${API_ORIGIN}${fileUrl}`;
}

// ── Doc type config ───────────────────────────────────────────────────────
const DOC_TYPES = {
  annual: {
    label: "Baseball Annual",
    icon: BookOpen,
    color: "#B45309",
    bg: "#FEF3C7",
  },
  program: {
    label: "Tournament Program",
    icon: Trophy,
    color: "#D97706",
    bg: "#FFFBEB",
  },
  scorebook: {
    label: "Scorebook",
    icon: Clipboard,
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  record_book: {
    label: "Statistical Record",
    icon: BarChart2,
    color: "#059669",
    bg: "#ECFDF5",
  },
  hof: { label: "Hall of Fame", icon: Trophy, color: "#7C3AED", bg: "#F5F3FF" },
  photo_booklet: {
    label: "Photo Booklet",
    icon: FileText,
    color: "#0891B2",
    bg: "#ECFEFF",
  },
  guide: { label: "Guide", icon: BookOpen, color: "#65A30D", bg: "#F7FEE7" },
  other: {
    label: "Historical Document",
    icon: FileText,
    color: "#64748B",
    bg: "#F1F5F9",
  },
};

function getTypeMeta(type) {
  return DOC_TYPES[type] || DOC_TYPES.other;
}

function formatBytes(bytes) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Document card ─────────────────────────────────────────────────────────
function DocCard({ doc, onPreview, isPreviewOpen }) {
  const meta = getTypeMeta(doc.doc_type);
  const Icon = meta.icon;
  const docUrl = getDocumentUrl(doc.file_url);
  const displayYear = doc.display_year || doc.sort_year || doc.year || "";

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderTop: `3px solid ${meta.color}`,
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Card header */}
      <div style={{ padding: "16px 18px 12px", flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: meta.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={16} color={meta.color} />
          </div>
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: meta.color,
                textTransform: "uppercase",
              }}
            >
              {meta.label}
            </div>
            {displayYear && (
              <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600 }}>
                {displayYear}
              </div>
            )}
          </div>
        </div>

        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#0F172A",
            lineHeight: 1.4,
            margin: "0 0 8px",
          }}
        >
          {doc.title}
        </h3>

        {doc.description && (
          <p
            style={{
              fontSize: 12,
              color: "#64748B",
              lineHeight: 1.6,
              margin: "0 0 10px",
            }}
          >
            {doc.description}
          </p>
        )}

        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}
        >
          {doc.page_count && <span style={pill}>{doc.page_count} pages</span>}
          {doc.pages_with_stats && (
            <span style={pill}>Stats: pp. {doc.pages_with_stats}</span>
          )}
          {doc.file_size_bytes && (
            <span style={pill}>{formatBytes(doc.file_size_bytes)}</span>
          )}
        </div>

        {doc.notes && (
          <p
            style={{
              fontSize: 11,
              color: "#94A3B8",
              fontStyle: "italic",
              margin: "0 0 8px",
              lineHeight: 1.5,
            }}
          >
            {doc.notes}
          </p>
        )}

        {doc.source_name && (
          <div
            style={{
              fontSize: 10,
              color: "#B0BEC5",
              letterSpacing: "0.03em",
              marginBottom: 4,
            }}
          >
            📚 {doc.source_name}
          </div>
        )}
      </div>

      {/* Actions */}
      <div
        style={{
          padding: "10px 18px 14px",
          borderTop: "1px solid #F1F5F9",
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => onPreview(doc)}
          style={{
            flex: 1,
            minWidth: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "7px 10px",
            background: isPreviewOpen ? "#1D4ED8" : "#F1F5F9",
            border: `1px solid ${isPreviewOpen ? "#1D4ED8" : "#E2E8F0"}`,
            borderRadius: 6,
            color: isPreviewOpen ? "#FFFFFF" : "#374151",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {isPreviewOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          {isPreviewOpen ? "Close" : "Preview"}
        </button>

        <a
          href={docUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Open PDF in new tab"
          style={iconBtn}
        >
          <ExternalLink size={13} />
        </a>

        <a href={docUrl} download title="Download PDF" style={iconBtn}>
          <Download size={13} />
        </a>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function Archives() {
  const navigate = useNavigate();
  const [docs, setDocs] = useState([]);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [previewDoc, setPreviewDoc] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([API.get("/documents?limit=500"), API.get("/documents/years")])
      .then(([docsRes, yearsRes]) => {
        setDocs(docsRes.data?.data || []);
        setYears(yearsRes.data?.data || []);
      })
      .catch(() => setErr("Failed to load documents."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let out = [...docs];
    if (yearFilter)
      out = out.filter((d) => String(d.sort_year || d.year) === yearFilter);
    if (typeFilter) out = out.filter((d) => d.doc_type === typeFilter);
    if (search.trim()) {
      const t = search.toLowerCase();
      out = out.filter(
        (d) =>
          (d.title || "").toLowerCase().includes(t) ||
          (d.description || "").toLowerCase().includes(t) ||
          (d.display_year || "").toLowerCase().includes(t) ||
          (d.notes || "").toLowerCase().includes(t),
      );
    }
    return out;
  }, [docs, yearFilter, typeFilter, search]);

  const handlePreview = (doc) => {
    setPreviewDoc((prev) => (prev?.id === doc.id ? null : doc));
  };

  const previewUrl = previewDoc ? getDocumentUrl(previewDoc.file_url) : "";

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC" }}>
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
          borderBottom: "4px solid #B45309",
          paddingTop: 48,
          paddingBottom: 36,
        }}
      >
        <Container>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              color: "#D97706",
              fontWeight: 700,
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            NBC World Series · Wichita State University Libraries Special
            Collections
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 900,
              color: "#F8FAFC",
              margin: "0 0 12px",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Document Archive
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#94A3B8",
              maxWidth: 600,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Historical programs, scorebooks, statistical records, and official
            baseball annuals from the NBC World Series, digitized and preserved
            by Wichita State University Libraries Special Collections.
          </p>
        </Container>
      </div>

      <Container>
        <div style={{ paddingTop: 32, paddingBottom: 64 }}>
          {/* ── Doc Search callout banner ────────────────────────────── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              padding: "18px 24px",
              background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
              border: "1px solid #334155",
              borderLeft: "4px solid #D97706",
              borderRadius: 10,
              marginBottom: 24,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  background: "rgba(217,119,6,0.15)",
                  border: "1px solid rgba(217,119,6,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <FileSearch size={22} color="#D97706" />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#F8FAFC",
                    marginBottom: 3,
                  }}
                >
                  Search Inside the Documents
                </div>
                <div
                  style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.5 }}
                >
                  Looking for a player name, team, or topic? Search the full
                  text of all scanned documents, not just their titles.
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/document-search")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                background: "#D97706",
                border: "none",
                borderRadius: 7,
                color: "#FFFFFF",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              <Search size={14} />
              Search Document Contents
            </button>
          </div>

          {/* ── Stats bar ──────────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 24,
              flexWrap: "wrap",
            }}
          >
            {Object.entries(DOC_TYPES).map(([type, meta]) => {
              const count = docs.filter((d) => d.doc_type === type).length;
              if (!count) return null;
              const Icon = meta.icon;
              return (
                <div
                  key={type}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 14px",
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  <Icon size={14} color={meta.color} />
                  {count} {meta.label}
                  {count !== 1 ? "s" : ""}
                </div>
              );
            })}
          </div>

          {/* ── Toolbar ────────────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 20,
              padding: "12px 16px",
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: 8,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ position: "relative", flex: "1 1 220px" }}>
              <Search
                size={14}
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9CA3AF",
                  pointerEvents: "none",
                }}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search documents by title or description…"
                style={{
                  width: "100%",
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: 6,
                  fontSize: 13,
                  padding: "8px 10px 8px 32px",
                  outline: "none",
                  boxSizing: "border-box",
                  color: "#0F172A",
                }}
              />
            </div>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="">All Years</option>
              {years.map((y) => (
                <option key={y.year} value={y.year}>
                  {y.display_year || y.year}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="">All Types</option>
              {Object.entries(DOC_TYPES).map(([type, meta]) => (
                <option key={type} value={type}>
                  {meta.label}
                </option>
              ))}
            </select>

            {(search || yearFilter || typeFilter) && (
              <button
                onClick={() => {
                  setSearch("");
                  setYearFilter("");
                  setTypeFilter("");
                }}
                style={{
                  background: "transparent",
                  border: "1px solid #E2E8F0",
                  borderRadius: 6,
                  color: "#64748B",
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "8px 14px",
                  cursor: "pointer",
                }}
              >
                Clear
              </button>
            )}

            <span
              style={{
                marginLeft: "auto",
                fontSize: 12,
                color: "#94A3B8",
                alignSelf: "center",
                whiteSpace: "nowrap",
              }}
            >
              {filtered.length} of {docs.length} documents
            </span>
          </div>

          {err && (
            <div
              style={{
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: 8,
                padding: "12px 16px",
                color: "#DC2626",
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              {err}
            </div>
          )}

          {/* ── PDF Preview panel ───────────────────────────────────── */}
          {previewDoc && (
            <div
              style={{
                marginBottom: 24,
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: 10,
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  padding: "12px 18px",
                  background: "#1E293B",
                  borderBottom: "1px solid #334155",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <span
                    style={{ fontSize: 13, fontWeight: 700, color: "#F8FAFC" }}
                  >
                    {previewDoc.title}{" "}
                    {previewDoc.display_year || previewDoc.year
                      ? `(${previewDoc.display_year || previewDoc.year})`
                      : ""}
                  </span>
                  {previewDoc.source_name && (
                    <span
                      style={{ fontSize: 11, color: "#64748B", marginLeft: 10 }}
                    >
                      {previewDoc.source_name}
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "5px 10px",
                      background: "#334155",
                      borderRadius: 5,
                      color: "#CBD5E1",
                      fontSize: 11,
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    <ExternalLink size={12} /> Open in new tab
                  </a>
                  <button
                    onClick={() => setPreviewDoc(null)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#64748B",
                      fontSize: 20,
                      cursor: "pointer",
                      lineHeight: 1,
                      padding: "0 4px",
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
              <iframe
                src={previewUrl}
                title={previewDoc.title}
                style={{
                  width: "100%",
                  height: 750,
                  border: "none",
                  display: "block",
                }}
              />
            </div>
          )}

          {/* ── Document grid ───────────────────────────────────────── */}
          {loading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 16,
              }}
            >
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-56" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "64px 24px",
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: 10,
              }}
            >
              <FolderOpen
                size={40}
                style={{ color: "#CBD5E1", marginBottom: 12 }}
              />
              <p style={{ color: "#64748B", fontSize: 14, margin: "0 0 6px" }}>
                {docs.length === 0
                  ? "No documents in the archive yet."
                  : "No documents match your filters."}
              </p>
              {docs.length === 0 && (
                <p style={{ color: "#94A3B8", fontSize: 12, margin: 0 }}>
                  Documents from Wichita State University Libraries Special
                  Collections will appear here.
                </p>
              )}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 16,
              }}
            >
              {filtered.map((doc) => (
                <DocCard
                  key={doc.id}
                  doc={doc}
                  onPreview={handlePreview}
                  isPreviewOpen={previewDoc?.id === doc.id}
                />
              ))}
            </div>
          )}

          {/* ── Attribution footer ───────────────────────────────────── */}
          {!loading && docs.length > 0 && (
            <div
              style={{
                marginTop: 40,
                paddingTop: 20,
                borderTop: "1px solid #E2E8F0",
                textAlign: "center",
                fontSize: 12,
                color: "#94A3B8",
                lineHeight: 1.7,
              }}
            >
              Documents digitized and hosted by{" "}
              <strong style={{ color: "#64748B" }}>
                Wichita State University Libraries Special Collections
              </strong>
              <br />
              NBC World Series records, 1935–present
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

// ── Style helpers ─────────────────────────────────────────────────────────
const pill = {
  display: "inline-block",
  background: "#F1F5F9",
  border: "1px solid #E2E8F0",
  borderRadius: 4,
  fontSize: 11,
  fontWeight: 600,
  color: "#64748B",
  padding: "2px 8px",
};

const iconBtn = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 32,
  height: 32,
  background: "#F8FAFC",
  border: "1px solid #E2E8F0",
  borderRadius: 6,
  color: "#374151",
  textDecoration: "none",
  flexShrink: 0,
};

const selectStyle = {
  background: "#F8FAFC",
  border: "1px solid #E2E8F0",
  borderRadius: 6,
  fontSize: 13,
  padding: "8px 12px",
  color: "#0F172A",
  outline: "none",
  cursor: "pointer",
};
