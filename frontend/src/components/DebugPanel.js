// src/components/DebugPanel.js
import React, { useEffect, useState } from "react";
import { API, pingHealth } from "../api";

export default function DebugPanel() {
  const [health, setHealth] = useState(null);
  const [champStatus, setChampStatus] = useState("idle");
  const [teamsStatus, setTeamsStatus] = useState("idle");
  const base = process.env.REACT_APP_API_URL;

  useEffect(() => {
    (async () => {
      try {
        const h = await pingHealth();
        setHealth(h);
      } catch (e) {
        setHealth({ ok: false, error: String(e) });
      }
    })();
  }, []);

  const testChampionships = async () => {
    setChampStatus("loading");
    try {
      const res = await API.get("/championships");
      setChampStatus(`ok (${res.data?.count ?? res.data?.length ?? 0} items)`);
    } catch (e) {
      setChampStatus(`error: ${e.response?.status || e.message}`);
    }
  };

  const testTeams = async () => {
    setTeamsStatus("loading");
    try {
      const res = await API.get("/teams");
      setTeamsStatus(
        `ok (${Array.isArray(res.data) ? res.data.length : 0} items)`
      );
    } catch (e) {
      setTeamsStatus(`error: ${e.response?.status || e.message}`);
    }
  };

  return (
    <div
      style={{
        background: "#fff7ed",
        border: "1px solid #fdba74",
        borderRadius: 8,
        padding: 12,
        margin: "16px 0",
      }}
    >
      <strong>Debug Panel</strong>
      <div style={{ fontSize: 12, marginTop: 6 }}>
        <div>
          REACT_APP_API_URL: <code>{base}</code>
        </div>
        <div>
          Health: <code>{health ? JSON.stringify(health) : "checking..."}</code>
        </div>
        <div style={{ marginTop: 8 }}>
          <button onClick={testChampionships} style={{ marginRight: 8 }}>
            Test /championships
          </button>
          <span>{champStatus}</span>
        </div>
        <div style={{ marginTop: 8 }}>
          <button onClick={testTeams} style={{ marginRight: 8 }}>
            Test /teams
          </button>
          <span>{teamsStatus}</span>
        </div>
        <div style={{ marginTop: 8, color: "#9a3412" }}>
          Open DevTools → Network to see the requests and any CORS errors.
        </div>
      </div>
    </div>
  );
}
