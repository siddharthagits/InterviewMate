import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardShowcase() {
  const nav = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const previewLinks = [
    { id: "overview", label: "Dashboard", icon: "📊" },
    { id: "voice", label: "Voice Interview", icon: "🎙️", badge: "AI", route: "/voice" },
    { id: "companies", label: "Company Tests", icon: "🏢", route: "/company-assessment" },
    { id: "typing", label: "Typing Test", icon: "⌨️", route: "/typing-test" },
    { id: "practice", label: "Practice Corner", icon: "🧠", route: "/practice" },
    { id: "questions", label: "Question Bank", icon: "📚", route: "/question-bank" },
  ];

  return (
    <section className="showcase-section" style={{ position: "relative", padding: "40px 20px 80px", maxWidth: 1180, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div className="glow-pill fade-up" style={{ marginBottom: 16 }}>
          ✨ Experience the New Dashboard
        </div>
        <h2
          className="fade-up"
          style={{
            fontSize: "clamp(24px, 3.8vw, 42px)",
            fontWeight: 900,
            letterSpacing: "-1px",
            lineHeight: 1.2,
            marginBottom: 14,
          }}
        >
          All-in-One AI Prep Hub with <span className="grad-text">Fluid Navigation</span>
        </h2>
        <p
          className="fade-up"
          style={{
            color: "var(--text-muted)",
            fontSize: 15,
            maxWidth: 580,
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          Try the interactive preview below. Collapse and expand the sidebar, explore quick tracks, and test your readiness in seconds.
        </p>
      </div>

      {/* Interactive Mockup Container */}
      <div
        className="showcase-card glass fade-up"
        style={{
          borderRadius: 24,
          border: "1px solid rgba(124,58,237,0.25)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.45), 0 0 30px rgba(124,58,237,0.15)",
          overflow: "hidden",
          background: "var(--card)",
          display: "flex",
          minHeight: 480,
          position: "relative",
        }}
      >
        {/* Mockup Sidebar */}
        <div
          style={{
            width: sidebarOpen ? 230 : 72,
            background: "var(--sidebar)",
            borderRight: "1px solid var(--border)",
            padding: "18px 12px",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1), padding 0.25s ease",
            flexShrink: 0,
          }}
        >
          {/* Floating circular edge toggle demo */}
          <button
            type="button"
            className="sidebar-edge-toggle"
            style={{
              position: "absolute",
              right: -13,
              top: 22,
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #4f46e5, #6366f1)",
              border: "2px solid var(--sidebar)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 70,
              boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
            }}
            onClick={() => setSidebarOpen(prev => !prev)}
            title={sidebarOpen ? "Click to collapse" : "Click to expand"}
          >
            {sidebarOpen ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            )}
          </button>

          {/* Brand area */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: sidebarOpen ? "flex-start" : "center",
              marginBottom: 20,
              minHeight: 36,
            }}
          >
            {sidebarOpen ? (
              <span
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 900,
                  fontSize: 17,
                  background: "linear-gradient(135deg, var(--violet-light), var(--cyan), var(--gold-light))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  whiteSpace: "nowrap",
                }}
              >
                Interview<span style={{ color: "#fcd34d" }}>Mate</span>
              </span>
            ) : (
              <span
                className="sidebar-brand-initial"
                style={{
                  width: 34,
                  height: 34,
                  fontSize: 17,
                  borderRadius: 10,
                }}
              >
                I
              </span>
            )}
          </div>

          {/* Links list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {previewLinks.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.route) {
                      nav(item.route);
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: sidebarOpen ? "9px 12px" : "9px 0",
                    justifyContent: sidebarOpen ? "flex-start" : "center",
                    borderRadius: 10,
                    border: active ? "1px solid rgba(124,58,237,0.3)" : "1px solid transparent",
                    background: active ? "rgba(124,58,237,0.12)" : "transparent",
                    color: active ? "var(--violet-light)" : "var(--text-muted)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                  title={item.label}
                >
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  {sidebarOpen && (
                    <span style={{ fontSize: 13, fontWeight: 600, flex: 1, whiteSpace: "nowrap" }}>
                      {item.label}
                    </span>
                  )}
                  {sidebarOpen && item.badge && (
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 800,
                        padding: "1px 6px",
                        borderRadius: 6,
                        background: "rgba(16,185,129,0.15)",
                        color: "#10b981",
                        border: "1px solid rgba(16,185,129,0.3)",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom badge */}
          {sidebarOpen && (
            <div style={{ marginTop: "auto", paddingTop: 16 }}>
              <div
                style={{
                  background: "rgba(124,58,237,0.08)",
                  border: "1px solid rgba(124,58,237,0.2)",
                  borderRadius: 12,
                  padding: "10px 12px",
                  fontSize: 11,
                  color: "var(--text-muted)",
                }}
              >
                <div style={{ fontWeight: 700, color: "var(--violet-light)" }}>Interactive Preview</div>
                <div>Click arrow to collapse ➔</div>
              </div>
            </div>
          )}
        </div>

        {/* Mockup Main Dashboard Area */}
        <div style={{ flex: 1, padding: "24px 28px", overflowY: "auto", background: "var(--bg)" }}>
          {/* Top banner */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--violet-light)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Candidate Workspace
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", margin: "4px 0 0" }}>
                Welcome to InterviewMate Dashboard
              </h3>
            </div>
            <button
              className="btn btn-primary"
              style={{ fontSize: 13, padding: "8px 18px" }}
              onClick={() => nav("/dashboard")}
            >
              Open Full Dashboard ↗
            </button>
          </div>

          {/* 3 Metric Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 20 }}>
            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: "14px 16px",
              }}
            >
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>Interview Score</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--violet-light)" }}>88.5%</div>
              <div style={{ fontSize: 11, color: "#10b981", marginTop: 4 }}>Top 5% candidate rank</div>
            </div>

            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: "14px 16px",
              }}
            >
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>Voice Clarity &amp; WPM</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--cyan)" }}>74 WPM / 94%</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Speech &amp; Typing tested</div>
            </div>

            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: "14px 16px",
              }}
            >
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>Company Assessment</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--gold-light)" }}>Ready</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>TCS, Infosys &amp; Amazon</div>
            </div>
          </div>

          {/* Quick Track Modules */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            <div
              onClick={() => nav("/voice")}
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.05))",
                border: "1px solid rgba(124,58,237,0.25)",
                borderRadius: 14,
                padding: "16px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>🎙️</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--violet-light)", background: "rgba(124,58,237,0.15)", padding: "2px 8px", borderRadius: 8 }}>
                  VOICE AI
                </span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>AI Voice Simulation</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Conversational audio interview with real-time feedback.</div>
            </div>

            <div
              onClick={() => nav("/company-assessment")}
              style={{
                background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(236,72,153,0.05))",
                border: "1px solid rgba(245,158,11,0.25)",
                borderRadius: 14,
                padding: "16px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>🏢</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--gold-light)", background: "rgba(245,158,11,0.15)", padding: "2px 8px", borderRadius: 8 }}>
                  TEST TRACKS
                </span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>Company Specific Exams</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Practice hiring rounds for top tech companies.</div>
            </div>

            <div
              onClick={() => nav("/typing-test")}
              style={{
                background: "linear-gradient(135deg, rgba(6,182,212,0.08), rgba(16,185,129,0.05))",
                border: "1px solid rgba(6,182,212,0.25)",
                borderRadius: 14,
                padding: "16px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>⌨️</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--cyan)", background: "rgba(6,182,212,0.15)", padding: "2px 8px", borderRadius: 8 }}>
                  SPEED TEST
                </span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>Live Typing Proficiency</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Measure WPM, accuracy, and typing pace.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
