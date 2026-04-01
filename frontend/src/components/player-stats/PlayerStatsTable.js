// frontend/src/components/player-stats/PlayerStatsTable.js
import React, { useState, useMemo, useCallback } from "react";

// ── Batting glossary — shown as tooltip on column header hover ────────────
const BATTING_GLOSSARY = {
  player: "Player Name",
  jersey: "Jersey Number",
  pos: "Position",
  g: "Games Played",
  ab: "At Bats",
  r: "Runs Scored",
  h: "Hits",
  doubles: "Doubles (2B)",
  triples: "Triples (3B)",
  hr: "Home Runs",
  rbi: "Runs Batted In",
  bb: "Walks (Base on Balls)",
  so: "Strikeouts",
  sb: "Stolen Bases",
  avg: "Batting Average — Hits divided by At Bats",
  obp: "On-Base Percentage — How often a batter reaches base",
  slg: "Slugging Percentage — Total bases divided by At Bats",
};

export function PlayerStatsTable({ players, onPlayerClick }) {
  const [sortField, setSortField] = useState("avg");
  const [sortDir, setSortDir] = useState("desc");

  const numericSortFields = useMemo(
    () => [
      "jersey",
      "g",
      "ab",
      "r",
      "h",
      "doubles",
      "triples",
      "hr",
      "rbi",
      "bb",
      "so",
      "sb",
      "avg",
      "obp",
      "slg",
    ],
    [],
  );

  const isNumericField = useCallback(
    (field) => numericSortFields.includes(field),
    [numericSortFields],
  );

  const getSortValue = (p, field) => {
    switch (field) {
      case "player":
        return p.player_name || "";
      case "jersey":
        return p.jersey_num;
      case "pos":
        return p.position || p.pos;
      case "g":
        return p.gp ?? p.g;
      case "ab":
        return p.ab;
      case "r":
        return p.r;
      case "h":
        return p.h;
      case "doubles":
        return p.doubles ?? p["2b"];
      case "triples":
        return p.triples ?? p["3b"];
      case "hr":
        return p.hr;
      case "rbi":
        return p.rbi;
      case "bb":
        return p.bb;
      case "so":
        return p.so;
      case "sb":
        return p.sb;
      case "avg":
        return p.avg;
      case "obp":
        return p.obp;
      case "slg":
        return p.slg;
      default:
        return null;
    }
  };

  const getNumeric = (val) => {
    if (val === null || val === undefined || val === "—") return NaN;
    if (typeof val === "number") return val;
    const n = parseFloat(val);
    return Number.isNaN(n) ? NaN : n;
  };

  const sortedPlayers = useMemo(() => {
    if (!players || !players.length) return [];
    const list = [...players];
    const numeric = isNumericField(sortField);
    list.sort((a, b) => {
      const aRaw = getSortValue(a, sortField);
      const bRaw = getSortValue(b, sortField);
      const aMissing =
        aRaw === null || aRaw === undefined || aRaw === "" || aRaw === "—";
      const bMissing =
        bRaw === null || bRaw === undefined || bRaw === "" || bRaw === "—";
      if (aMissing && bMissing) return 0;
      if (aMissing) return 1;
      if (bMissing) return -1;
      let cmp;
      if (numeric) {
        const aNum = getNumeric(aRaw);
        const bNum = getNumeric(bRaw);
        if (Number.isNaN(aNum) && Number.isNaN(bNum)) cmp = 0;
        else if (Number.isNaN(aNum)) cmp = 1;
        else if (Number.isNaN(bNum)) cmp = -1;
        else cmp = aNum - bNum;
      } else {
        cmp = String(aRaw).localeCompare(String(bRaw));
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [players, sortField, sortDir, isNumericField]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir(isNumericField(field) ? "desc" : "asc");
    }
  };

  const sortArrow = (field) => {
    if (sortField !== field) return "";
    return sortDir === "desc" ? "▼" : "▲";
  };

  const formatAvg = (val) => {
    if (val === null || val === undefined) return "—";
    const num = typeof val === "number" ? val : parseFloat(val);
    if (Number.isNaN(num)) return val;
    return num.toFixed(3).slice(1);
  };

  const safeInt = (val) => {
    if (val === null || val === undefined) return "—";
    return val;
  };

  // Reusable sortable th with tooltip
  const Th = ({ field, label, align = "right", children }) => (
    <th
      title={BATTING_GLOSSARY[field] || label}
      className={`px-2 py-2 font-semibold cursor-pointer select-none text-${align}`}
      style={{ borderBottom: "2px solid #e5e7eb" }}
      onClick={() => handleSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {children || label}
        {sortArrow(field) && (
          <span className="text-[10px]">{sortArrow(field)}</span>
        )}
      </span>
    </th>
  );

  if (!players || players.length === 0) {
    return <p className="px-6 py-4 text-sm text-gray-500">No players found.</p>;
  }

  return (
    <div className="-mx-6 overflow-x-auto px-6">
      <table className="table-auto w-max min-w-full whitespace-nowrap text-xs md:text-sm">
        <thead className="bg-gray-50">
          <tr className="border-b border-gray-200 text-gray-700">
            {/* Player — sticky */}
            <th
              title={BATTING_GLOSSARY["player"]}
              className="px-4 py-2 text-left font-semibold sticky left-0 bg-gray-50 z-10 cursor-pointer select-none"
              onClick={() => handleSort("player")}
            >
              <span className="inline-flex items-center gap-1">
                Player
                {sortArrow("player") && (
                  <span className="text-[10px]">{sortArrow("player")}</span>
                )}
              </span>
            </th>

            <Th field="jersey" label="No." align="center" />
            <Th field="pos" label="POS" align="center" />
            <Th field="g" label="G" />
            <Th field="ab" label="AB" />
            <Th field="r" label="R" />
            <Th field="h" label="H" />
            <Th field="doubles" label="2B" />
            <Th field="triples" label="3B" />
            <Th field="hr" label="HR" />
            <Th field="rbi" label="RBI" />
            <Th field="bb" label="BB" />
            <Th field="so" label="SO" />
            <Th field="sb" label="SB" />
            <Th field="avg" label="AVG" />
            <Th field="obp" label="OBP" />
            <Th field="slg" label="SLG" />
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {sortedPlayers.map((p, idx) => (
            <tr
              key={p.id ?? p.player_id ?? `${p.player_name}-${idx}`}
              className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="px-4 py-1.5 font-medium sticky left-0 bg-inherit">
                <button
                  type="button"
                  onClick={() => onPlayerClick?.(p)}
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors text-left"
                >
                  {p.player_name}
                </button>
              </td>
              <td className="px-2 py-1.5 text-center tabular-nums">
                {p.jersey_num || "—"}
              </td>
              <td className="px-2 py-1.5 text-center">{p.position || "—"}</td>
              <td className="px-2 py-1.5 text-right tabular-nums">
                {safeInt(p.gp || p.g)}
              </td>
              <td className="px-2 py-1.5 text-right tabular-nums">
                {safeInt(p.ab)}
              </td>
              <td className="px-2 py-1.5 text-right tabular-nums">
                {safeInt(p.r)}
              </td>
              <td className="px-2 py-1.5 text-right tabular-nums">
                {safeInt(p.h)}
              </td>
              <td className="px-2 py-1.5 text-right tabular-nums">
                {safeInt(p.doubles || p["2b"])}
              </td>
              <td className="px-2 py-1.5 text-right tabular-nums">
                {safeInt(p.triples || p["3b"])}
              </td>
              <td className="px-2 py-1.5 text-right tabular-nums">
                {safeInt(p.hr)}
              </td>
              <td className="px-2 py-1.5 text-right tabular-nums">
                {safeInt(p.rbi)}
              </td>
              <td className="px-2 py-1.5 text-right tabular-nums">
                {safeInt(p.bb)}
              </td>
              <td className="px-2 py-1.5 text-right tabular-nums">
                {safeInt(p.so)}
              </td>
              <td className="px-2 py-1.5 text-right tabular-nums">
                {safeInt(p.sb)}
              </td>
              <td className="px-2 py-1.5 text-right font-semibold text-blue-600 tabular-nums">
                {formatAvg(p.avg)}
              </td>
              <td className="px-2 py-1.5 text-right tabular-nums">
                {p.obp != null ? p.obp : "—"}
              </td>
              <td className="px-2 py-1.5 text-right tabular-nums">
                {p.slg != null ? p.slg : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
