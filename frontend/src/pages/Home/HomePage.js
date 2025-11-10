import React, { useEffect, useState } from "react";
import { API_BASE } from "../../api";
import Navbar from "../../components/Navbar";
import "./HomePage.css";

function HomePage() {
  const [stats, setStats] = useState(null);
  const [champions, setChampions] = useState([]);
  const [hof, setHof] = useState([]);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [answer, setAnswer] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/statistics/overview`).then((r) => r.json()),
      fetch(`${API_BASE}/championships`).then((r) => r.json()),
      fetch(`${API_BASE}/hall-of-fame`).then((r) => r.json()),
      fetch(`${API_BASE}/records`).then((r) => r.json()),
      fetch(`${API_BASE}/records`).then((r) => r.json()),
    ])
      .then(([s, c, h, rec]) => {
        setStats(s);
        setChampions(Array.isArray(c.data) ? c.data.slice(0, 4) : []);
        setHof(Array.isArray(h.data) ? h.data.slice(0, 4) : []);
        // records are fetched but not used
      })
      .catch(console.error);
  }, []);
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setAnswer(null);

    try {
      const res = await fetch(`${API_BASE}/search/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query }),
      });
      const data = await res.json();
      setAnswer(data);
    } catch (err) {
      setAnswer({ answer: "Error performing search." });
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="home">
      {/* ✅ Reusable Navbar */}
      <Navbar />

      <section className="hero">
        <div className="hero-text">
          <h2>Explore 90 Years of Champions</h2>
          <p>
            Dive into team histories, player records, and unforgettable moments
            in NBC World Series history.
          </p>
        </div>
        <form onSubmit={handleSearch} className="search-box">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Ask e.g. "Who won in 1966?"'
          />
          <button disabled={searching}>{searching ? "..." : "Search"}</button>
        </form>

        {answer && (
          <div className="answer-box">
            <strong>Answer:</strong>
            <p>{answer.answer || "No result found"}</p>
          </div>
        )}
      </section>

      {stats && (
        <section className="stats">
          <div className="stat">
            <h3>{stats.total_championships}</h3>
            <p>Championships</p>
          </div>
          <div className="stat">
            <h3>{stats.total_teams}</h3>
            <p>Teams</p>
          </div>
          <div className="stat">
            <h3>{stats.hall_of_fame_members}</h3>
            <p>Hall of Fame Members</p>
          </div>
          <div className="stat">
            <h3>{stats.mlb_alumni}</h3>
            <p>MLB Alumni</p>
          </div>
        </section>
      )}

      <section className="recent">
        <h2>Recent Champions</h2>
        <div className="grid">
          {champions.map((c) => (
            <div key={c.year} className="card">
              <h3>{c.year}</h3>
              <p>
                <strong>{c.champion_name}</strong>
              </p>
              <p>Runner-Up: {c.runner_up_name}</p>
              {c.mvp && <p>MVP: {c.mvp}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="hof">
        <h2>Hall of Fame</h2>
        <div className="grid">
          {hof.map((m) => (
            <div key={m.inductee_name} className="card">
              <h3>{m.inductee_name}</h3>
              <p>{m.category}</p>
              <p>Year: {m.induction_year}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        © {new Date().getFullYear()} NBC World Series • Wichita, KS
      </footer>
    </div>
  );
}

export default HomePage;
