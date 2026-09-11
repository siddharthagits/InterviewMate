import { useNavigate } from "react-router-dom";
import { mockTestList } from "../data/mockTestData";
import AppIcon, { IconTarget, IconCheckCircle, IconHelpCircle, IconClock } from "./common/AppIcon";

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
          <div className="glow-pill glow-pill-cyan fade-up" style={{ marginBottom: 20, display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 18, height: 2, background: "currentColor", display: "inline-block", borderRadius: 2 }} />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <IconTarget size={14} color="currentColor" /> Free Mock Tests
            </span>
            <span style={{ width: 18, height: 2, background: "currentColor", display: "inline-block", borderRadius: 2 }} />
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
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 4, display: "flex", justifyContent: "center", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <IconCheckCircle size={14} color="#10b981" /> No sign-up required
            </span>
            <span>·</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <IconCheckCircle size={14} color="#10b981" /> Instant result
            </span>
            <span>·</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <IconCheckCircle size={14} color="#10b981" /> Detailed explanation
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

function MockTestCard({ test, onStart }) {
  return (
    <div
      className="glass"
      style={{
        background: "var(--card)",
        border: "1px solid var(--glass-border)",
        borderRadius: 20,
        padding: "26px 24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
        overflow: "hidden",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = "var(--border-hover)";
        e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "var(--glass-border)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div>
        {/* Icon + Title */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16, marginTop: 4 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, flexShrink: 0,
            background: "var(--bg2)",
            border: "1px solid var(--glass-border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--primary)",
          }}>
            <AppIcon name={test.icon} size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 4, color: "var(--text)" }}>{test.title}</h3>
            <p style={{ fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.4, margin: 0 }}>{test.subtitle}</p>
          </div>
        </div>

        {/* Topic Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
          {test.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 11, fontWeight: 600, padding: "3px 10px",
              borderRadius: 99,
              background: "var(--bg2)",
              color: "var(--text-muted)",
              border: "1px solid var(--glass-border)",
            }}>{tag}</span>
          ))}
        </div>
      </div>

      <div>
        {/* Divider */}
        <div style={{ height: 1, background: "var(--glass-border)", marginBottom: 16 }} />

        {/* Meta Row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, fontSize: 12.5 }}>
          <div style={{ display: "flex", gap: 14 }}>
            <span style={{ color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: 5 }}>
              <IconHelpCircle size={14} /> {test.totalQuestions} Qs
            </span>
            <span style={{ color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: 5 }}>
              <IconClock size={14} /> {test.duration} min
            </span>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99,
            background: "var(--bg2)",
            color: "var(--text-muted)",
            border: "1px solid var(--glass-border)",
          }}>{test.difficulty}</span>
        </div>

        {/* CTA Button */}
        <button
          onClick={onStart}
          className="btn btn-primary"
          style={{
            width: "100%",
            padding: "12px 0",
            borderRadius: 12,
            fontSize: 13.5,
            fontWeight: 700,
            cursor: "pointer",
            marginTop: 14,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          Start Mock Test →
        </button>
      </div>
    </div>
  );
}

export default MockTests;
