import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ROLES = [
  "AI Voice Interview",
  "Company Assessment",
  "Frontend & Backend Round",
  "System Design & DSA",
  "Live Typing Speed Test",
  "Aptitude & Reasoning",
];

// Inline SVG icons — no emojis
const IconStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const IconPlay = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

const IconMic = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="22"/>
  </svg>
);

const IconTarget = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const IconLayout = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="21" x2="9" y2="9" />
  </svg>
);

function Hero() {
  const nav = useNavigate();
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const target = ROLES[roleIdx];
    let timeout;

    if (typing) {
      if (displayed.length < target.length) {
        timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 50);
      } else {
        timeout = setTimeout(() => setTyping(false), 1800);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 25);
      } else {
        setRoleIdx((i) => (i + 1) % ROLES.length);
        setTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayed, typing, roleIdx]);

  const stats = [
    { icon: <IconStar />, value: "35+", label: "Questions/Session" },
    { icon: <IconTarget />, value: "6+",  label: "Practice Tracks" },
    { icon: <IconStar />,  value: "Voice AI", label: "Real-Time Feedback" },
    { icon: <IconStar />,  value: "1500+", label: "Question Bank" },
  ];

  return (
    <section className="hero-section">
      {/* Section glow blob */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          maxWidth: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          filter: "blur(40px)",
        }}
      />

      {/* Badge pill */}
      <div className="glow-pill fade-up" style={{ marginBottom: 28 }}>
        <IconStar />
        Next-Gen AI Interview &amp; Assessment Ecosystem
      </div>

      {/* Main Heading */}
      <h1
        className="fade-up hero-heading"
        style={{
          lineHeight: 1.15,
          maxWidth: 1100,
          width: "100%",
          letterSpacing: "-1.5px",
          animationDelay: "0.1s",
        }}
      >
        Ace Your Next
        <br />
        <span
          style={{
            display: "inline-block",
            minWidth: "2ch",
            whiteSpace: "nowrap",
            maxWidth: "100%",
            background: "var(--hero-gradient)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            borderRight: "3px solid var(--violet-light)",
            paddingRight: 4,
            animation: "typewriter-blink 0.8s step-end infinite",
          }}
        >
          {displayed || "\u00A0"}
        </span>
      </h1>

      {/* Subheading */}
      <p
        className="fade-up hero-subheading"
        style={{
          marginTop: 24,
          maxWidth: 640,
          color: "var(--text-muted)",
          lineHeight: 1.8,
          animationDelay: "0.2s",
        }}
      >
        Practice with{" "}
        <strong style={{ color: "var(--violet-light)" }}>interactive Voice AI interviews</strong>,{" "}
        <strong style={{ color: "var(--gold-light)" }}>company-specific assessments</strong>, and{" "}
        <strong style={{ color: "var(--cyan)" }}>35 adaptive technical questions</strong> — complete with instant feedback, typing tests, and a smart dashboard.
      </p>

      {/* CTA Buttons */}
      <div
        className="fade-up hero-cta-container"
        style={{
          marginTop: 36,
          animationDelay: "0.3s",
        }}
      >
        <button
          className="btn btn-primary"
          style={{ fontSize: 15, padding: "14px 26px", gap: 10 }}
          onClick={() => nav("/setup")}
        >
          <IconPlay /> Start Technical Interview
        </button>
        <button
          className="btn btn-gold"
          style={{ fontSize: 15, padding: "14px 26px", gap: 10 }}
          onClick={() => nav("/voice")}
        >
          <IconMic /> Voice AI Interview
        </button>
        <button
          className="btn btn-outline"
          style={{ fontSize: 15, padding: "14px 22px", gap: 10 }}
          onClick={() => nav("/dashboard")}
        >
          <IconLayout /> Candidate Dashboard
        </button>
      </div>

      {/* Stats Row */}
      <div
        className="fade-up hero-stats-grid"
        style={{
          marginTop: 56,
          animationDelay: "0.4s",
        }}
      >
        {stats.map(({ value, label }, i) => (
          <div
            key={label}
            className={`hero-stat-card ${i < stats.length - 1 ? "has-divider" : ""}`}
          >
            <div
              style={{
                fontSize: "clamp(22px, 3.2vw, 34px)",
                fontWeight: 900,
                fontFamily: "'Sora', sans-serif",
                background: "var(--hero-stat-gradient)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.5px",
                whiteSpace: "nowrap",
                lineHeight: 1.15,
              }}
            >
              {value}
            </div>
            <div
              style={{
                fontSize: 12.5,
                color: "var(--text-muted)",
                marginTop: 6,
                fontWeight: 500,
                letterSpacing: "0.02em",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div
        className="float"
        style={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          opacity: 0.4,
        }}
      >
        <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>
          Scroll
        </div>
        <div
          style={{
            width: 1,
            height: 32,
            background: "linear-gradient(180deg, var(--violet), transparent)",
            borderRadius: 2,
          }}
        />
      </div>
    </section>
  );
}

export default Hero;
