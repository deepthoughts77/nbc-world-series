// frontend/src/pages/ChampionshipMvp.js
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Container } from "../components/common/Container";
import { Card, CardBody } from "../components/common/Card";
import { SectionTitle } from "../components/common/SectionTitle";
import { BannerError } from "../components/common/BannerError";
import { Skeleton } from "../components/common/Skeleton";

const API = "http://localhost:5000/api";

function MvpBattingTable({ rows }) {
  if (!rows?.length)
    return <p className="text-sm text-gray-600">No batting lines found.</p>;

  return (
    <div className="overflow-auto">
      <table className="min-w-[900px] text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="py-2 pr-3">Player</th>
            <th className="py-2 pr-3">Team</th>
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
              <td className="py-2 pr-3">{b.team_name || "—"}</td>
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

function MvpPitchingTable({ rows }) {
  if (!rows?.length)
    return <p className="text-sm text-gray-600">No pitching lines found.</p>;

  return (
    <div className="overflow-auto">
      <table className="min-w-[900px] text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="py-2 pr-3">Pitcher</th>
            <th className="py-2 pr-3">Team</th>
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
              <td className="py-2 pr-3">{p.team_name || "—"}</td>
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

export default function ChampionshipMvp() {
  const { year } = useParams();

  const [payload, setPayload] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setIsLoading(true);
      setErr(null);

      try {
        const res = await fetch(`${API}/championships/${year}/mvp`, {
          cache: "no-store",
        });

        const json = await res.json();
        if (!json.success)
          throw new Error(json.error || "Failed to load MVP stats");

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
  }, [year]);

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
        eyebrow="MVP"
        title={`MVP (${year})`}
        desc="MVP detail and the best available stats snapshot."
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
            <Skeleton className="h-40" />
          </CardBody>
        </Card>
      ) : !payload?.data ? (
        <Card>
          <CardBody>
            <p className="text-gray-600">No MVP recorded for this year.</p>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody>
            <div className="mb-4">
              <div className="text-lg font-bold text-gray-900">
                {payload.data.mvp_name}
              </div>
              <div className="text-sm text-gray-600">
                Source: {payload.data.source}
              </div>
            </div>

            {payload.data.snapshot ? (
              <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-auto">
                {JSON.stringify(payload.data.snapshot, null, 2)}
              </pre>
            ) : (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">
                    Batting (final)
                  </h4>
                  <MvpBattingTable rows={payload.data.batting || []} />
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">
                    Pitching (final)
                  </h4>
                  <MvpPitchingTable rows={payload.data.pitching || []} />
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </Container>
  );
}
