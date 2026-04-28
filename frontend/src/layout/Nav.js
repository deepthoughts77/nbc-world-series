/* eslint-disable jsx-a11y/no-redundant-roles */
// src/layout/Nav.js
import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  Users,
  BarChart3,
  ArrowLeftRight,
  Search,
  Swords,
} from "lucide-react";
import { Container } from "../components/common/Container";

export function Nav() {
  const linkBase =
    "px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors";
  const activeClass = ({ isActive }) =>
    (isActive ? "bg-white/15 text-white " : "text-white/80 ") + linkBase;

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [teamsDropdownOpen, setTeamsDropdown] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const dropdownRef = useRef(null);
  const teamsButtonRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchBtnRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setTeamsDropdown(false);
      if (searchRef.current && !searchRef.current.contains(e.target))
        setSearchOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key !== "Escape") return;
      if (teamsDropdownOpen) {
        setTeamsDropdown(false);
        teamsButtonRef.current?.focus();
      }
      if (searchOpen) {
        setSearchOpen(false);
        searchBtnRef.current?.focus();
      }
      if (open) setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [teamsDropdownOpen, searchOpen, open]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim().length < 2) return;
    navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
    setSearchOpen(false);
    setSearchVal("");
  };

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  return (
    <>
      <a
        href="#main-content"
        style={{
          position: "absolute",
          top: -40,
          left: 0,
          zIndex: 9999,
          background: "#1D4ED8",
          color: "#FFFFFF",
          padding: "8px 16px",
          fontSize: 13,
          fontWeight: 700,
          textDecoration: "none",
          borderRadius: "0 0 6px 0",
          transition: "top 0.1s",
        }}
        onFocus={(e) => (e.currentTarget.style.top = "0")}
        onBlur={(e) => (e.currentTarget.style.top = "-40px")}
      >
        Skip to main content
      </a>

      <header
        role="banner"
        className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b border-gray-200"
      >
        <Container className="h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-lg bg-blue-700 text-white grid place-content-center font-extrabold text-sm"
              aria-hidden="true"
            >
              NBC
            </div>
            <span className="font-bold tracking-wide text-gray-900">
              NBC World Series
            </span>
          </div>

          {/* ── Desktop nav ─────────────────────────────────────────── */}
          <div className="hidden md:block">
            <nav aria-label="Main navigation">
              <ul
                className="flex items-center gap-1 bg-gray-800 rounded-xl px-1 py-1 shadow-sm"
                role="list"
              >
                <li role="none">
                  <NavLink to="/" end className={activeClass}>
                    Home
                  </NavLink>
                </li>
                <li role="none">
                  <NavLink to="/championships" className={activeClass}>
                    Championships
                  </NavLink>
                </li>

                {/* Teams dropdown — includes Team Registry, Team Totals, Head-to-Head */}
                <li role="none" className="relative" ref={dropdownRef}>
                  <button
                    ref={teamsButtonRef}
                    onClick={() => setTeamsDropdown((v) => !v)}
                    aria-haspopup="menu"
                    aria-expanded={teamsDropdownOpen}
                    aria-controls="teams-dropdown-menu"
                    className={
                      "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors " +
                      (teamsDropdownOpen
                        ? "bg-white/15 text-white"
                        : "text-white/80 hover:bg-white/10")
                    }
                  >
                    Teams
                    <ChevronDown
                      size={14}
                      aria-hidden="true"
                      className={`transition-transform ${teamsDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {teamsDropdownOpen && (
                    <div
                      id="teams-dropdown-menu"
                      role="menu"
                      aria-label="Teams submenu"
                      style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#FFFFFF",
                        border: "1px solid #E2E8F0",
                        borderRadius: 10,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        minWidth: 210,
                        zIndex: 100,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          top: -6,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: 12,
                          height: 12,
                          background: "#FFFFFF",
                          border: "1px solid #E2E8F0",
                          borderBottom: "none",
                          borderRight: "none",
                          rotate: "45deg",
                        }}
                      />

                      {/* Team Registry */}
                      <NavLink
                        to="/teams"
                        end
                        role="menuitem"
                        onClick={() => setTeamsDropdown(false)}
                        style={{ textDecoration: "none" }}
                      >
                        {({ isActive }) => (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              padding: "12px 16px",
                              background: isActive ? "#EFF6FF" : "#FFFFFF",
                              borderBottom: "1px solid #F1F5F9",
                              cursor: "pointer",
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = "#F8FAFC")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = isActive
                                ? "#EFF6FF"
                                : "#FFFFFF")
                            }
                          >
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                                background: "#EFF6FF",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                              aria-hidden="true"
                            >
                              <Users size={16} color="#2563EB" />
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: "#0F172A",
                                }}
                              >
                                Team Registry
                              </div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "#64748B",
                                  marginTop: 1,
                                }}
                              >
                                All teams &amp; histories
                              </div>
                            </div>
                          </div>
                        )}
                      </NavLink>

                      {/* Team Totals */}
                      <NavLink
                        to="/team-totals"
                        role="menuitem"
                        onClick={() => setTeamsDropdown(false)}
                        style={{ textDecoration: "none" }}
                      >
                        {({ isActive }) => (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              padding: "12px 16px",
                              background: isActive ? "#EFF6FF" : "#FFFFFF",
                              borderBottom: "1px solid #F1F5F9",
                              cursor: "pointer",
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = "#F8FAFC")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = isActive
                                ? "#EFF6FF"
                                : "#FFFFFF")
                            }
                          >
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                                background: "#F0FDF4",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                              aria-hidden="true"
                            >
                              <BarChart3 size={16} color="#059669" />
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: "#0F172A",
                                }}
                              >
                                Team Totals
                              </div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "#64748B",
                                  marginTop: 1,
                                }}
                              >
                                Season batting &amp; pitching
                              </div>
                            </div>
                          </div>
                        )}
                      </NavLink>

                      {/* Head-to-Head */}
                      <NavLink
                        to="/head-to-head"
                        role="menuitem"
                        onClick={() => setTeamsDropdown(false)}
                        style={{ textDecoration: "none" }}
                      >
                        {({ isActive }) => (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              padding: "12px 16px",
                              background: isActive ? "#EFF6FF" : "#FFFFFF",
                              cursor: "pointer",
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = "#F8FAFC")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = isActive
                                ? "#EFF6FF"
                                : "#FFFFFF")
                            }
                          >
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                                background: "#FEF3C7",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                              aria-hidden="true"
                            >
                              <Swords size={16} color="#D97706" />
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: "#0F172A",
                                }}
                              >
                                Head-to-Head
                              </div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "#64748B",
                                  marginTop: 1,
                                }}
                              >
                                All-time matchup records
                              </div>
                            </div>
                          </div>
                        )}
                      </NavLink>
                    </div>
                  )}
                </li>

                <li role="none">
                  <NavLink to="/hall-of-fame" className={activeClass}>
                    Hall of Fame
                  </NavLink>
                </li>
                <li role="none">
                  <NavLink to="/archives" className={activeClass}>
                    Archives
                  </NavLink>
                </li>
                <li role="none">
                  <NavLink to="/records" className={activeClass}>
                    Records
                  </NavLink>
                </li>
                <li role="none">
                  <NavLink to="/player-stats" className={activeClass}>
                    Player Stats
                  </NavLink>
                </li>
                <li role="none">
                  <NavLink to="/compare" className={activeClass}>
                    Compare
                  </NavLink>
                </li>
                <li role="none">
                  <NavLink to="/leaders/pitching" className={activeClass}>
                    Leading Pitchers
                  </NavLink>
                </li>
                <li role="none">
                  <NavLink to="/document-search" className={activeClass}>
                    Doc Search
                  </NavLink>
                </li>

                {/* Search icon */}
                <li
                  role="none"
                  ref={searchRef}
                  style={{ position: "relative" }}
                >
                  {searchOpen ? (
                    <form
                      onSubmit={handleSearchSubmit}
                      role="search"
                      aria-label="Site search"
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <div style={{ position: "relative" }}>
                        <Search
                          size={13}
                          aria-hidden="true"
                          style={{
                            position: "absolute",
                            left: 8,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#9CA3AF",
                            pointerEvents: "none",
                          }}
                        />
                        <input
                          ref={searchInputRef}
                          value={searchVal}
                          onChange={(e) => setSearchVal(e.target.value)}
                          placeholder="Search…"
                          aria-label="Search the site"
                          style={{
                            background: "rgba(255,255,255,0.12)",
                            border: "1px solid rgba(255,255,255,0.3)",
                            borderRadius: 6,
                            fontSize: 13,
                            padding: "6px 10px 6px 26px",
                            color: "#FFFFFF",
                            outline: "none",
                            width: 160,
                          }}
                        />
                      </div>
                      <button
                        type="submit"
                        aria-label="Submit search"
                        style={{
                          background: "#1D4ED8",
                          border: "none",
                          borderRadius: 6,
                          color: "#FFFFFF",
                          fontSize: 12,
                          fontWeight: 700,
                          padding: "6px 10px",
                          cursor: "pointer",
                        }}
                      >
                        Go
                      </button>
                      <button
                        type="button"
                        onClick={() => setSearchOpen(false)}
                        aria-label="Close search"
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "rgba(255,255,255,0.8)",
                          cursor: "pointer",
                          padding: 2,
                        }}
                      >
                        <X size={14} aria-hidden="true" />
                      </button>
                    </form>
                  ) : (
                    <button
                      ref={searchBtnRef}
                      onClick={openSearch}
                      aria-label="Open search"
                      aria-expanded="false"
                      className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors text-white/80"
                    >
                      <Search size={15} aria-hidden="true" />
                    </button>
                  )}
                </li>
              </ul>
            </nav>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg border border-gray-300"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? (
              <X size={18} aria-hidden="true" />
            ) : (
              <Menu size={18} aria-hidden="true" />
            )}
          </button>
        </Container>

        {/* ── Mobile sheet ─────────────────────────────────────────────── */}
        {open && (
          <div
            id="mobile-nav"
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <Container className="py-3">
              <nav aria-label="Mobile navigation">
                <ul className="grid gap-1" role="list">
                  {[
                    { to: "/", label: "Home", end: true },
                    { to: "/championships", label: "Championships" },
                    { to: "/hall-of-fame", label: "Hall of Fame" },
                    { to: "/archives", label: "Archives" },
                    { to: "/records", label: "Records" },
                    { to: "/player-stats", label: "Player Stats" },
                    { to: "/leaders/pitching", label: "Leading Pitchers" },
                    { to: "/document-search", label: "Doc Search" },
                  ].map(({ to, label, end }) => (
                    <li key={to} role="none">
                      <NavLink
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                          `block px-3 py-2 rounded-lg text-sm font-medium ${isActive ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-700"}`
                        }
                        onClick={() => setOpen(false)}
                      >
                        {label}
                      </NavLink>
                    </li>
                  ))}

                  {/* Mobile Teams group — includes Head-to-Head */}
                  <li role="none">
                    <div
                      style={{
                        borderRadius: 8,
                        overflow: "hidden",
                        border: "1px solid #F1F5F9",
                      }}
                    >
                      <div
                        style={{
                          padding: "8px 12px 4px",
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          color: "#475569",
                          textTransform: "uppercase",
                          background: "#F8FAFC",
                        }}
                      >
                        Teams
                      </div>
                      <NavLink
                        to="/teams"
                        end
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-2 text-sm font-medium ${isActive ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-700"}`
                        }
                        onClick={() => setOpen(false)}
                      >
                        <Users size={15} aria-hidden="true" /> Team Registry
                      </NavLink>
                      <NavLink
                        to="/team-totals"
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-2 text-sm font-medium ${isActive ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-700"}`
                        }
                        onClick={() => setOpen(false)}
                      >
                        <BarChart3 size={15} aria-hidden="true" /> Team Totals
                      </NavLink>
                      <NavLink
                        to="/head-to-head"
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-2 text-sm font-medium ${isActive ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-700"}`
                        }
                        onClick={() => setOpen(false)}
                      >
                        <Swords size={15} aria-hidden="true" /> Head-to-Head
                      </NavLink>
                    </div>
                  </li>

                  <li role="none">
                    <NavLink
                      to="/compare"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${isActive ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-700"}`
                      }
                      onClick={() => setOpen(false)}
                    >
                      <ArrowLeftRight size={15} aria-hidden="true" /> Compare
                      Players
                    </NavLink>
                  </li>
                </ul>
              </nav>
            </Container>
          </div>
        )}
      </header>
    </>
  );
}
