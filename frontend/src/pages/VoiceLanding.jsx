import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

// ── Animated equalizer bars ───────────────────────────────────────────────────
function EqBars({ count = 20, color = "#10b981", height = 48 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 4,
            borderRadius: 3,
            background: `linear-gradient(180deg, ${color}, ${color}55)`,
            height: `${20 + Math.sin(i * 0.7) * 14}px`,
            animation: `voiceEq ${0.5 + (i % 6) * 0.12}s ease-in-out ${i * 0.04}s infinite alternate`,
            opacity: 0.85,
          }}
        />
      ))}
    </div>
  );
}

// ── Feature card ──────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, desc, color, delay }) {
  return (
    <div
      className="glass"
      style={{
        padding: "28px 24px",
        borderRadius: 20,
        flex: "1 1 240px",
        minWidth: 0,
        animation: `fadeUp 0.6s ease ${delay}s both`,
        borderColor: `${color}25`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${color}, ${color}44)`,
        borderRadius: "20px 20px 0 0",
      }} />
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: `${color}15`, border: `1px solid ${color}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, marginBottom: 16,
        boxShadow: `0 4px 16px ${color}20`,
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>{title}</h3>
      <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7 }}>{desc}</p>
    </div>
  );
}

// ── Step card ─────────────────────────────────────────────────────────────────
function StepCard({ num, title, desc, color }) {
  return (
    <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
      <div style={{
        width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
        background: `linear-gradient(135deg, ${color}, ${color}88)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 15, fontWeight: 900, color: "#fff",
        boxShadow: `0 4px 16px ${color}40`,
      }}>{num}</div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.65 }}>{desc}</div>
      </div>
    </div>
  );
}

export default function VoiceLanding() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <style>{`
        @keyframes voiceEq {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1.6); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseRing {
          0%   { transform: scale(1);   opacity: 0.5; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
      `}</style>

      {/* ── HERO ── */}
      <div style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center",
        padding: "100px 24px 60px",
        position: "relative", overflow: "hidden",
      }}>

        {/* Background glows */}
        <div style={{
          position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)",
          filter: "blur(60px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", left: "10%",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)",
          filter: "blur(60px)", pointerEvents: "none",
        }} />

        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
          borderRadius: 99, padding: "6px 18px", marginBottom: 28,
          fontSize: 12, fontWeight: 700, color: "#10b981",
          letterSpacing: "0.08em", textTransform: "uppercase",
          animation: "fadeUp 0.5s ease both",
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%", background: "#10b981",
            animation: "pulseRing 1.5s ease-out infinite",
            display: "inline-block",
          }} />
          🎙 AI Voice Interview — Now Live
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 900,
          letterSpacing: "-2px", lineHeight: 1.08,
          fontFamily: "'Sora', sans-serif",
          animation: "fadeUp 0.5s ease 0.1s both",
          marginBottom: 24, maxWidth: 820,
        }}>
          Interview Like It's{" "}
          <span style={{
            background: "linear-gradient(135deg, #10b981, #06b6d4)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            Real
          </span>
        </h1>

        <p style={{
          fontSize: "clamp(16px, 2vw, 20px)", color: "var(--text-muted)",
          maxWidth: 560, lineHeight: 1.7, marginBottom: 48,
          animation: "fadeUp 0.5s ease 0.2s both",
        }}>
          Speak your answers out loud. Our AI listens, transcribes in real-time, detects filler words,
          tracks your pacing, and gives you a full communication score — just like a real interviewer.
        </p>

        {/* Animated Equalizer */}
        <div style={{
          animation: "fadeUp 0.5s ease 0.25s both, floatY 4s ease-in-out 1s infinite",
          marginBottom: 48,
        }}>
          <EqBars count={24} color="#10b981" height={64} />
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", animation: "fadeUp 0.5s ease 0.3s both" }}>
          <Link
            to="/voice/setup"
            className="btn"
            style={{
              padding: "16px 36px", fontSize: 16, fontWeight: 800, borderRadius: 16,
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "#fff", border: "none",
              boxShadow: "0 6px 30px rgba(16,185,129,0.45)",
            }}
          >
            🎙 Start Voice Interview
          </Link>
          <Link
            to="/setup"
            className="btn btn-outline"
            style={{ padding: "16px 32px", fontSize: 15 }}
          >
            Text Interview instead →
          </Link>
        </div>

        {/* Browser note */}
        <p style={{
          marginTop: 24, fontSize: 12, color: "var(--text-muted)", opacity: 0.7,
          animation: "fadeUp 0.5s ease 0.4s both",
        }}>
          🌐 Best on <strong>Chrome</strong> or <strong>Edge</strong> · Requires microphone access
        </p>
      </div>

      {/* ── FEATURES ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>

        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{
            display: "inline-block",
            background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: 99, padding: "5px 16px", marginBottom: 16,
            fontSize: 11, fontWeight: 700, color: "#10b981",
            textTransform: "uppercase", letterSpacing: "0.08em",
          }}>
            What Makes It Different
          </div>
          <h2 style={{
            fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 900,
            letterSpacing: "-0.5px", fontFamily: "'Sora', sans-serif",
          }}>
            Beyond Multiple Choice
          </h2>
        </div>

        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          <FeatureCard icon="🎙" title="Real-Time Transcription" color="#10b981" delay={0}
            desc="Watch your words appear on screen as you speak. No typing required — just talk naturally." />
          <FeatureCard icon="📊" title="Filler Word Detection" color="#f59e0b" delay={0.1}
            desc='Counts "um", "uh", "like", and other fillers live, helping you speak more confidently.' />
          <FeatureCard icon="⚡" title="Speaking Pace Tracker" color="#7c3aed" delay={0.2}
            desc="Measures your words per minute in real-time. Ideal zone shown — too fast or slow gets flagged." />
          <FeatureCard icon="🏆" title="Communication Score" color="#06b6d4" delay={0.3}
            desc="After each session, get a full communication breakdown: Clarity, Confidence, Pacing, Coverage." />
          <FeatureCard icon="🤖" title="AI-Powered Feedback" color="#ec4899" delay={0.4}
            desc="Gemini evaluates your spoken answers against ideal responses and tells you exactly what was missed." />
          <FeatureCard icon="🔁" title="Replay Any Question" color="#10b981" delay={0.5}
            desc="Didn't catch the question? Hit replay and the AI reads it again. Take your time." />
        </div>

        {/* ── HOW IT WORKS ── */}
        <div style={{
          marginTop: 80,
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60,
          alignItems: "center",
        }}>
          <div>
            <div style={{
              display: "inline-block",
              background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)",
              borderRadius: 99, padding: "5px 16px", marginBottom: 20,
              fontSize: 11, fontWeight: 700, color: "#c4b5fd",
              textTransform: "uppercase", letterSpacing: "0.08em",
            }}>
              How It Works
            </div>
            <h2 style={{
              fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 900, marginBottom: 40,
              letterSpacing: "-0.5px", fontFamily: "'Sora', sans-serif",
            }}>
              Three steps to a<br/>better interview
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <StepCard num="1" title="Configure Your Session" color="#10b981"
                desc="Choose your role, experience level, and how many questions you want." />
              <StepCard num="2" title="Speak Your Answers" color="#06b6d4"
                desc="The AI reads each question aloud. Click the mic, speak, stop. That's it." />
              <StepCard num="3" title="Get Your Score" color="#7c3aed"
                desc="Receive a detailed communication score with per-question breakdown and improvement tips." />
            </div>

            <Link
              to="/voice/setup"
              className="btn"
              style={{
                display: "inline-flex", marginTop: 36,
                padding: "14px 32px", fontSize: 15, fontWeight: 700, borderRadius: 14,
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "#fff", border: "none",
                boxShadow: "0 4px 24px rgba(16,185,129,0.4)",
              }}
            >
              🚀 Begin Your Session
            </Link>
          </div>

          {/* Right visual */}
          <div className="glass" style={{
            padding: "40px 32px", borderRadius: 24,
            borderColor: "rgba(16,185,129,0.2)",
            boxShadow: "0 0 60px rgba(16,185,129,0.06)",
            display: "flex", flexDirection: "column", gap: 20,
          }}>
            {/* AI panel mock */}
            <div style={{
              background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: 16, padding: "18px 20px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
            }}>
              <span style={{
                fontSize: 10, fontWeight: 700, color: "#10b981",
                textTransform: "uppercase", letterSpacing: "0.08em",
              }}>🤖 AI Speaking…</span>
              <EqBars count={16} color="#10b981" height={36} />
              <p style={{
                fontSize: 13, color: "var(--text-muted)", textAlign: "center",
                fontStyle: "italic", lineHeight: 1.6, maxWidth: 280,
              }}>
                "Tell me about a project where you had to learn a new technology under time pressure."
              </p>
            </div>

            {/* User panel mock */}
            <div style={{
              background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)",
              borderRadius: 16, padding: "18px 20px",
            }}>
              <div style={{
                fontSize: 10, fontWeight: 700, color: "#c4b5fd",
                textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10,
              }}>📝 Your Answer</div>
              <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.7 }}>
                "At my last job, we needed to migrate to TypeScript in just two weeks. I started with the official docs and built small prototypes…"
                <span style={{
                  display: "inline-block", width: 2, height: "1em",
                  background: "#10b981", marginLeft: 3, verticalAlign: "middle",
                  animation: "pulseRing 0.7s ease-in-out infinite",
                }} />
              </p>
              <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                <span style={{
                  fontSize: 11, padding: "3px 10px", borderRadius: 99,
                  background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)",
                }}>⚡ 138 wpm</span>
                <span style={{
                  fontSize: 11, padding: "3px 10px", borderRadius: 99,
                  background: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)",
                }}>💬 0 fillers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
