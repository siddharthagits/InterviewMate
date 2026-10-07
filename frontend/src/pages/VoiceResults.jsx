import { AppIcon } from "../components/common/AppIcon";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useInterview } from "../context/InterviewContext";
import ThemeToggle from "../components/ThemeToggle";
import { logUserActivity } from "../utils/activityTracker";
import api from "../api/api";

// ── Helpers ───────────────────────────────────────────────────────────────────
const FILLERS = ["um","uh","like","you know","basically","literally","right","so","kind of","sort of","actually","anyway"];

function countFillers(text) {
  if (!text) return 0;
  const lower = text.toLowerCase();
  return FILLERS.reduce((sum, f) => {
    const re = new RegExp(`\\b${f}\\b`, "g");
    return sum + (lower.match(re) || []).length;
  }, 0);
}

function wordCount(text) {
  return text?.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
}

function commLabel(score) {
  if (score >= 85) return ["Excellent Communicator", "#10b981"];
  if (score >= 70) return ["Strong Communicator",    "#7c3aed"];
  if (score >= 55) return ["Average Communicator",   "#f59e0b"];
  return                  ["Needs Improvement",       "#ef4444"];
}

// ── Animated ring ─────────────────────────────────────────────────────────────
function ScoreRing({ score, color, size = 160, strokeWidth = 10, label }) {
  const [anim, setAnim] = useState(0);
  const radius = (size - strokeWidth * 2) / 2;
  const circ   = 2 * Math.PI * radius;

  useEffect(() => { const t = setTimeout(() => setAnim(score), 200); return () => clearTimeout(t); }, [score]);

  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ position:"relative", width:size, height:size, margin:"0 auto 14px" }}>
        <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ - (anim/100) * circ}
            style={{ transition:"stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)", filter:`drop-shadow(0 0 10px ${color})` }}
          />
        </svg>
        <div style={{
          position:"absolute", inset:0,
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        }}>
          <span style={{ fontSize:size > 120 ? 34 : 22, fontWeight:900, color, fontFamily:"'Sora', sans-serif", letterSpacing:"-1px" }}>{score}</span>
          <span style={{ fontSize:11, color:"var(--text-muted)", fontWeight:600 }}>/100</span>
        </div>
      </div>
      {label && <div style={{ fontSize:16, fontWeight:700, color }}>{label}</div>}
    </div>
  );
}

