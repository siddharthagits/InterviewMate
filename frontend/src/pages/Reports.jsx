import DashboardLayout from "../components/layout/DashboardLayout";

function Reports() {
  return (
    <DashboardLayout>
      <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px" }}>Reports</h1>
      <p style={{ color: "var(--text-muted)" }}>Performance analytics will appear here.</p>
      <div className="glass" style={{ marginTop: "32px", padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>◈</div>
        <p style={{ fontSize: "16px" }}>No data to report yet</p>
        <p style={{ fontSize: "13px", marginTop: "8px" }}>Complete at least one interview to generate reports.</p>
      </div>
    </DashboardLayout>
  );
}
export default Reports;
