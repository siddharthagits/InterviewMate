import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const location = useLocation();
  const { theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  const isLight = theme === "light";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="navbar"
      style={{
        background: scrolled
          ? (isLight ? "rgba(240,244,255,0.96)" : "rgba(4,8,15,0.92)")
          : (isLight ? "rgba(240,244,255,0.78)" : "rgba(4,8,15,0.5)"),
        borderBottomColor: scrolled
          ? (isLight ? "rgba(124,58,237,0.2)" : "rgba(124,58,237,0.12)")
          : (isLight ? "rgba(15,23,42,0.08)" : "rgba(255,255,255,0.04)"),
        boxShadow: scrolled
          ? (isLight ? "0 4px 30px rgba(15,23,42,0.1)" : "0 4px 40px rgba(0,0,0,0.4)")
          : "none",
      }}
    >
      {/* Logo */}
      <Link to="/" className="navbar-logo">
        Interview<span style={{ color: "#fcd34d" }}>Mate</span>
      </Link>

      {/* Desktop Links */}
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <Link
          to="/mock-tests"
          className="nav-link"
          style={{ color: location.pathname === "/mock-tests" ? "var(--violet-light)" : undefined }}
        >
          Mock Tests
        </Link>
        <Link
          to="/question-bank"
          className="nav-link"
          style={{ color: location.pathname.startsWith("/question-bank") ? "#6ee7b7" : undefined }}
        >
          Question Bank
        </Link>
        <Link
          to="/company-assessment"
          className="nav-link"
          style={{ color: location.pathname === "/company-assessment" ? "var(--gold-light)" : undefined }}
        >
          Companies
        </Link>
        <Link
          to="/voice"
          className="nav-link"
          style={{
            color: location.pathname.startsWith("/voice") ? "#10b981" : undefined,
            display: "flex", alignItems: "center", gap: 5,
          }}
        >
          <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 18, height: 18,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="22"/>
            </svg>
          </span>
          Voice
        </Link>
        <Link
          to="/typing-test"
          className="nav-link"
          style={{
            color: location.pathname === "/typing-test" ? "var(--cyan)" : undefined,
            display: "flex", alignItems: "center", gap: 5,
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="6" width="20" height="12" rx="2"/>
              <line x1="6" y1="10" x2="6.01" y2="10" strokeWidth="2.5"/><line x1="10" y1="10" x2="10.01" y2="10" strokeWidth="2.5"/>
              <line x1="14" y1="10" x2="14.01" y2="10" strokeWidth="2.5"/><line x1="18" y1="10" x2="18.01" y2="10" strokeWidth="2.5"/>
              <line x1="6" y1="14" x2="6.01" y2="14" strokeWidth="2.5"/><line x1="18" y1="14" x2="18.01" y2="14" strokeWidth="2.5"/>
              <line x1="10" y1="14" x2="14" y2="14" strokeWidth="2.5"/>
            </svg>
          </span>
          Typing
        </Link>
        <Link
          to="/dashboard"
          className="nav-link"
          style={{ color: location.pathname === "/dashboard" ? "var(--violet-light)" : undefined }}
        >
          Dashboard
        </Link>
      </div>

      {/* CTA Buttons + Theme Toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <ThemeToggle />
        <Link
          to="/login"
          className="btn btn-outline"
          style={{ padding: "9px 20px", fontSize: 13, borderRadius: 12 }}
        >
          Login
        </Link>
        <Link
          to="/register"
          className="btn btn-primary"
          style={{ padding: "9px 20px", fontSize: 13, borderRadius: 12 }}
        >
          Get Started →
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
