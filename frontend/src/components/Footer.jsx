import { Link } from "react-router-dom";

// SVG Social & Tech Icons
const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const VercelIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 22.525H0l12-21.05 12 21.05z" />
  </svg>
);

const linkGroups = {
  "Platform Features": [
    { label: "Start Interview", to: "/setup", badge: "AI" },
    { label: "Voice AI Simulator", to: "/voice", badge: "Live" },
    { label: "Company Assessments", to: "/company-assessment" },
    { label: "Mock Tests Hub", to: "/mock-tests" },
    { label: "Question Bank", to: "/question-bank" },
    { label: "Typing Speed Test", to: "/typing-test" },
  ],
  "Deployment & Stack": [
    { label: "Vercel Production", href: "https://aiinterviewmate.vercel.app/", isExternal: true, badge: "Edge" },
    { label: "GitHub Repository", href: "https://github.com/siddharthagits/InterviewMate", isExternal: true },
    { label: "Google Gemini 2.0 AI", href: "https://ai.google.dev/", isExternal: true },
    { label: "FastAPI REST API", href: "https://fastapi.tiangolo.com/", isExternal: true },
    { label: "MongoDB Atlas", href: "https://www.mongodb.com/atlas", isExternal: true },
  ],
  "Candidate Hub": [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Interview History", to: "/history" },
    { label: "Performance Reports", to: "/reports" },
    { label: "User Profile", to: "/profile" },
    { label: "Account Login", to: "/login" },
    { label: "Create Account", to: "/register" },
  ],
};

function Footer() {
  return (
    <footer className="footer-container">
      {/* Background glow top */}
      <div
        style={{
          position: "absolute",
          top: 0, left: "50%",
          transform: "translateX(-50%)",
          width: "100%", maxWidth: 600, height: 2,
          background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.5), rgba(6,182,212,0.3), transparent)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0, left: "50%",
          transform: "translateX(-50%)",
          width: 400, height: 200,
          background: "radial-gradient(ellipse, rgba(124,58,237,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
          filter: "blur(20px)",
        }}
      />

      {/* Main grid */}
      <div className="footer-grid">
        {/* Brand column */}
        <div className="footer-brand-col">
          <Link to="/" style={{ textDecoration: "none" }}>
            <span
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 900,
                fontSize: 24,
                display: "block",
                marginBottom: 12,
                background: "linear-gradient(135deg, #c4b5fd 0%, #06b6d4 60%, #fcd34d 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.5px",
              }}
            >
              InterviewMate
            </span>
          </Link>

          {/* Deployment Pill */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
            <a
              href="https://aiinterviewmate.vercel.app/"
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: 11,
                fontWeight: 800,
                padding: "3px 10px",
                borderRadius: 99,
                background: "rgba(0, 112, 243, 0.12)",
                color: "#60a5fa",
                border: "1px solid rgba(0, 112, 243, 0.25)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <VercelIcon />
              aiinterviewmate.vercel.app
            </a>
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                padding: "2px 6px",
                borderRadius: 6,
                background: "rgba(255,255,255,0.05)",
                color: "var(--text-muted)",
                border: "1px solid var(--glass-border)",
              }}
            >
              v2.4.0
            </span>
          </div>

          <p style={{ lineHeight: 1.8, maxWidth: 300, color: "var(--text-muted)", fontSize: 13 }}>
            Next-generation AI interview preparation ecosystem. Simulated voice interviews, comprehensive question banks, and instant evaluation powered by Google Gemini AI.
          </p>

          {/* Social & Deployment icons */}
          <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
            {[
              { icon: <GithubIcon />, label: "GitHub Repository", href: "https://github.com/siddharthagits/InterviewMate" },
              { icon: <VercelIcon />, label: "Vercel Live Demo", href: "https://aiinterviewmate.vercel.app/" },
              { icon: <TwitterIcon />, label: "Twitter", href: "https://twitter.com" },
              { icon: <LinkedinIcon />, label: "LinkedIn", href: "https://linkedin.com" },
            ].map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                title={label}
                aria-label={label}
                style={{
                  width: 38, height: 38,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(124,58,237,0.12)";
                  e.currentTarget.style.borderColor = "rgba(124,58,237,0.35)";
                  e.currentTarget.style.color = "var(--violet-light)";
                  e.currentTarget.style.boxShadow = "0 0 12px rgba(124,58,237,0.2)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.color = "var(--text-muted)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(linkGroups).map(([section, items]) => (
          <div key={section} className="footer-links-col">
            <div
              style={{
                fontWeight: 700, fontSize: 11,
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--violet-light)", marginBottom: 18,
              }}
            >
              {section}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {items.map((item) => {
                const isExt = item.isExternal;
                const LinkTag = isExt ? "a" : Link;
                const linkProps = isExt
                  ? { href: item.href, target: "_blank", rel: "noreferrer" }
                  : { to: item.to };

                return (
                  <LinkTag
                    key={item.label}
                    {...linkProps}
                    style={{
                      color: "var(--text-muted)", textDecoration: "none", fontSize: 13,
                      transition: "color 0.15s, transform 0.15s",
                      display: "inline-flex", alignItems: "center", gap: 6,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = "var(--text)";
                      e.currentTarget.style.transform = "translateX(2px)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = "var(--text-muted)";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 800,
                          padding: "1px 5px",
                          borderRadius: 99,
                          background: item.badge === "Live" || item.badge === "Edge" ? "rgba(0, 112, 243, 0.15)" : "rgba(16,185,129,0.15)",
                          color: item.badge === "Live" || item.badge === "Edge" ? "#60a5fa" : "#34d399",
                          border: `1px solid ${item.badge === "Live" || item.badge === "Edge" ? "rgba(0, 112, 243, 0.3)" : "rgba(16,185,129,0.3)"}`,
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isExt && (
                      <span style={{ fontSize: 10, opacity: 0.6 }}>↗</span>
                    )}
                  </LinkTag>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom-bar">
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} InterviewMate · Open source on{" "}
            <a
              href="https://github.com/siddharthagits/InterviewMate"
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--violet-light)", textDecoration: "none" }}
            >
              GitHub
            </a>
          </span>
        </div>

        <div className="footer-bottom-badge-row">
          <a
            href="https://aiinterviewmate.vercel.app/"
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: 11, fontWeight: 700,
              padding: "4px 12px", borderRadius: 99,
              background: "rgba(0, 112, 243, 0.1)",
              color: "#60a5fa",
              border: "1px solid rgba(0, 112, 243, 0.25)",
              display: "inline-flex", alignItems: "center", gap: 6,
              textDecoration: "none",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#60a5fa", display: "inline-block", boxShadow: "0 0 6px #60a5fa" }} />
            Deployed on Vercel
          </a>

          <span
            style={{
              fontSize: 11, fontWeight: 700,
              padding: "4px 12px", borderRadius: 99,
              background: "rgba(16,185,129,0.08)",
              color: "#34d399",
              border: "1px solid rgba(16,185,129,0.2)",
              display: "inline-flex", alignItems: "center", gap: 6,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", display: "inline-block", boxShadow: "0 0 6px #34d399" }} />
            All systems operational
          </span>

          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            · Powered by Google Gemini AI
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
