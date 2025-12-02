import React, { useMemo, useState } from "react";
import { Trophy, Calendar, Search, Award, Medal } from "lucide-react";
import { useChampionships } from "../hooks/useChampionships";
import { Container } from "../components/common/Container";
import { SectionTitle } from "../components/common/SectionTitle";
import { Card, CardBody } from "../components/common/Card";
import { BannerError } from "../components/common/BannerError";
import { Skeleton } from "../components/common/Skeleton";

// This sub-component must use the correct property names
function ChampionshipCard({ data }) {
  //
  // THE FIX:
  // Use 'champion_name', 'runner_up_name', 'mvp', etc.
  // These now match the backend controller exactly.
  //
  const {
    year,
    champion_name,
    runner_up_name,
    mvp,
    championship_score,
    champion_city,
    champion_state,
  } = data;

  const isCOVID = year === 2020;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardBody>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex flex-col items-center justify-center text-white shadow-lg">
              <span className="text-2xl font-bold">{year}</span>
              {isCOVID && (
                <span className="text-[9px] uppercase tracking-wide opacity-80">
                  COVID
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Champion
                </span>
              </div>
              <p className="text-base font-bold text-gray-900">
                {champion_name}
              </p>
              {champion_city && champion_state && (
                <p className="text-xs text-gray-500">
                  {champion_city}, {champion_state}
                </p>
              )}
              {championship_score && (
                <p className="text-xs text-blue-600 font-medium mt-1">
                  Final: {championship_score}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Medal className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Runner-up
                </span>
              </div>
              <p className="text-base font-semibold text-gray-700">
                {runner_up_name || "—"}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Award className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  MVP
                </span>
              </div>
              <p className="text-base font-semibold text-gray-700">
                {mvp ? (
                  mvp
                ) : (
                  <span className="text-gray-400 italic text-sm">
                    Not awarded
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default function Championships() {
  // This hook now returns { years, isLoading, isError, error }
  const { years, isLoading, isError, error } = useChampionships();

  const [search, setSearch] = useState("");
  const [decadeFilter, setDecadeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  const filteredYears = useMemo(() => {
    let filtered = [...years];

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter((y) => {
        // Use the correct property names for searching
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

    if (decadeFilter !== "all") {
      const decade = parseInt(decadeFilter, 10);
      filtered = filtered.filter((y) => {
        const yearNum = parseInt(y.year, 10);
        return yearNum >= decade && yearNum < decade + 10;
      });
    }

    filtered.sort((a, b) => {
      if (sortOrder === "desc") {
        return b.year - a.year;
      } else {
        return a.year - b.year;
      }
    });

    return filtered;
  }, [years, search, decadeFilter, sortOrder]);

  const decades = useMemo(() => {
    const set = new Set();
    years.forEach((y) => {
      const decade = Math.floor(y.year / 10) * 10;
      set.add(decade);
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [years]);

  const stats = useMemo(() => {
    const championCounts = {};
    years.forEach((y) => {
      // Use the correct property name
      const champ = y.champion_name || "Unknown";
      championCounts[champ] = (championCounts[champ] || 0) + 1;
    });

    const sorted = Object.entries(championCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      totalYears: years.length,
      topChampions: sorted,
    };
  }, [years]);

  return (
    <Container className="py-12">
      <SectionTitle
        eyebrow="Legacy"
        title="Championships History"
        desc="Complete record of NBC World Series champions, runners-up, and MVP awards from 1935 to present."
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Total Tournaments
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.totalYears}
                </p>
              </div>
              <Trophy className="w-10 h-10 text-yellow-500" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Most Championships
                </p>
                {stats.topChampions[0] && (
                  <>
                    <p className="text-lg font-bold text-gray-900 mt-1 leading-tight">
                      {stats.topChampions[0][0]}
                    </p>
                    <p className="text-xs text-gray-500">
                      {stats.topChampions[0][1]} titles
                    </p>
                  </>
                )}
              </div>
              <Award className="w-10 h-10 text-blue-500" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Years Covered
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  1935-2025
                </p>
              </div>
              <Calendar className="w-10 h-10 text-green-500" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Filtered Results
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {filteredYears.length}
                </p>
              </div>
              <Search className="w-10 h-10 text-purple-500" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Controls */}
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
                placeholder="Search by team, year, or MVP name..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Decade
            </label>
            <select
              value={decadeFilter}
              onChange={(e) => setDecadeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All decades</option>
              {decades.map((d) => (
                <option key={d} value={d}>
                  {d}s
                </option>
              ))}
            </select>
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

          {(search || decadeFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setDecadeFilter("all");
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Clear filters
            </button>
          )}
        </CardBody>
      </Card>

      {/* Use the new error state from the hook */}
      {isError && (
        <div className="mb-4">
          <BannerError message={error.message} />
        </div>
      )}

      {/* Use the new loading state from the hook */}
      {isLoading ? (
        <div className="grid gap-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      ) : filteredYears.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-gray-600 text-center py-8">
              No championships found matching your filters.
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredYears.map((yearData) => (
            <ChampionshipCard key={yearData.year} data={yearData} />
          ))}
          <div className="text-center text-sm text-gray-500 mt-4">
            Showing {filteredYears.length} of {years.length} championships
          </div>
        </div>
      )}

      {!search && decadeFilter === "all" && (
        <Card className="mt-8">
          <CardBody>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Most Championships
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {stats.topChampions.map(([team, count], idx) => (
                <div
                  key={team}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-700">
                      {idx + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {team}
                    </p>
                    <p className="text-xs text-gray-500">
                      {count} {count === 1 ? "title" : "titles"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </Container>
  );
}
