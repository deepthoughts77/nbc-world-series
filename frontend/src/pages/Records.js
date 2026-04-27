import React, { useState } from "react";
import {
  Trophy,
  Users,
  Star,
  Calendar,
  Award,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useRecords } from "../hooks/useRecords";
import { Container } from "../components/common/Container";
import { SectionTitle } from "../components/common/SectionTitle";
import { Card, CardBody } from "../components/common/Card";
import { BannerError } from "../components/common/BannerError";
import { Skeleton } from "../components/common/Skeleton";

// ── Home runs by tournament (1939–2025) ───────────────────────────────────
const HR_BY_YEAR = [
  { year: 1939, total: 19, topTeam: "Duncan OK", topHr: 6 },
  { year: 1940, total: 23, topTeam: "Houston TX", topHr: 7 },
  { year: 1941, total: 17, topTeam: "Buford GA", topHr: 5 },
  { year: 1942, total: 20, topTeam: "Waco TX", topHr: 4 },
  { year: 1943, total: 16, topTeam: "Wichita KS", topHr: 4 },
  { year: 1944, total: 3, topTeam: "Sherman Field KS", topHr: 1 },
  { year: 1945, total: 7, topTeam: "Kearns Field UT", topHr: 2 },
  { year: 1946, total: 20, topTeam: "Norman OK", topHr: 4 },
  { year: 1947, total: 14, topTeam: "St. Joseph MI", topHr: 3 },
  { year: 1948, total: 11, topTeam: "Conroe TX", topHr: 2 },
  { year: 1949, total: 17, topTeam: "Golden CO", topHr: 5 },
  { year: 1950, total: 20, topTeam: "St. Joseph MI", topHr: 5 },
  { year: 1951, total: 31, topTeam: "Sinton TX", topHr: 6 },
  { year: 1952, total: 34, topTeam: "Ft. Ord CA", topHr: 7 },
  { year: 1953, total: 58, topTeam: "Ft. Leonard Wood MO", topHr: 14 },
  { year: 1954, total: 47, topTeam: "Springfield MO", topHr: 12 },
  { year: 1955, total: 35, topTeam: "Wichita KS", topHr: 10 },
  { year: 1956, total: 42, topTeam: "Ft. Wayne IN", topHr: 8 },
  { year: 1957, total: 45, topTeam: "Ft. Wayne IN", topHr: 7 },
  { year: 1958, total: 52, topTeam: "Alpine TX", topHr: 11 },
  { year: 1959, total: 53, topTeam: "Elgin IL", topHr: 9 },
  { year: 1960, total: 47, topTeam: "Grand Rapids MI", topHr: 10 },
  { year: 1961, total: 38, topTeam: "Eureka CA", topHr: 6 },
  { year: 1962, total: 56, topTeam: "Wichita (Rapid Transit) KS", topHr: 10 },
  { year: 1963, total: 37, topTeam: "Fairbanks AK", topHr: 6 },
  { year: 1964, total: 50, topTeam: "Fairbanks AK", topHr: 10 },
  { year: 1965, total: 62, topTeam: "Liberal KS", topHr: 8 },
  { year: 1966, total: 76, topTeam: "Boulder CO", topHr: 13 },
  { year: 1967, total: 54, topTeam: "Chicago IL", topHr: 7 },
  { year: 1968, total: 71, topTeam: "Liberal KS", topHr: 10 },
  { year: 1969, total: 46, topTeam: "Fairbanks AK", topHr: 7 },
  { year: 1970, total: 62, topTeam: "Liberal KS", topHr: 8 },
  { year: 1971, total: 72, topTeam: "Fairbanks AK", topHr: 9 },
  { year: 1972, total: 48, topTeam: "Eureka CA", topHr: 7 },
  { year: 1973, total: 49, topTeam: "Liberal KS", topHr: 7 },
  { year: 1974, total: 46, topTeam: "Liberal KS", topHr: 12 },
  { year: 1975, total: 32, topTeam: "Wichita KS Coors", topHr: 4 },
  { year: 1976, total: 62, topTeam: "Eureka CA", topHr: 6 },
  { year: 1977, total: 86, topTeam: "Kenai AK", topHr: 9 },
  { year: 1978, total: 131, topTeam: "Boulder CO", topHr: 15 },
  { year: 1979, total: 159, topTeam: "Clarinda IA", topHr: 13 },
  { year: 1980, total: 140, topTeam: "Fairbanks AK", topHr: 16 },
  { year: 1981, total: 95, topTeam: "Liberal KS", topHr: 10 },
  { year: 1982, total: 145, topTeam: "Anchorage AK", topHr: 17 },
  { year: 1983, total: 85, topTeam: "Grand Rapids MI", topHr: 14 },
  { year: 1984, total: 99, topTeam: "Anchorage AK", topHr: 13 },
  { year: 1985, total: 80, topTeam: "Santa Maria CA", topHr: 7 },
  { year: 1986, total: 99, topTeam: "Anchorage AK", topHr: 7 },
  { year: 1987, total: 104, topTeam: "Wichita KS Broncos", topHr: 14 },
  { year: 1988, total: 143, topTeam: "Midlothian IL", topHr: 20 },
  { year: 1989, total: 52, topTeam: "Grand Rapids MI", topHr: 9 },
  { year: 1990, total: 148, topTeam: "Midlothian IL", topHr: 28 },
  { year: 1991, total: 83, topTeam: "Kenai AK", topHr: 21 },
  { year: 1992, total: 64, topTeam: "Midlothian IL", topHr: 27 },
  { year: 1993, total: 104, topTeam: "Wichita KS Broncos", topHr: 11 },
  { year: 1994, total: 171, topTeam: "Anchorage AK", topHr: 16 },
  { year: 1995, total: 178, topTeam: "USA National Team", topHr: 18 },
  { year: 1996, total: 201, topTeam: "El Dorado KS", topHr: 13 },
  { year: 1997, total: 149, topTeam: "Prairie Gravel IL", topHr: 14 },
  { year: 1998, total: 84, topTeam: "Nevada MO", topHr: 11 },
  { year: 1999, total: 133, topTeam: "San Diego CA", topHr: 14 },
  // Modern Wood Era
  { year: 2000, total: 54, topTeam: "Prairie Gravel IL", topHr: 5 },
  { year: 2001, total: 28, topTeam: "Five teams", topHr: 2 },
  { year: 2002, total: 76, topTeam: "Anchorage AK", topHr: 5 },
  { year: 2003, total: 39, topTeam: "Prairie Gravel IL", topHr: 4 },
  { year: 2004, total: 51, topTeam: "Hays KS", topHr: 5 },
  { year: 2005, total: 35, topTeam: "Prairie Gravel IL", topHr: 4 },
  { year: 2006, total: 44, topTeam: "Crestwood IL", topHr: 4 },
  { year: 2007, total: 57, topTeam: "Havasu AZ", topHr: 11 },
  { year: 2008, total: 36, topTeam: "Santa Barbara CA", topHr: 8 },
  { year: 2009, total: 15, topTeam: "Anchorage AK", topHr: 3 },
  { year: 2010, total: 58, topTeam: "Santa Barbara CA", topHr: 11 },
  { year: 2011, total: 15, topTeam: "Kenai AK", topHr: 3 },
  { year: 2012, total: 13, topTeam: "St. Joseph MO", topHr: 2 },
  { year: 2013, total: 8, topTeam: "San Diego Force CA", topHr: 2 },
  { year: 2014, total: 10, topTeam: "Hays KS", topHr: 2 },
  { year: 2015, total: 34, topTeam: "Liberal KS", topHr: 7 },
  { year: 2016, total: 26, topTeam: "Santa Barbara CA", topHr: 3 },
  { year: 2017, total: 18, topTeam: "Cheney KS", topHr: 4 },
  { year: 2018, total: 37, topTeam: "Santa Barbara CA", topHr: 6 },
  { year: 2019, total: 15, topTeam: "Derby KS", topHr: 3 },
  { year: 2020, total: 40, topTeam: "Santa Barbara CA", topHr: 9 },
  { year: 2021, total: 45, topTeam: "Hays KS", topHr: 8 },
  { year: 2022, total: 27, topTeam: "Santa Barbara CA", topHr: 7 },
  { year: 2023, total: 22, topTeam: "Hutchinson KS", topHr: 5 },
  { year: 2024, total: 18, topTeam: "Santa Barbara CA", topHr: 3 },
  { year: 2025, total: 26, topTeam: "Dallas Lonestar Kraken TX", topHr: 2 },
];

