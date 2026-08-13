import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PerformanceGraph from "../components/dashboard/PerformanceGraph";
import { useInterview } from "../context/InterviewContext";
import { useAuth } from "../context/AuthContext";
import { getStoredActivities, calculateOverallStats } from "../utils/activityTracker";

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

function Dashboard() {
  const nav = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { result } = useInterview();
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const load = () => {
      const stored = getStoredActivities();
      setActivities(stored);
    };
    load();
    window.addEventListener("im_activity_updated", load);
    window.addEventListener("im_auth_changed", load);
    return () => {
      window.removeEventListener("im_activity_updated", load);
      window.removeEventListener("im_auth_changed", load);
    };
  }, [user]);

  const stats = calculateOverallStats(activities);
  const composite = stats.compositeScore;

  const filteredActivities = activities.filter((act) => {
    if (activeTab === "all") return true;
    return act.type === activeTab;
  });

  const domainCards = [
    {
      id: "technical",
      title: "Technical Interviews",
      icon: "💻",
      score: stats.domains.technical.score,
      desc: "Full stack, DSA & MCQs",
      route: "/setup",
      btnText: "New Interview",
      color: "#7c3aed",
      badge: `${stats.domains.technical.count} Sessions`,
      statHighlight: stats.domains.technical.count > 0 ? `${stats.domains.technical.score}% Avg` : "Nil",
    },
    {
      id: "voice",
      title: "Voice AI Interviewer",
      icon: "🎙️",
      score: stats.domains.voice.score,
      desc: "Real-time speech & clarity",
      route: "/voice",
      btnText: "Start Voice AI",
      color: "#06b6d4",
      badge: `${stats.domains.voice.count} Sessions`,
      statHighlight: stats.domains.voice.count > 0 ? stats.voiceClarity : "Nil",
    },
    {
      id: "company",
      title: "Company Assessments",
      icon: "🏢",
      score: stats.domains.company.score,
      desc: "TCS, Infosys, Amazon & more",
      route: "/company-assessment",
      btnText: "Take Exam",
      color: "#f59e0b",
      badge: `${stats.domains.company.count} Exams`,
      statHighlight: stats.domains.company.count > 0 ? `${stats.domains.company.score}% Pass Rate` : "Nil",
    },
    {
      id: "typing",
      title: "Typing Speed Test",
      icon: "⌨️",
      score: stats.domains.typing.score,
      desc: "Live WPM & accuracy tracker",
      route: "/typing-test",
      btnText: "Speed Test",
      color: "#10b981",
      badge: `${stats.domains.typing.count} Tests`,
      statHighlight: stats.domains.typing.count > 0 ? stats.peakTypingWpm : "Nil",
    },
    {
      id: "subject",
      title: "CS Question Bank",
      icon: "📚",
      score: stats.domains.subject.score,
      desc: "OS, DBMS, CN, OOPs & DSA",
      route: "/question-bank",
      btnText: "Explore Bank",
      color: "#ec4899",
      badge: `${stats.domains.subject.count} Quizzes`,
      statHighlight: stats.domains.subject.count > 0 ? `${stats.domains.subject.score}% Accuracy` : "Nil",
    },
    {
      id: "practice",
      title: "Practice Corner",
      icon: "🧠",
      score: stats.domains.practice.score,
      desc: "Aptitude, Quants & Logic",
      route: "/practice",
      btnText: "Practice Now",
      color: "#6366f1",
      badge: `${stats.domains.practice.count} Sets`,
      statHighlight: stats.domains.practice.count > 0 ? `${stats.domains.practice.score}% Solved` : "Nil",
    },
  ];

  return (
    <DashboardLayout>
      {/* ── TOP HERO: INTERACTIVE PROGRESS & PERFORMANCE GRAPH ───────────── */}
      <PerformanceGraph activities={activities} overallScore={composite} />

      {/* ── QUICK ACTION LAUNCH BAR ────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 14,
          padding: "14px 20px",
          background: "rgba(255,255,255,0.02)",
          borderRadius: 16,
          border: "1px solid var(--glass-border)",
          marginBottom: 32,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>⚡</span>
          <span style={{ fontSize: 13.5, fontWeight: 800, color: "var(--text)" }}>Quick Launch:</span>
          <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>Jump straight into any practice track</span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Link to="/setup" className="btn btn-primary" style={{ padding: "8px 16px", fontSize: 13 }}>
            💻 Mock Interview
          </Link>
          <Link to="/voice" className="btn btn-gold" style={{ padding: "8px 16px", fontSize: 13 }}>
            🎙️ Voice AI
          </Link>
          <Link to="/company-assessment" className="btn btn-outline" style={{ padding: "8px 16px", fontSize: 13 }}>
            🏢 Company Tests
          </Link>
          <Link to="/typing-test" className="btn btn-outline" style={{ padding: "8px 16px", fontSize: 13 }}>
            ⌨️ Typing Test
          </Link>
        </div>
      </div>

      {/* ── 6 CORE WEBAPP DOMAINS KPI GRID ─────────────────────────────────── */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-0.4px", margin: 0 }}>
              Module Breakdown &amp; Performance
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "4px 0 0 0" }}>
              {isLoggedIn && user ? `Live scores and logs for ${user.name || user.email}` : "Live dynamic scores and quick-start actions for every module"}
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 18,
          }}
        >
          {domainCards.map((card) => (
            <div
              key={card.id}
              className="glass"
              style={{
                padding: "22px 24px",
                borderRadius: 18,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
                border: `1px solid var(--glass-border)`,
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${card.color}50`;
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = `0 12px 30px ${card.color}15`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--glass-border)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Top Accent Line */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: card.color,
                }}
              />

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: `${card.color}18`,
                      border: `1px solid ${card.color}35`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                    }}
                  >
                    {card.icon}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: card.color,
                      background: `${card.color}15`,
                      padding: "3px 10px",
                      borderRadius: 99,
                      border: `1px solid ${card.color}30`,
                    }}
                  >
                    {card.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 6px 0", color: "var(--text)" }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: "0 0 16px 0" }}>
                  {card.desc}
                </p>
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    background: "rgba(0,0,0,0.15)",
                    borderRadius: 12,
                    marginBottom: 14,
                  }}
                >
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Metric</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: card.statHighlight === "Nil" ? "var(--text-dim)" : card.color, fontFamily: "'Sora', sans-serif" }}>
                    {card.statHighlight}
                  </span>
                </div>

                <button
                  onClick={() => nav(card.route)}
                  className="btn"
                  style={{
                    width: "100%",
                    padding: "9px 16px",
                    fontSize: 13,
                    fontWeight: 700,
                    background: `${card.color}18`,
                    color: card.color,
                    border: `1px solid ${card.color}40`,
                    borderRadius: 10,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = card.color;
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `${card.color}18`;
                    e.currentTarget.style.color = card.color;
                  }}
                >
                  {card.btnText} →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── UNIFIED ACTIVITY HISTORY TIMELINE ──────────────────────────────── */}
      <div className="glass" style={{ padding: "28px 32px", borderRadius: 20, marginBottom: 32 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div>
            <h3 style={{ fontSize: 19, fontWeight: 900, margin: 0, letterSpacing: "-0.3px" }}>
              All WebApp Activity History
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "4px 0 0 0" }}>
              {isLoggedIn && user ? `Logged practice sessions for ${user.name || user.email}` : "Recent mock interviews, voice tests, company exams, and typing challenges"}
            </p>
          </div>

          {/* Interactive Filter Tabs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[
              { id: "all", label: "All Activities" },
              { id: "technical", label: "💻 Technical" },
              { id: "voice", label: "🎙️ Voice AI" },
              { id: "company", label: "🏢 Company Exams" },
              { id: "typing", label: "⌨️ Typing" },
              { id: "subject", label: "📚 CS Bank" },
              { id: "practice", label: "🧠 Practice" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 99,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  border: activeTab === tab.id ? "1px solid var(--violet-light)" : "1px solid var(--glass-border)",
                  background: activeTab === tab.id ? "var(--violet)" : "rgba(255,255,255,0.03)",
                  color: activeTab === tab.id ? "#fff" : "var(--text-muted)",
                  transition: "all 0.2s ease",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Activity Items List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredActivities.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-muted)", background: "rgba(255,255,255,0.01)", borderRadius: 14, border: "1px dashed var(--glass-border)" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
                {activities.length === 0 ? "No activities recorded yet (Nil)" : "No activities found for this filter"}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-dim)", maxWidth: 420, margin: "0 auto 16px auto" }}>
                {activities.length === 0
                  ? "Complete an interview, voice simulation, or skill test to view real-time dynamic logs."
                  : "Try another filter or launch a session in this category."}
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                <Link to="/setup" className="btn btn-primary" style={{ padding: "7px 16px", fontSize: 12.5 }}>
                  Take Mock Interview →
                </Link>
                <Link to="/voice" className="btn btn-gold" style={{ padding: "7px 16px", fontSize: 12.5 }}>
                  Voice AI →
                </Link>
              </div>
            </div>
          ) : (
            filteredActivities.map((act) => {
              const scoreCol = perfColor(act.score);
              return (
                <div
                  key={act.id}
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 16,
                    padding: "16px 20px",
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--glass-border)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = `${act.color || "var(--violet)"}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                    e.currentTarget.style.borderColor = "var(--glass-border)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        background: `${act.color || "#7c3aed"}18`,
                        border: `1px solid ${act.color || "#7c3aed"}35`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        flexShrink: 0,
                      }}
                    >
                      {act.icon || "📄"}
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                        <span style={{ fontSize: 14.5, fontWeight: 800, color: "var(--text)" }}>
                          {act.title}
                        </span>
                        <span
                          style={{
                            fontSize: 10.5,
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

                      <div style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", gap: 12, flexWrap: "wrap" }}>
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

                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: scoreCol, fontFamily: "'Sora', sans-serif" }}>
                        {act.score}%
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>
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
                      style={{ padding: "6px 14px", fontSize: 12 }}
                    >
                      Practice Again
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;