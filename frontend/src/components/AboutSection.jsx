import { useNavigate } from "react-router-dom";

// SVG Icons for About Section
const icons = {
  sparkles: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  cpu: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/>
      <line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/>
      <line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/>
      <line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/>
      <line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
    </svg>
  ),
  globe: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  shield: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  rocket: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
    </svg>
  ),
  check: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
};

const pillars = [
  {
    icon: icons.sparkles,
    color: "#7c3aed",
    title: "Gemini 2.0 AI Evaluation Engine",
    desc: "Provides instant grading for subjective answers, detects missing technical concepts, and scores logic rigor in real time.",
  },
  {
    icon: icons.cpu,
    color: "#06b6d4",
    title: "High-Performance FastAPI Core",
    desc: "Asynchronous Python backend with non-blocking evaluation pipelines, token caching, and resilient MongoDB Atlas persistence.",
  },
  {
    icon: icons.globe,
    color: "#10b981",
    title: "Global Vercel Edge Deployment",
    desc: "Hosted on Vercel's global CDN network for lightning-fast asset delivery, sub-second page loads, and 99.9% uptime.",
  },
  {
    icon: icons.shield,
    color: "#f59e0b",
    title: "Comprehensive Interview Coverage",
    desc: "Full spectrum prep: Voice simulations, Top-tier Company exams, Topic-wise Question Banks, and live Typing speed testing.",
  },
];

const techStack = [
  { name: "React 19", category: "Frontend", color: "#61DAFB" },
  { name: "Vite 8", category: "Build Tool", color: "#646CFF" },
  { name: "Tailwind CSS v4", category: "Styling", color: "#38B2AC" },
  { name: "Google Gemini AI", category: "Intelligence", color: "#4285F4" },
  { name: "FastAPI", category: "Backend", color: "#009688" },
  { name: "MongoDB Atlas", category: "Database", color: "#47A248" },
  { name: "Vercel Edge", category: "Deployment", color: "#0070F3" },
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
            🚀 About InterviewMate · Production Deployment
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
            Empowering Careers with <span className="grad-text">Intelligent Preparation</span>
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
            InterviewMate is an open-source, AI-driven assessment platform engineered to simulate real technical, behavioral, and company-specific interview environments with zero bias and instant feedback.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="about-pillars-grid">
          {pillars.map((item) => (
            <div key={item.title} className="about-pillar-card">
              <div
                style={{
                  width: 44,
                  height: 44,
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

        {/* Deployment Showcase Box */}
        <div className="about-deployment-card">
          <div className="about-deployment-info">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  padding: "4px 12px",
                  borderRadius: 99,
                  background: "rgba(0, 112, 243, 0.15)",
                  color: "#60a5fa",
                  border: "1px solid rgba(0, 112, 243, 0.3)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#60a5fa", display: "inline-block", boxShadow: "0 0 8px #60a5fa" }} />
                Vercel Production
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: 99,
                  background: "rgba(16,185,129,0.12)",
                  color: "#34d399",
                  border: "1px solid rgba(16,185,129,0.25)",
                }}
              >
                Live at aiinterviewmate.vercel.app
              </span>
            </div>

            <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", marginBottom: 10, letterSpacing: "-0.3px" }}>
              Continuous Delivery & Modern Cloud Architecture
            </h3>
            <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.75, maxWidth: 540, margin: 0 }}>
              Built with React 19, FastAPI, and MongoDB Atlas. Deployed on Vercel with automatic continuous integration, global edge caching, and mobile responsiveness.
            </p>

            {/* Checklist */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, marginTop: 18 }}>
              {[
                "100% Free & Open Source",
                "Instant Gemini AI Feedback",
                "Fully Mobile Responsive",
                "Sub-second Edge Latency",
              ].map((text) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text)" }}>
                  {icons.check}
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Pills */}
          <div className="about-tech-cloud">
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--violet-light)", marginBottom: 12 }}>
              Technology Stack
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--glass-border)",
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: "var(--text)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: tech.color }} />
                  {tech.name}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 22, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a
                href="https://github.com/siddharthagits/InterviewMate"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
                style={{ fontSize: 13, padding: "9px 18px", borderRadius: 10, gap: 6, textDecoration: "none" }}
              >
                GitHub Repo ↗
              </a>
              <button
                className="btn btn-primary"
                style={{ fontSize: 13, padding: "9px 18px", borderRadius: 10 }}
                onClick={() => nav("/setup")}
              >
                Try Live Prep →
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
