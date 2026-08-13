import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { PRACTICE_CATEGORIES } from "../data/practiceData";

// ── Sidebar Quick Links panel ─────────────────────────────────────────────────
function QuickLinks() {
  return (
    <aside className="practice-sidebar">
      {/* Interview Questions card */}
      <div className="practice-sidebar-card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10, flexShrink: 0,
            background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#10b981", marginBottom: 4 }}>Interview Questions</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
              Check out the latest interview questions and answers.
            </div>
            <Link to="/question-bank" style={{ fontSize: 12, color: "#7c3aed", fontWeight: 600, textDecoration: "none", display: "inline-block", marginTop: 6 }}>
              Browse Questions →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Links card */}
      <div className="practice-sidebar-card">
        <div className="practice-sidebar-section-title">Quick Links</div>

        <div className="practice-ql-col-pair">
          <div>
            <div className="practice-ql-heading">Quantitative</div>
            <Link to="/practice/quantitative" className="practice-ql-link">› Arithmetic</Link>
            <Link to="/practice/quantitative" className="practice-ql-link">› Percentage</Link>
            <Link to="/practice/quantitative" className="practice-ql-link">› Profit &amp; Loss</Link>
            <Link to="/practice/quantitative" className="practice-ql-link">› Data Interpretation</Link>
            <div className="practice-ql-heading" style={{ marginTop: 12 }}>Verbal (English)</div>
            <Link to="/practice/verbal" className="practice-ql-link">› Verbal Ability</Link>
            <Link to="/practice/verbal" className="practice-ql-link">› Verbal Test</Link>
            <div className="practice-ql-heading" style={{ marginTop: 12 }}>Reasoning</div>
            <Link to="/practice/logical" className="practice-ql-link">› Logical</Link>
            <Link to="/practice/verbal-reasoning" className="practice-ql-link">› Verbal</Link>
            <Link to="/practice/nonverbal-reasoning" className="practice-ql-link">› Nonverbal</Link>
          </div>
          <div>
            <div className="practice-ql-heading">Mock Tests</div>
            <Link to="/mock-tests" className="practice-ql-link">› Aptitude Test</Link>
            <Link to="/mock-tests" className="practice-ql-link">› Reasoning Test</Link>
            <Link to="/mock-tests" className="practice-ql-link">› Verbal Test</Link>
            <div className="practice-ql-heading" style={{ marginTop: 12 }}>Interview</div>
            <Link to="/setup" className="practice-ql-link">› Start Interview</Link>
            <Link to="/company-assessment" className="practice-ql-link">› Company Tests</Link>
            <div className="practice-ql-heading" style={{ marginTop: 12 }}>Tools</div>
            <Link to="/voice" className="practice-ql-link">› Voice Interview</Link>
            <Link to="/typing-test" className="practice-ql-link">› Typing Test</Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ── Folder card for each topic ────────────────────────────────────────────────
function FolderCard({ topic, categoryId }) {
  const navigate = useNavigate();
  return (
    <div
      className="practice-folder-card"
      onClick={() => navigate(`/practice/${categoryId}/${topic.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === "Enter" && navigate(`/practice/${categoryId}/${topic.id}`)}
    >
      <span className="practice-folder-icon">
        <svg width="22" height="20" viewBox="0 0 24 22" fill="#f59e0b">
          <path d="M10 2H2C.9 2 0 2.9 0 4v14c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-10l-2-3z"/>
        </svg>
      </span>
      <span className="practice-folder-name">{topic.name}</span>
    </div>
  );
}

// ── Category Section ──────────────────────────────────────────────────────────
function CategorySection({ category, filter }) {
  const filtered = useMemo(() =>
    filter.trim() === ""
      ? category.topics
      : category.topics.filter(t =>
          t.name.toLowerCase().includes(filter.toLowerCase())
        ),
    [category.topics, filter]
  );

  if (filtered.length === 0) return null;

  return (
    <div className="practice-category-section">
      <Link to={`/practice/${category.id}`} className="practice-category-title">
        <span style={{ marginRight: 8 }}>{category.icon}</span>
        {category.name} Questions and Answers
      </Link>
      <div className="practice-breadcrumb" style={{ marginBottom: 16 }}>
        <Link to="/">Home</Link>
        <span className="practice-breadcrumb-sep">»</span>
        <Link to="/practice">Practice Corner</Link>
        <span className="practice-breadcrumb-sep">»</span>
        <Link to={`/practice/${category.id}`}>{category.name}</Link>
        <span className="practice-breadcrumb-sep">»</span>
        <span>List of Topics</span>
      </div>
      <div className="practice-grid">
        {filtered.map(topic => (
          <FolderCard key={topic.id} topic={topic} categoryId={category.id} />
        ))}
      </div>
      <Link to={`/practice/${category.id}`} className="practice-view-all-link">
        View all {category.name} topics →
      </Link>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
function PracticeCorner() {
  const [filter, setFilter] = useState("");

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      {/* Top Navigation Bar with Logo, Links & Theme Toggle */}
      <Navbar />

      <div style={{ paddingTop: 68 }}>
        <div className="practice-page-root">
          {/* Page header */}
          <div className="practice-page-header">
            <h1 className="practice-page-heading">Practice Corner</h1>
            <p className="practice-page-subheading">
              Topic-wise Questions &amp; Answers — Quantitative Aptitude, Verbal Ability, Logical Reasoning and more
            </p>
          </div>

          {/* Filter bar */}
          <div className="practice-filter-bar-wrap">
            <div className="practice-filter-bar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: "var(--text-muted)" }}>
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              <input
                className="practice-filter-input"
                type="text"
                placeholder="Filter topics..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
              />
              {filter && (
                <button onClick={() => setFilter("")} className="practice-filter-clear" aria-label="Clear filter">✕</button>
              )}
            </div>
          </div>

          {/* Main 2-column layout */}
          <div className="practice-layout">
            {/* Left: category sections */}
            <div className="practice-main-col">
              {PRACTICE_CATEGORIES.map(cat => (
                <CategorySection key={cat.id} category={cat} filter={filter} />
              ))}

              {/* Bottom CTA */}
              <div className="practice-cta-strip">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#10b981" }}>
                  <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
                </svg>
                <Link to="/mock-tests" className="practice-cta-link">Take an Online Aptitude Test Now!</Link>
              </div>
            </div>

            {/* Right: quick links sidebar */}
            <QuickLinks />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PracticeCorner;