// ── No-hitters list ───────────────────────────────────────────────────────
const NO_HITTERS = [
  {
    year: 1939,
    pitcher: "Abe White & Les Munns",
    team: "Buford GA",
    opponent: "Fairmount ND",
    score: "18–2",
    innings: 7,
  },
  {
    year: 1939,
    pitcher: "Lou Kretlow",
    team: "Enid OK",
    opponent: "Altus OK",
    score: "8–0",
    innings: 7,
  },
  {
    year: 1950,
    pitcher: "Pat Hubert",
    team: "Sinton TX",
    opponent: "Worland WY",
    score: "6–0",
    innings: 9,
  },
  {
    year: 1950,
    pitcher: "Edward Correa",
    team: "Honolulu HI",
    opponent: "Jeffersontown KY",
    score: "12–0",
    innings: 5,
  },
  {
    year: 1951,
    pitcher: "Mike Blyzka",
    team: "Sinton TX",
    opponent: "Camp Pickett VA",
    score: "5–0",
    innings: 9,
  },
  {
    year: 1952,
    pitcher: "Tom Brewer",
    team: "Camp Atterbury IN",
    opponent: "Offutt AFB",
    score: "13–0",
    innings: 5,
  },
  {
    year: 1954,
    pitcher: "James Graham",
    team: "Chicago IL",
    opponent: "Virgin Islands",
    score: "8–0",
    innings: 7,
  },
  {
    year: 1954,
    pitcher: "Ken Hemphill",
    team: "Wichita (Boeing) KS",
    opponent: "Nellis NV AFB",
    score: "4–0",
    innings: 9,
  },
  {
    year: 1955,
    pitcher: "Bill Kezman",
    team: "Milwaukee WI",
    opponent: "Johnstown NY",
    score: "9–0",
    innings: 7,
  },
  {
    year: 1955,
    pitcher: "Junior Turner",
    team: "Columbia TN",
    opponent: "McGill NV",
    score: "9–0",
    innings: 8,
  },
  {
    year: 1955,
    pitcher: "Raymond Tucker",
    team: "Dennis MA",
    opponent: "Great Falls MT",
    score: "12–0",
    innings: 5,
  },
  {
    year: 1958,
    pitcher: "Jack Kralick",
    team: "Grand Rapids (Sullivans) MI",
    opponent: "Grand Rapids (Slagboom) MI",
    score: "4–0",
    innings: 9,
  },
  {
    year: 1958,
    pitcher: "Parnell Hisner",
    team: "Anderson IN",
    opponent: "Grand Rapids (Slagboom) MI",
    score: "6–0",
    innings: null,
  },
  {
    year: 1961,
    pitcher: "Elmer Smith",
    team: "Ponchatoula LA",
    opponent: "Marmet WV",
    score: "11–0",
    innings: null,
  },
  {
    year: 1961,
    pitcher: "Dave Benedict",
    team: "Ogallala NE",
    opponent: "Denver CO",
    score: "7–0",
    innings: null,
  },
  {
    year: 1962,
    pitcher: "Dick Stewart",
    team: "Greensboro NC",
    opponent: "New Washington OH",
    score: "15–0",
    innings: null,
  },
  {
    year: 1962,
    pitcher: "Jim Hadley",
    team: "Wichita (Rapid Transit) KS",
    opponent: "Sedalia MO",
    score: "11–0",
    innings: null,
  },
  {
    year: 1963,
    pitcher: "George Coleman & Rich Cook",
    team: "Everett WA",
    opponent: "Edinburg TX",
    score: "9–1",
    innings: 7,
  },
  {
    year: 1964,
    pitcher: "Ron Hubbard",
    team: "Wichita (Service Auto Glass) KS",
    opponent: "Brandon NE",
    score: "6–0",
    innings: 7,
  },
  {
    year: 1964,
    pitcher: "Tom Seaver & Mike Paul",
    team: "Fairbanks AK",
    opponent: "Brandon NE",
    score: "6–0",
    innings: 7,
  },
  {
    year: 1964,
    pitcher: "Cecil Robinson",
    team: "Greensboro NC",
    opponent: "Nassau, Bahamas",
    score: "10–0",
    innings: 7,
  },
  {
    year: 1965,
    pitcher: "Bob Warren",
    team: "Indianapolis IN",
    opponent: "Nassau, Bahamas",
    score: "8–0",
    innings: 7,
  },
  {
    year: 1966,
    pitcher: "Gordon Nevers & Jerry Sevile",
    team: "Minneapolis MN",
    opponent: "Albuquerque NM",
    score: "12–0",
    innings: 5,
  },
  {
    year: 1967,
    pitcher: "Edward Williams",
    team: "Liberal KS",
    opponent: "Las Cruces NM",
    score: "8–0",
    innings: 7,
  },
  {
    year: 1969,
    pitcher: "Kenny Rousell",
    team: "Garyville LA",
    opponent: "Albuquerque NM",
    score: "6–0",
    innings: 8,
  },
  {
    year: 1971,
    pitcher: "Wayne Piper",
    team: "Garland NE",
    opponent: "Lawton OK",
    score: "16–0",
    innings: 5,
  },
  {
    year: 1972,
    pitcher: "Ray Reteneller",
    team: "Ocala FL",
    opponent: "Kokomo IN",
    score: "3–0",
    innings: 9,
  },
  {
    year: 1975,
    pitcher: "Mark Thorpe",
    team: "Mansfield OH",
    opponent: "Charleston WV",
    score: "12–2",
    innings: 7,
  },
  {
    year: 1978,
    pitcher: "Dan Fischer",
    team: "El Dorado (Coors) KS",
    opponent: "Oklahoma City OK",
    score: "6–0",
    innings: 8,
  },
  {
    year: 1983,
    pitcher: "Dan Durst & Andy Ghelfi",
    team: "Madison (A's) WI",
    opponent: "Winston-Salem NC",
    score: "4–0",
    innings: 9,
  },
  {
    year: 1990,
    pitcher: "Jim Yanko",
    team: "Anchorage (Glacier Pilots) AK",
    opponent: "Clarinda IA",
    score: "11–0",
    innings: 5,
  },
  {
    year: 1993,
    pitcher: "Ritchie Juarez",
    team: "Fresno CA",
    opponent: "Beatrice NE",
    score: "10–0",
    innings: 6,
    note: "Perfect game",
  },
  // Modern Wood Era
  {
    year: 2001,
    pitcher: "Eric Human",
    team: "North County CA",
    opponent: "Elkhart IN",
    score: "2–0",
    innings: 9,
    era: true,
  },
  {
    year: 2001,
    pitcher: "Seth Hill",
    team: "Prairie Gravel IL",
    opponent: "Clarinda IA",
    score: "4–1",
    innings: 9,
    era: true,
  },
  {
    year: 2016,
    pitcher: "Jonathan Groff & Jarrett Montgomery",
    team: "NJCAA National Team",
    opponent: "Sterling CO Xpress",
    score: "10–0",
    innings: 6,
    era: true,
  },
  {
    year: 2020,
    pitcher: "Sean Johnson, Coleman Huntley III, Peyton Palette, Elijah Trest",
    team: "Santa Barbara CA",
    opponent: "Liberal KS",
    score: "8–0",
    innings: null,
    era: true,
  },
  {
    year: 2021,
    pitcher: "Christian Peters, Jared Billen, Anthony Brady",
    team: "Seattle WA",
    opponent: "Wichita (316 Elite) KS",
    score: "14–0",
    innings: 5,
    era: true,
  },
  {
    year: 2021,
    pitcher: "Nathan Medrano",
    team: "Austin Lonestar TX",
    opponent: "Cheney KS",
    score: "8–0",
    innings: 7,
    era: true,
  },
  {
    year: 2023,
    pitcher: "Austin Wagner & Walker Emmons",
    team: "Denver CO",
    opponent: "SC KS Blues",
    score: "11–0",
    innings: 5,
    note: "Perfect game",
    era: true,
  },
  {
    year: 2023,
    pitcher: "Ben Bybee & Robert Cranz",
    team: "Santa Barbara CA",
    opponent: "Denver CO",
    score: null,
    innings: null,
    era: true,
  },
];

