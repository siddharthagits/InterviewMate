import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockTests } from "../data/mockTestData";

function MockTestPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const test = mockTests[category];

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOptionIndex }
  const [visited, setVisited] = useState(new Set([0]));
  const [timeLeft, setTimeLeft] = useState(test ? test.duration * 60 : 0);
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!test || submitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [submitted]);

  if (!test) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>❌</div>
          <h2>Test not found</h2>
          <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => navigate("/")}>Go Home</button>
        </div>
      </div>
    );
  }

  const questions = test.questions;
  const q = questions[currentQ];

  function handleAnswer(optIdx) {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [q.id]: optIdx }));
  }

  function goToQuestion(idx) {
    setCurrentQ(idx);
    setVisited(prev => new Set([...prev, idx]));
  }

  function handleSubmit(auto = false) {
    clearInterval(timerRef.current);
    setSubmitted(true);
    setShowResult(true);
  }

  function calcScore() {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct) correct++;
    });
    return correct;
  }

  const score = submitted ? calcScore() : 0;
  const total = questions.length;
  const attempted = Object.keys(answers).length;
  const scorePercent = Math.round((score / total) * 100);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const timerColor = timeLeft < 60 ? "#ef4444" : timeLeft < 180 ? "#f59e0b" : "#10b981";

  function getQStatus(idx) {
    const qId = questions[idx].id;
    if (answers[qId] !== undefined) return "answered";
    if (visited.has(idx)) return "visited";
    return "not-visited";
  }

  const statusColors = {
    answered: { bg: "#10b981", border: "#10b981" },
    visited: { bg: "rgba(245,158,11,0.2)", border: "#f59e0b" },
    "not-visited": { bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.12)" },
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)", fontFamily: "'Inter', sans-serif", color: "var(--text)" }}>

      {/* ── Sidebar Question Palette ── */}
      <div style={{
        width: sidebarOpen ? 260 : 0,
        overflow: "hidden",
        transition: "width 0.3s ease",
        flexShrink: 0,
        background: "#080e1c",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{ padding: "20px 16px", overflowY: "auto", flex: 1 }}>

          {/* Test info */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 22 }}>{test.icon}</span>
              <span style={{ fontWeight: 800, fontSize: 15, color: "#f1f5f9" }}>{test.title}</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{total} Questions · {test.duration} min</div>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20, padding: "12px", background: "rgba(255,255,255,0.03)", borderRadius: 10 }}>
            {[
              { color: "#10b981", label: "Answered" },
              { color: "#f59e0b", label: "Visited (unanswered)" },
              { color: "rgba(255,255,255,0.3)", label: "Not visited" },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "var(--text-muted)" }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: color, flexShrink: 0 }} />
                {label}
              </div>
            ))}
          </div>

          {/* Progress */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>
              <span>Attempted</span>
              <span style={{ fontWeight: 700, color: "#10b981" }}>{attempted}/{total}</span>
            </div>
            <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(attempted / total) * 100}%`, background: "linear-gradient(90deg,#10b981,#06b6d4)", borderRadius: 99, transition: "width 0.3s" }} />
            </div>
          </div>

          {/* Question Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6 }}>
            {questions.map((_, idx) => {
              const status = getQStatus(idx);
              const sc = statusColors[status];
              const isCurrent = idx === currentQ;
              return (
                <button
                  key={idx}
                  onClick={() => goToQuestion(idx)}
                  style={{
                    width: "100%", aspectRatio: "1",
                    borderRadius: 8,
                    border: `2px solid ${isCurrent ? test.color : sc.border}`,
                    background: isCurrent ? test.colorLight : sc.bg,
                    color: status === "answered" ? "#fff" : "var(--text-muted)",
                    fontSize: 12, fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit button inside sidebar */}
        {!submitted && (
          <div style={{ padding: "16px" }}>
            <button
              onClick={() => {
                if (window.confirm(`Submit test? You've answered ${attempted}/${total} questions.`)) handleSubmit();
              }}
              style={{
                width: "100%", padding: "12px 0", borderRadius: 12, border: "none",
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
                boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
              }}
            >
              Submit Test ✔
            </button>
          </div>
        )}
      </div>

      {/* ── Main Content ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 28px",
          background: "#0a1020",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          flexShrink: 0,
          gap: 16,
          flexWrap: "wrap",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={() => setSidebarOpen(v => !v)}
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 16 }}
            >
              ☰
            </button>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9" }}>{test.title}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{test.subtitle}</div>
            </div>
          </div>

          {/* Timer */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: `${timerColor}18`,
            border: `1px solid ${timerColor}55`,
            borderRadius: 12, padding: "8px 18px",
          }}>
            <span style={{ fontSize: 18 }}>⏱</span>
            <span style={{ fontSize: 20, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: timerColor }}>
              {formatTime(timeLeft)}
            </span>
          </div>

          <button onClick={() => navigate("/")} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "var(--text-muted)", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: 13 }}>
            ✕ Exit
          </button>
        </div>

        {/* Question Progress */}
        <div style={{ height: 3, background: "rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <div style={{ height: "100%", width: `${((currentQ + 1) / total) * 100}%`, background: test.gradient, transition: "width 0.3s" }} />
        </div>

        {/* Question Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px 40px", maxWidth: 820, margin: "0 auto", width: "100%" }}>

          {/* Q number badge */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <span style={{
              fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 99,
              background: test.colorLight, color: test.color, border: `1px solid ${test.colorBorder}`,
            }}>
              Question {currentQ + 1} / {total}
            </span>
            {answers[q.id] !== undefined && (
              <span style={{ fontSize: 12, color: "#10b981", fontWeight: 600 }}>✔ Answered</span>
            )}
          </div>

          {/* Question text */}
          <div style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16, padding: "24px 28px", marginBottom: 28,
          }}>
            {q.isCode ? (
              <>
                <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 16, fontWeight: 500 }}>
                  {q.question.split("\n")[0]}
                </p>
                <pre style={{
                  background: "#060d1c", border: "1px solid rgba(99,102,241,0.2)",
                  borderRadius: 12, padding: "18px 22px",
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
                  lineHeight: 1.8, color: "#a5f3fc", overflowX: "auto",
                  whiteSpace: "pre",
                }}>
                  {q.question.split("\n").slice(1).join("\n").trim()}
                </pre>
              </>
            ) : (
              <p style={{ fontSize: 15, lineHeight: 1.8, fontWeight: 500 }}>{q.question}</p>
            )}
          </div>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {q.options.map((opt, i) => {
              const isSelected = answers[q.id] === i;
              const isCorrect = submitted && i === q.correct;
              const isWrong = submitted && isSelected && i !== q.correct;

              let borderColor = "rgba(255,255,255,0.1)";
              let bg = "rgba(255,255,255,0.02)";
              let textColor = "var(--text)";

              if (isCorrect) { borderColor = "#10b981"; bg = "rgba(16,185,129,0.12)"; textColor = "#6ee7b7"; }
              else if (isWrong) { borderColor = "#ef4444"; bg = "rgba(239,68,68,0.1)"; textColor = "#fca5a5"; }
              else if (isSelected) { borderColor = test.color; bg = test.colorLight; }

              const letters = ["A", "B", "C", "D"];

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={submitted}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "15px 20px", borderRadius: 14,
                    border: `1.5px solid ${borderColor}`,
                    background: bg, color: textColor,
                    cursor: submitted ? "default" : "pointer",
                    textAlign: "left", fontSize: 14, lineHeight: 1.5,
                    transition: "all 0.18s",
                    fontFamily: "'Inter', sans-serif",
                    width: "100%",
                  }}
                  onMouseEnter={e => { if (!submitted && !isSelected) e.currentTarget.style.borderColor = test.color; }}
                  onMouseLeave={e => { if (!submitted && !isSelected) e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                >
                  <span style={{
                    width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: 13,
                    background: isCorrect ? "#10b981" : isWrong ? "#ef4444" : isSelected ? test.color : "rgba(255,255,255,0.07)",
                    color: (isCorrect || isWrong || isSelected) ? "#fff" : "var(--text-muted)",
                    transition: "all 0.18s",
                  }}>{letters[i]}</span>
                  <span style={{ fontFamily: q.isCode ? "'JetBrains Mono', monospace" : "inherit" }}>{opt}</span>
                  {isCorrect && <span style={{ marginLeft: "auto", flexShrink: 0, fontSize: 18 }}>✅</span>}
                  {isWrong && <span style={{ marginLeft: "auto", flexShrink: 0, fontSize: 18 }}>❌</span>}
                </button>
              );
            })}
          </div>

          {/* Explanation (after submit) */}
          {submitted && q.explanation && (
            <div style={{
              marginTop: 20, padding: "16px 20px",
              background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)",
              borderRadius: 12,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#a5b4fc", marginBottom: 6 }}>💡 EXPLANATION</div>
              <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.65 }}>{q.explanation}</p>
            </div>
          )}

          {/* Nav Buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 36 }}>
            <button
              onClick={() => goToQuestion(Math.max(0, currentQ - 1))}
              disabled={currentQ === 0}
              style={{
                padding: "11px 24px", borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.04)", color: currentQ === 0 ? "var(--text-muted)" : "var(--text)",
                cursor: currentQ === 0 ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 600,
              }}
            >
              ← Previous
            </button>

            {!submitted && (
              <button
                onClick={() => {
                  if (answers[q.id] === undefined) {
                    // Mark as visited/skip
                    goToQuestion(Math.min(total - 1, currentQ + 1));
                  } else {
                    goToQuestion(Math.min(total - 1, currentQ + 1));
                  }
                }}
                style={{
                  padding: "11px 20px", borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)", color: "var(--text-muted)",
                  cursor: "pointer", fontSize: 14, fontWeight: 600,
                }}
              >
                Skip →
              </button>
            )}

            <button
              onClick={() => currentQ < total - 1 ? goToQuestion(currentQ + 1) : (!submitted ? (window.confirm(`Submit test? You've answered ${attempted}/${total} questions.`) && handleSubmit()) : null)}
              style={{
                padding: "11px 28px", borderRadius: 10,
                border: "none",
                background: test.gradient, color: "#fff",
                cursor: "pointer", fontSize: 14, fontWeight: 700,
                boxShadow: `0 4px 16px ${test.color}44`,
              }}
            >
              {currentQ < total - 1 ? "Next →" : submitted ? "—" : "Submit ✔"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Result Modal ── */}
      {showResult && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, backdropFilter: "blur(8px)",
          padding: 24,
        }}>
          <div style={{
            background: "#0d1526", border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: 24, padding: "40px 36px", maxWidth: 520, width: "100%",
            textAlign: "center",
            boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.2)",
          }}>
            {/* Score Ring */}
            <div style={{
              width: 140, height: 140, borderRadius: "50%", margin: "0 auto 28px",
              background: `conic-gradient(${scorePercent >= 60 ? "#10b981" : scorePercent >= 40 ? "#f59e0b" : "#ef4444"} ${scorePercent * 3.6}deg, rgba(255,255,255,0.06) 0deg)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
            }}>
              <div style={{
                position: "absolute", inset: 10, borderRadius: "50%",
                background: "#0d1526",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: scorePercent >= 60 ? "#10b981" : scorePercent >= 40 ? "#f59e0b" : "#ef4444" }}>{scorePercent}%</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Score</div>
              </div>
            </div>

            <div style={{ fontSize: 32, marginBottom: 8 }}>
              {scorePercent >= 80 ? "🏆" : scorePercent >= 60 ? "🎉" : scorePercent >= 40 ? "👍" : "💪"}
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
              {scorePercent >= 80 ? "Excellent!" : scorePercent >= 60 ? "Well Done!" : scorePercent >= 40 ? "Good Effort!" : "Keep Practicing!"}
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: 15, marginBottom: 28 }}>
              You scored <strong style={{ color: "#f1f5f9" }}>{score}/{total}</strong> correct answers
            </p>

            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 32 }}>
              {[
                { label: "Correct", value: score, color: "#10b981" },
                { label: "Wrong", value: attempted - score, color: "#ef4444" },
                { label: "Skipped", value: total - attempted, color: "#f59e0b" },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "14px 8px", border: `1px solid ${color}33` }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={() => { setShowResult(false); setCurrentQ(0); }}
                style={{
                  padding: "12px 24px", borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.05)", color: "var(--text)",
                  cursor: "pointer", fontWeight: 600, fontSize: 14,
                }}
              >
                Review Answers
              </button>
              <button
                onClick={() => navigate("/")}
                style={{
                  padding: "12px 24px", borderRadius: 12, border: "none",
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 14,
                  boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
                }}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MockTestPage;
