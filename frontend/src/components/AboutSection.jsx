import { useNavigate } from "react-router-dom";

// SVG Icons for About Section
const icons = {
  voice: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="22"/>
    </svg>
  ),
  brain: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z"/>
    </svg>
  ),
  building: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="9" y1="6" x2="9.01" y2="6" strokeWidth="2.5" />
      <line x1="15" y1="6" x2="15.01" y2="6" strokeWidth="2.5" />
      <line x1="9" y1="10" x2="9.01" y2="10" strokeWidth="2.5" />
      <line x1="15" y1="10" x2="15.01" y2="10" strokeWidth="2.5" />
      <line x1="9" y1="14" x2="9.01" y2="14" strokeWidth="2.5" />
      <line x1="15" y1="14" x2="15.01" y2="14" strokeWidth="2.5" />
      <line x1="9" y1="18" x2="15" y2="18" />
    </svg>
  ),
  analytics: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
};

const pillars = [
  {
    icon: icons.voice,
    color: "#7c3aed",
    title: "Interactive Voice Interviewer",
    desc: "Real-time speech-to-speech simulation that evaluates verbal articulation, confidence, pacing, and filler words to hone communication skills.",
  },
  {
    icon: icons.brain,
    color: "#06b6d4",
    title: "Adaptive AI Evaluation",
    desc: "Instant multi-factor feedback that inspects code correctness, edge cases, algorithmic time/space trade-offs, and subjective explanation clarity.",
  },
  {
    icon: icons.building,
    color: "#f59e0b",
    title: "Company-Targeted Tracks",
    desc: "Curated exam environments tailored to the hiring patterns of leading technology companies and global engineering teams.",
  },
  {
    icon: icons.analytics,
    color: "#10b981",
    title: "In-Depth Performance Analytics",
    desc: "Comprehensive readiness scoring, granular topic breakdowns, and actionable career roadmaps to eliminate knowledge gaps.",
  },
];

const highlights = [
  "Zero-bias objective evaluation",
  "Realistic timed interview simulations",
  "Extensive technical & behavioral banks",
  "Instant actionable critique & tips",
];

export default function AboutSection() {
  const nav = useNavigate();

  return (
    <section id="about" className="about-section">
      {/* Background radial accent */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          maxWidth: 700,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, rgba(6,182,212,0.04) 50%, transparent 70%)",
          pointerEvents: "none",
          filter: "blur(50px)",
        }}
      />

      <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative" }}>
        
        {/* Header Badge & Title */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div className="glow-pill fade-up" style={{ marginBottom: 18 }}>
            🎯 About InterviewMate
          </div>
          <h2
            className="fade-up"
            style={{
              fontSize: "clamp(26px, 4vw, 44px)",
              fontWeight: 900,
              lineHeight: 1.2,
              marginBottom: 16,
              letterSpacing: "-1px",
            }}
          >
            Transforming Interview Readiness into <span className="grad-text">Dream Offers</span>
          </h2>
          <p
            className="fade-up"
            style={{
              color: "var(--text-muted)",
              fontSize: 15.5,
              maxWidth: 680,
              margin: "0 auto",
              lineHeight: 1.8,
            }}
          >
            InterviewMate is an AI-driven interview preparation ecosystem designed to help developers and students practice, evaluate, and master technical, behavioral, and company-specific interviews with confidence.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="about-pillars-grid">
          {pillars.map((item) => (
            <div key={item.title} className="about-pillar-card">
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  background: `${item.color}15`,
                  border: `1px solid ${item.color}35`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: item.color,
                  marginBottom: 16,
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 8, letterSpacing: "-0.2px" }}>
                {item.title}
              </h3>
              <p style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Value Proposition Strip */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.05))",
            border: "1px solid rgba(124,58,237,0.22)",
            borderRadius: 22,
            padding: "32px 36px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <div>
            <h3 style={{ fontSize: 19, fontWeight: 800, color: "var(--text)", marginBottom: 10, letterSpacing: "-0.3px" }}>
              Ready to elevate your interview confidence?
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 12 }}>
              {highlights.map((text) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text)" }}>
                  {icons.check}
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            className="btn btn-primary"
            style={{ fontSize: 14, padding: "12px 24px", borderRadius: 12, flexShrink: 0 }}
            onClick={() => nav("/setup")}
          >
            Start Practicing Now →
          </button>
        </div>

      </div>
    </section>
  );
}
