import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getCategory, getTopics } from "../data/practiceData";

function PracticeTopicList() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");

  const category = getCategory(categoryId);
  const topics = getTopics(categoryId);

  const filtered = useMemo(() =>
    filter.trim() === ""
      ? topics
      : topics.filter(t => t.name.toLowerCase().includes(filter.toLowerCase())),
    [topics, filter]
  );

  if (!category) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
        <Navbar />
        <div style={{ paddingTop: 68 }}>
          <div className="practice-page-root">
            <div className="practice-page-header">
              <h1 className="practice-page-heading">Category Not Found</h1>
              <Link to="/practice" className="practice-back-link">← Back to Practice Corner</Link>
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
          {/* Page header */}
          <div className="practice-page-header">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 28 }}>{category.icon}</span>
              <h1 className="practice-page-heading" style={{ margin: 0 }}>
                {category.name} Questions and Answers
              </h1>
            </div>
            <p className="practice-page-subheading">{category.description}</p>
          </div>

          {/* Breadcrumb */}
          <div className="practice-breadcrumb practice-breadcrumb-standalone">
            <Link to="/">Home</Link>
            <span className="practice-breadcrumb-sep">»</span>
            <Link to="/practice">Practice Corner</Link>
            <span className="practice-breadcrumb-sep">»</span>
            <span style={{ color: "#7c3aed" }}>{category.name}</span>
            <span className="practice-breadcrumb-sep">»</span>
            <span>List of Topics</span>
          </div>

          {/* Main layout */}
          <div className="practice-layout">
            <div className="practice-main-col">
              {/* Filter */}
              <div className="practice-filter-bar" style={{ marginBottom: 24 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: "var(--text-muted)" }}>
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                </svg>
                <input
                  className="practice-filter-input"
                  type="text"
                  placeholder={`Search ${category.name} topics...`}
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                />
                {filter && (
                  <button onClick={() => setFilter("")} className="practice-filter-clear" aria-label="Clear">✕</button>
                )}
              </div>

              {/* Topics grid */}
              {filtered.length > 0 ? (
                <div className="practice-grid">
                  {filtered.map(topic => (
                    <div
                      key={topic.id}
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
                  ))}
                </div>
              ) : (
                <div style={{ padding: "40px 0", textAlign: "center", color: "var(--text-muted)" }}>
                  No topics found for "{filter}".
                </div>
              )}

              {/* CTA */}
              <div className="practice-cta-strip" style={{ marginTop: 32 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#10b981" }}>
                  <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
                </svg>
                <Link to="/mock-tests" className="practice-cta-link">Take an Online Aptitude Test Now!</Link>
              </div>
            </div>

            {/* Right sidebar */}
            <aside className="practice-sidebar">
              <div className="practice-sidebar-card">
                <div className="practice-sidebar-section-title">Other Categories</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {[
                    { id: "quantitative",        name: "Quantitative Aptitude",  icon: "📐" },
                    { id: "verbal",              name: "Verbal Ability",          icon: "📝" },
                    { id: "logical",             name: "Logical Reasoning",       icon: "🧠" },
                    { id: "verbal-reasoning",    name: "Verbal Reasoning",        icon: "💬" },
                    { id: "nonverbal-reasoning", name: "Nonverbal Reasoning",   icon: "🔷" },
                  ].map(cat => (
                    <Link
                      key={cat.id}
                      to={`/practice/${cat.id}`}
                      className="practice-ql-link"
                      style={{
                        fontWeight: cat.id === categoryId ? 700 : 500,
                        color: cat.id === categoryId ? "#7c3aed" : undefined,
                      }}
                    >
                      {cat.icon} {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="practice-sidebar-card" style={{ marginTop: 16 }}>
                <div className="practice-sidebar-section-title">Quick Practice</div>
                <Link to="/mock-tests" className="practice-ql-link">› Online Aptitude Test</Link>
                <Link to="/setup" className="practice-ql-link">› Mock Interview</Link>
                <Link to="/company-assessment" className="practice-ql-link">› Company Tests</Link>
                <Link to="/typing-test" className="practice-ql-link">› Typing Test</Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PracticeTopicList;
