import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{
      display:"flex", justifyContent:"space-between", alignItems:"center",
      padding:"18px 48px",
      background:"transparent", backdropFilter:"none",
      borderBottom:"none",
      position:"absolute", top:0, zIndex:100, width:"100%"
    }}>
      <Link to="/" className="grad-text" style={{ fontSize:22, fontWeight:800, textDecoration:"none" }}>InterviewMate</Link>
      <div style={{ display:"flex", alignItems:"center", gap:16 }}>
        <Link
          to="/mock-tests"
          style={{ fontSize:14, color:"var(--text-muted)", textDecoration:"none", fontWeight:500, transition:"color 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.color = "#67e8f9"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
        >
          🎯 Mock Tests
        </Link>
        <Link to="/login" className="btn btn-outline" style={{ padding:"8px 18px", fontSize:14 }}>Login</Link>
        <Link to="/register" className="btn btn-primary" style={{ padding:"8px 18px", fontSize:14 }}>Get Started</Link>
      </div>
    </nav>
  );
}
export default Navbar;
