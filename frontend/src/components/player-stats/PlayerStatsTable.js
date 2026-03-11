// frontend/src/components/player-stats/PlayerStatsTable.js
import React, { useState, useMemo, useCallback } from "react";

export function PlayerStatsTable({ players, onPlayerClick, year }) {
  // Default sort: AVG, highest first
  const [sortField, setSortField] = useState("avg");
  const [sortDir, setSortDir] = useState("desc"); // "asc" | "desc"

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
      "sh",
      "po",
      "a",
      "e",
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
      case "sh":
        return p.sh;
      case "po":
        return p.po;
      case "a":
        return p.a;
      case "e":
        return p.e;
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
      // E (errors) is lower-is-better, sort asc by default
      const lowerIsBetter = new Set(["e"]);
      setSortDir(
        isNumericField(field)
          ? lowerIsBetter.has(field)
            ? "asc"
            : "desc"
          : "asc",
      );
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
    return num.toFixed(3).slice(1); // ".345" → "345" displayed as .345
  };

  const safeInt = (val) => {
    if (val === null || val === undefined) return "—";
    return val;
  };

  if (!players || players.length === 0) {
    return <p className="px-6 py-4 text-sm text-gray-500">No players found.</p>;
  }

  // Columns definition — add/remove here to control what shows.
  // Each entry: [sortKey, label, renderFn]
  const columns = [
    // --- Standard counting stats ---
    ["g", "G", (p) => safeInt(p.gp ?? p.g)],
    ["ab", "AB", (p) => safeInt(p.ab)],
    ["r", "R", (p) => safeInt(p.r)],
    ["h", "H", (p) => safeInt(p.h)],
    ["doubles", "2B", (p) => safeInt(p.doubles ?? p["2b"])],
    ["triples", "3B", (p) => safeInt(p.triples ?? p["3b"])],
    ["hr", "HR", (p) => safeInt(p.hr)],
    ["rbi", "RBI", (p) => safeInt(p.rbi)],
    ["bb", "BB", (p) => safeInt(p.bb)],
    ["so", "SO", (p) => safeInt(p.so)],
    ["sb", "SB", (p) => safeInt(p.sb)],
    ["sh", "SH", (p) => safeInt(p.sh)], // ← was missing
    // --- Fielding stats ---
    ["po", "PO", (p) => safeInt(p.po)],
    ["a", "A", (p) => safeInt(p.a)], // ← was missing
    ["e", "E", (p) => safeInt(p.e)], // ← was missing
    // --- Rate stats ---
    [
      "avg",
      "AVG",
      (p) => (
        <span className="font-semibold text-blue-600">{formatAvg(p.avg)}</span>
      ),
    ],
    ["obp", "OBP", (p) => (p.obp != null ? formatAvg(p.obp) : "—")],
    ["slg", "SLG", (p) => (p.slg != null ? formatAvg(p.slg) : "—")],
  ];

  return (
    <div className="-mx-6 overflow-x-auto px-6">
      <table className="table-auto w-max min-w-full whitespace-nowrap text-xs md:text-sm">
        <thead className="bg-gray-50">
          <tr className="border-b border-gray-200 text-gray-700">
            {/* Player name — sticky */}
            <th
              className="px-4 py-2 text-left font-semibold sticky left-0 bg-gray-50 z-10 cursor-pointer"
              onClick={() => handleSort("player")}
            >
              <span className="inline-flex items-center">
                Player{" "}
                {sortArrow("player") && (
                  <span className="ml-1 text-[10px]">
                    {sortArrow("player")}
                  </span>
                )}
              </span>
            </th>

            {/* Jersey No. */}
            <th
              className="px-2 py-2 text-center font-semibold cursor-pointer"
              onClick={() => handleSort("jersey")}
            >
              <span className="inline-flex items-center">
                No.{" "}
                {sortArrow("jersey") && (
                  <span className="ml-1 text-[10px]">
                    {sortArrow("jersey")}
                  </span>
                )}
              </span>
            </th>

            {/* Position */}
            <th
              className="px-2 py-2 text-center font-semibold cursor-pointer"
              onClick={() => handleSort("pos")}
            >
              <span className="inline-flex items-center">
                POS{" "}
                {sortArrow("pos") && (
                  <span className="ml-1 text-[10px]">{sortArrow("pos")}</span>
                )}
              </span>
            </th>

            {/* Dynamic stat columns */}
            {columns.map(([key, label]) => (
              <th
                key={key}
                className="px-2 py-2 text-right font-semibold cursor-pointer"
                onClick={() => handleSort(key)}
              >
                <span className="inline-flex items-center justify-end">
                  {label}{" "}
                  {sortArrow(key) && (
                    <span className="ml-1 text-[10px]">{sortArrow(key)}</span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {sortedPlayers.map((p, idx) => (
            <tr
              key={p.id ?? p.player_id ?? `${p.player_name}-${idx}`}
              className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              {/* Player name — sticky */}
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

              {/* Dynamic stat cells */}
              {columns.map(([key, , renderFn]) => (
                <td key={key} className="px-2 py-1.5 text-right tabular-nums">
                  {renderFn(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
