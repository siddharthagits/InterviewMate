import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../context/InterviewContext";

// ── Company catalogue ─────────────────────────────────────────────────────────
const COMPANIES = [
  {
    id: "tcs",
    name: "TCS",
    fullName: "Tata Consultancy Services",
    badge: "NQT / Ninja",
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    description: "Mirrors TCS NQT and Ninja Coding patterns — aptitude, verbal reasoning, programming logic, and core CS fundamentals.",
    tags: ["Aptitude", "Core CS", "Logical Reasoning", "Basic Coding"],
    difficulty: "Easy–Medium",
    questions: 35,
    duration: "45 Minutes",
    pattern: "TCS NQT / Ninja style questions tuned for TCS hiring assessments.",
  },
  {
    id: "wipro",
    name: "Wipro",
    fullName: "Wipro Limited",
    badge: "Elite / WILP",
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    description: "Focuses on Wipro Elite and WILP interview style — DS, algorithms, OOP, and scenario-based problem solving.",
    tags: ["Data Structures", "OOP", "Problem Solving", "Scenario-based"],
    difficulty: "Medium",
    questions: 35,
    duration: "45 Minutes",
    pattern: "Wipro Elite / WILP style questions.",
  },
  {
    id: "infosys",
    name: "Infosys",
    fullName: "Infosys Limited",
    badge: "InfyTQ / SP",
    color: "#06b6d4",
    gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
    description: "Aligned with InfyTQ and Specialist Programmer interviews — logical reasoning, verbal ability, core programming.",
    tags: ["InfyTQ", "Verbal", "Logical", "Core Programming"],
    difficulty: "Easy–Medium",
    questions: 35,
    duration: "30 Minutes",
    pattern: "Infosys InfyTQ / Specialist Programmer style.",
  },
  {
    id: "google",
    name: "Google",
    fullName: "Google LLC",
    badge: "FAANG L3–L5",
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    description: "FAANG-level interview — algorithmic complexity, system design scalability, and abstract problem-solving at L3–L5 level.",
    tags: ["Algorithms", "System Design", "Complexity", "Abstract Thinking"],
    difficulty: "Hard",
    questions: 35,
    duration: "45 Minutes",
    pattern: "Google FAANG L3–L5 interview style.",
  },
  {
    id: "amazon",
    name: "Amazon",
    fullName: "Amazon.com Inc.",
    badge: "Leadership Principles",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    description: "Emphasizes Amazon's 16 Leadership Principles — customer obsession, ownership, system design, and behavioral depth.",
    tags: ["Leadership Principles", "Behavioral", "System Design", "Customer Focus"],
    difficulty: "Medium–Hard",
    questions: 35,
    duration: "45 Minutes",
    pattern: "Amazon Leadership Principles interview style.",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    fullName: "Microsoft Corporation",
    badge: "Loop Interview",
    color: "#7c3aed",
    gradient: "linear-gradient(135deg, #7c3aed, #5b21b6)",
    description: "Microsoft Loop interviews — OOP design, system design patterns, coding best practices, and structured problem solving.",
    tags: ["OOP Design", "Coding Patterns", "System Design", "Structured"],
    difficulty: "Medium–Hard",
    questions: 35,
    duration: "45 Minutes",
    pattern: "Microsoft Loop interview style.",
  },
  {
    id: "meta",
    name: "Meta",
    fullName: "Meta Platforms Inc.",
    badge: "E3–E5",
    color: "#ec4899",
    gradient: "linear-gradient(135deg, #ec4899, #db2777)",
    description: "Meta loop style — product thinking, large-scale distributed systems, coding efficiency at E3–E5 levels.",
    tags: ["Product Thinking", "Distributed Systems", "Coding Efficiency", "E3-E5"],
    difficulty: "Hard",
    questions: 35,
    duration: "45 Minutes",
    pattern: "Meta E3–E5 loop style interview.",
  },
  {
    id: "startup",
    name: "Startup",
    fullName: "Early-Stage Startup",
    badge: "Agile / Full-Stack",
    color: "#ef4444",
    gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
    description: "Practical startup assessment — full-stack thinking, product intuition, independent execution, and shipping fast.",
    tags: ["Full-Stack", "Product Intuition", "Independent Thinking", "Practical"],
    difficulty: "Medium",
    questions: 35,
    duration: "30 Minutes",
    pattern: "Startup full-stack practical interview style.",
  },
];

const LANGUAGES = [
  { value: "JavaScript", icon: "JS" },
  { value: "Python",     icon: "Py" },
  { value: "Java",       icon: "☕" },
  { value: "C++",        icon: "C++" },
];

