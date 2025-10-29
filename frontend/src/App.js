// src/App.js
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useParams,
} from "react-router-dom";
import {
  Trophy,
  Users,
  Star,
  Calendar,
  Search,
  ChevronRight,
  AlertCircle,
  Menu,
  X,
} from "lucide-react";

// ---------- Axios helper ----------
const getApiBaseUrl = () => {
  // If explicitly set in environment, use it
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // In production, use relative URL (works on any domain)
  if (process.env.NODE_ENV === "production") {
    return "/api";
  }

  // In development, use localhost
  return "http://localhost:5000/api";
};

const API = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000,
});

// ---------- Utilities ----------
const fmt = (n) => (typeof n === "number" ? n.toLocaleString() : n || 0);
const pickArray = (res) => {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.data)) return d.data;
  if (Array.isArray(d?.rows)) return d.rows;
  if (d && typeof d === "object") {
    for (const k of Object.keys(d)) if (Array.isArray(d[k])) return d[k];
  }
  return [];
};

// ---------- Design System (tiny & local) ----------
function Container({ children, className = "" }) {
  return (
    <div className={`max-w-7xl mx-auto px-4 ${className}`}>{children}</div>
  );
}

function SectionTitle({ eyebrow, title, desc }) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <div className="inline-block text-xs tracking-widest uppercase font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
          {eyebrow}
        </div>
      )}
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900">
        {title}
      </h2>
      {desc && <p className="mt-2 text-gray-600">{desc}</p>}
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 ${className}`}
    >
      {children}
    </div>
  );
}

function CardBody({ children, className = "" }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

function Stat({ icon: Icon, label, value, tone = "slate" }) {
  const toneMap = {
    blue: "text-blue-600",
    green: "text-green-600",
    yellow: "text-yellow-600",
    purple: "text-purple-600",
    slate: "text-slate-600",
  };
  return (
    <Card>
      <CardBody>
        <div className="flex items-center gap-3">
          <div className={`shrink-0 ${toneMap[tone]}`}>
            <Icon size={22} />
          </div>
          <div>
            <div className="text-3xl font-semibold leading-none">{value}</div>
            <div className="mt-1 text-sm text-gray-600">{label}</div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function BannerError({ message }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 p-4 flex items-center gap-2">
      <AlertCircle size={18} />
      <span className="text-sm">{message}</span>
    </div>
  );
}

function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />
  );
}

// ---------- Layout: Nav + Shell ----------
function Nav() {
  const linkBase =
    "px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors";
  const activeClass = ({ isActive }) =>
    (isActive ? "bg-white/15 text-white " : "text-white/80 ") + linkBase;

  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b border-gray-200">
      <Container className="h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-700 text-white grid place-content-center font-extrabold text-sm">
            NBC
          </div>
          <div className="font-bold tracking-wide text-gray-900">
            NBC World Series
          </div>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:block">
          <nav className="bg-blue-800 rounded-xl px-1 py-1 shadow-sm">
            <ul className="flex items-center gap-1">
              <li>
                <NavLink to="/" className={activeClass} end>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/championships" className={activeClass}>
                  Championships
                </NavLink>
              </li>
              <li>
                <NavLink to="/teams" className={activeClass}>
                  Teams
                </NavLink>
              </li>
              <li>
                <NavLink to="/hall-of-fame" className={activeClass}>
                  Hall of Fame
                </NavLink>
              </li>
              <li>
                <NavLink to="/records" className={activeClass}>
                  Records
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>

        {/* Mobile menu */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 rounded-lg border border-gray-300"
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </Container>

      {/* Mobile sheet */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <Container className="py-3">
            <nav className="grid gap-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg ${
                    isActive ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
                  }`
                }
                end
                onClick={() => setOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/championships"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg ${
                    isActive ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
                  }`
                }
                onClick={() => setOpen(false)}
              >
                Championships
              </NavLink>
              <NavLink
                to="/teams"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg ${
                    isActive ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
                  }`
                }
                onClick={() => setOpen(false)}
              >
                Teams
              </NavLink>
              <NavLink
                to="/hall-of-fame"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg ${
                    isActive ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
                  }`
                }
                onClick={() => setOpen(false)}
              >
                Hall of Fame
              </NavLink>
              <NavLink
                to="/records"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg ${
                    isActive ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
                  }`
                }
                onClick={() => setOpen(false)}
              >
                Records
              </NavLink>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}

