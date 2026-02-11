// frontend/src/pages/Home.js
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Trophy,
  Users,
  Star,
  Calendar,
  Search,
  Award,
  Medal,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { API } from "../api/apiClient";
import { fmt } from "../utils/formatters";
import { useHome } from "../hooks/useHome";
import { Container } from "../components/common/Container";
import { Card, CardBody } from "../components/common/Card";
import { BannerError } from "../components/common/BannerError";
import { Skeleton } from "../components/common/Skeleton";

export default function Home() {
  // Data from our hook
  const { stats, recent, loading, err } = useHome();

  // NEW: records overview (so Home matches Records page)
  const [recordsOverview, setRecordsOverview] = useState(null);
  const [recordsErr, setRecordsErr] = useState("");

  useEffect(() => {
    let stop = false;

    API.get("/records/overview")
      .then((r) => {
        if (stop) return;
        setRecordsOverview(r.data);
      })
      .catch((e) => {
        console.error("[Home] Failed to load /records/overview", e);
        if (!stop) setRecordsErr("Could not load records overview.");
      });

    return () => {
      stop = true;
    };
  }, []);

  // Local view state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Local logic
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSearchError("");
    setSearchResults(null);

    try {
      const response = await API.post("/search/ask", { question: searchQuery });
      const payload = response?.data ?? {};

      console.log("=== HOME.JS RECEIVED ===");
      console.log("Full response:", payload);
      console.log("Answer:", payload.answer);
      console.log("Data:", payload.data);
      console.log("Message:", payload.message);
      console.log("Results:", payload.results);

      setSearchResults(payload);
    } catch (error) {
      console.error("Search error:", error);
      setSearchError("Search failed. Please try again.");
      setSearchResults(null);
    } finally {
      setSearching(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const nextTournament = currentYear + 1;

  // Use recordsOverview for "Most championships" so it matches Records page
  const mostChampsCount =
    recordsOverview?.most_championships?.championships != null
      ? `${recordsOverview.most_championships.championships}x`
      : null;

  const mostChampsName = recordsOverview?.most_championships?.name ?? null;

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <Container className="py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-white/20">
              <Trophy size={18} className="text-yellow-300" />
              <span>Since 1935 • Wichita, Kansas</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-none">
              91 Years of
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                Championship Baseball
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              America's premier amateur baseball tournament.
              <br className="hidden md:block" />
              Where legends are made and champions are crowned.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <NavLink
                to="/championships"
                className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold rounded-xl text-lg shadow-2xl hover:shadow-yellow-500/50 transition-all hover:scale-105 inline-flex items-center gap-2"
              >
                <Trophy size={20} />
                View All Champions
              </NavLink>

              <NavLink
                to="/teams"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl text-lg border-2 border-white/30 hover:border-white/50 transition-all inline-flex items-center gap-2"
              >
                <Users size={20} />
                Explore Teams
              </NavLink>
            </div>
          </div>
        </Container>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <>
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </>
            ) : (
              <>
                <Card className="hover:shadow-xl transition-shadow border-l-4 border-l-yellow-500">
                  <CardBody className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-7 h-7 text-yellow-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-black text-gray-900">
                        {fmt(stats?.total_championships ?? 0)}
                      </div>
                      <div className="text-sm font-medium text-gray-600 mt-1">
                        Championships
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        1935 - 2025
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card className="hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
                  <CardBody className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Users className="w-7 h-7 text-green-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-black text-gray-900">
                        {fmt(stats?.total_teams || 0)}
                      </div>
                      <div className="text-sm font-medium text-gray-600 mt-1">
                        Participating Teams
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        From across America
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card className="hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
                  <CardBody className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Star className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-black text-gray-900">
                        800+
                      </div>
                      <div className="text-sm font-medium text-gray-600 mt-1">
                        MLB Players
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Started here
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* FIXED: Most championships now comes from /records/overview */}
                <Card className="hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
                  <CardBody className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Award className="w-7 h-7 text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-2xl font-black text-gray-900">
                        {mostChampsCount ?? "—"}
                      </div>
                      <div className="text-sm font-medium text-gray-600 mt-1 truncate">
                        {mostChampsName ?? "—"}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Most championships
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </>
            )}
          </div>

          {(err || recordsErr) && (
            <div className="mt-6">
              <BannerError message={err || recordsErr} />
            </div>
          )}
        </Container>
      </section>

      {/* Recent Champions */}
      <section className="py-16">
        <Container>
          <div className="text-center mb-12">
            <div className="inline-block text-xs tracking-widest uppercase font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full mb-3">
              Latest Winners
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">
              Recent Champions
            </h2>
            <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
              Celebrating the teams that claimed the title in the last three
              tournaments
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {recent.map((r) => (
                <Card
                  key={r.year}
                  className="group hover:shadow-2xl transition-all hover:-translate-y-2 relative overflow-hidden"
                >
                  <div className="absolute top-4 right-4 w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-black text-lg">
                      {r.year}
                    </span>
                  </div>

                  <CardBody className="pt-24">
                    <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center mb-4 mx-auto">
                      <Trophy className="w-8 h-8 text-yellow-600" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                      {r.champion_name || r.champion}
                    </h3>

                    {(r.champion_city || r.city) && (
                      <p className="text-sm text-gray-600 text-center mb-4">
                        {r.champion_city || r.city},{" "}
                        {r.champion_state || r.state}
                      </p>
                    )}

                    <div className="border-t border-gray-200 my-4" />

                    <div className="space-y-2 text-sm">
                      {(r.runner_up_name || r.runner_up) && (
                        <div className="flex items-start gap-2">
                          <Medal className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-gray-500 text-xs">
                              Runner-up:
                            </span>
                            <p className="text-gray-700 font-medium">
                              {r.runner_up_name || r.runner_up}
                            </p>
                          </div>
                        </div>
                      )}

                      {r.mvp && (
                        <div className="flex items-start gap-2">
                          <Award className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-gray-500 text-xs">MVP:</span>
                            <p className="text-gray-700 font-medium">{r.mvp}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <NavLink
                      to={`/championships/${r.year}`}
                      className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm"
                    >
                      View Full Details
                      <ChevronRight size={16} />
                    </NavLink>
                  </CardBody>
                </Card>
              ))}

              {!recent.length && (
                <div className="col-span-3 text-center text-gray-600 py-12">
                  No recent results available.
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-10">
            <NavLink
              to="/championships"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-lg group"
            >
              View Complete Championship History
              <ChevronRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </NavLink>
          </div>
        </Container>
      </section>

      {/* Tournament Info Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block text-xs tracking-widest uppercase font-semibold text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full mb-4">
                Tournament Info
              </div>
              <h2 className="text-4xl font-extrabold mb-6">
                Join Baseball's
                <br />
                Premier Event
              </h2>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                The NBC World Series brings together the finest amateur baseball
                talent from across America. Held annually in Wichita, Kansas,
                this prestigious tournament has launched over 800 professional
                careers since 1935.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Next Tournament</div>
                    <div className="text-gray-400">
                      July 24 - August 2, {nextTournament}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">
                      16 Teams Compete
                    </div>
                    <div className="text-gray-400">
                      Top amateur teams nationwide
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">
                      10 Days of Baseball
                    </div>
                    <div className="text-gray-400">
                      Pool play + single elimination
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold mb-6">Tournament Legacy</h3>
              <div className="space-y-6">
                <div>
                  <div className="text-4xl font-black text-yellow-400 mb-2">
                    800+
                  </div>
                  <div className="text-gray-300">
                    Alumni reached the Major Leagues
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-black text-yellow-400 mb-2">
                    45,000+
                  </div>
                  <div className="text-gray-300">Fans attend annually</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-yellow-400 mb-2">
                    Legends
                  </div>
                  <div className="text-gray-300">
                    Satchel Paige • Roger Clemens • Barry Bonds • Albert Pujols
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-xs font-semibold mb-4 uppercase tracking-wide">
                Tournament Database Search
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Search Championship History
              </h2>
              <p className="text-gray-600 text-lg">
                Query 91 years of tournament data, records, and statistics
              </p>
            </div>

            <Card className="shadow-xl border-2 border-gray-300">
              <CardBody>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="relative">
                    <Search
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter your question about NBC World Series history..."
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-base"
                      disabled={searching}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={searching || !searchQuery.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-lg transition-colors text-base shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    {searching ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search size={18} />
                        Search Database
                      </>
                    )}
                  </button>
                </form>

                {searchError && (
                  <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle
                        className="text-red-600 flex-shrink-0 mt-0.5"
                        size={20}
                      />
                      <div>
                        <p className="font-semibold text-red-900 text-sm">
                          Search Error
                        </p>
                        <p className="text-red-700 text-sm mt-1">
                          {searchError}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {searchResults && searchResults.answer && (
                  <div className="mt-6 p-6 bg-white border-2 border-green-200 rounded-lg">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-md bg-green-600 flex items-center justify-center">
                        <Trophy className="text-white" size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg">
                          Search Results
                        </h3>
                        <p className="text-sm text-gray-700 mt-2">
                          {searchResults.answer}
                        </p>
                      </div>
                    </div>

                    {/* Championship Details */}
                    {searchResults.data &&
                      !Array.isArray(searchResults.data) &&
                      searchResults.data.champion_name && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-xs text-gray-500 mb-1">
                                Champion
                              </div>
                              <div className="font-bold text-lg text-gray-900">
                                {searchResults.data.champion_name}
                              </div>
                              {searchResults.data.champion_city && (
                                <div className="text-sm text-gray-600">
                                  {searchResults.data.champion_city},{" "}
                                  {searchResults.data.champion_state}
                                </div>
                              )}
                            </div>

                            {searchResults.data.runner_up_name && (
                              <div>
                                <div className="text-xs text-gray-500 mb-1">
                                  Runner-up
                                </div>
                                <div className="font-semibold text-gray-900">
                                  {searchResults.data.runner_up_name}
                                </div>
                              </div>
                            )}

                            {searchResults.data.mvp && (
                              <div>
                                <div className="text-xs text-gray-500 mb-1">
                                  MVP
                                </div>
                                <div className="font-semibold text-gray-900">
                                  {searchResults.data.mvp}
                                </div>
                              </div>
                            )}

                            {searchResults.data.championship_score && (
                              <div>
                                <div className="text-xs text-gray-500 mb-1">
                                  Final Score
                                </div>
                                <div className="font-semibold text-gray-900">
                                  {searchResults.data.championship_score}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                    {/* Leaderboard Results */}
                    {searchResults.results &&
                      Array.isArray(searchResults.results) &&
                      searchResults.results.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-900 mb-3">
                            {searchResults.message}
                          </h4>
                          <div className="space-y-2">
                            {searchResults.results.map((player, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                              >
                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                                  {idx + 1}
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900">
                                    {player.first_name} {player.last_name}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {player.team_name}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </CardBody>
            </Card>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">90+</div>
                <div className="text-xs text-gray-600 mt-1 font-medium">
                  Years of History
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">800+</div>
                <div className="text-xs text-gray-600 mt-1 font-medium">
                  MLB Alumni
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 text-center">
                <div className="text-2xl font-bold text-purple-600">178</div>
                <div className="text-xs text-gray-600 mt-1 font-medium">
                  Teams
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Search through championship records, player statistics, team
                histories, and tournament milestones
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
