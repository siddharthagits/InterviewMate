import { useLocation, Link } from "react-router-dom";

const links = [
  { to: "/",          icon: "🏠", label: "Home" },
  { to: "/dashboard", icon: "⊞", label: "Dashboard" },
  { to: "/setup",     icon: "▶", label: "Start Interview" },
  { to: "/history",   icon: "◷", label: "History" },
  { to: "/reports",   icon: "◈", label: "Reports" },
  { to: "/profile",   icon: "◉", label: "Profile" },
];

function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar-logo" style={{ textDecoration:"none" }}>InterviewMate</Link>
      <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {links.map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`sidebar-link${pathname === to ? " active" : ""}`}
          >
            <span className="sidebar-icon">{icon}</span>
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;