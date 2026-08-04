import { useLocation, Link } from "react-router-dom";

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
};

const links = [
  { to: "/",                   icon: icons.home,     label: "Home" },
  { to: "/dashboard",          icon: icons.grid,     label: "Dashboard" },
  { to: "/setup",              icon: icons.play,     label: "Start Interview" },
  { to: "/voice",              icon: icons.mic,      label: "Voice Interview", green: true },
  { to: "/company-assessment", icon: icons.building, label: "Company Tests",  gold: true },
  { to: "/question-bank",      icon: icons.book,     label: "Question Bank" },
  { to: "/typing-test",        icon: icons.keyboard, label: "Typing Test",  cyan: true },
  { to: "/history",            icon: icons.clock,    label: "History" },
  { to: "/reports",            icon: icons.chart,    label: "Reports" },
  { to: "/profile",            icon: icons.user,     label: "Profile" },
];


function Sidebar({ isOpen, onToggle, onClose, isMobile }) {
  const { pathname } = useLocation();

  return (
    <aside className={`sidebar ${isOpen ? "open" : "collapsed"}${isMobile ? " mobile-drawer" : ""}`}>
      <div className="sidebar-brand-area">
        <Link to="/" className="sidebar-brand" style={{ textDecoration: "none" }} onClick={onClose}>
          Interview<span style={{ color: "#fcd34d" }}>Mate</span>
        </Link>

        {isMobile ? (
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        ) : (
          <button
            type="button"
            className="sidebar-toggle"
            onClick={onToggle}
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <span className="sidebar-toggle-dots">⋯</span>
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
                boxShadow: "0 0 16px rgba(16,185,129,0.1)",
              } : isActive && gold ? {
                background: "rgba(245,158,11,0.1)",
                color: "#f59e0b",
                border: "1px solid rgba(245,158,11,0.25)",
              } : isActive && cyan ? {
                background: "rgba(6,182,212,0.1)",
                color: "#06b6d4",
                border: "1px solid rgba(6,182,212,0.25)",
                boxShadow: "0 0 16px rgba(6,182,212,0.1)",
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
        <div style={{ marginTop: "auto", paddingTop: 24 }}>
          <div
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.06))",
              border: "1px solid rgba(124,58,237,0.2)",
              borderRadius: 14,
              padding: "14px 16px",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--violet-light)", marginBottom: 4 }}>
              Powered by
            </div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>
              Gemini AI ✨
            </div>
          </div>
        </div>
      ) : (
        <div className="sidebar-bottom-card collapsed" />
      )}
    </aside>
  );
}

export default Sidebar;