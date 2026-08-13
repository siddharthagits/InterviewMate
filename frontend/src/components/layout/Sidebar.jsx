import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/* ── Reusable SVG icons ─────────────────────────────────────────────────────── */
const Ic = {
  home: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>
    </svg>
  ),
  dashboard: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  mockTest: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  practice: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
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
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>
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
  building: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M9 3v18"/><path d="M3 9h6"/><path d="M3 15h6"/><path d="M15 9h3"/><path d="M15 15h3"/>
    </svg>
  ),
  hr: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  ),
  setup: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  clock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <polyline points="12 8 12 12 14 14"/>
      <path d="M3.05 11a9 9 0 1 0 .5-4.5"/><polyline points="3 3 3 7 7 7"/>
    </svg>
  ),
  chart: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  user: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
};

/* ── Nav structure — mirrors navbar dropdowns ───────────────────────────────── */
const navGroups = [
  {
    label: "Prepare",
    links: [
      { to: "/practice",      icon: Ic.practice,  label: "Practice Corner", accent: "#f59e0b", matchPrefix: true },
      { to: "/mock-tests",    icon: Ic.mockTest,  label: "Mock Tests",      accent: "#c4b5fd" },
      { to: "/question-bank", icon: Ic.book,      label: "Question Bank",   accent: "#6ee7b7", matchPrefix: true },
    ],
  },
  {
    label: "AI Tools",
    links: [
      { to: "/voice",        icon: Ic.mic,      label: "Voice Interview",  accent: "#10b981", matchPrefix: true, badge: "AI" },
      { to: "/typing-test",  icon: Ic.keyboard, label: "Typing Test",      accent: "#06b6d4" },
      { to: "/setup",        icon: Ic.setup,    label: "Interview Setup",  accent: "#fcd34d" },
    ],
  },
  {
    label: "Resources",
    links: [
      { to: "/company-assessment", icon: Ic.building, label: "Companies", accent: "#fcd34d", matchPrefix: true },
      { to: "/hr-interview",       icon: Ic.hr,       label: "HR Guide",  accent: "#10b981" },
    ],
  },
  {
    label: "My Progress",
    links: [
      { to: "/history", icon: Ic.clock, label: "History", accent: "#f59e0b" },
      { to: "/reports", icon: Ic.chart, label: "Reports", accent: "#06b6d4" },
    ],
  },
];

/* ── Sidebar component ──────────────────────────────────────────────────────── */
function Sidebar({ isOpen, onToggle, onClose, isMobile }) {
  const { pathname } = useLocation();
  const { user, isLoggedIn } = useAuth();
  const initial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.email
      ? user.email.charAt(0).toUpperCase()
      : "G";

  const isActive = (link) =>
    link.matchPrefix
      ? pathname === link.to || pathname.startsWith(link.to + "/")
      : pathname === link.to;

  return (
    <aside className={`sidebar ${isOpen ? "open" : "collapsed"}${isMobile ? " mobile-drawer" : ""}`}>
      {/* Desktop floating edge toggle */}
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

      {/* Brand */}
      <div className="sidebar-brand-area">
        <Link to="/" className="sidebar-brand" style={{ textDecoration: "none" }} onClick={onClose} title="InterviewMate">
          {isOpen || isMobile ? (
            <>Interview<span style={{ color: "#fcd34d" }}>Mate</span></>
          ) : (
            <span className="sidebar-brand-initial">I</span>
          )}
        </Link>
        {isMobile && (
          <button type="button" className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">✕</button>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {/* Main / Core items: Home & Dashboard */}
        <div className="sidebar-group">
          <Link
            to="/"
            onClick={onClose}
            className={`sidebar-link${pathname === "/" ? " active" : ""}`}
            title={isOpen || isMobile ? undefined : "Home"}
          >
            <span className="sidebar-icon">{Ic.home}</span>
            {(isOpen || isMobile) && <span className="sidebar-link-label">Home</span>}
          </Link>

          <Link
            to="/dashboard"
            onClick={onClose}
            className={`sidebar-link${pathname === "/dashboard" ? " active" : ""}`}
            style={pathname === "/dashboard" ? {
              background: "rgba(196,181,253,0.12)",
              color: "#c4b5fd",
              border: "1px solid rgba(196,181,253,0.3)",
            } : undefined}
            title={isOpen || isMobile ? undefined : "Dashboard"}
          >
            <span className="sidebar-icon" style={pathname === "/dashboard" ? { color: "#c4b5fd" } : undefined}>
              {Ic.dashboard}
            </span>
            {(isOpen || isMobile) && <span className="sidebar-link-label">Dashboard</span>}
          </Link>
        </div>

        {/* Grouped sections */}
        {navGroups.map((group) => (
          <div key={group.label} className="sidebar-group">
            {/* Section label — only when expanded */}
            {(isOpen || isMobile) && (
              <div className="sidebar-group-label">{group.label}</div>
            )}
            {/* Collapsed: thin divider between groups */}
            {!isOpen && !isMobile && <div className="sidebar-group-divider" />}

            {group.links.map((link) => {
              const active = isActive(link);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={`sidebar-link${active ? " active" : ""}`}
                  style={active ? {
                    background: `${link.accent}18`,
                    color: link.accent,
                    border: `1px solid ${link.accent}35`,
                  } : undefined}
                  title={isOpen || isMobile ? undefined : link.label}
                >
                  <span className="sidebar-icon" style={active ? { color: link.accent } : undefined}>
                    {link.icon}
                  </span>
                  {(isOpen || isMobile) && (
                    <>
                      <span className="sidebar-link-label">{link.label}</span>
                      {link.badge && (
                        <span className="sidebar-link-badge">{link.badge}</span>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        ))}

        {/* Profile / Account */}
        <div className="sidebar-group">
          {(isOpen || isMobile) && <div className="sidebar-group-label">Account</div>}
          {!isOpen && !isMobile && <div className="sidebar-group-divider" />}
          <Link
            to="/profile"
            onClick={onClose}
            className={`sidebar-link${pathname === "/profile" ? " active" : ""}`}
            title={isOpen || isMobile ? undefined : "Profile"}
          >
            <span className="sidebar-icon">{Ic.user}</span>
            {(isOpen || isMobile) && <span className="sidebar-link-label">Profile</span>}
          </Link>
        </div>
      </nav>

      {/* Bottom user card */}
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
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--violet), var(--cyan))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 900, color: "#fff", flexShrink: 0,
            }}>
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
              width: 34, height: 34, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--violet), var(--cyan))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 900, color: "#fff",
              textDecoration: "none", margin: "0 auto",
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

