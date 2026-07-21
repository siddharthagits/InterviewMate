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

function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState:{ errors } } = useForm();
  const onSubmit = () => navigate("/dashboard");

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        <div style={S.header}>
          <Link to="/" className="grad-text" style={{ fontSize:18, fontWeight:800, textDecoration:"none", display:"inline-block" }}>InterviewMate</Link>
          <h1 style={{ fontSize:26, fontWeight:800, marginTop:8 }}>Create account</h1>
          <p style={{ color:"var(--text-muted)", fontSize:14, marginTop:4 }}>Join InterviewMate today</p>
        </div>
        <div style={S.body}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {[
              { name:"name", label:"Full Name", type:"text", placeholder:"John Doe", rules:{ required:"Name required" } },
              { name:"email", label:"Email", type:"email", placeholder:"you@example.com", rules:{ required:"Email required" } },
              { name:"password", label:"Password", type:"password", placeholder:"••••••••", rules:{ required:"Password required", minLength:{ value:6, message:"Min 6 characters" } } },
            ].map(({ name, label, type, placeholder, rules }) => (
              <div key={name} style={S.field}>
                <label style={S.label}>{label}</label>
                <input type={type} className="input" placeholder={placeholder} {...register(name, rules)} />
                {errors[name] && <p style={S.err}>{errors[name].message}</p>}
              </div>
            ))}
            <div style={S.field}>
              <label style={S.label}>Confirm Password</label>
              <input type="password" className="input" placeholder="••••••••"
                {...register("confirm",{ validate: v => v===watch("password") || "Passwords don't match" })} />
              {errors.confirm && <p style={S.err}>{errors.confirm.message}</p>}
            </div>
            <button type="submit" className="btn btn-primary" style={{ width:"100%", marginTop:8 }}>Create Account</button>
          </form>
          <p style={{ textAlign:"center", marginTop:20, fontSize:14, color:"var(--text-muted)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color:"var(--primary-light)", fontWeight:600 }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default Register;