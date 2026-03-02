// frontend/src/pages/ChampionshipFinal.js
import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Container } from "../components/common/Container";
import { Card, CardBody } from "../components/common/Card";
import { SectionTitle } from "../components/common/SectionTitle";
import { BannerError } from "../components/common/BannerError";
import { Skeleton } from "../components/common/Skeleton";
import { API } from "../api";

function BattingTable({ rows }) {
  return (
    <div className="overflow-auto">
      <table className="min-w-[720px] text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="py-2 pr-3">Player</th>
            <th className="py-2 pr-3">AB</th>
            <th className="py-2 pr-3">R</th>
            <th className="py-2 pr-3">H</th>
            <th className="py-2 pr-3">RBI</th>
            <th className="py-2 pr-3">BB</th>
            <th className="py-2 pr-3">SO</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((b, i) => (
            <tr key={i} className="border-t">
              <td className="py-2 pr-3">{b.player_name}</td>
              <td className="py-2 pr-3">{b.ab ?? "—"}</td>
              <td className="py-2 pr-3">{b.r ?? "—"}</td>
              <td className="py-2 pr-3">{b.h ?? "—"}</td>
              <td className="py-2 pr-3">{b.rbi ?? "—"}</td>
              <td className="py-2 pr-3">{b.bb ?? "—"}</td>
              <td className="py-2 pr-3">{b.so ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PitchingTable({ rows }) {
  return (
    <div className="overflow-auto">
      <table className="min-w-[820px] text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="py-2 pr-3">Pitcher</th>
            <th className="py-2 pr-3">IP</th>
            <th className="py-2 pr-3">H</th>
            <th className="py-2 pr-3">R</th>
            <th className="py-2 pr-3">ER</th>
            <th className="py-2 pr-3">BB</th>
            <th className="py-2 pr-3">SO</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p, i) => (
            <tr key={i} className="border-t">
              <td className="py-2 pr-3">{p.player_name}</td>
              <td className="py-2 pr-3">{p.ip ?? "—"}</td>
              <td className="py-2 pr-3">{p.h ?? "—"}</td>
              <td className="py-2 pr-3">{p.r ?? "—"}</td>
              <td className="py-2 pr-3">{p.er ?? "—"}</td>
              <td className="py-2 pr-3">{p.bb ?? "—"}</td>
              <td className="py-2 pr-3">{p.so ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ChampionshipFinal() {
  const { year } = useParams();
  const [params] = useSearchParams();
  const teamMode = (params.get("team") || "").toLowerCase(); // "runner_up" or ""

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

        // 1) final stats
        const res = await API.get(url, {
          headers: { "Cache-Control": "no-store" },
        });

        if (!res.data?.success) {
          throw new Error(res.data?.error || "Failed to load final stats");
        }

        // Runner-up mode: no sorting needed (usually one team returned)
        if (teamMode === "runner_up") {
          if (!ignore) setPayload(res.data);
          return;
        }

        // 2) championship summary (to know champion)
        let champTeamId = null;
        let champTeamName = null;

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
          // If this fails, we’ll just render in API order
        }

        const teams = Array.isArray(res.data?.data) ? [...res.data.data] : [];

        // Sort champion first (by id if available, else by name)
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

        const nextPayload = {
          ...res.data,
          data: teams,
        };

        if (!ignore) setPayload(nextPayload);
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
        desc="Batting and pitching lines from the championship final."
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
                  <h3 className="text-lg font-bold text-gray-900">
                    {team.team_name}
                  </h3>
                  <div className="text-xs text-gray-500">
                    Year: {payload.meta?.year ?? year}
                  </div>
                </div>

                <div className="space-y-5">
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
