<<<<<<< HEAD
function Footer() {
  return (
    <footer style={{
      background:"var(--sidebar)", borderTop:"1px solid var(--glass-border)",
      padding:"28px 48px", textAlign:"center",
      color:"var(--text-muted)", fontSize:13
    }}>
      <span className="grad-text" style={{ fontWeight:800, fontSize:15 }}>InterviewMate</span>
      <span style={{ margin:"0 12px" }}>·</span>
      AI-powered mock interview platform
      <span style={{ margin:"0 12px" }}>·</span>
      © 2025
    </footer>
  );
}
=======
import { Link } from "react-router-dom";

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
    <footer style={{
      background: "var(--sidebar)",
      borderTop: "1px solid var(--glass-border)",
      padding: "60px 48px 0",
      color: "var(--text-muted)",
      fontSize: 13,
    }}>
      {/* Main grid */}
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr",
        gap: 40,
        paddingBottom: 48,
      }}>

        {/* Brand column */}
        <div>
          <span className="grad-text" style={{ fontWeight: 900, fontSize: 22, display: "block", marginBottom: 14 }}>
            InterviewMate
          </span>
          <p style={{ lineHeight: 1.75, maxWidth: 280, color: "var(--text-muted)", fontSize: 13 }}>
            AI-powered mock interview platform to help you ace technical interviews. Practice MCQs, code output, and in-depth answers — with instant AI feedback.
          </p>
          {/* Socials / badges */}
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            {[
              { icon: "🐙", label: "GitHub" },
              { icon: "🐦", label: "Twitter" },
              { icon: "💼", label: "LinkedIn" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                title={label}
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, cursor: "pointer",
                  transition: "all 0.18s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.15)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
              >
                {icon}
              </div>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(links).map(([section, items]) => (
          <div key={section}>
            <div style={{ fontWeight: 700, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 18 }}>
              {section}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {items.map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  style={{
                    color: "var(--text-muted)", textDecoration: "none", fontSize: 13,
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--primary-light)"}
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
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "18px 0",
        maxWidth: 1200, margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 10,
      }}>
        <span style={{ fontSize: 12 }}>© {new Date().getFullYear()} InterviewMate. All rights reserved.</span>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99,
            background: "rgba(16,185,129,0.12)", color: "#34d399",
            border: "1px solid rgba(16,185,129,0.3)",
          }}>
            🟢 All systems operational
          </span>
          <span style={{ fontSize: 12 }}>· Built with ❤️</span>
        </div>
      </div>
    </footer>
  );
}

>>>>>>> cb25cce (Initial commit)
export default Footer;