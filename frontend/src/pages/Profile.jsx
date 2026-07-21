import DashboardLayout from "../components/layout/DashboardLayout";

function Profile() {
  return (
    <DashboardLayout>
      <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px" }}>Profile</h1>
      <p style={{ color: "var(--text-muted)" }}>Manage your account settings.</p>
      <div className="glass" style={{ marginTop: "32px", padding: "40px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--primary), var(--cyan))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px", fontWeight: 800, color: "#fff"
          }}>U</div>
          <div>
            <p style={{ fontWeight: 700, fontSize: "18px" }}>User Name</p>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>user@example.com</p>
          </div>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "8px" }}>
          Authentication coming soon. Connect your account to save interview history.
        </p>
      </div>
    </DashboardLayout>
  );
}
export default Profile;
