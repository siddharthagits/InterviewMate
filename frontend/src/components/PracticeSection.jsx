import { useNavigate } from "react-router-dom";
import AppIcon from "./common/AppIcon";

const PREVIEW_CATS = [
  { id: "quantitative",       name: "Quantitative Aptitude",  icon: "chart", count: "29 topics" },
  { id: "verbal",             name: "Verbal Ability",          icon: "book", count: "12 topics" },
  { id: "logical",            name: "Logical Reasoning",       icon: "brain", count: "10 topics" },
  { id: "verbal-reasoning",   name: "Verbal Reasoning",        icon: "message", count: "8 topics"  },
  { id: "nonverbal-reasoning",name: "Nonverbal Reasoning",     icon: "grid", count: "7 topics"  },
];

function PracticeSection() {
  const nav = useNavigate();

  return (
    <section className="practice-home-section">
      <div className="practice-home-inner">
        {/* Header */}
        <div className="practice-home-header">
          <div className="glow-pill fade-up" style={{ marginBottom: 16, display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 18, height: 1.5, background: "var(--violet-light)", display: "inline-block", borderRadius: 2 }} />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <AppIcon name="brain" size={14} color="var(--violet-light)" /> Practice Corner
            </span>
            <span style={{ width: 18, height: 1.5, background: "var(--violet-light)", display: "inline-block", borderRadius: 2 }} />
          </div>
          <h2 className="practice-home-heading fade-up" style={{ animationDelay: "0.1s" }}>
            Topic-wise Questions &amp; Answers
          </h2>
          <p className="practice-home-sub fade-up" style={{ animationDelay: "0.2s" }}>
            Practice Quantitative Aptitude, Verbal Ability, Logical Reasoning and more — topic by topic, with instant answer explanations. No login required.
          </p>
        </div>

        {/* Category cards */}
        <div className="practice-home-grid fade-up" style={{ animationDelay: "0.3s" }}>
          {PREVIEW_CATS.map(cat => (
            <div
              key={cat.id}
              className="practice-home-card"
              onClick={() => nav(`/practice/${cat.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === "Enter" && nav(`/practice/${cat.id}`)}
            >
              <div className="practice-home-card-icon">
                <AppIcon name={cat.icon} size={24} />
              </div>
              <div className="practice-home-card-body">
                <div className="practice-home-card-name">{cat.name}</div>
                <div className="practice-home-card-count">{cat.count}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="practice-home-cta fade-up" style={{ animationDelay: "0.4s" }}>
          <button className="btn btn-primary" style={{ fontSize: 14, padding: "12px 28px" }} onClick={() => nav("/practice")}>
            Explore All Topics →
          </button>
          <span className="practice-home-cta-note">1500+ questions · No login needed · Instant explanations</span>
        </div>
      </div>
    </section>
  );
}

export default PracticeSection;
