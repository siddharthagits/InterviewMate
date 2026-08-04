import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SUBJECTS, QUESTIONS } from "../data/subjectQuestions";

// ── Subject Card ──────────────────────────────────────────────────────────────
function SubjectCard({ subject }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const qCount = QUESTIONS[subject.id]?.length ?? 0;

  return (
    <div
      onClick={() => navigate(`/question-bank/${subject.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `${subject.color}0e` : "var(--card)",
        border: `1px solid ${hovered ? subject.color + "55" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 20,
        padding: "24px 22px",
        cursor: "pointer",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        transform: hovered ? "translateY(-5px)" : "none",
        boxShadow: hovered ? `0 20px 50px ${subject.color}20` : "0 2px 8px rgba(0,0,0,0.2)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: subject.gradient,
        borderRadius: "20px 20px 0 0",
        opacity: hovered ? 1 : 0.35,
        transition: "opacity 0.25s",
      }} />

      {/* Glow blob */}
      {hovered && (
        <div style={{
          position: "absolute", top: -20, right: -20,
          width: 100, height: 100, borderRadius: "50%",
          background: `radial-gradient(circle, ${subject.color}20, transparent 70%)`,
          pointerEvents: "none",
        }} />
      )}

      {/* Icon + Badge */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16, position: "relative" }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: `${subject.color}18`,
          border: `1px solid ${subject.color}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26,
          transition: "transform 0.25s",
          transform: hovered ? "scale(1.1) rotate(-3deg)" : "none",
        }}>
          {subject.icon}
        </div>
        <span style={{
          fontSize: 9, fontWeight: 700, padding: "4px 10px",
          borderRadius: 99, letterSpacing: "0.06em", textTransform: "uppercase",
          background: `${subject.color}15`, color: subject.color,
          border: `1px solid ${subject.color}35`,
          alignSelf: "flex-start",
        }}>
          {subject.difficulty}
        </span>
      </div>

      {/* Name */}
      <h3 style={{
        fontSize: 16, fontWeight: 800, fontFamily: "'Sora', sans-serif",
        color: hovered ? subject.color : "var(--text)",
        marginBottom: 6, letterSpacing: "-0.3px",
        transition: "color 0.25s",
        lineHeight: 1.2,
      }}>
        {subject.shortName}
      </h3>
      <p style={{
        fontSize: 13, color: "var(--text)", marginBottom: 14, lineHeight: 1.55,
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>
        {subject.description}
      </p>

      {/* Tags row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 16 }}>
        {subject.topics.slice(0, 3).map(t => (
          <span key={t} style={{
            fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 99,
            background: `${subject.color}0d`, color: subject.color,
            border: `1px solid ${subject.color}25`,
          }}>{t}</span>
        ))}
        {subject.topics.length > 3 && (
          <span style={{ fontSize: 9, color: "var(--text-muted)", padding: "2px 4px" }}>
            +{subject.topics.length - 3} more
          </span>
        )}
      </div>

      {/* Footer */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingTop: 12, borderTop: `1px solid ${hovered ? subject.color + "20" : "rgba(255,255,255,0.05)"}`,
        transition: "border-color 0.25s",
      }}>
        <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>
          📋 <strong style={{ color: hovered ? subject.color : "var(--text-dim)" }}>{qCount}</strong> Questions
        </span>
        <span style={{
          fontSize: 12, fontWeight: 700, color: subject.color,
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateX(0)" : "translateX(-8px)",
          transition: "all 0.2s",
        }}>
          Start →
        </span>
      </div>
    </div>
  );
}

// ── Stats strip ───────────────────────────────────────────────────────────────
function StatsStrip() {
  const totalQs = Object.values(QUESTIONS).reduce((sum, qs) => sum + qs.length, 0);
  const stats = [
    { val: SUBJECTS.length, label: "Subjects" },
    { val: totalQs + "+", label: "Questions" },
    { val: "100%", label: "Free & Offline" },
    { val: "Instant", label: "Results" },
  ];
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 32 }}>
      {stats.map(({ val, label }) => (
        <div key={label} style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14, padding: "14px 22px", textAlign: "center",
        }}>
          <div style={{
            fontSize: 22, fontWeight: 900, fontFamily: "'Sora', sans-serif",
            background: "linear-gradient(135deg, #c4b5fd, #06b6d4)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            letterSpacing: "-0.5px",
          }}>{val}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3, fontWeight: 500 }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

// ── Main QuestionBank landing page ────────────────────────────────────────────
export default function QuestionBank() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const difficulties = ["all", "Easy–Medium", "Medium", "Medium–Hard", "Hard"];

  const filtered = SUBJECTS.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.shortName.toLowerCase().includes(search.toLowerCase()) ||
      s.topics.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === "all" || s.difficulty === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>

      {/* ── Hero ── */}
      <div style={{
        background: "linear-gradient(180deg, rgba(124,58,237,0.09) 0%, transparent 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "52px 40px 44px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Top glow line */}
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 700, height: 2,
          background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.5), rgba(6,182,212,0.3), transparent)",
        }} />

        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Breadcrumb */}
          <Link to="/" style={{
            fontSize: 13, color: "var(--text-muted)", textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 28,
            transition: "color 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--violet-light)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
          >
            ← Back to Home
          </Link>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 24 }}>
            <div style={{ maxWidth: 560 }}>
              {/* Pill */}
              <div className="glow-pill" style={{ marginBottom: 18 }}>
                Subject-wise Question Bank
              </div>
              <h1 style={{
                fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 900,
                fontFamily: "'Sora', sans-serif", letterSpacing: "-1.5px",
                marginBottom: 14, lineHeight: 1.1,
              }}>
                Master Every{" "}
                <span style={{
                  background: "linear-gradient(135deg, #c4b5fd, #06b6d4, #fcd34d)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>
                  CS Topic
                </span>
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.75 }}>
                Structured question banks for core CS subjects — browse & learn at your own pace,
                or take a timed test to check your readiness. No internet needed after load.
              </p>
              <StatsStrip />
            </div>

            {/* Quick subject preview */}
            <div style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 18, padding: "20px 24px", minWidth: 220,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
                All Subjects
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {SUBJECTS.map(s => (
                  <Link key={s.id} to={`/question-bank/${s.id}`} style={{
                    display: "flex", alignItems: "center", gap: 10, textDecoration: "none",
                    fontSize: 13, color: "var(--text-muted)", padding: "5px 8px",
                    borderRadius: 8, transition: "all 0.15s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${s.color}12`; e.currentTarget.style.color = s.color; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}
                  >
                    <span style={{ fontSize: 16 }}>{s.icon}</span>
                    <span style={{ fontWeight: 600 }}>{s.shortName}</span>
                    <span style={{ marginLeft: "auto", fontSize: 10, opacity: 0.7 }}>{QUESTIONS[s.id]?.length ?? 0} Qs</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Filters row */}
          <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap", alignItems: "center" }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <input
                className="input"
                placeholder="Search subjects or topics…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: 38, width: 260, fontSize: 13 }}
              />
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "var(--text-muted)" }}>🔍</span>
            </div>

            {/* Difficulty filter pills */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {difficulties.map(d => (
                <button key={d} onClick={() => setFilter(d)} style={{
                  padding: "7px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  border: `1px solid ${filter === d ? "#7c3aed" : "rgba(255,255,255,0.08)"}`,
                  background: filter === d ? "rgba(124,58,237,0.15)" : "transparent",
                  color: filter === d ? "#c4b5fd" : "var(--text-muted)",
                  transition: "all 0.2s",
                }}>
                  {d === "all" ? "All Levels" : d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Subject Grid ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 40px 80px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
            <div style={{ fontWeight: 600, color: "var(--text-dim)" }}>No subjects match "{search}"</div>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
          }}>
            {filtered.map((subject, i) => (
              <div key={subject.id} style={{ animation: `fade-up 0.4s ease both`, animationDelay: `${i * 0.06}s` }}>
                <SubjectCard subject={subject} />
              </div>
            ))}
          </div>
        )}

        {/* Coming soon footer */}
        <div style={{
          marginTop: 40, border: "1px dashed rgba(255,255,255,0.07)",
          borderRadius: 16, padding: "24px", textAlign: "center", color: "var(--text-muted)", fontSize: 13,
        }}>
          <div style={{ fontSize: 22, marginBottom: 8 }}>🚀</div>
          <div style={{ fontWeight: 600, color: "var(--text-dim)", marginBottom: 4 }}>More subjects coming soon</div>
          <div>Compiler Design, Computer Architecture, Discrete Maths, and more are on the way.</div>
        </div>
      </div>
    </div>
  );
}
