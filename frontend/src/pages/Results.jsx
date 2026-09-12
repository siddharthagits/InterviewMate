import { AppIcon } from "../components/common/AppIcon";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useInterview } from "../context/InterviewContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import { logUserActivity } from "../utils/activityTracker";
import { saveInterviewSession } from "../api/api";

// ── Helpers ───────────────────────────────────────────────────────────────────
function perfLabel(score) {
  if (score >= 85) return ["Excellent", "#10b981"];
  if (score >= 70) return ["Good",       "#7c3aed"];
  if (score >= 55) return ["Average",    "#f59e0b"];
  return             ["Needs Work",      "#ef4444"];
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
          <circle cx="80" cy="80" r={radius} fill="none" stroke="var(--border)" strokeWidth="10" />
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
          ["MCQ",  `${result.mcq_correct ?? "—"}/${result.mcq_total ?? 25}`,  "var(--violet-light)"],
          ["Code", `${result.code_correct ?? "—"}/${result.code_total ?? 5}`,  "var(--violet-light)"],
          ["Text", `${result.text_score ?? "—"}/100`,                          "var(--violet-light)"],
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
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><AppIcon name="check-circle" size={14} color="#10b981" /> Strengths</span>
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
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><AppIcon name="alert-triangle" size={14} color="#f59e0b" /> Areas to Improve</span>
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
                  const bg  = isCorr ? "var(--color-correct-bg)"     : isUser ? "var(--color-wrong-bg)"     : "var(--bg2)";
                  const bdr = isCorr ? "var(--color-correct-border)" : isUser ? "var(--color-wrong-border)" : "var(--border)";
                  const clr = isCorr ? "var(--color-correct-text)"   : isUser ? "var(--color-wrong-text)"   : "var(--text)";
                  return (
                    <div key={oi} style={{ padding: "9px 14px", borderRadius: 9, border: `1.5px solid ${bdr}`, background: bg, color: clr, fontSize: 13, fontWeight: (isCorr || isUser) ? 600 : 400, display: "flex", gap: 10 }}>
                      <span style={{ fontWeight: 700, flexShrink: 0 }}>{["A","B","C","D"][oi]}.</span>
                      <span style={{ flex: 1 }}>{opt}</span>
                      {isCorr && !isUser && <span style={{ fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 3 }}><AppIcon name="check" size={12} color="currentColor" /> Correct</span>}
                      {isUser && isCorr  && <span style={{ fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 3 }}><AppIcon name="check" size={12} color="currentColor" /> Your answer</span>}
                      {isUser && !isCorr && <span style={{ fontSize: 11, fontWeight: 700 }}>← Your answer</span>}
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
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><AppIcon name="bot" size={14} color="#10b981" /> AI Feedback</span>
                </div>

                {fb.why_weak && (
                  <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.65, margin: 0 }}>
                    <strong style={{ color: "var(--text)" }}>Analysis: </strong>{fb.why_weak}
                  </p>
                )}

                {fb.ideal_answer && (
                  <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", marginBottom: 4, display: "inline-flex", alignItems: "center", gap: 5 }}><AppIcon name="sparkles" size={12} color="#10b981" /> IDEAL ANSWER</div>
                    <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.65, margin: 0 }}>{fb.ideal_answer}</p>
                  </div>
                )}

                {fb.missed_keywords && fb.missed_keywords.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", marginBottom: 6, display: "inline-flex", alignItems: "center", gap: 5 }}><AppIcon name="alert-circle" size={12} color="#f59e0b" /> MISSED CONCEPTS</div>
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
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--violet-light)", marginBottom: 4, display: "inline-flex", alignItems: "center", gap: 5 }}><AppIcon name="info" size={12} color="var(--violet-light)" /> Explanation</div>
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
function ReadinessTab({ result, interviewData, userAnswers = [], questions = [] }) {
  const readiness = result?.readiness;
  const [animated, setAnimated] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => { const t = setTimeout(() => setAnimated(true), 200); return () => clearTimeout(t); }, []);

  if (!readiness) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
        Readiness data not available. Complete an interview with a server connection.
      </div>
    );
  }

  // Enforce ground truth: If user didn't attempt communication or code, they are strictly 0%
  const dims = { ...(readiness.dimensions || {}) };
  if (userAnswers && userAnswers.length > 0) {
    const textAttempted = userAnswers.filter(a => a.question_type === "text" && (a.text || "").trim());
    const codeAttempted = userAnswers.filter(a => a.question_type === "code" && a.selected !== null && a.selected !== undefined);
    const mcqAttempted = userAnswers.filter(a => a.question_type === "mcq" && a.selected !== null && a.selected !== undefined);
    const totalAttempted = textAttempted.length + codeAttempted.length + mcqAttempted.length;

    // 0% if no communication/text questions were answered
    if (textAttempted.length === 0) {
      dims.communication = 0;
    }
    // 0% if no code/problem-solving questions were answered
    if (codeAttempted.length === 0) {
      dims.problem_solving = 0;
    }
    // 0% if no MCQ questions were answered
    if (mcqAttempted.length === 0) {
      dims.technical = 0;
    }

    if (totalAttempted === 0) {
      dims.accuracy = 0;
      dims.speed = 0;
    } else {
      const mcqCorrect = mcqAttempted.filter(a => a.correct !== null && a.selected === a.correct).length;
      const codeCorrect = codeAttempted.filter(a => a.correct !== null && a.selected === a.correct).length;
      const textCorrect = textAttempted.filter(a => (result?.text_score || 0) >= 50).length;
      dims.accuracy = Math.round(((mcqCorrect + codeCorrect + textCorrect) / totalAttempted) * 100);
      const totalQs = questions.length || userAnswers.length || 1;
      dims.speed = Math.round(Math.min(100, Math.max(5, (totalAttempted / totalQs) * 100)));
    }
  }

  const computedOverall = Math.round(
    dims.technical * 0.35 +
    dims.problem_solving * 0.25 +
    dims.communication * 0.20 +
    dims.accuracy * 0.15 +
    dims.speed * 0.05
  );
  const displayOverall = (userAnswers && userAnswers.length > 0) ? computedOverall : (readiness.readiness ?? 0);

  const brandColor = isLight ? "#6d28d9" : "#a78bfa";
  const brandBg = "rgba(124, 58, 237, 0.10)";
  const brandBorder = "rgba(124, 58, 237, 0.22)";

  const dimList = [
    { key: "technical",       label: "Technical",       color: brandColor },
    { key: "communication",   label: "Communication",   color: brandColor },
    { key: "problem_solving", label: "Problem Solving", color: brandColor },
    { key: "speed",           label: "Speed",           color: brandColor },
    { key: "accuracy",        label: "Accuracy",        color: brandColor },
  ];

  // SVG Radar chart geometry
  const cx = 150, cy = 145, r = 88;
  const n = dimList.length;
  const points = dimList.map((d, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    const rawPct = (dims[d.key] || 0) / 100;
    const pct = rawPct; // True 0% sits cleanly at the center
    return {
      x: cx + (animated ? r * pct : 0) * Math.cos(angle),
      y: cy + (animated ? r * pct : 0) * Math.sin(angle),
      lx: cx + (r + 26) * Math.cos(angle),
      ly: cy + (r + 26) * Math.sin(angle),
    };
  });

  const rings = [0.25, 0.5, 0.75, 1.0].map(scale => {
    const ps = dimList.map((_, i) => {
      const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
      return `${cx + r * scale * Math.cos(angle)},${cy + r * scale * Math.sin(angle)}`;
    });
    return { pts: ps.join(" "), scale };
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
          {displayOverall}%
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 8 }}>
          ready for <strong style={{ color: "var(--text)" }}>{interviewData?.role || "this role"}</strong>
        </div>
        {readiness.summary && (
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 12, lineHeight: 1.7, maxWidth: 520, margin: "12px auto 0" }}>
            {readiness.summary}
          </p>
        )}
      </div>

      {/* 2-Column Section: Competency Radar (Left) + Practice & Other Tools (Right) */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))",
        gap: 20,
        marginBottom: 24,
        alignItems: "stretch",
      }}>
        {/* Left: Radar Chart Card */}
        <div className="glass" style={{
          padding: "24px 20px",
          borderRadius: 18,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          border: "1px solid var(--border)",
          background: "var(--card)",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 9,
                  background: brandBg,
                  border: `1px solid ${brandBorder}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <AppIcon name="target" size={16} color="var(--violet-light)" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Competency Radar
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    Multi-dimensional performance analysis
                  </div>
                </div>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99,
                background: brandBg, color: "var(--violet-light)",
                border: `1px solid ${brandBorder}`,
              }}>
                {displayOverall}% Overall
              </span>
            </div>

            {/* Radar chart SVG */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "10px 0" }}>
              <svg viewBox="0 0 300 290" width="100%" height="270" style={{ overflow: "visible", display: "block", maxWidth: 320, margin: "0 auto" }}>
                {/* Concentric grid rings */}
                {rings.map((ring, ri) => (
                  <polygon
                    key={ri}
                    points={ring.pts}
                    fill={ri % 2 === 0 ? "var(--radar-ring-bg)" : "transparent"}
                    stroke="var(--radar-ring)"
                    strokeWidth={ri === rings.length - 1 ? "1.8" : "1.2"}
                    strokeDasharray={ri === rings.length - 1 ? "none" : "3,3"}
                  />
                ))}

                {/* Scale markings on vertical axis */}
                {rings.map((ring, ri) => (
                  <text
                    key={`scale-${ri}`}
                    x={cx + 4}
                    y={cy - r * ring.scale + 3}
                    fontSize="9"
                    fontWeight="700"
                    fill={isLight ? "#64748b" : "#94a3b8"}
                    fontFamily="Inter, sans-serif"
                  >
                    {Math.round(ring.scale * 100)}%
                  </text>
                ))}

                {/* Radial Spokes */}
                {dimList.map((_, i) => {
                  const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
                  return (
                    <line
                      key={i}
                      x1={cx}
                      y1={cy}
                      x2={cx + r * Math.cos(angle)}
                      y2={cy + r * Math.sin(angle)}
                      stroke="var(--radar-spoke)"
                      strokeWidth="1.2"
                    />
                  );
                })}

                {/* Center dot */}
                <circle cx={cx} cy={cy} r="3" fill={brandColor} opacity="0.8" />

                {/* Data polygon */}
                <polygon
                  points={dataPolygon}
                  fill="var(--radar-poly-fill)"
                  stroke="var(--radar-poly-stroke)"
                  strokeWidth="2.5"
                  style={{
                    transition: "all 1.2s cubic-bezier(0.4,0,0.2,1)",
                    filter: isLight ? "drop-shadow(0 2px 8px rgba(124,58,237,0.35))" : "drop-shadow(0 0 10px rgba(168,85,247,0.6))",
                  }}
                />

                {/* Data vertex circles */}
                {points.map((p, i) => (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r="5.5"
                    fill={brandColor}
                    stroke={isLight ? "#ffffff" : "#06030c"}
                    strokeWidth="2"
                    style={{
                      transition: "all 1.2s cubic-bezier(0.4,0,0.2,1)",
                      filter: `drop-shadow(0 0 6px ${brandColor})`,
                    }}
                  />
                ))}

                {/* Dimension labels with percentage value */}
                {points.map((p, i) => (
                  <g key={i} transform={`translate(${p.lx}, ${p.ly})`}>
                    <text
                      textAnchor="middle"
                      y="-2"
                      fontSize="11"
                      fontWeight="700"
                      fill="var(--text)"
                      fontFamily="Inter, sans-serif"
                    >
                      {dimList[i].label}
                    </text>
                    <text
                      textAnchor="middle"
                      y="11"
                      fontSize="10.5"
                      fontWeight="800"
                      fill={brandColor}
                      fontFamily="'Sora', sans-serif"
                    >
                      {Math.round(dims[dimList[i].key] || 0)}%
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Footer note inside card */}
          <div style={{
            marginTop: 12,
            padding: "10px 14px",
            borderRadius: 10,
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            fontSize: 12,
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <AppIcon name="sparkles" size={14} color="var(--violet-light)" />
            <span>Polygon shape highlights relative mastery across core technical & soft skills.</span>
          </div>
        </div>

        {/* Right: Practice & Explore Other Tools Card */}
        <div className="glass" style={{
          padding: "24px 20px",
          borderRadius: 18,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          border: "1px solid var(--border)",
          background: "var(--card)",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 9,
                  background: brandBg,
                  border: `1px solid ${brandBorder}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <AppIcon name="zap" size={16} color="var(--violet-light)" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Practice Other Tools
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    Target weaknesses with specialized practice modules
                  </div>
                </div>
              </div>
              <span style={{
                fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 99,
                background: brandBg, color: "var(--violet-light)",
                border: `1px solid ${brandBorder}`,
              }}>
                Level Up
              </span>
            </div>

            {/* List of tools (Single cohesive brand color) */}
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 12 }}>
              {[
                {
                  title: "Voice AI Interview",
                  desc: "Interactive verbal mock interviews with real-time feedback",
                  to: "/voice",
                  badge: "Voice AI",
                  icon: "mic",
                },
                {
                  title: "Practice Corner",
                  desc: "Targeted problem sets for DSA, System Design, SQL & Web",
                  to: "/practice",
                  badge: "Topic Drills",
                  icon: "target",
                },
                {
                  title: "Company Assessments",
                  desc: "FAANG-calibrated hiring exams (Google, Meta, Amazon)",
                  to: "/company-assessment",
                  badge: "Exams",
                  icon: "building",
                },
                {
                  title: "Code Typing Test",
                  desc: "Accelerate your code typing speed (WPM) and accuracy",
                  to: "/typing-test",
                  badge: "Speed",
                  icon: "keyboard",
                },
                {
                  title: "Curated Question Bank",
                  desc: "Explore 1000+ top interview questions with solutions",
                  to: "/question-bank",
                  badge: "Library",
                  icon: "book",
                },
                {
                  title: "HR & Behavioral Prep",
                  desc: "Master STAR method and culture-fit behavioral questions",
                  to: "/hr-interview",
                  badge: "Behavioral",
                  icon: "user",
                },
              ].map((tool, idx) => (
                <Link
                  key={idx}
                  to={tool.to}
                  className="tool-practice-card"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "9px 12px",
                    borderRadius: 12,
                    background: "var(--bg2)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: brandBg,
                    border: `1px solid ${brandBorder}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <AppIcon name={tool.icon} size={15} color={brandColor} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text)" }}>{tool.title}</span>
                      <span style={{
                        fontSize: 9.5, fontWeight: 700, padding: "1px 6px", borderRadius: 4,
                        background: brandBg, color: brandColor, border: `1px solid ${brandBorder}`,
                      }}>{tool.badge}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {tool.desc}
                    </div>
                  </div>
                  <span style={{ color: brandColor, fontWeight: 800, fontSize: 13, paddingLeft: 4, flexShrink: 0 }}>
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Retake Interview Link at bottom */}
          <div style={{ marginTop: 14, textAlign: "center" }}>
            <Link
              to="/setup"
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--violet-light)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <AppIcon name="refresh" size={13} color="var(--violet-light)" />
              Configure New Technical Interview →
            </Link>
          </div>
        </div>
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
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><AppIcon name="target" size={14} color="var(--violet-light)" /> Your Improvement Roadmap</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {readiness.roadmap.map((item, i) => (
              <div key={i} style={{
                background: "var(--bg2)", border: "1px solid var(--border)",
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
  const { user, isLoggedIn } = useAuth();
  const result = ctx ?? { score: 0 };
  const score  = result.score ?? 0;
  const [label, color] = perfLabel(score);
  useEffect(() => {
    if (ctx && ctx.score !== undefined) {
      if (isLoggedIn && user?.id) {
        // 1. Only persist to localStorage if authenticated
        logUserActivity({
          type: "technical",
          title: `${interviewData?.role || "Technical"} Mock Interview`,
          category: "Technical Interview",
          score: score,
          metrics: {
            role: interviewData?.role || "Software Engineer",
            questions: `${questions?.length || 0} Qs`,
          },
          icon: "code",
          color: "#7c3aed",
          badge: score >= 75 ? "Passed" : "Completed",
        });

        // 2. Also persist to MongoDB (cloud)
        saveInterviewSession({
          user_id: user.id,
          interview_data: interviewData || {},
          answers: (userAnswers || []).map((a) => ({
            question_id: a.question_id,
            question_type: a.question_type,
            selected: a.selected ?? null,
            text: a.text ?? null,
            correct: a.correct ?? null,
            question_text: a.question_text ?? null,
          })),
          evaluation: ctx,
        });
      }
    }
  }, [ctx, isLoggedIn, user]);

  const TABS = [
    { id: "results",    label: "Results",     icon: "bar-chart" },
    { id: "perquestion", label: "AI Review",  icon: "bot" },
    { id: "readiness",  label: "Readiness",   icon: "target" },
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

      <div style={{ maxWidth: 1040, margin: "0 auto" }}>

        {/* Header card */}
        <div style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.9), rgba(91,33,182,0.9))",
          borderRadius: "20px 20px 0 0", padding: "28px 36px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: "radial-gradient(ellipse at 80% 20%, rgba(6,182,212,0.2) 0%, transparent 60%)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontSize: 12, fontWeight: 800, color: "#c4b5fd",
                letterSpacing: "0.16em", textTransform: "uppercase",
              }}>
                <span style={{ width: 18, height: 1.5, background: "#c4b5fd", display: "inline-block", borderRadius: 2 }} />
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <AppIcon name="check-circle" size={13} color="#34d399" /> Technical Interview Complete
                </span>
              </div>
              {!isLoggedIn && (
                <Link
                  to="/login"
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.9)",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    letterSpacing: "0.02em",
                  }}
                >
                  <AppIcon name="lock" size={12} color="rgba(255,255,255,0.7)" /> Sign in to save history →
                </Link>
              )}
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

        {/* Not Logged In Callout */}
        {!isLoggedIn && (
          <div
            style={{
              padding: "12px 18px",
              background: "rgba(124,58,237,0.08)",
              borderLeft: "3px solid var(--violet)",
              borderRight: "1px solid var(--glass-border)",
              borderTop: "none",
              borderBottom: "1px solid var(--glass-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text)" }}>
              <AppIcon name="lock" size={13} />
              <span>
                <strong>Unsaved Session:</strong> You are not logged in. History is only recorded for registered accounts.
              </span>
            </div>
            <Link
              to="/login"
              className="btn btn-primary"
              style={{ padding: "6px 14px", fontSize: 12 }}
            >
              Sign In to Save →
            </Link>
          </div>
        )}

        {/* Glass content card */}
        <div className="glass" style={{ borderRadius: isLoggedIn ? "0 0 20px 20px" : "0 0 20px 20px", borderTop: "none", overflow: "hidden" }}>
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
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}>
                <AppIcon name={t.icon} size={14} color={tab === t.id ? "var(--violet-light)" : "var(--text-muted)"} />
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ padding: "0 32px 36px" }}>
            {tab === "results"     && <><ResultsTab result={result} interviewData={interviewData} />{actionBtns}</>}
            {tab === "perquestion" && <div style={{ marginTop: 20 }}><PerQuestionTab result={result} questions={questions} userAnswers={userAnswers} />{actionBtns}</div>}
            {tab === "readiness"   && <div style={{ marginTop: 20 }}><ReadinessTab  result={result} interviewData={interviewData} userAnswers={userAnswers} questions={questions} />{actionBtns}</div>}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ResultsPage;