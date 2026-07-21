const feats = [
  { icon:"🔘", title:"25 MCQ Questions", desc:"Role and difficulty-specific multiple choice questions to test your theoretical knowledge.", badge:"Auto-scored" },
  { icon:"📝", title:"5 Text Answers", desc:"In-depth questions where you type detailed answers, evaluated by Gemini AI.", badge:"AI Graded" },
  { icon:"💻", title:"5 Code Snippets", desc:"Read real code and pick the correct output from 4 options — tests practical debugging.", badge:"Auto-scored" },
  { icon:"⏱", title:"Timed Sessions", desc:"Choose 15, 30, or 45 minute sessions with a live countdown timer.", badge:"15–45 min" },
  { icon:"📊", title:"Instant Feedback", desc:"Get score breakdown for MCQ, code, and text sections with strengths & improvements.", badge:"Instant" },
  { icon:"🎯", title:"Role-Specific", desc:"Questions tailored to your role, language, experience level and difficulty preference.", badge:"Adaptive" },
];

function Features() {
  return (
    <section style={{ padding: "80px 32px", background: "rgba(13,21,38,0.85)", backdropFilter: "blur(2px)" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <h2 style={{ fontSize:40, fontWeight:900 }}>
            Everything you need to <span className="grad-text">prepare</span>
          </h2>
          <p style={{ color:"var(--text-muted)", marginTop:12, fontSize:16 }}>
            A complete interview practice platform with AI evaluation
          </p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:20 }}>
          {feats.map(({ icon,title,desc,badge }) => (
            <div key={title} className="stat-card" style={{ padding:"28px" }}>
              <div style={{ fontSize:32, marginBottom:16 }}>{icon}</div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <h3 style={{ fontSize:17, fontWeight:700 }}>{title}</h3>
                <span className="badge badge-mcq" style={{ flexShrink:0, marginLeft:8 }}>{badge}</span>
              </div>
              <p style={{ color:"var(--text-muted)", fontSize:14, lineHeight:1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default Features;