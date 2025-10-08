// src/App.js
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
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
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
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

        {/* Desktop nav (pills on blue chip) */}
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

      {/** Mobile sheet */}
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
        setErr("We couldn’t load the latest overview. Please try again.");
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
                    <div className="mt-4 inline-flex items-center text-sm text-blue-700 group-hover:underline">
                      View details <ChevronRight size={16} className="ml-1" />
                    </div>
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
                  value="1935–2024"
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
                      {r.year}
                    </td>
                    <td className="px-6 py-3">{r.champion_name}</td>
                    <td className="px-6 py-3 text-gray-700">
                      {r.runner_up_name || "—"}
                    </td>
                    <td className="px-6 py-3 text-gray-700">—</td>
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
        setErr("We couldn’t load teams at the moment.");
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
              No teams match “{q}”. Try a different search.
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
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    let stop = false;
    API.get("/teams")
      .then((t) => !stop && setTeams(pickArray(t)))
      .catch((e) => console.error(e));
    return () => {
      stop = true;
    };
  }, []);

  const top = useMemo(() => {
    if (!teams.length) return null;
    return teams
      .slice()
      .sort(
        (a, b) =>
          (Number(b.championships_won) || 0) -
          (Number(a.championships_won) || 0)
      )[0];
  }, [teams]);

  return (
    <Container className="py-12">
      <SectionTitle
        eyebrow="All-time"
        title="Records"
        desc="A few of the marks set across NBC World Series history."
      />
      <Card>
        <CardBody>
          <ul className="list-disc pl-6 space-y-3 text-gray-800">
            <li>
              <span className="font-semibold">Most Championships:</span>{" "}
              {top
                ? `${top.name} (${fmt(Number(top.championships_won) || 0)})`
                : "—"}
            </li>
            <li>
              <span className="font-semibold">Longest Winning Streak:</span> —
              (—)
            </li>
            <li>
              <span className="font-semibold">Most Appearances:</span> — (0)
            </li>
            <li>
              <span className="font-semibold">Most MVP Awards:</span> — (0)
            </li>
          </ul>
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
