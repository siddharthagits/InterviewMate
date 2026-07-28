import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
          ? "rgba(4,8,15,0.92)"
          : "rgba(4,8,15,0.5)",
        borderBottomColor: scrolled
          ? "rgba(124,58,237,0.12)"
          : "rgba(255,255,255,0.04)",
        boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.4)" : "none",
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
          to="/company-assessment"
          className="nav-link"
          style={{ color: location.pathname === "/company-assessment" ? "var(--gold-light)" : undefined }}
        >
          🏢 Companies
        </Link>
        <Link
          to="/dashboard"
          className="nav-link"
          style={{ color: location.pathname === "/dashboard" ? "var(--violet-light)" : undefined }}
        >
          Dashboard
        </Link>
      </div>

      {/* CTA Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
