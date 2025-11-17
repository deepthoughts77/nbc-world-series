import React, { useMemo, useState } from "react";
import { Trophy, Users, Star, Search, Award } from "lucide-react";
import { useHallOfFame } from "../hooks/useHallOfFame";
import { Container } from "../components/common/Container";
import { SectionTitle } from "../components/common/SectionTitle";
import { Card, CardBody } from "../components/common/Card";
import { BannerError } from "../components/common/BannerError";
import { Skeleton } from "../components/common/Skeleton";

export default function HallOfFame() {
  const { members, loading, err } = useHallOfFame();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("year-desc");

  // Filter and sort members
  const filteredMembers = useMemo(() => {
    let result = [...members];

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter(
        (m) => (m.category || "").toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Search filter
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter((m) =>
        (m.inductee_name || m.name || "").toLowerCase().includes(term)
      );
    }

    // Sort
    result.sort((a, b) => {
      const yearA = a.induction_year || 0;
      const yearB = b.induction_year || 0;
      const nameA = (a.inductee_name || a.name || "").toLowerCase();
      const nameB = (b.inductee_name || b.name || "").toLowerCase();

      switch (sortBy) {
        case "year-desc":
          return yearB - yearA || nameA.localeCompare(nameB);
        case "year-asc":
          return yearA - yearB || nameA.localeCompare(nameB);
        case "name":
          return nameA.localeCompare(nameB);
        default:
          return 0;
      }
    });

    return result;
  }, [members, categoryFilter, search, sortBy]);

  // Calculate stats by category
  const stats = useMemo(() => {
    const byCategory = {
      Player: 0,
      Coach: 0,
      Contributor: 0,
    };

    members.forEach((m) => {
      const cat = m.category || "Contributor";
      if (byCategory[cat] !== undefined) {
        byCategory[cat]++;
      } else {
        // Handle unexpected categories if any
        byCategory.Contributor++;
      }
    });

    const recentYears = [...members]
      .sort((a, b) => (b.induction_year || 0) - (a.induction_year || 0))
      .slice(0, 5);

    return {
      total: members.length,
      byCategory,
      recent: recentYears,
    };
  }, [members]);

  return (
    <Container className="py-12">
      <SectionTitle
        eyebrow="Legacy"
        title="Hall of Fame"
        desc="Honoring the legends who shaped the NBC World Series through exceptional performance, leadership, and dedication."
      />

      {/* Hero Stats Section */}
      <div className="mb-10">
        <Card className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white overflow-hidden">
          <CardBody className="p-8">
            <div className="grid md:grid-cols-4 gap-6">
              {/* Total Members */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Star size={32} className="text-yellow-400" />
                </div>
                <div className="text-4xl font-black mb-1">{stats.total}</div>
                <div className="text-sm text-gray-300">Total Inductees</div>
              </div>

              {/* Players */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Users size={28} className="text-blue-400" />
                </div>
                <div className="text-4xl font-black mb-1">
                  {stats.byCategory.Player}
                </div>
                <div className="text-sm text-gray-300">Players</div>
              </div>

              {/* Coaches */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Award size={28} className="text-green-400" />
                </div>
                <div className="text-4xl font-black mb-1">
                  {stats.byCategory.Coach}
                </div>
                <div className="text-sm text-gray-300">Coaches</div>
              </div>

              {/* Contributors */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Trophy size={28} className="text-purple-400" />
                </div>
                <div className="text-4xl font-black mb-1">
                  {stats.byCategory.Contributor}
                </div>
                <div className="text-sm text-gray-300">Contributors</div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardBody className="flex flex-wrap gap-4 items-end">
          {/* Search */}
          <div className="flex-1 min-w-[250px]">
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Search Inductees
            </label>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all"
                placeholder="Search by name..."
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 border-2 border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 bg-white cursor-pointer transition-all"
            >
              <option value="all">All Categories</option>
              <option value="Player">Players</option>
              <option value="Coach">Coaches</option>
              <option value="Contributor">Contributors</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border-2 border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 bg-white cursor-pointer transition-all"
            >
              <option value="year-desc">Newest First</option>
              <option value="year-asc">Oldest First</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(search || categoryFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setCategoryFilter("all");
              }}
              className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all font-medium"
            >
              Clear Filters
            </button>
          )}
        </CardBody>
      </Card>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing <strong>{filteredMembers.length}</strong> of{" "}
        <strong>{stats.total}</strong> inductees
      </div>

      {err && (
        <div className="mb-4">
          <BannerError message={err} />
        </div>
      )}

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      ) : filteredMembers.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member, idx) => {
            const name = member.inductee_name || member.name || "Unknown";
            const year = member.induction_year || "—";
            const category = member.category || "Contributor";
            const bio = member.bio || "";

            // Category color coding
            const categoryStyles = {
              Player: {
                bg: "bg-blue-50",
                border: "border-blue-200",
                text: "text-blue-700",
                icon: Users,
              },
              Coach: {
                bg: "bg-green-50",
                border: "border-green-200",
                text: "text-green-700",
                icon: Award,
              },
              Contributor: {
                bg: "bg-purple-50",
                border: "border-purple-200",
                text: "text-purple-700",
                icon: Trophy,
              },
            };

            const style =
              categoryStyles[category] || categoryStyles.Contributor;
            const Icon = style.icon;

            return (
              <Card
                key={member.id ?? `${name}-${idx}`}
                className="hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden group"
              >
                {/* Header with year badge */}
                <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 p-5 text-white relative">
                  {/* Year Badge */}
                  <div className="absolute top-4 right-4 w-14 h-14 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg">
                    <span className="text-gray-900 font-black text-sm">
                      {year}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-3">
                    <Star size={24} className="text-yellow-400" />
                  </div>

                  {/* Name */}
                  <h3 className="text-xl font-bold leading-tight pr-16">
                    {name}
                  </h3>
                </div>

                {/* Body */}
                <CardBody>
                  {/* Category Badge */}
                  <div className="mb-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${style.bg} ${style.border} ${style.text} border`}
                    >
                      <Icon size={12} />
                      {category}
                    </span>
                  </div>

                  {/* Bio */}
                  {bio ? (
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                      {bio}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      Inducted into the NBC World Series Hall of Fame in {year}.
                    </p>
                  )}

                  {/* Induction Year Footer */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Inducted</span>
                      <span className="text-gray-900 font-bold">{year}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
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
              No inductees found
            </h3>
            <p className="text-gray-600 mb-4">
              {search
                ? `No members match "${search}"`
                : "No members in this category"}
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCategoryFilter("all");
              }}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium transition-colors"
            >
              Clear Filters
            </button>
          </CardBody>
        </Card>
      )}

      {/* Recent Inductees Highlight */}
      {!search && categoryFilter === "all" && stats.recent.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Star className="text-yellow-500" size={24} />
            Recent Inductees
          </h3>
          <Card>
            <CardBody>
              <div className="space-y-3">
                {stats.recent.map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                        <Star size={18} className="text-yellow-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {m.inductee_name || m.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {m.category || "Contributor"}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-gray-600">
                      {m.induction_year}
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </Container>
  );
}
