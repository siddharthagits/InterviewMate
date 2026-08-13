import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { TCS_NQT_YEARS } from "../data/companyQuestions";

// ── Section colour map ────────────────────────────────────────────────────────
const SECTION_COLORS = {
  "Numerical Ability":  { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  icon: "🔢" },
  "Verbal Ability":     { color: "#10b981", bg: "rgba(16,185,129,0.1)",  icon: "📖" },
  "Reasoning Ability":  { color: "#6366f1", bg: "rgba(99,102,241,0.1)",  icon: "🧩" },
  "Programming Logic":  { color: "#ec4899", bg: "rgba(236,72,153,0.1)",  icon: "💻" },
};

// ── Year Card ─────────────────────────────────────────────────────────────────
function YearCard({ paper, onBrowse, onTest }) {
  const [hovered, setHovered] = useState(false);
  const questions = paper.questions || [];
  const totalQuestions = paper.totalQuestions ?? questions.length;
  const tags = paper.tags ?? ["TCS", "NQT", "PYQ"];
  const cutoffPercent = paper.cutoffPercent ?? paper.meta?.cutoffPercent ?? 65;
  const durationMinutes = paper.durationMinutes ?? paper.meta?.durationMinutes ?? 90;

  const sectionCounts = {};
  questions.forEach(q => {
    sectionCounts[q.section] = (sectionCounts[q.section] || 0) + 1;
  });

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(59,130,246,0.06)" : "var(--card)",
        border: `1px solid ${hovered ? "#3b82f680" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 22,
        padding: "28px 26px",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        transform: hovered ? "translateY(-6px)" : "none",
        boxShadow: hovered ? "0 24px 60px rgba(59,130,246,0.15)" : "0 2px 10px rgba(0,0,0,0.2)",
        position: "relative",
        overflow: "hidden",
        display: "flex", flexDirection: "column", gap: 20,
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: paper.gradient,
        borderRadius: "22px 22px 0 0",
        opacity: hovered ? 1 : 0.4,
        transition: "opacity 0.25s",
      }} />

      {/* Glow blob */}
      {hovered && (
        <div style={{
          position: "absolute", top: -30, right: -30,
          width: 140, height: 140, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%)",
          pointerEvents: "none",
        }} />
      )}

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div>
          {/* Year badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)",
            borderRadius: 99, padding: "4px 14px", marginBottom: 10,
          }}>
            <span style={{ fontSize: 15 }}>📋</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#3b82f6", letterSpacing: "0.04em" }}>
              {paper.year}
            </span>
          </div>
          <h3 style={{
            fontSize: 22, fontWeight: 900, fontFamily: "'Sora', sans-serif",
            color: hovered ? "#3b82f6" : "var(--text)",
            letterSpacing: "-0.4px", lineHeight: 1.2,
            transition: "color 0.25s",
          }}>
            TCS NQT PYQ
          </h3>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
            Tata Consultancy Services — National Qualifier Test
          </p>
        </div>

        <div style={{
          background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)",
          borderRadius: 14, padding: "10px 14px", textAlign: "center", flexShrink: 0,
        }}>
          <div style={{
            fontSize: 24, fontWeight: 900, fontFamily: "'Sora', sans-serif",
            background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            {totalQuestions}
          </div>
          <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Questions
          </div>
        </div>
      </div>

      <p style={{
        fontSize: 13, color: "var(--text)", lineHeight: 1.6,
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>
        {paper.description}
      </p>

      {/* Section breakdown */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {Object.entries(sectionCounts).map(([sec, count]) => {
          const s = SECTION_COLORS[sec] || { color: "#7c3aed", bg: "rgba(124,58,237,0.1)", icon: "❓" };
          return (
            <span key={sec} style={{
              fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 99,
              background: s.bg, color: s.color,
              border: `1px solid ${s.color}30`,
              display: "flex", alignItems: "center", gap: 4,
            }}>
              {s.icon} {sec.split(" ")[0]} ({count})
            </span>
          );
        })}
      </div>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {tags.slice(0, 4).map(tag => (
          <span key={tag} style={{
            fontSize: 10, padding: "2px 8px", borderRadius: 6,
            background: "rgba(255,255,255,0.04)", color: "var(--text-muted)",
            border: "1px solid rgba(255,255,255,0.08)", fontWeight: 600,
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Meta row */}
      <div style={{
        display: "flex", gap: 16, fontSize: 12, color: "var(--text-muted)",
        paddingTop: 12, borderTop: `1px solid ${hovered ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.05)"}`,
        transition: "border-color 0.25s",
      }}>
        <span>⏱ {durationMinutes} min</span>
        <span>🎯 Cutoff: {cutoffPercent}%</span>
        <span style={{ marginLeft: "auto", color: "#3b82f6", fontWeight: 700, opacity: hovered ? 1 : 0, transition: "opacity 0.2s" }}>
          View Paper →
        </span>
      </div>

      {/* Action buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <button
          onClick={() => onBrowse(paper)}
          className="btn btn-primary"
          style={{ padding: "10px 8px", fontSize: 12, fontWeight: 800 }}
        >
          📖 Browse & Study
        </button>
        <button
          onClick={() => onTest(paper)}
          style={{
            background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.35)",
            borderRadius: 12, color: "#f59e0b", fontSize: 12, fontWeight: 700,
            cursor: "pointer", padding: "10px 8px", transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(245,158,11,0.2)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(245,158,11,0.1)"; }}
        >
          ⚡ Take Mock Test
        </button>
      </div>
    </div>
  );
}

// ── Stats strip ───────────────────────────────────────────────────────────────
function StatsStrip() {
  const totalQs = TCS_NQT_YEARS.reduce((s, y) => s + (y.totalQuestions ?? y.questions?.length ?? 0), 0);
  const stats = [
    { val: "5", label: "Year Papers", icon: "📅" },
    { val: totalQs + "+", label: "PYQ Questions", icon: "❓" },
    { val: "4", label: "Sections", icon: "📂" },
    { val: "100%", label: "Free Access", icon: "🆓" },
  ];
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {stats.map(({ val, label, icon }) => (
        <div key={label} style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14, padding: "14px 20px", textAlign: "center", flex: "1 1 90px",
        }}>
          <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
          <div style={{
            fontSize: 20, fontWeight: 900, fontFamily: "'Sora', sans-serif",
            background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>{val}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, fontWeight: 600 }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

// ── Pattern Guide ─────────────────────────────────────────────────────────────
function PatternGuide() {
  const sections = [
    { ...SECTION_COLORS["Numerical Ability"],  title: "Numerical Ability",  desc: "Speed maths, percentages, ratio, CI/SI, time-work, trains, pipes", qs: "4–5" },
    { ...SECTION_COLORS["Verbal Ability"],     title: "Verbal Ability",     desc: "Vocabulary, fill-in-blanks, grammar, reading comprehension", qs: "3–4" },
    { ...SECTION_COLORS["Reasoning Ability"],  title: "Reasoning Ability",  desc: "Blood relations, coding-decoding, series, seating arrangement", qs: "3–4" },
    { ...SECTION_COLORS["Programming Logic"],  title: "Programming Logic",  desc: "C/C++ output tracing, Python, Java, data structures, algorithms", qs: "3–4" },
  ];
  return (
    <div style={{
      background: "rgba(59,130,246,0.04)", border: "1px solid rgba(59,130,246,0.15)",
      borderRadius: 18, padding: "24px 28px",
    }}>
      <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 16, fontFamily: "'Sora', sans-serif" }}>
        📐 TCS NQT Exam Pattern
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
        {sections.map(s => (
          <div key={s.title} style={{
            background: s.bg, border: `1px solid ${s.color}25`,
            borderRadius: 12, padding: "14px 16px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: s.color }}>{s.title}</span>
              <span style={{
                marginLeft: "auto", fontSize: 10, fontWeight: 700,
                color: s.color, background: `${s.color}20`,
                padding: "2px 7px", borderRadius: 99, border: `1px solid ${s.color}30`,
              }}>~{s.qs} Qs</span>
            </div>
            <p style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5, margin: 0 }}>{s.desc}</p>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 16, padding: "10px 16px", borderRadius: 10,
        background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)",
        fontSize: 12, color: "#fbbf24", lineHeight: 1.6,
      }}>
        💡 <strong>Pro Tip:</strong> TCS NQT cutoff is typically <strong>65–70%</strong>. Time management is key — skip hard questions and return later. Programming Logic section is the differentiator for Ninja role.
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CompanyAssessment() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");

  const sections = ["All", "Numerical Ability", "Verbal Ability", "Reasoning Ability", "Programming Logic"];

  const handleBrowse = (paper) => {
    navigate(`/company-assessment/${paper.year}`);
  };

  const handleTest = (paper) => {
    navigate(`/company-assessment/${paper.year}?mode=test`);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <Navbar />
      <div style={{ paddingTop: 68 }}>
        {/* ── Hero ── */}
        <div className="company-header" style={{
        background: "linear-gradient(180deg, rgba(59,130,246,0.1) 0%, transparent 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Background glow */}
        <div style={{
          position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
          width: 600, height: 400, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)",
          filter: "blur(60px)", pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative" }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              background: "transparent", border: "none", color: "var(--text-muted)",
              fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center",
              gap: 6, marginBottom: 28, padding: 0, transition: "color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#fff"}
            onMouseLeave={e => e.currentTarget.style.color = ""}
          >
            ← Back to Dashboard
          </button>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 32 }}>
            <div style={{ maxWidth: 620 }}>
              {/* Pill */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)",
                borderRadius: 99, padding: "6px 16px", marginBottom: 18,
                fontSize: 11, fontWeight: 700, color: "#3b82f6",
                textTransform: "uppercase", letterSpacing: "0.08em",
              }}>
                🏆 TCS NQT Previous Year Questions
              </div>

              <h1 style={{
                fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 900,
                fontFamily: "'Sora', sans-serif", letterSpacing: "-1.2px",
                lineHeight: 1.1, marginBottom: 14,
              }}>
                TCS NQT{" "}
                <span style={{
                  background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>PYQ Papers</span>
                <br />2020 – 2024
              </h1>

              <p style={{ color: "var(--text)", fontSize: 15, lineHeight: 1.75, marginBottom: 28 }}>
                Complete collection of TCS National Qualifier Test previous year questions with <strong style={{ color: "#3b82f6" }}>detailed solutions</strong>, section-wise breakdown, and exam tips. Covers all 4 sections — Numerical, Verbal, Reasoning, and Programming Logic.
              </p>

              <StatsStrip />
            </div>

            {/* TCS Logo / Badge */}
            <div style={{
              background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)",
              borderRadius: 24, padding: "28px 36px", textAlign: "center", flexShrink: 0,
            }}>
              <div style={{
                fontSize: 56, marginBottom: 10,
                filter: "drop-shadow(0 0 20px rgba(59,130,246,0.4))",
              }}>🏢</div>
              <div style={{
                fontSize: 32, fontWeight: 900, fontFamily: "'Sora', sans-serif",
                background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                letterSpacing: "-0.5px",
              }}>TCS</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4, fontWeight: 600 }}>
                Tata Consultancy Services
              </div>
              <div style={{
                marginTop: 12, padding: "5px 14px", borderRadius: 99,
                background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
                fontSize: 11, color: "#10b981", fontWeight: 700,
              }}>
                NQT / Ninja Certified
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section filter ── */}
      <div className="company-filter-bar" style={{ background: "rgba(255,255,255,0.01)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, marginRight: 4 }}>Filter by section:</span>
          {sections.map(sec => (
            <button
              key={sec}
              onClick={() => setFilter(sec)}
              style={{
                padding: "6px 14px", borderRadius: 99, fontSize: 11, fontWeight: 700, cursor: "pointer",
                background: filter === sec ? "#3b82f6" : "rgba(255,255,255,0.04)",
                color: filter === sec ? "#fff" : "var(--text-muted)",
                border: `1px solid ${filter === sec ? "#3b82f6" : "rgba(255,255,255,0.08)"}`,
                transition: "all 0.15s",
              }}
            >
              {sec === "All" ? "📋 All Sections" : (SECTION_COLORS[sec]?.icon + " " + sec.split(" ")[0])}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="company-content" style={{ maxWidth: 1160, margin: "0 auto" }}>

        {/* Pattern guide */}
        <div style={{ marginBottom: 36 }}>
          <PatternGuide />
        </div>

        {/* Year cards grid */}
        <div style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Sora', sans-serif", color: "var(--text)" }}>
            📅 Year-wise Papers
          </h2>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {TCS_NQT_YEARS.length} papers • Latest first
          </span>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(290px, 100%), 1fr))",
          gap: 22,
        }}>
          {TCS_NQT_YEARS.map((paper, i) => (
            <div key={paper.id} className="mock-test-card" style={{ animationDelay: `${i * 0.07}s` }}>
              <YearCard
                paper={paper}
                onBrowse={handleBrowse}
                onTest={handleTest}
              />
            </div>
          ))}
        </div>

        {/* Bottom tip */}
        <div style={{
          marginTop: 40, padding: "20px 24px", borderRadius: 16,
          background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.12)",
          display: "flex", gap: 16, alignItems: "flex-start",
        }}>
          <span style={{ fontSize: 24, flexShrink: 0 }}>📌</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
              How to use these PYQs effectively
            </div>
            <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>
              Start with <strong style={{ color: "#f59e0b" }}>2020</strong> to understand the base pattern, then move forward year by year to track how difficulty evolved. Use <strong style={{ color: "#3b82f6" }}>Browse & Study</strong> mode to learn solutions deeply, then take the <strong style={{ color: "#f59e0b" }}>Mock Test</strong> to simulate real exam conditions. Focus on Programming Logic last as it has the highest weight for Ninja selection.
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
