import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../context/InterviewContext";


// ── Steps config ───────────────────────────────────────────────────────────────
const STEPS = [
  {
    name: "role",
    label: "Job Role",
    subtitle: "What position are you interviewing for?",
    options: [
      { value: "Software Engineer", icon: "⚙️" },
      { value: "Frontend Developer", icon: "🎨" },
      { value: "Backend Developer", icon: "🔧" },
      { value: "Full Stack Developer", icon: "🔀" },
      { value: "Data Analyst", icon: "📊" },
    ],
  },
  {
    name: "experience",
    label: "Experience Level",
    subtitle: "How much experience do you have?",
    options: [
      { value: "Fresher", icon: "🌱" },
      { value: "1-2 Years", icon: "🚀" },
      { value: "3-5 Years", icon: "💼" },
      { value: "5+ Years", icon: "🏆" },
    ],
  },
  {
    name: "language",
    label: "Programming Language",
    subtitle: "Which language will you be tested in?",
    options: [
      { value: "JavaScript", icon: "JS" },
      { value: "Python", icon: "Py" },
      { value: "Java", icon: "☕" },
      { value: "C++", icon: "C++" },
    ],
  },
  {
    name: "difficulty",
    label: "Difficulty",
    subtitle: "Choose your challenge level.",
    options: [
      { value: "Easy", icon: "🟢", color: "#10b981" },
      { value: "Medium", icon: "🟡", color: "#f59e0b" },
      { value: "Hard", icon: "🔴", color: "#ef4444" },
    ],
  },
  // Step 5 — Mode & Launch
  { name: "_launch", label: "Mode & Launch", subtitle: "Configure your session and start!", isLaunch: true },
];

export default function InterviewSetup() {
  const navigate = useNavigate();
  const { setInterviewData } = useInterview();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    role: "", experience: "", language: "", difficulty: "", duration: "30 Minutes",
    company: "", pressureMode: false,
  });

  const currentStep = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const selectedValue = form[currentStep.name];
  const canNext = currentStep.isLaunch ? true : !!selectedValue;

  const select = (value) => setForm(p => ({ ...p, [currentStep.name]: value }));

  const launch = () => {
    setInterviewData(p => ({ ...p, ...form, company: "" })); // no company from setup
    navigate("/interview");
  };

  const next = () => {
    if (!canNext) return;
    if (isLast) { launch(); return; }
    setStep(s => s + 1);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        background: "var(--bg)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* BG glow */}
      <div style={{
        position: "absolute", top: "20%", left: "50%",
        transform: "translateX(-50%)",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)",
        filter: "blur(60px)", pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 600, position: "relative" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div className="glow-pill" style={{ marginBottom: 16 }}>
            Step {step + 1} of {STEPS.length}
          </div>
          <h1 style={{
            fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 900,
            letterSpacing: "-0.5px", fontFamily: "'Sora', sans-serif", marginBottom: 8,
          }}>
            {currentStep.label}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>{currentStep.subtitle}</p>
        </div>

        {/* Step progress segments */}
        <div style={{ display: "flex", gap: 4, marginBottom: 32 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 99,
              background: i <= step
                ? "linear-gradient(90deg, #7c3aed, #06b6d4)"
                : "rgba(255,255,255,0.06)",
              transition: "background 0.4s",
            }} />
          ))}
        </div>

        {/* ── Content Card ── */}
        <div className="glass scale-in" style={{ padding: "32px", marginBottom: 20 }}>

          {/* ── Standard option step ── */}
          {!currentStep.isCompany && !currentStep.isLaunch && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {currentStep.options.map(({ value, icon, color }) => (
                <button
                  key={value}
                  className={`option-pill ${selectedValue === value ? "selected" : ""}`}
                  style={{
                    fontSize: 14,
                    borderColor: selectedValue === value && color ? color : undefined,
                    color: selectedValue === value && color ? color : undefined,
                    background: selectedValue === value && color ? `${color}15` : undefined,
                    boxShadow: selectedValue === value && color ? `0 0 16px ${color}25` : undefined,
                  }}
                  onClick={() => select(value)}
                  type="button"
                >
                  <span style={{
                    fontSize: 15,
                    fontFamily: icon.length <= 3 ? "'JetBrains Mono', monospace" : undefined,
                    fontWeight: 800,
                  }}>{icon}</span>
                  {value}
                </button>
              ))}
            </div>
          )}


          {/* ── Launch Step ── */}
          {currentStep.isLaunch && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Summary */}
              <div style={{
                background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)",
                borderRadius: 14, padding: "16px 20px",
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--violet-light)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Session Summary
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {[
                    { label: "Role", val: form.role },
                    { label: "Level", val: form.experience },
                    { label: "Language", val: form.language },
                    { label: "Difficulty", val: form.difficulty },
                    { label: "Duration", val: form.duration },
                  ].filter(Boolean).map(({ label, val }) => (
                    <div key={label} style={{
                      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 10, padding: "6px 14px", fontSize: 13,
                    }}>
                      <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{label}: </span>
                      <span style={{ fontWeight: 600, color: "var(--text)" }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pressure Mode Toggle */}
              <div style={{
                background: form.pressureMode ? "rgba(239,68,68,0.06)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${form.pressureMode ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.07)"}`,
                borderRadius: 14, padding: "16px 20px",
                transition: "all 0.3s",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
                      ⚡ Pressure Mode
                      {form.pressureMode && (
                        <span style={{
                          fontSize: 10, padding: "2px 8px", borderRadius: 99,
                          background: "rgba(239,68,68,0.15)", color: "#ef4444",
                          border: "1px solid rgba(239,68,68,0.3)", fontWeight: 700,
                        }}>ACTIVE</span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                      Each question gets its own countdown timer.<br />
                      MCQ: 60s · Text: 90s · Code: 120s
                    </div>
                  </div>
                  {/* Toggle switch */}
                  <button
                    type="button"
                    onClick={() => setForm(p => ({ ...p, pressureMode: !p.pressureMode }))}
                    style={{
                      width: 52, height: 28, borderRadius: 99,
                      background: form.pressureMode
                        ? "linear-gradient(135deg, #ef4444, #dc2626)"
                        : "rgba(255,255,255,0.1)",
                      border: "none", cursor: "pointer",
                      position: "relative", transition: "all 0.3s",
                      flexShrink: 0,
                      boxShadow: form.pressureMode ? "0 0 16px rgba(239,68,68,0.4)" : "none",
                    }}
                  >
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%", background: "#fff",
                      position: "absolute", top: 4,
                      left: form.pressureMode ? 28 : 4,
                      transition: "left 0.25s cubic-bezier(0.4,0,0.2,1)",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                    }} />
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", gap: 12 }}>
          {step > 0 && (
            <button
              className="btn btn-outline"
              style={{ flex: 0, padding: "13px 24px", fontSize: 14 }}
              onClick={() => setStep(s => s - 1)}
              type="button"
            >← Back</button>
          )}
          <button
            className={isLast ? "btn btn-gold" : "btn btn-primary"}
            style={{ flex: 1, fontSize: 15, padding: "14px 28px", opacity: canNext ? 1 : 0.4 }}
            onClick={next}
            disabled={!canNext}
            type="button"
          >
            {isLast
              ? "🚀 Launch Interview"
              : `Next: ${STEPS[step + 1]?.label} →`}
          </button>
        </div>

        {/* Dot indicators */}
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 24 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 20 : 6, height: 6, borderRadius: 99,
              background: i <= step ? "var(--violet)" : "rgba(255,255,255,0.1)",
              transition: "all 0.3s",
            }} />
          ))}
        </div>

      </div>
    </div>
  );
}