import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const S = {
  wrap: { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 20px" },
  card: { width:"100%", maxWidth:440, background:"var(--card)", border:"1px solid var(--glass-border)", borderRadius:20, overflow:"hidden" },
  header: { padding:"32px 36px 24px", borderBottom:"1px solid var(--glass-border)" },
  body: { padding:"28px 36px 36px" },
  field: { marginBottom:20 },
  label: { display:"block", fontSize:12, fontWeight:600, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 },
  err: { color:"var(--red)", fontSize:12, marginTop:5 },
};

function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState:{ errors } } = useForm();
  const onSubmit = () => navigate("/dashboard");

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        <div style={S.header}>
          <Link to="/" className="grad-text" style={{ fontSize:18, fontWeight:800, textDecoration:"none", display:"inline-block" }}>InterviewMate</Link>
          <h1 style={{ fontSize:26, fontWeight:800, marginTop:8 }}>Welcome back</h1>
          <p style={{ color:"var(--text-muted)", fontSize:14, marginTop:4 }}>Sign in to your account</p>
        </div>
        <div style={S.body}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={S.field}>
              <label style={S.label}>Email</label>
              <input type="email" className="input" placeholder="you@example.com"
                {...register("email",{ required:"Email is required" })} />
              {errors.email && <p style={S.err}>{errors.email.message}</p>}
            </div>
            <div style={S.field}>
              <label style={S.label}>Password</label>
              <input type="password" className="input" placeholder="••••••••"
                {...register("password",{ required:"Password required", minLength:{ value:6, message:"Min 6 characters" } })} />
              {errors.password && <p style={S.err}>{errors.password.message}</p>}
            </div>
            <button type="submit" className="btn btn-primary" style={{ width:"100%", marginTop:8 }}>Sign In</button>
          </form>
          <p style={{ textAlign:"center", marginTop:20, fontSize:14, color:"var(--text-muted)" }}>
            No account?{" "}
            <Link to="/register" style={{ color:"var(--primary-light)", fontWeight:600 }}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default Login;