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
  Award,
  Medal,
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

// eslint-disable-next-line no-unused-vars
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
          <nav className="bg-gray-800 rounded-xl px-1 py-1 shadow-sm">
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
              <li>
                <NavLink to="/player-stats" className={activeClass}>
                  Player Stats
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
              <NavLink
                to="/player-stats"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg ${
                    isActive ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
                  }`
                }
                onClick={() => setOpen(false)}
              >
                Player Stats
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

// ---------- Home Page ----------

function Home() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSearchError("");
    setSearchResults(null);

    try {
      const response = await API.post("/search/ask", { question: searchQuery });
      const payload = response?.data ?? {};

      setSearchResults({
        answer: payload.answer || "",
        data: payload.data || null,
        queryType: payload.queryType || "",
      });
    } catch (error) {
      console.error("Search error:", error);
      setSearchError("Search failed. Please try again.");
      setSearchResults(null);
    } finally {
      setSearching(false);
    }
  };

  // Get current year for "Next Tournament" section
  const currentYear = new Date().getFullYear();
  const nextTournament = currentYear + 1;

  return (
    <>
      {/* Hero Section - Modern & Professional */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Background Pattern */}
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
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-white/20">
              <Trophy size={18} className="text-yellow-300" />
              <span>Since 1935 • Wichita, Kansas</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-none">
              90 Years of
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                Championship Baseball
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              America's premier amateur baseball tournament.
              <br className="hidden md:block" />
              Where legends are made and champions are crowned.
            </p>

            {/* CTA Buttons */}
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

        {/* Decorative Wave */}
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

      {/* Quick Stats Section - Modern Cards */}
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
                {/* Championships */}
                <Card className="hover:shadow-xl transition-shadow border-l-4 border-l-yellow-500">
                  <CardBody className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-7 h-7 text-yellow-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-black text-gray-900">
                        {fmt(stats?.total_championships || 90)}
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

                {/* Teams */}
                <Card className="hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
                  <CardBody className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Users className="w-7 h-7 text-green-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-black text-gray-900">
                        {fmt(stats?.total_teams)}
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

                {/* MLB Alumni */}
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

                {/* Most Successful */}
                <Card className="hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
                  <CardBody className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Award className="w-7 h-7 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-gray-900">
                        {stats?.most_successful_team?.championships || 10}x
                      </div>
                      <div className="text-sm font-medium text-gray-600 mt-1 truncate">
                        {stats?.most_successful_team?.name || "Santa Barbara"}
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

          {err && (
            <div className="mt-6">
              <BannerError message={err} />
            </div>
          )}
        </Container>
      </section>

      {/* Recent Champions - Enhanced */}
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
              {recent.map((r, idx) => (
                <Card
                  key={r.year}
                  className="group hover:shadow-2xl transition-all hover:-translate-y-2 relative overflow-hidden"
                >
                  {/* Year Badge */}
                  <div className="absolute top-4 right-4 w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-black text-lg">
                      {r.year}
                    </span>
                  </div>

                  <CardBody className="pt-24">
                    {/* Trophy Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center mb-4 mx-auto">
                      <Trophy className="w-8 h-8 text-yellow-600" />
                    </div>

                    {/* Champion Name */}
                    <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                      {r.champion_name || r.champion}
                    </h3>

                    {/* Location */}
                    {(r.champion_city || r.city) && (
                      <p className="text-sm text-gray-600 text-center mb-4">
                        {r.champion_city || r.city},{" "}
                        {r.champion_state || r.state}
                      </p>
                    )}

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-4" />

                    {/* Details */}
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

                    {/* View Details Link */}
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

          {/* View All Link */}
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

      {/* Tournament Info Section - New */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Info */}
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

            {/* Right: Legacy */}
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

      {/* Search Section - Moved to bottom, cleaner */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
                Explore Tournament History
              </h2>
              <p className="text-gray-600">
                Search through 90 years of championships, MVPs, and memorable
                moments
              </p>
            </div>

            <Card className="shadow-xl">
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
                      placeholder='Try: "First champion?" or "Most championships?"'
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-lg"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={searching || !searchQuery.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition-colors text-lg"
                  >
                    {searching ? "Searching..." : "Search History"}
                  </button>
                </form>

                {searchError && (
                  <div className="mt-4">
                    <BannerError message={searchError} />
                  </div>
                )}

                {searchResults && searchResults.answer && (
                  <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Trophy
                        className="text-green-600 mt-1 flex-shrink-0"
                        size={24}
                      />
                      <div className="flex-1">
                        <div className="text-gray-800 leading-relaxed whitespace-pre-line text-lg">
                          {searchResults.answer.split("**").map((part, i) =>
                            i % 2 === 0 ? (
                              part
                            ) : (
                              <strong key={i} className="text-blue-700">
                                {part}
                              </strong>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}

// ---------- Championships ----------

function Championships() {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [decadeFilter, setDecadeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    loadChampionships();
  }, []);

  async function loadChampionships() {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/championships");
      const data = pickArray(res);
      setYears(data);
    } catch (err) {
      console.error("Error loading championships:", err);
      setError("Failed to load championships history.");
    } finally {
      setLoading(false);
    }
  }

  const filteredYears = useMemo(() => {
    let filtered = [...years];

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter((y) => {
        const champion = (y.champion || "").toLowerCase();
        const runnerUp = (y.runner_up || "").toLowerCase();
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
      const champ = y.champion || "Unknown";
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

      {error && (
        <div className="mb-4">
          <BannerError message={error} />
        </div>
      )}

      {loading ? (
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
          {filteredYears.map((year) => (
            <ChampionshipCard key={year.year} data={year} />
          ))}
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

function ChampionshipCard({ data }) {
  const { year, champion, runner_up, mvp, championship_score, city, state } =
    data;

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
              <p className="text-base font-bold text-gray-900">{champion}</p>
              {city && state && (
                <p className="text-xs text-gray-500">
                  {city}, {state}
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
                {runner_up || "—"}
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
                {mvp || "—"}
              </p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
// ---------- Teams ----------
function Teams() {
  const [teams, setTeams] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [sortBy, setSortBy] = useState("name");

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

    // Sort teams
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

  // Calculate stats
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
                  {/* Header with gradient - Gray theme matching home page */}
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

                  {/* Stats Body */}
                  <CardBody>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Championships - Gold theme */}
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

                      {/* Appearances - Gray theme */}
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

                    {/* Footer with win rate if applicable */}
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

function TeamDetail() {
  const { teamSlug } = useParams();
  const teamName = decodeURIComponent(teamSlug || "");

  const [team, setTeam] = useState(null);
  const [championships, setChampionships] = useState([]);
  const [playerStats, setPlayerStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [activeTab, setActiveTab] = useState("batting");

  useEffect(() => {
    let stop = false;

    async function load() {
      setLoading(true);
      setErr("");

      try {
        // 1) Load all teams + find this team
        const [teamsRes, champsRes, statsRes] = await Promise.all([
          API.get("/teams"),
          API.get("/championships"),
          API.get("/player-stats", { params: { year: 1966 } }), // for now only 1966
        ]);

        if (stop) return;

        const teams = pickArray(teamsRes);
        const allChamps = pickArray(champsRes);
        const allStats = pickArray(statsRes);

        const t = teams.find(
          (x) => (x.name || "").toLowerCase() === teamName.toLowerCase()
        );
        setTeam(t || { name: teamName });

        // filter championships where they were champion or runner-up
        const relatedChamps = allChamps.filter((c) => {
          const champ = (c.champion_name || c.champion || "").toLowerCase();
          const runner = (c.runner_up_name || c.runner_up || "").toLowerCase();
          const name = teamName.toLowerCase();
          return champ.includes(name) || runner.includes(name);
        });
        setChampionships(relatedChamps);

        // filter player stats for this team (1966 only right now)
        const stats = allStats.filter(
          (s) => (s.team_name || "").toLowerCase() === teamName.toLowerCase()
        );
        setPlayerStats(stats);
      } catch (e) {
        console.error("TeamDetail load error:", e);
        setErr("Could not load team details.");
      } finally {
        if (!stop) setLoading(false);
      }
    }

    load();
    return () => {
      stop = true;
    };
  }, [teamName]);

  if (loading) {
    return (
      <Container className="py-12">
        <Skeleton className="h-56" />
      </Container>
    );
  }

  if (err) {
    return (
      <Container className="py-12">
        <BannerError message={err} />
      </Container>
    );
  }

  return (
    <Container className="py-12 space-y-8">
      <NavLink
        to="/teams"
        className="text-blue-600 hover:underline text-sm inline-flex items-center gap-1"
      >
        ← Back to Teams
      </NavLink>

      {/* Header card */}
      <Card>
        <CardBody className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <Users size={14} />
              Team Profile
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {team?.name || teamName}
            </h1>
            <p className="mt-1 text-gray-600">
              {team?.city || "Unknown city"}, {team?.state || "Unknown state"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Championships
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {fmt(Number(team?.championships_won) || 0)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Appearances
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {fmt(Number(team?.appearances) || championships.length)}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Championship history */}
      <Card>
        <CardBody>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Trophy className="text-yellow-600" size={18} />
            Championship History
          </h2>
          {championships.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Year</th>
                    <th className="px-4 py-2 text-left font-semibold">
                      Result
                    </th>
                    <th className="px-4 py-2 text-left font-semibold">
                      Opponent
                    </th>
                    <th className="px-4 py-2 text-left font-semibold">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {championships
                    .sort((a, b) => (b.year || 0) - (a.year || 0))
                    .map((c) => {
                      const champName = c.champion_name || c.champion || "";
                      const isChamp =
                        champName.toLowerCase() === teamName.toLowerCase();

                      return (
                        <tr key={c.year}>
                          <td className="px-4 py-2 font-semibold">{c.year}</td>
                          <td className="px-4 py-2">
                            {isChamp ? "Champion" : "Runner-up"}
                          </td>
                          <td className="px-4 py-2">
                            {isChamp
                              ? c.runner_up_name || c.runner_up || "—"
                              : champName}
                          </td>
                          <td className="px-4 py-2">
                            {c.championship_score || "—"}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 text-sm">
              No championship appearances found yet.
            </p>
          )}
        </CardBody>
      </Card>

      {/* Simple 1966 stats snippet for this team */}
      <Container className="py-12">
        <SectionTitle
          eyebrow="Statistics"
          title={`1966 Player Stats`}
          desc="Batting and pitching stats by team."
        />

        {/* Tabs for batting / pitching */}
        <div className="mb-4 inline-flex rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
          <button
            type="button"
            onClick={() => setActiveTab("batting")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "batting"
                ? "bg-white text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Batting
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pitching")}
            className={`px-4 py-2 text-sm font-medium border-l border-gray-200 ${
              activeTab === "pitching"
                ? "bg-white text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Pitching
          </button>
        </div>

        <Card>
          <CardBody>
            <h2 className="text-lg font-bold mb-3">1966 Player Stats</h2>
            {playerStats.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs md:text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">
                        Player
                      </th>
                      <th className="px-2 py-2 text-right font-semibold">G</th>
                      <th className="px-2 py-2 text-right font-semibold">AB</th>
                      <th className="px-2 py-2 text-right font-semibold">H</th>
                      <th className="px-2 py-2 text-right font-semibold">HR</th>
                      <th className="px-3 py-2 text-right font-semibold">
                        AVG
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {playerStats.map((p, idx) => (
                      <tr key={p.id ?? `${p.player_name}-${idx}`}>
                        <td className="px-4 py-2">
                          <div className="font-medium text-gray-900">
                            {p.player_name}
                          </div>
                          {p.position && (
                            <div className="text-[11px] text-gray-500">
                              {p.position}
                            </div>
                          )}
                        </td>
                        <td className="px-2 py-2 text-right">{p.g}</td>
                        <td className="px-2 py-2 text-right">{p.ab}</td>
                        <td className="px-2 py-2 text-right">{p.h}</td>
                        <td className="px-2 py-2 text-right">{p.hr}</td>
                        <td className="px-3 py-2 text-right">{p.pct || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600 text-sm">
                No player stats available yet for 1966.
              </p>
            )}
          </CardBody>
        </Card>
      </Container>
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

// ---------- Player Stats (1966 + future years) ----------//
function PlayerStatsPage() {
  const [years, setYears] = useState([]);
  const [year, setYear] = useState("1966");
  const [rows, setRows] = useState([]); // batting
  const [pitchingRows, setPitchingRows] = useState([]); // pitching
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [search, setSearch] = useState("");
  const [expandedTeam, setExpandedTeam] = useState(null);

  // Load available years
  useEffect(() => {
    let stop = false;

    async function loadYears() {
      try {
        const res = await API.get("/player-stats/years");
        const d = res.data;
        const ys = Array.isArray(d)
          ? d
          : Array.isArray(d?.years)
          ? d.years
          : [];

        if (stop) return;

        const yStrings = ys.map(String).sort((a, b) => b.localeCompare(a));
        setYears(yStrings);

        // Choose a default year without referencing 'year' from the closure
        setYear((prev) =>
          yStrings.length && !yStrings.includes(prev) ? yStrings[0] : prev
        );
      } catch (e) {
        console.error("Error loading player-stats years:", e);
        if (!stop) setErr("Could not load available years.");
      }
    }

    loadYears();
    return () => {
      stop = true;
    };
  }, []);

  // Load stats whenever year changes
  useEffect(() => {
    if (!year) return;
    let stop = false;

    async function loadStats() {
      setLoading(true);
      setErr("");
      try {
        // Load batting
        const battingRes = await API.get("/player-stats", { params: { year } });
        if (stop) return;
        const battingArr = pickArray(battingRes);
        setRows(battingArr);

        // default expand first team (based on batting)
        if (battingArr.length) {
          const firstTeam = battingArr[0].team_name || "Unknown team";
          setExpandedTeam(firstTeam);
        }

        // Load pitching
        const pitchingRes = await API.get("/pitching-stats", {
          params: { year },
        });
        if (stop) return;
        const pitchingArr = pickArray(pitchingRes);
        setPitchingRows(pitchingArr);
      } catch (e) {
        console.error("Error loading player stats:", e);
        if (!stop) setErr("Could not load player stats for this year.");
      } finally {
        if (!stop) setLoading(false);
      }
    }

    loadStats();
    return () => {
      stop = true;
    };
  }, [year]);

  // Collect team list from batting data (for filter dropdown)
  const allTeams = useMemo(() => {
    const set = new Set();
    rows.forEach((r) => {
      if (r.team_name) set.add(r.team_name);
    });
    return Array.from(set).sort();
  }, [rows]);

  // Helpers for filtering
  const normalize = (v) => (v ? String(v).toLowerCase() : "");

  // Filter batting rows by team + search
  const filteredBattingRows = useMemo(() => {
    const team = normalize(teamFilter);
    const q = normalize(search);

    return rows.filter((r) => {
      if (team && normalize(r.team_name) !== team) {
        return false;
      }
      if (!q) return true;
      const name = normalize(r.player_name);
      const pos = normalize(r.position);
      return name.includes(q) || pos.includes(q);
    });
  }, [rows, teamFilter, search]);

  // Filter pitching rows by same filters
  const filteredPitchingRows = useMemo(() => {
    const team = normalize(teamFilter);
    const q = normalize(search);

    return pitchingRows.filter((r) => {
      if (team && normalize(r.team_name) !== team) {
        return false;
      }
      if (!q) return true;
      const name = normalize(r.player_name);
      return name.includes(q);
    });
  }, [pitchingRows, teamFilter, search]);

  // Group into teams (batting)
  const battingTeams = useMemo(() => {
    const map = new Map();
    filteredBattingRows.forEach((r) => {
      const key = r.team_name || "Unknown team";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(r);
    });
    return Array.from(map.entries());
  }, [filteredBattingRows]);

  // Group into teams (pitching)
  const pitchingTeams = useMemo(() => {
    const map = new Map();
    filteredPitchingRows.forEach((r) => {
      const key = r.team_name || "Unknown team";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(r);
    });
    return Array.from(map.entries());
  }, [filteredPitchingRows]);

  // Helper to get pitchers for a specific team
  const getPitchersForTeam = (teamName) => {
    return pitchingTeams.find(([name]) => name === teamName)?.[1] || [];
  };

  const noData = !rows.length && !pitchingRows.length;

  return (
    <Container className="py-12">
      <SectionTitle
        eyebrow="Box Scores"
        title="Player Statistics"
        desc="Per-player tournament numbers loaded from NBC historical records."
      />

      {/* Controls bar */}
      <Card className="mb-6">
        <CardBody className="flex flex-wrap gap-4 items-end">
          {/* Year selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Year
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {years.length ? (
                years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))
              ) : (
                <option value="1966">1966</option>
              )}
            </select>
          </div>

          {/* Team filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Team
            </label>
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm min-w-[180px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All teams</option>
              {allTeams.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Player search */}
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Player search
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
                placeholder="Search by player name or position"
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {err && (
        <div className="mb-4">
          <BannerError message={err} />
        </div>
      )}

      {loading ? (
        <div className="grid gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : noData ? (
        <Card>
          <CardBody>
            <p className="text-gray-600">
              No player stats found for {year}
              {teamFilter ? ` (${teamFilter})` : ""}.
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-6">
          {battingTeams.map(([teamName, players]) => {
            const isOpen = expandedTeam === teamName;
            const pitchers = getPitchersForTeam(teamName);

            // Calculate team batting totals
            const battingTotals = players.reduce(
              (acc, p) => {
                const toNum = (v) =>
                  typeof v === "number" ? v : parseInt(v, 10) || 0;
                acc.ab += toNum(p.ab);
                acc.h += toNum(p.h);
                acc.hr += toNum(p.hr);
                acc.rbi += toNum(p.rbi);
                return acc;
              },
              { ab: 0, h: 0, hr: 0, rbi: 0 }
            );
            const avg = battingTotals.ab
              ? (battingTotals.h / battingTotals.ab).toFixed(3).slice(1)
              : "---";

            return (
              <Card key={teamName} className="overflow-hidden">
                {/* Team header / accordion toggle */}
                <button
                  type="button"
                  onClick={() => setExpandedTeam(isOpen ? null : teamName)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors border-b border-gray-200"
                >
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {teamName}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1">
                      Team totals – AB {battingTotals.ab}, H {battingTotals.h},
                      HR {battingTotals.hr}, RBI {battingTotals.rbi}, AVG .{avg}
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className={`text-gray-400 transform transition-transform ${
                      isOpen ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div>
                    {/* BATTING TABLE */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs md:text-sm">
                        <thead className="bg-white sticky top-0 z-10">
                          <tr className="border-b border-gray-200 text-gray-700">
                            <th className="px-4 py-2 text-left font-semibold">
                              Player
                            </th>
                            <th className="px-2 py-2 text-right font-semibold">
                              G
                            </th>
                            <th className="px-2 py-2 text-right font-semibold">
                              AB
                            </th>
                            <th className="px-2 py-2 text-right font-semibold">
                              R
                            </th>
                            <th className="px-2 py-2 text-right font-semibold">
                              H
                            </th>
                            <th className="px-2 py-2 text-right font-semibold">
                              2B
                            </th>
                            <th className="px-2 py-2 text-right font-semibold">
                              3B
                            </th>
                            <th className="px-2 py-2 text-right font-semibold">
                              HR
                            </th>
                            <th className="px-2 py-2 text-right font-semibold">
                              SB
                            </th>
                            <th className="px-2 py-2 text-right font-semibold">
                              RBI
                            </th>
                            <th className="px-2 py-2 text-right font-semibold">
                              PO
                            </th>
                            <th className="px-2 py-2 text-right font-semibold">
                              A
                            </th>
                            <th className="px-2 py-2 text-right font-semibold">
                              E
                            </th>
                            <th className="px-3 py-2 text-right font-semibold">
                              AVG
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {players.map((p, idx) => (
                            <tr
                              key={p.id ?? `${p.player_name}-${idx}`}
                              className={
                                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }
                            >
                              <td className="px-4 py-1.5">
                                <div className="font-medium text-gray-900">
                                  {p.player_name}
                                </div>
                                {p.position && (
                                  <div className="text-[11px] text-gray-500">
                                    {p.position}
                                  </div>
                                )}
                              </td>
                              <td className="px-2 py-1.5 text-right">{p.g}</td>
                              <td className="px-2 py-1.5 text-right">{p.ab}</td>
                              <td className="px-2 py-1.5 text-right">{p.r}</td>
                              <td className="px-2 py-1.5 text-right">{p.h}</td>
                              <td className="px-2 py-1.5 text-right">
                                {p["2b"]}
                              </td>
                              <td className="px-2 py-1.5 text-right">
                                {p["3b"]}
                              </td>
                              <td className="px-2 py-1.5 text-right">{p.hr}</td>
                              <td className="px-2 py-1.5 text-right">{p.sb}</td>
                              <td className="px-2 py-1.5 text-right">
                                {p.rbi}
                              </td>
                              <td className="px-2 py-1.5 text-right">{p.po}</td>
                              <td className="px-2 py-1.5 text-right">{p.a}</td>
                              <td className="px-2 py-1.5 text-right">{p.e}</td>
                              <td className="px-3 py-1.5 text-right">
                                {p.pct || "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* PITCHING TABLE (below batting) */}
                    {pitchers.length > 0 && (
                      <div className="mt-6 border-t border-gray-200 pt-4">
                        <div className="px-6 mb-3">
                          <h3 className="text-sm font-bold text-gray-700">
                            Pitchers
                          </h3>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs md:text-sm">
                            <thead className="bg-gray-50">
                              <tr className="border-b border-gray-200 text-gray-700">
                                <th className="px-4 py-2 text-left font-semibold">
                                  Pitcher
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  G
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  W
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  L
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  IP
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  H
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  R
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  ER
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  BB
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  SO
                                </th>
                                <th className="px-2 py-2 text-right font-semibold">
                                  WP
                                </th>
                                <th className="px-3 py-2 text-right font-semibold">
                                  HB
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {pitchers.map((p, idx) => (
                                <tr
                                  key={p.id ?? `${p.player_name}-${idx}`}
                                  className={
                                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                  }
                                >
                                  <td className="px-4 py-1.5">
                                    <div className="font-medium text-gray-900">
                                      {p.player_name}
                                    </div>
                                  </td>
                                  <td className="px-2 py-1.5 text-right">
                                    {p.g}
                                  </td>
                                  <td className="px-2 py-1.5 text-right">
                                    {p.w}
                                  </td>
                                  <td className="px-2 py-1.5 text-right">
                                    {p.l}
                                  </td>
                                  <td className="px-2 py-1.5 text-right">
                                    {p.ip}
                                  </td>
                                  <td className="px-2 py-1.5 text-right">
                                    {p.h}
                                  </td>
                                  <td className="px-2 py-1.5 text-right">
                                    {p.r}
                                  </td>
                                  <td className="px-2 py-1.5 text-right">
                                    {p.er}
                                  </td>
                                  <td className="px-2 py-1.5 text-right">
                                    {p.bb}
                                  </td>
                                  <td className="px-2 py-1.5 text-right">
                                    {p.so}
                                  </td>
                                  <td className="px-2 py-1.5 text-right">
                                    {p.wp}
                                  </td>
                                  <td className="px-3 py-1.5 text-right">
                                    {p.hb}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
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
          <Route path="/player-stats" element={<PlayerStatsPage />} />
          <Route path="/teams/:teamSlug" element={<TeamDetail />} />
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
