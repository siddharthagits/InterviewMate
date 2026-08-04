import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getTCSYear } from "../data/companyQuestions";
import api from "../api/api";

// ── Section colour map ────────────────────────────────────────────────────────
const SECTION_COLORS = {
  "Numerical Ability":  { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  icon: "🔢" },
  "Verbal Ability":     { color: "#10b981", bg: "rgba(16,185,129,0.1)",  icon: "📖" },
  "Reasoning Ability":  { color: "#6366f1", bg: "rgba(99,102,241,0.1)",  icon: "🧩" },
  "Programming Logic":  { color: "#ec4899", bg: "rgba(236,72,153,0.1)",  icon: "💻" },
};

function sectionStyle(sec) {
  return SECTION_COLORS[sec] || { color: "#7c3aed", bg: "rgba(124,58,237,0.1)", icon: "❓" };
}

// ─────────────────────────────────────────────────────────────────────────────
// Browse / Study Mode — Question Card
// Answer + Explanation are ALWAYS visible by default (study mode)
// ─────────────────────────────────────────────────────────────────────────────
function BrowseCard({ item, index, paper }) {
  const [hideAnswer, setHideAnswer] = useState(false);  // default: answer SHOWN
  const [aiExp,      setAiExp]      = useState("");
  const [loadingAi,  setLoadingAi]  = useState(false);
  const s = sectionStyle(item.section);

  const handleAI = async () => {
    if (aiExp || loadingAi) return;
    setLoadingAi(true);
    try {
      const res = await api.post("/explain-question", {
        question: `${item.question} Correct Answer: ${item.options[item.correct]}`,
        subject: `TCS NQT ${paper.year}`,
      });
      setAiExp(res.data.explanation);
    } catch {
      setAiExp("Could not fetch AI explanation. Make sure the backend is running.");
    } finally {
      setLoadingAi(false);
    }
  };

  const openChatGPT = () => {
    const q = item.question.length > 100 ? item.question.slice(0, 100) + "…" : item.question;
    const query = encodeURIComponent(`TCS NQT ${paper.year}: ${q} | Correct Answer: ${item.options[item.correct]}. Explain step by step.`);
    window.open(`https://chatgpt.com/?q=${query}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div style={{
      background: "rgba(10,16,30,0.9)",
      border: `1px solid ${s.color}22`,
      borderRadius: 20,
      marginBottom: 22,
      overflow: "hidden",
      boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
      transition: "border-color 0.2s",
    }}>

      {/* ── Coloured header strip ── */}
      <div style={{
        background: s.bg,
        borderBottom: `1px solid ${s.color}30`,
        padding: "14px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Question number */}
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 14, fontWeight: 900, color: s.color,
            background: `${s.color}20`, border: `1px solid ${s.color}40`,
            borderRadius: 8, padding: "3px 10px",
          }}>
            Q{String(index + 1).padStart(2, "0")}
          </span>
          {/* Section badge */}
          <span style={{
            fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99,
            background: `${s.color}15`, color: s.color, border: `1px solid ${s.color}35`,
            textTransform: "uppercase", letterSpacing: "0.06em",
            display: "flex", alignItems: "center", gap: 5,
          }}>
            {s.icon} {item.section}
          </span>
          {/* Year badge */}
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99,
            background: "rgba(59,130,246,0.12)", color: "#60a5fa",
            border: "1px solid rgba(59,130,246,0.3)",
          }}>
            📅 TCS NQT {item.year}
          </span>
        </div>

        {/* Hide/Show toggle */}
        <button
          onClick={() => setHideAnswer(h => !h)}
          style={{
            background: hideAnswer ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
            border: `1px solid ${hideAnswer ? "rgba(239,68,68,0.4)" : "rgba(16,185,129,0.4)"}`,
            color: hideAnswer ? "#f87171" : "#34d399",
            fontSize: 11, fontWeight: 700, borderRadius: 8,
            padding: "5px 14px", cursor: "pointer", transition: "all 0.2s",
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          {hideAnswer ? "🙈 Answer Hidden — Click to Show" : "✅ Answer Visible — Click to Hide"}
        </button>
      </div>

      {/* ── Question text ── */}
      <div style={{ padding: "22px 24px 0 24px" }}>
        <div style={{
          fontSize: 15.5, fontWeight: 600, color: "var(--text)",
          lineHeight: 1.7, whiteSpace: "pre-wrap",
          letterSpacing: "-0.1px",
        }}>
          {item.question}
        </div>
      </div>

      {/* ── Options grid ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 10, padding: "16px 24px",
      }}>
        {item.options.map((opt, oi) => {
          const isCorrect = oi === item.correct;
          const show = !hideAnswer && isCorrect;
          return (
            <div key={oi} style={{
              background: show ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.03)",
              border: `1.5px solid ${show ? "#10b981" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 12, padding: "13px 16px",
              color: show ? "#ffffff" : "var(--text-muted)",
              fontWeight: show ? 700 : 500,
              fontSize: 14,
              display: "flex", alignItems: "center", gap: 12,
              transition: "all 0.3s ease",
              boxShadow: show ? "0 0 16px rgba(16,185,129,0.2)" : "none",
            }}>
              <span style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                background: show ? "#10b981" : "rgba(255,255,255,0.06)",
                color: show ? "#fff" : "#94a3b8",
                fontSize: 12, fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: show ? "0 0 8px rgba(16,185,129,0.5)" : "none",
                transition: "all 0.3s",
              }}>
                {String.fromCharCode(65 + oi)}
              </span>
              <span style={{ flex: 1 }}>{opt}</span>
              {show && (
                <span style={{
                  fontSize: 16, flexShrink: 0,
                  background: "rgba(16,185,129,0.2)", borderRadius: "50%",
                  width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
                }}>✓</span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Correct Answer label ── */}
      {!hideAnswer && (
        <div style={{
          margin: "0 24px 16px",
          padding: "10px 16px",
          background: "rgba(16,185,129,0.08)",
          border: "1px solid rgba(16,185,129,0.25)",
          borderRadius: 10,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 16 }}>✅</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#34d399" }}>
            Correct Answer:&nbsp;
            <span style={{ color: "var(--text)" }}>
              ({String.fromCharCode(65 + item.correct)}) {item.options[item.correct]}
            </span>
          </span>
        </div>
      )}

      {/* ── Solution & Explanation ── ALWAYS VISIBLE ── */}
      {!hideAnswer && (
        <div style={{
          margin: "0 24px 24px",
          borderRadius: 14,
          overflow: "hidden",
          border: `1px solid ${s.color}30`,
        }}>
          {/* Solution header */}
          <div style={{
            background: `${s.color}18`,
            borderBottom: `1px solid ${s.color}25`,
            padding: "12px 18px",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 17 }}>💡</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: s.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Step-by-Step Solution
            </span>
          </div>

          {/* Explanation body */}
          <div style={{
            background: "rgba(0,0,0,0.35)",
            padding: "18px 20px",
          }}>
            <p style={{
              fontSize: 14, color: "#e2e8f0", lineHeight: 1.8,
              margin: 0, whiteSpace: "pre-wrap",
            }}>
              {item.explanation}
            </p>
          </div>

          {/* Exam tip */}
          {item.tip && (
            <div style={{
              background: "rgba(245,158,11,0.07)",
              borderTop: "1px solid rgba(245,158,11,0.2)",
              padding: "12px 18px",
              display: "flex", alignItems: "flex-start", gap: 10,
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>🎯</span>
              <p style={{ fontSize: 13, color: "#fbbf24", lineHeight: 1.65, margin: 0 }}>
                <strong style={{ color: "#f59e0b" }}>TCS Exam Tip: </strong>{item.tip}
              </p>
            </div>
          )}

          {/* AI Deep Dive */}
          <div style={{
            background: "rgba(0,0,0,0.2)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "12px 18px",
          }}>
            {aiExp ? (
              <div style={{
                background: "rgba(16,185,129,0.06)",
                border: "1px solid rgba(16,185,129,0.2)",
                borderRadius: 10, padding: "14px 16px",
                display: "flex", gap: 12,
              }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>🤖</span>
                <div>
                  <strong style={{ color: "#10b981", display: "block", marginBottom: 8, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    AI Deep Dive
                  </strong>
                  <p style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.7, margin: 0 }}>{aiExp}</p>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Need more help?</span>
                <button
                  onClick={handleAI}
                  disabled={loadingAi}
                  style={{
                    background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)",
                    color: "#c4b5fd", fontSize: 12, fontWeight: 700,
                    padding: "6px 16px", borderRadius: 8,
                    cursor: loadingAi ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", gap: 6,
                    transition: "all 0.2s", opacity: loadingAi ? 0.6 : 1,
                  }}
                  onMouseEnter={e => { if (!loadingAi) e.currentTarget.style.background = "rgba(124,58,237,0.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(124,58,237,0.1)"; }}
                >
                  {loadingAi ? "⏳ Generating…" : "✨ AI Deep Dive"}
                </button>
                <button
                  onClick={openChatGPT}
                  style={{
                    background: "rgba(16,163,127,0.08)", border: "1px solid rgba(16,163,127,0.3)",
                    color: "#10a37f", fontSize: 12, fontWeight: 700,
                    padding: "6px 16px", borderRadius: 8, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(16,163,127,0.18)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(16,163,127,0.08)"}
                >
                  💬 Ask ChatGPT ↗
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock Test Runner
// ─────────────────────────────────────────────────────────────────────────────
function MockTestRunner({ paper, onFinish }) {
  const [currIdx,   setCurrIdx]   = useState(0);
  const [answers,   setAnswers]   = useState({});
  const [flagged,   setFlagged]   = useState({});
  const durationMinutes = paper.durationMinutes ?? paper.meta?.durationMinutes ?? 90;
  const cutoffPercent = paper.cutoffPercent ?? paper.meta?.cutoffPercent ?? 65;
  const [secs,      setSecs]      = useState(durationMinutes * 60);
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    if (secs <= 0) { doFinish(); return; }
    const t = setInterval(() => setSecs(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [secs]);

  const doFinish = () => {
    if (finishing) return;
    setFinishing(true);
    let correct = 0;
    paper.questions.forEach((q, i) => { if (answers[i] === q.correct) correct++; });
    const score = Math.round((correct / paper.questions.length) * 100);
    setTimeout(() => onFinish({
      score, correct,
      total: paper.questions.length,
      passed: score >= cutoffPercent,
      answers,
      timeTaken: (durationMinutes * 60) - secs,
    }), 300);
  };

  const q   = paper.questions[currIdx];
  const s   = sectionStyle(q.section);
  const m   = Math.floor(secs / 60);
  const ss  = secs % 60;
  const low = secs < 300;
  const answered = Object.keys(answers).length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>

      {/* Sticky header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "var(--card)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "14px 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            borderRadius: 12, width: 38, height: 38,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 900, color: "#fff", fontFamily: "'Sora', sans-serif",
          }}>T</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", fontFamily: "'Sora', sans-serif" }}>
              TCS NQT {paper.year} — Mock Test
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              {s.icon} {q.section} · Q{currIdx + 1} of {paper.questions.length}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Timer */}
          <div style={{
            background: low ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.05)",
            border: `1px solid ${low ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
            borderRadius: 12, padding: "8px 18px",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span>⏱</span>
            <span style={{
              fontSize: 16, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace",
              color: low ? "#f87171" : "var(--text)",
            }}>
              {String(m).padStart(2, "0")}:{String(ss).padStart(2, "0")}
            </span>
          </div>
          <button
            onClick={doFinish}
            disabled={finishing}
            className="btn btn-gold"
            style={{ padding: "8px 20px", fontSize: 13 }}
          >
            {finishing ? "Scoring…" : "Submit Exam"}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: "rgba(255,255,255,0.04)" }}>
        <div style={{
          height: "100%", background: "linear-gradient(90deg,#3b82f6,#06b6d4)",
          width: `${((currIdx + 1) / paper.questions.length) * 100}%`,
          transition: "width 0.4s ease",
        }} />
      </div>

      {/* Body */}
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 24px", display: "grid", gridTemplateColumns: "1fr 280px", gap: 24 }}>

        {/* Question panel */}
        <div style={{
          background: "var(--card)", border: "1px solid var(--glass-border)",
          borderRadius: 20, padding: "28px 32px", boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
        }}>
          {/* Section badge */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99,
              background: s.bg, color: s.color, border: `1px solid ${s.color}30`,
              display: "flex", alignItems: "center", gap: 5,
            }}>
              {s.icon} {q.section}
            </span>
            <button
              onClick={() => setFlagged(f => ({ ...f, [currIdx]: !f[currIdx] }))}
              style={{
                background: flagged[currIdx] ? "rgba(245,158,11,0.12)" : "transparent",
                border: `1px solid ${flagged[currIdx] ? "#f59e0b" : "rgba(255,255,255,0.1)"}`,
                color: flagged[currIdx] ? "#f59e0b" : "var(--text-muted)",
                padding: "5px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}
            >
              {flagged[currIdx] ? "🚩 Flagged" : "🏳 Flag"}
            </button>
          </div>

          {/* Question */}
          <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", lineHeight: 1.65, marginBottom: 26, whiteSpace: "pre-wrap" }}>
            {q.question}
          </div>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
            {q.options.map((opt, oi) => {
              const sel = answers[currIdx] === oi;
              return (
                <button
                  key={oi}
                  onClick={() => setAnswers(a => ({ ...a, [currIdx]: oi }))}
                  style={{
                    background: sel ? `${s.color}18` : "rgba(255,255,255,0.02)",
                    border: `1px solid ${sel ? s.color : "rgba(255,255,255,0.08)"}`,
                    borderRadius: 14, padding: "15px 20px",
                    display: "flex", alignItems: "center", gap: 14,
                    color: sel ? "#fff" : "var(--text-muted)",
                    fontSize: 14, fontWeight: sel ? 700 : 500,
                    cursor: "pointer", textAlign: "left",
                    transition: "all 0.15s",
                    boxShadow: sel ? `0 0 20px ${s.color}20` : "none",
                  }}
                >
                  <span style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    background: sel ? s.color : "rgba(255,255,255,0.06)",
                    color: sel ? "#fff" : "var(--text-muted)",
                    fontSize: 12, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {String.fromCharCode(65 + oi)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Nav */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              onClick={() => setCurrIdx(i => i - 1)}
              disabled={currIdx === 0}
              className="btn btn-outline"
              style={{ opacity: currIdx === 0 ? 0.4 : 1 }}
            >← Previous</button>
            <button
              onClick={() => setCurrIdx(i => i + 1)}
              disabled={currIdx === paper.questions.length - 1}
              className="btn btn-primary"
              style={{ opacity: currIdx === paper.questions.length - 1 ? 0.4 : 1 }}
            >Next →</button>
          </div>
        </div>

        {/* Question palette */}
        <div style={{
          background: "var(--card)", border: "1px solid var(--glass-border)",
          borderRadius: 20, padding: "20px", position: "sticky", top: 84, height: "fit-content",
        }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Question Palette
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 14, lineHeight: 1.6 }}>
            ✅ {answered} answered · 🏳 {Object.values(flagged).filter(Boolean).length} flagged · ⬜ {paper.questions.length - answered} remaining
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 7 }}>
            {paper.questions.map((_, i) => {
              const isAns  = answers[i] !== undefined;
              const isFlag = flagged[i];
              const isCurr = i === currIdx;
              let bg     = "rgba(255,255,255,0.04)";
              let border = "1px solid rgba(255,255,255,0.08)";
              let color  = "var(--text-muted)";
              if (isAns)  { bg = "rgba(16,185,129,0.15)"; border = "1px solid rgba(16,185,129,0.5)"; color = "#34d399"; }
              if (isFlag) { bg = "rgba(245,158,11,0.15)"; border = "1px solid rgba(245,158,11,0.5)"; color = "#fbbf24"; }
              if (isCurr) { border = `2px solid #3b82f6`; }
              return (
                <button key={i} onClick={() => setCurrIdx(i)} style={{
                  aspectRatio: "1", borderRadius: 8, background: bg, border, color,
                  fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
                  transition: "all 0.15s",
                }}>
                  {i + 1}
                </button>
              );
            })}
          </div>
          {/* Legend */}
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6, fontSize: 11, color: "var(--text-muted)" }}>
            {[["#10b981","Answered"],["#f59e0b","Flagged"],["rgba(255,255,255,0.2)","Not visited"]].map(([c,l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />{l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Result Screen
// ─────────────────────────────────────────────────────────────────────────────
function ResultScreen({ result, paper, onRetake, onStudy, onBack }) {
  const cutoffPercent = paper.cutoffPercent ?? paper.meta?.cutoffPercent ?? 65;
  const secBreakdown = {};
  paper.questions.forEach((q, i) => {
    if (!secBreakdown[q.section]) secBreakdown[q.section] = { total: 0, correct: 0 };
    secBreakdown[q.section].total++;
    if (result.answers[i] === q.correct) secBreakdown[q.section].correct++;
  });

  const mins = Math.floor(result.timeTaken / 60);
  const secs = result.timeTaken % 60;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", padding: "40px 20px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <button onClick={onBack} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", marginBottom: 24, fontSize: 13 }}>
          ← Back to TCS NQT Papers
        </button>

        {/* Score card */}
        <div style={{
          background: "var(--card)", border: `1px solid ${result.passed ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
          borderRadius: 24, padding: "40px 36px", textAlign: "center",
          boxShadow: `0 24px 64px ${result.passed ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)"}`,
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>{result.passed ? "🎉" : ""}</div>

          <div style={{
            display: "inline-block", padding: "5px 18px", borderRadius: 99, marginBottom: 18,
            background: result.passed ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
            color: result.passed ? "#34d399" : "#f87171",
            border: `1px solid ${result.passed ? "#10b981" : "#ef4444"}`,
            fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em",
          }}>
            {result.passed ? `✓ Above Cutoff (${cutoffPercent}%)` : `✗ Below Cutoff (${cutoffPercent}%)`}
          </div>

          <div style={{
            fontSize: 56, fontWeight: 900, fontFamily: "'Sora', sans-serif",
            background: result.passed
              ? "linear-gradient(135deg, #10b981, #06b6d4)"
              : "linear-gradient(135deg, #ef4444, #f59e0b)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            marginBottom: 8,
          }}>
            {result.score}%
          </div>

          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 28 }}>
            {result.correct} / {result.total} correct · Time taken: {mins}m {secs}s · TCS NQT {paper.year}
          </p>

          {/* Section breakdown */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 28 }}>
            {Object.entries(secBreakdown).map(([sec, data]) => {
              const s   = sectionStyle(sec);
              const pct = Math.round((data.correct / data.total) * 100);
              return (
                <div key={sec} style={{
                  background: s.bg, border: `1px solid ${s.color}25`,
                  borderRadius: 14, padding: "14px 16px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 18, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: s.color, fontFamily: "'Sora', sans-serif" }}>{pct}%</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2, fontWeight: 600 }}>
                    {sec.split(" ")[0]}
                  </div>
                  <div style={{ fontSize: 11, color: s.color, marginTop: 2 }}>
                    {data.correct}/{data.total}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={onRetake} className="btn btn-primary" style={{ padding: "12px 26px" }}>
              🔄 Retake Mock Test
            </button>
            <button onClick={onStudy} className="btn btn-outline" style={{ padding: "12px 26px" }}>
              📖 Study All Solutions
            </button>
            <button onClick={onBack} className="btn btn-outline" style={{ padding: "12px 26px", borderColor: "rgba(255,255,255,0.1)" }}>
              📋 All Papers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
export default function CompanyExamTest() {
  const { companyId }           = useParams();
  const [searchParams]          = useSearchParams();
  const navigate                = useNavigate();
  const paper                   = getTCSYear(companyId);

  const initialMode = searchParams.get("mode") === "test" ? "test" : "browse";
  const [mode,      setMode]      = useState(initialMode);
  const [result,    setResult]    = useState(null);
  const [secFilter, setSecFilter] = useState("All");
  const [search,    setSearch]    = useState("");
  const [showAll,   setShowAll]   = useState(false);

  if (!paper) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div style={{ fontSize: 48 }}>📭</div>
        <h2 style={{ fontFamily: "'Sora', sans-serif" }}>Paper not found</h2>
        <button className="btn btn-primary" onClick={() => navigate("/company-assessment")}>
          ← Back to TCS NQT Papers
        </button>
      </div>
    );
  }

  if (mode === "test") {
    return (
      <MockTestRunner
        paper={paper}
        onFinish={res => { setResult(res); setMode("result"); }}
      />
    );
  }

  if (mode === "result" && result) {
    return (
      <ResultScreen
        result={result}
        paper={paper}
        onRetake={() => { setResult(null); setMode("test"); }}
        onStudy={() => setMode("browse")}
        onBack={() => navigate("/company-assessment")}
      />
    );
  }

  // ── Browse / Study mode ────────────────────────────────────────────────────
  const sections = ["All", ...(paper.sections || paper.meta?.sections || [])];
  const filtered  = paper.questions.filter(q => {
    const matchSec  = secFilter === "All" || q.section === secFilter;
    const matchText = !search || q.question.toLowerCase().includes(search.toLowerCase()) ||
                      q.options.some(o => o.toLowerCase().includes(search.toLowerCase()));
    return matchSec && matchText;
  });
  const displayed = showAll ? filtered : filtered.slice(0, 6);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(180deg, rgba(59,130,246,0.1) 0%, transparent 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "40px 40px 32px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <button
            onClick={() => navigate("/company-assessment")}
            style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", marginBottom: 20, fontSize: 13 }}
          >
            ← All TCS NQT Papers
          </button>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 12,
                background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)",
                borderRadius: 99, padding: "5px 16px",
                fontSize: 11, fontWeight: 700, color: "#3b82f6",
                textTransform: "uppercase", letterSpacing: "0.07em",
              }}>
                📋 TCS NQT PYQ — {paper.year}
              </div>
              <h1 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 900, fontFamily: "'Sora', sans-serif", letterSpacing: "-0.8px", marginBottom: 8 }}>
                TCS NQT {paper.year} — Full Paper
              </h1>
              <p style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.7, maxWidth: 600, marginBottom: 16 }}>
                {paper.description}
              </p>
              <div style={{
                padding: "10px 16px", borderRadius: 10,
                background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)",
                fontSize: 12, color: "#fbbf24", maxWidth: 620,
              }}>
                💡 <strong>Pattern Insight:</strong> {paper.patternNote}
              </div>
            </div>

            {/* Action card */}
            <div style={{
              background: "var(--card)", border: "1px solid rgba(59,130,246,0.3)",
              borderRadius: 18, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12, minWidth: 240,
            }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.8 }}>
                ⏱ {durationMinutes} min &nbsp;·&nbsp; 📋 {paper.questions.length} Questions<br />
                🎯 Cutoff: {cutoffPercent}% &nbsp;·&nbsp; 📅 Year: {paper.year}
              </div>
              <button onClick={() => setMode("test")} className="btn btn-gold" style={{ width: "100%", padding: "12px", fontSize: 14, fontWeight: 800 }}>
                ⚡ Take Mock Test
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ background: "rgba(255,255,255,0.01)", borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "14px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {sections.map(sec => {
            const s = sec === "All" ? { color: "#3b82f6", icon: "📋" } : sectionStyle(sec);
            return (
              <button
                key={sec}
                onClick={() => setSecFilter(sec)}
                style={{
                  padding: "6px 14px", borderRadius: 99, fontSize: 11, fontWeight: 700, cursor: "pointer",
                  background: secFilter === sec ? s.color : "rgba(255,255,255,0.04)",
                  color: secFilter === sec ? "#fff" : "var(--text-muted)",
                  border: `1px solid ${secFilter === sec ? s.color : "rgba(255,255,255,0.08)"}`,
                  transition: "all 0.15s", display: "flex", alignItems: "center", gap: 5,
                }}
              >
                {s.icon} {sec === "All" ? "All Sections" : sec.split(" ")[0]}
              </button>
            );
          })}
          <input
            className="input"
            placeholder="Search questions…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 220, fontSize: 12, marginLeft: "auto" }}
          />
        </div>
      </div>

      {/* Questions */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 40px 64px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Showing <strong style={{ color: "var(--text)" }}>{displayed.length}</strong> of {filtered.length} questions
          </span>
          <button
            onClick={() => setShowAll(v => !v)}
            style={{
              background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--text-muted)", fontSize: 12, fontWeight: 600,
              borderRadius: 8, padding: "5px 14px", cursor: "pointer",
            }}
          >
            {showAll ? "Show Less ↑" : `Show All ${filtered.length} ↓`}
          </button>
        </div>

        {displayed.map((q, i) => (
          <BrowseCard key={q.id} item={q} index={filtered.indexOf(q)} paper={paper} />
        ))}

        {!showAll && filtered.length > 6 && (
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <button onClick={() => setShowAll(true)} className="btn btn-primary" style={{ padding: "12px 32px" }}>
              Load All {filtered.length} Questions ↓
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
