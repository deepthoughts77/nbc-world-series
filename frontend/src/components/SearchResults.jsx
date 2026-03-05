// src/components/SearchResults.jsx
import React, { useMemo } from "react";
import { Trophy, Star } from "lucide-react";

// ── tiny shared UI ────────────────────────────────────────────────────────
function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 ${className}`}
    >
      {children}
    </div>
  );
}
function CardBody({ children, className = "" }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}
function RowStat({ label, value, highlight = false }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div
      className="text-center rounded-lg px-2 py-0.5"
      style={
        highlight
          ? {
              background: "#eff6ff",
              outline: "2px solid #3b82f6",
              outlineOffset: "1px",
            }
          : {}
      }
    >
      <div
        className="font-bold text-lg"
        style={{ color: highlight ? "#1d4ed8" : "#1f2937" }}
      >
        {value}
      </div>
      <div
        className="text-xs uppercase tracking-wide"
        style={{
          color: highlight ? "#2563eb" : "#6b7280",
          fontWeight: highlight ? 600 : 400,
        }}
      >
        {label}
      </div>
    </div>
  );
}

// ── bold-markdown renderer ────────────────────────────────────────────────
function BoldText({ text }) {
  if (!text) return null;
  const parts = text.split("**");
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 0 ? part : <strong key={i}>{part}</strong>,
      )}
    </>
  );
}

// ── stat formatters ───────────────────────────────────────────────────────
const fmt3 = (v) => (v != null && v !== "" ? parseFloat(v).toFixed(3) : "");
const fmt2 = (v) => (v != null && v !== "" ? parseFloat(v).toFixed(2) : "");

// ── normalize a raw row from the backend into a clean batter object ───────
function readBatter(p) {
  const avg = fmt3(p.avg ?? p.batting_avg ?? p.AVG);
  const obp = fmt3(p.obp ?? p.OBP);
  const slg = fmt3(p.slg ?? p.SLG);
  const fld = fmt3(p.fld ?? p.FLD);
  return {
    player_name: p.player_name || p.name || "",
    team_name: p.team_name || p.team || "",
    year: p.year || "",
    avg,
    obp,
    slg,
    fld,
    hr: p.hr ?? p.HR ?? "",
    rbi: p.rbi ?? p.RBI ?? "",
    h: p.h ?? p.H ?? "",
    r: p.r ?? p.R ?? "",
    bb: p.bb ?? p.BB ?? "",
    so: p.so ?? p.SO ?? "",
    sb: p.sb ?? p.SB ?? "",
    "2b": p["2b"] ?? p["2B"] ?? "",
    "3b": p["3b"] ?? p["3B"] ?? "",
    tb: p.tb ?? p.TB ?? "",
    ab: p.ab ?? p.AB ?? "",
    gp: p.gp ?? p.GP ?? "",
    hbp: p.hbp ?? p.HBP ?? "",
    sh: p.sh ?? p.SH ?? "",
    gdp: p.gdp ?? p.GDP ?? "",
    e: p.e ?? p.E ?? "",
  };
}

// ── normalize a raw row from the backend into a clean pitcher object ──────
function readPitcher(p) {
  return {
    player_name: p.player_name || p.name || "",
    team_name: p.team_name || p.team || "",
    year: p.year || "",
    era: fmt2(p.era ?? p.ERA),
    ip: p.ip ?? p.IP ?? "",
    w: p.w ?? p.W ?? "",
    l: p.l ?? p.L ?? "",
    sv: p.sv ?? p.SV ?? "",
    so: p.so ?? p.SO ?? "",
    bb: p.bb ?? p.BB ?? "",
    cg: p.cg ?? p.CG ?? "",
    sho: p.sho ?? p.SHO ?? "",
    app: p.app ?? p.APP ?? "",
  };
}

// ── Answer bubble ─────────────────────────────────────────────────────────
function AnswerCard({ answer, isTie = false }) {
  if (!answer?.trim()) return null;
  return (
    <div
      className="p-4 rounded-xl border-2"
      style={{
        background: "linear-gradient(135deg,#eff6ff,#dbeafe)",
        borderColor: "#3b82f6",
      }}
    >
      <div className="flex items-start gap-3">
        <Trophy
          size={20}
          style={{ color: "#2563eb" }}
          className="mt-1 shrink-0"
        />
        <div>
          <h3 className="font-semibold mb-1" style={{ color: "#1e40af" }}>
            {isTie ? "Tie" : "Answer"}
          </h3>
          <p className="text-gray-800 leading-relaxed">
            <BoldText text={answer} />
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Championship block (queryType: "championship_winner") ─────────────────
function ChampionBlock({ data }) {
  if (!data) return null;
  const mvpNames = data.mvp_names;
  const mvpLabel =
    Array.isArray(mvpNames) && mvpNames.length > 0
      ? mvpNames.join(" & ")
      : null;

  return (
    <Card className="mt-4">
      <CardBody>
        <div className="flex items-start gap-3">
          <Trophy size={20} className="text-yellow-600 mt-1 shrink-0" />
          <div className="flex-1">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              {data.year} Champion
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {data.champion_name}
            </div>
            <div className="text-sm text-gray-500">
              {data.champion_city}, {data.champion_state}
            </div>

            {data.runner_up_name && (
              <div className="text-sm text-gray-600 mt-1">
                Runner-up:{" "}
                <span className="font-medium">{data.runner_up_name}</span>
              </div>
            )}
            {mvpLabel && (
              <div className="text-sm text-gray-600 mt-1">
                MVP: <span className="font-medium">{mvpLabel}</span>
              </div>
            )}
            {data.championship_score && (
              <div className="text-sm text-gray-600 mt-1">
                Score:{" "}
                <span className="font-medium">{data.championship_score}</span>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// ── MVP block (queryType: "championship_mvp") ─────────────────────────────
function MvpBlock({ data }) {
  if (!data) return null;
  const names = Array.isArray(data.mvp_names) ? data.mvp_names : [];
  const label = names.length > 0 ? names.join(" & ") : "—";

  return (
    <Card className="mt-4">
      <CardBody>
        <div className="flex items-start gap-3">
          <Star size={20} className="text-yellow-500 mt-1 shrink-0" />
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              {data.year} Tournament MVP
            </div>
            <div className="text-2xl font-bold text-gray-900">{label}</div>
            {data.champion_name && (
              <div className="text-sm text-gray-500">{data.champion_name}</div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// ── Batting leaderboard (queryType: "batting_stat") ───────────────────────
function BattingLeaderboard({ results, message, activeStat }) {
  if (!Array.isArray(results) || results.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      {message && (
        <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide px-1">
          {message}
        </h3>
      )}
      {results.map((raw, idx) => {
        const p = readBatter(raw);
        return (
          <Card
            key={`${p.player_name}-${idx}`}
            className="hover:shadow-md transition-shadow"
          >
            <CardBody className="py-3 px-4">
              <div className="flex items-center gap-4">
                <div className="text-xl font-bold text-gray-300 w-7 text-right shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{p.player_name}</div>
                  <div className="text-xs text-gray-500">
                    {p.team_name}
                    {p.year ? ` • ${p.year}` : ""}
                  </div>
                </div>
                {/* Desktop: active stat always first + highlighted, then core cols */}
                {(() => {
                  const ALL_BATTING = [
                    { key: "avg", label: "AVG", val: p.avg },
                    { key: "obp", label: "OBP", val: p.obp },
                    { key: "slg", label: "SLG", val: p.slg },
                    { key: "hr", label: "HR", val: p.hr },
                    { key: "rbi", label: "RBI", val: p.rbi },
                    { key: "h", label: "H", val: p.h },
                    { key: "ab", label: "AB", val: p.ab },
                    { key: "r", label: "R", val: p.r },
                    { key: "bb", label: "BB", val: p.bb },
                    { key: "so", label: "SO", val: p.so },
                    { key: "sb", label: "SB", val: p.sb },
                    { key: "2b", label: "2B", val: p["2b"] },
                    { key: "3b", label: "3B", val: p["3b"] },
                    { key: "tb", label: "TB", val: p.tb },
                    { key: "gp", label: "GP", val: p.gp },
                    { key: "hbp", label: "HBP", val: p.hbp },
                    { key: "sh", label: "SH", val: p.sh },
                    { key: "gdp", label: "GDP", val: p.gdp },
                    { key: "e", label: "E", val: p.e },
                    { key: "fld", label: "FLD", val: p.fld },
                  ];
                  // Put active stat first, then show up to 8 others that have values
                  const active = ALL_BATTING.find((c) => c.key === activeStat);
                  const rest = ALL_BATTING.filter(
                    (c) =>
                      c.key !== activeStat && c.val !== "" && c.val != null,
                  );
                  const cols = active
                    ? [active, ...rest.slice(0, 8)]
                    : rest.slice(0, 9);
                  return (
                    <div className="hidden sm:flex gap-4 text-sm shrink-0 flex-wrap justify-end">
                      {cols.map((c) => (
                        <RowStat
                          key={c.key}
                          label={c.label}
                          value={c.val}
                          highlight={c.key === activeStat}
                        />
                      ))}
                    </div>
                  );
                })()}
                {/* Mobile: active stat + AVG + HR */}
                <div className="flex sm:hidden gap-4 text-sm shrink-0">
                  {activeStat && activeStat !== "avg" && (
                    <RowStat
                      label={activeStat.toUpperCase()}
                      value={p[activeStat]}
                      highlight
                    />
                  )}
                  <RowStat
                    label="AVG"
                    value={p.avg}
                    highlight={activeStat === "avg"}
                  />
                  <RowStat
                    label="HR"
                    value={p.hr}
                    highlight={activeStat === "hr"}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}

// ── Pitching leaderboard (queryType: "pitching_stat") ────────────────────
function PitchingLeaderboard({ results, message, activeStat }) {
  if (!Array.isArray(results) || results.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      {message && (
        <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide px-1">
          {message}
        </h3>
      )}
      {results.map((raw, idx) => {
        const p = readPitcher(raw);
        const wl = p.w !== "" && p.l !== "" ? `${p.w}-${p.l}` : "";
        return (
          <Card
            key={`${p.player_name}-${idx}`}
            className="hover:shadow-md transition-shadow"
          >
            <CardBody className="py-3 px-4">
              <div className="flex items-center gap-4">
                <div className="text-xl font-bold text-gray-300 w-7 text-right shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{p.player_name}</div>
                  <div className="text-xs text-gray-500">
                    {p.team_name}
                    {p.year ? ` • ${p.year}` : ""}
                  </div>
                </div>
                {/* Desktop: active stat always first + highlighted */}
                {(() => {
                  const ALL_PITCHING = [
                    { key: "era", label: "ERA", val: p.era },
                    { key: "w", label: "W-L", val: wl },
                    { key: "ip", label: "IP", val: p.ip },
                    { key: "so", label: "SO", val: p.so },
                    { key: "bb", label: "BB", val: p.bb },
                    { key: "sv", label: "SV", val: p.sv },
                    { key: "cg", label: "CG", val: p.cg },
                    { key: "sho", label: "SHO", val: p.sho },
                    { key: "app", label: "APP", val: p.app },
                    { key: "l", label: "L", val: p.l },
                    { key: "whip", label: "WHIP", val: p.whip },
                  ];
                  const active = ALL_PITCHING.find((c) => c.key === activeStat);
                  const rest = ALL_PITCHING.filter(
                    (c) =>
                      c.key !== activeStat && c.val !== "" && c.val != null,
                  );
                  const cols = active
                    ? [active, ...rest.slice(0, 8)]
                    : rest.slice(0, 9);
                  return (
                    <div className="hidden sm:flex gap-4 text-sm shrink-0 flex-wrap justify-end">
                      {cols.map((c) => (
                        <RowStat
                          key={c.key}
                          label={c.label}
                          value={c.val}
                          highlight={c.key === activeStat}
                        />
                      ))}
                    </div>
                  );
                })()}
                {/* Mobile: active stat + ERA + W-L */}
                <div className="flex sm:hidden gap-4 text-sm shrink-0">
                  {activeStat && activeStat !== "era" && (
                    <RowStat
                      label={activeStat.toUpperCase()}
                      value={p[activeStat]}
                      highlight
                    />
                  )}
                  <RowStat
                    label="ERA"
                    value={p.era}
                    highlight={activeStat === "era"}
                  />
                  <RowStat
                    label="W-L"
                    value={wl}
                    highlight={activeStat === "w"}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}

// ── Generic leaderboard (championships, streaks, MVPs) ───────────────────
function GenericLeaderboard({ results, queryType }) {
  if (!Array.isArray(results) || results.length === 0) return null;
  const supported = ["leaderboard", "streaks", "fallback"];
  if (!supported.includes(queryType)) return null;

  // Streaks layout
  if (queryType === "streaks") {
    const topStreakWins = results[0]?.consecutive_wins;
    return (
      <Card className="mt-4">
        <CardBody className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#f8fafc" }} className="border-b">
                <th className="text-left px-4 py-2 text-gray-500 font-semibold w-6">
                  #
                </th>
                <th className="text-left px-4 py-2 text-gray-500 font-semibold">
                  Team
                </th>
                <th className="text-center px-4 py-2 text-gray-500 font-semibold">
                  Streak
                </th>
                <th className="text-center px-4 py-2 text-gray-500 font-semibold">
                  Years
                </th>
              </tr>
            </thead>
            <tbody>
              {results.slice(0, 10).map((item, idx) => {
                const isTop =
                  String(item.consecutive_wins) === String(topStreakWins);
                return (
                  <tr
                    key={idx}
                    className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                    style={isTop ? { background: "#eff6ff" } : {}}
                  >
                    <td
                      className="px-4 py-3 font-bold"
                      style={{ color: isTop ? "#2563eb" : "#d1d5db" }}
                    >
                      {idx + 1}
                    </td>
                    <td
                      className="px-4 py-3 font-semibold"
                      style={{ color: isTop ? "#1e40af" : "#111827" }}
                    >
                      {item.team_name}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className="font-bold text-lg"
                        style={{ color: isTop ? "#2563eb" : "#374151" }}
                      >
                        {item.consecutive_wins}
                      </span>
                      <span className="text-xs text-gray-400 ml-1">
                        in a row
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-500">
                      {item.start_year === item.end_year
                        ? item.start_year
                        : `${item.start_year}–${item.end_year}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    );
  }

  // Championship / MVP leaderboard layout
  if (queryType === "leaderboard") {
    const isTeam = results[0]?.team_name != null;
    return (
      <Card className="mt-4">
        <CardBody className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#f8fafc" }} className="border-b">
                <th className="text-left px-4 py-2 text-gray-500 font-semibold w-6">
                  #
                </th>
                <th className="text-left px-4 py-2 text-gray-500 font-semibold">
                  {isTeam ? "Team" : "Player"}
                </th>
                <th className="text-center px-4 py-2 text-gray-500 font-semibold">
                  Count
                </th>
                <th className="text-left px-4 py-2 text-gray-500 font-semibold hidden sm:table-cell">
                  Years
                </th>
              </tr>
            </thead>
            <tbody>
              {results.slice(0, 10).map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-300 font-bold">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">
                      {item.team_name || item.player_name}
                    </div>
                    {item.city && (
                      <div className="text-xs text-gray-400">
                        {item.city}, {item.state}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className="font-bold text-lg"
                      style={{ color: idx === 0 ? "#2563eb" : "#374151" }}
                    >
                      {item.count}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 hidden sm:table-cell">
                    {Array.isArray(item.years)
                      ? item.years.slice(0, 6).join(", ") +
                        (item.years.length > 6 ? "…" : "")
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    );
  }

  // Fallback: simple list
  return (
    <Card className="mt-4">
      <CardBody>
        <div className="space-y-2">
          {results.slice(0, 10).map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 py-2 border-b last:border-0"
            >
              <div className="text-gray-300 font-bold w-5 shrink-0">
                {idx + 1}
              </div>
              <div className="font-medium text-gray-800">
                {item.team_name || item.name}
              </div>
              {item.titles != null && (
                <div className="ml-auto text-sm text-gray-500">
                  {item.titles} titles
                </div>
              )}
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

// ── Team roster ───────────────────────────────────────────────────────────
function RosterBlock({ results, message }) {
  if (!Array.isArray(results) || results.length === 0) return null;
  return (
    <Card className="mt-4">
      <CardBody>
        {message && (
          <h3 className="font-semibold text-gray-700 mb-3">{message}</h3>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {results.map((p, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between border rounded-lg px-3 py-2"
            >
              <span className="font-medium">
                {p.first_name} {p.last_name}
              </span>
              <div className="flex gap-3 text-gray-500">
                {p.avg != null && <span>AVG {fmt3(p.avg)}</span>}
                {p.hr != null && <span>HR {p.hr}</span>}
                {p.era != null && <span>ERA {fmt2(p.era)}</span>}
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

// ── Player lookup ─────────────────────────────────────────────────────────
function PlayerLookup({ results, message }) {
  if (!Array.isArray(results) || results.length === 0) return null;
  return (
    <Card className="mt-4">
      <CardBody>
        {message && (
          <h3 className="font-semibold text-gray-700 mb-3">{message}</h3>
        )}
        <div className="space-y-4">
          {results.map((raw, idx) => {
            const hasBatting =
              raw.avg != null || raw.hr != null || raw.ab != null;
            const hasPitching = raw.era != null || raw.ip != null;
            return (
              <div key={idx} className="border-b last:border-0 pb-4 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-semibold text-gray-900">
                      {raw.player_name}
                    </span>
                    {raw.team_name && (
                      <span className="text-sm text-gray-500 ml-2">
                        {raw.team_name}
                      </span>
                    )}
                  </div>
                  {raw.year && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {raw.year}
                    </span>
                  )}
                </div>
                {hasBatting && (
                  <div className="flex flex-wrap gap-3 text-sm">
                    <RowStat label="AVG" value={fmt3(raw.avg)} />
                    <RowStat label="OBP" value={fmt3(raw.obp)} />
                    <RowStat label="SLG" value={fmt3(raw.slg)} />
                    <RowStat label="AB" value={raw.ab} />
                    <RowStat label="H" value={raw.h} />
                    <RowStat label="R" value={raw.r} />
                    <RowStat label="HR" value={raw.hr} />
                    <RowStat label="RBI" value={raw.rbi} />
                    <RowStat label="BB" value={raw.bb} />
                    <RowStat label="SO" value={raw.so} />
                    <RowStat label="SB" value={raw.sb} />
                    <RowStat label="2B" value={raw["2b"]} />
                    <RowStat label="3B" value={raw["3b"]} />
                    <RowStat label="TB" value={raw.tb} />
                    <RowStat label="GP" value={raw.gp} />
                  </div>
                )}
                {hasPitching && (
                  <div className="flex flex-wrap gap-3 text-sm mt-2">
                    <RowStat label="ERA" value={fmt2(raw.era)} />
                    <RowStat label="IP" value={raw.ip} />
                    <RowStat label="W" value={raw.w} />
                    <RowStat label="L" value={raw.l} />
                    <RowStat label="SV" value={raw.sv} />
                    <RowStat label="SO" value={raw.p_so ?? raw.so} />
                    <RowStat label="BB" value={raw.p_bb ?? raw.bb} />
                    <RowStat label="CG" value={raw.cg} />
                    <RowStat label="SHO" value={raw.sho} />
                    <RowStat label="APP" value={raw.app} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  Main component
// ═══════════════════════════════════════════════════════════════════════════
export default function SearchResults({ searchResults }) {
  const answer = useMemo(() => searchResults?.answer || "", [searchResults]);
  const message = useMemo(() => searchResults?.message || "", [searchResults]);
  const qt = searchResults?.queryType;
  const data = searchResults?.data;
  const results = searchResults?.results || (Array.isArray(data) ? data : []);

  if (!searchResults) return null;

  return (
    <div className="mt-6 space-y-0">
      {/* Always show the answer bubble */}
      <AnswerCard
        answer={answer}
        isTie={!!(answer && /tied|tie/.test(answer.toLowerCase()))}
      />

      {/* Championship result */}
      {qt === "championship_winner" && <ChampionBlock data={data} />}

      {/* MVP result */}
      {qt === "championship_mvp" && <MvpBlock data={data} />}

      {/* Runner-up: answer bubble is enough, but show champion details too */}
      {qt === "championship_runnerup" && <ChampionBlock data={data} />}

      {/* Batting leaderboard */}
      {qt === "batting_stat" && (
        <BattingLeaderboard
          results={results}
          message={message}
          activeStat={searchResults?.intent?.stat}
        />
      )}

      {/* Pitching leaderboard */}
      {qt === "pitching_stat" && (
        <PitchingLeaderboard
          results={results}
          message={message}
          activeStat={searchResults?.intent?.stat}
        />
      )}

      {/* Team roster */}
      {qt === "team_roster" && (
        <RosterBlock results={results} message={message} />
      )}

      {/* Player lookup */}
      {qt === "player_lookup" && (
        <PlayerLookup results={results} message={message} />
      )}

      {/* Generic leaderboards: most championships, streaks, most MVPs */}
      <GenericLeaderboard results={results} queryType={qt} />
    </div>
  );
}
