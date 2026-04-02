// frontend/src/pages/ChampionshipMvp.js
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Container } from "../components/common/Container";
import { Card, CardBody } from "../components/common/Card";
import { SectionTitle } from "../components/common/SectionTitle";
import { BannerError } from "../components/common/BannerError";
import { Skeleton } from "../components/common/Skeleton";
import { API } from "../api/apiClient";

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
              <td className="py-2 pr-3">
                {b.team_id ? (
                  <Link
                    to={`/teams/${b.team_id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {b.team_name || "—"}
                  </Link>
                ) : (
                  b.team_name || "—"
                )}
              </td>
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
              <td className="py-2 pr-3">
                {p.team_id ? (
                  <Link
                    to={`/teams/${p.team_id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {p.team_name || "—"}
                  </Link>
                ) : (
                  p.team_name || "—"
                )}
              </td>
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

  // Try to resolve the MVP's player_id from the players table
  const [mvpPlayerId, setMvpPlayerId] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setIsLoading(true);
      setErr(null);
      setMvpPlayerId(null);

      try {
        const res = await API.get(`/championships/${year}/mvp`, {
          headers: { "Cache-Control": "no-store" },
        });

        if (!res.data?.success) {
          throw new Error(res.data?.error || "Failed to load MVP stats");
        }

        if (!ignore) setPayload(res.data);

        // Try to find the player_id by searching their name
        const mvpName = res.data?.data?.mvp_name;
        if (mvpName && !ignore) {
          try {
            const searchRes = await API.get("/players/search", {
              params: { q: mvpName },
            });
            const matches = Array.isArray(searchRes.data) ? searchRes.data : [];
            // Find exact or closest name match
            const exact = matches.find(
              (p) => p.full_name.toLowerCase() === mvpName.toLowerCase(),
            );
            const best = exact || matches[0];
            if (best?.id && !ignore) setMvpPlayerId(best.id);
          } catch {
            /* silently skip — player link is optional */
          }
        }
      } catch (e) {
        if (!ignore) setErr(e?.message || "Failed to load MVP stats");
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
            <div className="mb-6">
              {/* Clickable MVP name */}
              {mvpPlayerId ? (
                <Link
                  to={`/players/${mvpPlayerId}`}
                  className="text-xl font-bold text-blue-600 hover:underline"
                >
                  {payload.data.mvp_name}
                </Link>
              ) : (
                <div className="text-xl font-bold text-gray-900">
                  {payload.data.mvp_name}
                </div>
              )}
              {mvpPlayerId && (
                <Link
                  to={`/players/${mvpPlayerId}`}
                  className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 hover:bg-blue-100 transition-colors"
                >
                  View Full Player Profile →
                </Link>
              )}
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
