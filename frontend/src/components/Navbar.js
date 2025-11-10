import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = darkMode ? "light" : "dark";
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <header className={`navbar ${darkMode ? "dark" : ""}`}>
      <div className="nav-container">
        <div className="brand">
          <div className="logo">NBC</div>
          <div className="title">
            <h1>World Series</h1>
            <p>Since 1935</p>
          </div>
        </div>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          <Link to="/">Home</Link>
          <Link to="/championships">Championships</Link>
          <Link to="/teams">Teams</Link>
          <Link to="/players">Players</Link>
          <Link to="/player-stats">Player Stats</Link>
          <Link to="/hall-of-fame">Hall of Fame</Link>
        </nav>

        <div className="actions">
          <button className="theme-btn" onClick={toggleTheme}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <button className="menu-btn" onClick={() => setOpen(!open)}>
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
