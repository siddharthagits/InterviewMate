import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { HR_QUESTIONS, CATEGORIES } from "../data/hrInterviewData";

// ─── Markdown-lite renderer ────────────────────────────────────────────────────
function renderAnswer(text) {
  const lines = text.split("\n");
  const result = [];
  let listItems = [];

  const flushList = () => {
    if (listItems.length) {
      result.push(
        <ul key={`ul-${result.length}`} className="hr-answer-list">
          {listItems.map((li, i) => (
            <li key={i}>{li}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      return;
    }
    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      flushList();
      result.push(
        <p key={i} className="hr-answer-bold-label">
          {trimmed.replace(/\*\*/g, "")}
        </p>
      );
    } else if (trimmed.startsWith("- ")) {
      listItems.push(
        <span key={i}>
          {trimmed
            .slice(2)
            .split(/(\*\*[^*]+\*\*)/)
            .map((part, j) =>
              part.startsWith("**") ? (
                <strong key={j}>{part.replace(/\*\*/g, "")}</strong>
              ) : (
                part
              )
            )}
        </span>
      );
    } else {
      flushList();
      const parts = trimmed.split(/(\*\*[^*]+\*\*)/);
      result.push(
        <p key={i} className="hr-answer-para">
          {parts.map((part, j) =>
            part.startsWith("**") ? (
              <strong key={j}>{part.replace(/\*\*/g, "")}</strong>
            ) : (
              part
            )
          )}
        </p>
      );
    }
  });
  flushList();
  return result;
}

// ─── Single Q&A Card ──────────────────────────────────────────────────────────
function QACard({ item, index, isOpen, onToggle }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  const categoryColor = item.category === "freshers" ? "#10b981" : "#7c3aed";
  const categoryLabel =
    item.category === "freshers" ? "For Freshers" : "For Experienced";

  return (
    <div className={`hr-qa-card ${isOpen ? "hr-qa-card--open" : ""}`}>
      <button
        className="hr-qa-header"
        onClick={onToggle}
        aria-expanded={isOpen}
        id={`hr-q-${item.id}`}
      >
        <div className="hr-qa-header-left">
          <span className="hr-qa-num">{String(index).padStart(2, "0")}</span>
          <span className="hr-qa-question">{item.question}</span>
        </div>
        <div className="hr-qa-header-right">
          <span
            className="hr-qa-badge"
            style={{
              background: `${categoryColor}18`,
              color: categoryColor,
              borderColor: `${categoryColor}40`,
            }}
          >
            {categoryLabel}
          </span>
          <svg
            className={`hr-qa-chevron ${isOpen ? "hr-qa-chevron--up" : ""}`}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      <div
        className="hr-qa-body"
        style={{ height: isOpen ? height : 0 }}
        aria-hidden={!isOpen}
      >
        <div ref={contentRef} className="hr-qa-body-inner">
          <div className="hr-answer-content">{renderAnswer(item.answer)}</div>

          {item.tips && item.tips.length > 0 && (
            <div className="hr-tips-box">
              <div className="hr-tips-title">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Key Tips
              </div>
              <ul className="hr-tips-list">
                {item.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="hr-tags-row">
            {item.tags.map((tag) => (
              <span key={tag} className="hr-tag">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function HRSidebar({ activeCategory, onCategoryChange, stats }) {
  return (
    <aside className="hr-sidebar">
      <div className="hr-sidebar-card hr-stats-card">
        <div className="hr-sidebar-title">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7c3aed"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          HR Interview Guide
        </div>
        <p className="hr-sidebar-desc">
          Master the most commonly asked HR interview questions with structured
          answers and expert tips.
        </p>
        <div className="hr-stat-row">
          <div className="hr-stat-box">
            <span className="hr-stat-num">{stats.total}</span>
            <span className="hr-stat-label">Questions</span>
          </div>
          <div className="hr-stat-box">
            <span className="hr-stat-num" style={{ color: "#10b981" }}>
              {stats.freshers}
            </span>
            <span className="hr-stat-label">Freshers</span>
          </div>
          <div className="hr-stat-box">
            <span className="hr-stat-num" style={{ color: "#7c3aed" }}>
              {stats.experienced}
            </span>
            <span className="hr-stat-label">Experienced</span>
          </div>
        </div>
      </div>

      <div className="hr-sidebar-card">
        <div className="hr-sidebar-title">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7c3aed"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          Filter by Category
        </div>
        <div className="hr-cat-filter-list">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`hr-cat-btn ${
                activeCategory === cat.id ? "hr-cat-btn--active" : ""
              }`}
              onClick={() => onCategoryChange(cat.id)}
            >
              <span>{cat.label}</span>
              <span className="hr-cat-count">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="hr-sidebar-card">
        <div className="hr-sidebar-title">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7c3aed"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          Quick Links
        </div>
        <div className="hr-quick-links">
          <Link to="/setup" className="hr-ql-link">
            🎙️ Start AI Interview
          </Link>
          <Link to="/voice" className="hr-ql-link">
            🔊 Voice Interview
          </Link>
          <Link to="/mock-tests" className="hr-ql-link">
            📝 Mock Tests
          </Link>
          <Link to="/question-bank" className="hr-ql-link">
            📚 Question Bank
          </Link>
          <Link to="/practice" className="hr-ql-link">
            🏋️ Practice Corner
          </Link>
          <Link to="/company-assessment" className="hr-ql-link">
            🏢 Company Tests
          </Link>
        </div>
      </div>

      <div className="hr-sidebar-card hr-pro-tip-card">
        <div className="hr-pro-tip-icon">💡</div>
        <div className="hr-pro-tip-text">
          <strong>Pro Tip:</strong> Use our{" "}
          <Link to="/voice" style={{ color: "#7c3aed" }}>
            Voice AI Interviewer
          </Link>{" "}
          to practise these HR questions with real-time speech feedback.
        </div>
      </div>
    </aside>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function HRInterviewQA() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState(null);
  const [expandAll, setExpandAll] = useState(false);

  const filtered = useMemo(() => {
    let qs = HR_QUESTIONS;
    if (activeCategory !== "all") {
      qs = qs.filter((q) => q.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      qs = qs.filter(
        (item) =>
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q) ||
          item.tags.some((t) => t.includes(q))
      );
    }
    return qs;
  }, [activeCategory, searchQuery]);

  const handleToggle = (id) => {
    if (expandAll) {
      setExpandAll(false);
      setOpenId(openId === id ? null : id);
    } else {
      setOpenId(openId === id ? null : id);
    }
  };

  const isOpen = (id) => expandAll || openId === id;

  const stats = {
    total: HR_QUESTIONS.length,
    freshers: HR_QUESTIONS.filter((q) => q.category === "freshers").length,
    experienced: HR_QUESTIONS.filter((q) => q.category === "experienced")
      .length,
  };

  return (
    <div className="hr-page-root">
      <Navbar />

      {/* Hero Banner */}
      <div className="hr-hero-banner">
        <div className="hr-hero-inner">
          <div className="hr-hero-badge">HR Interview Prep</div>
          <h1 className="hr-hero-title">
            HR Interview Questions{" "}
            <span className="hr-hero-title-accent">&amp; Answers</span>
          </h1>
          <p className="hr-hero-subtitle">
            {HR_QUESTIONS.length} curated questions with structured answers,
            expert tips, and real-world examples — for freshers and experienced
            professionals.
          </p>

          {/* Search */}
          <div className="hr-search-wrapper">
            <svg
              className="hr-search-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="hr-search-input"
              className="hr-search-input"
              type="text"
              placeholder="Search questions, topics, or keywords…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search HR interview questions"
            />
            {searchQuery && (
              <button
                className="hr-search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="hr-hero-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`hr-pill ${
                  activeCategory === cat.id ? "hr-pill--active" : ""
                }`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
                <span className="hr-pill-count">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="hr-page-body">
        {/* Main Q&A column */}
        <main className="hr-main-col">
          {/* Toolbar */}
          <div className="hr-toolbar">
            <div className="hr-toolbar-info">
              Showing <strong>{filtered.length}</strong> of{" "}
              {HR_QUESTIONS.length} questions
              {activeCategory !== "all" && (
                <span className="hr-toolbar-tag">
                  {CATEGORIES.find((c) => c.id === activeCategory)?.label}
                </span>
              )}
              {searchQuery && (
                <span className="hr-toolbar-tag">"{searchQuery}"</span>
              )}
            </div>
            <button
              id="hr-expand-all-btn"
              className="hr-expand-btn"
              onClick={() => {
                setExpandAll((v) => !v);
                setOpenId(null);
              }}
            >
              {expandAll ? (
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                  Collapse All
                </>
              ) : (
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                  Expand All
                </>
              )}
            </button>
          </div>

          {/* Cards */}
          {filtered.length > 0 ? (
            <div className="hr-qa-list">
              {filtered.map((item, idx) => (
                <QACard
                  key={item.id}
                  item={item}
                  index={idx + 1}
                  isOpen={isOpen(item.id)}
                  onToggle={() => handleToggle(item.id)}
                />
              ))}
            </div>
          ) : (
            <div className="hr-empty-state">
              <div className="hr-empty-icon">🔍</div>
              <h3>No questions found</h3>
              <p>Try adjusting your search or changing the category filter.</p>
              <button
                className="hr-empty-reset"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </main>

        {/* Sidebar */}
        <HRSidebar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          stats={stats}
        />
      </div>
    </div>
  );
}
