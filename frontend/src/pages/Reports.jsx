import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getStoredActivities, calculateOverallStats } from "../utils/activityTracker";
import { useAuth } from "../context/AuthContext";

function Reports() {
  const { user, isLoggedIn } = useAuth();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    setActivities(getStoredActivities());
    const handleUpdate = () => setActivities(getStoredActivities());
    window.addEventListener("im_activity_updated", handleUpdate);
    window.addEventListener("im_auth_changed", handleUpdate);
    return () => {
      window.removeEventListener("im_activity_updated", handleUpdate);
      window.removeEventListener("im_auth_changed", handleUpdate);
    };
  }, [user]);

  const stats = calculateOverallStats(activities);

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(6,182,212,0.1)",
            border: "1px solid rgba(6,182,212,0.25)",
            borderRadius: 99,
            padding: "4px 14px",
            marginBottom: 12,
            fontSize: 11,
            color: "var(--cyan)",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          📈 Performance Analytics
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 6, letterSpacing: "-0.5px" }}>
              Performance Reports &amp; Insights
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              {isLoggedIn && user
                ? `Dynamic performance evaluation report for ${user.name || user.email}.`
                : "Dynamic performance evaluation report across all practice categories and tests."}
            </p>
          </div>

          {!stats.hasData && (
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: 99,
                background: "rgba(255,255,255,0.04)",
                color: "var(--text-dim)",
                border: "1px solid var(--glass-border)",
              }}
            >
              Status: Nil (No attempts yet)
            </span>
          )}
        </div>
      </div>

      {/* Top 3 High Level Report Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18, marginBottom: 28 }}>
        <div className="glass" style={{ padding: "22px 24px", borderRadius: 16 }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Overall Readiness Index</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: "var(--violet-light)", margin: "8px 0 4px", fontFamily: "'Sora', sans-serif" }}>
            {stats.hasData ? `${stats.compositeScore}/100` : "Nil"}
          </div>
          <div style={{ fontSize: 12.5, color: "var(--text-dim)" }}>
            {stats.hasData ? `Weighted across ${activities.length} completed session(s)` : "Weighted across all 6 core modules"}
          </div>
        </div>

        <div className="glass" style={{ padding: "22px 24px", borderRadius: 16 }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Voice AI Speech Metric</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: "var(--cyan)", margin: "8px 0 4px", fontFamily: "'Sora', sans-serif" }}>
            {stats.voiceClarity !== "—" ? stats.voiceClarity : "Nil"}
          </div>
          <div style={{ fontSize: 12.5, color: "var(--text-dim)" }}>
            {stats.domains.voice.count > 0 ? `${stats.domains.voice.count} voice attempt(s) recorded` : "Clarity & STAR pacing index"}
          </div>
        </div>

        <div className="glass" style={{ padding: "22px 24px", borderRadius: 16 }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Keyboard Benchmark</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: "#10b981", margin: "8px 0 4px", fontFamily: "'Sora', sans-serif" }}>
            {stats.peakTypingWpm !== "—" ? stats.peakTypingWpm : "Nil"}
          </div>
          <div style={{ fontSize: 12.5, color: "var(--text-dim)" }}>
            {stats.domains.typing.count > 0 ? `${stats.domains.typing.count} typing session(s) measured` : "Live WPM typing tracker"}
          </div>
        </div>
      </div>

      {/* Domain Proficiency Table */}
      <div className="glass" style={{ padding: "26px 30px", borderRadius: 20, marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Domain Assessment Breakdown</h3>
          <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700 }}>
            {stats.hasData ? `${activities.length} Total Logs` : "0 Sessions Recorded"}
          </span>
        </div>

        {!stats.hasData ? (
          <div style={{ padding: "36px 20px", textAlign: "center", background: "rgba(255,255,255,0.01)", borderRadius: 14, border: "1px dashed var(--glass-border)" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>📊</div>
            <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>No Test Performance Data Yet</h4>
            <p style={{ fontSize: 13.5, color: "var(--text-muted)", maxWidth: 460, margin: "0 auto 20px auto" }}>
              Your domain assessment metrics start at Nil. Complete practice tests, mock interviews, or typing challenges to populate your dynamic report.
            </p>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12 }}>
              <Link to="/setup" className="btn btn-primary" style={{ padding: "9px 20px", fontSize: 13 }}>
                Start Mock Interview →
              </Link>
              <Link to="/voice" className="btn btn-gold" style={{ padding: "9px 20px", fontSize: 13 }}>
                Launch Voice AI →
              </Link>
              <Link to="/company-assessment" className="btn btn-outline" style={{ padding: "9px 20px", fontSize: 13 }}>
                Company Tests →
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {Object.entries(stats.domains).map(([key, dom]) => (
              <div key={key} style={{ padding: "16px 20px", background: "rgba(255,255,255,0.02)", borderRadius: 14, border: "1px solid var(--glass-border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text)" }}>{dom.label}</span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 99 }}>
                      {dom.count} {dom.count === 1 ? "attempt" : "attempts"}
                    </span>
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 900, color: dom.count > 0 ? dom.color : "var(--text-dim)", fontFamily: "'Sora', sans-serif" }}>
                    {dom.count > 0 ? `${dom.score}%` : "Nil"}
                  </span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ width: `${dom.count > 0 ? dom.score : 0}%`, height: "100%", background: dom.color, borderRadius: 99, transition: "width 0.6s ease" }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Reports;
