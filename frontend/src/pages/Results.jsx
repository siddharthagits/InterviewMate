import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useInterview } from "../context/InterviewContext";

// ── helpers ───────────────────────────────────────────────────────────────────
function perfLabel(score) {
  if (score >= 85) return ["Excellent 🏆", "var(--green)"];
  if (score >= 70) return ["Good 👍",       "var(--primary-light)"];
  if (score >= 55) return ["Average 📈",    "var(--amber)"];
  return             ["Needs Improvement 💪","var(--red)"];
}

// ── Score ring ────────────────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const [label, color] = perfLabel(score);
  return (
    <div style={{ textAlign: "center", padding: "28px 0" }}>
      <div style={{
        width: 150, height: 150, borderRadius: "50%", margin: "0 auto 20px",
        background: `conic-gradient(${color} ${score}%, rgba(255,255,255,0.06) 0%)`,
        display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
      }}>
        <div style={{
          position: "absolute", inset: 10, borderRadius: "50%", background: "var(--bg2)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 30, fontWeight: 900, color }}>{score}</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>/ 100</span>
        </div>
      </div>
      <span style={{ fontSize: 18, fontWeight: 700, color }}>{label}</span>
    </div>
  );
}

// ── Answer key ────────────────────────────────────────────────────────────────
function AnswerKey({ questions, userAnswers }) {
  if (!questions || questions.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
        No question data. Complete an interview first.
      </div>
    );
  }

  const aMap = {};
  (userAnswers || []).forEach(a => { aMap[a.question_id] = a; });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {questions.map((q, i) => {
        const ua = aMap[q.id] || {};
        const isCorrect  = (q.type === "mcq" || q.type === "code") && ua.selected === q.correct;
        const wasAnswered = ua.selected != null || (ua.text && ua.text.trim());
        const borderColor = q.type === "text" ? "var(--primary)" : isCorrect ? "var(--green)" : "var(--red)";

        return (
          <div key={q.id} className="glass" style={{ padding: "18px 22px", borderLeft: `3px solid ${borderColor}` }}>
            {/* Header */}
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
              <span style={{
                width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                background: "rgba(99,102,241,0.15)", border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700,
              }}>{i + 1}</span>
              <span className={`badge ${q.type === "mcq" ? "badge-mcq" : q.type === "code" ? "badge-code" : "badge-text"}`}>
                {q.type === "mcq" ? "🔘 MCQ" : q.type === "code" ? "💻 Code" : "📝 Text"}
              </span>
              {(q.type === "mcq" || q.type === "code") && (
                <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700, color: isCorrect ? "var(--green)" : "var(--red)" }}>
                  {isCorrect ? "✓ Correct" : wasAnswered ? "✗ Wrong" : "— Skipped"}
                </span>
              )}
            </div>

            {/* Question */}
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 12, lineHeight: 1.5 }}>{q.question}</p>

            {/* Code */}
            {q.type === "code" && q.code && (
              <pre className="code-block" style={{ marginBottom: 14, fontSize: 12 }}>{q.code}</pre>
            )}

            {/* MCQ/Code options */}
            {(q.type === "mcq" || q.type === "code") && q.options && (
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {q.options.map((opt, oi) => {
                  const isUser    = ua.selected === oi;
                  const isCorrectOpt = q.correct === oi;
                  const bg  = isCorrectOpt ? "rgba(16,185,129,0.12)" : isUser ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.02)";
                  const bdr = isCorrectOpt ? "var(--green)"           : isUser ? "var(--red)"          : "var(--glass-border)";
                  const clr = isCorrectOpt ? "#6ee7b7"                : isUser ? "#fca5a5"             : "var(--text-muted)";
                  return (
                    <div key={oi} style={{ padding: "9px 13px", borderRadius: 8, border: `1px solid ${bdr}`, background: bg, color: clr, fontSize: 13, display: "flex", gap: 10 }}>
                      <span style={{ fontWeight: 700, flexShrink: 0 }}>{["A","B","C","D"][oi]}.</span>
                      <span style={{ flex: 1 }}>{opt}</span>
                      {isCorrectOpt && !isUser && <span style={{ fontSize: 11, flexShrink: 0 }}>✓ Correct</span>}
                      {isUser && isCorrectOpt  && <span style={{ fontSize: 11, flexShrink: 0 }}>✓ Your answer</span>}
                      {isUser && !isCorrectOpt && <span style={{ fontSize: 11, flexShrink: 0 }}>← Your answer</span>}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Text answer */}
            {q.type === "text" && (
              <div>
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>Your answer:</p>
                <div style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid var(--glass-border)",
                  borderRadius: 8, padding: "11px 14px", fontSize: 13, color: "var(--text-dim)",
                  lineHeight: 1.65, whiteSpace: "pre-wrap",
                }}>
                  {ua.text?.trim() || <em style={{ color: "var(--text-muted)" }}>No answer given</em>}
                </div>
              </div>
            )}

            {/* Explanation */}
            {q.explanation && (
              <div style={{
                marginTop: 14, background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: 8, padding: "12px 14px"
              }}>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--primary-light)", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                  <span>💡</span> Explanation
                </h4>
                <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.5 }}>
                  {q.explanation}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main Results page ─────────────────────────────────────────────────────────
function ResultsPage() {
  const [tab, setTab] = useState("results");
  const { interviewData, result: ctx, questions, userAnswers } = useInterview();
  const { state } = useLocation();
  const result = ctx ?? state?.result ?? { score: 0 };
  const score  = result.score ?? 0;

  const tabBtn = (t, label) => (
    <button
      key={t}
      onClick={() => setTab(t)}
      style={{
        padding: "11px 28px", fontWeight: 600, fontSize: 14, cursor: "pointer",
        background: "none", border: "none",
        borderBottom: tab === t ? "2px solid var(--primary)" : "2px solid transparent",
        color: tab === t ? "var(--primary-light)" : "var(--text-muted)",
        transition: "color 0.2s",
      }}
    >{label}</button>
  );

  const actionBtns = (
    <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
      <Link to="/setup"      className="btn btn-outline" style={{ flex: 1 }}>Try Again</Link>
      <Link to="/dashboard"  className="btn btn-primary" style={{ flex: 1 }}>Dashboard</Link>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px" }}>
      <div className="glass" style={{ width: "100%", maxWidth: 700, overflow: "hidden" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg,var(--primary),var(--primary-dark))", padding: "24px 32px" }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}>Interview Complete 🎉</h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, marginTop: 4 }}>
            {interviewData?.role || ""}{interviewData?.difficulty ? ` · ${interviewData.difficulty}` : ""} · {result.totalQuestions ?? 35} questions
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--glass-border)", padding: "0 24px" }}>
          {tabBtn("results", "📊 Results")}
          {tabBtn("answers", "📋 Answer Key")}
        </div>

        <div style={{ padding: "0 32px 36px" }}>

          {/* Results tab */}
          {tab === "results" && (
            <>
              <ScoreRing score={score} />

              {/* Breakdown cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
                {[
                  ["🔘 MCQ",  `${result.mcq_correct ?? "-"}/${result.mcq_total ?? 25}`, "var(--primary-light)"],
                  ["💻 Code", `${result.code_correct ?? "-"}/${result.code_total ?? 5}`, "var(--amber)"],
                  ["📝 Text", `${result.text_score ?? "-"}/100`,                         "var(--green)"],
                ].map(([label, val, color]) => (
                  <div key={label} className="stat-card" style={{ textAlign: "center", padding: "14px 8px" }}>
                    <div style={{ fontSize: 17, fontWeight: 800, color }}>{val}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>

              {result.feedback && (
                <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "14px 18px", marginBottom: 18, fontSize: 14, color: "var(--text-dim)", lineHeight: 1.6, border: "1px solid var(--glass-border)" }}>
                  {result.feedback}
                </div>
              )}

              {Array.isArray(result.strengths) && result.strengths.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <h3 style={{ fontWeight: 700, color: "var(--green)", marginBottom: 8, fontSize: 13 }}>✅ Strengths</h3>
                  {result.strengths.map((s, i) => (
                    <div key={i} style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8, padding: "8px 14px", fontSize: 13, color: "var(--text-dim)", marginBottom: 5 }}>• {s}</div>
                  ))}
                </div>
              )}

              {Array.isArray(result.improvements) && result.improvements.length > 0 && (
                <div style={{ marginBottom: 4 }}>
                  <h3 style={{ fontWeight: 700, color: "var(--amber)", marginBottom: 8, fontSize: 13 }}>📈 Areas to Improve</h3>
                  {result.improvements.map((s, i) => (
                    <div key={i} style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 8, padding: "8px 14px", fontSize: 13, color: "var(--text-dim)", marginBottom: 5 }}>• {s}</div>
                  ))}
                </div>
              )}

              {actionBtns}
            </>
          )}

          {/* Answer Key tab */}
          {tab === "answers" && (
            <div style={{ marginTop: 20 }}>
              <div style={{ marginBottom: 14, display: "flex", gap: 18, fontSize: 12, flexWrap: "wrap" }}>
                {[["var(--green)","Correct"],["var(--red)","Wrong"],["var(--primary)","Text (AI reviewed)"]].map(([c,l]) => (
                  <span key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: c, display: "inline-block" }} />
                    <span style={{ color: "var(--text-muted)" }}>{l}</span>
                  </span>
                ))}
              </div>
              <AnswerKey questions={questions} userAnswers={userAnswers} />
              {actionBtns}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default ResultsPage;