const EXPERIENCES = [
  { value: "Fresher",   icon: "🌱" },
  { value: "1-2 Years", icon: "🚀" },
  { value: "3-5 Years", icon: "💼" },
  { value: "5+ Years",  icon: "🏆" },
];

// ── Company card ──────────────────────────────────────────────────────────────
function CompanyCard({ company, onSelect }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onSelect(company)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `${company.color}0d` : "rgba(8,13,26,0.95)",
        border: `1px solid ${hovered ? company.color + "50" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 20,
        padding: "24px 22px",
        cursor: "pointer",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? `0 20px 50px ${company.color}20` : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top gradient line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: company.gradient,
        borderRadius: "20px 20px 0 0",
        opacity: hovered ? 1 : 0.4,
        transition: "opacity 0.25s",
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        {/* Company name block */}
        <div>
          <div style={{
            fontSize: 22, fontWeight: 900,
            fontFamily: "'Sora', sans-serif",
            color: hovered ? company.color : "#f1f5f9",
            letterSpacing: "-0.5px",
            transition: "color 0.25s",
            marginBottom: 2,
          }}>
            {company.name}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>
            {company.fullName}
          </div>
        </div>

        {/* Badge */}
        <span style={{
          fontSize: 9, fontWeight: 700, padding: "4px 10px",
          borderRadius: 99, flexShrink: 0, marginLeft: 10,
          background: `${company.color}18`,
          color: company.color,
          border: `1px solid ${company.color}40`,
          textTransform: "uppercase", letterSpacing: "0.07em",
          whiteSpace: "nowrap",
        }}>
          {company.badge}
        </span>
      </div>

      {/* Description */}
      <p style={{
        fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7,
        marginBottom: 16, display: "-webkit-box",
        WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>
        {company.description}
      </p>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}>
        {company.tags.slice(0, 3).map(tag => (
          <span key={tag} style={{
            fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 99,
            background: `${company.color}10`, color: company.color,
            border: `1px solid ${company.color}30`,
          }}>{tag}</span>
        ))}
      </div>

      {/* Meta row */}
      <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--text-muted)" }}>
        <span>📋 {company.questions} Qs</span>
        <span>⏱ {company.duration}</span>
        <span style={{ marginLeft: "auto", color: company.color, fontWeight: 600 }}>
          {company.difficulty}
        </span>
      </div>

      {/* Hover CTA */}
      {hovered && (
        <div style={{
          marginTop: 14,
          padding: "8px 0",
          textAlign: "center",
          borderTop: `1px solid ${company.color}20`,
          fontSize: 13, fontWeight: 700,
          color: company.color,
        }}>
          Start {company.name} Assessment →
        </div>
      )}
    </div>
  );
}

// ── Assessment Config Modal ───────────────────────────────────────────────────
function AssessmentConfig({ company, onStart, onBack }) {
  const [language,   setLanguage]   = useState("");
  const [experience, setExperience] = useState("");

  const canStart = !!language && !!experience;

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", padding: "40px 20px", background: "var(--bg)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Glow */}
      <div style={{
        position: "absolute", top: "20%", left: "50%",
        transform: "translateX(-50%)",
        width: 400, height: 400, borderRadius: "50%",
        background: `radial-gradient(circle, ${company.color}18 0%, transparent 70%)`,
        filter: "blur(50px)", pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 520, position: "relative" }}>

        {/* Back button */}
        <button
          onClick={onBack}
          style={{
            background: "transparent", border: "none", cursor: "pointer",
            color: "var(--text-muted)", fontSize: 14, marginBottom: 28,
            display: "flex", alignItems: "center", gap: 6, padding: 0,
            transition: "color 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
        >
          ← Back to Companies
        </button>

        {/* Company header */}
        <div style={{
          background: company.gradient, borderRadius: "20px 20px 0 0",
          padding: "28px 32px", position: "relative", overflow: "hidden",
          boxShadow: `0 8px 40px ${company.color}40`,
        }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 80% 0%, rgba(255,255,255,0.1) 0%, transparent 60%)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
              Company Assessment
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", fontFamily: "'Sora', sans-serif", letterSpacing: "-0.5px", marginBottom: 4 }}>
              {company.name}
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
              {company.pattern}
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 14, fontSize: 12, color: "rgba(255,255,255,0.65)" }}>
              <span>📋 {company.questions} Questions</span>
              <span>⏱ {company.duration}</span>
              <span>⚡ {company.difficulty}</span>
            </div>
          </div>
        </div>

        {/* Config body */}
        <div className="glass" style={{ borderRadius: "0 0 20px 20px", borderTop: "none", padding: "28px 32px" }}>

          {/* Language */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
              Programming Language
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {LANGUAGES.map(({ value, icon }) => (
                <button
                  key={value}
                  className={`option-pill ${language === value ? "selected" : ""}`}
                  onClick={() => setLanguage(value)}
                  type="button"
                  style={{ fontSize: 14 }}
                >
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 13 }}>{icon}</span>
                  {value}
                </button>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
              Experience Level
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {EXPERIENCES.map(({ value, icon }) => (
                <button
                  key={value}
                  className={`option-pill ${experience === value ? "selected" : ""}`}
                  onClick={() => setExperience(value)}
                  type="button"
                  style={{ fontSize: 14 }}
                >
                  <span style={{ fontSize: 15 }}>{icon}</span>
                  {value}
                </button>
              ))}
            </div>
          </div>

          <button
            className="btn btn-gold"
            style={{ width: "100%", fontSize: 15, padding: "14px", opacity: canStart ? 1 : 0.4 }}
            disabled={!canStart}
            onClick={() => onStart({ language, experience })}
          >
            🚀 Start {company.name} Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Company Assessment page ──────────────────────────────────────────────
export default function CompanyAssessment() {
  const navigate = useNavigate();
  const { setInterviewData } = useInterview();
  const [selected, setSelected] = useState(null);
  const [search, setSearch]     = useState("");

  const filtered = COMPANIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.badge.toLowerCase().includes(search.toLowerCase()) ||
    c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const handleStart = ({ language, experience }) => {
    setInterviewData({
      role:         "Software Engineer",
      experience,
      language,
      difficulty:   selected.id === "google" || selected.id === "meta" ? "Hard"
                  : selected.id === "tcs"    || selected.id === "infosys" ? "Easy" : "Medium",
      duration:     selected.duration,
      company:      selected.name,
      pressureMode: false,
      answers:      [],
    });
    navigate("/interview");
  };

  if (selected) {
    return (
      <AssessmentConfig
        company={selected}
        onStart={handleStart}
        onBack={() => setSelected(null)}
      />
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>

      {/* Hero header */}
      <div style={{
        background: "linear-gradient(180deg, rgba(124,58,237,0.08) 0%, transparent 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "48px 40px 40px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Glow */}
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 600, height: 2,
          background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.5), rgba(245,158,11,0.3), transparent)",
        }} />

        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "transparent", border: "none", color: "var(--text-muted)",
              fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center",
              gap: 6, marginBottom: 28, padding: 0, transition: "color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--violet-light)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
          >
            ← Back to Home
          </button>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
            <div>
              <div className="glow-pill" style={{ marginBottom: 16 }}>
                🏢 Company Assessments
              </div>
              <h1 style={{
                fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 900,
                fontFamily: "'Sora', sans-serif", letterSpacing: "-1px",
                marginBottom: 10, lineHeight: 1.1,
              }}>
                Practice for a{" "}
                <span className="grad-text">Specific Company</span>
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.7, maxWidth: 520 }}>
                Questions tuned to each company's actual interview patterns — difficulty, style, and focus areas tailored to help you pass their specific process.
              </p>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { val: COMPANIES.length, label: "Companies" },
                { val: "35", label: "Questions each" },
                { val: "AI", label: "Tailored" },
              ].map(({ val, label }) => (
                <div key={label} style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 14, padding: "14px 20px", textAlign: "center", minWidth: 80,
                }}>
                  <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Sora', sans-serif", background: "linear-gradient(135deg, #c4b5fd, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{val}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Search */}
          <div style={{ marginTop: 28, position: "relative", maxWidth: 400 }}>
            <input
              className="input"
              placeholder="Search companies, tags…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 40 }}
            />
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 14 }}>
              🔍
            </span>
          </div>
        </div>
      </div>

      {/* Company Grid */}
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "36px 40px 64px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
            No companies found for "{search}"
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 18,
          }}>
            {filtered.map((company, i) => (
              <div key={company.id} className="mock-test-card" style={{ animationDelay: `${i * 0.06}s` }}>
                <CompanyCard company={company} onSelect={setSelected} />
              </div>
            ))}
          </div>
        )}

        {/* Bottom note */}
        <div style={{
          marginTop: 36,
          border: "1px dashed rgba(255,255,255,0.08)",
          borderRadius: 16, padding: "24px 28px",
          textAlign: "center", color: "var(--text-muted)", fontSize: 13,
        }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🚀</div>
          <div style={{ fontWeight: 600, color: "var(--text-dim)", marginBottom: 4 }}>More companies coming soon</div>
          <div>We're adding Accenture, Capgemini, IBM, and more.</div>
        </div>
      </div>
    </div>
  );
}
