import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useInterview } from "../context/InterviewContext";
import ThemeToggle from "../components/ThemeToggle";
import ConfirmModal from "../components/ConfirmModal";

// ── Speech helpers ─────────────────────────────────────────────────────────────
const synth = window.speechSynthesis;

function speak(text, onEnd) {
  synth.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = 0.92; utt.pitch = 1.05; utt.volume = 1;
  const voices = synth.getVoices();
  const pref = voices.find(v => /en[-_](US|GB|AU)/i.test(v.lang) && /natural|neural|google|samantha|karen|daniel/i.test(v.name))
    || voices.find(v => /en/i.test(v.lang));
  if (pref) utt.voice = pref;
  utt.onend = onEnd || null;
  synth.speak(utt);
}

function getSR() { return window.SpeechRecognition || window.webkitSpeechRecognition || null; }

// ── Filler words ──────────────────────────────────────────────────────────────
const FILLERS = ["um", "uh", "like", "you know", "basically", "literally", "right", "so", "kind of", "sort of", "actually", "anyway"];
function countFillers(text) {
  if (!text) return 0;
  const lower = text.toLowerCase();
  return FILLERS.reduce((sum, f) => {
    const re = new RegExp(`\\b${f}\\b`, "g");
    return sum + (lower.match(re) || []).length;
  }, 0);
}
function highlightFillers(text) {
  if (!text) return "";
  let result = text;
  FILLERS.forEach(f => {
    const re = new RegExp(`\\b(${f})\\b`, "gi");
    result = result.replace(re, `<mark style="background:rgba(245,158,11,0.25);color:#f59e0b;border-radius:3px;padding:0 2px">$1</mark>`);
  });
  return result;
}

// ── Animated AI equalizer ─────────────────────────────────────────────────────
function AIEqualizer({ active, color = "#06b6d4" }) {
  const bars = 24;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 56, justifyContent: "center" }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div key={i} style={{
          width: 4, borderRadius: 3,
          background: active
            ? `linear-gradient(180deg, ${color}, ${color}44)`
            : "rgba(255,255,255,0.08)",
          height: active ? `${14 + Math.sin(i * 0.9) * 12}px` : "6px",
          animation: active ? `aiEq ${0.45 + (i % 7) * 0.1}s ease-in-out ${i * 0.035}s infinite alternate` : "none",
          transition: "height 0.3s, background 0.3s",
        }} />
      ))}
    </div>
  );
}

// ── Mic pulse ─────────────────────────────────────────────────────────────────
function MicPulse({ active }) {
  return (
    <div style={{ position: "relative", width: 90, height: 90, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {active && [1, 2, 3].map(i => (
        <div key={i} style={{
          position: "absolute", width: 90, height: 90, borderRadius: "50%",
          border: "2px solid rgba(16,185,129,0.4)",
          animation: `micRipple 1.8s ease-out ${i * 0.4}s infinite`,
        }} />
      ))}
      <div style={{
        width: 64, height: 64, borderRadius: "50%",
        background: active
          ? "linear-gradient(135deg, #10b981, #059669)"
          : "rgba(255,255,255,0.05)",
        border: "2px solid " + (active ? "#10b981" : "rgba(255,255,255,0.1)"),
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 24,
        boxShadow: active ? "0 0 28px rgba(16,185,129,0.5)" : "none",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        position: "relative", zIndex: 1,
        cursor: "pointer",
      }}>
        {active ? "🎙" : "🎤"}
      </div>
    </div>
  );
}

// ── User waveform bars ─────────────────────────────────────────────────────────
function UserWave({ active }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 32 }}>
      {Array.from({ length: 16 }).map((_, i) => (
        <div key={i} style={{
          width: 3, borderRadius: 3,
          background: active ? "linear-gradient(180deg,#10b981,#059669)" : "rgba(255,255,255,0.08)",
          height: active ? `${10 + Math.sin(i * 1.1) * 10}px` : "4px",
          animation: active ? `userWave ${0.6 + (i % 5) * 0.08}s ease-in-out ${i * 0.06}s infinite alternate` : "none",
          transition: "height 0.2s",
        }} />
      ))}
    </div>
  );
}

