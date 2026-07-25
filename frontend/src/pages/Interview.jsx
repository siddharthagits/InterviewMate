import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useInterview } from "../context/InterviewContext";
import MCQOptions from "../components/interview/MCQOptions";
import CodeSnippet from "../components/interview/CodeSnippet";
import { buildFallbackQuestions } from "../data/questionBank";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function parseSecs(dur) {
  const m = (dur || "").match(/(\d+)/);
  return m ? parseInt(m[1]) * 60 : 900;
}

function TimerBadge({ secs }) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  const crit = secs <= 10, warn = secs <= 60;
  return (
    <div style={{
      padding: "8px 18px", borderRadius: 10, fontWeight: 700, fontSize: 16, fontFamily: "monospace",
      background: crit ? "var(--red)" : warn ? "rgba(245,158,11,0.15)" : "rgba(99,102,241,0.15)",
      color: crit ? "#fff" : warn ? "var(--amber)" : "var(--primary-light)",
      border: `1px solid ${crit ? "var(--red)" : warn ? "var(--amber)" : "var(--border)"}`,
    }}>
      ⏱ {m}:{String(s).padStart(2, "0")}
    </div>
  );
}

function TypeBadge({ type }) {
  const map = { mcq: ["🔘 MCQ", "badge-mcq"], text: ["📝 Text", "badge-text"], code: ["💻 Code", "badge-code"] };
  const [label, cls] = map[type] || ["❓", "badge-mcq"];
  return <span className={`badge ${cls}`}>{label}</span>;
}

