// frontend/src/pages/UploadDocument.jsx
//
// Simple admin upload form for adding PDFs to the archive.
// Route: /admin/upload-document
// Add this route to App.js:
//   <Route path="/admin/upload-document" element={<UploadDocument />} />

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { API } from "../api";
import { Container } from "../components/common/Container";

const DOC_TYPES = [
  { value: "program", label: "Tournament Program" },
  { value: "scorebook", label: "Scorebook" },
  { value: "record_book", label: "Statistical Record Book" },
  { value: "hof", label: "Hall of Fame Document" },
  { value: "other", label: "Other Historical Document" },
];

export default function UploadDocument() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    year: "",
    doc_type: "program",
    description: "",
    page_count: "",
    pages_with_stats: "",
    notes: "",
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF file.");
      return;
    }
    if (!form.title) {
      setError("Title is required.");
      return;
    }

    setUploading(true);
    setError("");
    setProgress("Uploading to Cloudinary…");

    const fd = new FormData();
    fd.append("file", file);
    Object.entries(form).forEach(([k, v]) => {
      if (v) fd.append(k, v);
    });

    try {
      await API.post("/documents/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / e.total);
          setProgress(`Uploading… ${pct}%`);
        },
      });
      setSuccess(true);
      setProgress("");
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Upload failed.");
      setProgress("");
    } finally {
      setUploading(false);
    }
  };

  if (success) {
    return (
      <Container className="py-12">
        <div
          style={{
            maxWidth: 480,
            margin: "0 auto",
            textAlign: "center",
            padding: 40,
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: 12,
          }}
        >
          <CheckCircle size={48} color="#059669" style={{ marginBottom: 16 }} />
          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#0F172A",
              marginBottom: 8,
            }}
          >
            Document Uploaded!
          </h2>
          <p style={{ color: "#64748B", marginBottom: 24 }}>
            "{form.title}" has been added to the archive.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button
              onClick={() => {
                setSuccess(false);
                setFile(null);
                setForm({
                  title: "",
                  year: "",
                  doc_type: "program",
                  description: "",
                  page_count: "",
                  pages_with_stats: "",
                  notes: "",
                });
              }}
              style={{ ...btnStyle, background: "#F1F5F9", color: "#374151" }}
            >
              Upload Another
            </button>
            <button
              onClick={() => navigate("/archives")}
              style={{ ...btnStyle, background: "#1D4ED8", color: "#FFFFFF" }}
            >
              View Archive
            </button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#0F172A",
            marginBottom: 6,
          }}
        >
          Upload Document
        </h1>
        <p style={{ color: "#64748B", fontSize: 14, marginBottom: 32 }}>
          Add a historical PDF to the NBC World Series archive.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: 12,
            padding: 28,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {/* File picker */}
          <div>
            <label style={labelStyle}>PDF File *</label>
            <div
              onClick={() => document.getElementById("pdf-input").click()}
              style={{
                border: `2px dashed ${file ? "#1D4ED8" : "#CBD5E1"}`,
                borderRadius: 8,
                padding: "24px 16px",
                textAlign: "center",
                cursor: "pointer",
                background: file ? "#EFF6FF" : "#F8FAFC",
              }}
            >
              <Upload
                size={24}
                color={file ? "#1D4ED8" : "#94A3B8"}
                style={{ margin: "0 auto 8px" }}
              />
              <div
                style={{
                  fontSize: 13,
                  color: file ? "#1D4ED8" : "#64748B",
                  fontWeight: 600,
                }}
              >
                {file ? file.name : "Click to select a PDF"}
              </div>
              {file && (
                <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>
                  {(file.size / (1024 * 1024)).toFixed(1)} MB
                </div>
              )}
            </div>
            <input
              id="pdf-input"
              type="file"
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0] || null)}
            />
          </div>

          {/* Title */}
          <div>
            <label style={labelStyle}>Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. 1955 NBC World Series Official Program"
              style={inputStyle}
              required
            />
          </div>

          {/* Year + Type */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label style={labelStyle}>Year</label>
              <input
                name="year"
                value={form.year}
                onChange={handleChange}
                placeholder="e.g. 1955"
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
              placeholder="Brief description of the document contents"
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          {/* Page count + stats pages */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label style={labelStyle}>Page Count</label>
              <input
                name="page_count"
                value={form.page_count}
                onChange={handleChange}
                placeholder="e.g. 48"
                type="number"
                min="1"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Pages with Stats</label>
              <input
                name="pages_with_stats"
                value={form.pages_with_stats}
                onChange={handleChange}
                placeholder="e.g. 12-18"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={labelStyle}>Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Any additional notes about this document"
              rows={2}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          {/* Error */}
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
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Progress */}
          {progress && (
            <div
              style={{
                fontSize: 13,
                color: "#1D4ED8",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              {progress}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={uploading}
            style={{
              ...btnStyle,
              background: uploading ? "#94A3B8" : "#1D4ED8",
              color: "#FFFFFF",
              fontSize: 14,
              padding: "12px 24px",
              cursor: uploading ? "not-allowed" : "pointer",
            }}
          >
            <Upload size={16} />
            {uploading ? "Uploading…" : "Upload Document"}
          </button>
        </form>
      </div>
    </Container>
  );
}

const labelStyle = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  color: "#374151",
  marginBottom: 6,
  letterSpacing: "0.04em",
};

const inputStyle = {
  width: "100%",
  background: "#F8FAFC",
  border: "1px solid #E2E8F0",
  borderRadius: 6,
  fontSize: 13,
  padding: "9px 12px",
  color: "#0F172A",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const btnStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  border: "none",
  borderRadius: 8,
  fontWeight: 700,
  fontFamily: "inherit",
  cursor: "pointer",
  padding: "10px 20px",
};