const MAX_HR = Math.max(...HR_BY_YEAR.map((d) => d.total));

export default function Records() {
  const { records, loading, err } = useRecords();
  const [hrEra, setHrEra] = useState("all");
  const [showAllNH, setShowAllNH] = useState(false);

  const hrFiltered =
    hrEra === "modern" ? HR_BY_YEAR.filter((d) => d.year >= 2000) : HR_BY_YEAR;

  const nhFiltered = showAllNH ? NO_HITTERS : NO_HITTERS.slice(-15);

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
          {/* ── All-Time Records ──────────────────────────────────── */}
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
                              1935–2025
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Championship data is being compiled
                    </div>
                  )}
                </CardBody>
              </Card>

              <Card className="overflow-hidden border-2 border-blue-200">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 border-b border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
                      <Calendar className="text-white" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">
                        Most Finals Appearances
                      </h4>
                      <p className="text-sm text-gray-600">
                        Championship game appearances
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
                        <div className="text-xl text-gray-500">finals</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-900">
                          {records.most_appearances.name}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Consistent excellence across decades
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Appearance data is being compiled
                    </div>
                  )}
                </CardBody>
              </Card>

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
                    </div>
                  ) : (
                    <div className="text-center py-8">
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
                    {[
                      ["Years Active", "90+ years"],
                      ["Total Tournaments", records?.total_tournaments || "—"],
                      ["Location", "Wichita, KS"],
                    ].map(([label, val]) => (
                      <div
                        key={label}
                        className="flex justify-between items-center py-2 border-b border-gray-100"
                      >
                        <span className="text-gray-600 font-medium">
                          {label}:
                        </span>
                        <span className="font-bold text-gray-900 text-lg">
                          {val}
                        </span>
                      </div>
                    ))}
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

          {/* ── Home Runs by Tournament ───────────────────────────── */}
          <div className="mb-12">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span style={{ fontSize: 24 }}>💣</span> Home Runs by
                  Tournament
                </h3>
                <p className="text-gray-600 mt-1">
                  Total home runs hit each year · Record: 201 in 1996
                </p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  ["all", "All Years (1939–2025)"],
                  ["modern", "Wood Era (2000–2025)"],
                ].map(([v, l]) => (
                  <button
                    key={v}
                    onClick={() => setHrEra(v)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 6,
                      border: "1px solid",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      background: hrEra === v ? "#1F2937" : "#F9FAFB",
                      color: hrEra === v ? "#FFFFFF" : "#374151",
                      borderColor: hrEra === v ? "#1F2937" : "#E5E7EB",
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <Card>
              <CardBody style={{ padding: "16px 0 8px" }}>
                {/* Bar chart */}
                <div style={{ overflowX: "auto" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 3,
                      height: 160,
                      padding: "0 16px 0",
                      minWidth: hrFiltered.length * 14,
                    }}
                  >
                    {hrFiltered.map((d) => {
                      const height = Math.max(
                        4,
                        Math.round((d.total / MAX_HR) * 140),
                      );
                      const isModern = d.year >= 2000;
                      const isPeak = d.total === MAX_HR;
                      return (
                        <div
                          key={d.year}
                          title={`${d.year}: ${d.total} HR (top: ${d.topTeam} ${d.topHr})`}
                          style={{
                            flex: "0 0 auto",
                            width: hrFiltered.length > 60 ? 10 : 14,
                            height,
                            background: isPeak
                              ? "#DC2626"
                              : isModern
                                ? "#2563EB"
                                : "#D97706",
                            borderRadius: "2px 2px 0 0",
                            cursor: "pointer",
                            transition: "opacity 0.15s",
                            opacity: 0.85,
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.opacity = "1")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.opacity = "0.85")
                          }
                        />
                      );
                    })}
                  </div>

                  {/* Year labels — show every 5th */}
                  <div
                    style={{
                      display: "flex",
                      gap: 3,
                      padding: "4px 16px 0",
                      minWidth: hrFiltered.length * 14,
                      borderTop: "1px solid #F3F4F6",
                    }}
                  >
                    {hrFiltered.map((d, i) => (
                      <div
                        key={d.year}
                        style={{
                          flex: "0 0 auto",
                          width: hrFiltered.length > 60 ? 10 : 14,
                          fontSize: 8,
                          color: d.year % 5 === 0 ? "#6B7280" : "transparent",
                          textAlign: "center",
                          userSelect: "none",
                        }}
                      >
                        {d.year}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    padding: "12px 16px 4px",
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    { color: "#D97706", label: "Pre-Wood Era (1939–1999)" },
                    { color: "#2563EB", label: "Wood Era (2000–2025)" },
                    {
                      color: "#DC2626",
                      label: "Record: 201 HR (1996, El Dorado KS)",
                    },
                  ].map(({ color, label }) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 11,
                        color: "#6B7280",
                      }}
                    >
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 2,
                          background: color,
                          flexShrink: 0,
                        }}
                      />
                      {label}
                    </div>
                  ))}
                </div>

                {/* Top 10 table */}
                <div
                  style={{
                    padding: "12px 16px 0",
                    borderTop: "1px solid #F3F4F6",
                    marginTop: 8,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#6B7280",
                      marginBottom: 8,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Top Years by Home Runs
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{
                        width: "100%",
                        fontSize: 12,
                        borderCollapse: "collapse",
                      }}
                    >
                      <thead>
                        <tr style={{ background: "#F9FAFB" }}>
                          {["Year", "Total HR", "Top Team", "Team HR"].map(
                            (h) => (
                              <th
                                key={h}
                                style={{
                                  padding: "6px 10px",
                                  textAlign: "left",
                                  fontWeight: 700,
                                  color: "#6B7280",
                                  borderBottom: "1px solid #E5E7EB",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {h}
                              </th>
                            ),
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {[...HR_BY_YEAR]
                          .sort((a, b) => b.total - a.total)
                          .slice(0, 10)
                          .map((d, i) => (
                            <tr
                              key={d.year}
                              style={{
                                background: i % 2 === 0 ? "#FFFFFF" : "#F9FAFB",
                              }}
                            >
                              <td
                                style={{
                                  padding: "6px 10px",
                                  fontWeight: 700,
                                  fontFamily: "monospace",
                                }}
                              >
                                {d.year}
                              </td>
                              <td
                                style={{
                                  padding: "6px 10px",
                                  fontWeight: 900,
                                  color: "#D97706",
                                }}
                              >
                                {d.total}
                              </td>
                              <td
                                style={{
                                  padding: "6px 10px",
                                  color: "#374151",
                                }}
                              >
                                {d.topTeam}
                              </td>
                              <td
                                style={{
                                  padding: "6px 10px",
                                  color: "#6B7280",
                                }}
                              >
                                {d.topHr}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* ── Modern Wood Era Records ───────────────────────────── */}
          <div className="mb-12">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                2000–2025
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Modern Wood Era Records
              </h3>
              <p className="text-gray-600 mt-1">
                Outstanding achievements since the switch to wood bats
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  color: "blue",
                  icon: <Award className="w-6 h-6 text-blue-600" />,
                  label: "Highest Batting Average",
                  value: ".750",
                  name: "Grant Nottlemann",
                  team: "Great Bend Bat Cats",
                  year: 2023,
                  note: "5 GP · 12 H · 16 AB",
                },
                {
                  color: "green",
                  icon: <Star className="w-6 h-6 text-green-600" />,
                  label: "Most Hits (Tournament)",
                  value: "19",
                  name: "Gavin Wehby",
                  team: "Liberal Bee Jays",
                  year: 2015,
                  note: "11 games played",
                },
                {
                  color: "orange",
                  icon: <Trophy className="w-6 h-6 text-orange-600" />,
                  label: "Most RBIs (Tournament)",
                  value: "17",
                  name: "Gunnar Glad",
                  team: "Anchorage Glacier Pilots",
                  year: 2009,
                  note: "9 games played",
                },
                {
                  color: "red",
                  icon: <Award className="w-6 h-6 text-red-600" />,
                  label: "Most Home Runs",
                  value: "4",
                  name: "Nolan Reimold",
                  team: "Hays Larks",
                  year: 2004,
                },
                {
                  color: "purple",
                  icon: <Star className="w-6 h-6 text-purple-600" />,
                  label: "Most Strikeouts",
                  value: "27",
                  name: "Tommy Hanson",
                  team: "Aloha Knights",
                  year: 2005,
                },
                {
                  color: "yellow",
                  icon: <Users className="w-6 h-6 text-yellow-600" />,
                  label: "Highest Team Batting Avg",
                  value: ".379",
                  name: "San Diego Stars",
                  team: null,
                  year: 2010,
                  note: "6 games",
                },
              ].map(({ color, icon, label, value, name, team, year, note }) => (
                <Card key={label} className="hover:shadow-lg transition-shadow">
                  <CardBody>
                    <div className="text-center mb-4">
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-${color}-100 mb-3`}
                      >
                        {icon}
                      </div>
                      <h4
                        className={`font-bold text-${color}-700 text-sm uppercase tracking-wide`}
                      >
                        {label}
                      </h4>
                    </div>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-black text-gray-900">
                        {value}
                      </div>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="font-bold text-gray-900">{name}</div>
                      {team && (
                        <div className="text-sm text-gray-600">{team}</div>
                      )}
                      <div className="text-xs text-gray-500">({year})</div>
                      {note && (
                        <div className="text-xs text-gray-400 mt-2">{note}</div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

          {/* ── No-Hitters ────────────────────────────────────────── */}
          <div className="mb-12">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span style={{ fontSize: 24 }}>⚾</span> No-Hit Games
              </h3>
              <p className="text-gray-600 mt-1">
                Every no-hitter in NBC World Series history ·{" "}
                {NO_HITTERS.length} total
              </p>
            </div>

            <Card>
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    fontSize: 13,
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#1F2937" }}>
                      {[
                        "Year",
                        "Pitcher(s)",
                        "Team",
                        "Opponent",
                        "Score",
                        "Inn.",
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "10px 14px",
                            textAlign: "left",
                            fontWeight: 700,
                            color: "#9CA3AF",
                            fontSize: 11,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            borderBottom: "3px solid #D97706",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {nhFiltered.map((nh, i) => (
                      <tr
                        key={`${nh.year}-${nh.pitcher}`}
                        style={{
                          background: i % 2 === 0 ? "#FFFFFF" : "#F9FAFB",
                          borderBottom: "1px solid #F3F4F6",
                        }}
                      >
                        <td
                          style={{
                            padding: "8px 14px",
                            fontWeight: 700,
                            fontFamily: "monospace",
                            color: nh.era ? "#1D4ED8" : "#D97706",
                          }}
                        >
                          {nh.year}
                          {nh.era && (
                            <span
                              style={{
                                fontSize: 9,
                                marginLeft: 4,
                                background: "#EFF6FF",
                                color: "#1D4ED8",
                                padding: "1px 4px",
                                borderRadius: 3,
                                fontFamily: "sans-serif",
                                fontWeight: 700,
                              }}
                            >
                              MWE
                            </span>
                          )}
                        </td>
                        <td
                          style={{
                            padding: "8px 14px",
                            color: "#111827",
                            fontWeight: 600,
                          }}
                        >
                          {nh.pitcher}
                          {nh.note && (
                            <span
                              style={{
                                fontSize: 10,
                                marginLeft: 6,
                                color: "#059669",
                                fontWeight: 700,
                              }}
                            >
                              ★ {nh.note}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "8px 14px", color: "#374151" }}>
                          {nh.team}
                        </td>
                        <td style={{ padding: "8px 14px", color: "#6B7280" }}>
                          {nh.opponent}
                        </td>
                        <td
                          style={{
                            padding: "8px 14px",
                            fontWeight: 700,
                            fontFamily: "monospace",
                          }}
                        >
                          {nh.score || "—"}
                        </td>
                        <td style={{ padding: "8px 14px", color: "#6B7280" }}>
                          {nh.innings ? `${nh.innings}` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div
                style={{
                  padding: "12px 16px",
                  borderTop: "1px solid #E5E7EB",
                  textAlign: "center",
                }}
              >
                <button
                  onClick={() => setShowAllNH((v) => !v)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 20px",
                    background: "#F3F4F6",
                    border: "1px solid #E5E7EB",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#374151",
                    cursor: "pointer",
                  }}
                >
                  {showAllNH ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                  {showAllNH
                    ? `Show fewer`
                    : `Show all ${NO_HITTERS.length} no-hitters`}
                </button>
              </div>
            </Card>
          </div>

          {/* ── Tournament Milestones ─────────────────────────────── */}
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
                    Bismarck Churchills won the inaugural championship, led by
                    Satchel Paige
                  </div>
                </CardBody>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow border-2 border-yellow-200 bg-yellow-50">
                <CardBody className="p-8">
                  <div className="text-5xl font-black text-yellow-600 mb-2">
                    {records?.recent_champions?.[0]?.year || "—"}
                  </div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    Latest Champion
                  </div>
                  <div className="text-xs text-gray-500">
                    {records?.recent_champions?.[0]?.name || "—"}
                  </div>
                </CardBody>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow border-2 border-gray-200">
                <CardBody className="p-8">
                  <div className="text-5xl font-black text-green-600 mb-2">
                    {records?.total_tournaments || "—"}
                  </div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    Total Tournaments
                  </div>
                  <div className="text-xs text-gray-500">
                    Held annually in Wichita, KS since 1935
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