export default function Interview() {
  const navigate = useNavigate();
  const { interviewData, setResult, setQuestions: setCtxQuestions, setUserAnswers: setCtxUserAnswers } = useInterview();

  const [questions, setQuestions]   = useState([]);
  const [loadingQs, setLoadingQs]   = useState(true);
  const [idx, setIdx]               = useState(0);
  const [answers, setAnswers]       = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [timedOut, setTimedOut]     = useState(false);
  const [secs, setSecs]             = useState(900);

  // Guard
  useEffect(() => {
    if (!interviewData.role) navigate("/setup", { replace: true });
  }, []);

  // Fetch questions
  useEffect(() => {
    if (!interviewData.role) return;
    setSecs(parseSecs(interviewData.duration));
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "Are you sure you want to exit? Your progress will be lost.";
      return e.returnValue;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    (async () => {
      try {
        const r = await axios.post(`${API}/generate-questions`, {
          role: interviewData.role, experience: interviewData.experience,
          language: interviewData.language, difficulty: interviewData.difficulty,
        });
        setQuestions(r.data.questions || []);
        setCtxQuestions(r.data.questions || []);
      } catch {
        // Backend unreachable — generate a full 35-question interview locally
        const fb = buildFallbackQuestions({
          role: interviewData.role,
          language: interviewData.language,
          difficulty: interviewData.difficulty,
        });
        setQuestions(fb);
        setCtxQuestions(fb);
      } finally { setLoadingQs(false); }
    })();

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Timer
  useEffect(() => {
    if (loadingQs || submitting) return;
    if (secs <= 0) { handleTimeUp(); return; }
    const t = setTimeout(() => setSecs(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [secs, loadingQs, submitting]);

  const currentQ = questions[idx];
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
      question_id: q.id,
      question_type: q.type,
      selected: finalAnswers[i]?.selected ?? null,
      text: finalAnswers[i]?.text ?? null,
      correct: q.correct ?? null,
    }));

  const submitAll = async (finalAnswers) => {
    setSubmitting(true);
    const list = buildSubmissionList(finalAnswers);
    setCtxUserAnswers(list);
    try {
      const resp = await axios.post(`${API}/evaluate`, {
        interview_data: {
          role: interviewData.role, experience: interviewData.experience,
          language: interviewData.language, difficulty: interviewData.difficulty,
        },
        answers: list,
      });
      setResult({ ...resp.data, totalQuestions: questions.length, answered: list.length });
    } catch {
      setResult({ score: 0, feedback: "Could not reach server.", strengths: [], improvements: [], totalQuestions: questions.length, answered: 0 });
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
    if (idx < questions.length - 1) {
      setIdx(p => p + 1);
    } else {
      await submitAll({ ...answers });
    }
  };

  const skip = async () => {
    if (idx < questions.length - 1) {
      setIdx(p => p + 1);
    } else {
      await submitAll({ ...answers });
    }
  };

  const goBack = () => {
    if (idx > 0) setIdx(p => p - 1);
  };

  if (loadingQs) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div className="loader" />
      <p style={{ color: "var(--text-muted)" }}>Generating your questions…</p>
    </div>
  );

  const isLast = idx === questions.length - 1;

  // Calculate stats for the navigator
  const answeredCount = questions.filter((_, i) => {
    const ans = answers[i];
    return ans && (ans.selected !== null || (ans.text && ans.text.trim()));
  }).length;
  const progress = questions.length ? (answeredCount / questions.length) * 100 : 0;

  return (
    <div style={{ minHeight: "100vh", padding: "32px 20px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        
        {/* Top Header Bar */}
        <div className="glass" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", marginBottom: 24, borderRadius: 16 }}>
          <span className="grad-text" style={{ fontSize: 24, fontWeight: 800 }}>InterviewMate</span>
          <TimerBadge secs={secs} />
        </div>

        {timedOut && (
          <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid var(--red)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "var(--red)", fontWeight: 600 }}>
            ⏰ Time's up! Submitting your answers…
          </div>
        )}

        <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
          
          {/* Main Question Area */}
          <div style={{ flex: "1 1 600px", minWidth: 0 }}>
            
            {/* Info strip */}
            <div className="glass" style={{ padding: "12px 20px", marginBottom: 20, display: "flex", gap: 20, flexWrap: "wrap", fontSize: 13, borderRadius: 12 }}>
              <span>🎯 <strong>{interviewData.role}</strong></span>
              <span>💬 {interviewData.language}</span>
              <span>⚡ {interviewData.difficulty}</span>
              <span style={{ marginLeft: "auto", color: "var(--text-muted)" }}>Question {idx + 1} of {questions.length}</span>
            </div>

            {/* Question card */}
            {currentQ && (
              <div className="glass fade-up" style={{ padding: 32, borderRadius: 16 }}>
                <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center" }}>
                  <TypeBadge type={currentQ.type} />
                </div>

                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, lineHeight: 1.5 }}>
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
                    style={{ resize: "vertical", lineHeight: 1.6 }}
                  />
                )}

                {/* Navigation buttons */}
                <div style={{ marginTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <button
                    className="btn btn-outline"
                    onClick={goBack}
                    disabled={idx === 0 || submitting || timedOut}
                    style={{ minWidth: 100 }}
                  >
                    ← Back
                  </button>

                  <div style={{ display: "flex", gap: 12, marginLeft: "auto" }}>
                    <button
                      className="btn btn-outline"
                      onClick={skip}
                      disabled={submitting || timedOut}
                      style={{ color: "var(--text-muted)", borderColor: "var(--glass-border)" }}
                    >
                      Skip
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={goNext}
                      disabled={!canProceed() || submitting || timedOut}
                      style={{ minWidth: 120 }}
                    >
                      {submitting ? "Submitting…" : isLast ? "Submit ✓" : "Next →"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Navigator */}
          <div className="glass" style={{ width: 320, padding: 24, position: "sticky", top: 24, borderRadius: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Questions Navigator</h3>
            
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6, color: "var(--text-dim)" }}>
                <span>Progress</span>
                <span>{answeredCount} / {questions.length}</span>
              </div>
              <div className="progress-track" style={{ height: 4 }}>
                <div className="progress-fill" style={{ width: `${progress}%`, background: "var(--green)" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
              {questions.map((_, i) => {
                const ans = answers[i];
                const answered = ans && (ans.selected !== null || (ans.text && ans.text.trim()));
                const isCurrent = i === idx;
                
                let bg = "rgba(255,255,255,0.02)";
                let color = "var(--text-muted)";
                let border = "1px solid var(--glass-border)";
                
                if (isCurrent) {
                  bg = "linear-gradient(135deg, var(--primary), var(--primary-dark))";
                  color = "#fff";
                  border = "1px solid var(--primary-light)";
                } else if (answered) {
                  bg = "rgba(16,185,129,0.1)";
                  color = "var(--green)";
                  border = "1px solid rgba(16,185,129,0.3)";
                }

                return (
                  <button
                    key={i}
                    onClick={() => !submitting && setIdx(i)}
                    style={{
                      aspectRatio: "1/1", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 600, background: bg, color: color, border: border, cursor: "pointer",
                      transition: "all 0.2s",
                      boxShadow: isCurrent ? "0 4px 12px var(--primary-glow)" : "none"
                    }}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8, fontSize: 12, color: "var(--text-muted)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: "var(--primary)" }}></div>
                Current Question
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.5)" }}></div>
                Answered
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)" }}></div>
                Unanswered
              </div>
            </div>

            {/* Global submit button in sidebar for easy access */}
            <button
              className="btn btn-outline"
              onClick={() => submitAll({ ...answers })}
              disabled={submitting || timedOut}
              style={{ width: "100%", marginTop: 24, borderColor: "rgba(239,68,68,0.5)", color: "var(--red)" }}
            >
              Finish & Submit Test
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}