import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, Medal, Award, Calendar, Search } from "lucide-react";
import { useChampionships } from "../hooks/useChampionships";
import { Container } from "../components/common/Container";
import { SectionTitle } from "../components/common/SectionTitle";
import { Card, CardBody } from "../components/common/Card";
import { BannerError } from "../components/common/BannerError";
import { Skeleton } from "../components/common/Skeleton";

function Row({ y }) {
  const year = y.year;

  return (
    <div className="border-b last:border-b-0 py-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-gray-900 text-white rounded-xl flex items-center justify-center font-bold">
            {year}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              {/* Champion -> final (both teams) */}
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                <Trophy className="w-4 h-4 text-yellow-500" />
                Champion:
              </span>
              <Link
                to={`/championships/${year}/final`}
                className="text-sm font-semibold text-gray-900 hover:underline"
              >
                {y.champion_name}
              </Link>

              {/* Runner-up -> final?team=runner_up */}
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 ml-2">
                <Medal className="w-4 h-4 text-gray-400" />
                Runner-up:
              </span>
              {y.runner_up_name ? (
                <Link
                  to={`/championships/${year}/final?team=runner_up`}
                  className="text-sm font-semibold text-gray-900 hover:underline"
                >
                  {y.runner_up_name}
                </Link>
              ) : (
                <span className="text-sm text-gray-500">—</span>
              )}

              {/* MVP -> mvp page */}
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 ml-2">
                <Award className="w-4 h-4 text-purple-500" />
                MVP:
              </span>
              {y.mvp ? (
                <Link
                  to={`/championships/${year}/mvp`}
                  className="text-sm font-semibold text-gray-900 hover:underline"
                >
                  {y.mvp}
                </Link>
              ) : (
                <span className="text-sm text-gray-500">Not awarded</span>
              )}
            </div>

            <div className="text-xs text-gray-500 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              {y.championship_score
                ? `Final: ${y.championship_score}`
                : "Final: —"}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/championships/${year}/final`}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            View Final Stats
          </Link>

          {y.mvp && (
            <Link
              to={`/championships/${year}/mvp`}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              View MVP
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Championships() {
  const { years, isLoading, isError, error } = useChampionships();

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const filteredYears = useMemo(() => {
    let filtered = [...years];

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter((y) => {
        const champion = (y.champion_name || "").toLowerCase();
        const runnerUp = (y.runner_up_name || "").toLowerCase();
        const mvp = (y.mvp || "").toLowerCase();
        const yearStr = String(y.year);
        return (
          champion.includes(q) ||
          runnerUp.includes(q) ||
          mvp.includes(q) ||
          yearStr.includes(q)
        );
      });
    }

    filtered.sort((a, b) => {
      if (sortOrder === "desc") return b.year - a.year;
      return a.year - b.year;
    });

    return filtered;
  }, [years, search, sortOrder]);

  return (
    <Container className="py-12">
      <SectionTitle
        eyebrow="Legacy"
        title="Championships"
        desc="Champions, runners-up, and MVPs. Click any item to view final stats or MVP details."
      />

      <Card className="mb-6">
        <CardBody className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[250px]">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Search
            </label>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by team, year, or MVP..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Sort
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </div>

          {(search || sortOrder !== "desc") && (
            <button
              onClick={() => {
                setSearch("");
                setSortOrder("desc");
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Reset
            </button>
          )}
        </CardBody>
      </Card>

      {isError && (
        <div className="mb-4">
          <BannerError message={error.message} />
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      ) : filteredYears.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-gray-600 text-center py-8">
              No championships found.
            </p>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody>
            <div className="divide-y">
              {filteredYears.map((y) => (
                <Row key={y.year} y={y} />
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </Container>
  );
}