// ── Animated bar ──────────────────────────────────────────────────────────────
function MetricBar({ label, value, maxVal = 100, color, icon, desc }) {
  const pct = Math.min(100, (value / maxVal) * 100);
  const [anim, setAnim] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnim(pct), 400); return () => clearTimeout(t); }, [pct]);
  return (
    <div style={{ marginBottom:18 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <AppIcon name={icon} size={16} color={color} />
          <span style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{label}</span>
          {desc && <span style={{ fontSize:11, color:"var(--text-muted)" }}>· {desc}</span>}
        </div>
        <span style={{ fontWeight:800, color, fontSize:14 }}>{Math.round(pct)}%</span>
      </div>
      <div style={{ height:8, borderRadius:99, background:"rgba(255,255,255,0.05)", overflow:"hidden" }}>
        <div style={{
          height:"100%", borderRadius:99, width:`${anim}%`,
          background:`linear-gradient(90deg, ${color}, ${color}88)`,
          transition:"width 1.2s cubic-bezier(0.4,0,0.2,1)",
          boxShadow:`0 0 12px ${color}40`,
        }} />
      </div>
    </div>
  );
}

// ── Per-question card ─────────────────────────────────────────────────────────
function QuestionCard({ item, qIdx, userAnswers, questions }) {
  const [open, setOpen] = useState(false);
  const answerMetrics = userAnswers?.[qIdx] || {};
  const userText = answerMetrics.text || "";
  const verdict  = item?.verdict || "Not evaluated";
  const score    = item?.score;
  const fillers  = countFillers(userText);

  const verdictColor = verdict === "Excellent" ? "#10b981"
    : verdict === "Good" ? "#7c3aed"
    : verdict === "Partial" ? "#f59e0b"
    : verdict === "Skipped" ? "var(--text-muted)" : "#ef4444";

  return (
    <div className="glass" style={{
      padding:"18px 20px", borderRadius:16, marginBottom:12,
      borderColor:`${verdictColor}20`, cursor:"pointer",
    }} onClick={() => setOpen(o => !o)}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, flex:1, minWidth:0 }}>
          {/* Score ring small */}
          <div style={{ flexShrink:0 }}>
            {typeof score === "number"
              ? <ScoreRing score={Math.round(score * 10)} color={verdictColor} size={52} strokeWidth={5} />
              : <div style={{
                width:52, height:52, display:"grid", placeItems:"center",
                border:`3px solid var(--border)`, borderRadius:"50%",
                color:"var(--text-muted)", fontSize:11, fontWeight:700,
              }}>N/A</div>}
          </div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:4, color:"var(--text)" }}>
              Q{qIdx+1}. {questions[qIdx]?.question?.slice(0,72) || "Question"}
              {(questions[qIdx]?.question?.length || 0) > 72 ? "…" : ""}
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <span style={{
                fontSize:11, padding:"2px 9px", borderRadius:99, fontWeight:700,
                background:`${verdictColor}12`, color:verdictColor,
                border:`1px solid ${verdictColor}25`,
              }}>{verdict}</span>
              <span style={{ fontSize:11, color:"var(--text-muted)" }}>
                {answerMetrics.wpm == null ? "Pace not measured" : `${answerMetrics.wpm} wpm`}
              </span>
              {userText && <span style={{ fontSize:11, color:fillers > 0 ? "#f59e0b" : "var(--text-muted)" }}>
                {fillers} filler{fillers !== 1 ? "s" : ""}
              </span>}
            </div>
          </div>
        </div>
        <span style={{ color:"var(--accent)", fontSize:11, fontWeight:700, flexShrink:0 }}>
          {open ? "Hide feedback" : "Review answer"}
        </span>
      </div>

      {open && (
        <div style={{ marginTop:16, borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:16, display:"flex", flexDirection:"column", gap:14 }}>
          {userText && (
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Your Answer</div>
              <p style={{ fontSize:13, lineHeight:1.75, color:"var(--text-dim)" }}>{userText}</p>
            </div>
          )}
          {(item?.issue || item?.why_weak) && (
            <div style={{ padding:"10px 14px", borderRadius:10, background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.15)", fontSize:13, color:"var(--text-muted)", lineHeight:1.7 }}>
              <strong style={{ color:"#f59e0b" }}>What needs work:</strong> {item.issue || item.why_weak}
            </div>
          )}
          {item?.what_worked && (
            <div style={{ padding:"10px 14px", borderRadius:10, background:"rgba(16,185,129,0.05)", border:"1px solid rgba(16,185,129,0.15)", fontSize:13, color:"var(--text-muted)", lineHeight:1.7 }}>
              <strong style={{ color:"#10b981" }}>What worked:</strong> {item.what_worked}
            </div>
          )}
          {(item?.suggested_answer || item?.ideal_answer) && (
            <div style={{ padding:"10px 14px", borderRadius:10, background:"rgba(16,185,129,0.05)", border:"1px solid rgba(16,185,129,0.15)", fontSize:13, color:"var(--text-muted)", lineHeight:1.7 }}>
              <strong style={{ color:"#10b981" }}>Example stronger answer (personalize it):</strong>{" "}
              {item.suggested_answer || item.ideal_answer}
            </div>
          )}
          {(item?.missed_points?.length > 0 || item?.missed_keywords?.length > 0) && (
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Points to include</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {(item.missed_points || item.missed_keywords).map((kw, i) => (
                  <span key={i} style={{
                    fontSize:12, padding:"3px 10px", borderRadius:99,
                    background:"rgba(239,68,68,0.08)", color:"#ef4444",
                    border:"1px solid rgba(239,68,68,0.2)", fontFamily:"'JetBrains Mono',monospace",
                  }}>{kw}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function VoiceResults() {
  const { result, setResult, questions, userAnswers, interviewData } = useInterview();
  const reportAnswers = userAnswers || [];
  const score = result?.score;
  const perQ  = result?.per_question_feedback || [];
  const dimensions = result?.dimensions;
  const [retrying, setRetrying] = useState(false);

  // Speaking pace is based on recorded speech duration, not an estimate from transcript length.
  const allAnswers = reportAnswers.map(a => a?.text || "");
  const totalFillers = allAnswers.reduce((sum, t) => sum + countFillers(t), 0);
  const totalSpokenWords = reportAnswers.reduce((sum, answer) => sum + wordCount(answer?.text || ""), 0);
  const totalSpeechSeconds = reportAnswers.reduce((sum, answer) => sum + (answer?.durationSeconds || 0), 0);
  const avgWpm = totalSpeechSeconds > 0
    ? Math.round(totalSpokenWords / totalSpeechSeconds * 60)
    : null;
  const answeredCount = allAnswers.filter(t => t && t.trim()).length;

  const [label, labelColor] = typeof score === "number"
    ? commLabel(score)
    : ["Not evaluated", "var(--text-muted)"];

  const retryEvaluation = async () => {
    setRetrying(true);
    try {
      const answers = (questions || []).map((question, index) => ({
        question_id: index + 1,
        question_type: "text",
        selected: null,
        text: reportAnswers[index]?.text || "",
        correct: null,
        question_text: question.question,
      }));
      const response = await api.post("/evaluate-voice", {
        interview_data: {
          role: interviewData.role,
          experience: interviewData.experience,
          language: "English",
          difficulty: interviewData.difficulty,
          company: null,
        },
        answers,
      });
      setResult({
        ...response.data,
        totalQuestions: questions.length,
        answered: answeredCount,
        isVoice: true,
      });
    } catch (error) {
      setResult(previous => ({
        ...previous,
        evaluation_status: "unavailable",
        evaluation_error: error.response?.data?.detail || error.message || "Could not reach the evaluation service.",
      }));
    } finally {
      setRetrying(false);
    }
  };

  useEffect(() => {
    if (result?.evaluation_status === "evaluated" && typeof result.score === "number") {
      logUserActivity({
        type: "voice",
        title: `${interviewData?.role || "AI"} Voice Interview`,
        category: "Voice AI",
        score: score,
        metrics: {
          clarity: `${dimensions?.clarity ?? "N/A"}%`,
          pacing: avgWpm === null ? "Not measured" : `${avgWpm} WPM`,
          fillers: `${totalFillers} detected`,
        },
        icon: "mic",
        color: "#06b6d4",
        badge: score >= 75 ? "Strong" : "Completed",
      });
    }
  }, [result, score, dimensions, avgWpm, totalFillers, interviewData?.role]);

  if (!result) return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:20, background:"var(--bg)", padding:32, textAlign:"center" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><AppIcon name="mic" size={48} color="#06b6d4" /></div>
      <h2 style={{ fontSize:22, fontWeight:800, fontFamily:"'Sora', sans-serif" }}>No Voice Results Yet</h2>
      <p style={{ color:"var(--text-muted)", maxWidth:400 }}>Complete a voice interview session to see your results here.</p>
      <Link to="/voice" className="btn btn-primary">Start Voice Interview →</Link>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", color:"var(--text)", padding:"40px 20px 60px", position:"relative" }}>
      {/* Top right Theme Toggle */}
      <div style={{ position: "fixed", top: 20, right: 24, zIndex: 50 }}>
        <ThemeToggle />
      </div>

      <style>{`
        @keyframes vrFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div style={{ maxWidth:900, margin:"0 auto" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:48, animation:"vrFadeUp 0.5s ease both" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            marginBottom: 16,
            fontSize: 12.5, fontWeight: 800, color: "#10b981",
            letterSpacing: "0.16em", textTransform: "uppercase",
          }}>
            <span style={{ width: 22, height: 1.5, background: "linear-gradient(90deg, transparent, #10b981)", display: "inline-block" }} />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><AppIcon name="mic" size={13} color="#10b981" /> Voice Interview Complete</span>
            <span style={{ width: 22, height: 1.5, background: "linear-gradient(90deg, #10b981, transparent)", display: "inline-block" }} />
          </div>
          <h1 style={{
            fontSize:"clamp(26px, 4vw, 42px)", fontWeight:900,
            letterSpacing:"-1px", fontFamily:"'Sora', sans-serif", marginBottom:8,
          }}>Your Communication Report</h1>
          <p style={{ color:"var(--text-muted)", fontSize:14 }}>
            {interviewData.role} · {answeredCount}/{questions?.length || perQ.length} answered
          </p>
          <p style={{ color:"var(--text-muted)", fontSize:12, marginTop:8 }}>
            Scores assess transcript clarity, relevance, and structure. Pace is calculated from recorded speaking time.
          </p>
        </div>

        {result.evaluation_status === "unavailable" && (
          <div className="glass" role="alert" style={{
            padding:"20px 24px", marginBottom:24, borderRadius:16,
            borderColor:"rgba(239,68,68,0.35)",
          }}>
            <strong style={{ color:"#ef4444" }}>AI evaluation unavailable</strong>
            <p style={{ color:"var(--text-muted)", margin:"8px 0 14px", lineHeight:1.6 }}>
              {result.evaluation_error || "The answers were saved, but no evaluation was produced. Your report will not show guessed scores."}
            </p>
            <button className="btn btn-primary" onClick={retryEvaluation} disabled={retrying}>
              {retrying ? "Retrying evaluation…" : "Retry evaluation"}
            </button>
          </div>
        )}

        {result.evaluation_status === "not_evaluated" && (
          <div className="glass" role="status" style={{
            padding:"20px 24px", marginBottom:24, borderRadius:16,
            borderColor:"var(--border-hover)",
          }}>
            <strong>No answers to evaluate</strong>
            <p style={{ color:"var(--text-muted)", margin:"8px 0 0", lineHeight:1.6 }}>
              Record at least one answer to receive a communication score, specific feedback, and a stronger example response.
            </p>
          </div>
        )}

        {/* Score ring + label */}
        {typeof score === "number" && <div className="glass" style={{
          padding:"40px 32px", borderRadius:24, textAlign:"center", marginBottom:24,
          borderColor:"var(--accent-border)",
          boxShadow:"0 0 60px var(--accent-soft)",
          animation:"vrFadeUp 0.5s ease 0.1s both",
        }}>
          <ScoreRing score={score} color={labelColor} size={180} strokeWidth={12} label={label} />
          <div style={{ marginTop:24, display:"flex", gap:24, justifyContent:"center", flexWrap:"wrap" }}>
            {[
              { label:"Questions", value:`${answeredCount}/${questions?.length || perQ.length} answered`, color:"var(--accent)" },
              { label:"Filler Words", value:answeredCount ? `${totalFillers} detected` : "Not measured", color: totalFillers > 5 ? "#ef4444" : "var(--accent)" },
              { label:"Observed Pace", value:avgWpm === null ? "Not measured" : `${avgWpm} wpm`, color:"var(--accent)" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ textAlign:"center" }}>
                <div style={{ fontWeight:800, fontSize:20, color, fontFamily:"'Sora', sans-serif" }}>{value}</div>
                <div style={{ fontSize:12, color:"var(--text-muted)", marginTop:2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>}

        {/* Dimensions grid */}
        {dimensions && <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24 }}>
          {[
            { label:"Clarity", icon:"sparkles", value:dimensions.clarity, color:"var(--accent)", desc:"How clearly ideas are explained" },
            { label:"Relevance", icon:"target", value:dimensions.relevance, color:"var(--accent)", desc:"How directly answers address each question" },
            { label:"Structure", icon:"layers", value:dimensions.structure, color:"var(--accent)", desc:"How logically answers are organized" },
          ].map((m, idx) => (
            <div key={m.label} className="glass" style={{
              padding:"20px 24px", borderRadius:16,
              animation:`vrFadeUp 0.5s ease ${0.15 + idx * 0.08}s both`,
              gridColumn: idx === 2 ? "span 2" : "span 1",
            }}>
              <MetricBar {...m} />
            </div>
          ))}
        </div>}

        {/* AI feedback */}
        {result.feedback && (
          <div className="glass" style={{
            padding:"22px 26px", marginBottom:20, borderRadius:16,
            borderColor:"rgba(16,185,129,0.15)",
            animation:"vrFadeUp 0.5s ease 0.55s both", position:"relative", overflow:"hidden",
          }}>
            <div style={{
              position:"absolute", left:0, top:0, bottom:0, width:3,
              background:"var(--accent-gradient)",
              borderRadius:"20px 0 0 20px",
            }} />
            <div style={{ fontSize:12, fontWeight:700, color:"#10b981", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><AppIcon name="bot" size={14} color="var(--cyan)" /> AI Feedback</span>
            </div>
            <p style={{ color:"var(--text-dim)", fontSize:14, lineHeight:1.8 }}>{result.feedback}</p>
          </div>
        )}

        {/* Strengths + Improvements */}
        {(result.strengths?.length > 0 || result.improvements?.length > 0) && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24 }}>
            {result.strengths?.length > 0 && (
              <div className="glass" style={{ padding:"20px 24px", borderRadius:16, borderColor:"rgba(16,185,129,0.15)", animation:"vrFadeUp 0.5s ease 0.6s both" }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#10b981", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><AppIcon name="check-circle" size={13} color="#10b981" /> Strengths</span></div>
                <ul style={{ paddingLeft:0, listStyle:"none", display:"flex", flexDirection:"column", gap:8 }}>
                  {result.strengths.map((s, i) => (
                    <li key={i} style={{ fontSize:13, color:"var(--text-dim)", display:"flex", alignItems:"flex-start", gap:8, lineHeight:1.6 }}>
                      <span style={{ color:"#10b981", flexShrink:0, marginTop:2 }}>▸</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.improvements?.length > 0 && (
              <div className="glass" style={{ padding:"20px 24px", borderRadius:16, borderColor:"rgba(245,158,11,0.15)", animation:"vrFadeUp 0.5s ease 0.65s both" }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#f59e0b", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><AppIcon name="alert-triangle" size={13} color="#f59e0b" /> To Improve</span></div>
                <ul style={{ paddingLeft:0, listStyle:"none", display:"flex", flexDirection:"column", gap:8 }}>
                  {result.improvements.map((s, i) => (
                    <li key={i} style={{ fontSize:13, color:"var(--text-dim)", display:"flex", alignItems:"flex-start", gap:8, lineHeight:1.6 }}>
                      <span style={{ color:"#f59e0b", flexShrink:0, marginTop:2 }}>▸</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Per-question breakdown */}
        {perQ.length > 0 && (
          <div style={{ marginBottom:32, animation:"vrFadeUp 0.5s ease 0.7s both" }}>
            <h2 style={{ fontSize:16, fontWeight:700, marginBottom:16, color:"var(--text-dim)", textTransform:"uppercase", letterSpacing:"0.08em" }}>
              Question Breakdown
            </h2>
            {perQ.map((item, i) => (
              <QuestionCard key={i} item={item} qIdx={i} userAnswers={userAnswers} questions={questions || []} />
            ))}
          </div>
        )}

        {/* CTAs */}
        <div className="glass" style={{
          padding:"24px 28px", borderRadius:20, marginBottom:20,
          display:"flex", justifyContent:"space-between", alignItems:"center",
          flexWrap:"wrap", gap:16,
          background:"linear-gradient(135deg, rgba(16,185,129,0.06), rgba(6,182,212,0.03))",
          border:"1px solid rgba(16,185,129,0.15)",
          animation:"vrFadeUp 0.5s ease 0.75s both",
        }}>
          <div>
            <p style={{ fontWeight:800, fontSize:17 }}>Ready to improve?</p>
            <p style={{ color:"var(--text-muted)", fontSize:13, marginTop:4 }}>
              Practice makes perfect. Try again with a different difficulty.
            </p>
          </div>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <Link to="/voice/setup" className="btn" style={{
              background:"linear-gradient(135deg, #10b981, #059669)",
              color:"#fff", border:"none",
              boxShadow:"0 4px 20px rgba(16,185,129,0.35)",
              padding:"11px 24px", fontSize:14,
            display: "inline-flex", alignItems: "center", gap: 6 }}><AppIcon name="rotate-ccw" size={14} /> Try Again</Link>
            <Link to="/setup" className="btn btn-outline" style={{ padding:"11px 22px", fontSize:14 }}>
              Text Interview →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
