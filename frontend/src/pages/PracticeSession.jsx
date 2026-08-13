import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import FormattedExplanation from "../components/FormattedExplanation";
import { getCategory, getQuestions } from "../data/practiceData";

// ── Option letter labels ──────────────────────────────────────────────────────
const LABELS = ["A", "B", "C", "D"];

// ── "Ask ChatGPT" helper ──────────────────────────────────────────────────────
function askChatGPT(question, correctOpt, explanation) {
  const prompt = `Explain this aptitude question in detail with step-by-step solution:\n\nQuestion: ${question}\n\nCorrect Answer: ${correctOpt}\n\nExplanation: ${explanation}\n\nPlease provide a clear, step-by-step solution.`;
  window.open(`https://chatgpt.com/?q=${encodeURIComponent(prompt)}`, "_blank", "noopener");
}

// ── Single Question Card ──────────────────────────────────────────────────────
function QuestionCard({ q, idx }) {
  // clicks: Set of clicked option indices
  const [clicks, setClicks] = useState(new Set());
  const [solved, setSolved] = useState(false);

  const handleOption = (optIdx) => {
    if (solved) return; // locked once correct answer found
    const next = new Set(clicks);
    next.add(optIdx);
    setClicks(next);
    if (optIdx === q.c) {
      setSolved(true);
    }
  };

  const optionState = (optIdx) => {
    if (!clicks.has(optIdx)) return "default";
    if (optIdx === q.c) return "correct";
    return "wrong";
  };

  return (
    <div className="ib-question-card" id={`q-${idx + 1}`}>
      {/* Question */}
      <div className="ib-question-header">
        <span className="ib-q-number">{idx + 1}.</span>
        <span className="ib-q-text">{q.q}</span>
      </div>

      {/* Options */}
      <div className="ib-options">
        {q.opts.map((opt, oi) => {
          const state = optionState(oi);
          return (
            <button
              key={oi}
              className={`ib-option ${state}`}
              onClick={() => handleOption(oi)}
              disabled={solved && oi !== q.c}
            >
              <span className="ib-opt-circle">{LABELS[oi]}</span>
              <span className="ib-opt-text">{opt}</span>
              {state === "correct" && (
                <span className="ib-opt-check-badge">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
              )}
              {state === "wrong" && (
                <span className="ib-opt-wrong-badge">✕</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Solution — shown ONLY when correct answer is selected */}
      {solved && (
        <div className="ib-solution">
          <FormattedExplanation explanation={q.exp} optionLabel={LABELS[q.c]} />

          {/* Ask ChatGPT Button */}
          <div style={{ marginTop: 16 }}>
            <button
              type="button"
              className="ib-chatgpt-btn"
              onClick={() => askChatGPT(q.q, `Option ${LABELS[q.c]}: ${q.opts[q.c]}`, q.exp)}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Ask ChatGPT to explain this
            </button>
          </div>
        </div>
      )}

      {/* Wrong attempt hint (no solution) */}
      {!solved && clicks.size > 0 && (
        <div className="ib-wrong-hint">
          Incorrect. Try another option.
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
function PracticeSession() {
  const { categoryId, topicId } = useParams();

  const category = getCategory(categoryId);
  const questions = getQuestions(categoryId, topicId);
  const topicName = category?.topics?.find(t => t.id === topicId)?.name || topicId;

  if (!category || questions.length === 0) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
        <Navbar />
        <div style={{ paddingTop: 68 }}>
          <div className="practice-page-root">
            <div className="practice-page-header">
              <h1 className="practice-page-heading">No Questions Available</h1>
              <p className="practice-page-subheading">We're adding questions for this topic soon!</p>
              <Link to={`/practice/${categoryId}`} className="practice-back-link" style={{ marginTop: 12, display: "inline-block" }}>
                ← Back to topics
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      {/* Top Navigation Bar with Logo, Links & Theme Toggle */}
      <Navbar />

      <div style={{ paddingTop: 68 }}>
        <div className="practice-page-root">
          {/* Header */}
          <div className="practice-page-header">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 24 }}>{category.icon}</span>
              <h1 className="practice-page-heading" style={{ margin: 0 }}>{topicName}</h1>
            </div>
            <div className="practice-breadcrumb practice-breadcrumb-standalone">
              <Link to="/">Home</Link>
              <span className="practice-breadcrumb-sep">»</span>
              <Link to="/practice">Practice Corner</Link>
              <span className="practice-breadcrumb-sep">»</span>
              <Link to={`/practice/${categoryId}`}>{category.name}</Link>
              <span className="practice-breadcrumb-sep">»</span>
              <span>{topicName}</span>
            </div>
          </div>

          {/* Layout: questions left, quick-nav right */}
          <div className="ib-session-layout">

            {/* ── All questions ── */}
            <div className="ib-questions-col">
              <div className="ib-section-title">
                {topicName} — Questions and Answers
                <span className="ib-q-count">{questions.length} Questions</span>
              </div>

              {questions.map((q, i) => (
                <QuestionCard key={i} q={q} idx={i} />
              ))}

              {/* Bottom CTA */}
              <div className="practice-cta-strip" style={{ marginTop: 24 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#10b981" }}>
                  <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
                </svg>
                <Link to="/mock-tests" className="practice-cta-link">Take an Online Aptitude Test Now!</Link>
              </div>
            </div>

            {/* ── Right sidebar ── */}
            <aside className="practice-sidebar">
              {/* Jump-to navigator */}
              <div className="practice-sidebar-card" style={{ marginBottom: 14 }}>
                <div className="practice-sidebar-section-title">Jump to Question</div>
                <div className="ib-jump-grid">
                  {questions.map((_, i) => (
                    <a
                      key={i}
                      href={`#q-${i + 1}`}
                      className="ib-jump-dot"
                    >
                      {i + 1}
                    </a>
                  ))}
                </div>
              </div>

              {/* Other topics */}
              <div className="practice-sidebar-card" style={{ marginBottom: 14 }}>
                <div className="practice-sidebar-section-title">Other Topics</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {category.topics.slice(0, 10).map(t => (
                    <Link
                      key={t.id}
                      to={`/practice/${categoryId}/${t.id}`}
                      className="practice-ql-link"
                      style={{ fontWeight: t.id === topicId ? 700 : 500, color: t.id === topicId ? "#7c3aed" : undefined }}
                    >
                      › {t.name}
                    </Link>
                  ))}
                  {category.topics.length > 10 && (
                    <Link to={`/practice/${categoryId}`} className="practice-ql-link" style={{ color: "#7c3aed", marginTop: 4 }}>
                      View all topics →
                    </Link>
                  )}
                </div>
              </div>

              {/* Quick links */}
              <div className="practice-sidebar-card">
                <div className="practice-sidebar-section-title">Quick Links</div>
                <Link to="/mock-tests"         className="practice-ql-link">› Online Aptitude Test</Link>
                <Link to="/setup"              className="practice-ql-link">› Mock Interview</Link>
                <Link to="/company-assessment" className="practice-ql-link">› Company Tests</Link>
                <Link to="/practice"           className="practice-ql-link">› Practice Corner</Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PracticeSession;
