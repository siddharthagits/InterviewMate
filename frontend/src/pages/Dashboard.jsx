import { AppIcon } from "../components/common/AppIcon";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PerformanceGraph from "../components/dashboard/PerformanceGraph";
import { useInterview } from "../context/InterviewContext";
import { useAuth } from "../context/AuthContext";
import { getStoredActivities, calculateOverallStats, dbSessionToActivity } from "../utils/activityTracker";
import { fetchInterviewSessions } from "../api/api";

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

  const loadAll = useCallback(async () => {
    if (!isLoggedIn || !user?.id) {
      setActivities([]);
      return;
    }
    const local = getStoredActivities();
    try {
      const dbSessions = await fetchInterviewSessions(user.id);
      const dbActivities = dbSessions.map(dbSessionToActivity);
      const dbIds = new Set(dbActivities.map((a) => a._dbId));
      // Non-technical localStorage entries are always kept; technical ones
      // are superseded by the authoritative DB records if DB has data.
      const filteredLocal = local.filter((a) => {
        if (a.type !== "technical") return true;
        return dbIds.size === 0;
      });
      const merged = [...dbActivities, ...filteredLocal].sort(
        (a, b) => (b.timestamp || 0) - (a.timestamp || 0)
      );
      setActivities(merged);
    } catch {
      setActivities(local);
    }
  }, [isLoggedIn, user?.id]);

  useEffect(() => {
    loadAll();
    const handle = () => loadAll();
    window.addEventListener("im_activity_updated", handle);
    window.addEventListener("im_auth_changed", handle);
    return () => {
      window.removeEventListener("im_activity_updated", handle);
      window.removeEventListener("im_auth_changed", handle);
    };
  }, [loadAll]);

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
      icon: "code",
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
      icon: "mic",
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
      icon: "building",
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
      icon: "keyboard",
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
      icon: "book",
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
      icon: "brain",
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


      {/* Guest Mode Notice Banner */}
      {!isLoggedIn && (
        <div
          className="glass"
          style={{
            padding: "16px 22px",
            borderRadius: 16,
            border: "1px solid rgba(124,58,237,0.3)",
            background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.04))",
            marginBottom: 24,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <AppIcon name="lock" size={24} color="var(--violet-light)" />
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)" }}>
                Sign in to save your session history &amp; track metrics
              </div>
              <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>
                Guest history has been removed. Sign in or create an account to record your mock interviews, typing scores, and AI evaluations.
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link to="/login" className="btn btn-primary" style={{ padding: "8px 18px", fontSize: 13 }}>
              Sign In →
            </Link>
            <Link to="/register" className="btn btn-outline" style={{ padding: "8px 16px", fontSize: 13 }}>
              Register
            </Link>
          </div>
        </div>
      )}

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
          <AppIcon name="zap" size={18} color="#f59e0b" />
          <span style={{ fontSize: 13.5, fontWeight: 800, color: "var(--text)" }}>Quick Launch:</span>
          <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>Jump straight into any practice track</span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Link to="/setup" className="btn btn-primary" style={{ padding: "8px 16px", fontSize: 13 }}>
            <AppIcon name="code" size={14} /> Mock Interview
          </Link>
          <Link to="/voice" className="btn btn-gold" style={{ padding: "8px 16px", fontSize: 13 }}>
            <AppIcon name="mic" size={14} /> Voice AI
          </Link>
          <Link to="/company-assessment" className="btn btn-outline" style={{ padding: "8px 16px", fontSize: 13 }}>
            <AppIcon name="building" size={14} /> Company Tests
          </Link>
          <Link to="/typing-test" className="btn btn-outline" style={{ padding: "8px 16px", fontSize: 13 }}>
            <AppIcon name="keyboard" size={14} /> Typing Test
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
                border: "1px solid var(--glass-border)",
                background: "var(--card)",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-hover)";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 14px 32px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--glass-border)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: "var(--bg2)",
                      border: "1px solid var(--glass-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AppIcon name={card.icon} size={22} color="var(--violet-light)" />
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--text-muted)",
                      background: "var(--bg2)",
                      padding: "4px 10px",
                      borderRadius: 99,
                      border: "1px solid var(--glass-border)",
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
                    background: "var(--bg2)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: 12,
                    marginBottom: 14,
                  }}
                >
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Metric</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", fontFamily: "'Sora', sans-serif" }}>
                    {card.statHighlight}
                  </span>
                </div>

                <button
                  onClick={() => nav(card.route)}
                  className="btn btn-primary"
                  style={{
                    width: "100%",
                    padding: "9px 16px",
                    fontSize: 13,
                    fontWeight: 700,
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
              { id: "all", label: "All Activities", icon: "grid" },
              { id: "technical", label: "Technical", icon: "code" },
              { id: "voice", label: "Voice AI", icon: "mic" },
              { id: "company", label: "Company Exams", icon: "building" },
              { id: "typing", label: "Typing", icon: "keyboard" },
              { id: "subject", label: "CS Bank", icon: "book" },
              { id: "practice", label: "Practice", icon: "brain" },
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
                  background: activeTab === tab.id ? "var(--violet)" : "var(--bg2)",
                  color: activeTab === tab.id ? "#fff" : "var(--text-muted)",
                  transition: "all 0.2s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <AppIcon name={tab.icon} size={13} color={activeTab === tab.id ? "#fff" : "var(--text-muted)"} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Activity Items List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredActivities.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-muted)", background: "var(--bg2)", borderRadius: 14, border: "1px dashed var(--glass-border)" }}>
              <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}><AppIcon name={isLoggedIn ? "clipboard" : "lock"} size={32} color="var(--violet-light)" /></div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
                {!isLoggedIn
                  ? "Sign in to view and save activity history"
                  : activities.length === 0
                  ? "No activities recorded yet (Nil)"
                  : "No activities found for this filter"}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-dim)", maxWidth: 440, margin: "0 auto 16px auto" }}>
                {!isLoggedIn
                  ? "History is only tracked for authenticated accounts. Sign in to record your scores and progress."
                  : activities.length === 0
                  ? "Complete an interview, voice simulation, or skill test to view real-time dynamic logs."
                  : "Try another filter or launch a session in this category."}
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                {!isLoggedIn ? (
                  <>
                    <Link to="/login" className="btn btn-primary" style={{ padding: "7px 18px", fontSize: 12.5 }}>
                      Sign In →
                    </Link>
                    <Link to="/register" className="btn btn-outline" style={{ padding: "7px 16px", fontSize: 12.5 }}>
                      Create Account
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/setup" className="btn btn-primary" style={{ padding: "7px 16px", fontSize: 12.5 }}>
                      Take Mock Interview →
                    </Link>
                    <Link to="/voice" className="btn btn-gold" style={{ padding: "7px 16px", fontSize: 12.5 }}>
                      Voice AI →
                    </Link>
                  </>
                )}
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
                    background: "var(--card)",
                    border: "1px solid var(--glass-border)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--glass-border)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        background: "var(--bg2)",
                        border: "1px solid var(--glass-border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        flexShrink: 0,
                      }}
                    >
                      <AppIcon name={act.icon || "file"} size={18} color="var(--violet-light)" />
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
                            color: "var(--text-muted)",
                            background: "var(--bg2)",
                            padding: "2px 8px",
                            borderRadius: 99,
                            border: "1px solid var(--glass-border)",
                          }}
                        >
                          {act.category}
                        </span>
                      </div>

                      <div style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", gap: 12, flexWrap: "wrap" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><AppIcon name="clock" size={12} color="var(--text-muted)" /> {formatTimeAgo(act.timestamp)}</span>
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