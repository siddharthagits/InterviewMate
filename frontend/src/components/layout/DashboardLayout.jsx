import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import ThemeToggle from "../ThemeToggle";

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(typeof window !== "undefined" ? window.innerWidth >= 768 : true);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      if (desktop) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    if (!isDesktop) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isDesktop]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen && !isDesktop) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen, isDesktop]);

  return (
    <div className="dashboard-layout">
      {/* Mobile Top Navigation Bar */}
      <div className="dashboard-mobile-topbar">
        <button
          type="button"
          className={`dashboard-mobile-menu-btn ${sidebarOpen ? "active" : ""}`}
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          aria-expanded={sidebarOpen}
        >
          <span className="hamburger-line top" />
          <span className="hamburger-line middle" />
          <span className="hamburger-line bottom" />
        </button>

        <Link to="/" className="sidebar-brand" style={{ textDecoration: "none", fontSize: 18 }}>
          Interview<span style={{ color: "#fcd34d" }}>Mate</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ThemeToggle />
        </div>
      </div>

      {/* Backdrop for mobile drawer */}
      {sidebarOpen && !isDesktop && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        onClose={() => { if (!isDesktop) setSidebarOpen(false); }}
        isMobile={!isDesktop}
      />

      <main className="dashboard-main">
        {/* Desktop Top Bar with Theme Toggle on top right */}
        {isDesktop && (
          <div className="dashboard-desktop-topbar">
            <ThemeToggle />
          </div>
        )}
        <div className="dashboard-content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;