import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// SVG Icons for sidebar
const icons = {
  home: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>
    </svg>
  ),
  grid: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  play: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none"/>
    </svg>
  ),
  clock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
    </svg>
  ),
  chart: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
      <line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  user: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  building: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M9 3v18"/><path d="M3 9h6"/><path d="M3 15h6"/><path d="M15 9h3"/><path d="M15 15h3"/>
    </svg>
  ),
  book: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  mic: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="22"/>
    </svg>
  ),
  keyboard: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2"/>
      <line x1="6" y1="10" x2="6" y2="10"/><line x1="10" y1="10" x2="10" y2="10"/>
      <line x1="14" y1="10" x2="14" y2="10"/><line x1="18" y1="10" x2="18" y2="10"/>
      <line x1="6" y1="14" x2="6" y2="14"/><line x1="18" y1="14" x2="18" y2="14"/>
      <line x1="10" y1="14" x2="14" y2="14"/>
    </svg>
  ),
  practice: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
};

const links = [
  { to: "/",                   icon: icons.home,     label: "Home" },
  { to: "/dashboard",          icon: icons.grid,     label: "Dashboard" },
  { to: "/setup",              icon: icons.play,     label: "Start Interview" },
  { to: "/voice",              icon: icons.mic,      label: "Voice Interview", green: true },
  { to: "/company-assessment", icon: icons.building, label: "Company Tests",  gold: true },
  { to: "/question-bank",      icon: icons.book,     label: "Question Bank" },
  { to: "/practice",           icon: icons.practice, label: "Practice Corner" },
  { to: "/typing-test",        icon: icons.keyboard, label: "Typing Test",  cyan: true },
  { to: "/history",            icon: icons.clock,    label: "History" },
  { to: "/reports",            icon: icons.chart,    label: "Reports" },
  { to: "/profile",            icon: icons.user,     label: "Profile" },
];


function Sidebar({ isOpen, onToggle, onClose, isMobile }) {
  const { pathname } = useLocation();
  const { user, isLoggedIn } = useAuth();
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : "G");

  return (
    <aside className={`sidebar ${isOpen ? "open" : "collapsed"}${isMobile ? " mobile-drawer" : ""}`}>
      {/* Desktop floating circular edge toggle button */}
      {!isMobile && (
        <button
          type="button"
          className="sidebar-edge-toggle"
          onClick={onToggle}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          )}
        </button>
      )}

      <div className="sidebar-brand-area">
        <Link
          to="/"
          className="sidebar-brand"
          style={{ textDecoration: "none" }}
          onClick={onClose}
          title="InterviewMate"
        >
          {isOpen || isMobile ? (
            <>
              Interview<span style={{ color: "#fcd34d" }}>Mate</span>
            </>
          ) : (
            <span className="sidebar-brand-initial">I</span>
          )}
        </Link>

        {isMobile && (
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        {links.map(({ to, icon, label, green, gold, cyan }) => {
          const isActive = pathname === to || (to !== "/" && pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className={`sidebar-link${isActive ? " active" : ""}`}
              style={isActive && green ? {
                background: "rgba(16,185,129,0.12)",
                color: "#10b981",
                border: "1px solid rgba(16,185,129,0.25)",
              } : isActive && gold ? {
                background: "rgba(245,158,11,0.1)",
                color: "#f59e0b",
                border: "1px solid rgba(245,158,11,0.25)",
              } : isActive && cyan ? {
                background: "rgba(6,182,212,0.1)",
                color: "#06b6d4",
                border: "1px solid rgba(6,182,212,0.25)",
              } : undefined}
              title={isOpen || isMobile ? undefined : label}
            >
              <span className="sidebar-icon">{icon}</span>
              {(isOpen || isMobile) && <span className="sidebar-link-label">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {(isOpen || isMobile) ? (
        <div style={{ marginTop: "auto", paddingTop: 18 }}>
          <Link
            to="/profile"
            onClick={onClose}
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--glass-border)",
              borderRadius: 14,
              padding: "10px 14px",
              transition: "all 0.2s ease",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--violet), var(--cyan))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 900,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {initial}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text)", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                {isLoggedIn && user ? (user.name || user.email.split("@")[0]) : "Guest User"}
              </div>
              <div style={{ fontSize: 11, color: isLoggedIn ? "#10b981" : "var(--text-dim)", fontWeight: 600 }}>
                {isLoggedIn ? "● Active Credentials" : "○ Nil Mode"}
              </div>
            </div>
          </Link>
        </div>
      ) : (
        <div className="sidebar-bottom-card collapsed">
          <Link
            to="/profile"
            title={isLoggedIn && user ? (user.name || user.email) : "Profile"}
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--violet), var(--cyan))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 900,
              color: "#fff",
              textDecoration: "none",
              margin: "0 auto",
            }}
          >
            {initial}
          </Link>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;