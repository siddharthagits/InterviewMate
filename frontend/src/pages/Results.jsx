import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useInterview } from "../context/InterviewContext";
import ThemeToggle from "../components/ThemeToggle";
import { logUserActivity } from "../utils/activityTracker";

// ── Helpers ───────────────────────────────────────────────────────────────────
function perfLabel(score) {
  if (score >= 85) return ["Excellent 🏆", "#10b981"];
  if (score >= 70) return ["Good 👍",       "#7c3aed"];
  if (score >= 55) return ["Average 📈",    "#f59e0b"];
  return             ["Needs Work 💪",      "#ef4444"];
}

// ── Animated SVG Score Ring ───────────────────────────────────────────────────
function ScoreRing({ score }) {
  const [animated, setAnimated] = useState(0);
  const [label, color] = perfLabel(score);
  const radius = 58;
  const circ   = 2 * Math.PI * radius;

  useEffect(() => { const t = setTimeout(() => setAnimated(score), 150); return () => clearTimeout(t); }, [score]);

  return (
    <div style={{ textAlign: "center", padding: "28px 0" }}>
      <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto 20px" }}>
        <svg width="160" height="160" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
          <circle cx="80" cy="80" r={radius} fill="none" stroke={color} strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ - (animated / 100) * circ}
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 0 10px ${color})` }}
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 34, fontWeight: 900, color, fontFamily: "'Sora', sans-serif", letterSpacing: "-1px" }}>{score}</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>/ 100</span>
        </div>
      </div>
      <span style={{ fontSize: 18, fontWeight: 700, color }}>{label}</span>
    </div>
  );
}

// ── Animated bar ──────────────────────────────────────────────────────────────
function AnimBar({ pct, color, label, weight }) {
  const [anim, setAnim] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnim(pct), 300); return () => clearTimeout(t); }, [pct]);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
        <span style={{ color: "var(--text-muted)" }}>{label} <span style={{ fontSize: 11, color: "var(--text-muted)", opacity: 0.6 }}>({weight}%)</span></span>
        <span style={{ fontWeight: 700, color }}>{Math.round(pct)}%</span>
      </div>
      <div className="progress-track" style={{ height: 7 }}>
        <div className="progress-fill" style={{ width: `${anim}%`, background: `linear-gradient(90deg, ${color}, ${color}99)`, transition: "width 1s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>
    </div>
  );
}

// ── Tab 1: Results Overview ───────────────────────────────────────────────────
function ResultsTab({ result, interviewData }) {
  return (
    <>
      <ScoreRing score={result.score ?? 0} />

      {/* Breakdown */}
      <div className="glass" style={{ padding: "20px 24px", marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
          Score Breakdown
        </div>
        <AnimBar pct={result.mcq_score  ?? 0} color="#7c3aed" label="MCQ Section"  weight={50} />
        <AnimBar pct={result.code_score ?? 0} color="#f59e0b" label="Code Section" weight={20} />
        <AnimBar pct={result.text_score ?? 0} color="#10b981" label="Text Section" weight={30} />
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          ["MCQ",  `${result.mcq_correct ?? "—"}/${result.mcq_total ?? 25}`,  "#7c3aed"],
          ["Code", `${result.code_correct ?? "—"}/${result.code_total ?? 5}`,  "#f59e0b"],
          ["Text", `${result.text_score ?? "—"}/100`,                          "#10b981"],
        ].map(([label, val, color]) => (
          <div key={label} className="stat-card" style={{ textAlign: "center", padding: "14px 8px" }}>
            <div style={{ fontSize: 18, fontWeight: 900, color, fontFamily: "'Sora', sans-serif" }}>{val}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Feedback */}
      {result.feedback && (
        <div style={{
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 12, padding: "14px 18px", marginBottom: 16,
          fontSize: 14, color: "var(--text-dim)", lineHeight: 1.75,
          position: "relative", paddingLeft: 22,
        }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "linear-gradient(180deg, #7c3aed, #06b6d4)", borderRadius: "12px 0 0 12px" }} />
          {result.feedback}
        </div>
      )}

      {/* Strengths */}
      {result.strengths?.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <h3 style={{ fontWeight: 700, color: "#10b981", marginBottom: 8, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
            ✅ Strengths
          </h3>
          {result.strengths.map((s, i) => (
            <div key={i} style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8, padding: "8px 14px", fontSize: 13, color: "var(--text-dim)", marginBottom: 5 }}>
              • {s}
            </div>
          ))}
        </div>
      )}

      {/* Improvements */}
      {result.improvements?.length > 0 && (
        <div style={{ marginBottom: 4 }}>
          <h3 style={{ fontWeight: 700, color: "#f59e0b", marginBottom: 8, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
            📈 Areas to Improve
          </h3>
          {result.improvements.map((s, i) => (
            <div key={i} style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 8, padding: "8px 14px", fontSize: 13, color: "var(--text-dim)", marginBottom: 5 }}>
              • {s}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ── Tab 2: Per-Question Deep AI Feedback ──────────────────────────────────────
function PerQuestionTab({ result, questions, userAnswers }) {
  const feedback = result?.per_question_feedback || [];
  const aMap = {};
  (userAnswers || []).forEach(a => { aMap[a.question_id] = a; });
  const fMap = {};
  feedback.forEach(f => { fMap[f.question_id] = f; });

  if (!questions || questions.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
        Complete an interview first to see per-question feedback.
      </div>
    );
  }

  const verdictColor = (v) => {
    if (!v) return "var(--text-muted)";
    if (["Excellent", "Correct", "Good"].includes(v)) return "#10b981";
    if (["Partial", "Answered"].includes(v)) return "#f59e0b";
    if (["Weak", "Wrong"].includes(v)) return "#ef4444";
    return "var(--text-muted)";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {questions.map((q, i) => {
        const ua = aMap[q.id] || {};
        const fb = fMap[q.id] || {};
        const isCorrect = (q.type === "mcq" || q.type === "code") && ua.selected === q.correct;
        const borderColor = q.type === "text"
          ? "#7c3aed"
          : isCorrect ? "#10b981" : "#ef4444";

        return (
          <div key={q.id} className="glass" style={{ padding: "20px 24px", borderLeft: `3px solid ${borderColor}`, position: "relative" }}>
            {/* Header */}
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
              <span style={{
                width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700,
              }}>{i + 1}</span>
              <span className={`badge ${q.type === "mcq" ? "badge-mcq" : q.type === "code" ? "badge-code" : "badge-text"}`}>
                {q.type.toUpperCase()}
              </span>

              {/* Verdict badge */}
              {fb.verdict && (
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99,
                  background: `${verdictColor(fb.verdict)}15`,
                  color: verdictColor(fb.verdict),
                  border: `1px solid ${verdictColor(fb.verdict)}40`,
                  marginLeft: "auto",
                }}>
                  {fb.verdict}
                </span>
              )}

              {/* Score for text questions */}
              {q.type === "text" && fb.score != null && (
                <span style={{
                  fontSize: 13, fontWeight: 900, color: verdictColor(fb.verdict),
                  fontFamily: "'Sora', sans-serif",
                }}>
                  {fb.score}/10
                </span>
              )}
            </div>

            {/* Question */}
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 14, lineHeight: 1.55 }}>{q.question}</p>

            {/* Code */}
            {q.type === "code" && q.code && (
              <pre className="code-block" style={{ marginBottom: 14, fontSize: 12 }}>{q.code}</pre>
            )}

            {/* MCQ/Code options */}
            {(q.type === "mcq" || q.type === "code") && q.options && (
              <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 12 }}>
                {q.options.map((opt, oi) => {
                  const isUser = ua.selected === oi;
                  const isCorr = q.correct === oi;
                  const bg  = isCorr ? "rgba(16,185,129,0.1)"  : isUser ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.02)";
                  const bdr = isCorr ? "#10b981"                : isUser ? "#ef4444"               : "rgba(255,255,255,0.06)";
                  const clr = isCorr ? "#6ee7b7"                : isUser ? "#fca5a5"               : "var(--text-muted)";
                  return (
                    <div key={oi} style={{ padding: "9px 14px", borderRadius: 9, border: `1px solid ${bdr}`, background: bg, color: clr, fontSize: 13, display: "flex", gap: 10 }}>
                      <span style={{ fontWeight: 700, flexShrink: 0 }}>{["A","B","C","D"][oi]}.</span>
                      <span style={{ flex: 1 }}>{opt}</span>
                      {isCorr && !isUser && <span style={{ fontSize: 11 }}>✓ Correct</span>}
                      {isUser && isCorr  && <span style={{ fontSize: 11 }}>✓ Your answer</span>}
                      {isUser && !isCorr && <span style={{ fontSize: 11 }}>← Your answer</span>}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Text answer */}
            {q.type === "text" && (
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>Your answer:</p>
                <div style={{
                  background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 9, padding: "11px 14px", fontSize: 13, color: "var(--text-dim)",
                  lineHeight: 1.7, whiteSpace: "pre-wrap", minHeight: 48,
                }}>
                  {ua.text?.trim() || <em style={{ color: "var(--text-muted)" }}>No answer given</em>}
                </div>
              </div>
            )}

            {/* AI Deep Feedback Box */}
            {(fb.why_weak || fb.ideal_answer || (fb.missed_keywords && fb.missed_keywords.length > 0)) && (
              <div style={{
                background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.18)",
                borderRadius: 10, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--violet-light)", textTransform: "uppercase", letterSpacing: "0.07em", display: "flex", alignItems: "center", gap: 6 }}>
                  🤖 AI Feedback
                </div>

                {fb.why_weak && (
                  <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.65, margin: 0 }}>
                    <strong style={{ color: "var(--text)" }}>Analysis: </strong>{fb.why_weak}
                  </p>
                )}

                {fb.ideal_answer && (
                  <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", marginBottom: 4 }}>💡 IDEAL ANSWER</div>
                    <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.65, margin: 0 }}>{fb.ideal_answer}</p>
                  </div>
                )}

                {fb.missed_keywords && fb.missed_keywords.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", marginBottom: 6 }}>🔑 MISSED CONCEPTS</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {fb.missed_keywords.map((kw, ki) => (
                        <span key={ki} style={{
                          fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99,
                          background: "rgba(245,158,11,0.1)", color: "#fcd34d",
                          border: "1px solid rgba(245,158,11,0.3)",
                        }}>{kw}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Explanation (for MCQ/Code) */}
            {q.explanation && q.type !== "text" && (
              <div style={{
                marginTop: 12, background: "rgba(124,58,237,0.04)", border: "1px solid rgba(124,58,237,0.15)",
                borderRadius: 8, padding: "10px 14px",
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--violet-light)", marginBottom: 4 }}>💡 Explanation</div>
                <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.55, margin: 0 }}>{q.explanation}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Tab 3: Hiring Readiness Radar ─────────────────────────────────────────────
function ReadinessTab({ result, interviewData }) {
  const readiness = result?.readiness;
  const [animated, setAnimated] = useState(false);

  useEffect(() => { const t = setTimeout(() => setAnimated(true), 200); return () => clearTimeout(t); }, []);

  if (!readiness) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
        Readiness data not available. Complete an interview with a server connection.
      </div>
    );
  }

  const dims = readiness.dimensions || {};
  const dimList = [
    { key: "technical",       label: "Technical",       color: "#7c3aed" },
    { key: "communication",   label: "Communication",   color: "#06b6d4" },
    { key: "problem_solving", label: "Problem Solving", color: "#10b981" },
    { key: "speed",           label: "Speed",           color: "#f59e0b" },
    { key: "accuracy",        label: "Accuracy",        color: "#ec4899" },
  ];

  // SVG Radar chart
  const cx = 130, cy = 130, r = 100;
  const n = dimList.length;
  const points = dimList.map((d, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    const pct   = (dims[d.key] || 0) / 100;
    return {
      x: cx + (animated ? r * pct : 0) * Math.cos(angle),
      y: cy + (animated ? r * pct : 0) * Math.sin(angle),
      lx: cx + (r + 24) * Math.cos(angle),
      ly: cy + (r + 24) * Math.sin(angle),
    };
  });

  const rings = [0.25, 0.5, 0.75, 1].map(scale => {
    const ps = dimList.map((_, i) => {
      const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
      return `${cx + r * scale * Math.cos(angle)},${cy + r * scale * Math.sin(angle)}`;
    });
    return ps.join(" ");
  });

  const dataPolygon = points.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <div>
      {/* Readiness score hero */}
      <div style={{
        textAlign: "center", padding: "24px",
        background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.06))",
        border: "1px solid rgba(124,58,237,0.2)", borderRadius: 18, marginBottom: 24,
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--violet-light)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
          Hiring Readiness Score
        </div>
        <div style={{
          fontSize: 64, fontWeight: 900, fontFamily: "'Sora', sans-serif",
          background: "linear-gradient(135deg, #c4b5fd, #06b6d4)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          letterSpacing: "-2px", lineHeight: 1,
        }}>
          {readiness.readiness}%
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 8 }}>
          ready for <strong style={{ color: "var(--text)" }}>{interviewData?.role || "this role"}</strong>
        </div>
        {readiness.summary && (
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 12, lineHeight: 1.7, maxWidth: 420, margin: "12px auto 0" }}>
            {readiness.summary}
          </p>
        )}
      </div>

      {/* Radar chart */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <svg width="260" height="260" style={{ overflow: "visible" }}>
          {/* Grid rings */}
          {rings.map((pts, ri) => (
            <polygon key={ri} points={pts} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          ))}
          {/* Spokes */}
          {dimList.map((_, i) => {
            const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
            return (
              <line key={i}
                x1={cx} y1={cy}
                x2={cx + r * Math.cos(angle)}
                y2={cy + r * Math.sin(angle)}
                stroke="rgba(255,255,255,0.06)" strokeWidth="1"
              />
            );
          })}
          {/* Data polygon */}
          <polygon
            points={dataPolygon}
            fill="rgba(124,58,237,0.15)"
            stroke="#7c3aed"
            strokeWidth="2"
            style={{ transition: "all 1.2s cubic-bezier(0.4,0,0.2,1)", filter: "drop-shadow(0 0 8px rgba(124,58,237,0.4))" }}
          />
          {/* Data points */}
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="5" fill={dimList[i].color}
              style={{ transition: "all 1.2s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 0 6px ${dimList[i].color})` }}
            />
          ))}
          {/* Labels */}
          {points.map((p, i) => (
            <text key={i} x={p.lx} y={p.ly + 4}
              textAnchor="middle" fontSize="10" fontWeight="600"
              fill={dimList[i].color} fontFamily="Inter, sans-serif"
            >
              {dimList[i].label}
            </text>
          ))}
        </svg>
      </div>

      {/* Dimension bars */}
      <div className="glass" style={{ padding: "20px 24px", marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
          Dimension Breakdown
        </div>
        {dimList.map(d => (
          <AnimBar key={d.key} pct={dims[d.key] || 0} color={d.color} label={d.label} weight={20} />
        ))}
      </div>

      {/* Roadmap */}
      {readiness.roadmap && readiness.roadmap.length > 0 && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-dim)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            🗺️ Your Improvement Roadmap
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {readiness.roadmap.map((item, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12, padding: "14px 18px",
                display: "flex", gap: 14, alignItems: "flex-start",
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800, color: "#fff",
                }}>{i + 1}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "var(--violet-light)", marginBottom: 4 }}>
                    {item.area}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6 }}>{item.action}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Results Page ─────────────────────────────────────────────────────────
