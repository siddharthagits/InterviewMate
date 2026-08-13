import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { SUBJECTS, QUESTIONS, getSubjectMeta, getSubjectTopics } from "../data/subjectQuestions";
import api from "../api/api";
import ConfirmModal from "../components/ConfirmModal";
import { logUserActivity } from "../utils/activityTracker";


// ── Helpers ───────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function perfColor(pct) {
  if (pct >= 80) return "#10b981";
  if (pct >= 60) return "#f59e0b";
  return "#ef4444";
}
function perfLabel(pct) {
  if (pct >= 80) return "Excellent 🏆";
  if (pct >= 60) return "Good 👍";
  if (pct >= 40) return "Average 📈";
  return "Needs Practice 💪";
}

// ── Animated score ring ───────────────────────────────────────────────────────
function ScoreRing({ score, total }) {
  const [anim, setAnim] = useState(0);
  const pct = Math.round((score / total) * 100);
  const color = perfColor(pct);
  const r = 54;
  const circ = 2 * Math.PI * r;

  useEffect(() => { const t = setTimeout(() => setAnim(pct), 150); return () => clearTimeout(t); }, [pct]);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", width: 140, height: 140, margin: "0 auto 12px" }}>
        <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
          <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ - (anim / 100) * circ}
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 0 10px ${color})` }}
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 28, fontWeight: 900, color, fontFamily: "'Sora', sans-serif", letterSpacing: "-1px" }}>{score}</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>/ {total}</span>
        </div>
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color }}>{perfLabel(pct)}</div>
      <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{pct}% correct</div>
    </div>
  );
}

// ── Browse Mode — Vertical list layout ────────────────────────────────────────
function BrowseMode({ subject }) {
  const [search, setSearch]       = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const topics = getSubjectTopics(subject.id);

  const allTags = ["All", ...Array.from(new Set(topics.map(t => t.tag)))];

  const filtered = topics.filter(t => {
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.summary.toLowerCase().includes(search.toLowerCase()) ||
      t.tag.toLowerCase().includes(search.toLowerCase());
    const matchTag = activeTag === "All" || t.tag === activeTag;
    return matchSearch && matchTag;
  });

  return (
    <div>
      {/* ── Search + tag filters ── */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 220px" }}>
          <input
            className="input"
            placeholder="Search topics…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 38, fontSize: 13 }}
          />
          <span style={{
            position: "absolute", left: 12, top: "50%",
            transform: "translateY(-50%)", fontSize: 14, color: "var(--text-muted)",
          }}>🔍</span>
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {allTags.map(tag => (
            <button key={tag} onClick={() => setActiveTag(tag)} style={{
              padding: "5px 13px", borderRadius: 99, fontSize: 11,
              fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
              border: `1px solid ${activeTag === tag ? subject.color : "rgba(255,255,255,0.08)"}`,
              background: activeTag === tag ? `${subject.color}15` : "transparent",
              color: activeTag === tag ? subject.color : "var(--text-muted)",
            }}>{tag}</button>
          ))}
        </div>
      </div>

      {/* count */}
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 14 }}>
        <strong style={{ color: "var(--text)" }}>{filtered.length}</strong> topics
      </div>

      {/* ── Vertical list ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {filtered.map((topic, i) => (
          <TopicRow key={topic.title} topic={topic} subject={subject} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "52px 0", color: "var(--text-muted)" }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
          <div>No topics match "<strong>{search}</strong>"</div>
        </div>
      )}
    </div>
  );
}

// ── Topic Row — fully visible, no dropdown ────────────────────────────────────
function TopicRow({ topic, subject, index }) {
  const [aiExplanation, setAiExplanation] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  const handleDiveIn = async () => {
    if (aiExplanation || loadingAi) return;
    setLoadingAi(true);
    try {
      const res = await api.post("/explain-question", {
        question: `Explain in depth the topic "${topic.title}". Context: ${topic.summary}`,
        subject: subject.name,
      });
      setAiExplanation(res.data.explanation);
    } catch (e) {
      setAiExplanation("Failed to get AI explanation.");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleChatGPTOpen = () => {
    const shortSummary = topic.summary.length > 60 ? topic.summary.substring(0, 60) + "..." : topic.summary;
    const query = encodeURIComponent(`Topic: ${topic.title}, Subject: ${subject.name}, Summary: ${shortSummary}. Please explain in detail.`);
    window.open(`https://chatgpt.com/?q=${query}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 0,
      padding: "18px 20px 18px 0",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      background: "transparent",
    }}>
      {/* Left colour bar */}
      <div style={{
        width: 3, alignSelf: "stretch", flexShrink: 0, marginRight: 16,
        background: subject.gradient, borderRadius: 99, opacity: 0.5,
      }} />

      {/* Number */}
      <div style={{
        width: 28, flexShrink: 0, paddingTop: 2,
        fontSize: 11, fontWeight: 700, color: subject.color,
        fontFamily: "'JetBrains Mono', monospace",
        opacity: 0.7,
      }}>
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Main content */}
      <div style={{ flex: 1 }}>
        {/* Title + Tag on same line */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 15, fontWeight: 800,
            fontFamily: "'Sora', sans-serif",
            color: "var(--text)", lineHeight: 1.2,
          }}>
            {topic.title}
          </span>
          <span style={{
            fontSize: 9, fontWeight: 700, padding: "3px 9px",
            borderRadius: 99, flexShrink: 0,
            background: `${subject.color}15`,
            color: subject.color,
            border: `1px solid ${subject.color}30`,
            textTransform: "uppercase", letterSpacing: "0.07em",
          }}>
            {topic.tag}
          </span>
        </div>

        {/* Full summary always visible */}
        <p style={{
          margin: 0, fontSize: 13.5, lineHeight: 1.75,
          color: "var(--text-muted)",
        }}>
          {topic.summary}
        </p>

        {/* AI Dive In Area */}
        <div style={{ marginTop: 12 }}>
          {aiExplanation ? (
            <div style={{
              fontSize: 13, color: "var(--text)", background: "rgba(16,185,129,0.05)",
              border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8, padding: "12px 16px",
              lineHeight: 1.6, display: "flex", gap: 12,
            }}>
              <span style={{ fontSize: 18 }}>🤖</span>
              <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                <strong style={{ color: "#10b981", display: "block", marginBottom: 6 }}>AI Dive In:</strong>
                {aiExplanation}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <button 
                onClick={handleDiveIn}
                disabled={loadingAi}
                style={{
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "var(--text-muted)", fontSize: 11, fontWeight: 600, padding: "6px 12px",
                  borderRadius: 6, cursor: loadingAi ? "not-allowed" : "pointer",
                  display: "inline-flex", alignItems: "center", gap: 6, transition: "all 0.2s",
                }}
              >
                {loadingAi ? "⏳ Generating..." : "✨ AI Dive In"}
              </button>
              <button 
                onClick={handleChatGPTOpen}
                style={{
                  background: "rgba(16, 163, 127, 0.1)", border: "1px solid rgba(16, 163, 127, 0.3)",
                  color: "#10a37f", fontSize: 11, fontWeight: 600, padding: "6px 12px",
                  borderRadius: 6, cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: 6, transition: "all 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(16, 163, 127, 0.2)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(16, 163, 127, 0.1)"}
              >
                Ask ChatGPT ↗
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



// ── Test Runner ───────────────────────────────────────────────────────────────
function TestRunner({ questions, subject, onFinish }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [secs, setSecs] = useState(questions.length * 60); // 1 min per question
  const [confirmOpen, setConfirmOpen] = useState(false);

  const q = questions[idx];
  const isLast = idx === questions.length - 1;

  // Timer
  useEffect(() => {
    if (secs <= 0) { submitTest(); return; }
    const t = setTimeout(() => setSecs(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);

  const submitTest = useCallback(() => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) correct++;
    });
    onFinish({ score: correct, total: questions.length, answers, questions });
  }, [answers, questions, onFinish]);

  const select = (oi) => setAnswers(p => ({ ...p, [idx]: oi }));

  const mins = Math.floor(secs / 60);
  const secsD = secs % 60;
  const timePct = (secs / (questions.length * 60)) * 100;
  const timeColor = secs <= 60 ? "#ef4444" : secs <= 120 ? "#f59e0b" : "#10b981";

  return (
    <div>
      {/* Timer bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 16, marginBottom: 20,
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 12, padding: "12px 18px",
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>
            <span>Time Remaining</span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: timeColor,
              animation: secs <= 30 ? "pulse-glow 0.6s infinite" : "none",
            }}>
              {mins}:{String(secsD).padStart(2, "0")}
            </span>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 99,
              width: `${timePct}%`,
              background: `linear-gradient(90deg, ${timeColor}, ${timeColor}99)`,
              transition: "width 1s linear, background 0.3s",
            }} />
          </div>
        </div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", flexShrink: 0 }}>
          Q <strong style={{ color: "var(--text)" }}>{idx + 1}</strong> / {questions.length}
        </div>
      </div>

      {/* Question card */}
      <div className="glass" style={{ padding: "28px 28px 24px", borderRadius: 18, marginBottom: 16 }}>
        {/* Progress dots */}
        <div style={{ display: "flex", gap: 4, marginBottom: 22, flexWrap: "wrap" }}>
          {questions.map((_, i) => {
            const answered = answers[i] !== undefined;
            const isCurr = i === idx;
            return (
              <div key={i} style={{
                width: isCurr ? 20 : 8, height: 8, borderRadius: 99,
                background: isCurr
                  ? subject.color
                  : answered
                    ? `${subject.color}60`
                    : "rgba(255,255,255,0.1)",
                transition: "all 0.2s",
              }} />
            );
          })}
        </div>

        <h2 style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.6, marginBottom: 24, color: "var(--text)" }}>
          {q.q}
        </h2>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.options.map((opt, oi) => {
            const selected = answers[idx] === oi;
            return (
              <button key={oi} onClick={() => select(oi)} style={{
                padding: "13px 18px", borderRadius: 12, textAlign: "left",
                border: `1px solid ${selected ? subject.color : "rgba(255,255,255,0.07)"}`,
                background: selected ? `${subject.color}15` : "rgba(255,255,255,0.02)",
                color: selected ? "var(--text)" : "var(--text-dim)",
                cursor: "pointer", fontSize: 14, fontWeight: selected ? 600 : 400,
                display: "flex", gap: 12, alignItems: "center",
                transition: "all 0.18s",
                boxShadow: selected ? `0 0 18px ${subject.color}20` : "none",
                transform: selected ? "translateX(2px)" : "none",
              }}>
                <span style={{
                  width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                  background: selected ? subject.color : "rgba(255,255,255,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 800,
                  color: selected ? "#fff" : "var(--text-muted)",
                  transition: "all 0.18s",
                }}>
                  {["A", "B", "C", "D"][oi]}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Nav buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-outline" onClick={() => setIdx(p => p - 1)} disabled={idx === 0}
          style={{ fontSize: 13, padding: "11px 20px" }}>← Back</button>
        <button
          className="btn btn-outline"
          onClick={() => setIdx(p => p + 1)}
          disabled={isLast}
          style={{ fontSize: 13, padding: "11px 20px", color: "var(--text-muted)" }}
        >Skip →</button>
        <button
          className="btn btn-primary"
          onClick={() => { if (isLast) setConfirmOpen(true); else setIdx(p => p + 1); }}
          disabled={answers[idx] === undefined && !isLast}
          style={{ flex: 1, fontSize: 14 }}
        >
          {isLast ? "Submit Test ✓" : "Next →"}
        </button>
      </div>

      <ConfirmModal
        open={confirmOpen}
        icon="📋"
        title="Submit Test?"
        message={`You've answered ${Object.keys(answers).length} of ${questions.length} questions. Once submitted you cannot change your answers.`}
        confirmText="Submit Now"
        cancelText="Go Back"
        onConfirm={() => { setConfirmOpen(false); submitTest(); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

// ── Test Results Screen ───────────────────────────────────────────────────────
function TestResults({ result, subject, onRetake, onBrowse }) {
  const { score, total, answers, questions } = result;  const [aiExplanations, setAiExplanations] = useState({});
  const [loadingAi, setLoadingAi] = useState({});

  const handleExplainAI = async (q) => {
    if (aiExplanations[q.id] || loadingAi[q.id]) return;
    
    setLoadingAi(prev => ({ ...prev, [q.id]: true }));
    try {
      const res = await api.post("/explain-question", {
        question: q.q,
        subject: subject.name,
      });
      setAiExplanations(prev => ({ ...prev, [q.id]: res.data.explanation }));
    } catch (e) {
      setAiExplanations(prev => ({ ...prev, [q.id]: "Failed to get AI explanation. Please check your connection." }));
    } finally {
      setLoadingAi(prev => ({ ...prev, [q.id]: false }));
    }
  };  const pct = Math.round((score / total) * 100);



  return (
    <div>
      {/* Score hero */}
      <div style={{
        background: `linear-gradient(135deg, ${subject.color}15, rgba(6,182,212,0.05))`,
        border: `1px solid ${subject.color}25`,
        borderRadius: 20, padding: "28px", marginBottom: 24, textAlign: "center",
      }}>
        <ScoreRing score={score} total={total} />
        <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
          {[
            ["Correct", score, "#10b981"],
            ["Wrong", total - score, "#ef4444"],
            ["Total", total, "var(--text)"],
          ].map(([label, val, color]) => (
            <div key={label} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12, padding: "10px 20px", minWidth: 80, textAlign: "center",
            }}>
              <div style={{ fontSize: 20, fontWeight: 900, color, fontFamily: "'Sora', sans-serif" }}>{val}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 20, justifyContent: "center" }}>
          <button className="btn btn-outline" onClick={onRetake} style={{ fontSize: 13 }}>🔄 Retake Test</button>
          <button className="btn btn-primary" onClick={onBrowse} style={{ fontSize: 13 }}>📖 Browse Mode</button>
        </div>
      </div>

      {/* Per-question review */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
          Question Review
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {questions.map((q, i) => {
            const userAns = answers[i];
            const isCorrect = userAns === q.correct;
            const unanswered = userAns === undefined;
            const borderColor = unanswered ? "rgba(245,158,11,0.3)" : isCorrect ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)";
            const bgColor    = unanswered ? "rgba(245,158,11,0.04)" : isCorrect ? "rgba(16,185,129,0.05)" : "rgba(239,68,68,0.05)";

            return (
              <div key={q.id} style={{
                background: bgColor, border: `1px solid ${borderColor}`,
                borderRadius: 14, padding: "16px 18px",
              }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    background: unanswered ? "rgba(245,158,11,0.15)" : isCorrect ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                    color: unanswered ? "#f59e0b" : isCorrect ? "#10b981" : "#ef4444",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 800, marginTop: 1,
                  }}>
                    {unanswered ? "?" : isCorrect ? "✓" : "✗"}
                  </span>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", lineHeight: 1.5, margin: 0 }}>{q.q}</p>
                </div>

                <div style={{ paddingLeft: 32, display: "flex", flexDirection: "column", gap: 5, marginBottom: 10 }}>
                  {q.options.map((opt, oi) => {
                    const isUser = userAns === oi;
                    const isCorr = q.correct === oi;
                    if (!isUser && !isCorr) return null;
                    return (
                      <div key={oi} style={{
                        fontSize: 12, padding: "6px 12px", borderRadius: 7,
                        background: isCorr ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.08)",
                        border: `1px solid ${isCorr ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.25)"}`,
                        color: isCorr ? "#6ee7b7" : "#fca5a5",
                        display: "flex", gap: 8, alignItems: "center",
                      }}>
                        <span style={{ fontWeight: 700, flexShrink: 0 }}>{["A","B","C","D"][oi]}.</span>
                        <span style={{ flex: 1 }}>{opt}</span>
                        <span style={{ flexShrink: 0, fontSize: 11 }}>
                          {isCorr && isUser ? "✓ Your answer" : isCorr ? "✓ Correct" : "← Your answer"}
                        </span>
                      </div>
                    );
                  })}
                  {unanswered && (
                    <div style={{
                      fontSize: 12, padding: "6px 12px", borderRadius: 7,
                      background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)",
                      color: "#6ee7b7",
                    }}>
                      ✓ Correct: {q.options[q.correct]}
                    </div>
                  )}
                </div>

                <div style={{ paddingLeft: 32, marginTop: 4 }}>
                  {q.explanation && (
                    <div style={{
                      fontSize: 12, color: "var(--text-muted)",
                      borderLeft: `2px solid ${subject.color}30`, paddingLeft: 10, lineHeight: 1.6,
                      marginBottom: 10,
                    }}>
                      <strong style={{ color: subject.color }}>Short Explanation:</strong> {q.explanation}
                    </div>
                  )}

                  {/* AI Explanation Area */}
                  {aiExplanations[q.id] ? (
                    <div style={{
                      fontSize: 13, color: "var(--text)", background: "rgba(16,185,129,0.05)",
                      border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8, padding: "12px 16px",
                      lineHeight: 1.6, marginTop: 10, display: "flex", gap: 12,
                    }}>
                      <span style={{ fontSize: 18 }}>🤖</span>
                      <div>
                        <strong style={{ color: "#10b981", display: "block", marginBottom: 6 }}>AI Explanation:</strong>
                        {aiExplanations[q.id]}
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                      <button 
                        onClick={() => handleExplainAI(q)}
                        disabled={loadingAi[q.id]}
                        style={{
                          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                          color: "var(--text-muted)", fontSize: 11, fontWeight: 600, padding: "6px 12px",
                          borderRadius: 6, cursor: loadingAi[q.id] ? "not-allowed" : "pointer",
                          display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
                        }}
                      >
                        {loadingAi[q.id] ? "⏳ Generating..." : "✨ Explain with AI"}
                      </button>
                      <button 
                        onClick={() => {
                          const shortQ = q.q.length > 60 ? q.q.substring(0, 60) + "..." : q.q;
                          const query = encodeURIComponent(`Question: ${shortQ}, Correct Answer: ${q.options[q.answer]}. Please explain in detail.`);
                          window.open(`https://chatgpt.com/?q=${query}`, "_blank", "noopener,noreferrer");
                        }}
                        style={{
                          background: "rgba(16, 163, 127, 0.1)", border: "1px solid rgba(16, 163, 127, 0.3)",
                          color: "#10a37f", fontSize: 11, fontWeight: 600, padding: "6px 12px",
                          borderRadius: 6, cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(16, 163, 127, 0.2)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(16, 163, 127, 0.1)"}
                      >
                        Ask ChatGPT ↗
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Test Config screen ────────────────────────────────────────────────────────
function TestConfig({ subject, allQuestions, onStart }) {
  const [count, setCount] = useState(10);
  const [mode, setMode] = useState("random"); // random | sequential

  const maxQ = allQuestions.length;
  const counts = [10, 15, 20, 25, maxQ].filter(c => c <= maxQ);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
          Number of Questions
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {counts.map(c => (
            <button key={c} onClick={() => setCount(c)} style={{
              padding: "10px 22px", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer",
              border: `1px solid ${count === c ? subject.color : "rgba(255,255,255,0.08)"}`,
              background: count === c ? `${subject.color}18` : "rgba(255,255,255,0.02)",
              color: count === c ? subject.color : "var(--text-muted)",
              transition: "all 0.2s",
              boxShadow: count === c ? `0 0 16px ${subject.color}20` : "none",
            }}>
              {c === maxQ ? `All (${c})` : c}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
          Question Order
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {[["random", "🎲 Random"], ["sequential", "📋 Sequential"]].map(([val, label]) => (
            <button key={val} onClick={() => setMode(val)} style={{
              padding: "10px 22px", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer",
              border: `1px solid ${mode === val ? subject.color : "rgba(255,255,255,0.08)"}`,
              background: mode === val ? `${subject.color}18` : "rgba(255,255,255,0.02)",
              color: mode === val ? subject.color : "var(--text-muted)",
              transition: "all 0.2s",
            }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Estimated time */}
      <div style={{
        background: `${subject.color}08`, border: `1px solid ${subject.color}20`,
        borderRadius: 12, padding: "14px 18px", marginBottom: 24,
        display: "flex", gap: 24, fontSize: 13, color: "var(--text-muted)",
      }}>
        <span>📋 <strong style={{ color: "var(--text)" }}>{count}</strong> questions</span>
        <span>⏱ ~<strong style={{ color: "var(--text)" }}>{Math.ceil(count * 1)}</strong> minutes</span>
        <span>🎯 <strong style={{ color: "var(--text)" }}>1 min</strong> per question</span>
      </div>

      <button
        className="btn"
        onClick={() => onStart(count, mode)}
        style={{
          width: "100%", fontSize: 15, padding: "14px",
          background: subject.gradient, border: "none", fontWeight: 800,
          boxShadow: `0 4px 24px ${subject.color}35`,
        }}
      >
        🚀 Start Test
      </button>
    </div>
  );
}

// ── Main SubjectTest page ─────────────────────────────────────────────────────
export default function SubjectTest() {
  const { subject: subjectId } = useParams();
  const navigate = useNavigate();

  const subject = getSubjectMeta(subjectId);
  const allQuestions = QUESTIONS[subjectId] || [];

  const [tab, setTab] = useState("browse");
  // Test states: "config" | "running" | "results"
  const [testState, setTestState] = useState("config");
  const [testQuestions, setTestQuestions] = useState([]);
  const [testResult, setTestResult] = useState(null);

  const handleStartTest = useCallback((count, mode) => {
    const qs = mode === "random" ? shuffle(allQuestions).slice(0, count) : allQuestions.slice(0, count);
    setTestQuestions(qs);
    setTestState("running");
  }, [allQuestions]);

  const handleFinish = useCallback((result) => {
    setTestResult(result);
    setTestState("results");
    if (result && subject) {
      const total = result.total || result.questions?.length || 1;
      const pct = Math.round((result.score / total) * 100);
      logUserActivity({
        type: "subject",
        title: `${subject.name} Concept Quiz`,
        category: "Question Bank",
        score: pct,
        metrics: {
          accuracy: `${pct}%`,
          score: `${result.score}/${total}`,
          subject: subject.shortName || subject.name,
        },
        icon: subject.icon || "📚",
        color: subject.color || "#ec4899",
        badge: pct >= 70 ? "Mastered" : "Completed",
      });
    }
  }, [subject]);

  const handleRetake = useCallback(() => {
    setTestResult(null);
    setTestState("config");
  }, []);

  if (!subject) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 36 }}>🔍</div>
        <p style={{ color: "var(--text-muted)" }}>Subject not found</p>
        <Link to="/question-bank" className="btn btn-primary" style={{ fontSize: 13 }}>← All Subjects</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>

      {/* ── Hero Header ── */}
      <div className="subject-test-header" style={{
        background: `linear-gradient(135deg, ${subject.color}12, rgba(6,182,212,0.04))`,
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Top accent */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: subject.gradient,
        }} />

        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          {/* Breadcrumb & ThemeToggle */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "var(--text-muted)" }}>
              <Link to="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</Link>
              <span>›</span>
              <Link to="/question-bank" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Question Bank</Link>
              <span>›</span>
              <span style={{ color: subject.color, fontWeight: 600 }}>{subject.shortName}</span>
            </div>
            <ThemeToggle />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: `${subject.color}20`, border: `1px solid ${subject.color}35`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0,
            }}>
              {subject.icon}
            </div>
            <div>
              <h1 style={{
                fontSize: "clamp(20px, 3vw, 30px)", fontWeight: 900,
                fontFamily: "'Sora', sans-serif", letterSpacing: "-0.5px", marginBottom: 4,
                color: "var(--text)",
              }}>
                {subject.name}
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: 13, margin: 0 }}>{subject.description}</p>
            </div>
          </div>

          {/* Topic pills */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {subject.topics.map(t => (
              <span key={t} style={{
                fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 99,
                background: `${subject.color}12`, color: subject.color, border: `1px solid ${subject.color}30`,
              }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="subject-test-content" style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* Tab switcher */}
        <div style={{
          display: "flex", gap: 4,
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 14, padding: 4, marginBottom: 28, width: "fit-content",
        }}>
          {[
            { id: "browse", label: "📖 Browse Mode", desc: "Study Q&A" },
            { id: "test",   label: "🎯 Test Mode",   desc: "Timed Quiz" },
          ].map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); if (t.id === "test") setTestState("config"); }} style={{
              padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer",
              border: "none",
              background: tab === t.id ? subject.gradient : "transparent",
              color: tab === t.id ? "#fff" : "var(--text-muted)",
              transition: "all 0.2s",
              boxShadow: tab === t.id ? `0 4px 16px ${subject.color}30` : "none",
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Browse Tab ── */}
        {tab === "browse" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700 }}>
                Study Topics
                <span style={{
                  marginLeft: 10, fontSize: 12, fontWeight: 600, padding: "2px 10px", borderRadius: 99,
                  background: `${subject.color}15`, color: subject.color, border: `1px solid ${subject.color}30`,
                }}>{getSubjectTopics(subject.id).length} concepts</span>
              </h2>
            </div>
            <BrowseMode subject={subject} />
          </div>
        )}


        {/* ── Test Tab ── */}
        {tab === "test" && (
          <div>
            {testState === "config" && (
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Configure Your Test</h2>
                <TestConfig subject={subject} allQuestions={allQuestions} onStart={handleStartTest} />
              </div>
            )}
            {testState === "running" && (
              <TestRunner questions={testQuestions} subject={subject} onFinish={handleFinish} />
            )}
            {testState === "results" && (
              <TestResults
                result={testResult}
                subject={subject}
                onRetake={handleRetake}
                onBrowse={() => setTab("browse")}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
