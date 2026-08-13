import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "./ThemeToggle";
import Sidebar from "./layout/Sidebar";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

/* ─── SVG Icons ────────────────────────────────────────────────────────────── */
const Icon = {
  mockTests: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  practice: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
  questionBank: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  companies: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M9 3v18"/><path d="M3 9h6"/><path d="M3 15h6"/>
      <path d="M15 9h3"/><path d="M15 15h3"/>
    </svg>
  ),
  voice: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="22"/>
    </svg>
  ),
  typing: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2"/>
      <line x1="6" y1="10" x2="6.01" y2="10" strokeWidth="2.5"/>
      <line x1="10" y1="10" x2="10.01" y2="10" strokeWidth="2.5"/>
      <line x1="14" y1="10" x2="14.01" y2="10" strokeWidth="2.5"/>
      <line x1="18" y1="10" x2="18.01" y2="10" strokeWidth="2.5"/>
      <line x1="6" y1="14" x2="6.01" y2="14" strokeWidth="2.5"/>
      <line x1="18" y1="14" x2="18.01" y2="14" strokeWidth="2.5"/>
      <line x1="10" y1="14" x2="14" y2="14" strokeWidth="2.5"/>
    </svg>
  ),
  hr: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  about: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  ),
  dashboard: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  setup: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  history: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="12 8 12 12 14 14"/>
      <path d="M3.05 11a9 9 0 1 0 .5-4.5"/>
      <polyline points="3 3 3 7 7 7"/>
    </svg>
  ),
  reports: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  chevron: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
};

