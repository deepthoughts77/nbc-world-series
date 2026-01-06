// frontend/src/components/player-stats/PlayerStatsTable.js
import React, { useState, useMemo, useCallback } from "react";

export function PlayerStatsTable({ players, onPlayerClick }) {
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
      "avg",
      "obp",
      "slg",
    ],
    []
  );

  const isNumericField = useCallback(
    (field) => numericSortFields.includes(field),
    [numericSortFields]
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
      if (aMissing) return 1; // missing values go to bottom
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
    return num.toFixed(3).slice(1); // "345" for .345
  };

  const safeInt = (val) => {
    if (val === null || val === undefined) return "—";
    return val;
  };

  if (!players || players.length === 0) {
    return <p className="p-4 text-sm text-gray-500">No players found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1200px] text-xs md:text-sm">
        <thead className="bg-gray-50">
          <tr className="border-b border-gray-200 text-gray-700">
            <th
              className="px-4 py-2 text-left font-semibold sticky left-0 bg-gray-50 z-10 cursor-pointer"
              onClick={() => handleSort("player")}
            >
              <span className="inline-flex items-center">
                Player{" "}
                {sortArrow("player") && (
                  <span className="ml-0.5 text-[10px]">
                    {sortArrow("player")}
                  </span>
                )}
              </span>
            </th>

            <th
              className="px-2 py-2 text-center font-semibold cursor-pointer"
              onClick={() => handleSort("jersey")}
            >
              <span className="inline-flex items-center">
                No.{" "}
                {sortArrow("jersey") && (
                  <span className="ml-0.5 text-[10px]">
                    {sortArrow("jersey")}
                  </span>
                )}
              </span>
            </th>

            <th
              className="px-2 py-2 text-center font-semibold cursor-pointer"
              onClick={() => handleSort("pos")}
            >
              <span className="inline-flex items-center">
                POS{" "}
                {sortArrow("pos") && (
                  <span className="ml-0.5 text-[10px]">{sortArrow("pos")}</span>
                )}
              </span>
            </th>

            <th
              className="px-2 py-2 text-right font-semibold cursor-pointer"
              onClick={() => handleSort("g")}
            >
              <span className="inline-flex items-center">
                G{" "}
                {sortArrow("g") && (
                  <span className="ml-0.5 text-[10px]">{sortArrow("g")}</span>
                )}
              </span>
            </th>

            <th
              className="px-2 py-2 text-right font-semibold cursor-pointer"
              onClick={() => handleSort("ab")}
            >
              <span className="inline-flex items-center">
                AB{" "}
                {sortArrow("ab") && (
                  <span className="ml-0.5 text-[10px]">{sortArrow("ab")}</span>
                )}
              </span>
            </th>

            <th
              className="px-2 py-2 text-right font-semibold cursor-pointer"
              onClick={() => handleSort("r")}
            >
              <span className="inline-flex items-center">
                R{" "}
                {sortArrow("r") && (
                  <span className="ml-0.5 text-[10px]">{sortArrow("r")}</span>
                )}
              </span>
            </th>

            <th
              className="px-2 py-2 text-right font-semibold cursor-pointer"
              onClick={() => handleSort("h")}
            >
              <span className="inline-flex items-center">
                H{" "}
                {sortArrow("h") && (
                  <span className="ml-0.5 text-[10px]">{sortArrow("h")}</span>
                )}
              </span>
            </th>

            <th
              className="px-2 py-2 text-right font-semibold cursor-pointer"
              onClick={() => handleSort("doubles")}
            >
              <span className="inline-flex items-center">
                2B{" "}
                {sortArrow("doubles") && (
                  <span className="ml-0.5 text-[10px]">
                    {sortArrow("doubles")}
                  </span>
                )}
              </span>
            </th>

            <th
              className="px-2 py-2 text-right font-semibold cursor-pointer"
              onClick={() => handleSort("triples")}
            >
              <span className="inline-flex items-center">
                3B{" "}
                {sortArrow("triples") && (
                  <span className="ml-0.5 text-[10px]">
                    {sortArrow("triples")}
                  </span>
                )}
              </span>
            </th>

            <th
              className="px-2 py-2 text-right font-semibold cursor-pointer"
              onClick={() => handleSort("hr")}
            >
              <span className="inline-flex items-center">
                HR{" "}
                {sortArrow("hr") && (
                  <span className="ml-0.5 text-[10px]">{sortArrow("hr")}</span>
                )}
              </span>
            </th>

            <th
              className="px-2 py-2 text-right font-semibold cursor-pointer"
              onClick={() => handleSort("rbi")}
            >
              <span className="inline-flex items-center">
                RBI{" "}
                {sortArrow("rbi") && (
                  <span className="ml-0.5 text-[10px]">{sortArrow("rbi")}</span>
                )}
              </span>
            </th>

            <th
              className="px-2 py-2 text-right font-semibold cursor-pointer"
              onClick={() => handleSort("bb")}
            >
              <span className="inline-flex items-center">
                BB{" "}
                {sortArrow("bb") && (
                  <span className="ml-0.5 text-[10px]">{sortArrow("bb")}</span>
                )}
              </span>
            </th>

            <th
              className="px-2 py-2 text-right font-semibold cursor-pointer"
              onClick={() => handleSort("so")}
            >
              <span className="inline-flex items-center">
                SO{" "}
                {sortArrow("so") && (
                  <span className="ml-0.5 text-[10px]">{sortArrow("so")}</span>
                )}
              </span>
            </th>

            <th
              className="px-2 py-2 text-right font-semibold cursor-pointer"
              onClick={() => handleSort("sb")}
            >
              <span className="inline-flex items-center">
                SB{" "}
                {sortArrow("sb") && (
                  <span className="ml-0.5 text-[10px]">{sortArrow("sb")}</span>
                )}
              </span>
            </th>

            <th
              className="px-2 py-2 text-right font-semibold cursor-pointer whitespace-nowrap"
              onClick={() => handleSort("avg")}
            >
              <span className="inline-flex items-center">
                AVG{" "}
                {sortArrow("avg") && (
                  <span className="ml-0.5 text-[10px]">{sortArrow("avg")}</span>
                )}
              </span>
            </th>

            <th
              className="px-2 py-2 text-right font-semibold cursor-pointer"
              onClick={() => handleSort("obp")}
            >
              <span className="inline-flex items-center">
                OBP{" "}
                {sortArrow("obp") && (
                  <span className="ml-0.5 text-[10px]">{sortArrow("obp")}</span>
                )}
              </span>
            </th>

            <th
              className="px-2 py-2 text-right font-semibold cursor-pointer"
              onClick={() => handleSort("slg")}
            >
              <span className="inline-flex items-center">
                SLG{" "}
                {sortArrow("slg") && (
                  <span className="ml-0.5 text-[10px]">{sortArrow("slg")}</span>
                )}
              </span>
            </th>
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

              <td className="px-2 py-1.5 text-center">{p.jersey_num || "—"}</td>

              <td className="px-2 py-1.5 text-center">{p.position || "—"}</td>

              <td className="px-2 py-1.5 text-right">{safeInt(p.gp || p.g)}</td>
              <td className="px-2 py-1.5 text-right">{safeInt(p.ab)}</td>
              <td className="px-2 py-1.5 text-right">{safeInt(p.r)}</td>
              <td className="px-2 py-1.5 text-right">{safeInt(p.h)}</td>
              <td className="px-2 py-1.5 text-right">
                {safeInt(p.doubles || p["2b"])}
              </td>
              <td className="px-2 py-1.5 text-right">
                {safeInt(p.triples || p["3b"])}
              </td>
              <td className="px-2 py-1.5 text-right">{safeInt(p.hr)}</td>
              <td className="px-2 py-1.5 text-right">{safeInt(p.rbi)}</td>
              <td className="px-2 py-1.5 text-right">{safeInt(p.bb)}</td>
              <td className="px-2 py-1.5 text-right">{safeInt(p.so)}</td>
              <td className="px-2 py-1.5 text-right">{safeInt(p.sb)}</td>

              <td className="px-2 py-1.5 text-right font-semibold text-blue-600">
                .{formatAvg(p.avg)}
              </td>
              <td className="px-2 py-1.5 text-right">
                {p.obp != null ? p.obp : "—"}
              </td>
              <td className="px-2 py-1.5 text-right">
                {p.slg != null ? p.slg : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
