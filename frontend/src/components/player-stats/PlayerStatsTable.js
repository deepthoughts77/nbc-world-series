import React from "react";
// FIX: Import 'battingStatColumns' and rename it to 'statColumns'
import { battingStatColumns as statColumns } from "../../constants/stats";

export function PlayerStatsTable({ players }) {
  if (!players || players.length === 0) {
    return <p className="p-4 text-sm text-gray-500">No players found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1024px] text-xs md:text-sm">
        <thead className="bg-gray-50">
          <tr className="border-b border-gray-200 text-gray-700">
            <th className="px-4 py-2 text-left font-semibold sticky left-0 bg-gray-50 z-10 w-48">
              Player
            </th>
            <th className="px-2 py-2 text-left font-semibold w-24">Pos</th>
            {/* FIX: This line now works */}
            {statColumns.map((col) => (
              <th
                key={col.key}
                className="px-2 py-2 text-right font-semibold whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {players.map((p, idx) => (
            <tr
              key={p.id ?? p.player_name}
              className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td
                className="px-4 py-1.5 whitespace-nowrap sticky left-0 z-10 w-48 font-medium text-gray-900"
                style={{
                  backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB",
                }}
              >
                {p.player_name}
              </td>
              <td className="px-2 py-1.5">{p.position || "—"}</td>
              {/* FIX: This line now works */}
              {statColumns.map((col) => (
                <td key={col.key} className="px-2 py-1.5 text-right">
                  {p[col.key] === null ||
                  p[col.key] === undefined ||
                  p[col.key] === ""
                    ? "—"
                    : p[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
