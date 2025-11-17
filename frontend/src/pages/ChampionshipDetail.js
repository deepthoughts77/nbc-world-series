import React from "react";
import { useParams, NavLink } from "react-router-dom";
import { Trophy, Star } from "lucide-react";
import { useChampionshipDetail } from "../hooks/useChampionshipDetail";
import { Container } from "../components/common/Container";
import { Card, CardBody } from "../components/common/Card";
import { BannerError } from "../components/common/BannerError";
import { Skeleton } from "../components/common/Skeleton";

export default function ChampionshipDetail() {
  const { year } = useParams();
  const { champ, loading, err } = useChampionshipDetail(year);

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
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          {champ.champion_name || champ.champion}
        </h1>
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
              <div className="flex justify-between">
                <span className="text-gray-600">Champion:</span>
                <span className="font-semibold">
                  {champ.champion_name || champ.champion}
                </span>
              </div>
              {(champ.runner_up_name || champ.runner_up) && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Runner-up:</span>
                  <span className="font-semibold">
                    {champ.runner_up_name || champ.runner_up}
                  </span>
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
            {champ.mvp ? (
              <div className="text-center py-4">
                <div className="text-2xl font-bold text-gray-900">
                  {champ.mvp}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {champ.champion_name || champ.champion}
                </div>
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
            The {champ.year} NBC World Series was held in Wichita, Kansas. The{" "}
            {champ.champion_name || champ.champion} from{" "}
            {champ.champion_city || champ.city}, {champ.state} claimed the
            championship title
            {champ.runner_up_name || champ.runner_up
              ? ` by defeating the ${champ.runner_up_name || champ.runner_up}`
              : ""}{" "}
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