function ResultsPage() {
  const [tab, setTab] = useState("results");
  const { interviewData, result: ctx, questions, userAnswers } = useInterview();
  const result = ctx ?? { score: 0 };
  const score  = result.score ?? 0;
  const [label, color] = perfLabel(score);

  useEffect(() => {
    if (ctx && ctx.score !== undefined) {
      logUserActivity({
        type: "technical",
        title: `${interviewData?.role || "Technical"} Mock Interview`,
        category: "Technical Interview",
        score: score,
        metrics: {
          role: interviewData?.role || "Software Engineer",
          questions: `${questions?.length || 0} Qs`,
        },
        icon: "💻",
        color: "#7c3aed",
        badge: score >= 75 ? "Passed" : "Completed",
      });
    }
  }, [ctx]);

  const TABS = [
    { id: "results",    label: "📊 Results" },
    { id: "perquestion", label: "🤖 AI Review" },
    { id: "readiness",  label: "🎯 Readiness" },
  ];

  const actionBtns = (
    <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
      <Link to="/setup"     className="btn btn-outline" style={{ flex: 1 }}>Try Again</Link>
      <Link to="/dashboard" className="btn btn-primary" style={{ flex: 1 }}>Dashboard →</Link>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", padding: "40px 20px", background: "var(--bg)", position: "relative" }}>
      {/* Top right Theme Toggle */}
      <div style={{ position: "fixed", top: 20, right: 24, zIndex: 50 }}>
        <ThemeToggle />
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto" }}>

        {/* Header card */}
        <div style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.9), rgba(91,33,182,0.9))",
          borderRadius: "20px 20px 0 0", padding: "28px 36px",
          position: "relative", overflow: "hidden",
          boxShadow: "0 8px 40px rgba(124,58,237,0.3)",
        }}>
          <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: "radial-gradient(ellipse at 80% 20%, rgba(6,182,212,0.2) 0%, transparent 60%)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
              Interview Complete 🎉
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff", fontFamily: "'Sora', sans-serif", letterSpacing: "-0.5px", marginBottom: 4 }}>
              {interviewData?.role || "Your Results"}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>
              {interviewData?.difficulty && `${interviewData.difficulty} · `}
              {interviewData?.language && `${interviewData.language} · `}
              {result.totalQuestions ?? 35} questions
              {interviewData?.company && ` · ${interviewData.company} style`}
            </p>
          </div>
        </div>

        {/* Glass content card */}
        <div className="glass" style={{ borderRadius: "0 0 20px 20px", borderTop: "none", overflow: "hidden" }}>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0 8px" }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: "14px 20px", fontWeight: 600, fontSize: 13, cursor: "pointer",
                background: "none", border: "none",
                borderBottom: tab === t.id ? "2px solid #7c3aed" : "2px solid transparent",
                color: tab === t.id ? "var(--violet-light)" : "var(--text-muted)",
                transition: "color 0.2s",
                whiteSpace: "nowrap",
              }}>{t.label}</button>
            ))}
          </div>

          <div style={{ padding: "0 32px 36px" }}>
            {tab === "results"     && <><ResultsTab result={result} interviewData={interviewData} />{actionBtns}</>}
            {tab === "perquestion" && <div style={{ marginTop: 20 }}><PerQuestionTab result={result} questions={questions} userAnswers={userAnswers} />{actionBtns}</div>}
            {tab === "readiness"   && <div style={{ marginTop: 20 }}><ReadinessTab  result={result} interviewData={interviewData} />{actionBtns}</div>}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ResultsPage;