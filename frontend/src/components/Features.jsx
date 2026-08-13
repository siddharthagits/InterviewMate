import { useNavigate } from "react-router-dom";
import { useRef } from "react";

// Inline SVG Icons
const icons = {
  mic: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="22"/>
    </svg>
  ),
  building: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18"/><path d="M3 9h6"/><path d="M3 15h6"/><path d="M15 9h3"/><path d="M15 15h3"/>
    </svg>
  ),
  book: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  keyboard: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2"/>
      <line x1="6" y1="10" x2="6.01" y2="10" strokeWidth="2.5"/><line x1="10" y1="10" x2="10.01" y2="10" strokeWidth="2.5"/>
      <line x1="14" y1="10" x2="14.01" y2="10" strokeWidth="2.5"/><line x1="18" y1="10" x2="18.01" y2="10" strokeWidth="2.5"/>
      <line x1="6" y1="14" x2="6.01" y2="14" strokeWidth="2.5"/><line x1="18" y1="14" x2="18.01" y2="14" strokeWidth="2.5"/>
      <line x1="10" y1="14" x2="14" y2="14" strokeWidth="2.5"/>
    </svg>
  ),
  brain: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2C7 2 5 4 5 6.5c0 .5.1 1 .2 1.5C3.4 8.8 2 10.5 2 12.5 2 15 4 17 6.5 17H9v3.5a1.5 1.5 0 003 0V17h2.5c2.5 0 4.5-2 4.5-4.5 0-2-.8-3.5-2.2-4.3A4.5 4.5 0 009.5 2z"/>
      <path d="M9 9h1m5 0h1m-6 4h1"/>
    </svg>
  ),
  dashboard: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
};

const feats = [
  {
    icon: icons.mic,
    title: "AI Voice Mock Interviewer",
    desc: "Real-time conversational speech simulation. AI asks adaptive questions, listens to spoken answers, and scores communication, tone, and pacing.",
    badge: "Voice AI",
    color: "#7c3aed",
    colorLight: "rgba(124,58,237,0.1)",
    colorBorder: "rgba(124,58,237,0.3)",
    gradient: "linear-gradient(135deg, #7c3aed, #5b21b6)",
    route: "/voice",
  },
  {
    icon: icons.building,
    title: "Company-Targeted Tracks",
    desc: "Curated exam environments aligned to the hiring standards and test patterns of TCS NQT, Infosys, Amazon, Google, and Wipro.",
    badge: "Company Prep",
    color: "#f59e0b",
    colorLight: "rgba(245,158,11,0.1)",
    colorBorder: "rgba(245,158,11,0.3)",
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    route: "/company-assessment",
  },
  {
    icon: icons.book,
    title: "CS Question Bank & Tests",
    desc: "1500+ topic-wise questions across OS, DBMS, Computer Networks, OOPs, and DSA with instant answer reveals and timed tests.",
    badge: "Question Bank",
    color: "#06b6d4",
    colorLight: "rgba(6,182,212,0.1)",
    colorBorder: "rgba(6,182,212,0.3)",
    gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
    route: "/question-bank",
  },
  {
    icon: icons.keyboard,
    title: "Live Typing Speed Test",
    desc: "Test and improve your typing speed with real-time WPM, accuracy %, backspace tracker, and live speed rating badges.",
    badge: "Typing Test",
    color: "#10b981",
    colorLight: "rgba(16,185,129,0.1)",
    colorBorder: "rgba(16,185,129,0.3)",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    route: "/typing-test",
  },
  {
    icon: icons.brain,
    title: "Adaptive AI Evaluation",
    desc: "Gemini AI grades your technical answers, pinpoints edge-case misses, and delivers deep actionable improvement tips with zero bias.",
    badge: "Gemini AI",
    color: "#ec4899",
    colorLight: "rgba(236,72,153,0.1)",
    colorBorder: "rgba(236,72,153,0.3)",
    gradient: "linear-gradient(135deg, #ec4899, #db2777)",
    route: "/setup",
  },
  {
    icon: icons.dashboard,
    title: "Unified Candidate Dashboard",
    desc: "Sleek collapsible sidebar navigation with initial badge, historical interview analytics, score breakdowns, and profile reports.",
    badge: "Dashboard",
    color: "#6366f1",
    colorLight: "rgba(99,102,241,0.1)",
    colorBorder: "rgba(99,102,241,0.3)",
    gradient: "linear-gradient(135deg, #6366f1, #4f46e5)",
    route: "/dashboard",
  },
];

function FeatureCard({ feat }) {
  const nav = useNavigate();
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
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
      onClick={() => feat.route && nav(feat.route)}
      style={{ cursor: feat.route ? "pointer" : "default" }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && feat.route && nav(feat.route)}
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

      <p style={{ color: "var(--text-muted)", fontSize: 13.5, lineHeight: 1.75, margin: "0 0 14px 0" }}>
        {feat.desc}
      </p>

      {feat.route && (
        <div style={{ fontSize: 12, fontWeight: 700, color: feat.color, display: "flex", alignItems: "center", gap: 6 }}>
          Explore Feature <span>→</span>
        </div>
      )}
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
