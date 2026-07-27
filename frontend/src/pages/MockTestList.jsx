import { useNavigate } from "react-router-dom";
import { mockTestList } from "../data/mockTestData";

function MockTestList() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'Inter', sans-serif" }}>

      {/* ── Header ── */}
      <div style={{
        background: "linear-gradient(180deg, rgba(13,21,38,0.98) 0%, var(--bg) 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "28px 40px 32px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "transparent", border: "none", color: "var(--text-muted)",
              fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center",
              gap: 6, marginBottom: 24, padding: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--primary-light)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
          >
            ← Back to Home
          </button>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.3)",
                borderRadius: 99, padding: "4px 14px", marginBottom: 14,
                fontSize: 12, color: "#67e8f9", fontWeight: 600, letterSpacing: "0.04em",
              }}>
                🎯 FREE MOCK TESTS
              </div>
              <h1 style={{ fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 900, marginBottom: 8, lineHeight: 1.2 }}>
                All Mock Tests
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6 }}>
                Simulate real exam conditions with timed tests, instant results, and detailed explanations.
              </p>
            </div>

            {/* Summary chips */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              {[
                { icon: "📋", val: `${mockTestList.length}`, label: "Tests" },
                { icon: "❓", val: mockTestList.reduce((s, t) => s + t.totalQuestions, 0).toString(), label: "Questions" },
                { icon: "🆓", val: "Free", label: "Access" },
              ].map(({ icon, val, label }) => (
                <div key={label} style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12, padding: "10px 18px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 18, marginBottom: 2 }}>{icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9" }}>{val}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Test List ── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 40px 60px" }}>

        {/* Filter hint */}
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
          Showing <strong style={{ color: "var(--text-dim)" }}>{mockTestList.length}</strong> mock tests
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mockTestList.map((test, idx) => (
            <MockTestListItem key={test.id} test={test} index={idx} onStart={() => navigate(`/mock-test/${test.id}`)} />
          ))}
        </div>

        {/* Future placeholder */}
        <div style={{
          marginTop: 24,
          border: "1px dashed rgba(255,255,255,0.1)",
          borderRadius: 16, padding: "24px 28px",
          textAlign: "center", color: "var(--text-muted)", fontSize: 13,
        }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🚀</div>
          <div style={{ fontWeight: 600, color: "var(--text-dim)", marginBottom: 4 }}>More tests coming soon</div>
          <div>We're constantly adding new mock tests across topics.</div>
        </div>
      </div>
    </div>
  );
}

function MockTestListItem({ test, index, onStart }) {
  const difficultyColor =
    test.difficulty.includes("Hard") ? "#ef4444" :
    test.difficulty.includes("Medium") ? "#f59e0b" : "#10b981";

  return (
    <div
      style={{
        background: "rgba(13,21,38,0.85)",
        border: `1px solid rgba(255,255,255,0.07)`,
        borderRadius: 16,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        gap: 20,
        transition: "all 0.22s ease",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
        animation: `fadeUp 0.3s ease ${index * 0.07}s both`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = test.colorBorder;
        e.currentTarget.style.boxShadow = `0 8px 32px ${test.color}18`;
        e.currentTarget.style.transform = "translateX(4px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateX(0)";
      }}
    >
      {/* Left color bar */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 4,
        background: test.gradient, borderRadius: "16px 0 0 16px",
      }} />

      {/* Icon */}
      <div style={{
        width: 52, height: 52, borderRadius: 14, flexShrink: 0,
        background: test.colorLight, border: `1px solid ${test.colorBorder}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 24, marginLeft: 8,
      }}>
        {test.icon}
      </div>

      {/* Main Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5, flexWrap: "wrap" }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9", margin: 0 }}>{test.title}</h3>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
            background: "rgba(16,185,129,0.12)", color: "#34d399",
            border: "1px solid rgba(16,185,129,0.3)", letterSpacing: "0.05em",
          }}>FREE</span>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 10, margin: "0 0 10px" }}>
          {test.subtitle}
        </p>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {test.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 99,
              background: test.colorLight, color: test.color, border: `1px solid ${test.colorBorder}`,
            }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Meta */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 16, fontSize: 13, color: "var(--text-muted)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span>❓</span> {test.totalQuestions} Qs
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span>⏱</span> {test.duration} min
          </span>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99,
          background: `${difficultyColor}18`, color: difficultyColor,
          border: `1px solid ${difficultyColor}44`,
        }}>{test.difficulty}</span>
      </div>

      {/* Start Button */}
      <button
        onClick={onStart}
        style={{
          padding: "10px 22px", borderRadius: 10, border: "none",
          background: test.gradient, color: "#fff",
          fontWeight: 700, fontSize: 13, cursor: "pointer",
          flexShrink: 0, whiteSpace: "nowrap",
          boxShadow: `0 4px 16px ${test.color}33`,
          transition: "all 0.18s",
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "scale(1.04)"; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
      >
        Start ▶
      </button>
    </div>
  );
}

export default MockTestList;
