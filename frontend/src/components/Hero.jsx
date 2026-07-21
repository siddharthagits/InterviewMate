import { useNavigate } from "react-router-dom";

function Hero() {
  const nav = useNavigate();
  return (
    <section style={{ minHeight: "88vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "60px 24px" }}>
      <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(99,102,241,0.12)", border:"1px solid var(--border)", borderRadius:99, padding:"6px 16px", marginBottom:28, fontSize:13, color:"var(--primary-light)" }}>
        ✨ AI-Powered Interview Practice
      </div>

      <h1 style={{ fontSize:"clamp(40px,6vw,72px)", fontWeight:900, lineHeight:1.1, maxWidth:800 }}>
        Ace Your Next{" "}
        <span className="grad-text">Interview</span>
        <br />with AI Coaching
      </h1>

      <p style={{ marginTop:24, maxWidth:560, color:"var(--text-muted)", fontSize:18, lineHeight:1.7 }}>
        Practice with 35 adaptive questions — MCQs, code output challenges, and in-depth answers — then get instant AI feedback on your performance.
      </p>

      <div style={{ marginTop:40, display:"flex", gap:14, flexWrap:"wrap", justifyContent:"center" }}>
        <button className="btn btn-primary" style={{ fontSize:16, padding:"14px 36px" }} onClick={() => nav("/setup")}>
          Start Free Interview ▶
        </button>
        <button className="btn btn-outline" style={{ fontSize:16, padding:"14px 36px" }} onClick={() => nav("/dashboard")}>
          View Dashboard
        </button>
      </div>

      <div style={{ marginTop:60, display:"flex", gap:40, flexWrap:"wrap", justifyContent:"center" }}>
        {[["35", "Questions Per Interview"],["3", "Question Types"],["AI","Instant Evaluation"]].map(([v,l]) => (
          <div key={l} style={{ textAlign:"center" }}>
            <div className="grad-text" style={{ fontSize:32, fontWeight:900 }}>{v}</div>
            <div style={{ fontSize:13, color:"var(--text-muted)", marginTop:4 }}>{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
export default Hero;