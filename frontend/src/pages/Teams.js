import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronRight } from "lucide-react";
import { useTeams } from "../hooks/useTeams";
import { BannerError } from "../components/common/BannerError";
import { Skeleton } from "../components/common/Skeleton";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,300;1,8..60,400&family=JetBrains+Mono:wght@400;500;600&display=swap');

  :root {
    --navy:        #0c1b3a;
    --navy-mid:    #163063;
    --navy-soft:   #1e3d7a;
    --gold:        #b8922a;
    --gold-light:  #d4aa4a;
    --gold-pale:   #f5e8c0;
    --parchment:   #f8f4eb;
    --parch-dark:  #ede5cc;
    --ink:         #1c1c2e;
    --ink-mid:     #3a3a55;
    --ink-soft:    #6a6a88;
    --rule:        #ccc3a8;
    --rule-light:  #e8e0cc;
    --white:       #ffffff;
    --champ-bg:    #fffbf0;
    --finalist-bg: #f2f6ff;
  }

  .ar { font-family: 'Source Serif 4', Georgia, serif; background: var(--parchment); color: var(--ink); }

  /* Hero */
  .ar-hero {
    background: var(--navy);
    position: relative;
    overflow: hidden;
  }
  .ar-hero-texture {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      repeating-linear-gradient(0deg, transparent, transparent 47px, rgba(184,146,42,0.07) 47px, rgba(184,146,42,0.07) 48px),
      repeating-linear-gradient(90deg, transparent, transparent 63px, rgba(184,146,42,0.04) 63px, rgba(184,146,42,0.04) 64px);
  }
  .ar-hero-gold-line {
    position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, transparent 0%, var(--gold) 20%, var(--gold-light) 50%, var(--gold) 80%, transparent 100%);
  }
  .ar-hero-inner { position: relative; z-index: 1; }

  /* Typography */
  .ar-display { font-family: 'Playfair Display', Georgia, serif; }
  .ar-mono    { font-family: 'JetBrains Mono', 'Courier New', monospace; }
  .ar-eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold-light); }
  .ar-kicker  { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-soft); }

  /* Medallion stats */
  .ar-medallion {
    border: 1px solid rgba(184,146,42,0.25);
    background: rgba(255,255,255,0.05);
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
    padding: 14px 20px;
  }
  .ar-medallion-val { font-family: 'Playfair Display', Georgia, serif; font-size: 2rem; font-weight: 900; color: white; line-height: 1; }
  .ar-medallion-label { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-top: 3px; }

  /* Controls bar */
  .ar-controls {
    background: var(--navy);
    border-bottom: 2px solid var(--gold);
    position: sticky; top: 0; z-index: 30;
  }

  /* Search */
  .ar-search {
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(184,146,42,0.3);
    color: white;
    font-family: 'Source Serif 4', Georgia, serif;
    font-style: italic;
    font-size: 0.9rem;
    padding: 8px 10px 8px 34px;
    border-radius: 2px;
    transition: all 0.2s;
    width: 100%;
  }
  .ar-search::placeholder { color: rgba(255,255,255,0.3); }
  .ar-search:focus { outline: none; border-color: var(--gold-light); background: rgba(255,255,255,0.11); box-shadow: 0 0 0 3px rgba(184,146,42,0.12); }

  /* Sort pills */
  .ar-pill {
    font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 5px 13px; border-radius: 2px;
    border: 1px solid rgba(184,146,42,0.3);
    color: rgba(255,255,255,0.5);
    background: transparent;
    cursor: pointer; transition: all 0.15s;
  }
  .ar-pill:hover { color: var(--gold-light); border-color: var(--gold); }
  .ar-pill.on { background: var(--gold); border-color: var(--gold); color: var(--navy); font-weight: 600; }

  /* Team cards */
  .ar-card {
    background: white;
    border: 1px solid var(--rule);
    border-left: 4px solid var(--rule);
    cursor: pointer;
    transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s;
    position: relative;
  }
  .ar-card:hover { transform: translateY(-3px); box-shadow: 0 10px 40px rgba(12,27,58,0.13), 0 2px 8px rgba(12,27,58,0.07); border-color: var(--navy-mid); border-left-color: var(--gold); }
  .ar-card:focus { outline: 2px solid var(--gold); outline-offset: 2px; }
  .ar-card.dynasty { background: var(--champ-bg); border-color: #d4b86a; border-left-color: var(--gold); }
  .ar-card.finalist { background: var(--finalist-bg); border-color: #aabce0; border-left-color: var(--navy-soft); }
  .ar-card:hover .ar-card-chevron { transform: translateX(3px); color: var(--gold); }

  .ar-card-badge-dynasty {
    font-family: 'JetBrains Mono', monospace; font-size: 0.57rem; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    background: var(--gold); color: var(--navy); padding: 2px 7px;
    display: inline-block;
  }
  .ar-card-badge-finalist {
    font-family: 'JetBrains Mono', monospace; font-size: 0.57rem; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    background: var(--navy-soft); color: white; padding: 2px 7px;
    display: inline-block;
  }

  .ar-card-name { font-family: 'Playfair Display', Georgia, serif; font-weight: 700; color: var(--ink); line-height: 1.25; transition: color 0.15s; }
  .ar-card:hover .ar-card-name { color: var(--navy-mid); }
  .ar-card-loc { font-family: 'JetBrains Mono', monospace; font-size: 0.62rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-soft); }

  .ar-divider { border: none; border-top: 1px solid var(--rule-light); }

  .ar-stat-num { font-family: 'Playfair Display', Georgia, serif; font-weight: 700; font-size: 1.5rem; line-height: 1; }
  .ar-stat-lbl { font-family: 'JetBrains Mono', monospace; font-size: 0.58rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-soft); margin-top: 2px; }
  .ar-gold-num { color: var(--gold); }

  .ar-winbar { height: 3px; background: var(--parch-dark); overflow: hidden; }
  .ar-winbar-fill { height: 100%; background: linear-gradient(90deg, var(--gold), var(--gold-light)); transition: width 0.5s ease; }

  .ar-chevron-wrap { color: var(--ink-soft); transition: all 0.18s; }

  /* Section label */
  .ar-section-header {
    border-bottom: 2px solid var(--rule);
    padding-bottom: 10px; margin-bottom: 24px;
  }
  .ar-section-label { font-family: 'Playfair Display', Georgia, serif; font-size: 1.1rem; font-weight: 700; color: var(--ink-mid); }
  .ar-section-count { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; letter-spacing: 0.12em; color: var(--ink-soft); text-transform: uppercase; margin-top: 2px; }

  /* Footer rules */
  .ar-rule1 { height: 2px; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
  .ar-rule2 { height: 1px; background: linear-gradient(90deg, transparent, var(--rule), transparent); margin-top: 3px; }
`;

export default function Teams() {
  const { teams, loading, err } = useTeams();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("championships");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let result = teams;
    if (term) {
      result = teams.filter((t) =>
        [t.name || "", t.city || "", t.state || ""].some((s) =>
          s.toLowerCase().includes(term),
        ),
      );
    }
    return [...result].sort((a, b) => {
      if (sortBy === "championships")
        return (
          (Number(b.championships_won) || 0) -
          (Number(a.championships_won) || 0)
        );
      if (sortBy === "appearances")
        return (Number(b.appearances) || 0) - (Number(a.appearances) || 0);
      return (a.name || "").localeCompare(b.name || "");
    });
  }, [q, teams, sortBy]);

  const stats = useMemo(() => {
    const totalChampionships = teams.reduce(
      (s, t) => s + (Number(t.championships_won) || 0),
      0,
    );
    const totalAppearances = teams.reduce(
      (s, t) => s + (Number(t.appearances) || 0),
      0,
    );
    const topTeam = [...teams].sort(
      (a, b) =>
        (Number(b.championships_won) || 0) - (Number(a.championships_won) || 0),
    )[0];
    const champTeams = teams.filter(
      (t) => Number(t.championships_won) > 0,
    ).length;
    return {
      totalTeams: teams.length,
      totalChampionships,
      totalAppearances,
      topTeam,
      champTeams,
    };
  }, [teams]);

  const getTier = (wins) =>
    wins >= 3 ? "dynasty" : wins >= 1 ? "finalist" : "";

  const dynasties = filtered.filter((t) => Number(t.championships_won) >= 3);
  const champions = filtered.filter(
    (t) => Number(t.championships_won) >= 1 && Number(t.championships_won) < 3,
  );
  const participants = filtered.filter(
    (t) => Number(t.championships_won) === 0,
  );

  const TeamCard = ({ team }) => {
    const wins = Number(team.championships_won) || 0;
    const appearances = Number(team.appearances) || 0;
    const winRate =
      appearances > 0 ? Math.round((wins / appearances) * 100) : 0;
    const tier = getTier(wins);

    return (
      <div
        className={`ar-card ${tier}`}
        onClick={() => navigate(`/teams/${team.id}`)}
        onKeyDown={(e) => e.key === "Enter" && navigate(`/teams/${team.id}`)}
        role="button"
        tabIndex={0}
      >
        <div style={{ padding: "16px 16px 12px" }}>
          {/* Badge + chevron row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
              minHeight: 20,
            }}
          >
            {wins >= 3 ? (
              <span className="ar-card-badge-dynasty">
                Dynasty · {wins} Titles
              </span>
            ) : wins >= 1 ? (
              <span className="ar-card-badge-finalist">Champion · {wins}×</span>
            ) : (
              <span />
            )}
            <span className="ar-chevron-wrap ar-card-chevron">
              <ChevronRight size={14} />
            </span>
          </div>

          {/* Name */}
          <div
            className="ar-card-name"
            style={{ fontSize: "1rem", marginBottom: 4 }}
          >
            {team.name}
          </div>
          {(team.city || team.state) && (
            <div className="ar-card-loc">
              {[team.city, team.state].filter(Boolean).join(", ")}
            </div>
          )}
        </div>

        <hr className="ar-divider" />

        <div style={{ padding: "10px 16px 14px" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div>
              <div className={`ar-stat-num ${wins > 0 ? "ar-gold-num" : ""}`}>
                {wins}
              </div>
              <div className="ar-stat-lbl">Titles</div>
            </div>
            <div
              style={{ width: 1, height: 30, background: "var(--rule-light)" }}
            />
            <div>
              <div className="ar-stat-num" style={{ color: "var(--ink-mid)" }}>
                {appearances}
              </div>
              <div className="ar-stat-lbl">Finals</div>
            </div>
            {appearances > 0 && (
              <>
                <div
                  style={{
                    width: 1,
                    height: 30,
                    background: "var(--rule-light)",
                  }}
                />
                <div>
                  <div
                    className="ar-stat-num"
                    style={{ color: "var(--ink-mid)" }}
                  >
                    {winRate}%
                  </div>
                  <div className="ar-stat-lbl">Win Rate</div>
                </div>
              </>
            )}
          </div>
          {appearances > 0 && (
            <div className="ar-winbar" style={{ marginTop: 10 }}>
              <div
                className="ar-winbar-fill"
                style={{ width: `${winRate}%` }}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const SectionHeader = ({ label, count }) => (
    <div className="ar-section-header">
      <div className="ar-section-label">{label}</div>
      <div className="ar-section-count">
        {count} {count === 1 ? "organization" : "organizations"}
      </div>
    </div>
  );

  return (
    <div className="ar">
      <style>{STYLES}</style>

      {/* Hero */}
      <div className="ar-hero">
        <div className="ar-hero-texture" />
        <div className="ar-hero-gold-line" />
        <div
          className="ar-hero-inner"
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "56px 32px 48px",
          }}
        >
          <p className="ar-eyebrow" style={{ marginBottom: 8 }}>
            National Baseball Congress · Wichita, Kansas · Est. 1935
          </p>
          <h1
            className="ar-display"
            style={{
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              fontWeight: 900,
              color: "white",
              letterSpacing: "-0.02em",
              marginBottom: 6,
            }}
          >
            Team Registry
          </h1>
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontStyle: "italic",
              color: "rgba(255,255,255,0.45)",
              fontSize: "1.1rem",
              marginBottom: 36,
            }}
          >
            A complete historical record of every organization to compete for
            the championship
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {[
              { val: stats.totalTeams, label: "Organizations" },
              { val: stats.totalChampionships, label: "Championships Awarded" },
              { val: stats.champTeams, label: "Champion Organizations" },
              {
                val: `${stats.topTeam?.championships_won || 0}×`,
                label: stats.topTeam?.name || "—",
              },
            ].map(({ val, label }) => (
              <div key={label} className="ar-medallion">
                <div className="ar-medallion-val">{val}</div>
                <div className="ar-medallion-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="ar-controls">
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "10px 32px",
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
            <Search
              size={13}
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "rgba(255,255,255,0.35)",
              }}
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search teams, cities, states…"
              className="ar-search"
            />
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span
              className="ar-eyebrow"
              style={{ color: "rgba(255,255,255,0.3)", marginRight: 4 }}
            >
              Sort
            </span>
            {[
              ["championships", "Titles"],
              ["appearances", "Finals"],
              ["name", "A–Z"],
            ].map(([v, l]) => (
              <button
                key={v}
                onClick={() => setSortBy(v)}
                className={`ar-pill ${sortBy === v ? "on" : ""}`}
              >
                {l}
              </button>
            ))}
          </div>
          <span
            style={{
              fontFamily: "'Source Serif 4', serif",
              fontStyle: "italic",
              fontSize: "0.82rem",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            {filtered.length} {filtered.length === 1 ? "record" : "records"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 32px 60px" }}
      >
        {err && <BannerError message={err} style={{ marginBottom: 24 }} />}

        {loading && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {Array.from({ length: 16 }).map((_, i) => (
              <Skeleton key={i} className="h-44" />
            ))}
          </div>
        )}

        {!loading && !err && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div
              className="ar-display"
              style={{
                fontSize: "4rem",
                color: "var(--rule)",
                marginBottom: 16,
              }}
            >
              ∅
            </div>
            <p
              className="ar-display"
              style={{
                fontSize: "1.4rem",
                color: "var(--ink-soft)",
                marginBottom: 8,
              }}
            >
              No records found
            </p>
            <p
              style={{
                fontStyle: "italic",
                color: "var(--ink-soft)",
                fontSize: "0.9rem",
              }}
            >
              No teams match "{q}"
            </p>
            <button
              onClick={() => setQ("")}
              className="ar-pill on"
              style={{ marginTop: 20, fontSize: "0.65rem" }}
            >
              Clear Search
            </button>
          </div>
        )}

        {!loading &&
          !err &&
          filtered.length > 0 &&
          (sortBy === "championships" ? (
            // Grouped by tier when sorted by titles
            <>
              {dynasties.length > 0 && (
                <div style={{ marginBottom: 40 }}>
                  <SectionHeader
                    label="Dynasty Programs"
                    count={dynasties.length}
                  />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(260px, 1fr))",
                      gap: 14,
                    }}
                  >
                    {dynasties.map((t) => (
                      <TeamCard key={t.id} team={t} />
                    ))}
                  </div>
                </div>
              )}
              {champions.length > 0 && (
                <div style={{ marginBottom: 40 }}>
                  <SectionHeader
                    label="Championship Programs"
                    count={champions.length}
                  />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(260px, 1fr))",
                      gap: 14,
                    }}
                  >
                    {champions.map((t) => (
                      <TeamCard key={t.id} team={t} />
                    ))}
                  </div>
                </div>
              )}
              {participants.length > 0 && (
                <div>
                  <SectionHeader
                    label="Tournament Participants"
                    count={participants.length}
                  />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(260px, 1fr))",
                      gap: 14,
                    }}
                  >
                    {participants.map((t) => (
                      <TeamCard key={t.id} team={t} />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            // Flat grid for other sorts
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 14,
              }}
            >
              {filtered.map((t) => (
                <TeamCard key={t.id} team={t} />
              ))}
            </div>
          ))}
      </div>

      {/* Footer rules */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px 48px" }}>
        <div className="ar-rule1" />
        <div className="ar-rule2" />
      </div>
    </div>
  );
}
