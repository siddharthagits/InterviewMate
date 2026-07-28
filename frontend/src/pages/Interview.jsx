import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useInterview } from "../context/InterviewContext";
import MCQOptions from "../components/interview/MCQOptions";
import CodeSnippet from "../components/interview/CodeSnippet";
import { buildFallbackQuestions } from "../data/questionBank";


// Per-question time limits for pressure mode (seconds)
const PRESSURE_LIMITS = { mcq: 60, text: 90, code: 120 };

function parseSecs(dur) {
  const m = (dur || "").match(/(\d+)/);
  return m ? parseInt(m[1]) * 60 : 900;
}

// ── Timer badge ───────────────────────────────────────────────────────────────
function TimerBadge({ secs, pressureMode, qType }) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  const limit = pressureMode ? (PRESSURE_LIMITS[qType] || 60) : null;
  const pct = limit ? (secs / limit) * 100 : 100;
  const crit = secs <= 10;
  const warn = secs <= (limit ? limit * 0.3 : 60);

  const color = crit ? "#ef4444" : warn ? "#f59e0b" : pressureMode ? "#ef4444" : "#7c3aed";
  const bg    = crit ? "rgba(239,68,68,0.15)" : warn ? "rgba(245,158,11,0.12)" : pressureMode ? "rgba(239,68,68,0.08)" : "rgba(124,58,237,0.12)";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {pressureMode && (
        <div style={{ position: "relative", width: 32, height: 32 }}>
          <svg width="32" height="32" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
            <circle
              cx="16" cy="16" r="13" fill="none"
              stroke={color} strokeWidth="3" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 13}
              strokeDashoffset={2 * Math.PI * 13 * (1 - pct / 100)}
              style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
            />
          </svg>
        </div>
      )}
      <div style={{
        padding: "8px 18px", borderRadius: 10, fontWeight: 700, fontSize: 16,
        fontFamily: "'JetBrains Mono', monospace",
        background: bg, color,
        border: `1px solid ${color}50`,
        animation: crit ? "pulse-glow 0.6s ease-in-out infinite" : "none",
      }}>
        {pressureMode ? "⚡" : "⏱"} {m}:{String(s).padStart(2, "0")}
      </div>
    </div>
  );
}

// ── Question type badge ───────────────────────────────────────────────────────
function TypeBadge({ type }) {
  const map = {
    mcq:  ["MCQ",  "badge-mcq",  "#7c3aed"],
    text: ["Text", "badge-text", "#10b981"],
    code: ["Code", "badge-code", "#f59e0b"],
  };
  const [label, cls] = map[type] || ["?", "badge-mcq", "#7c3aed"];
  return <span className={`badge ${cls}`}>{label}</span>;
}

// ── Company badge ─────────────────────────────────────────────────────────────
function CompanyBadge({ company }) {
  if (!company) return null;
  const colors = {
    Google: "#10b981", Amazon: "#f59e0b", Meta: "#ec4899",
    Microsoft: "#7c3aed", TCS: "#3b82f6", Wipro: "#8b5cf6",
    Infosys: "#06b6d4", Startup: "#ef4444",
  };
  const c = colors[company] || "#7c3aed";
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99,
      background: `${c}15`, color: c, border: `1px solid ${c}40`,
      textTransform: "uppercase", letterSpacing: "0.06em",
    }}>
      🏢 {company}
    </span>
  );
}

