import React, { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Trophy,
  Users,
  Calendar,
  Search,
  Award,
  ChevronRight,
} from "lucide-react";

// FIX: Correctly imports the hook from its new file
import { useTeams } from "../hooks/useTeams";
import { Container } from "../components/common/Container";
import { SectionTitle } from "../components/common/SectionTitle";
import { Card, CardBody } from "../components/common/Card";
import { BannerError } from "../components/common/BannerError";
import { Skeleton } from "../components/common/Skeleton";

// FIX: Added 'export default' to work with App.js React.lazy
export default function Teams() {
  // FIX: This one line replaces all the old data-fetching code
  const { teams, loading, err } = useTeams();

  // View-state logic stays in the component
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let result = teams;

    if (term) {
      result = teams.filter((t) => {
        const name = (t.name || "").toLowerCase();
        const city = (t.city || "").toLowerCase();
        const state = (t.state || "").toLowerCase();
        return (
          name.includes(term) || city.includes(term) || state.includes(term)
        );
      });
    }

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "championships":
          return (
            (Number(b.championships_won) || 0) -
            (Number(a.championships_won) || 0)
          );
        case "appearances":
          return (Number(b.appearances) || 0) - (Number(a.appearances) || 0);
        case "name":
        default:
          return (a.name || "").localeCompare(b.name || "");
      }
    });

    return result;
  }, [q, teams, sortBy]);

  const stats = useMemo(() => {
    const totalChampionships = teams.reduce(
      (sum, t) => sum + (Number(t.championships_won) || 0),
      0
    );
    const totalAppearances = teams.reduce(
      (sum, t) => sum + (Number(t.appearances) || 0),
      0
    );
    const topTeam = [...teams].sort(
      (a, b) =>
        (Number(b.championships_won) || 0) - (Number(a.championships_won) || 0)
    )[0];

    return {
      totalTeams: teams.length,
      totalChampionships,
      totalAppearances,
      topTeam,
    };
  }, [teams]);

  return (
    <Container className="py-12">
      <SectionTitle
        eyebrow="Clubs"
        title="Tournament Teams"
        desc="Explore all teams that have competed in the NBC World Series throughout history."
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-l-4 border-l-gray-400">
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalTeams}
                </div>
                <div className="text-xs text-gray-600">Total Teams</div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalChampionships}
                </div>
                <div className="text-xs text-gray-600">Championships</div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-gray-500">
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalAppearances}
                </div>
                <div className="text-xs text-gray-600">Total Appearances</div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-yellow-600">
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900 leading-tight truncate">
                  {stats.topTeam?.name || "—"}
                </div>
                <div className="text-xs text-gray-600">
                  {stats.topTeam?.championships_won || 0}x Champion
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardBody className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[300px]">
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Search Teams
            </label>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all"
                placeholder="Search by team name, city, or state..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border-2 border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 bg-white cursor-pointer transition-all"
            >
              <option value="name">Team Name (A-Z)</option>
              <option value="championships">Most Championships</option>
              <option value="appearances">Most Appearances</option>
            </select>
          </div>

          {q && (
            <button
              onClick={() => setQ("")}
              className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all font-medium"
            >
              Clear Search
            </button>
          )}
        </CardBody>
      </Card>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing <strong>{filtered.length}</strong>{" "}
        {filtered.length === 1 ? "team" : "teams"}
        {q && <span> matching "{q}"</span>}
      </div>

      {err && (
        <div className="mb-4">
          <BannerError message={err} />
        </div>
      )}

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : filtered.length ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t, idx) => {
            const slug = encodeURIComponent(t.name);
            const champCount = Number(t.championships_won) || 0;
            const appearCount = Number(t.appearances) || 0;

            return (
              <NavLink
                key={t.id ?? `${t.name}-${idx}`}
                to={`/teams/${slug}`}
                className="block group"
              >
                <Card className="h-full hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden">
                  <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 p-5 text-white">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold leading-tight group-hover:underline">
                          {t.name}
                        </h3>
                      </div>
                      <ChevronRight
                        size={20}
                        className="flex-shrink-0 mt-0.5 transform group-hover:translate-x-1 transition-transform text-gray-300"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-300 text-sm">
                      <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                      <span>
                        {t.city || "—"}, {t.state || "—"}
                      </span>
                    </div>
                  </div>

                  <CardBody>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center justify-center mb-1">
                          <Trophy className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div className="text-2xl font-bold text-yellow-700">
                          {champCount}
                        </div>
                        <div className="text-xs text-yellow-600 font-medium">
                          {champCount === 1 ? "Championship" : "Championships"}
                        </div>
                      </div>

                      <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-center mb-1">
                          <Calendar className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="text-2xl font-bold text-gray-700">
                          {appearCount}
                        </div>
                        <div className="text-xs text-gray-600 font-medium">
                          {appearCount === 1 ? "Appearance" : "Appearances"}
                        </div>
                      </div>
                    </div>

                    {appearCount > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 font-medium">
                            Win Rate
                          </span>
                          <span className="text-gray-900 font-bold">
                            {((champCount / appearCount) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full transition-all"
                            style={{
                              width: `${(champCount / appearCount) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </NavLink>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardBody className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No teams found
            </h3>
            <p className="text-gray-600">
              No teams match "{q}". Try searching with different keywords.
            </p>
            <button
              onClick={() => setQ("")}
              className="mt-4 px-6 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium transition-colors"
            >
              Clear Search
            </button>
          </CardBody>
        </Card>
      )}
    </Container>
  );
}
