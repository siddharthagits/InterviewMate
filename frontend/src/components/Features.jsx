<<<<<<< HEAD
const feats = [
  { icon:"🔘", title:"25 MCQ Questions", desc:"Role and difficulty-specific multiple choice questions to test your theoretical knowledge.", badge:"Auto-scored" },
  { icon:"📝", title:"5 Text Answers", desc:"In-depth questions where you type detailed answers, evaluated by Gemini AI.", badge:"AI Graded" },
  { icon:"💻", title:"5 Code Snippets", desc:"Read real code and pick the correct output from 4 options — tests practical debugging.", badge:"Auto-scored" },
  { icon:"⏱", title:"Timed Sessions", desc:"Choose 15, 30, or 45 minute sessions with a live countdown timer.", badge:"15–45 min" },
  { icon:"📊", title:"Instant Feedback", desc:"Get score breakdown for MCQ, code, and text sections with strengths & improvements.", badge:"Instant" },
  { icon:"🎯", title:"Role-Specific", desc:"Questions tailored to your role, language, experience level and difficulty preference.", badge:"Adaptive" },
];

function Features() {
  return (
    <section style={{ padding: "80px 32px", background: "rgba(13,21,38,0.85)", backdropFilter: "blur(2px)" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <h2 style={{ fontSize:40, fontWeight:900 }}>
            Everything you need to <span className="grad-text">prepare</span>
          </h2>
          <p style={{ color:"var(--text-muted)", marginTop:12, fontSize:16 }}>
            A complete interview practice platform with AI evaluation
          </p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:20 }}>
          {feats.map(({ icon,title,desc,badge }) => (
            <div key={title} className="stat-card" style={{ padding:"28px" }}>
              <div style={{ fontSize:32, marginBottom:16 }}>{icon}</div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <h3 style={{ fontSize:17, fontWeight:700 }}>{title}</h3>
                <span className="badge badge-mcq" style={{ flexShrink:0, marginLeft:8 }}>{badge}</span>
              </div>
              <p style={{ color:"var(--text-muted)", fontSize:14, lineHeight:1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
=======
import { useNavigate } from "react-router-dom";

const feats = [
  {
    icon: "🤖",
    title: "AI-Powered Evaluation",
    desc: "Gemini AI instantly grades your text answers, pinpoints weak areas, and gives you actionable improvement tips — no waiting, no bias.",
    badge: "Gemini AI",
    color: "#6366f1",
    colorLight: "rgba(99,102,241,0.12)",
    colorBorder: "rgba(99,102,241,0.3)",
  },
  {
    icon: "🎯",
    title: "Role-Specific Questions",
    desc: "Choose your job role, tech stack, experience level, and difficulty. Every question set is dynamically tailored to your target position.",
    badge: "Adaptive",
    color: "#06b6d4",
    colorLight: "rgba(6,182,212,0.12)",
    colorBorder: "rgba(6,182,212,0.3)",
  },
  {
    icon: "📋",
    title: "3 Question Formats",
    desc: "MCQs to test theory, code-output snippets to test debugging, and open-ended text answers to test depth — all in one session.",
    badge: "35 Questions",
    color: "#f59e0b",
    colorLight: "rgba(245,158,11,0.12)",
    colorBorder: "rgba(245,158,11,0.3)",
  },
  {
    icon: "⏱️",
    title: "Timed Interview Mode",
    desc: "Simulate real interview pressure with a live countdown timer. Pick 15, 30, or 45-minute sessions and train yourself to think fast.",
    badge: "15–45 min",
    color: "#ef4444",
    colorLight: "rgba(239,68,68,0.12)",
    colorBorder: "rgba(239,68,68,0.3)",
  },
  {
    icon: "📊",
    title: "Detailed Score Report",
    desc: "After every session, get a full breakdown — section-wise scores, correct vs wrong, AI feedback on each answer, and a performance summary.",
    badge: "Instant",
    color: "#10b981",
    colorLight: "rgba(16,185,129,0.12)",
    colorBorder: "rgba(16,185,129,0.3)",
  },
  {
    icon: "🧪",
    title: "Free Mock Tests",
    desc: "Practice with standalone timed mock tests across Aptitude, Quants, Reasoning, Coding, GK, and English — no login needed.",
    badge: "Free",
    color: "#ec4899",
    colorLight: "rgba(236,72,153,0.12)",
    colorBorder: "rgba(236,72,153,0.3)",
  },
];

function Features() {
  const nav = useNavigate();

  return (
    <section style={{ padding: "90px 32px 100px", position: "relative" }}>
      {/* Subtle section background */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(13,21,38,0.7)",
        backdropFilter: "blur(2px)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1140, margin: "0 auto", position: "relative" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: 99, padding: "5px 16px", marginBottom: 18,
            fontSize: 12, color: "var(--primary-light)", fontWeight: 600, letterSpacing: "0.05em",
          }}>
            ⚡ PLATFORM FEATURES
          </div>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 900, lineHeight: 1.2, marginBottom: 14 }}>
            Everything you need to{" "}
            <span className="grad-text">land the job</span>
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 15, maxWidth: 520, margin: "0 auto", lineHeight: 1.75 }}>
            One platform for mock interviews, aptitude tests, and AI-driven feedback — built to get you interview-ready fast.
          </p>
        </div>

        {/* Feature Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
          gap: 20,
          marginBottom: 56,
        }}>
          {feats.map(({ icon, title, desc, badge, color, colorLight, colorBorder }) => (
            <div
              key={title}
              style={{
                background: "rgba(13,21,38,0.9)",
                border: `1px solid rgba(255,255,255,0.07)`,
                borderRadius: 18,
                padding: "28px 24px",
                transition: "all 0.25s ease",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = colorBorder;
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = `0 16px 48px ${color}18`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Top accent line */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, ${color}, transparent)`,
                borderRadius: "18px 18px 0 0",
              }} />

              {/* Icon */}
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: colorLight, border: `1px solid ${colorBorder}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, marginBottom: 18,
              }}>
                {icon}
              </div>

              {/* Title + Badge */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9", lineHeight: 1.3 }}>{title}</h3>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 99,
                  background: colorLight, color: color, border: `1px solid ${colorBorder}`,
                  flexShrink: 0, marginLeft: 10, letterSpacing: "0.04em",
                }}>{badge}</span>
              </div>

              <p style={{ color: "var(--text-muted)", fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 20,
          background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.06))",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: 20, padding: "28px 36px",
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9", marginBottom: 6 }}>
              Ready to start practicing?
            </div>
            <div style={{ fontSize: 14, color: "var(--text-muted)" }}>
              Join thousands of candidates who prepare smarter with InterviewMate.
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              className="btn btn-primary"
              style={{ fontSize: 14, padding: "10px 26px" }}
              onClick={() => nav("/setup")}
            >
              Start Interview ▶
            </button>
            <button
              className="btn btn-outline"
              style={{ fontSize: 14, padding: "10px 26px" }}
              onClick={() => nav("/mock-tests")}
            >
              🎯 Mock Tests
            </button>
          </div>
        </div>

>>>>>>> cb25cce (Initial commit)
      </div>
    </section>
  );
}
<<<<<<< HEAD
=======

>>>>>>> cb25cce (Initial commit)
export default Features;