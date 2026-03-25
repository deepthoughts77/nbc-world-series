// frontend/src/pages/AdminDocuments.jsx
//
// Route: /admin/documents
// Admin page for managing NBC World Series document metadata.
// Supports creating new records and editing existing ones.
// PDFs are hosted externally — only metadata + URL is stored here.

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { API } from "../api";
import { Container } from "../components/common/Container";
import { Skeleton } from "../components/common/Skeleton";

const DOC_TYPES = [
  { value: "annual", label: "Baseball Annual" },
  { value: "program", label: "Tournament Program" },
  { value: "scorebook", label: "Scorebook" },
  { value: "record_book", label: "Statistical Record Book" },
  { value: "hof", label: "Hall of Fame Document" },
  { value: "photo_booklet", label: "Photo Booklet" },
  { value: "guide", label: "Guide" },
  { value: "other", label: "Other Historical Document" },
];

const EMPTY_FORM = {
  title: "",
  display_year: "",
  sort_year: "",
  doc_type: "annual",
  description: "",
  file_url: "",
  page_count: "",
  pages_with_stats: "",
  notes: "",
  source_name: "Wichita State University Libraries Special Collections",
  source_credit: "",
  is_public: true,
};

function DocumentForm({ initial, onSave, onCancel, saving, error }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Auto-fill sort_year from display_year if it's a plain number
  const handleDisplayYearBlur = () => {
    if (!form.sort_year && /^\d{4}$/.test(form.display_year)) {
      setForm((prev) => ({ ...prev, sort_year: form.display_year }));
    }
  };

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 12,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* Title + URL — most important fields */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. 1955 Official Baseball Annual"
            style={inputStyle}
            required
          />
        </div>
        <div>
          <label style={labelStyle}>PDF URL *</label>
          <input
            name="file_url"
            value={form.file_url}
            onChange={handleChange}
            placeholder="https://libasimages.wichita.edu/NBC/1955.pdf"
            style={inputStyle}
            required
          />
        </div>
      </div>

      {/* Year + type */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}
      >
        <div>
          <label style={labelStyle}>Display Year</label>
          <input
            name="display_year"
            value={form.display_year}
            onChange={handleChange}
            onBlur={handleDisplayYearBlur}
            placeholder="e.g. 1974-75 or 1955"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Sort Year (numeric)</label>
          <input
            name="sort_year"
            value={form.sort_year}
            onChange={handleChange}
            placeholder="e.g. 1975"
            type="number"
            min="1935"
            max="2099"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Document Type</label>
          <select
            name="doc_type"
            value={form.doc_type}
            onChange={handleChange}
            style={inputStyle}
          >
            {DOC_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label style={labelStyle}>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Brief description of document contents"
          rows={2}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      {/* Page info */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>Page Count</label>
          <input
            name="page_count"
            value={form.page_count}
            onChange={handleChange}
            type="number"
            min="1"
            placeholder="e.g. 48"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Pages with Stats</label>
          <input
            name="pages_with_stats"
            value={form.pages_with_stats}
            onChange={handleChange}
            placeholder="e.g. 33-41"
            style={inputStyle}
          />
        </div>
      </div>

      {/* Source */}
      <div>
        <label style={labelStyle}>Source / Institution</label>
        <input
          name="source_name"
          value={form.source_name}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      {/* Notes */}
      <div>
        <label style={labelStyle}>Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Any additional archival notes"
          rows={2}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      {/* Public toggle */}
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 13,
          fontWeight: 600,
          color: "#374151",
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          name="is_public"
          checked={form.is_public}
          onChange={handleChange}
          style={{ width: 16, height: 16 }}
        />
        Visible to public
      </label>

      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: 6,
            padding: "10px 14px",
            color: "#DC2626",
            fontSize: 13,
          }}
        >
          <AlertCircle size={15} /> {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button
          onClick={onCancel}
          style={{
            ...btnBase,
            background: "#F1F5F9",
            color: "#374151",
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(form)}
          disabled={saving}
          style={{
            ...btnBase,
            background: saving ? "#94A3B8" : "#1D4ED8",
            color: "#FFFFFF",
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          <CheckCircle size={15} />
          {saving ? "Saving…" : "Save Document"}
        </button>
      </div>
    </div>
  );
}

export default function AdminDocuments() {
  const navigate = useNavigate();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editDoc, setEditDoc] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState("");

  const loadDocs = () => {
    setLoading(true);
    API.get("/documents?limit=500&public_only=false")
      .then((r) => setDocs(r.data?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(loadDocs, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleSave = async (form) => {
    setSaving(true);
    setFormError("");
    try {
      if (editDoc) {
        await API.put(`/documents/${editDoc.id}`, form);
        showToast("Document updated.");
      } else {
        await API.post("/documents", form);
        showToast("Document created.");
      }
      setShowForm(false);
      setEditDoc(null);
      loadDocs();
    } catch (err) {
      setFormError(err?.response?.data?.error || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (doc) => {
    if (!window.confirm(`Delete "${doc.title}"?`)) return;
    try {
      await API.delete(`/documents/${doc.id}`);
      showToast("Document deleted.");
      loadDocs();
    } catch {
      alert("Delete failed.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC" }}>
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 9999,
            background: "#059669",
            color: "#FFFFFF",
            borderRadius: 8,
            padding: "10px 18px",
            fontSize: 13,
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          ✓ {toast}
        </div>
      )}

      <Container>
        <div style={{ paddingTop: 32, paddingBottom: 64 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#0F172A",
                  margin: 0,
                }}
              >
                Manage Documents
              </h1>
              <p style={{ fontSize: 13, color: "#64748B", margin: "4px 0 0" }}>
                {docs.length} documents in archive
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => navigate("/archives")}
                style={{ ...btnBase, background: "#F1F5F9", color: "#374151" }}
              >
                <ExternalLink size={14} /> View Archive
              </button>
              <button
                onClick={() => {
                  setEditDoc(null);
                  setShowForm(true);
                  setFormError("");
                }}
                style={{ ...btnBase, background: "#1D4ED8", color: "#FFFFFF" }}
              >
                <Plus size={14} /> Add Document
              </button>
            </div>
          </div>

          {/* Form */}
          {showForm && (
            <div style={{ marginBottom: 24 }}>
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#0F172A",
                  marginBottom: 12,
                }}
              >
                {editDoc ? `Edit: ${editDoc.title}` : "New Document"}
              </h2>
              <DocumentForm
                initial={editDoc || undefined}
                onSave={handleSave}
                onCancel={() => {
                  setShowForm(false);
                  setEditDoc(null);
                }}
                saving={saving}
                error={formError}
              />
            </div>
          )}

          {/* Document list */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : (
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 13,
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#F8FAFC",
                      borderBottom: "2px solid #E2E8F0",
                    }}
                  >
                    {["Year", "Title", "Type", "URL", "Public", "Actions"].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            padding: "10px 14px",
                            textAlign: "left",
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            color: "#64748B",
                            textTransform: "uppercase",
                          }}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {docs.map((doc, i) => (
                    <tr
                      key={doc.id}
                      style={{
                        background: i % 2 === 0 ? "#FFFFFF" : "#F8FAFC",
                        borderBottom: "1px solid #F1F5F9",
                      }}
                    >
                      <td
                        style={{
                          padding: "10px 14px",
                          fontWeight: 700,
                          color: "#1D4ED8",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {doc.display_year || doc.sort_year || "—"}
                      </td>
                      <td
                        style={{
                          padding: "10px 14px",
                          fontWeight: 600,
                          color: "#0F172A",
                        }}
                      >
                        {doc.title}
                      </td>
                      <td
                        style={{
                          padding: "10px 14px",
                          color: "#64748B",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {doc.doc_type}
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#2563EB",
                            fontSize: 11,
                            textDecoration: "none",
                          }}
                        >
                          {doc.file_url?.replace("https://", "").slice(0, 40)}…
                        </a>
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 10,
                            background: doc.is_public ? "#DCFCE7" : "#FEE2E2",
                            color: doc.is_public ? "#166534" : "#991B1B",
                          }}
                        >
                          {doc.is_public ? "Public" : "Hidden"}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            onClick={() => {
                              setEditDoc(doc);
                              setShowForm(true);
                              setFormError("");
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              padding: "5px 10px",
                              background: "#F1F5F9",
                              border: "1px solid #E2E8F0",
                              borderRadius: 5,
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: "pointer",
                              color: "#374151",
                            }}
                          >
                            <Edit2 size={12} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(doc)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              padding: "5px 10px",
                              background: "#FEF2F2",
                              border: "1px solid #FECACA",
                              borderRadius: 5,
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: "pointer",
                              color: "#DC2626",
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

// ── Style helpers ─────────────────────────────────────────────────────────
const labelStyle = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  color: "#374151",
  marginBottom: 5,
  letterSpacing: "0.04em",
};

const inputStyle = {
  width: "100%",
  background: "#F8FAFC",
  border: "1px solid #E2E8F0",
  borderRadius: 6,
  fontSize: 13,
  padding: "8px 11px",
  color: "#0F172A",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const btnBase = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  border: "none",
  borderRadius: 7,
  fontWeight: 700,
  fontFamily: "inherit",
  cursor: "pointer",
  padding: "8px 16px",
  fontSize: 13,
};
