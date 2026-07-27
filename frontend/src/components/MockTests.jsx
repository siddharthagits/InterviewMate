import { useNavigate } from "react-router-dom";
import { mockTestList } from "../data/mockTestData";

function MockTests() {
  const navigate = useNavigate();

  return (
    <section style={{ padding: "90px 32px 80px", position: "relative" }}>
      {/* Section glow accent */}
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "300px",
        background: "radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.3)",
            borderRadius: 99, padding: "6px 18px", marginBottom: 20,
            fontSize: 13, color: "#67e8f9", fontWeight: 600, letterSpacing: "0.04em"
          }}>
            🎯 FREE MOCK TESTS
          </div>
          <h2 style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 900, lineHeight: 1.15, marginBottom: 14 }}>
            Practice with{" "}
            <span className="grad-text">Full-Length</span>
            {" "}Mock Tests
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 16, maxWidth: 580, margin: "0 auto", lineHeight: 1.7 }}>
            Simulate real exam conditions. Timed tests, instant results, and detailed solutions — just like Testbook.
          </p>
        </div>

        {/* Stats Bar */}
        <div style={{
          display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap",
          marginBottom: 52, padding: "18px 32px",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16,
        }}>
          {[
            { v: "75", l: "Total Questions" },
            { v: "4", l: "Test Categories" },
            { v: "100%", l: "Free Access" },
          ].map(({ v, l }) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg,#a5b4fc,#67e8f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{v}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Cards Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
          gap: 24,
        }}>
          {mockTestList.map((test) => (
            <MockTestCard key={test.id} test={test} onStart={() => navigate(`/mock-test/${test.id}`)} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 4 }}>
            ✅ No sign-up required &nbsp;·&nbsp; ✅ Instant result &nbsp;·&nbsp; ✅ Detailed explanation
          </p>
        </div>
      </div>
    </section>
  );
}

function MockTestCard({ test, onStart }) {
  const difficultyColor =
    test.difficulty.includes("Hard") ? "#ef4444" :
    test.difficulty.includes("Medium") ? "#f59e0b" : "#10b981";

  return (
    <div
      className="mock-test-card"
      style={{
        background: "rgba(13,21,38,0.9)",
        border: `1px solid ${test.colorBorder}`,
        borderRadius: 20,
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        cursor: "pointer",
        transition: "all 0.28s ease",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = `0 20px 60px ${test.color}22, 0 0 0 1px ${test.colorBorder}`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Glow top accent */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: test.gradient, borderRadius: "20px 20px 0 0",
      }} />

      {/* Background glow blob */}
      <div style={{
        position: "absolute", top: -30, right: -30,
        width: 120, height: 120,
        background: test.colorLight,
        borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none",
      }} />

      {/* Icon + Title */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 18, marginTop: 8 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14, flexShrink: 0,
          background: test.colorLight,
          border: `1px solid ${test.colorBorder}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24,
        }}>
          {test.icon}
        </div>
        <div>
          <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 3, color: "#f1f5f9" }}>{test.title}</h3>
          <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.4 }}>{test.subtitle}</p>
        </div>
      </div>

      {/* Topic Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
        {test.tags.map(tag => (
          <span key={tag} style={{
            fontSize: 11, fontWeight: 600, padding: "3px 10px",
            borderRadius: 99, letterSpacing: "0.03em",
            background: test.colorLight,
            color: test.color,
            border: `1px solid ${test.colorBorder}`,
          }}>{tag}</span>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 18 }} />

      {/* Meta Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, fontSize: 13 }}>
        <div style={{ display: "flex", gap: 16 }}>
          <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 14 }}>❓</span> {test.totalQuestions} Qs
          </span>
          <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 14 }}>⏱</span> {test.duration} min
          </span>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99,
          background: `${difficultyColor}18`,
          color: difficultyColor,
          border: `1px solid ${difficultyColor}44`,
        }}>{test.difficulty}</span>
      </div>



      {/* CTA Button */}
      <button
        onClick={onStart}
        style={{
          width: "100%",
          padding: "12px 0",
          borderRadius: 12,
          border: "none",
          background: test.gradient,
          color: "#fff",
          fontWeight: 700,
          fontSize: 14,
          cursor: "pointer",
          transition: "all 0.2s",
          letterSpacing: "0.02em",
          boxShadow: `0 4px 20px ${test.color}44`,
          marginTop: "auto",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.opacity = "0.9";
          e.currentTarget.style.transform = "scale(1.02)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        Start Test ▶
      </button>

      {/* Free label */}
      <div style={{
        position: "absolute", top: 16, right: 16,
        background: "rgba(16,185,129,0.15)",
        border: "1px solid rgba(16,185,129,0.35)",
        color: "#34d399", fontSize: 10, fontWeight: 700,
        padding: "2px 8px", borderRadius: 99, letterSpacing: "0.06em",
      }}>FREE</div>
    </div>
  );
}

export default MockTests;