/* ─── Dropdown component ────────────────────────────────────────────────────── */
function DropdownMenu({ label, items, accentColor, isAnyActive, onLinkClick }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="nav-dropdown" ref={ref}>
      <button
        className={`nav-dropdown-trigger ${isAnyActive ? "active" : ""}`}
        style={{ "--dd-accent": accentColor }}
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
        <span className={`nav-dropdown-chevron ${open ? "open" : ""}`}>
          {Icon.chevron}
        </span>
      </button>

      <div className={`nav-dropdown-panel ${open ? "open" : ""}`}>
        <div className="nav-dropdown-inner">
          {items.map((item) =>
            item.isHash ? (
              <a
                key={item.to}
                href={item.to}
                className={`nav-dropdown-item ${item.isActive ? "active" : ""}`}
                style={{ "--item-accent": item.color }}
                onClick={(e) => { setOpen(false); onLinkClick(item, e); }}
              >
                <span className="nav-dropdown-item-icon">{item.icon}</span>
                <span className="nav-dropdown-item-text">
                  <span className="nav-dropdown-item-label">{item.label}</span>
                  {item.desc && <span className="nav-dropdown-item-desc">{item.desc}</span>}
                </span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </a>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className={`nav-dropdown-item ${item.isActive ? "active" : ""}`}
                style={{ "--item-accent": item.color }}
                onClick={(e) => { setOpen(false); onLinkClick(item, e); }}
              >
                <span className="nav-dropdown-item-icon">{item.icon}</span>
                <span className="nav-dropdown-item-text">
                  <span className="nav-dropdown-item-label">{item.label}</span>
                  {item.desc && <span className="nav-dropdown-item-desc">{item.desc}</span>}
                </span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Navbar ───────────────────────────────────────────────────────────── */
function Navbar() {
  const location = useLocation();
  const { theme } = useTheme();
  const { user, isLoggedIn } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileOpenGroup, setMobileOpenGroup] = useState(null);
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);

  const isLight = theme === "light";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileOpenGroup(null);
    setSidebarDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = (mobileMenuOpen || sidebarDrawerOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen, sidebarDrawerOpen]);

  /* ── Nav groups ── */
  const navGroups = [
    {
      label: "Prepare",
      accent: "var(--violet-light)",
      items: [
        {
          to: "/mock-tests",
          label: "Mock Tests",
          desc: "Full-length interview simulations",
          color: "var(--violet-light)",
          isActive: location.pathname === "/mock-tests",
          icon: Icon.mockTests,
        },
        {
          to: "/question-bank",
          label: "Question Bank",
          desc: "Browse thousands of curated Q&As",
          color: "#6ee7b7",
          isActive: location.pathname.startsWith("/question-bank"),
          icon: Icon.questionBank,
        },
      ],
    },
    {
      label: "AI Tools",
      accent: "#10b981",
      items: [
        {
          to: "/voice",
          label: "Voice Interview",
          desc: "AI-powered spoken interview practice",
          color: "#10b981",
          isActive: location.pathname.startsWith("/voice"),
          badge: "AI",
          icon: Icon.voice,
        },
        {
          to: "/typing-test",
          label: "Typing Test",
          desc: "Measure and improve your WPM",
          color: "var(--cyan)",
          isActive: location.pathname === "/typing-test",
          icon: Icon.typing,
        },
        {
          to: "/setup",
          label: "Interview Setup",
          desc: "Configure a new AI interview session",
          color: "var(--gold-light)",
          isActive: location.pathname === "/setup",
          icon: Icon.setup,
        },
      ],
    },
    {
      label: "Resources",
      accent: "#38bdf8",
      items: [
        {
          to: "/company-assessment",
          label: "Companies",
          desc: "Company-specific interview tracks",
          color: "var(--gold-light)",
          isActive: location.pathname === "/company-assessment",
          icon: Icon.companies,
        },
        {
          to: "/hr-interview",
          label: "HR Guide",
          desc: "Behavioral & soft-skills playbook",
          color: "#10b981",
          isActive: location.pathname === "/hr-interview",
          icon: Icon.hr,
        },
        {
          to: "/#about",
          label: "About",
          desc: "Learn more about InterviewMate",
          color: "#38bdf8",
          isActive: false,
          isHash: true,
          icon: Icon.about,
        },
      ],
    },
    {
      label: "My Progress",
      accent: "var(--gold-light)",
      items: [
        {
          to: "/history",
          label: "History",
          desc: "Review past interview sessions",
          color: "#f59e0b",
          isActive: location.pathname === "/history",
          icon: Icon.history,
        },
        {
          to: "/reports",
          label: "Reports",
          desc: "Detailed performance analytics",
          color: "#06b6d4",
          isActive: location.pathname === "/reports",
          icon: Icon.reports,
        },
      ],
    },
  ];

  const practiceLink = {
    to: "/practice",
    isActive: location.pathname.startsWith("/practice"),
  };

  const dashboardLink = {
    to: "/dashboard",
    isActive: location.pathname === "/dashboard",
  };

  const handleNavClick = (item, e) => {
    setMobileMenuOpen(false);
    if (item.isHash && location.pathname === "/") {
      e.preventDefault();
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleMobileGroup = (label) =>
    setMobileOpenGroup((prev) => (prev === label ? null : label));

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

        {/* Desktop: dropdown groups + standalone Practice & Dashboard */}
        <div className="navbar-links-desktop">
          <Link
            to={practiceLink.to}
            className="nav-link"
            style={{
              color: practiceLink.isActive ? "#f59e0b" : undefined,
              fontWeight: practiceLink.isActive ? 700 : undefined,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Practice
          </Link>
          {navGroups.map((group) => (
            <DropdownMenu
              key={group.label}
              label={group.label}
              items={group.items}
              accentColor={group.accent}
              isAnyActive={group.items.some((i) => i.isActive)}
              onLinkClick={handleNavClick}
            />
          ))}
          <Link
            to={dashboardLink.to}
            className="nav-link"
            style={{
              color: dashboardLink.isActive ? "var(--violet-light)" : undefined,
              fontWeight: dashboardLink.isActive ? 700 : undefined,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Dashboard
          </Link>
        </div>

        {/* Desktop CTA */}
        <div className="navbar-cta-desktop">
          <ThemeToggle />
          {isLoggedIn && user ? (
            <>
              <Link
                to="/profile"
                className="btn btn-outline"
                style={{ padding: "6px 14px", fontSize: 12.5, borderRadius: 12, display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--violet)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900 }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>
                <span>{user.name || user.email.split("@")[0]}</span>
              </Link>
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: "8px 18px", fontSize: 13, borderRadius: 12 }}>
                Dashboard →
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{ padding: "8px 18px", fontSize: 13, borderRadius: 12 }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: "8px 20px", fontSize: 13, borderRadius: 12 }}>Get Started →</Link>
            </>
          )}
        </div>

        {/* Mobile actions */}
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

      {/* Floating Sidebar Navigation Toggle Button (positioned directly below InterviewMate logo) */}
      {!sidebarDrawerOpen && (
        <button
          type="button"
          className="navbar-floating-sidebar-btn"
          onClick={() => setSidebarDrawerOpen(true)}
          aria-label="Open sidebar navigation"
          title="Open Navigation Sidebar"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="9" y1="3" x2="9" y2="21"/>
            <path d="M14 9l3 3-3 3"/>
          </svg>
          <span className="navbar-floating-sidebar-label">Sidebar</span>
        </button>
      )}

      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          className="navbar-mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`navbar-mobile-drawer ${mobileMenuOpen ? "open" : ""}`}
        style={{
          background: isLight ? "rgba(240,244,255,0.98)" : "rgba(6,11,21,0.98)",
          borderColor: isLight ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.08)",
        }}
      >
        <div className="navbar-mobile-drawer-inner">
          {/* Standalone Practice */}
          <Link
            to="/practice"
            className={`navbar-mobile-link${practiceLink.isActive ? " active" : ""}`}
            style={{ color: practiceLink.isActive ? "#f59e0b" : undefined }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="navbar-mobile-link-icon">{Icon.practice}</span>
            <span className="navbar-mobile-link-label">Practice</span>
            {practiceLink.isActive && <span className="navbar-mobile-active-dot" />}
          </Link>

          {navGroups.map((group) => {
            const isOpen = mobileOpenGroup === group.label;
            const groupActive = group.items.some((i) => i.isActive);
            return (
              <div key={group.label} className="navbar-mobile-group">
                <button
                  className={`navbar-mobile-group-header ${groupActive ? "active" : ""}`}
                  onClick={() => toggleMobileGroup(group.label)}
                  style={{ "--g-accent": group.accent }}
                >
                  <span className="navbar-mobile-group-label">{group.label}</span>
                  <span className={`navbar-mobile-group-chevron ${isOpen ? "open" : ""}`}>
                    {Icon.chevron}
                  </span>
                </button>
                <div className={`navbar-mobile-group-items ${isOpen ? "open" : ""}`}>
                  {group.items.map((item) =>
                    item.isHash ? (
                      <a
                        key={item.to}
                        href={item.to}
                        className={`navbar-mobile-link ${item.isActive ? "active" : ""}`}
                        style={{ color: item.isActive ? item.color : undefined, paddingLeft: 28 }}
                        onClick={(e) => handleNavClick(item, e)}
                      >
                        <span className="navbar-mobile-link-icon">{item.icon}</span>
                        <span className="navbar-mobile-link-label">{item.label}</span>
                        {item.badge && <span className="nav-badge">{item.badge}</span>}
                        {item.isActive && <span className="navbar-mobile-active-dot" />}
                      </a>
                    ) : (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`navbar-mobile-link ${item.isActive ? "active" : ""}`}
                        style={{ color: item.isActive ? item.color : undefined, paddingLeft: 28 }}
                        onClick={(e) => handleNavClick(item, e)}
                      >
                        <span className="navbar-mobile-link-icon">{item.icon}</span>
                        <span className="navbar-mobile-link-label">{item.label}</span>
                        {item.badge && <span className="nav-badge">{item.badge}</span>}
                        {item.isActive && <span className="navbar-mobile-active-dot" />}
                      </Link>
                    )
                  )}
                </div>
              </div>
            );
          })}

          {/* Standalone Dashboard */}
          <Link
            to="/dashboard"
            className={`navbar-mobile-link${dashboardLink.isActive ? " active" : ""}`}
            style={{ color: dashboardLink.isActive ? "var(--violet-light)" : undefined }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="navbar-mobile-link-icon">{Icon.dashboard}</span>
            <span className="navbar-mobile-link-label">Dashboard</span>
            {dashboardLink.isActive && <span className="navbar-mobile-active-dot" />}
          </Link>

          <div className="navbar-mobile-divider" />


          <div className="navbar-mobile-auth">
            {isLoggedIn && user ? (
              <>
                <Link
                  to="/profile"
                  className="btn btn-outline"
                  style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 14, borderRadius: 12 }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  👤 {user.name || user.email}
                </Link>
                <Link
                  to="/dashboard"
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 14, borderRadius: 12 }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Go to Dashboard →
                </Link>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Navigation Drawer Backdrop */}
      {sidebarDrawerOpen && (
        <div
          className="navbar-sidebar-backdrop"
          onClick={() => setSidebarDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-out Sidebar Navigation Drawer */}
      <Sidebar
        isOpen={sidebarDrawerOpen}
        onToggle={() => setSidebarDrawerOpen((p) => !p)}
        onClose={() => setSidebarDrawerOpen(false)}
        isMobile={true}
      />
    </>
  );
}

export default Navbar;