// ── WPM badge ─────────────────────────────────────────────────────────────────
function WpmBadge({ wpm }) {
  const ideal = wpm >= 110 && wpm <= 160;
  const color = wpm === 0 ? "#64748b" : ideal ? "#10b981" : wpm > 160 ? "#ef4444" : "#f59e0b";
  const label = wpm === 0 ? "—" : ideal ? "Ideal pace" : wpm > 160 ? "Too fast" : "Too slow";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "4px 12px", borderRadius: 99,
      background: `${color}12`, border: `1px solid ${color}30`,
      fontSize: 12, fontWeight: 700, color,
    }}>
      ⚡ {wpm > 0 ? `${wpm} wpm` : "—"} · {label}
    </div>
  );
}

export default function VoiceInterview() {
  const navigate = useNavigate();
  const { interviewData, setResult, setQuestions: setCtxQs, setUserAnswers: setCtxAnswers } = useInterview();

  const [questions,  setQuestions]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [idx,        setIdx]        = useState(0);
  const [answers,    setAnswers]    = useState([]);
  const [transcript, setTranscript] = useState("");
  const [status,     setStatus]     = useState("idle");   // idle|speaking|listening|processing
  const [submitting, setSubmitting] = useState(false);
  const [srSupported,setSR]         = useState(true);
  const [elapsed,    setElapsed]    = useState(0);
  const [qSpoken,    setQSpoken]    = useState(false);
  const [totalSecs,  setTotalSecs]  = useState(0);
  const [wpm,        setWpm]        = useState(0);
  const [fillerCount,setFillerCount]= useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const srRef      = useRef(null);
  const answersRef = useRef([]);
  const elapsedRef = useRef(0);
  const wordsRef   = useRef(0);
  const timerRef   = useRef(null);
  const totalRef   = useRef(null);

  useEffect(() => {
    if (!interviewData.role) navigate("/voice", { replace: true });
    if (!getSR()) setSR(false);
  }, []);

  useEffect(() => {
    if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = () => {};
    synth.getVoices();
  }, []);

  useEffect(() => {
    if (!interviewData.role) return;
    const count = interviewData.voiceCount || 8;
    (async () => {
      try {
        const r = await api.post("/generate-questions", {
          role:       interviewData.role,
          experience: interviewData.experience,
          language:   "English",
          difficulty: interviewData.difficulty,
          company:    null,
        });
        const qs = (r.data.questions || []).filter(q => q.type === "text").slice(0, count);
        setQuestions(qs);
        setCtxQs(qs);
        setAnswers(new Array(qs.length).fill(""));
        answersRef.current = new Array(qs.length).fill("");
      } catch {
        const fallback = [
          { id:"v1", type:"text", question:"Tell me about yourself and your background." },
          { id:"v2", type:"text", question:`What are your core strengths as a ${interviewData.role}?` },
          { id:"v3", type:"text", question:"Describe a challenging project you worked on." },
          { id:"v4", type:"text", question:"How do you handle tight deadlines?" },
          { id:"v5", type:"text", question:"Where do you see yourself in 3 years?" },
          { id:"v6", type:"text", question:"Tell me about a time you had to learn something quickly." },
          { id:"v7", type:"text", question:"How do you handle conflicts in a team?" },
          { id:"v8", type:"text", question:"What motivates you to do your best work?" },
        ].slice(0, count);
        setQuestions(fallback); setCtxQs(fallback);
        setAnswers(new Array(fallback.length).fill(""));
        answersRef.current = new Array(fallback.length).fill("");
      } finally { setLoading(false); }
    })();
  }, []);

  // Speak question on change
  useEffect(() => {
    if (loading || !questions.length) return;
    const q = questions[idx];
    if (!q) return;
    setTranscript(""); setQSpoken(false); setElapsed(0);
    setWpm(0); setFillerCount(0);
    elapsedRef.current = 0; wordsRef.current = 0;
    setStatus("speaking");
    speak(`Question ${idx + 1}. ${q.question}`, () => { setQSpoken(true); setStatus("idle"); });
    return () => synth.cancel();
  }, [idx, questions, loading]);

  // Total session timer
  useEffect(() => {
    if (!loading) {
      totalRef.current = setInterval(() => setTotalSecs(p => p + 1), 1000);
    }
    return () => clearInterval(totalRef.current);
  }, [loading]);

  // Per-answer elapsed timer
  useEffect(() => {
    if (status === "listening") {
      timerRef.current = setInterval(() => {
        elapsedRef.current += 1;
        setElapsed(elapsedRef.current);
        if (elapsedRef.current > 0 && wordsRef.current > 0) {
          setWpm(Math.round((wordsRef.current / elapsedRef.current) * 60));
        }
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [status]);

  const startListening = useCallback(() => {
    const SR = getSR(); if (!SR) return;
    synth.cancel();
    const sr = new SR();
    srRef.current = sr;
    sr.lang = "en-US"; sr.continuous = true; sr.interimResults = true;

    let finalText = answersRef.current[idx] || "";
    sr.onstart  = () => setStatus("listening");
    sr.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += (finalText ? " " : "") + t;
        else interim = t;
      }
      const full = finalText + (interim ? " " + interim : "");
      wordsRef.current = full.trim().split(/\s+/).filter(Boolean).length;
      setTranscript(full);
      setFillerCount(countFillers(full));
    };
    sr.onerror = (e) => { if (e.error !== "aborted") setStatus("idle"); };
    sr.onend = () => {
      if (finalText) {
        answersRef.current = answersRef.current.map((a, i) => i === idx ? finalText : a);
        setAnswers([...answersRef.current]);
        setTranscript(finalText);
      }
      setStatus("idle");
    };
    sr.start();
  }, [idx]);

  const stopListening = useCallback(() => {
    srRef.current?.stop(); setStatus("idle");
  }, []);

  const clearAnswer = () => {
    answersRef.current = answersRef.current.map((a, i) => i === idx ? "" : a);
    setAnswers([...answersRef.current]);
    setTranscript(""); setFillerCount(0); setWpm(0);
  };

  const replayQuestion = () => {
    srRef.current?.stop();
    const q = questions[idx];
    setStatus("speaking");
    speak(`Question ${idx + 1}. ${q.question}`, () => setStatus("idle"));
  };

  const goNext = async () => {
    srRef.current?.stop();
    if (idx < questions.length - 1) setIdx(p => p + 1);
    else setConfirmOpen(true);
  };

  const submitAll = async () => {
    setSubmitting(true); setStatus("processing"); synth.cancel();
    const list = questions.map((q, i) => ({
      question_id:   q.id,
      question_type: "text",
      selected:      null,
      text:          answersRef.current[i] || "",
      correct:       null,
      question_text: q.question,
    }));
    setCtxAnswers(list);
    try {
      const resp = await api.post("/evaluate", {
        interview_data: {
          role: interviewData.role, experience: interviewData.experience,
          language: "English", difficulty: interviewData.difficulty, company: null,
        },
        answers: list,
      });
      setResult({ ...resp.data, totalQuestions: questions.length, answered: list.length, isVoice: true });
    } catch {
      setResult({
        score: 0, feedback: "Could not reach server.",
        strengths: [], improvements: [],
        per_question_feedback: [], readiness: null,
        totalQuestions: questions.length, answered: 0, isVoice: true,
      });
    } finally {
      setSubmitting(false);
      navigate("/voice-results");
    }
  };

  const currentQ    = questions[idx];
  const displayText = status === "listening" ? transcript : (answers[idx] || transcript);
  const answeredCount = answers.filter(a => a && a.trim().length > 0).length;
  const isLast      = idx === questions.length - 1;
  const progressPct = questions.length ? (idx / questions.length) * 100 : 0;
  const fmtSecs     = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;

  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:20, background:"var(--bg)" }}>
      <div className="loader" style={{ width:48, height:48, borderWidth:3 }} />
      <p style={{ color:"var(--text-muted)", fontSize:15 }}>Preparing your voice interview…</p>
    </div>
  );

  if (!srSupported) return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, background:"var(--bg)", padding:32, textAlign:"center" }}>
      <div style={{ fontSize:52 }}>🚫</div>
      <h2 style={{ fontSize:22, fontWeight:800, fontFamily:"'Sora', sans-serif" }}>Browser Not Supported</h2>
      <p style={{ color:"var(--text-muted)", maxWidth:420, lineHeight:1.6 }}>
        Voice Interview requires the Web Speech API. Please use <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong>.
      </p>
      <button className="btn btn-primary" onClick={() => navigate("/voice/setup")}>← Go Back</button>
    </div>
  );

  return (
    <>
    <div style={{ minHeight:"100vh", background:"var(--bg)", color:"var(--text)", fontFamily:"'Inter', sans-serif" }}>
      <style>{`
        @keyframes micRipple { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2.2);opacity:0} }
        @keyframes aiEq { from{transform:scaleY(0.3)} to{transform:scaleY(1.7)} }
        @keyframes userWave { from{height:4px} to{height:26px} }
        @keyframes viSlide { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* ── Top bar ── */}
      <div className="voice-interview-topbar" style={{
        position:"sticky", top:0, zIndex:100,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background:"rgba(4,8,15,0.9)", backdropFilter:"blur(20px)",
        borderBottom:"1px solid rgba(255,255,255,0.06)",
        gap:12, flexWrap:"wrap",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
          <span style={{
            fontFamily:"'Sora', sans-serif", fontSize:18, fontWeight:900,
            background:"linear-gradient(135deg, #c4b5fd, #06b6d4, #fcd34d)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          }}>InterviewMate</span>
          <span style={{
            fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:99,
            background:"rgba(16,185,129,0.12)", color:"#10b981",
            border:"1px solid rgba(16,185,129,0.3)", textTransform:"uppercase", letterSpacing:"0.07em",
          }}>🎙 Voice</span>
          <span style={{ fontSize:12, color:"var(--text-muted)" }}>
            {interviewData.role}
          </span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
          <span style={{ fontSize:12, color:"var(--text-muted)" }}>
            ✅ {answeredCount}/{questions.length}
          </span>
          <span style={{
            fontFamily:"'JetBrains Mono', monospace", fontSize:13, fontWeight:700,
            padding:"5px 10px", borderRadius:8,
            background:"rgba(255,255,255,0.04)", color:"var(--text-muted)",
          }}>
            ⏱ {fmtSecs(totalSecs)}
          </span>
          <ThemeToggle />
          <button
            className="btn"
            onClick={() => setConfirmOpen(true)}
            disabled={submitting}
            style={{
              padding:"6px 14px", fontSize:12,
              background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.3)",
              color:"#ef4444",
            }}
          >
            {submitting ? "Submitting…" : "End Session"}
          </button>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div style={{ height:3, background:"rgba(255,255,255,0.04)" }}>
        <div style={{
          height:"100%", borderRadius:"0 2px 2px 0",
          background:"linear-gradient(90deg, #10b981, #06b6d4)",
          width:`${progressPct}%`, transition:"width 0.6s ease",
        }} />
      </div>

      {/* ── Main two-panel layout ── */}
      <div className="voice-interview-layout">

        {/* ── LEFT: AI Interviewer panel ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {/* AI Panel header */}
          <div className="glass" style={{
            padding:"24px 28px", borderRadius:20,
            borderColor: status === "speaking" ? "rgba(6,182,212,0.35)" : "rgba(255,255,255,0.06)",
            boxShadow: status === "speaking" ? "0 0 40px rgba(6,182,212,0.1)" : "none",
            transition:"border-color 0.4s, box-shadow 0.4s",
            position:"relative", overflow:"hidden",
          }}>
            {/* Top accent */}
            <div style={{
              position:"absolute", top:0, left:0, right:0, height:3,
              background:"linear-gradient(90deg, #06b6d4, #7c3aed)",
              borderRadius:"20px 20px 0 0",
            }} />

            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{
                  width:36, height:36, borderRadius:"50%",
                  background:"linear-gradient(135deg, #06b6d4, #7c3aed)",
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:16,
                  boxShadow:"0 4px 16px rgba(6,182,212,0.4)",
                }}>🤖</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:14 }}>AI Interviewer</div>
                  <div style={{ fontSize:11, color:"var(--text-muted)" }}>Powered by Gemini AI</div>
                </div>
              </div>
              <div style={{
                padding:"5px 12px", borderRadius:99, fontSize:11, fontWeight:700,
                background: status === "speaking" ? "rgba(6,182,212,0.12)" : "rgba(255,255,255,0.04)",
                color: status === "speaking" ? "#06b6d4" : "var(--text-muted)",
                border: `1px solid ${status === "speaking" ? "rgba(6,182,212,0.3)" : "rgba(255,255,255,0.06)"}`,
                transition:"all 0.3s",
              }}>
                {status === "speaking" ? "🔊 Speaking…" : status === "idle" ? "⏸ Waiting" : status === "listening" ? "👂 Listening" : "⏳ Processing"}
              </div>
            </div>

            {/* Equalizer */}
            <AIEqualizer active={status === "speaking"} color="#06b6d4" />

            {/* Question counter */}
            <div style={{ marginTop:20, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:12, color:"var(--text-muted)" }}>
                Question <strong style={{ color:"var(--text)" }}>{idx+1}</strong> of {questions.length}
              </span>
              <button
                onClick={replayQuestion}
                disabled={status === "speaking" || submitting}
                style={{
                  background:"rgba(6,182,212,0.08)", border:"1px solid rgba(6,182,212,0.25)",
                  borderRadius:8, color:"#06b6d4", fontSize:11, fontWeight:600,
                  cursor:"pointer", padding:"5px 12px",
                  opacity:(status === "speaking" || submitting) ? 0.4 : 1,
                  transition:"all 0.2s",
                }}
              >🔁 Replay</button>
            </div>
          </div>

          {/* Question card */}
          {currentQ && (
            <div className="glass" style={{
              padding:"24px 28px", borderRadius:20,
              animation:"viSlide 0.4s ease both",
              borderColor:"rgba(6,182,212,0.15)",
            }}>
              <div style={{
                fontSize:10, fontWeight:700, color:"#06b6d4",
                textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:14,
              }}>📋 Current Question</div>
              <p style={{
                fontSize:"clamp(14px, 2vw, 17px)", fontWeight:600,
                lineHeight:1.65, color:"var(--text)", letterSpacing:"-0.1px",
              }}>
                {currentQ.question}
              </p>
            </div>
          )}

          {/* Question navigator dots */}
          <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
            {questions.map((_, i) => {
              const answered = answers[i] && answers[i].trim().length > 0;
              const current  = i === idx;
              return (
                <button key={i} onClick={() => { srRef.current?.stop(); setIdx(i); }} style={{
                  width:32, height:32, borderRadius:8, fontSize:11, fontWeight:700,
                  cursor:"pointer", transition:"all 0.2s", border:"none",
                  background: current  ? "linear-gradient(135deg, #10b981, #059669)"
                             : answered ? "rgba(16,185,129,0.15)"
                             : "rgba(255,255,255,0.04)",
                  color: current  ? "#fff"
                       : answered ? "#10b981"
                       : "rgba(255,255,255,0.3)",
                  boxShadow: current ? "0 4px 12px rgba(16,185,129,0.35)" : "none",
                }}>
                  {i+1}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: You panel ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {/* Mic + controls */}
          <div className="glass" style={{
            padding:"28px", borderRadius:20,
            display:"flex", flexDirection:"column", alignItems:"center", gap:20,
            borderColor: status === "listening" ? "rgba(16,185,129,0.35)" : "rgba(255,255,255,0.06)",
            boxShadow: status === "listening" ? "0 0 50px rgba(16,185,129,0.08)" : "none",
            transition:"border-color 0.4s, box-shadow 0.4s",
            position:"relative", overflow:"hidden",
          }}>
            {/* Top accent */}
            <div style={{
              position:"absolute", top:0, left:0, right:0, height:3,
              background:"linear-gradient(90deg, #10b981, #06b6d4)",
              borderRadius:"20px 20px 0 0",
            }} />

            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ fontWeight:700, fontSize:14 }}>You</div>
              </div>
              {status === "listening" && (
                <div style={{
                  display:"flex", alignItems:"center", gap:6,
                  fontSize:12, color:"#10b981", fontWeight:700,
                }}>
                  <span style={{
                    width:7, height:7, borderRadius:"50%", background:"#10b981",
                    animation:"micRipple 1s ease-out infinite", display:"inline-block",
                  }} />
                  {fmtSecs(elapsed)}
                </div>
              )}
            </div>

            <div onClick={() => {
              if (status === "listening") stopListening();
              else if (status === "idle" && qSpoken) startListening();
            }}>
              <MicPulse active={status === "listening"} />
            </div>

            <UserWave active={status === "listening"} />

            <p style={{ fontSize:13, color:"var(--text-muted)", textAlign:"center", maxWidth:280 }}>
              {status === "speaking"   && "🔊 Listen first, then click the mic to answer."}
              {status === "idle"       && !qSpoken && "Preparing question…"}
              {status === "idle"       && qSpoken  && "Click the mic to start speaking."}
              {status === "listening"  && "🎙 Listening… click Stop when done."}
              {status === "processing" && "⏳ Evaluating…"}
            </p>

            {/* Live metrics */}
            {status === "listening" && (
              <div style={{ display:"flex", gap:10, flexWrap:"wrap", justifyContent:"center" }}>
                <WpmBadge wpm={wpm} />
                <div style={{
                  padding:"4px 12px", borderRadius:99, fontSize:12, fontWeight:700,
                  background: fillerCount > 3 ? "rgba(239,68,68,0.12)" : fillerCount > 0 ? "rgba(245,158,11,0.12)" : "rgba(16,185,129,0.12)",
                  color: fillerCount > 3 ? "#ef4444" : fillerCount > 0 ? "#f59e0b" : "#10b981",
                  border: `1px solid ${fillerCount > 3 ? "rgba(239,68,68,0.3)" : fillerCount > 0 ? "rgba(245,158,11,0.3)" : "rgba(16,185,129,0.3)"}`,
                }}>
                  💬 {fillerCount} filler{fillerCount !== 1 ? "s" : ""}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center" }}>
              {status !== "listening" ? (
                <button
                  className="btn"
                  onClick={startListening}
                  disabled={!qSpoken || status === "speaking" || submitting}
                  style={{
                    background:"linear-gradient(135deg, #10b981, #059669)",
                    color:"#fff", border:"none", minWidth:150,
                    boxShadow:"0 4px 20px rgba(16,185,129,0.4)",
                  }}
                >🎙 Start Speaking</button>
              ) : (
                <button
                  className="btn"
                  onClick={stopListening}
                  style={{
                    minWidth:150,
                    background:"linear-gradient(135deg, #ef4444, #dc2626)",
                    color:"#fff", border:"none",
                    boxShadow:"0 4px 20px rgba(239,68,68,0.4)",
                  }}
                >⏹ Stop Recording</button>
              )}
              {displayText && status !== "listening" && (
                <button className="btn btn-outline" onClick={clearAnswer} style={{ fontSize:13 }}>🗑 Clear</button>
              )}
            </div>
          </div>

          {/* Live transcription */}
          <div className="glass" style={{
            padding:"20px 24px", borderRadius:16, minHeight:120,
            borderColor: displayText ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.06)",
            transition:"border-color 0.3s",
          }}>
            <div style={{
              fontSize:11, fontWeight:700, color:"var(--text-muted)",
              textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10,
              display:"flex", justifyContent:"space-between", alignItems:"center",
            }}>
              <span>📝 Your Answer</span>
              {displayText && (
                <span style={{ fontWeight:500, fontSize:10 }}>
                  {displayText.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              )}
            </div>
            {displayText ? (
              <p
                style={{ fontSize:14, lineHeight:1.75, color:"var(--text-dim)", whiteSpace:"pre-wrap" }}
                dangerouslySetInnerHTML={{ __html: highlightFillers(displayText) + (status === "listening" ? '<span style="display:inline-block;width:2px;height:1em;background:#10b981;margin-left:3px;vertical-align:middle;animation:micRipple 0.8s ease-in-out infinite"></span>' : "") }}
              />
            ) : (
              <p style={{ fontSize:14, color:"rgba(255,255,255,0.2)", fontStyle:"italic" }}>
                Your spoken answer will appear here in real-time…
              </p>
            )}
          </div>

          {/* Navigation */}
          <div style={{ display:"flex", justifyContent:"space-between", gap:12 }}>
            <button
              className="btn btn-outline"
              onClick={() => { srRef.current?.stop(); setIdx(p => p - 1); }}
              disabled={idx === 0 || submitting}
              style={{ minWidth:100 }}
            >← Back</button>
            <button
              className="btn"
              onClick={goNext}
              disabled={submitting || status === "listening"}
              style={{
                flex:1,
                background:"linear-gradient(135deg, #7c3aed, #5b21b6)",
                color:"#fff", border:"none",
                boxShadow:"0 4px 20px rgba(124,58,237,0.35)",
              }}
            >
              {submitting ? "Evaluating…" : isLast ? "Submit ✓" : "Next Question →"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Tips bar ── */}
      <div style={{
        maxWidth:1100, margin:"0 auto 40px", padding:"0 20px",
      }}>
        <div style={{
          padding:"14px 20px", borderRadius:12,
          background:"rgba(16,185,129,0.04)", border:"1px solid rgba(16,185,129,0.12)",
          fontSize:12, color:"var(--text-muted)", lineHeight:1.8,
        }}>
          <strong style={{ color:"#10b981" }}>💡 Tips:</strong>
          {" "}Speak clearly in a quiet room · Click mic after AI finishes · Filler words are highlighted in orange · Re-record any answer by clicking mic again
        </div>
      </div>
    </div>

      <ConfirmModal
        open={confirmOpen}
        icon="🎤"
        title="End Voice Session?"
        message={`You've answered ${answers.filter(a => a && a.trim()).length} of ${questions.length} questions. Your session will be evaluated and you cannot go back.`}
        confirmText="Submit Session"
        cancelText="Keep Going"
        onConfirm={() => { setConfirmOpen(false); submitAll(); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
