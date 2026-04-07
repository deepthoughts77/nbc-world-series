// frontend/src/pages/ChampionshipFinal.js
import React, { useEffect, useState, useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Container } from "../components/common/Container";
import { Card, CardBody } from "../components/common/Card";
import { SectionTitle } from "../components/common/SectionTitle";
import { BannerError } from "../components/common/BannerError";
import { Skeleton } from "../components/common/Skeleton";
import { API } from "../api";

// ── Sort header ───────────────────────────────────────────────────────────
function SortTh({
  label,
  col,
  sortKey,
  sortDir,
  onSort,
  align = "right",
  tip,
}) {
  const active = sortKey === col;
  return (
    <th
      title={tip}
      onClick={() => onSort(col)}
      className={`py-2 pr-3 font-semibold cursor-pointer select-none transition-colors whitespace-nowrap
        ${active ? "text-blue-600" : "text-gray-500 hover:text-gray-800"}
        ${align === "left" ? "text-left" : "text-right"}
      `}
    >
      <span className="inline-flex items-center gap-1">
        {align === "left" && label}
        {active ? (
          sortDir === "asc" ? (
            <ChevronUp size={11} />
          ) : (
            <ChevronDown size={11} />
          )
        ) : null}
        {align !== "left" && label}
      </span>
    </th>
  );
}

