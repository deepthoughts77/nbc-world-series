import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Container } from "../components/common/Container";

export function Nav() {
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
