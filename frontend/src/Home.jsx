import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import "./Home.css";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const events = [
    { id: 1, title: "Music Concert", desc: "Live music by top artists.", date: "2025-06-01" },
    { id: 2, title: "Tech Conference", desc: "Latest in tech and innovation.", date: "2025-06-10" },
    { id: 3, title: "Art Expo", desc: "Modern art exhibition.", date: "2025-06-15" }
  ];
  const location = useLocation();

  // Remove duplicate toggleTheme and useEffect logic, as ThemeProvider handles it

  return (
    <div className="main-home">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/" className="navbar-brand">Event Ticketing</Link>
        </div>
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label="Toggle light/dark mode"
        >
          {theme === "dark" ? "🌞" : "🌙"}
        </button>
        <ul className="navbar-links">
          <li>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
          </li>
          <li>
            <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>Login</Link>
          </li>
          <li>
            <Link to="/register" className={location.pathname === "/register" ? "active" : ""}>Register</Link>
          </li>
        </ul>
      </nav>

      <section className="events-section">
        <h2>Upcoming Events</h2>
        <div className="events-list">
          {events.map(event => (
            <div className="event-card" key={event.id}>
              <h3>{event.title}</h3>
              <p>{event.desc}</p>
              <span>{event.date}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}