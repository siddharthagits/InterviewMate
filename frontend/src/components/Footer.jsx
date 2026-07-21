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
export default Footer;