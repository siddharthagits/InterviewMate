import { Link } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useInterview } from "../context/InterviewContext";

function perfColor(score) {
  if (score >= 85) return "var(--green)";
  if (score >= 70) return "var(--primary-light)";
  if (score >= 55) return "var(--amber)";
  return "var(--red)";
}

function perfLabel(score) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 55) return "Average";
  return "Needs Work";
}

function Dashboard() {
  const { result, interviewData } = useInterview();
  const hasResult = !!result;
  const score = result?.score ?? null;

  const stats = hasResult
    ? [
        { label: "Last Score", value: `${score}%`, icon: "◈", color: perfColor(score) },
        { label: "MCQ Correct", value: `${result.mcq_correct ?? "-"}/${result.mcq_total ?? 25}`, icon: "🔘", color: "var(--primary-light)" },
        { label: "Code Correct", value: `${result.code_correct ?? "-"}/${result.code_total ?? 5}`, icon: "💻", color: "var(--amber)" },
        { label: "Text Score", value: `${result.text_score ?? "-"}/100`, icon: "📝", color: "var(--green)" },
        { label: "Performance", value: perfLabel(score), icon: "🏆", color: perfColor(score) },
        { label: "Total Questions", value: result.totalQuestions ?? 35, icon: "📋", color: "var(--text-dim)" },
      ]
    : [
        { label: "Interviews Completed", value: "0", icon: "▶", color: "var(--primary-light)" },
        { label: "Average Score", value: "—", icon: "◈", color: "var(--text-muted)" },
        { label: "Best Score", value: "—", icon: "🏆", color: "var(--amber)" },
      ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 6 }}>
          {hasResult ? `Last Interview Results 📊` : "Welcome 👋"}
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
          {hasResult
            ? `${interviewData.role} · ${interviewData.difficulty} · ${interviewData.language}`
            : "Start your first interview to see performance data here."}
        </p>
      </div>

      {/* Stats grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: hasResult ? "repeat(3,1fr)" : "repeat(3,1fr)",
        gap: 18, marginBottom: 32
      }}>
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Score breakdown bar (only if has result) */}
      {hasResult && (
        <div className="glass" style={{ padding: "24px 28px", marginBottom: 28 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Score Breakdown</h2>
          {[
            { label: "MCQ (50% weight)", pct: result.mcq_score ?? 0, color: "var(--primary)" },
            { label: "Code (20% weight)", pct: result.code_score ?? 0, color: "var(--amber)" },
            { label: "Text (30% weight)", pct: result.text_score ?? 0, color: "var(--green)" },
          ].map(({ label, pct, color }) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: "var(--text-muted)" }}>{label}</span>
                <span style={{ fontWeight: 600, color }}>{Math.round(pct)}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Feedback */}
      {hasResult && result.feedback && (
        <div className="glass" style={{ padding: "20px 24px", marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>AI Feedback</h2>
          <p style={{ color: "var(--text-dim)", fontSize: 14, lineHeight: 1.7 }}>{result.feedback}</p>
        </div>
      )}

      {/* Quick action */}
      <div className="glass" style={{ padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: 17 }}>
            {hasResult ? "Ready for another round?" : "Start your first interview"}
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>
            {hasResult
              ? `Last attempt: ${interviewData.role} — Score ${score}/100`
              : "Choose role, language, and difficulty to begin"}
          </p>
        </div>
        <Link to="/setup" className="btn btn-primary">
          {hasResult ? "Retry Interview ▶" : "Start Interview ▶"}
        </Link>
      </div>

      {/* View answers button */}
      {hasResult && (
        <div style={{ marginTop: 16, textAlign: "right" }}>
          <Link to="/results" style={{ fontSize: 13, color: "var(--primary-light)", textDecoration: "underline" }}>
            View full results & answer key →
          </Link>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Dashboard;