import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../context/InterviewContext";
import ThemeToggle from "../components/ThemeToggle";

const STEPS = [
  {
    name: "role",
    label: "Job Role",
    subtitle: "What position are you interviewing for?",
    options: [
      { value: "Software Engineer",   icon: "⚙️" },
      { value: "Frontend Developer",  icon: "🎨" },
      { value: "Backend Developer",   icon: "🔧" },
      { value: "Full Stack Developer",icon: "🔀" },
      { value: "Data Analyst",        icon: "📊" },
      { value: "DevOps Engineer",     icon: "🚀" },
    ],
  },
  {
    name: "count",
    label: "Number of Questions",
    subtitle: "How many questions would you like?",
    options: [
      { value: "5",  icon: "⚡", desc: "~5 min" },
      { value: "8",  icon: "🔥", desc: "~8 min" },
      { value: "10", icon: "💪", desc: "~12 min" },
    ],
  },
  { name: "_miccheck", label: "Mic Check", subtitle: "Let's make sure your microphone is working.", isMicCheck: true },
];

// ── Mic visualiser pulse ──────────────────────────────────────────────────────
function MicRing({ active }) {
  return (
    <div style={{ position: "relative", width: 100, height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {active && [1, 2, 3].map(i => (
        <div key={i} style={{
          position: "absolute", width: 100, height: 100, borderRadius: "50%",
          border: "2px solid rgba(16,185,129,0.4)",
          animation: `mcRipple 1.8s ease-out ${i * 0.4}s infinite`,
        }} />
      ))}
      <div style={{
        width: 72, height: 72, borderRadius: "50%",
        background: active
          ? "linear-gradient(135deg, #10b981, #059669)"
          : "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.1))",
        border: "2px solid rgba(16,185,129,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 28,
        boxShadow: active ? "0 0 30px rgba(16,185,129,0.5)" : "none",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        position: "relative", zIndex: 1,
      }}>
        {active ? "🎙" : "🎤"}
      </div>
    </div>
  );
}

export default function VoiceSetup() {
  const navigate = useNavigate();
  const { setInterviewData } = useInterview();

  const [step, setStep]   = useState(0);
  const [form, setForm]   = useState({ role: "", count: "8" });
  const [micState, setMicState] = useState("idle"); // idle | listening | success | error
  const [micText, setMicText]   = useState("");
  const srRef = useRef(null);

  const current  = STEPS[step];
  const isLast   = step === STEPS.length - 1;
  const canNext  = current.isMicCheck
    ? micState === "success"
    : !!form[current.name];

  const select = (v) => setForm(p => ({ ...p, [current.name]: v }));

  // ── Mic check ──────────────────────────────────────────────────────────────
  const startMicTest = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setMicState("error"); return; }
    const sr = new SR();
    srRef.current = sr;
    sr.lang = "en-US"; sr.continuous = false; sr.interimResults = true;
    sr.onstart  = () => setMicState("listening");
    sr.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join("");
      setMicText(t);
    };
    sr.onend = () => {
      setMicState(prev => prev === "listening" ? "success" : prev);
    };
    sr.onerror = () => setMicState("error");
    sr.start();
    setTimeout(() => { try { sr.stop(); } catch {} }, 5000);
  };
  const stopMicTest = () => { try { srRef.current?.stop(); } catch {} };

  useEffect(() => () => { try { srRef.current?.stop(); } catch {} }, []);

  const launch = () => {
    setInterviewData(p => ({
      ...p,
      role: form.role,
      experience: "Fresher",
      difficulty: "Medium",
      voiceCount: parseInt(form.count) || 8,
      language: "English",
      company: "",
      pressureMode: false,
    }));
    navigate("/voice-interview");
  };

  const next = () => {
    if (!canNext) return;
    if (isLast) { launch(); return; }
    setStep(s => s + 1);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 20px", background: "var(--bg)", position: "relative", overflow: "hidden",
    }}>
      {/* Top right Theme Toggle */}
      <div style={{ position: "fixed", top: 20, right: 24, zIndex: 50 }}>
        <ThemeToggle />
      </div>

      <style>{`
        @keyframes mcRipple {
          0%   { transform: scale(1);   opacity: 0.5; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes vsSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* BG glow */}
      <div style={{
        position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
        filter: "blur(60px)", pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 580, position: "relative" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)",
            borderRadius: 99, padding: "5px 16px", marginBottom: 14,
            fontSize: 11, fontWeight: 700, color: "#10b981",
            letterSpacing: "0.08em", textTransform: "uppercase",
          }}>
            Step {step + 1} of {STEPS.length}
          </div>
          <h1 style={{
            fontSize: "clamp(20px, 3vw, 30px)", fontWeight: 900,
            letterSpacing: "-0.5px", fontFamily: "'Sora', sans-serif", marginBottom: 6,
          }}>
            {current.label}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>{current.subtitle}</p>
        </div>

        {/* Step progress */}
        <div style={{ display: "flex", gap: 4, marginBottom: 28 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 99,
              background: i <= step
                ? "linear-gradient(90deg, #10b981, #06b6d4)"
                : "rgba(255,255,255,0.06)",
              transition: "background 0.4s",
            }} />
          ))}
        </div>

        {/* Card */}
        <div className="glass" style={{
          padding: 32, marginBottom: 20, borderRadius: 20,
          borderColor: "rgba(16,185,129,0.15)",
          animation: "vsSlideIn 0.35s ease both",
          animationKey: step,
        }}>

          {/* ── Option step ── */}
          {!current.isMicCheck && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {current.options.map(({ value, icon, color, desc }) => {
                const sel = form[current.name] === value;
                return (
                  <button
                    key={value}
                    onClick={() => select(value)}
                    type="button"
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "12px 20px", borderRadius: 14,
                      border: sel
                        ? `1px solid ${color || "#10b981"}`
                        : "1px solid rgba(255,255,255,0.08)",
                      background: sel
                        ? `${color || "#10b981"}18`
                        : "rgba(255,255,255,0.02)",
                      color: sel ? (color || "#10b981") : "var(--text-muted)",
                      cursor: "pointer",
                      fontSize: 14, fontWeight: 600,
                      transition: "all 0.2s",
                      boxShadow: sel ? `0 0 16px ${color || "#10b981"}25` : "none",
                    }}
                  >
                    <span style={{ fontSize: 15 }}>{icon}</span>
                    <span>{value}</span>
                    {desc && <span style={{ fontSize: 11, opacity: 0.6 }}>({desc})</span>}
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Mic check step ── */}
          {current.isMicCheck && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>

              {micState === "error" ? (
                <div style={{
                  padding: "20px 24px", borderRadius: 14, textAlign: "center",
                  background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
                }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🚫</div>
                  <div style={{ fontWeight: 700, color: "#ef4444", marginBottom: 6 }}>Microphone not detected</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
                    Your browser may not support speech recognition,<br/>or mic permission was denied.
                    <br /><strong style={{ color: "var(--text)" }}>Please use Chrome or Edge.</strong>
                  </div>
                </div>
              ) : (
                <>
                  <MicRing active={micState === "listening"} />

                  <div style={{ textAlign: "center" }}>
                    {micState === "idle"    && <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Click the button below and say something.</p>}
                    {micState === "listening" && <p style={{ color: "#10b981", fontSize: 14, fontWeight: 600 }}>🎙 Listening — speak now…</p>}
                    {micState === "success"  && <p style={{ color: "#10b981", fontSize: 14, fontWeight: 600 }}>✅ Mic is working perfectly!</p>}
                  </div>

                  {micText && (
                    <div style={{
                      padding: "14px 18px", borderRadius: 12, width: "100%",
                      background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)",
                      fontSize: 14, color: "var(--text-dim)", lineHeight: 1.7, fontStyle: "italic",
                    }}>
                      "{micText}"
                    </div>
                  )}

                  {micState !== "success" ? (
                    <button
                      className="btn"
                      onClick={micState === "listening" ? stopMicTest : startMicTest}
                      style={{
                        background: micState === "listening"
                          ? "linear-gradient(135deg, #ef4444, #dc2626)"
                          : "linear-gradient(135deg, #10b981, #059669)",
                        color: "#fff", border: "none",
                        padding: "13px 32px", fontSize: 14, fontWeight: 700,
                        boxShadow: micState === "listening"
                          ? "0 4px 20px rgba(239,68,68,0.4)"
                          : "0 4px 20px rgba(16,185,129,0.4)",
                      }}
                    >
                      {micState === "listening" ? "⏹ Stop" : "🎤 Test Microphone"}
                    </button>
                  ) : (
                    <div style={{
                      padding: "10px 20px", borderRadius: 99,
                      background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
                      fontSize: 13, color: "#10b981", fontWeight: 700,
                    }}>
                      ✅ Ready to start your interview!
                    </div>
                  )}
                </>
              )}
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
            className="btn"
            style={{
              flex: 1, fontSize: 15, padding: "14px 28px",
              opacity: canNext ? 1 : 0.4,
              background: isLast
                ? "linear-gradient(135deg, #10b981, #059669)"
                : "linear-gradient(135deg, #7c3aed, #5b21b6)",
              color: "#fff", border: "none",
              boxShadow: isLast
                ? "0 4px 24px rgba(16,185,129,0.4)"
                : "0 4px 24px rgba(124,58,237,0.35)",
            }}
            onClick={next}
            disabled={!canNext}
            type="button"
          >
            {isLast
              ? "🎙 Begin Voice Interview"
              : `Next: ${STEPS[step + 1]?.label} →`}
          </button>
        </div>

        {/* Dots */}
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 20 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 20 : 6, height: 6, borderRadius: 99,
              background: i <= step ? "#10b981" : "rgba(255,255,255,0.1)",
              transition: "all 0.3s",
            }} />
          ))}
        </div>

      </div>
    </div>
  );
}
