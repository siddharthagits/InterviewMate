import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useInterview } from "../context/InterviewContext";

function perfColor(score) {
  if (score >= 85) return "#10b981";
  if (score >= 70) return "#7c3aed";
  if (score >= 55) return "#f59e0b";
  return "#ef4444";
}

function perfLabel(score) {
  if (score >= 85) return "Excellent 🔥";
  if (score >= 70) return "Good 👍";
  if (score >= 55) return "Average ⚡";
  return "Needs Work 💪";
}

// Animated SVG circular score ring
function ScoreRing({ score, color }) {
  const [animated, setAnimated] = useState(0);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(t);
  }, [score]);

  const offset = circumference - (animated / 100) * circumference;

  return (
    <div style={{ position: "relative", width: 140, height: 140 }}>
      <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
        {/* Progress */}
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div
        style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 30, fontWeight: 900, color, fontFamily: "'Sora', sans-serif", letterSpacing: "-1px" }}>
          {animated}
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.05em" }}>
          SCORE
        </div>
      </div>
    </div>
  );
}

// Animated bar for breakdown
function AnimatedBar({ pct, color, label }) {
  const [animPct, setAnimPct] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimPct(pct), 200);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ color: "var(--text-muted)", fontSize: 13, fontWeight: 500 }}>{label}</span>
        <span style={{ fontWeight: 700, color, fontSize: 14 }}>{Math.round(pct)}%</span>
      </div>
      <div className="progress-track" style={{ height: 8 }}>
        <div
          className="progress-fill"
          style={{
            width: `${animPct}%`,
            background: `linear-gradient(90deg, ${color}, ${color}99)`,
            transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>
    </div>
  );
}

// Stat card with icon
function StatCard({ label, value, icon, color, delay = 0 }) {
  return (
    <div
      className="stat-card fade-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div
        style={{
          width: 42, height: 42,
          borderRadius: 12,
          background: `${color}15`,
          border: `1px solid ${color}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 16, fontSize: 18,
          color: color,
          boxShadow: `0 4px 12px ${color}20`,
        }}
      >
        {icon}
      </div>
      <div style={{ fontSize: 28, fontWeight: 900, color, fontFamily: "'Sora', sans-serif", letterSpacing: "-0.5px" }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4, fontWeight: 500, letterSpacing: "0.02em" }}>
        {label}
      </div>
    </div>
  );
}

function Dashboard() {
  const { result, interviewData } = useInterview();
  const hasResult = !!result;
  const score = result?.score ?? null;

  const stats = hasResult
    ? [
        { label: "Last Score", value: `${score}%`, icon: "◈", color: perfColor(score) },
        { label: "MCQ Correct", value: `${result.mcq_correct ?? "—"}/${result.mcq_total ?? 25}`, icon: "⊞", color: "#7c3aed" },
        { label: "Code Correct", value: `${result.code_correct ?? "—"}/${result.code_total ?? 5}`, icon: "</>", color: "#f59e0b" },
        { label: "Text Score", value: `${result.text_score ?? "—"}/100`, icon: "✎", color: "#10b981" },
        { label: "Performance", value: perfLabel(score), icon: "★", color: perfColor(score) },
        { label: "Total Questions", value: result.totalQuestions ?? 35, icon: "≡", color: "var(--text-dim)" },
      ]
    : [
        { label: "Interviews Done", value: "0", icon: "▶", color: "#7c3aed" },
        { label: "Average Score", value: "—", icon: "◈", color: "var(--text-muted)" },
        { label: "Best Score", value: "—", icon: "★", color: "#f59e0b" },
      ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)",
            borderRadius: 99, padding: "5px 14px", marginBottom: 14,
            fontSize: 11, color: "var(--violet-light)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
          }}
        >
          {hasResult ? "📊 Session Results" : "👋 Welcome Back"}
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 900, marginBottom: 6, letterSpacing: "-0.5px", fontFamily: "'Sora', sans-serif" }}>
          {hasResult ? "Your Interview Results" : "Dashboard"}
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6 }}>
          {hasResult
            ? `${interviewData.role} · ${interviewData.difficulty} · ${interviewData.language}`
            : "Start your first interview to see your performance data here."}
        </p>
      </div>

      {/* Stats grid */}
      <div className="dashboard-stats-grid">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 0.07} />
        ))}
      </div>

      {/* Score ring + Breakdown */}
      {hasResult && (
        <div className="dashboard-score-grid">
          {/* Score Ring */}
          <div
            className="glass fade-up"
            style={{
              padding: "28px",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 16, minWidth: 160,
              animationDelay: "0.35s",
            }}
          >
            <ScoreRing score={score} color={perfColor(score)} />
            <div
              style={{
                fontSize: 13, fontWeight: 700,
                color: perfColor(score),
                background: `${perfColor(score)}15`,
                border: `1px solid ${perfColor(score)}30`,
                borderRadius: 99, padding: "4px 14px",
              }}
            >
              {perfLabel(score)}
            </div>
          </div>

          {/* Breakdown bars */}
          <div className="glass fade-up" style={{ padding: "24px 28px", animationDelay: "0.45s" }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 22, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Score Breakdown
            </h2>
            <AnimatedBar pct={result.mcq_score ?? 0}  color="#7c3aed" label="MCQ Section (50% weight)" />
            <AnimatedBar pct={result.code_score ?? 0} color="#f59e0b" label="Code Section (20% weight)" />
            <AnimatedBar pct={result.text_score ?? 0} color="#10b981" label="Text Section (30% weight)" />
          </div>
        </div>
      )}

      {/* AI Feedback */}
      {hasResult && result.feedback && (
        <div
          className="glass fade-up"
          style={{ padding: "22px 26px", marginBottom: 20, animationDelay: "0.5s", position: "relative", overflow: "hidden" }}
        >
          <div
            style={{
              position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
              background: "linear-gradient(180deg, #7c3aed, #06b6d4)",
              borderRadius: "20px 0 0 20px",
            }}
          />
          <h2 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "var(--violet-light)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            AI Feedback
          </h2>
          <p style={{ color: "var(--text-dim)", fontSize: 14, lineHeight: 1.8 }}>{result.feedback}</p>
        </div>
      )}

      {/* Quick Action */}
      <div
        className="glass fade-up"
        style={{
          padding: "24px 28px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 16,
          animationDelay: "0.55s",
          background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.04))",
          border: "1px solid rgba(124,58,237,0.18)",
        }}
      >
        <div>
          <p style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.2px" }}>
            {hasResult ? "Ready for another round?" : "Start your first interview"}
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>
            {hasResult
              ? `Last: ${interviewData.role} — Score ${score}/100`
              : "Choose your role, language, and difficulty to begin"}
          </p>
        </div>
        <Link to="/setup" className="btn btn-primary">
          {hasResult ? "Retry Interview →" : "Start Interview →"}
        </Link>
      </div>

      {hasResult && (
        <div style={{ marginTop: 16, textAlign: "right" }}>
          <Link
            to="/results"
            style={{
              fontSize: 13, color: "var(--violet-light)",
              textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 5,
              opacity: 0.8, transition: "opacity 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "1"}
            onMouseLeave={e => e.currentTarget.style.opacity = "0.8"}
          >
            View full results & answer key →
          </Link>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Dashboard;