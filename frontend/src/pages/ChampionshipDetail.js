// frontend/src/pages/ChampionshipDetail.js
import React, { useEffect, useState } from "react";
import { useParams, NavLink, Link } from "react-router-dom";
import { Trophy, Star } from "lucide-react";
import { useChampionshipDetail } from "../hooks/useChampionshipDetail";
import { Container } from "../components/common/Container";
import { Card, CardBody } from "../components/common/Card";
import { BannerError } from "../components/common/BannerError";
import { Skeleton } from "../components/common/Skeleton";
import { API } from "../api";

export default function ChampionshipDetail() {
  const { year } = useParams();
  const { champ, loading, err } = useChampionshipDetail(year);

  // Resolve IDs for linking
  const [championId, setChampionId] = useState(null);
  const [runnerUpId, setRunnerUpId] = useState(null);
  const [mvpPlayerId, setMvpPlayerId] = useState(null);

  useEffect(() => {
    if (!champ) return;

    // Resolve champion team ID
    const champName = champ.champion_name || champ.champion;
    if (champ.champion_team_id) {
      setChampionId(champ.champion_team_id);
    } else if (champName) {
      API.get(`/teams/by-name/${encodeURIComponent(champName)}`)
        .then((r) => {
          const t = r.data?.team ?? r.data;
          if (t?.id) setChampionId(t.id);
        })
        .catch(() => {});
    }

    // Resolve runner-up team ID
    const ruName = champ.runner_up_name || champ.runner_up;
    if (champ.runner_up_team_id) {
      setRunnerUpId(champ.runner_up_team_id);
    } else if (ruName) {
      API.get(`/teams/by-name/${encodeURIComponent(ruName)}`)
        .then((r) => {
          const t = r.data?.team ?? r.data;
          if (t?.id) setRunnerUpId(t.id);
        })
        .catch(() => {});
    }

    // Resolve MVP player ID
    const mvpName = champ.mvp;
    if (champ.mvp_player_id) {
      setMvpPlayerId(champ.mvp_player_id);
    } else if (mvpName) {
      API.get("/players/search", { params: { q: mvpName } })
        .then((r) => {
          const matches = Array.isArray(r.data) ? r.data : [];
          const exact = matches.find(
            (p) => p.full_name.toLowerCase() === mvpName.toLowerCase(),
          );
          const best = exact || matches[0];
          if (best?.id) setMvpPlayerId(best.id);
        })
        .catch(() => {});
    }
  }, [champ]);

  if (loading) {
    return (
      <Container className="py-12">
        <Skeleton className="h-64" />
      </Container>
    );
  }

  if (err || !champ) {
    return (
      <Container className="py-12">
        <BannerError message={err || "Championship not found"} />
      </Container>
    );
  }

  const champName = champ.champion_name || champ.champion;
  const ruName = champ.runner_up_name || champ.runner_up;
  const mvpName = champ.mvp;

  return (
    <Container className="py-12">
      <div className="mb-6">
        <NavLink
          to="/championships"
          className="text-blue-600 hover:underline flex items-center gap-2"
        >
          ← Back to Championships
        </NavLink>
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold mb-4">
          <Trophy size={16} /> {champ.year} Champion
        </div>

        {/* Clickable champion name in hero */}
        {championId ? (
          <Link
            to={`/teams/${championId}`}
            className="block hover:opacity-80 transition-opacity"
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-blue-700 hover:underline">
              {champName}
            </h1>
          </Link>
        ) : (
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            {champName}
          </h1>
        )}

        <p className="mt-2 text-gray-600">
          {champ.champion_city || champ.city}, {champ.state}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardBody>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Trophy className="text-yellow-600" size={20} />
              Championship Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Year:</span>
                <span className="font-semibold">{champ.year}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Champion:</span>
                {championId ? (
                  <Link
                    to={`/teams/${championId}`}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    {champName}
                  </Link>
                ) : (
                  <span className="font-semibold">{champName}</span>
                )}
              </div>

              {ruName && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Runner-up:</span>
                  {runnerUpId ? (
                    <Link
                      to={`/teams/${runnerUpId}`}
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      {ruName}
                    </Link>
                  ) : (
                    <span className="font-semibold">{ruName}</span>
                  )}
                </div>
              )}

              {champ.championship_score && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Final Score:</span>
                  <span className="font-semibold text-blue-600">
                    {champ.championship_score}
                  </span>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Star className="text-blue-600" size={20} />
              Tournament MVP
            </h3>
            {mvpName ? (
              <div className="text-center py-4">
                {mvpPlayerId ? (
                  <Link
                    to={`/players/${mvpPlayerId}`}
                    className="block hover:opacity-80 transition-opacity"
                  >
                    <div className="text-2xl font-bold text-blue-600 hover:underline">
                      {mvpName}
                    </div>
                  </Link>
                ) : (
                  <div className="text-2xl font-bold text-gray-900">
                    {mvpName}
                  </div>
                )}
                <div className="text-sm text-gray-600 mt-1">{champName}</div>
                {mvpPlayerId && (
                  <Link
                    to={`/players/${mvpPlayerId}`}
                    className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 hover:bg-blue-100 transition-colors"
                  >
                    View Player Profile →
                  </Link>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                MVP information not available
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody>
          <h3 className="text-lg font-bold mb-4">
            About the {champ.year} Tournament
          </h3>
          <p className="text-gray-700 leading-relaxed">
            The {champ.year} NBC World Series was held in Wichita, Kansas.{" "}
            {championId ? (
              <Link
                to={`/teams/${championId}`}
                className="font-semibold text-blue-600 hover:underline"
              >
                {champName}
              </Link>
            ) : (
              <span className="font-semibold">{champName}</span>
            )}{" "}
            from {champ.champion_city || champ.city}, {champ.state} claimed the
            championship title
            {ruName ? (
              <>
                {" "}
                by defeating{" "}
                {runnerUpId ? (
                  <Link
                    to={`/teams/${runnerUpId}`}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    {ruName}
                  </Link>
                ) : (
                  <span className="font-semibold">{ruName}</span>
                )}
              </>
            ) : (
              ""
            )}{" "}
            {champ.championship_score
              ? `with a final score of ${champ.championship_score}`
              : ""}
            .
          </p>
        </CardBody>
      </Card>
    </Container>
  );
}
