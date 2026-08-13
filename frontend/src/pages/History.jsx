import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getStoredActivities } from "../utils/activityTracker";
import { useAuth } from "../context/AuthContext";

function perfColor(score) {
  if (score >= 85) return "#10b981";
  if (score >= 70) return "#7c3aed";
  if (score >= 55) return "#f59e0b";
  return "#ef4444";
}

function formatTimeAgo(timestamp) {
  if (!timestamp) return "Recently";
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function History() {
  const nav = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [activities, setActivities] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    setActivities(getStoredActivities());
    const handleUpdate = () => setActivities(getStoredActivities());
    window.addEventListener("im_activity_updated", handleUpdate);
    window.addEventListener("im_auth_changed", handleUpdate);
    return () => {
      window.removeEventListener("im_activity_updated", handleUpdate);
      window.removeEventListener("im_auth_changed", handleUpdate);
    };
  }, [user]);

  const filtered = activities.filter((a) => {
    if (activeFilter === "all") return true;
    return a.type === activeFilter;
  });

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(124,58,237,0.1)",
            border: "1px solid rgba(124,58,237,0.25)",
            borderRadius: 99,
            padding: "4px 14px",
            marginBottom: 12,
            fontSize: 11,
            color: "var(--violet-light)",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          ⏱️ Complete Session Logs
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 6, letterSpacing: "-0.5px" }}>
          Activity &amp; Test History
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          {isLoggedIn && user
            ? `Comprehensive record of all tests, voice interviews, and practice sessions for ${user.name || user.email}.`
            : "Comprehensive real-time records of all completed interviews and practice sessions."}
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
        {[
          { id: "all", label: "All Records" },
          { id: "technical", label: "💻 Technical" },
          { id: "voice", label: "🎙️ Voice AI" },
          { id: "company", label: "🏢 Company Exams" },
          { id: "typing", label: "⌨️ Typing" },
          { id: "subject", label: "📚 CS Bank" },
          { id: "practice", label: "🧠 Practice" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            style={{
              padding: "7px 16px",
              borderRadius: 99,
              fontSize: 12.5,
              fontWeight: 700,
              cursor: "pointer",
              border: activeFilter === tab.id ? "1px solid var(--violet-light)" : "1px solid var(--glass-border)",
              background: activeFilter === tab.id ? "var(--violet)" : "rgba(255,255,255,0.03)",
              color: activeFilter === tab.id ? "#fff" : "var(--text-muted)",
              transition: "all 0.2s ease",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* History Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.length === 0 ? (
          <div className="glass" style={{ padding: "48px 30px", textAlign: "center", borderRadius: 20 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>
              {activities.length === 0 ? "No Test History Recorded Yet (Nil)" : "No Activities Found for this Filter"}
            </h3>
            <p style={{ fontSize: 13.5, color: "var(--text-muted)", maxWidth: 460, margin: "0 auto 22px auto" }}>
              {activities.length === 0
                ? "Your activity history starts clean. Take a mock interview, voice session, or company test to start logging your real scores."
                : "Try selecting another category or take a new test in this track."}
            </p>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12 }}>
              <Link to="/setup" className="btn btn-primary" style={{ padding: "9px 20px", fontSize: 13 }}>
                Start Mock Interview →
              </Link>
              <Link to="/voice" className="btn btn-gold" style={{ padding: "9px 20px", fontSize: 13 }}>
                Voice AI Interview →
              </Link>
              <Link to="/typing-test" className="btn btn-outline" style={{ padding: "9px 20px", fontSize: 13 }}>
                Typing Test →
              </Link>
            </div>
          </div>
        ) : (
          filtered.map((act) => {
            const scoreCol = perfColor(act.score);
            return (
              <div
                key={act.id}
                className="glass"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                  padding: "20px 24px",
                  borderRadius: 16,
                  border: "1px solid var(--glass-border)",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: `${act.color || "#7c3aed"}18`,
                      border: `1px solid ${act.color || "#7c3aed"}35`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                    }}
                  >
                    {act.icon || "📄"}
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: "var(--text)" }}>
                        {act.title}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: act.color || "#7c3aed",
                          background: `${act.color || "#7c3aed"}15`,
                          padding: "2px 8px",
                          borderRadius: 99,
                          border: `1px solid ${act.color || "#7c3aed"}30`,
                        }}
                      >
                        {act.category}
                      </span>
                    </div>

                    <div style={{ fontSize: 12.5, color: "var(--text-muted)", display: "flex", gap: 12, flexWrap: "wrap" }}>
                      <span>🕒 {formatTimeAgo(act.timestamp)}</span>
                      {act.metrics &&
                        Object.entries(act.metrics).map(([k, v]) => (
                          <span key={k}>
                            • <strong style={{ color: "var(--text-dim)", textTransform: "capitalize" }}>{k}:</strong> {v}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: scoreCol, fontFamily: "'Sora', sans-serif" }}>
                      {act.score}%
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 600 }}>
                      {act.badge || "Recorded"}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (act.type === "technical") nav("/setup");
                      else if (act.type === "voice") nav("/voice");
                      else if (act.type === "company") nav("/company-assessment");
                      else if (act.type === "typing") nav("/typing-test");
                      else if (act.type === "subject") nav("/question-bank");
                      else nav("/practice");
                    }}
                    className="btn btn-outline"
                    style={{ padding: "8px 16px", fontSize: 13 }}
                  >
                    Practice Again →
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}

export default History;
