import { AppIcon } from "../components/common/AppIcon";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { mockTestList } from "../data/mockTestData";

function MockTestList() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      <div style={{ paddingTop: 68 }}>
        {/* ── Header ── */}
      <div className="mock-test-header">
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
            <div style={{ maxWidth: 520 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                marginBottom: 12,
                fontSize: 12, color: "#67e8f9", fontWeight: 800, letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}>
                <span style={{ width: 18, height: 1.5, background: "#06b6d4", display: "inline-block", borderRadius: 2 }} />
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><AppIcon name="target" size={13} color="#67e8f9" /> Free Mock Tests</span>
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
                { icon: "clipboard", val: `${mockTestList.length}`, label: "Tests" },
                { icon: "help-circle", val: mockTestList.reduce((s, t) => s + t.totalQuestions, 0).toString(), label: "Questions" },
                { icon: "check-circle", val: "Free", label: "Access" },
              ].map(({ icon, val, label }) => (
                <div key={label} style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12, padding: "10px 18px", textAlign: "center", flex: "1 1 auto",
                }}>
                  <div style={{ marginBottom: 4, display: "flex", justifyContent: "center" }}><AppIcon name={icon} size={20} color="var(--cyan)" /></div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)" }}>{val}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Test List ── */}
      <div className="mock-test-container" style={{ maxWidth: 900, margin: "0 auto" }}>

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
          <div style={{ marginBottom: 8, display: "flex", justifyContent: "center" }}><AppIcon name="zap" size={28} color="var(--cyan)" /></div>
          <div style={{ fontWeight: 600, color: "var(--text-dim)", marginBottom: 4 }}>More tests coming soon</div>
          <div>We're constantly adding new mock tests across topics.</div>
        </div>
      </div>
    </div>
    </div>
  );
}

function MockTestListItem({ test, index, onStart }) {
  return (
    <div
      className="mock-test-list-item"
      style={{
        background: "var(--card)",
        border: "1px solid var(--glass-border)",
        borderRadius: 16,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        position: "relative",
        animation: `fadeUp 0.3s ease ${index * 0.07}s both`,
        transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "var(--border-hover)";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "var(--glass-border)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 0 }}>
        {/* Unified Icon Container */}
        <div style={{
          width: 46, height: 46, borderRadius: 12, flexShrink: 0,
          background: "var(--bg2)",
          border: "1px solid var(--glass-border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--primary)",
        }}>
          <AppIcon name={test.icon} size={22} />
        </div>

        {/* Main Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", margin: 0 }}>{test.title}</h3>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
              background: "rgba(16,185,129,0.1)", color: "#10b981",
              border: "1px solid rgba(16,185,129,0.25)", letterSpacing: "0.05em",
            }}>FREE</span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 10, margin: "0 0 10px" }}>
            {test.subtitle}
          </p>

          {/* Unified Theme-Adaptive Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {test.tags.map(tag => (
              <span key={tag} style={{
                fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99,
                background: "var(--bg2)",
                color: "var(--text-muted)",
                border: "1px solid var(--glass-border)",
              }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="mock-test-meta" style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 14, fontSize: 12.5, color: "var(--text-muted)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <AppIcon name="help-circle" size={13} color="var(--text-muted)" /> {test.totalQuestions} Qs
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <AppIcon name="clock" size={13} color="var(--text-muted)" /> {test.duration} min
          </span>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99,
          background: "var(--bg2)",
          color: "var(--text-muted)",
          border: "1px solid var(--glass-border)",
        }}>{test.difficulty}</span>
      </div>

      {/* Unified Theme Start Button */}
      <button
        onClick={onStart}
        className="btn btn-primary mock-test-start-btn"
        style={{
          padding: "9px 20px", borderRadius: 10,
          fontWeight: 700, fontSize: 13, cursor: "pointer",
          flexShrink: 0, whiteSpace: "nowrap",
          display: "inline-flex", alignItems: "center", gap: 6,
        }}
      >
        Start
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      </button>
    </div>
  );
}

export default MockTestList;
