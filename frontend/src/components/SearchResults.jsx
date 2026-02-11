// src/components/SearchResults.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Trophy, Star } from "lucide-react";

// ---- local API helper (same as App.js) ----
import { API } from "../api/apiClient";

// ---- tiny UI bits to match your design system ----
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
function RowStat({ label, value }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="text-center">
      <div className="font-bold text-lg">{value}</div>
      <div className="text-gray-600 text-xs uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}
function Slashline({ avg, obp, slg }) {
  if (!avg && !obp && !slg) return null;
  return (
    <div className="flex gap-6 text-sm">
      <RowStat label="AVG" value={avg} />
      <RowStat label="OBP" value={obp} />
      <RowStat label="SLG" value={slg} />
    </div>
  );
}
function PitchLine({ era, ip, so, bb, whip, wl, sv }) {
  if (!era && !ip && !so && !bb && !whip && !wl && !sv) return null;
  return (
    <div className="flex flex-wrap gap-6 text-sm">
      <RowStat label="ERA" value={era} />
      <RowStat label="IP" value={ip} />
      <RowStat label="SO" value={so} />
      <RowStat label="BB" value={bb} />
      <RowStat label="WHIP" value={whip} />
      <RowStat label="W-L" value={wl} />
      <RowStat label="SV" value={sv} />
    </div>
  );
}

/**
 * Fetch MVP season stats if the search payload only gave us a name.
 * Expected backend option A (preferred): search returns:
 *   {
 *     queryType: "mvpByYear",
 *     data: { mvp: "Name", year: 2024, player_id: 123, team_name: "X", player_stats: {...} }
 *   }
 *
 * Option B (fallback): if `player_stats` is missing but we have player_id/year,
 * this component calls:
 *   GET /players/:id/stats?year=:year
 */
async function fetchMvpStatsIfNeeded(searchResults) {
  const qt = searchResults?.queryType;
  if (qt !== "mvpByYear" && qt !== "mvp") return null;

  const d = searchResults?.data || {};
  if (d?.player_stats) return d.player_stats;

  // Try to build an endpoint based on id/year in the payload
  const playerId = d?.player_id || d?.id;
  const year = d?.year;
  if (!playerId || !year) return null;

  try {
    const { data } = await API.get(`/players/${playerId}/stats`, {
      params: { year },
    });
    // your API can return { data: {...} } or plain object; normalize a bit:
    return data?.data || data || null;
  } catch {
    return null;
  }
}

export default function SearchResults({ searchResults }) {
  // defensive: avoid the old split(..) crash entirely
  const safeAnswer = useMemo(() => {
    const a = searchResults?.answer;
    return typeof a === "string" ? a : "";
  }, [searchResults]);

  // MVP helper state (only used for MVP queries when stats weren’t in the payload)
  const [mvpStats, setMvpStats] = useState(null);

  useEffect(() => {
    let stop = false;
    setMvpStats(null);

    (async () => {
      const stats = await fetchMvpStatsIfNeeded(searchResults);
      if (!stop && stats) setMvpStats(stats);
    })();

    return () => {
      stop = true;
    };
  }, [searchResults]);

  if (!searchResults) return null;

  const qt = searchResults?.queryType;
  const data = searchResults?.data;

  // helpers to read batter/pitcher lines from any object shape the API returns
  const readBatter = (p) => ({
    player_name: p.player_name || p.name || p.player || p?.full_name,
    team_name: p.team_name || p.team || "",
    batting_avg: p.batting_avg ?? p.avg ?? p.AVG ?? "",
    obp: p.obp ?? p.OBP ?? "",
    slg: p.slg ?? p.SLG ?? "",
    ops: p.ops ?? p.OPS ?? "",
    hits: p.hits ?? p.H ?? "",
    doubles: p.doubles ?? p["2B"] ?? "",
    triples: p.triples ?? p["3B"] ?? "",
    home_runs: p.home_runs ?? p.hr ?? p.HR ?? "",
    rbi: p.rbi ?? p.RBI ?? "",
    runs: p.runs ?? p.R ?? "",
    sb: p.sb ?? p.SB ?? "",
    bb: p.bb ?? p.BB ?? "",
    so: p.so ?? p.SO ?? "",
  });

  const readPitcher = (p) => ({
    player_name: p.player_name || p.name || p.player || p?.full_name,
    team_name: p.team_name || p.team || "",
    era: p.era ?? p.ERA ?? "",
    ip: p.innings_pitched ?? p.ip ?? p.IP ?? "",
    strikeouts: p.strikeouts ?? p.so ?? p.SO ?? "",
    walks: p.walks ?? p.bb ?? p.BB ?? "",
    whip: p.whip ?? p.WHIP ?? "",
    wins: p.wins ?? p.W ?? "",
    losses: p.losses ?? p.L ?? "",
    sv: p.saves ?? p.SV ?? "",
  });

  // ---- “Answer” bubble (safe) ----
  const AnswerCard =
    safeAnswer.trim().length > 0 ? (
      <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="text-green-600 mt-1">
            <Trophy size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-green-900 mb-2">Answer:</h3>
            <div className="text-gray-800 leading-relaxed whitespace-pre-line">
              {
                // keep your **bold** behavior without crashing
                safeAnswer
                  .split("**")
                  .map((part, i) =>
                    i % 2 === 0 ? part : <strong key={i}>{part}</strong>,
                  )
              }
            </div>
          </div>
        </div>
      </div>
    ) : null;

  // ---- MVP block (with season stats) ----
  const MvpBlock =
    (qt === "mvpByYear" || qt === "mvp") && data ? (
      <Card className="mt-4">
        <CardBody>
          <div className="flex items-start gap-3">
            <Star className="text-yellow-600 mt-1" size={20} />
            <div className="flex-1">
              <h4 className="font-semibold mb-1">Tournament MVP</h4>
              <div className="text-2xl font-bold text-gray-900">
                {data.mvp || data.player_name}
              </div>
              <div className="text-sm text-gray-600">
                {data.team_name || data.team}{" "}
                {data.year ? `• ${data.year}` : ""}
              </div>

              <div className="mt-4 grid md:grid-cols-2 gap-6">
                {/* Hitting line if this MVP was a hitter */}
                <div className="space-y-2">
                  <h5 className="text-sm font-semibold text-gray-700">
                    Hitting (tournament)
                  </h5>
                  <Slashline
                    avg={
                      (data.player_stats?.batting_avg ??
                        mvpStats?.batting_avg) ||
                      ""
                    }
                    obp={(data.player_stats?.obp ?? mvpStats?.obp) || ""}
                    slg={(data.player_stats?.slg ?? mvpStats?.slg) || ""}
                  />
                  <div className="flex flex-wrap gap-6 text-sm">
                    <RowStat
                      label="H"
                      value={(data.player_stats?.hits ?? mvpStats?.hits) || ""}
                    />
                    <RowStat
                      label="2B"
                      value={
                        (data.player_stats?.doubles ?? mvpStats?.doubles) || ""
                      }
                    />
                    <RowStat
                      label="3B"
                      value={
                        (data.player_stats?.triples ?? mvpStats?.triples) || ""
                      }
                    />
                    <RowStat
                      label="HR"
                      value={
                        (data.player_stats?.home_runs ?? mvpStats?.home_runs) ||
                        ""
                      }
                    />
                    <RowStat
                      label="RBI"
                      value={(data.player_stats?.rbi ?? mvpStats?.rbi) || ""}
                    />
                    <RowStat
                      label="R"
                      value={(data.player_stats?.runs ?? mvpStats?.runs) || ""}
                    />
                    <RowStat
                      label="SB"
                      value={(data.player_stats?.sb ?? mvpStats?.sb) || ""}
                    />
                  </div>
                </div>

                {/* Pitching line if MVP pitched */}
                <div className="space-y-2">
                  <h5 className="text-sm font-semibold text-gray-700">
                    Pitching (tournament)
                  </h5>
                  <PitchLine
                    era={(data.player_stats?.era ?? mvpStats?.era) || ""}
                    ip={
                      (data.player_stats?.ip ??
                        data.player_stats?.innings_pitched ??
                        mvpStats?.ip ??
                        mvpStats?.innings_pitched) ||
                      ""
                    }
                    so={
                      (data.player_stats?.so ??
                        data.player_stats?.strikeouts ??
                        mvpStats?.so ??
                        mvpStats?.strikeouts) ||
                      ""
                    }
                    bb={
                      (data.player_stats?.bb ??
                        data.player_stats?.walks ??
                        mvpStats?.bb ??
                        mvpStats?.walks) ||
                      ""
                    }
                    whip={(data.player_stats?.whip ?? mvpStats?.whip) || ""}
                    wl={
                      data.player_stats?.wins !== undefined &&
                      data.player_stats?.losses !== undefined
                        ? `${data.player_stats.wins}-${data.player_stats.losses}`
                        : mvpStats?.wins !== undefined &&
                            mvpStats?.losses !== undefined
                          ? `${mvpStats.wins}-${mvpStats.losses}`
                          : ""
                    }
                    sv={(data.player_stats?.saves ?? mvpStats?.saves) || ""}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    ) : null;

  // ---- Top Batters ----
  const TopBatters =
    qt === "topBatters" && Array.isArray(data) ? (
      <div className="space-y-3 mt-4">
        {data.slice(0, 10).map((raw, idx) => {
          const player = readBatter(raw);
          return (
            <Card
              key={`${player.player_name}-${idx}`}
              className="hover:shadow-md transition-shadow"
            >
              <CardBody className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-gray-400">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="font-semibold">{player.player_name}</div>
                      <div className="text-sm text-gray-600">
                        {player.team_name}
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:flex gap-8 text-sm">
                    <Slashline
                      avg={player.batting_avg}
                      obp={player.obp}
                      slg={player.slg}
                    />
                    <div className="flex gap-6">
                      <RowStat label="H" value={player.hits} />
                      <RowStat label="HR" value={player.home_runs} />
                      <RowStat label="RBI" value={player.rbi} />
                      <RowStat label="OPS" value={player.ops} />
                    </div>
                  </div>
                </div>

                {/* mobile condensed */}
                <div className="mt-3 md:hidden">
                  <div className="flex gap-6">
                    <RowStat label="AVG" value={player.batting_avg} />
                    <RowStat label="H" value={player.hits} />
                    <RowStat label="HR" value={player.home_runs} />
                    <RowStat label="RBI" value={player.rbi} />
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    ) : null;

  // ---- Top Pitchers ----
  const TopPitchers =
    qt === "topPitchers" && Array.isArray(data) ? (
      <div className="space-y-3 mt-4">
        {data.slice(0, 10).map((raw, idx) => {
          const p = readPitcher(raw);
          const wl =
            p.wins !== "" && p.losses !== "" ? `${p.wins}-${p.losses}` : "";
          return (
            <Card
              key={`${p.player_name}-${idx}`}
              className="hover:shadow-md transition-shadow"
            >
              <CardBody className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-gray-400">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="font-semibold">{p.player_name}</div>
                      <div className="text-sm text-gray-600">{p.team_name}</div>
                    </div>
                  </div>

                  <div className="hidden md:flex gap-8 text-sm">
                    <div className="flex gap-6">
                      <RowStat label="ERA" value={p.era} />
                      <RowStat label="W-L" value={wl} />
                      <RowStat label="SO" value={p.strikeouts} />
                      <RowStat label="IP" value={p.ip} />
                      <RowStat label="WHIP" value={p.whip} />
                      <RowStat label="SV" value={p.sv} />
                    </div>
                  </div>
                </div>

                {/* mobile condensed */}
                <div className="mt-3 md:hidden">
                  <div className="flex gap-6">
                    <RowStat label="ERA" value={p.era} />
                    <RowStat label="SO" value={p.strikeouts} />
                    <RowStat label="IP" value={p.ip} />
                    <RowStat label="W-L" value={wl} />
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    ) : null;

  // ---- If they asked “Who won in 2024/2025?” you likely set queryType === "championByYear"
  // Add a compact team/MVP + (if present) MVP stat line under it.
  const ChampionBlock =
    qt === "championByYear" && data ? (
      <Card className="mt-4">
        <CardBody>
          <div className="flex items-start gap-3">
            <Trophy className="text-yellow-600 mt-1" size={20} />
            <div className="flex-1">
              <h4 className="font-semibold mb-1">Champion • {data.year}</h4>
              <div className="text-2xl font-bold text-gray-900">
                {data.champion_name || data.champion}
              </div>
              {data.runner_up_name || data.runner_up ? (
                <div className="text-sm text-gray-600">
                  Runner-up: {data.runner_up_name || data.runner_up}
                </div>
              ) : null}
              {data.mvp ? (
                <div className="mt-4">
                  <div className="text-sm font-semibold text-gray-700">MVP</div>
                  <div className="font-bold">{data.mvp}</div>

                  {/* If your search API also returns data.mvp_stats, show them. */}
                  {(data.mvp_stats || data.player_stats) && (
                    <div className="mt-2 grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-xs font-semibold text-gray-700">
                          Hitting (tournament)
                        </h5>
                        <Slashline
                          avg={
                            data.mvp_stats?.batting_avg ||
                            data.player_stats?.batting_avg
                          }
                          obp={data.mvp_stats?.obp || data.player_stats?.obp}
                          slg={data.mvp_stats?.slg || data.player_stats?.slg}
                        />
                      </div>
                      <div>
                        <h5 className="text-xs font-semibold text-gray-700">
                          Pitching (tournament)
                        </h5>
                        <PitchLine
                          era={data.mvp_stats?.era || data.player_stats?.era}
                          ip={
                            data.mvp_stats?.ip ||
                            data.player_stats?.ip ||
                            data.mvp_stats?.innings_pitched
                          }
                          so={
                            data.mvp_stats?.so ||
                            data.player_stats?.so ||
                            data.mvp_stats?.strikeouts
                          }
                          bb={
                            data.mvp_stats?.bb ||
                            data.player_stats?.bb ||
                            data.mvp_stats?.walks
                          }
                          whip={data.mvp_stats?.whip || data.player_stats?.whip}
                          wl={
                            data.mvp_stats?.wins !== undefined &&
                            data.mvp_stats?.losses !== undefined
                              ? `${data.mvp_stats.wins}-${data.mvp_stats.losses}`
                              : data.player_stats?.wins !== undefined &&
                                  data.player_stats?.losses !== undefined
                                ? `${data.player_stats.wins}-${data.player_stats.losses}`
                                : ""
                          }
                          sv={data.mvp_stats?.saves || data.player_stats?.saves}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </CardBody>
      </Card>
    ) : null;

  // ---- Default renders (you can keep your existing ones elsewhere) ----
  const FallbackData =
    Array.isArray(data) &&
    !["topBatters", "topPitchers"].includes(qt) &&
    data.length ? (
      <Card className="mt-4">
        <CardBody>
          <div className="space-y-3">
            {data.slice(0, 5).map((item, idx) => (
              <div key={idx} className="border-b last:border-0 pb-3 last:pb-0">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(item).map(([k, v]) =>
                    v ? (
                      <div key={k}>
                        <span className="text-gray-600 capitalize">
                          {k.replace(/_/g, " ")}:
                        </span>
                        <span className="ml-2 font-medium">{v}</span>
                      </div>
                    ) : null,
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    ) : null;

  return (
    <div className="mt-6">
      {AnswerCard}
      {MvpBlock}
      {ChampionBlock}
      {TopBatters}
      {TopPitchers}
      {FallbackData}
    </div>
  );
}
