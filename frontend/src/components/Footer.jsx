import { Link } from "react-router-dom";

// SVG Social Icons
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

const links = {
  Platform: [
    { label: "Start Interview", to: "/setup" },
    { label: "Dashboard", to: "/dashboard" },
    { label: "History", to: "/history" },
    { label: "Profile", to: "/profile" },
  ],
  "Mock Tests": [
    { label: "All Mock Tests", to: "/mock-tests" },
  ],
  Account: [
    { label: "Login", to: "/login" },
    { label: "Register", to: "/register" },
  ],
};

function Footer() {
  return (
    <footer
      style={{
        background: "var(--sidebar)",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        padding: "64px 48px 0",
        color: "var(--text-muted)",
        fontSize: 13,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow top */}
      <div
        style={{
          position: "absolute",
          top: 0, left: "50%",
          transform: "translateX(-50%)",
          width: 600, height: 2,
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
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 40,
          paddingBottom: 52,
          position: "relative",
        }}
      >
        {/* Brand column */}
        <div>
          <span
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 900,
              fontSize: 24,
              display: "block",
              marginBottom: 16,
              background: "linear-gradient(135deg, #c4b5fd 0%, #06b6d4 60%, #fcd34d 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.5px",
            }}
          >
            InterviewMate
          </span>
          <p style={{ lineHeight: 1.8, maxWidth: 280, color: "var(--text-muted)", fontSize: 13 }}>
            AI-powered mock interview platform to help you ace technical interviews. Practice MCQs, code output, and in-depth answers — with instant Gemini AI feedback.
          </p>

          {/* Social icons */}
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            {[
              { icon: <GithubIcon />, label: "GitHub" },
              { icon: <TwitterIcon />, label: "Twitter" },
              { icon: <LinkedinIcon />, label: "LinkedIn" },
            ].map(({ icon, label }) => (
              <button
                key={label}
                title={label}
                style={{
                  width: 38, height: 38,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--text-muted)",
                  cursor: "pointer",
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
              </button>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(links).map(([section, items]) => (
          <div key={section}>
            <div
              style={{
                fontWeight: 700, fontSize: 11,
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--violet-light)", marginBottom: 20,
              }}
            >
              {section}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {items.map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  style={{
                    color: "var(--text-muted)", textDecoration: "none", fontSize: 13,
                    transition: "color 0.15s",
                    display: "inline-flex", alignItems: "center", gap: 6,
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.04)",
          padding: "20px 0",
          maxWidth: 1200, margin: "0 auto",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 10,
          position: "relative",
        }}
      >
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
          © {new Date().getFullYear()} InterviewMate. All rights reserved.
        </span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span
            style={{
              fontSize: 11, fontWeight: 700,
              padding: "3px 12px", borderRadius: 99,
              background: "rgba(16,185,129,0.08)",
              color: "#34d399",
              border: "1px solid rgba(16,185,129,0.2)",
              display: "flex", alignItems: "center", gap: 5,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", display: "inline-block", boxShadow: "0 0 6px #34d399" }} />
            All systems operational
          </span>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            · Built with ❤️ using Gemini AI
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
