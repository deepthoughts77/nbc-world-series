// src/layout/Nav.js
import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, ChevronDown, Users, BarChart3 } from "lucide-react";
import { Container } from "../components/common/Container";

export function Nav() {
  const linkBase =
    "px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors";
  const activeClass = ({ isActive }) =>
    (isActive ? "bg-white/15 text-white " : "text-white/80 ") + linkBase;

  const [open, setOpen] = useState(false);
  const [teamsDropdownOpen, setTeamsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setTeamsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

              {/* Teams dropdown */}
              <li className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setTeamsDropdownOpen((v) => !v)}
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
                    className={`transition-transform ${teamsDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {teamsDropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      borderRadius: 10,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      minWidth: 200,
                      zIndex: 100,
                      overflow: "hidden",
                    }}
                  >
                    {/* Arrow pointer */}
                    <div
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

                    <NavLink
                      to="/teams"
                      end
                      onClick={() => setTeamsDropdownOpen(false)}
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
                                color: "#94A3B8",
                                marginTop: 1,
                              }}
                            >
                              All teams & histories
                            </div>
                          </div>
                        </div>
                      )}
                    </NavLink>

                    <NavLink
                      to="/team-totals"
                      onClick={() => setTeamsDropdownOpen(false)}
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
                              background: "#F0FDF4",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
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
                                color: "#94A3B8",
                                marginTop: 1,
                              }}
                            >
                              Season batting & pitching
                            </div>
                          </div>
                        </div>
                      )}
                    </NavLink>
                  </div>
                )}
              </li>

              <li>
                <NavLink to="/hall-of-fame" className={activeClass}>
                  Hall of Fame
                </NavLink>
              </li>
              <li>
                <NavLink to="/archives" className={activeClass}>
                  Archives
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
              <li>
                <NavLink to="/leaders/pitching" className={activeClass}>
                  Leading Pitchers
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>

        {/* Mobile menu button */}
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
                  `px-3 py-2 rounded-lg ${isActive ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"}`
                }
                end
                onClick={() => setOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/championships"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg ${isActive ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"}`
                }
                onClick={() => setOpen(false)}
              >
                Championships
              </NavLink>

              {/* Mobile Teams section */}
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
                    color: "#94A3B8",
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
                    `flex items-center gap-2 px-3 py-2 ${isActive ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-700"}`
                  }
                  onClick={() => setOpen(false)}
                >
                  <Users size={15} /> Team Registry
                </NavLink>
                <NavLink
                  to="/team-totals"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 ${isActive ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-700"}`
                  }
                  onClick={() => setOpen(false)}
                >
                  <BarChart3 size={15} /> Team Totals
                </NavLink>
              </div>

              <NavLink
                to="/hall-of-fame"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg ${isActive ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"}`
                }
                onClick={() => setOpen(false)}
              >
                Hall of Fame
              </NavLink>
              <NavLink
                to="/archives"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg ${isActive ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"}`
                }
                onClick={() => setOpen(false)}
              >
                Archives
              </NavLink>
              <NavLink
                to="/records"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg ${isActive ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"}`
                }
                onClick={() => setOpen(false)}
              >
                Records
              </NavLink>
              <NavLink
                to="/player-stats"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg ${isActive ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"}`
                }
                onClick={() => setOpen(false)}
              >
                Player Stats
              </NavLink>
              <NavLink
                to="/leaders/pitching"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg ${isActive ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"}`
                }
                onClick={() => setOpen(false)}
              >
                Leading Pitchers
              </NavLink>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
