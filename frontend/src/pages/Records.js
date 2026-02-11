import React from "react";
import { Trophy, Users, Star, Calendar, Award } from "lucide-react";
import { useRecords } from "../hooks/useRecords";
import { Container } from "../components/common/Container";
import { SectionTitle } from "../components/common/SectionTitle";
import { Card, CardBody } from "../components/common/Card";
import { BannerError } from "../components/common/BannerError";
import { Skeleton } from "../components/common/Skeleton";

export default function Records() {
  const { records, loading, err } = useRecords();

  return (
    <Container className="py-12">
      <SectionTitle
        eyebrow="All-time"
        title="Records & Achievements"
        desc="Celebrating the greatest performances and milestones in NBC World Series history."
      />

      {err && (
        <div className="mb-6">
          <BannerError message={err} />
        </div>
      )}

      {loading || !records ? (
        <div className="space-y-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-96" />
          <Skeleton className="h-64" />
        </div>
      ) : (
        <>
          {/* All-Time Records Section */}
          <div className="mb-12">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Trophy className="text-yellow-500" size={28} />
                All-Time Records
              </h3>
              <p className="text-gray-600 mt-1">
                The most successful teams in tournament history
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Most Championships */}
              <Card className="overflow-hidden border-2 border-yellow-200">
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 border-b border-yellow-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center shadow-lg">
                      <Trophy className="text-white" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">
                        Most Championships
                      </h4>
                      <p className="text-sm text-gray-600">All-time leader</p>
                    </div>
                  </div>
                </div>
                <CardBody>
                  {records?.most_championships ? (
                    <div className="space-y-4">
                      <div className="flex items-baseline gap-3">
                        <div className="text-5xl font-black text-yellow-600">
                          {records.most_championships.championships}
                        </div>
                        <div className="text-xl text-gray-500">titles</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-900">
                          {records.most_championships.name}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {records.most_championships.city},{" "}
                          {records.most_championships.state}
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500">Dominance</div>
                            <div className="text-lg font-bold text-gray-900">
                              Legendary
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500">Era</div>
                            <div className="text-lg font-bold text-gray-900">
                              1935-2025
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Trophy className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500">
                        Championship data is being compiled
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Most Appearances */}
              <Card className="overflow-hidden border-2 border-blue-200">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 border-b border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
                      <Calendar className="text-white" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">
                        Most Appearances
                      </h4>
                      <p className="text-sm text-gray-600">
                        Tournament participation
                      </p>
                    </div>
                  </div>
                </div>
                <CardBody>
                  {records?.most_appearances ? (
                    <div className="space-y-4">
                      <div className="flex items-baseline gap-3">
                        <div className="text-5xl font-black text-blue-600">
                          {records.most_appearances.appearances}
                        </div>
                        <div className="text-xl text-gray-500">times</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-900">
                          {records.most_appearances.name}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Consistent excellence across decades
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500">Consistency</div>
                            <div className="text-lg font-bold text-gray-900">
                              Elite
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500">Status</div>
                            <div className="text-lg font-bold text-gray-900">
                              Perennial
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Calendar className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500">
                        Appearance data is being compiled
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Most MVP Awards (FIXED to match backend: { name, mvps }) */}
              <Card className="overflow-hidden border-2 border-purple-200">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 border-b border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center shadow-lg">
                      <Star className="text-white" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">
                        Most MVP Awards
                      </h4>
                      <p className="text-sm text-gray-600">Tournament MVPs</p>
                    </div>
                  </div>
                </div>

                <CardBody>
                  {records?.most_mvp_awards?.mvps ? (
                    <div className="space-y-4">
                      <div className="flex items-baseline gap-3">
                        <div className="text-5xl font-black text-purple-600">
                          {records.most_mvp_awards.mvps}
                        </div>
                        <div className="text-xl text-gray-500">MVPs</div>
                      </div>

                      <div>
                        <div className="text-xl font-bold text-gray-900">
                          {records.most_mvp_awards.name}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Outstanding individual performance
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="text-sm">
                          <div className="text-gray-500">Achievement</div>
                          <div className="text-lg font-bold text-gray-900">
                            Elite Performer
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Star className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="text-sm text-gray-600 px-4">
                        <p className="font-medium mb-1">Limited MVP data</p>
                        <p className="text-xs">
                          Only recent tournaments have MVP records
                        </p>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Tournament History */}
              <Card className="overflow-hidden border-2 border-green-200">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 border-b border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center shadow-lg">
                      <Users className="text-white" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">
                        Tournament History
                      </h4>
                      <p className="text-sm text-gray-600">Since 1935</p>
                    </div>
                  </div>
                </div>
                <CardBody>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Years Active:
                      </span>
                      <span className="font-bold text-gray-900 text-lg">
                        90 years
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Total Tournaments:
                      </span>
                      <span className="font-bold text-gray-900 text-lg">
                        {records?.total_tournaments || 89}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Location:
                      </span>
                      <span className="font-bold text-gray-900 text-lg">
                        Wichita, KS
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium">Status:</span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Active
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>

          {/* Modern Wood Era Records */}
          <div className="mb-12">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                2000-2025
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Modern Wood Era Records
              </h3>
              <p className="text-gray-600 mt-1">
                Outstanding achievements since the switch to wood bats
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardBody>
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-3">
                      <Award className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-bold text-blue-700 text-sm uppercase tracking-wide">
                      Highest Batting Average
                    </h4>
                  </div>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-black text-gray-900">
                      .750
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="font-bold text-gray-900">
                      Grant Nottlemann
                    </div>
                    <div className="text-sm text-gray-600">
                      Great Bend KS Bat Cats
                    </div>
                    <div className="text-xs text-gray-500">(2023)</div>
                    <div className="text-xs text-gray-400 mt-2">
                      5 GP • 12 H • 16 AB
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardBody>
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
                      <Star className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-bold text-green-700 text-sm uppercase tracking-wide">
                      Most Hits (Tournament)
                    </h4>
                  </div>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-black text-gray-900">19</div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="font-bold text-gray-900">Gavin Wehby</div>
                    <div className="text-sm text-gray-600">Liberal KS</div>
                    <div className="text-xs text-gray-500">(2015)</div>
                    <div className="text-xs text-gray-400 mt-2">
                      11 games played
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardBody>
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-3">
                      <Trophy className="w-6 h-6 text-orange-600" />
                    </div>
                    <h4 className="font-bold text-orange-700 text-sm uppercase tracking-wide">
                      Most RBIs (Tournament)
                    </h4>
                  </div>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-black text-gray-900">17</div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="font-bold text-gray-900">Gunnar Glad</div>
                    <div className="text-sm text-gray-600">
                      Anchorage AK Glacier Pilots
                    </div>
                    <div className="text-xs text-gray-500">(2009)</div>
                    <div className="text-xs text-gray-400 mt-2">
                      9 games played
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardBody>
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-3">
                      <Award className="w-6 h-6 text-red-600" />
                    </div>
                    <h4 className="font-bold text-red-700 text-sm uppercase tracking-wide">
                      Most Home Runs
                    </h4>
                  </div>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-black text-gray-900">4</div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="font-bold text-gray-900">Nolan Reimold</div>
                    <div className="text-sm text-gray-600">Hays KS Larks</div>
                    <div className="text-xs text-gray-500">(2004)</div>
                  </div>
                </CardBody>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardBody>
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-3">
                      <Star className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-bold text-purple-700 text-sm uppercase tracking-wide">
                      Most Strikeouts
                    </h4>
                  </div>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-black text-gray-900">27</div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="font-bold text-gray-900">Tommy Hanson</div>
                    <div className="text-sm text-gray-600">
                      Aloha OR Knights
                    </div>
                    <div className="text-xs text-gray-500">(2005)</div>
                  </div>
                </CardBody>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardBody>
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 mb-3">
                      <Users className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h4 className="font-bold text-yellow-700 text-sm uppercase tracking-wide">
                      Highest Team Batting Avg
                    </h4>
                  </div>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-black text-gray-900">
                      .379
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="font-bold text-gray-900">
                      San Diego CA Stars
                    </div>
                    <div className="text-xs text-gray-500">(2010)</div>
                    <div className="text-xs text-gray-400 mt-2">6 games</div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>

          {/* Tournament Milestones */}
          <div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Star className="text-yellow-500" size={24} />
                Tournament Milestones
              </h3>
              <p className="text-gray-600 mt-1">
                Celebrating 90 years of championship baseball
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center hover:shadow-lg transition-shadow border-2 border-gray-200">
                <CardBody className="p-8">
                  <div className="text-5xl font-black text-blue-600 mb-2">
                    1935
                  </div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    First Tournament
                  </div>
                  <div className="text-xs text-gray-500">
                    Duncan Cementers won the inaugural championship
                  </div>
                </CardBody>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow border-2 border-yellow-200 bg-yellow-50">
                <CardBody className="p-8">
                  <div className="text-5xl font-black text-yellow-600 mb-2">
                    2025
                  </div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    Latest Champion
                  </div>
                  <div className="text-xs text-gray-500">
                    Hutchinson Monarchs
                  </div>
                </CardBody>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow border-2 border-gray-200">
                <CardBody className="p-8">
                  <div className="text-5xl font-black text-green-600 mb-2">
                    ~45K
                  </div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    2024 Attendance
                  </div>
                  <div className="text-xs text-gray-500">
                    Total fans across all games
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </>
      )}
    </Container>
  );
}