function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-white text-gray-900">
      <Nav />
      <main className="pb-16">{children}</main>
      <footer className="border-t border-gray-200 bg-white">
        <Container className="py-10 text-center space-y-2">
          <p className="font-medium">National Baseball Congress World Series</p>
          <p className="text-gray-500 text-sm">
            © 2024 NBC Baseball Foundation · Wichita, Kansas
          </p>
        </Container>
      </footer>
    </div>
  );
}

// ---------- Home ----------
function Home() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // SEARCH STATE
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    let stop = false;
    async function load() {
      try {
        const [s, c] = await Promise.all([
          API.get("/statistics/overview"),
          API.get("/championships"),
        ]);
        if (stop) return;
        setStats(s.data || {});
        setRecent(pickArray(c).slice(0, 3));
      } catch (e) {
        setErr("We couldn't load the latest overview. Please try again.");
        console.error("Home load error:", e);
      } finally {
        if (!stop) setLoading(false);
      }
    }
    load();
    return () => {
      stop = true;
    };
  }, []);

  // HANDLE SEARCH
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    console.log("🔍 Step 1: Starting search for:", searchQuery);
    console.log("🔍 Step 2: API baseURL:", API.defaults.baseURL);

    setSearching(true);
    setSearchError("");
    setSearchResults(null);

    try {
      console.log("🔍 Step 3: Making POST request to /search/ask");
      const response = await API.post("/search/ask", { question: searchQuery });

      console.log("✅ Step 4: Got response:", response);
      console.log("✅ Step 5: Response status:", response.status);
      console.log(
        "✅ Step 6: Response data:",
        JSON.stringify(response.data, null, 2)
      );

      const payload = response?.data ?? {};

      console.log(
        "✅ Step 7: Extracted payload:",
        JSON.stringify(payload, null, 2)
      );
      console.log("✅ Step 8: Answer:", payload.answer);
      console.log("✅ Step 9: Data:", payload.data);
      console.log("✅ Step 10: Query Type:", payload.queryType);

      const newSearchResults = {
        answer: payload.answer || "",
        data: payload.data || null,
        queryType: payload.queryType || "",
      };

      console.log(
        "✅ Step 11: Setting search results:",
        JSON.stringify(newSearchResults, null, 2)
      );
      setSearchResults(newSearchResults);

      console.log("✅ Step 12: Search results state should now be updated");
    } catch (error) {
      console.error("❌ ERROR at step:", error);
      console.error("❌ Error message:", error.message);
      console.error("❌ Error response:", error.response);
      console.error("❌ Error response data:", error.response?.data);
      console.error("❌ Error response status:", error.response?.status);
      setSearchError("Search failed. Please try again.");
      setSearchResults(null);
    } finally {
      setSearching(false);
      console.log(
        "🏁 Search complete. Final searchResults state:",
        searchResults
      );
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_400px_at_50%_-50%,rgba(59,130,246,0.25),transparent_60%)]" />
        <Container className="py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
              <Trophy size={16} /> Since 1935
            </div>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">
              90 Years of Champions
            </h1>
            <p className="mt-3 text-gray-600">
              National Baseball Congress World Series • Wichita, Kansas
            </p>
          </div>

          {/* Search */}
          <div className="mt-12 max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardBody>
                <div className="flex items-center gap-2 mb-4">
                  <Search className="text-blue-600" size={24} />
                  <h2 className="text-xl font-bold">
                    Ask About Tournament History
                  </h2>
                </div>

                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder='Try: "First champion?" or "Most championships?"'
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-base"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={searching || !searchQuery.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    {searching ? "Searching..." : "Search"}
                  </button>
                </form>

                {/* Search error */}
                {searchError && (
                  <div className="mt-4">
                    <BannerError message={searchError} />
                  </div>
                )}

                {/* Search results */}
                {searchResults &&
                  (searchResults.answer || searchResults.data) && (
                    <div className="mt-6 space-y-4">
                      {/* Answer */}
                      {searchResults.answer && (
                        <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="text-green-600 mt-1">
                              <Trophy size={20} />
                            </div>
                            <div className="flex-1">
                              <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                                {searchResults.answer
                                  .split("**")
                                  .map((part, i) =>
                                    i % 2 === 0 ? (
                                      part
                                    ) : (
                                      <strong key={i}>{part}</strong>
                                    )
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Data Display */}
                      {searchResults.data && searchResults.queryType && (
                        <div>
                          {/* First Champion */}
                          {searchResults.queryType === "firstChampion" && (
                            <Card>
                              <CardBody>
                                <div className="text-center">
                                  <div className="text-5xl mb-3">🏆</div>
                                  <div className="text-2xl font-bold text-gray-900">
                                    {searchResults.data.champion}
                                  </div>
                                  <div className="text-gray-600 mt-2">
                                    {searchResults.data.city},{" "}
                                    {searchResults.data.state}
                                  </div>
                                  <div className="text-3xl font-bold text-blue-600 mt-3">
                                    {searchResults.data.year}
                                  </div>
                                  <div className="text-sm text-gray-500 mt-1">
                                    First NBC World Series Champion
                                  </div>
                                </div>
                              </CardBody>
                            </Card>
                          )}

                          {/* Championship Streaks */}
                          {searchResults.queryType === "championshipStreaks" &&
                            Array.isArray(searchResults.data) &&
                            searchResults.data.length > 0 && (
                              <div className="grid gap-3">
                                {searchResults.data.map((streak, idx) => (
                                  <Card key={idx}>
                                    <CardBody className="flex items-center justify-between">
                                      <div>
                                        <div className="font-bold text-lg">
                                          {streak.name}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                          {streak.start_year} -{" "}
                                          {streak.end_year}
                                        </div>
                                      </div>
                                      <div className="text-3xl font-bold text-blue-600">
                                        {streak.consecutive_wins}{" "}
                                        {streak.consecutive_wins === 1
                                          ? "year"
                                          : "years"}
                                      </div>
                                    </CardBody>
                                  </Card>
                                ))}
                              </div>
                            )}

                          {/* Most Championships */}
                          {searchResults.queryType === "mostChampionships" &&
                            Array.isArray(searchResults.data) &&
                            searchResults.data.length > 0 && (
                              <div className="space-y-3">
                                {searchResults.data.map((team, idx) => (
                                  <Card key={idx}>
                                    <CardBody className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <div className="font-bold text-lg">
                                          {team.name}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                          Years: {team.years.join(", ")}
                                        </div>
                                      </div>
                                      <div className="text-3xl font-bold text-blue-600 ml-4">
                                        {team.championships}
                                      </div>
                                    </CardBody>
                                  </Card>
                                ))}
                              </div>
                            )}

                          {/* Recent Champions */}
                          {searchResults.queryType === "recentChampions" &&
                            Array.isArray(searchResults.data) &&
                            searchResults.data.length > 0 && (
                              <div className="space-y-2">
                                {searchResults.data.map((champ, idx) => (
                                  <Card key={idx}>
                                    <CardBody className="flex justify-between items-center">
                                      <div>
                                        <span className="font-bold text-lg">
                                          {champ.year}
                                        </span>
                                        <span className="mx-3">•</span>
                                        <span className="text-gray-700">
                                          {champ.champion}
                                        </span>
                                        {champ.championship_score && (
                                          <span className="text-sm text-gray-600 ml-3">
                                            ({champ.championship_score})
                                          </span>
                                        )}
                                      </div>
                                      {champ.mvp && (
                                        <div className="text-sm text-gray-600">
                                          MVP: {champ.mvp}
                                        </div>
                                      )}
                                    </CardBody>
                                  </Card>
                                ))}
                              </div>
                            )}

                          {/* Location */}
                          {searchResults.queryType === "location" && (
                            <Card>
                              <CardBody>
                                <div className="text-center space-y-3">
                                  <div className="text-4xl">🏟️</div>
                                  <div>
                                    <div className="text-2xl font-bold text-gray-900">
                                      {searchResults.data.city},{" "}
                                      {searchResults.data.state}
                                    </div>
                                    <div className="text-gray-600 mt-1">
                                      Since {searchResults.data.since}
                                    </div>
                                  </div>
                                  <div className="text-sm text-gray-700">
                                    {searchResults.data.venue}
                                  </div>
                                  <div className="text-sm text-gray-600 mt-2">
                                    📅 The tournament typically runs in late
                                    July through early August.
                                  </div>
                                </div>
                              </CardBody>
                            </Card>
                          )}

                          {/* Team Championship History */}
                          {searchResults.queryType ===
                            "teamChampionshipHistory" && (
                            <Card>
                              <CardBody>
                                <div className="text-center">
                                  <div className="text-5xl font-bold text-blue-600 mb-2">
                                    {searchResults.data.championships_won}
                                  </div>
                                  <div className="text-lg font-semibold text-gray-800">
                                    {searchResults.data.team}
                                  </div>
                                  <div className="text-sm text-gray-600 mt-2">
                                    Championship
                                    {searchResults.data.championships_won !== 1
                                      ? "s"
                                      : ""}{" "}
                                    won
                                  </div>
                                  {searchResults.data.years &&
                                    Array.isArray(searchResults.data.years) && (
                                      <div className="mt-4 space-y-2">
                                        {searchResults.data.years.map(
                                          (yr, idx) => (
                                            <div
                                              key={idx}
                                              className="text-xs text-gray-600 border-t pt-2"
                                            >
                                              <strong>{yr.year}</strong>
                                              {yr.score && (
                                                <span className="ml-2">
                                                  • {yr.score}
                                                </span>
                                              )}
                                              {yr.runner_up && (
                                                <span className="ml-2">
                                                  • vs {yr.runner_up}
                                                </span>
                                              )}
                                              {yr.mvp && (
                                                <span className="ml-2">
                                                  • MVP: {yr.mvp}
                                                </span>
                                              )}
                                            </div>
                                          )
                                        )}
                                      </div>
                                    )}
                                </div>
                              </CardBody>
                            </Card>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                {/* No results */}
                {searchResults &&
                  !searchResults.answer &&
                  !searchResults.data && (
                    <div className="mt-6">
                      <Card>
                        <CardBody>
                          <p className="text-gray-600">
                            No results found for "{searchQuery}"
                          </p>
                        </CardBody>
                      </Card>
                    </div>
                  )}
              </CardBody>
            </Card>
          </div>

          {/* Key stats */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {loading ? (
              <>
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
              </>
            ) : (
              <>
                <Stat
                  icon={Trophy}
                  label="Championships"
                  value={fmt(stats?.total_championships)}
                  tone="yellow"
                />
                <Stat
                  icon={Users}
                  label="Teams"
                  value={fmt(stats?.total_teams)}
                  tone="green"
                />
                <Stat
                  icon={Star}
                  label="MLB Alumni"
                  value={fmt(stats?.mlb_alumni)}
                  tone="blue"
                />
              </>
            )}
          </div>

          {err && (
            <div className="mt-6">
              <BannerError message={err} />
            </div>
          )}
        </Container>
      </section>

      {/* Recent Champions */}
      <section>
        <Container className="pt-4">
          <SectionTitle
            eyebrow="Spotlight"
            title="Recent Champions"
            desc="The latest title winners from the NBC World Series."
          />
          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {recent.map((r) => (
                <Card
                  key={r.year}
                  className="group hover:shadow-md transition-shadow"
                >
                  <CardBody>
                    <div className="flex items-center gap-2 text-gray-700 mb-2">
                      <Trophy size={18} className="text-yellow-600" />
                      <span className="font-semibold text-lg">{r.year}</span>
                    </div>
                    <div className="text-base font-semibold">
                      {r.champion_name}
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      Runner-up: {r.runner_up_name || "—"}
                    </div>
                    {r.mvp && (
                      <div className="mt-2 text-sm text-blue-700">
                        MVP: {r.mvp}
                      </div>
                    )}
                    <NavLink
                      to={`/championships/${r.year}`}
                      className="mt-4 inline-flex items-center text-sm text-blue-700 group-hover:underline"
                    >
                      View details <ChevronRight size={16} className="ml-1" />
                    </NavLink>
                  </CardBody>
                </Card>
              ))}
              {!recent.length && (
                <div className="text-gray-600">
                  No recent results available.
                </div>
              )}
            </div>
          )}
        </Container>
      </section>

      {/* Tournament Statistics */}
      <section className="mt-12">
        <Container>
          <SectionTitle
            eyebrow="Statistics"
            title="Tournament Metrics"
            desc="High-level figures that define the competition."
          />
          <div className="grid md:grid-cols-4 gap-6">
            {loading ? (
              <>
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
              </>
            ) : (
              <>
                <Stat
                  icon={Star}
                  label="Hall of Fame Members"
                  value={fmt(stats?.hall_of_fame_members)}
                  tone="yellow"
                />
                <Stat
                  icon={Trophy}
                  label={`Championships by ${
                    stats?.most_successful_team?.name || "—"
                  }`}
                  value={fmt(stats?.most_successful_team?.championships)}
                  tone="blue"
                />
                <Stat
                  icon={Users}
                  label="Total Teams"
                  value={fmt(stats?.total_teams)}
                  tone="green"
                />
                <Stat
                  icon={Calendar}
                  label="Years of Excellence"
                  value="1935–2025"
                  tone="purple"
                />
              </>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}

// ---------- Championships ----------
function Championships() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let stop = false;
    API.get("/championships")
      .then((res) => !stop && setRows(pickArray(res)))
      .catch((e) => {
        setErr("Could not fetch championships right now.");
        console.error(e);
      })
      .finally(() => !stop && setLoading(false));
    return () => {
      stop = true;
    };
  }, []);

  return (
    <Container className="py-12">
      <SectionTitle
        eyebrow="Archive"
        title="Championships History"
        desc="A season-by-season look at the winners and runners-up."
      />

      {err && (
        <div className="mb-4">
          <BannerError message={err} />
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Year</th>
                <th className="px-6 py-3 text-left font-semibold">Champion</th>
                <th className="px-6 py-3 text-left font-semibold">Runner-up</th>
                <th className="px-6 py-3 text-left font-semibold">MVP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-40" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-40" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-24" />
                    </td>
                  </tr>
                ))
              ) : rows.length ? (
                rows.map((r, i) => (
                  <tr key={r.year || i} className="hover:bg-gray-50/70">
                    <td className="px-6 py-3 font-semibold text-gray-900">
                      <NavLink
                        to={`/championships/${r.year}`}
                        className="text-blue-600 hover:underline"
                      >
                        {r.year}
                      </NavLink>
                    </td>
                    <td className="px-6 py-3">{r.champion_name}</td>
                    <td className="px-6 py-3 text-gray-700">
                      {r.runner_up_name || "—"}
                    </td>
                    <td className="px-6 py-3 text-gray-700">{r.mvp || "—"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-6 text-gray-500" colSpan={4}>
                    No championship records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </Container>
  );
}

// ---------- Teams ----------
function Teams() {
  const [teams, setTeams] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let stop = false;
    API.get("/teams")
      .then((res) => !stop && setTeams(pickArray(res)))
      .catch((e) => {
        setErr("We couldn't load teams at the moment.");
        console.error(e);
      })
      .finally(() => !stop && setLoading(false));
    return () => {
      stop = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return teams;
    return teams.filter((t) => {
      const name = (t.name || "").toLowerCase();
      const city = (t.city || "").toLowerCase();
      const state = (t.state || "").toLowerCase();
      return name.includes(term) || city.includes(term) || state.includes(term);
    });
  }, [q, teams]);

  return (
    <Container className="py-12">
      <SectionTitle
        eyebrow="Clubs"
        title="Teams"
        desc="Search and browse participating teams."
      />

      <div className="mb-6 max-w-xl">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400"
            placeholder="Search by team, city, or state"
          />
        </div>
      </div>

      {err && (
        <div className="mb-4">
          <BannerError message={err} />
        </div>
      )}

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : filtered.length ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t, idx) => (
            <Card
              key={t.id ?? `${t.name}-${idx}`}
              className="hover:shadow-md transition-shadow"
            >
              <CardBody>
                <div className="text-lg font-semibold">{t.name}</div>
                <div className="text-gray-600 mt-1">
                  {t.city || "—"}, {t.state || "—"}
                </div>
                <div className="mt-4 flex justify-between text-sm text-gray-700">
                  <div>
                    <span className="font-semibold">
                      {fmt(Number(t.championships_won) || 0)}
                    </span>{" "}
                    Championships
                  </div>
                  <div>
                    <span className="font-semibold">
                      {fmt(Number(t.appearances) || 0)}
                    </span>{" "}
                    Appearances
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardBody>
            <div className="text-gray-600">
              No teams match "{q}". Try a different search.
            </div>
          </CardBody>
        </Card>
      )}
    </Container>
  );
}

// ---------- Hall of Fame ----------
function HallOfFame() {
  const [members, setMembers] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    let stop = false;
    API.get("/hall-of-fame")
      .then((r) => !stop && setMembers(pickArray(r)))
      .catch((e) => {
        setErr("Unable to load Hall of Fame members.");
        console.error(e);
      });
    return () => {
      stop = true;
    };
  }, []);

  const count = Array.isArray(members) ? members.length : 0;
  const recent = Array.isArray(members) ? members.slice(0, 5) : [];

  return (
    <Container className="py-12">
      <SectionTitle
        eyebrow="Legacy"
        title="Hall of Fame"
        desc="Celebrating the players, coaches, and contributors who shaped the tournament."
      />

      {err && (
        <div className="mb-4">
          <BannerError message={err} />
        </div>
      )}

      <Card>
        <CardBody>
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 rounded-full bg-yellow-100 grid place-content-center text-yellow-600">
              <Star size={28} />
            </div>
            <div className="mt-3 text-gray-700">{count} Members Inducted</div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Recent Inductees</h3>
              <ul className="space-y-2">
                {recent.length ? (
                  recent.map((m, i) => (
                    <li
                      key={`${m.inductee_name}-${m.induction_year}-${i}`}
                      className="flex items-center"
                    >
                      <ChevronRight size={18} className="text-blue-600 mr-2" />
                      <span>
                        {m.inductee_name} ({m.induction_year})
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-600 text-sm">
                    No recent inductees.
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Categories</h3>
              <div className="grid sm:grid-cols-3 gap-3 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  Players:{" "}
                  {members.filter((m) => m.category === "Player").length}{" "}
                  members
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  Coaches:{" "}
                  {members.filter((m) => m.category === "Coach").length} members
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  Contributors:{" "}
                  {members.filter((m) => m.category === "Contributor").length}{" "}
                  members
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </Container>
  );
}

// ---------- Records ----------
function Records() {
  const [records, setRecords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let stop = false;
    API.get("/records")
      .then((r) => !stop && setRecords(r.data))
      .catch((e) => {
        setErr("Could not load records.");
        console.error(e);
      })
      .finally(() => !stop && setLoading(false));
    return () => {
      stop = true;
    };
  }, []);

  return (
    <Container className="py-12">
      <SectionTitle
        eyebrow="All-time"
        title="Records & Achievements"
        desc="Notable achievements across NBC World Series history."
      />

      {err && (
        <div className="mb-4">
          <BannerError message={err} />
        </div>
      )}

      {loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Most Championships */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardBody>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-yellow-100 grid place-content-center">
                  <Trophy className="text-yellow-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Most Championships</h3>
                  <p className="text-sm text-gray-600">All-time leader</p>
                </div>
              </div>
              {records?.most_championships ? (
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {records.most_championships.championships}
                  </div>
                  <div className="text-lg font-semibold text-gray-700 mt-1">
                    {records.most_championships.name}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {records.most_championships.city},{" "}
                    {records.most_championships.state}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">No data available</div>
              )}
            </CardBody>
          </Card>

          {/* Most Appearances */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardBody>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 grid place-content-center">
                  <Calendar className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Most Appearances</h3>
                  <p className="text-sm text-gray-600">
                    Tournament participation
                  </p>
                </div>
              </div>
              {records?.most_appearances ? (
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {records.most_appearances.appearances}
                  </div>
                  <div className="text-lg font-semibold text-gray-700 mt-1">
                    {records.most_appearances.name}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">No data available</div>
              )}
            </CardBody>
          </Card>

          {/* Most MVP Awards */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardBody>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 grid place-content-center">
                  <Star className="text-purple-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Most MVP Awards</h3>
                  <p className="text-sm text-gray-600">Tournament MVPs</p>
                </div>
              </div>
              {records?.most_mvp_awards ? (
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {records.most_mvp_awards.mvp_awards}
                  </div>
                  <div className="text-lg font-semibold text-gray-700 mt-1">
                    {records.most_mvp_awards.player_name}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">
                  <div className="text-sm">Limited MVP data available</div>
                  <div className="text-xs mt-1">
                    Only recent tournaments have MVP records
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Tournament History */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardBody>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-green-100 grid place-content-center">
                  <Users className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Tournament History</h3>
                  <p className="text-sm text-gray-600">Since 1935</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Years Active:</span>
                  <span className="font-bold text-gray-900">90 years</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Tournaments:</span>
                  <span className="font-bold text-gray-900">
                    {records?.total_tournaments || 89}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-bold text-gray-900">Wichita, KS</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Modern Wood Era Records Section */}
      <div className="mt-12">
        <SectionTitle
          eyebrow="2000-2025"
          title="Modern Wood Era Records"
          desc="Outstanding achievements since the switch to wood bats."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Individual Batting - Highest Average */}
          <Card>
            <CardBody>
              <h4 className="font-bold text-lg mb-2 text-blue-700">
                Highest Batting Average
              </h4>
              <div className="text-3xl font-bold text-gray-900">.750</div>
              <div className="text-sm text-gray-700 mt-1">
                <strong>Grant Nottlemann</strong>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Great Bend KS Bat Cats (2023)
              </div>
              <div className="text-xs text-gray-500 mt-2">
                5 GP, 12 H, 16 AB
              </div>
            </CardBody>
          </Card>

          {/* Most Hits */}
          <Card>
            <CardBody>
              <h4 className="font-bold text-lg mb-2 text-blue-700">
                Most Hits (Tournament)
              </h4>
              <div className="text-3xl font-bold text-gray-900">19</div>
              <div className="text-sm text-gray-700 mt-1">
                <strong>Gavin Wehby</strong>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Liberal KS (2015)
              </div>
              <div className="text-xs text-gray-500 mt-2">11 games played</div>
            </CardBody>
          </Card>

          {/* Most RBIs */}
          <Card>
            <CardBody>
              <h4 className="font-bold text-lg mb-2 text-blue-700">
                Most RBIs (Tournament)
              </h4>
              <div className="text-3xl font-bold text-gray-900">17</div>
              <div className="text-sm text-gray-700 mt-1">
                <strong>Gunnar Glad</strong>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Anchorage AK Glacier Pilots (2009)
              </div>
              <div className="text-xs text-gray-500 mt-2">9 games played</div>
            </CardBody>
          </Card>

          {/* Most Home Runs */}
          <Card>
            <CardBody>
              <h4 className="font-bold text-lg mb-2 text-blue-700">
                Most Home Runs (Tournament)
              </h4>
              <div className="text-3xl font-bold text-gray-900">4</div>
              <div className="text-sm text-gray-700 mt-1">
                <strong>Nolan Reimold</strong>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Hays KS Larks (2004)
              </div>
            </CardBody>
          </Card>

          {/* Most Strikeouts (Pitcher) */}
          <Card>
            <CardBody>
              <h4 className="font-bold text-lg mb-2 text-blue-700">
                Most Strikeouts (Tournament)
              </h4>
              <div className="text-3xl font-bold text-gray-900">27</div>
              <div className="text-sm text-gray-700 mt-1">
                <strong>Tommy Hanson</strong>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Aloha OR Knights (2005)
              </div>
            </CardBody>
          </Card>

          {/* Team Batting Average */}
          <Card>
            <CardBody>
              <h4 className="font-bold text-lg mb-2 text-blue-700">
                Highest Team Batting Avg
              </h4>
              <div className="text-3xl font-bold text-gray-900">.379</div>
              <div className="text-sm text-gray-700 mt-1">
                <strong>San Diego CA Stars</strong>
              </div>
              <div className="text-xs text-gray-600 mt-1">2010 (6 games)</div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Fun Facts Section */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6">Fun Facts</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-blue-600">1935</div>
              <div className="text-sm text-gray-600 mt-1">First Tournament</div>
              <div className="text-xs text-gray-500 mt-2">
                Duncan Cementers won
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-blue-600">2024</div>
              <div className="text-sm text-gray-600 mt-1">Latest Champion</div>
              <div className="text-xs text-gray-500 mt-2">
                Hutchinson Monarchs
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-blue-600">~45K</div>
              <div className="text-sm text-gray-600 mt-1">2024 Attendance</div>
              <div className="text-xs text-gray-500 mt-2">Total fans</div>
            </CardBody>
          </Card>
        </div>
      </div>
    </Container>
  );
}

// ---------- Championship Detail ----------
function ChampionshipDetail() {
  const { year } = useParams();
  const [champ, setChamp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let stop = false;
    API.get(`/championships/${year}`)
      .then((res) => {
        if (!stop) {
          setChamp(res.data);
        }
      })
      .catch((e) => {
        setErr("Could not load championship details.");
        console.error(e);
      })
      .finally(() => !stop && setLoading(false));
    return () => {
      stop = true;
    };
  }, [year]);

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
          to="/"
          className="text-blue-600 hover:underline flex items-center gap-2"
        >
          ← Back to Home
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

// ---------- App ----------
export default function App() {
  return (
    <Router>
      <PageShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/championships" element={<Championships />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/hall-of-fame" element={<HallOfFame />} />
          <Route path="/records" element={<Records />} />
          <Route path="/championships/:year" element={<ChampionshipDetail />} />
          <Route
            path="*"
            element={
              <Container className="py-20">
                <Card>
                  <CardBody className="text-center">
                    <h1 className="text-2xl font-bold">Page not found</h1>
                    <p className="text-gray-600 mt-2">
                      Check the URL and try again.
                    </p>
                  </CardBody>
                </Card>
              </Container>
            }
          />
        </Routes>
      </PageShell>
    </Router>
  );
}
