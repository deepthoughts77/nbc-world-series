// frontend/src/pages/Archives.jsx
//
// Route: /archives
// Displays NBC World Series historical PDF documents with
// search, year filter, type filter, and inline PDF preview.

import React, { useState, useEffect, useMemo } from "react";
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
} from "lucide-react";
import { API } from "../api";
import { Container } from "../components/common/Container";
import { Skeleton } from "../components/common/Skeleton";

// ── Backend origin helper ────────────────────────────────────────────────
const API_ORIGIN = process.env.REACT_APP_API_ORIGIN || "http://localhost:5000";

function getDocumentUrl(fileUrl) {
  if (!fileUrl) return "#";
  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
    return fileUrl;
  }
  return `${API_ORIGIN}${fileUrl}`;
}

// ── Doc type config ───────────────────────────────────────────────────────
const DOC_TYPES = {
  program: {
    label: "Tournament Program",
    icon: Trophy,
    color: "#D97706",
    bg: "#FEF3C7",
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
  hof: {
    label: "Hall of Fame",
    icon: BookOpen,
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
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

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.15s",
      }}
    >
      {/* Card header */}
      <div
        style={{
          background: meta.bg,
          borderBottom: `2px solid ${meta.color}33`,
          padding: "16px 18px",
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: meta.color + "22",
            border: `1px solid ${meta.color}44`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={20} color={meta.color} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: meta.color,
              textTransform: "uppercase",
              marginBottom: 3,
            }}
          >
            {meta.label}
            {doc.year && (
              <span style={{ marginLeft: 8, color: "#94A3B8" }}>
                · {doc.year}
              </span>
            )}
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#0F172A",
              lineHeight: 1.3,
              wordBreak: "break-word",
            }}
          >
            {doc.title}
          </div>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: "14px 18px" }}>
        {doc.description && (
          <p
            style={{
              fontSize: 13,
              color: "#64748B",
              lineHeight: 1.6,
              marginBottom: 10,
            }}
          >
            {doc.description}
          </p>
        )}

        {/* Meta pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 14,
          }}
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
              fontSize: 12,
              color: "#94A3B8",
              fontStyle: "italic",
              marginBottom: 12,
              lineHeight: 1.5,
            }}
          >
            {doc.notes}
          </p>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => onPreview(doc)}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "8px 12px",
              background: isPreviewOpen ? "#1D4ED8" : "#F1F5F9",
              border: `1px solid ${isPreviewOpen ? "#1D4ED8" : "#E2E8F0"}`,
              borderRadius: 6,
              color: isPreviewOpen ? "#FFFFFF" : "#374151",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {isPreviewOpen ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
            {isPreviewOpen ? "Close Preview" : "Preview"}
          </button>

          <a
            href={docUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "8px 12px",
              background: "transparent",
              border: "1px solid #E2E8F0",
              borderRadius: 6,
              color: "#374151",
              fontSize: 12,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <ExternalLink size={13} /> Open
          </a>

          <a
            href={docUrl}
            download
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "8px 12px",
              background: "transparent",
              border: "1px solid #E2E8F0",
              borderRadius: 6,
              color: "#374151",
              fontSize: 12,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <Download size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function Archives() {
  const [docs, setDocs] = useState([]);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [previewDoc, setPreviewDoc] = useState(null);

  // Load documents and years
  useEffect(() => {
    setLoading(true);
    Promise.all([API.get("/documents?limit=200"), API.get("/documents/years")])
      .then(([docsRes, yearsRes]) => {
        setDocs(docsRes.data?.data || []);
        setYears(yearsRes.data?.data || []);
      })
      .catch(() => setErr("Failed to load documents."))
      .finally(() => setLoading(false));
  }, []);

  // Filter docs
  const filtered = useMemo(() => {
    let out = [...docs];
    if (yearFilter) out = out.filter((d) => String(d.year) === yearFilter);
    if (typeFilter) out = out.filter((d) => d.doc_type === typeFilter);
    if (search.trim()) {
      const t = search.toLowerCase();
      out = out.filter(
        (d) =>
          (d.title || "").toLowerCase().includes(t) ||
          (d.description || "").toLowerCase().includes(t) ||
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
          borderBottom: "4px solid #D97706",
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
            NBC World Series · Historical Records
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
              maxWidth: 520,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Historical programs, scorebooks, statistical records, and other
            primary source documents from the NBC World Series.
          </p>
        </Container>
      </div>

      <Container>
        <div style={{ paddingTop: 32, paddingBottom: 64 }}>
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
            {/* Search */}
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
                placeholder="Search documents…"
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

            {/* Year filter */}
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            {/* Type filter */}
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

            {/* Clear */}
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
                  background: "#F1F5F9",
                  borderBottom: "1px solid #E2E8F0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}
                >
                  {previewDoc.title}{" "}
                  {previewDoc.year ? `(${previewDoc.year})` : ""}
                </span>
                <button
                  onClick={() => setPreviewDoc(null)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#64748B",
                    fontSize: 20,
                    cursor: "pointer",
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
              <iframe
                src={previewUrl}
                title={previewDoc.title}
                style={{
                  width: "100%",
                  height: 700,
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
              <p style={{ color: "#64748B", fontSize: 14, margin: 0 }}>
                {docs.length === 0
                  ? "No documents have been uploaded yet."
                  : "No documents match your filters."}
              </p>
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