export default function Interview() {
  const navigate = useNavigate();
  const { interviewData, setResult, setQuestions: setCtxQuestions, setUserAnswers: setCtxUserAnswers } = useInterview();

  const [questions,   setQuestions]   = useState([]);
  const [loadingQs,   setLoadingQs]   = useState(true);
  const [idx,         setIdx]         = useState(0);
  const [answers,     setAnswers]     = useState({});
  const [submitting,  setSubmitting]  = useState(false);
  const [timedOut,    setTimedOut]    = useState(false);

  // Global timer (when NOT in pressure mode)
  const [globalSecs, setGlobalSecs] = useState(900);

  // Per-question timer (pressure mode)
  const [qSecs,   setQSecs]   = useState(60);
  const qSecsRef              = useRef(60);

  const pressureMode = !!interviewData.pressureMode;

  // Guard
  useEffect(() => {
    if (!interviewData.role) navigate("/setup", { replace: true });
  }, []);

  // Fetch questions
  useEffect(() => {
    if (!interviewData.role) return;
    setGlobalSecs(parseSecs(interviewData.duration));

    const beforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "Your progress will be lost. Are you sure?";
      return e.returnValue;
    };
    window.addEventListener("beforeunload", beforeUnload);

    (async () => {
      try {
        const r = await api.post(`/generate-questions`, {
          role:       interviewData.role,
          experience: interviewData.experience,
          language:   interviewData.language,
          difficulty: interviewData.difficulty,
          company:    interviewData.company || null,
        });
        setQuestions(r.data.questions || []);
        setCtxQuestions(r.data.questions || []);
      } catch {
        const fb = buildFallbackQuestions({
          role:       interviewData.role,
          language:   interviewData.language,
          difficulty: interviewData.difficulty,
        });
        setQuestions(fb);
        setCtxQuestions(fb);
      } finally {
        setLoadingQs(false);
      }
    })();

    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, []);

  // ── Reset per-question timer when question changes ──
  useEffect(() => {
    if (!pressureMode || loadingQs) return;
    const q = questions[idx];
    if (!q) return;
    const limit = PRESSURE_LIMITS[q.type] || 60;
    setQSecs(limit);
    qSecsRef.current = limit;
  }, [idx, questions, pressureMode, loadingQs]);

  // ── Global timer ──
  useEffect(() => {
    if (pressureMode || loadingQs || submitting) return;
    if (globalSecs <= 0) { handleTimeUp(); return; }
    const t = setTimeout(() => setGlobalSecs(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [globalSecs, loadingQs, submitting, pressureMode]);

  // ── Per-question timer ──
  useEffect(() => {
    if (!pressureMode || loadingQs || submitting) return;
    if (qSecs <= 0) {
      // Auto advance on question timeout
      if (idx < questions.length - 1) {
        setIdx(p => p + 1);
      } else {
        handleTimeUp();
      }
      return;
    }
    const t = setTimeout(() => setQSecs(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [qSecs, pressureMode, loadingQs, submitting, idx, questions.length]);

  const currentQ   = questions[idx];
  const currentAns = answers[idx] ?? { selected: null, text: "" };

  const setCurrentAns = useCallback((patch) => {
    setAnswers(prev => ({ ...prev, [idx]: { ...prev[idx], selected: null, text: "", ...patch } }));
  }, [idx]);

  const canProceed = () => {
    if (!currentQ) return false;
    if (currentQ.type === "text") return (currentAns.text || "").trim().length > 0;
    return currentAns.selected !== null;
  };

  const buildSubmissionList = (finalAnswers) =>
    questions.map((q, i) => ({
      question_id:   q.id,
      question_type: q.type,
      selected:      finalAnswers[i]?.selected ?? null,
      text:          finalAnswers[i]?.text ?? null,
      correct:       q.correct ?? null,
      question_text: q.question || null,   // for per-Q AI feedback
    }));

  const submitAll = async (finalAnswers) => {
    setSubmitting(true);
    const list = buildSubmissionList(finalAnswers);
    setCtxUserAnswers(list);
    try {
      const resp = await api.post(`/evaluate`, {
        interview_data: {
          role:       interviewData.role,
          experience: interviewData.experience,
          language:   interviewData.language,
          difficulty: interviewData.difficulty,
          company:    interviewData.company || null,
        },
        answers: list,
      });
      setResult({ ...resp.data, totalQuestions: questions.length, answered: list.length });
    } catch {
      setResult({
        score: 0, feedback: "Could not reach server.",
        strengths: [], improvements: [],
        per_question_feedback: [], readiness: null,
        totalQuestions: questions.length, answered: 0,
      });
    } finally {
      setSubmitting(false);
      navigate("/results");
    }
  };

  const handleTimeUp = () => {
    if (submitting || timedOut) return;
    setTimedOut(true);
    submitAll({ ...answers });
  };

  const goNext = async () => {
    if (idx < questions.length - 1) setIdx(p => p + 1);
    else await submitAll({ ...answers });
  };

  const skip = async () => {
    if (idx < questions.length - 1) setIdx(p => p + 1);
    else await submitAll({ ...answers });
  };

  const goBack = () => { if (idx > 0) setIdx(p => p - 1); };

  if (loadingQs) return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 20,
    }}>
      <div className="loader" style={{ width: 48, height: 48, borderWidth: 3 }} />
      <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
        {interviewData.company
          ? `Generating ${interviewData.company}-style questions…`
          : "Generating your questions…"}
      </p>
      {interviewData.company && (
        <CompanyBadge company={interviewData.company} />
      )}
    </div>
  );

  const isLast = idx === questions.length - 1;
  const answeredCount = questions.filter((_, i) => {
    const ans = answers[i];
    return ans && (ans.selected !== null || (ans.text && ans.text.trim()));
  }).length;
  const progress = questions.length ? (answeredCount / questions.length) * 100 : 0;

  const displaySecs = pressureMode ? qSecs : globalSecs;
  const displayQType = currentQ?.type || "mcq";

  return (
    <div style={{ minHeight: "100vh", padding: "28px 20px", background: "var(--bg)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header bar */}
        <div className="glass" style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "14px 24px", marginBottom: 24, borderRadius: 16,
          borderColor: pressureMode ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{
              fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 900,
              background: "linear-gradient(135deg, #c4b5fd, #06b6d4, #fcd34d)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>InterviewMate</span>
            {interviewData.company && <CompanyBadge company={interviewData.company} />}
            {pressureMode && (
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99,
                background: "rgba(239,68,68,0.12)", color: "#ef4444",
                border: "1px solid rgba(239,68,68,0.3)", textTransform: "uppercase", letterSpacing: "0.07em",
              }}>
                ⚡ Pressure Mode
              </span>
            )}
          </div>
          <TimerBadge
            secs={displaySecs}
            pressureMode={pressureMode}
            qType={displayQType}
          />
        </div>

        {timedOut && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.4)",
            borderRadius: 12, padding: "12px 18px", marginBottom: 20,
            color: "#ef4444", fontWeight: 600, display: "flex", alignItems: "center", gap: 8,
          }}>
            ⏰ {pressureMode ? "Session time's up!" : "Time's up!"} Submitting your answers…
          </div>
        )}

        <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>

          {/* Main Question Area */}
          <div style={{ flex: "1 1 600px", minWidth: 0 }}>

            {/* Info strip */}
            <div className="glass" style={{
              padding: "12px 20px", marginBottom: 20,
              display: "flex", gap: 16, flexWrap: "wrap", fontSize: 13, borderRadius: 12,
              alignItems: "center",
            }}>
              <span style={{ fontWeight: 600 }}>{interviewData.role}</span>
              <span style={{ color: "var(--text-muted)" }}>·</span>
              <span style={{ color: "var(--text-muted)" }}>{interviewData.language}</span>
              <span style={{ color: "var(--text-muted)" }}>·</span>
              <span style={{ color: "var(--text-muted)" }}>{interviewData.difficulty}</span>
              {pressureMode && currentQ && (
                <>
                  <span style={{ color: "var(--text-muted)" }}>·</span>
                  <span style={{ color: "#ef4444", fontWeight: 600, fontSize: 12 }}>
                    {PRESSURE_LIMITS[currentQ.type]}s limit/question
                  </span>
                </>
              )}
              <span style={{ marginLeft: "auto", color: "var(--text-muted)" }}>
                Q {idx + 1} / {questions.length}
              </span>
            </div>

            {/* Question card */}
            {currentQ && (
              <div className="glass fade-up" style={{ padding: 32, borderRadius: 16, position: "relative", overflow: "hidden" }}>
                {/* Pressure mode top progress bar */}
                {pressureMode && (
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: "rgba(255,255,255,0.04)",
                  }}>
                    <div style={{
                      height: "100%",
                      width: `${(qSecs / (PRESSURE_LIMITS[currentQ.type] || 60)) * 100}%`,
                      background: qSecs <= 10
                        ? "linear-gradient(90deg, #ef4444, #dc2626)"
                        : qSecs <= (PRESSURE_LIMITS[currentQ.type] || 60) * 0.3
                          ? "linear-gradient(90deg, #f59e0b, #d97706)"
                          : "linear-gradient(90deg, #7c3aed, #06b6d4)",
                      transition: "width 1s linear, background 0.3s",
                      borderRadius: "0 2px 2px 0",
                    }} />
                  </div>
                )}

                <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center", paddingTop: pressureMode ? 8 : 0 }}>
                  <TypeBadge type={currentQ.type} />
                </div>

                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, lineHeight: 1.55, letterSpacing: "-0.2px" }}>
                  {currentQ.type !== "code" && currentQ.question}
                </h2>

                {/* MCQ */}
                {currentQ.type === "mcq" && (
                  <MCQOptions
                    options={currentQ.options}
                    selected={currentAns.selected}
                    onSelect={(i) => setCurrentAns({ selected: i })}
                    disabled={submitting || timedOut}
                  />
                )}

                {/* Code */}
                {currentQ.type === "code" && (
                  <CodeSnippet
                    question={currentQ.question}
                    code={currentQ.code}
                    options={currentQ.options}
                    selected={currentAns.selected}
                    onSelect={(i) => setCurrentAns({ selected: i })}
                    disabled={submitting || timedOut}
                  />
                )}

                {/* Text */}
                {currentQ.type === "text" && (
                  <textarea
                    rows={7}
                    value={currentAns.text || ""}
                    onChange={e => setCurrentAns({ text: e.target.value })}
                    placeholder="Type your answer here…"
                    disabled={submitting || timedOut}
                    className="input"
                    style={{ resize: "vertical", lineHeight: 1.7 }}
                  />
                )}

                {/* Navigation buttons */}
                <div style={{ marginTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <button
                    className="btn btn-outline"
                    onClick={goBack}
                    disabled={idx === 0 || submitting || timedOut}
                    style={{ minWidth: 100 }}
                  >← Back</button>

                  <div style={{ display: "flex", gap: 12, marginLeft: "auto" }}>
                    {!pressureMode && (
                      <button
                        className="btn btn-outline"
                        onClick={skip}
                        disabled={submitting || timedOut}
                        style={{ color: "var(--text-muted)", borderColor: "var(--glass-border)" }}
                      >Skip</button>
                    )}
                    <button
                      className="btn btn-primary"
                      onClick={goNext}
                      disabled={!canProceed() || submitting || timedOut}
                      style={{ minWidth: 130 }}
                    >
                      {submitting ? "Submitting…" : isLast ? "Submit ✓" : "Next →"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Navigator */}
          <div className="glass" style={{ width: 300, padding: 24, position: "sticky", top: 24, borderRadius: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>
              Questions
            </h3>

            <div style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6, color: "var(--text-dim)" }}>
                <span>Progress</span>
                <span style={{ fontWeight: 600 }}>{answeredCount} / {questions.length}</span>
              </div>
              <div className="progress-track" style={{ height: 5 }}>
                <div className="progress-fill" style={{ width: `${progress}%`, background: "#10b981" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 7 }}>
              {questions.map((q, i) => {
                const ans = answers[i];
                const answered = ans && (ans.selected !== null || (ans.text && ans.text.trim()));
                const isCurrent = i === idx;

                let bg     = "rgba(255,255,255,0.02)";
                let color  = "var(--text-muted)";
                let border = "1px solid rgba(255,255,255,0.06)";

                if (isCurrent) {
                  bg = "linear-gradient(135deg, #7c3aed, #5b21b6)";
                  color = "#fff";
                  border = "1px solid #a78bfa";
                } else if (answered) {
                  bg = "rgba(16,185,129,0.08)";
                  color = "#10b981";
                  border = "1px solid rgba(16,185,129,0.3)";
                }

                return (
                  <button key={i} onClick={() => !submitting && !pressureMode && setIdx(i)} style={{
                    aspectRatio: "1/1", borderRadius: 8, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 600,
                    background: bg, color, border,
                    cursor: pressureMode ? "default" : "pointer",
                    transition: "all 0.2s",
                    boxShadow: isCurrent ? "0 4px 14px rgba(124,58,237,0.35)" : "none",
                  }}>
                    {i + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 7, fontSize: 11, color: "var(--text-muted)" }}>
              {[
                ["#7c3aed", "Current"],
                ["rgba(16,185,129,0.2)", "Answered"],
                ["rgba(255,255,255,0.04)", "Unanswered"],
              ].map(([bg, label]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: bg, border: "1px solid rgba(255,255,255,0.1)" }} />
                  {label}
                </div>
              ))}
            </div>

            {pressureMode && (
              <div style={{
                marginTop: 18, padding: "10px 12px", borderRadius: 10,
                background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)",
                fontSize: 11, color: "#ef4444", lineHeight: 1.6,
              }}>
                ⚡ <strong>Pressure Mode</strong><br />
                Questions auto-advance on timeout. Navigation disabled.
              </div>
            )}

            <button
              className="btn"
              onClick={() => submitAll({ ...answers })}
              disabled={submitting || timedOut}
              style={{
                width: "100%", marginTop: 20, fontSize: 13,
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#ef4444",
              }}
            >
              Finish & Submit
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}