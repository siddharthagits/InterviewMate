import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const location = useLocation();
  const { theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLight = theme === "light";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile drawer whenever location / route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    {
      to: "/mock-tests",
      label: "Mock Tests",
      activeColor: "var(--violet-light)",
      isActive: location.pathname === "/mock-tests",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      )
    },
    {
      to: "/question-bank",
      label: "Question Bank",
      activeColor: "#6ee7b7",
      isActive: location.pathname.startsWith("/question-bank"),
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
      )
    },
    {
      to: "/company-assessment",
      label: "Companies",
      activeColor: "var(--gold-light)",
      isActive: location.pathname === "/company-assessment",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M9 3v18"/><path d="M3 9h6"/><path d="M3 15h6"/><path d="M15 9h3"/><path d="M15 15h3"/>
        </svg>
      )
    },
    {
      to: "/voice",
      label: "Voice",
      activeColor: "#10b981",
      isActive: location.pathname.startsWith("/voice"),
      badge: "AI",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="22"/>
        </svg>
      )
    },
    {
      to: "/typing-test",
      label: "Typing",
      activeColor: "var(--cyan)",
      isActive: location.pathname === "/typing-test",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="6" width="20" height="12" rx="2"/>
          <line x1="6" y1="10" x2="6.01" y2="10" strokeWidth="2.5"/><line x1="10" y1="10" x2="10.01" y2="10" strokeWidth="2.5"/>
          <line x1="14" y1="10" x2="14.01" y2="10" strokeWidth="2.5"/><line x1="18" y1="10" x2="18.01" y2="10" strokeWidth="2.5"/>
          <line x1="6" y1="14" x2="6.01" y2="14" strokeWidth="2.5"/><line x1="18" y1="14" x2="18.01" y2="14" strokeWidth="2.5"/>
          <line x1="10" y1="14" x2="14" y2="14" strokeWidth="2.5"/>
        </svg>
      )
    },
    {
      to: "/dashboard",
      label: "Dashboard",
      activeColor: "var(--violet-light)",
      isActive: location.pathname === "/dashboard",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
        </svg>
      )
    },
  ];

  return (
    <>
      <nav
        className="navbar"
        style={{
          background: scrolled || mobileMenuOpen
            ? (isLight ? "rgba(240,244,255,0.96)" : "rgba(4,8,15,0.95)")
            : (isLight ? "rgba(240,244,255,0.85)" : "rgba(4,8,15,0.7)"),
          borderBottomColor: scrolled || mobileMenuOpen
            ? (isLight ? "rgba(124,58,237,0.2)" : "rgba(124,58,237,0.15)")
            : (isLight ? "rgba(15,23,42,0.08)" : "rgba(255,255,255,0.05)"),
          boxShadow: scrolled || mobileMenuOpen
            ? (isLight ? "0 4px 30px rgba(15,23,42,0.1)" : "0 4px 40px rgba(0,0,0,0.5)")
            : "none",
        }}
      >
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
          Interview<span style={{ color: "#fcd34d" }}>Mate</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="navbar-links-desktop">
          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="nav-link"
              style={{
                color: item.isActive ? item.activeColor : undefined,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {item.label}
              {item.badge && (
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    padding: "1px 5px",
                    borderRadius: 99,
                    background: "rgba(16,185,129,0.15)",
                    color: "#34d399",
                    border: "1px solid rgba(16,185,129,0.3)",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Desktop CTA Buttons & Theme Toggle */}
        <div className="navbar-cta-desktop">
          <ThemeToggle />
          <Link
            to="/login"
            className="btn btn-outline"
            style={{ padding: "8px 18px", fontSize: 13, borderRadius: 12 }}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="btn btn-primary"
            style={{ padding: "8px 20px", fontSize: 13, borderRadius: 12 }}
          >
            Get Started →
          </Link>
        </div>

        {/* Mobile Header Actions (Theme Toggle + Hamburger Button) */}
        <div className="navbar-mobile-actions">
          <ThemeToggle />
          <button
            type="button"
            className={`navbar-hamburger-btn ${mobileMenuOpen ? "active" : ""}`}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            <span className="hamburger-line top" />
            <span className="hamburger-line middle" />
            <span className="hamburger-line bottom" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="navbar-mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Drawer */}
      <div
        className={`navbar-mobile-drawer ${mobileMenuOpen ? "open" : ""}`}
        style={{
          background: isLight ? "rgba(240,244,255,0.98)" : "rgba(6,11,21,0.98)",
          borderColor: isLight ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.08)",
        }}
      >
        <div className="navbar-mobile-drawer-inner">
          <div className="navbar-mobile-links">
            {navLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`navbar-mobile-link ${item.isActive ? "active" : ""}`}
                style={{
                  color: item.isActive ? item.activeColor : undefined,
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="navbar-mobile-link-icon">{item.icon}</span>
                <span className="navbar-mobile-link-label">{item.label}</span>
                {item.badge && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: "2px 7px",
                      borderRadius: 99,
                      background: "rgba(16,185,129,0.15)",
                      color: "#34d399",
                      border: "1px solid rgba(16,185,129,0.3)",
                      marginLeft: "auto",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
                {item.isActive && <span className="navbar-mobile-active-dot" />}
              </Link>
            ))}
          </div>

          <div className="navbar-mobile-divider" />

          {/* Mobile Auth Actions */}
          <div className="navbar-mobile-auth">
            <Link
              to="/login"
              className="btn btn-outline"
              style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 14, borderRadius: 12 }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 14, borderRadius: 12 }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