// ── Batting table ─────────────────────────────────────────────────────────
function BattingTable({ rows }) {
  const [sortKey, setSortKey] = useState("ab");
  const [sortDir, setSortDir] = useState("desc");

  const COLS = [
    { label: "Player", col: "player_name", align: "left", tip: "Player Name" },
    { label: "AB", col: "ab", tip: "At Bats" },
    { label: "R", col: "r", tip: "Runs Scored" },
    { label: "H", col: "h", tip: "Hits" },
    { label: "RBI", col: "rbi", tip: "Runs Batted In" },
    { label: "BB", col: "bb", tip: "Walks" },
    { label: "SO", col: "so", tip: "Strikeouts" },
  ];

  const handleSort = (col) => {
    if (sortKey === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(col);
      setSortDir(col === "player_name" ? "asc" : "desc");
    }
  };

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      if (sortKey === "player_name") {
        return sortDir === "asc"
          ? (a.player_name || "").localeCompare(b.player_name || "")
          : (b.player_name || "").localeCompare(a.player_name || "");
      }
      const av = parseFloat(a[sortKey] ?? -1);
      const bv = parseFloat(b[sortKey] ?? -1);
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  return (
    <div className="overflow-auto">
      <table className="min-w-[640px] text-sm w-full">
        <thead>
          <tr className="border-b">
            {COLS.map((c) => (
              <SortTh
                key={c.col}
                label={c.label}
                col={c.col}
                align={c.align}
                tip={c.tip}
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((b, i) => (
            <tr key={i} className="border-t hover:bg-blue-50 transition-colors">
              <td className="py-2 pr-3">
                {b.player_id ? (
                  <Link
                    to={`/players/${b.player_id}`}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    {b.player_name}
                  </Link>
                ) : (
                  <span className="font-semibold text-gray-800">
                    {b.player_name}
                  </span>
                )}
              </td>
              <td className="py-2 pr-3 text-right">{b.ab ?? "—"}</td>
              <td className="py-2 pr-3 text-right">{b.r ?? "—"}</td>
              <td className="py-2 pr-3 text-right">{b.h ?? "—"}</td>
              <td className="py-2 pr-3 text-right">{b.rbi ?? "—"}</td>
              <td className="py-2 pr-3 text-right">{b.bb ?? "—"}</td>
              <td className="py-2 pr-3 text-right">{b.so ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Pitching table ────────────────────────────────────────────────────────
function PitchingTable({ rows }) {
  const [sortKey, setSortKey] = useState("ip");
  const [sortDir, setSortDir] = useState("desc");

  const COLS = [
    {
      label: "Pitcher",
      col: "player_name",
      align: "left",
      tip: "Pitcher Name",
    },
    { label: "IP", col: "ip", tip: "Innings Pitched" },
    { label: "H", col: "h", tip: "Hits Allowed" },
    { label: "R", col: "r", tip: "Runs Allowed" },
    { label: "ER", col: "er", tip: "Earned Runs" },
    { label: "BB", col: "bb", tip: "Walks" },
    { label: "SO", col: "so", tip: "Strikeouts" },
  ];

  const handleSort = (col) => {
    if (sortKey === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(col);
      setSortDir(
        col === "player_name"
          ? "asc"
          : col === "er" || col === "r" || col === "h" || col === "bb"
            ? "asc"
            : "desc",
      );
    }
  };

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      if (sortKey === "player_name") {
        return sortDir === "asc"
          ? (a.player_name || "").localeCompare(b.player_name || "")
          : (b.player_name || "").localeCompare(a.player_name || "");
      }
      const av = parseFloat(a[sortKey] ?? -1);
      const bv = parseFloat(b[sortKey] ?? -1);
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  return (
    <div className="overflow-auto">
      <table className="min-w-[720px] text-sm w-full">
        <thead>
          <tr className="border-b">
            {COLS.map((c) => (
              <SortTh
                key={c.col}
                label={c.label}
                col={c.col}
                align={c.align}
                tip={c.tip}
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((p, i) => (
            <tr key={i} className="border-t hover:bg-blue-50 transition-colors">
              <td className="py-2 pr-3">
                {p.player_id ? (
                  <Link
                    to={`/players/${p.player_id}`}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    {p.player_name}
                  </Link>
                ) : (
                  <span className="font-semibold text-gray-800">
                    {p.player_name}
                  </span>
                )}
              </td>
              <td className="py-2 pr-3 text-right">{p.ip ?? "—"}</td>
              <td className="py-2 pr-3 text-right">{p.h ?? "—"}</td>
              <td className="py-2 pr-3 text-right">{p.r ?? "—"}</td>
              <td className="py-2 pr-3 text-right">{p.er ?? "—"}</td>
              <td className="py-2 pr-3 text-right">{p.bb ?? "—"}</td>
              <td className="py-2 pr-3 text-right">{p.so ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function ChampionshipFinal() {
  const { year } = useParams();
  const [params] = useSearchParams();
  const teamMode = (params.get("team") || "").toLowerCase();

  const [payload, setPayload] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setIsLoading(true);
      setErr(null);
      try {
        const url =
          teamMode === "runner_up"
            ? `/championships/${year}/final?team=runner_up`
            : `/championships/${year}/final`;

        const res = await API.get(url, {
          headers: { "Cache-Control": "no-store" },
        });

        if (!res.data?.success)
          throw new Error(res.data?.error || "Failed to load final stats");

        if (teamMode === "runner_up") {
          if (!ignore) setPayload(res.data);
          return;
        }

        let champTeamId = null,
          champTeamName = null;
        try {
          const champRes = await API.get(`/championships/${year}`, {
            headers: { "Cache-Control": "no-store" },
          });
          const c = champRes.data?.data || champRes.data || {};
          champTeamId =
            c.champion_team_id ||
            c.championTeamId ||
            c.champion_team?.id ||
            null;
          champTeamName =
            c.champion_name ||
            c.champion_team_name ||
            c.championTeamName ||
            c.champion_team?.name ||
            null;
        } catch (e) {
          /* render in API order */
        }

        const teams = Array.isArray(res.data?.data) ? [...res.data.data] : [];

        if (teams.length >= 2 && (champTeamId || champTeamName)) {
          const champNameLower = String(champTeamName || "")
            .toLowerCase()
            .trim();
          teams.sort((a, b) => {
            const aIsChamp =
              (champTeamId != null &&
                Number(a.team_id) === Number(champTeamId)) ||
              (champNameLower &&
                String(a.team_name || "")
                  .toLowerCase()
                  .trim() === champNameLower);
            const bIsChamp =
              (champTeamId != null &&
                Number(b.team_id) === Number(champTeamId)) ||
              (champNameLower &&
                String(b.team_name || "")
                  .toLowerCase()
                  .trim() === champNameLower);
            if (aIsChamp && !bIsChamp) return -1;
            if (!aIsChamp && bIsChamp) return 1;
            return 0;
          });
        }

        if (!ignore) setPayload({ ...res.data, data: teams });
      } catch (e) {
        if (!ignore) setErr(e?.message || "Failed to load final stats");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [year, teamMode]);

  const title =
    teamMode === "runner_up"
      ? `Runner-up Final Stats (${year})`
      : `Final Stats (${year})`;

  return (
    <Container className="py-12">
      <div className="mb-4">
        <Link
          to="/championships"
          className="text-sm text-blue-700 hover:underline"
        >
          ← Back to Championships
        </Link>
      </div>

      <SectionTitle
        eyebrow="Final"
        title={title}
        desc="Batting and pitching lines from the championship final. Click column headers to sort."
      />

      {err && (
        <div className="mb-4">
          <BannerError message={err} />
        </div>
      )}

      {isLoading ? (
        <Card>
          <CardBody>
            <Skeleton className="h-10 mb-3" />
            <Skeleton className="h-40 mb-3" />
            <Skeleton className="h-40" />
          </CardBody>
        </Card>
      ) : !payload?.data?.length ? (
        <Card>
          <CardBody>
            <p className="text-gray-600">
              No final stats available for this year.
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-6">
          {payload.data.map((team) => (
            <Card key={team.team_id}>
              <CardBody>
                <div className="flex items-center justify-between gap-3 mb-4">
                  {team.team_id ? (
                    <Link
                      to={`/teams/${team.team_id}`}
                      className="text-lg font-bold text-blue-600 hover:underline"
                    >
                      {team.team_name}
                    </Link>
                  ) : (
                    <h3 className="text-lg font-bold text-gray-900">
                      {team.team_name}
                    </h3>
                  )}
                  <div className="text-xs text-gray-500">
                    Year: {payload.meta?.year ?? year}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">
                      Batting
                    </h4>
                    <BattingTable rows={team.batting || []} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">
                      Pitching
                    </h4>
                    <PitchingTable rows={team.pitching || []} />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
