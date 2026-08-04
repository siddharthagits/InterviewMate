import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ROLES = [
  "Frontend Interview",
  "Backend Interview",
  "System Design Round",
  "DSA Challenge",
  "Full Stack Interview",
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
        timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 55);
      } else {
        timeout = setTimeout(() => setTyping(false), 1800);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
      } else {
        setRoleIdx((i) => (i + 1) % ROLES.length);
        setTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayed, typing, roleIdx]);

  const stats = [
    { icon: <IconStar />, value: "35+", label: "Questions/Session" },
    { icon: <IconTarget />, value: "3",  label: "Question Formats" },
    { icon: <IconStar />,  value: "AI",  label: "Instant Scoring" },
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
        AI-Powered Interview Practice
      </div>

      {/* Main Heading */}
      <h1
        className="fade-up hero-heading"
        style={{
          lineHeight: 1.15,
          maxWidth: 820,
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
          maxWidth: 580,
          color: "var(--text-muted)",
          lineHeight: 1.8,
          animationDelay: "0.2s",
        }}
      >
        Practice with{" "}
        <strong style={{ color: "var(--violet-light)" }}>35 adaptive questions</strong> — MCQs,
        code output challenges, and in-depth answers — then get{" "}
        <strong style={{ color: "var(--gold-light)" }}>instant AI feedback</strong> on every answer.
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
          style={{ fontSize: 15, padding: "14px 28px", gap: 10 }}
          onClick={() => nav("/setup")}
        >
          <IconPlay /> Start Free Interview
        </button>
        <button
          className="btn btn-gold"
          style={{ fontSize: 15, padding: "14px 28px", gap: 10 }}
          onClick={() => nav("/mock-tests")}
        >
          <IconTarget /> Free Mock Tests
        </button>
        <button
          className="btn btn-outline"
          style={{ fontSize: 15, padding: "14px 24px", gap: 10 }}
          onClick={() => nav("/dashboard")}
        >
          <IconLayout /> View Dashboard
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
                fontSize: "clamp(28px, 4vw, 36px)",
                fontWeight: 900,
                fontFamily: "'Sora', sans-serif",
                background: "var(--hero-stat-gradient)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-1px",
              }}
            >
              {value}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                marginTop: 6,
                fontWeight: 500,
                letterSpacing: "0.03em",
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
