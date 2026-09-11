import { AppIcon } from "../components/common/AppIcon";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getStoredActivities, calculateOverallStats, clearActivityHistory } from "../utils/activityTracker";

function Profile() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setActivities(getStoredActivities());
    const handleUpdate = () => setActivities(getStoredActivities());
    window.addEventListener("im_activity_updated", handleUpdate);
    return () => window.removeEventListener("im_activity_updated", handleUpdate);
  }, [user]);

  const stats = calculateOverallStats(activities);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to reset all your test records and performance history? This cannot be undone.")) {
      clearActivityHistory();
    }
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : "G");

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
            fontSize: 12,
            color: "var(--violet-light)",
            fontWeight: 800,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ width: 18, height: 1.5, background: "var(--violet-light)", display: "inline-block", borderRadius: 2 }} />
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <AppIcon name="user" size={13} color="var(--violet-light)" /> User Account &amp; Credentials
          </span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 6, letterSpacing: "-0.5px" }}>
          User Profile
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Manage your account credentials, view session metadata, and control test activity logs.
        </p>
      </div>

      {isLoggedIn && user ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Main User Identity Card */}
          <div
            className="glass"
            style={{
              padding: "32px 36px",
              borderRadius: 20,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0, height: 3,
                background: "linear-gradient(90deg, var(--violet), var(--cyan), var(--gold))",
              }}
            />

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <div
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--violet), var(--cyan))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 30,
                    fontWeight: 900,
                    color: "#fff",
                    boxShadow: "0 8px 24px rgba(124,58,237,0.35)",
                    flexShrink: 0,
                  }}
                >
                  {initial}
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <h2 style={{ fontSize: 22, fontWeight: 900, margin: 0, letterSpacing: "-0.3px" }}>
                      {user.name || "InterviewMate Candidate"}
                    </h2>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        padding: "2px 10px",
                        borderRadius: 99,
                        background: "rgba(16,185,129,0.15)",
                        color: "#34d399",
                        border: "1px solid rgba(16,185,129,0.3)",
                      }}
                    >
                      Active Session
                    </span>
                  </div>
                  <p style={{ color: "var(--text-muted)", fontSize: 14, margin: "4px 0 8px 0" }}>
                    {user.email}
                  </p>
                  <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
                    User ID: <code style={{ color: "var(--cyan)", background: "rgba(0,0,0,0.2)", padding: "2px 6px", borderRadius: 4 }}>{user.id || "usr-current"}</code>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline"
                  style={{
                    padding: "10px 20px",
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 700,
                    borderColor: "rgba(239,68,68,0.4)",
                    color: "var(--red)",
                  }}
                >
                  Sign Out ⎋
                </button>
              </div>
            </div>
          </div>

          {/* User Real Performance Summary */}
          <div className="glass" style={{ padding: "26px 30px", borderRadius: 20 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 18 }}>
              Account Activity &amp; Live Performance Records
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              <div style={{ padding: "18px 20px", background: "rgba(255,255,255,0.02)", borderRadius: 14, border: "1px solid var(--glass-border)" }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Total Completed Sessions</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: "var(--violet-light)", marginTop: 6, fontFamily: "'Sora', sans-serif" }}>
                  {stats.totalActivities}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>
                  {stats.totalActivities === 0 ? "No tests taken yet" : "Real logged attempts"}
                </div>
              </div>

              <div style={{ padding: "18px 20px", background: "rgba(255,255,255,0.02)", borderRadius: 14, border: "1px solid var(--glass-border)" }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Overall Readiness Score</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: "var(--violet-light)", marginTop: 6, fontFamily: "'Sora', sans-serif" }}>
                  {stats.hasData ? `${stats.compositeScore}/100` : "Nil"}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>
                  {stats.hasData ? "Composite proficiency" : "Starts at 0 / Nil"}
                </div>
              </div>

              <div style={{ padding: "18px 20px", background: "rgba(255,255,255,0.02)", borderRadius: 14, border: "1px solid var(--glass-border)" }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Peak Typing Speed</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: "var(--violet-light)", marginTop: 6, fontFamily: "'Sora', sans-serif" }}>
                  {stats.peakTypingWpm !== "—" ? stats.peakTypingWpm : "Nil"}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>
                  {stats.domains.typing.count > 0 ? `${stats.domains.typing.count} typing test(s)` : "No typing tests yet"}
                </div>
              </div>

              <div style={{ padding: "18px 20px", background: "rgba(255,255,255,0.02)", borderRadius: 14, border: "1px solid var(--glass-border)" }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Voice AI Metric</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: "var(--violet-light)", marginTop: 6, fontFamily: "'Sora', sans-serif" }}>
                  {stats.voiceClarity !== "—" ? stats.voiceClarity : "Nil"}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>
                  {stats.domains.voice.count > 0 ? `${stats.domains.voice.count} voice session(s)` : "No voice tests yet"}
                </div>
              </div>
            </div>
          </div>

          {/* Account Data Management */}
          <div className="glass" style={{ padding: "26px 30px", borderRadius: 20 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 12 }}>
              Data &amp; Privacy Controls
            </h3>
            <p style={{ fontSize: 13.5, color: "var(--text-muted)", marginBottom: 20 }}>
              All your activity records and mock evaluation analytics are scoped to your account credentials.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              <button
                onClick={handleClearHistory}
                className="btn btn-outline"
                style={{
                  padding: "10px 18px",
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 700,
                  borderColor: "rgba(239,68,68,0.3)",
                  color: "var(--red)",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><AppIcon name="trash" size={14} color="var(--red)" /> Reset My Account Test History</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify({ user, stats, activities }, null, 2));
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2500);
                }}
                className="btn btn-outline"
                style={{ padding: "10px 18px", borderRadius: 12, fontSize: 13, fontWeight: 700 }}
              >
                {copied ? <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><AppIcon name="check" size={14} color="#10b981" /> Copied Data to Clipboard!</span> : <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><AppIcon name="clipboard" size={14} /> Export Account Data (JSON)</span>}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Guest / Not Logged In State */
        <div
          className="glass"
          style={{
            padding: "48px 36px",
            borderRadius: 20,
            textAlign: "center",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}><AppIcon name="lock" size={48} color="var(--violet-light)" /></div>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8, letterSpacing: "-0.4px" }}>
            Not Logged In
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 14.5, lineHeight: 1.6, marginBottom: 28 }}>
            Sign in with your credentials to link your test scores, track dynamic progress across sessions, and customize your AI evaluation reports.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 14 }}>
            <Link to="/login" className="btn btn-primary" style={{ padding: "11px 28px", fontSize: 14 }}>
              Sign In →
            </Link>
            <Link to="/register" className="btn btn-outline" style={{ padding: "11px 24px", fontSize: 14 }}>
              Create Account
            </Link>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Profile;
