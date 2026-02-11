// frontend/src/pages/ChampionshipFinal.js
import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Container } from "../components/common/Container";
import { Card, CardBody } from "../components/common/Card";
import { SectionTitle } from "../components/common/SectionTitle";
import { BannerError } from "../components/common/BannerError";
import { Skeleton } from "../components/common/Skeleton";

const API = "http://localhost:5000/api";

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
  const teamMode = params.get("team"); // "runner_up" or null

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
            ? `${API}/championships/${year}/final?team=runner_up`
            : `${API}/championships/${year}/final`;

        const res = await fetch(url, { cache: "no-store" });
        const json = await res.json();

        if (!json.success)
          throw new Error(json.error || "Failed to load final stats");

        if (!ignore) setPayload(json);
      } catch (e) {
        if (!ignore) setErr(e.message);
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
                    Year: {payload.meta?.year}
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
