import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../context/InterviewContext";

const S = {
  wrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" },
  card: { width: "100%", maxWidth: "520px" },
  header: {
    background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
    borderRadius: "16px 16px 0 0", padding: "32px",
    boxShadow: "0 8px 32px var(--primary-glow)",
  },
  body: { background: "var(--card)", border: "1px solid var(--glass-border)", borderTop: "none", borderRadius: "0 0 16px 16px", padding: "32px" },
  field: { marginBottom: "20px" },
  label: { display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-dim)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" },
};

const fields = [
  { name: "role", label: "Job Role", options: ["Software Engineer","Frontend Developer","Backend Developer","Full Stack Developer","Data Analyst"] },
  { name: "experience", label: "Experience Level", options: ["Fresher","1-2 Years","3-5 Years","5+ Years"] },
  { name: "language", label: "Programming Language", options: ["JavaScript","Python","Java","C++"] },
  { name: "difficulty", label: "Difficulty", options: ["Easy","Medium","Hard"] },
  { name: "duration", label: "Duration", options: ["15 Minutes","30 Minutes","45 Minutes"] },
];

function InterviewSetup() {
  const navigate = useNavigate();
  const { setInterviewData } = useInterview();
  const [form, setForm] = useState({ role:"",experience:"",language:"",difficulty:"",duration:"" });

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const start = (e) => {
    e.preventDefault();
    setInterviewData(p => ({ ...p, ...form }));
    navigate("/interview");
  };

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        <div style={S.header}>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>AI Powered</p>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#fff" }}>Configure Interview</h1>
          <p style={{ color: "rgba(255,255,255,0.65)", marginTop: "6px", fontSize: "14px" }}>35 questions: MCQs, text answers & code snippets</p>
        </div>

        <div style={S.body}>
          <form onSubmit={start}>
            {fields.map(({ name, label, options }) => (
              <div key={name} style={S.field}>
                <label style={S.label}>{label}</label>
                <select name={name} value={form[name]} onChange={handle} required className="select-field">
                  <option value="">Select {label}</option>
                  {options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "8px" }}>
              Start Interview ▶
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default InterviewSetup;