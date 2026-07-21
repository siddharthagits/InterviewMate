import DashboardLayout from "../components/layout/DashboardLayout";

function History() {
  return (
    <DashboardLayout>
      <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px" }}>Interview History</h1>
      <p style={{ color: "var(--text-muted)" }}>Your past interviews will appear here.</p>
      <div className="glass" style={{ marginTop: "32px", padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>◷</div>
        <p style={{ fontSize: "16px" }}>No interview history yet</p>
        <p style={{ fontSize: "13px", marginTop: "8px" }}>Complete your first interview to see results here.</p>
      </div>
    </DashboardLayout>
  );
}
export default History;
