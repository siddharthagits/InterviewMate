import { useNavigate } from "react-router-dom";
import { useRef } from "react";

// Inline SVG Icons
const icons = {
  brain: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2C7 2 5 4 5 6.5c0 .5.1 1 .2 1.5C3.4 8.8 2 10.5 2 12.5 2 15 4 17 6.5 17H9v3.5a1.5 1.5 0 003 0V17h2.5c2.5 0 4.5-2 4.5-4.5 0-2-.8-3.5-2.2-4.3A4.5 4.5 0 009.5 2z"/>
      <path d="M9 9h1m5 0h1m-6 4h1"/>
    </svg>
  ),
  target: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  layers: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,2 2,7 12,12 22,7"/>
      <polyline points="2,17 12,22 22,17"/>
      <polyline points="2,12 12,17 22,12"/>
    </svg>
  ),
  clock: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
    </svg>
  ),
  chart: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6"  y1="20" x2="6"  y2="14"/>
      <line x1="2"  y1="20" x2="22" y2="20"/>
    </svg>
  ),
  flask: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6m-6 0v6l-5 9a1 1 0 001 1h12a1 1 0 001-1l-5-9V3M9 3H7m10 0h2"/>
    </svg>
  ),
};

const feats = [
  {
    icon: icons.brain,
    title: "AI-Powered Evaluation",
    desc: "Gemini AI instantly grades your text answers, pinpoints weak areas, and delivers actionable improvement tips — zero bias.",
    badge: "Gemini AI",
    color: "#7c3aed",
    colorLight: "rgba(124,58,237,0.1)",
    colorBorder: "rgba(124,58,237,0.3)",
    gradient: "linear-gradient(135deg, #7c3aed, #5b21b6)",
  },
  {
    icon: icons.target,
    title: "Role-Specific Questions",
    desc: "Pick your job role, tech stack, experience level, and difficulty. Every question set is dynamically tailored to your target position.",
    badge: "Adaptive",
    color: "#06b6d4",
    colorLight: "rgba(6,182,212,0.1)",
    colorBorder: "rgba(6,182,212,0.3)",
    gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
  },
  {
    icon: icons.layers,
    title: "3 Question Formats",
    desc: "MCQs to test theory, code-output snippets to test debugging, and open-ended answers to test depth — all in one session.",
    badge: "35 Questions",
    color: "#f59e0b",
    colorLight: "rgba(245,158,11,0.1)",
    colorBorder: "rgba(245,158,11,0.3)",
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
  },
  {
    icon: icons.clock,
    title: "Timed Interview Mode",
    desc: "Simulate real interview pressure with a live countdown. Pick 15, 30, or 45-minute sessions and train yourself to think fast.",
    badge: "15–45 min",
    color: "#ef4444",
    colorLight: "rgba(239,68,68,0.1)",
    colorBorder: "rgba(239,68,68,0.3)",
    gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
  },
  {
    icon: icons.chart,
    title: "Detailed Score Report",
    desc: "After every session — section-wise scores, correct vs wrong breakdown, AI feedback on each answer, and a full performance summary.",
    badge: "Instant",
    color: "#10b981",
    colorLight: "rgba(16,185,129,0.1)",
    colorBorder: "rgba(16,185,129,0.3)",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
  },
  {
    icon: icons.flask,
    title: "Free Mock Tests",
    desc: "Standalone timed mock tests across Aptitude, Quants, Reasoning, Coding, GK, and English — no login required.",
    badge: "Free",
    color: "#ec4899",
    colorLight: "rgba(236,72,153,0.1)",
    colorBorder: "rgba(236,72,153,0.3)",
    gradient: "linear-gradient(135deg, #ec4899, #db2777)",
  },
];

function FeatureCard({ feat }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    // only apply 3D tilt on devices that support hover / pointer fine
    if (window.innerWidth < 768) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const rotX = -dy * 6;
    const rotY = dx * 6;
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`;
    card.style.setProperty("--mx", `${mx}%`);
    card.style.setProperty("--my", `${my}%`);
    card.style.borderColor = feat.colorBorder;
    card.style.boxShadow = `0 20px 50px ${feat.color}20`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)";
    card.style.borderColor = "var(--glass-border)";
    card.style.boxShadow = "none";
  };

  return (
    <div
      ref={cardRef}
      className="feature-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top gradient accent line */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: 2,
          background: feat.gradient,
          borderRadius: "20px 20px 0 0",
        }}
      />

      {/* Icon box */}
      <div
        style={{
          width: 52, height: 52,
          borderRadius: 16,
          background: feat.colorLight,
          border: `1px solid ${feat.colorBorder}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: feat.color,
          marginBottom: 22,
          boxShadow: `0 4px 16px ${feat.color}20`,
        }}
      >
        {feat.icon}
      </div>

      {/* Title + Badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", lineHeight: 1.3, letterSpacing: "-0.2px" }}>
          {feat.title}
        </h3>
        <span
          style={{
            fontSize: 10, fontWeight: 700,
            padding: "3px 10px", borderRadius: 99,
            background: feat.colorLight,
            color: feat.color,
            border: `1px solid ${feat.colorBorder}`,
            flexShrink: 0, marginLeft: 12,
            letterSpacing: "0.06em", textTransform: "uppercase",
          }}
        >
          {feat.badge}
        </span>
      </div>

      <p style={{ color: "var(--text-muted)", fontSize: 13.5, lineHeight: 1.75, margin: 0 }}>
        {feat.desc}
      </p>
    </div>
  );
}

function Features() {
  const nav = useNavigate();

  return (
    <section className="features-section">
      {/* Background gradient */}
      <div
        style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124,58,237,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 54 }}>
          <div className="glow-pill fade-up" style={{ marginBottom: 20 }}>
            ⚡ Platform Features
          </div>
          <h2
            className="fade-up"
            style={{
              fontSize: "clamp(26px, 4vw, 46px)",
              fontWeight: 900,
              lineHeight: 1.2,
              marginBottom: 16,
              letterSpacing: "-1px",
              animationDelay: "0.1s",
            }}
          >
            Everything you need to{" "}
            <span className="grad-text">land the job</span>
          </h2>
          <p
            className="fade-up"
            style={{
              color: "var(--text-muted)",
              fontSize: 15,
              maxWidth: 520,
              margin: "0 auto",
              lineHeight: 1.8,
              animationDelay: "0.2s",
            }}
          >
            One platform for mock interviews, aptitude tests, and AI-driven feedback — built to get you interview-ready, fast.
          </p>
        </div>

        {/* 3D Feature Grid */}
        <div className="features-grid">
          {feats.map((feat) => (
            <FeatureCard key={feat.title} feat={feat} />
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="features-cta-strip">
          {/* Glow background */}
          <div
            style={{
              position: "absolute",
              top: "-50%", left: "30%",
              width: 400, height: 400,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", marginBottom: 6, letterSpacing: "-0.3px" }}>
              Ready to start practicing?
            </div>
            <div style={{ fontSize: 14, color: "var(--text-muted)" }}>
              Join candidates who prepare smarter with InterviewMate.
            </div>
          </div>
          <div className="features-cta-actions">
            <button className="btn btn-primary" style={{ fontSize: 14, padding: "12px 28px" }} onClick={() => nav("/setup")}>
              Start Interview →
            </button>
            <button className="btn btn-outline" style={{ fontSize: 14, padding: "12px 24px" }} onClick={() => nav("/mock-tests")}>
              Mock Tests
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Features;
