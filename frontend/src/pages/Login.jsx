import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import GoogleAuthModal from "../components/GoogleAuthModal";
import { getGoogleClientId, promptGoogleAccountPicker, ensureGoogleScriptLoaded } from "../utils/googleAuth";
import { IconGoogleLogo, IconAlertCircle } from "../components/common/AppIcon";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, socialLogin, googleLogin } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [email, setEmail] = useState(() => location.state?.prefillEmail || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  useEffect(() => {
    const cid = getGoogleClientId();
    if (!cid) return;
    let mounted = true;
    ensureGoogleScriptLoaded().then(() => {
      if (!mounted || !window.google?.accounts?.id) return;
      try {
        window.google.accounts.id.initialize({
          client_id: cid,
          callback: async (response) => {
            if (response.credential) {
              try {
                setSocialLoading("Google");
                await googleLogin(response.credential);
                navigate("/dashboard");
              } catch (err) { setAuthError(err.message || "Google Sign-In failed"); }
              finally { setSocialLoading(null); }
            }
          },
          auto_select: false,
        });
        window.google.accounts.id.prompt();
      } catch (err) { console.warn("[Google Auth]", err); }
    });
    return () => { mounted = false; };
  }, []);

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = "Enter a valid email";
    if (!password) errs.password = "Password is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;
    try {
      setIsSubmitting(true);
      await login(email.trim().toLowerCase(), password);
      navigate("/dashboard");
    } catch (err) { setAuthError(err.message || "Failed to sign in. Please check your credentials."); }
    finally { setIsSubmitting(false); }
  };

  const handleGoogleClick = async () => {
    const cid = getGoogleClientId();
    if (!cid) { setShowGoogleModal(true); return; }
    try {
      setSocialLoading("Google");
      setAuthError("");
      const profile = await promptGoogleAccountPicker(cid);
      await socialLogin({ name: profile.name, email: profile.email, picture: profile.picture, provider: "Google" });
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "MISSING_CLIENT_ID") setShowGoogleModal(true);
      else setAuthError(err.message || "Google Sign-In failed.");
    } finally { setSocialLoading(null); }
  };

  const handleGoogleSuccess = async (profile) => {
    try {
      setSocialLoading("Google");
      await socialLogin({ name: profile.name, email: profile.email, picture: profile.picture, provider: "Google" });
      navigate("/dashboard");
    } catch (err) { setAuthError(err.message || "Google Sign-In failed."); }
    finally { setSocialLoading(null); }
  };

  const busy = isSubmitting || !!socialLoading;

  return (
    <div className={`auth-page ${isLight ? "light" : "dark"}`}>
      {/* Floating decorative shapes */}
      <div className="auth-shapes" aria-hidden="true">
        {/* Neural/brain signal shape */}
        <svg className="auth-shape shape-1" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 4" opacity="0.4"/>
          <circle cx="60" cy="60" r="30" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
          <path d="M40 60 Q50 40 60 60 Q70 80 80 60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7"/>
          <circle cx="40" cy="60" r="4" fill="currentColor" opacity="0.6"/>
          <circle cx="80" cy="60" r="4" fill="currentColor" opacity="0.6"/>
          <circle cx="60" cy="35" r="3" fill="currentColor" opacity="0.4"/>
          <circle cx="60" cy="85" r="3" fill="currentColor" opacity="0.4"/>
        </svg>
        {/* Resume/document shape */}
        <svg className="auth-shape shape-2" viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="80" height="110" rx="8" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
          <rect x="22" y="28" width="45" height="7" rx="3" fill="currentColor" opacity="0.3"/>
          <rect x="22" y="44" width="56" height="4" rx="2" fill="currentColor" opacity="0.22"/>
          <rect x="22" y="54" width="50" height="4" rx="2" fill="currentColor" opacity="0.22"/>
          <rect x="22" y="64" width="38" height="4" rx="2" fill="currentColor" opacity="0.18"/>
          <rect x="22" y="80" width="56" height="4" rx="2" fill="currentColor" opacity="0.22"/>
          <rect x="22" y="90" width="44" height="4" rx="2" fill="currentColor" opacity="0.18"/>
        </svg>
        {/* Chat / interview bubble */}
        <svg className="auth-shape shape-3" viewBox="0 0 110 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="8" width="70" height="50" rx="12" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
          <path d="M20 58 L28 73 L36 58" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4"/>
          <circle cx="28" cy="33" r="4" fill="currentColor" opacity="0.35"/>
          <circle cx="44" cy="33" r="4" fill="currentColor" opacity="0.35"/>
          <circle cx="60" cy="33" r="4" fill="currentColor" opacity="0.35"/>
        </svg>
        {/* Achievement star */}
        <svg className="auth-shape shape-4" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="40,8 47,32 72,32 52,47 59,71 40,56 21,71 28,47 8,32 33,32"
            stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4"/>
          <polygon points="40,22 43,33 55,33 46,40 49,51 40,44 31,51 34,40 25,33 37,33"
            fill="currentColor" opacity="0.18"/>
        </svg>
        <div className="auth-orb orb-1" />
        <div className="auth-orb orb-2" />
        <div className="auth-orb orb-3" />
      </div>

      {/* Top bar */}
      <header className="auth-header">
        <Link to="/" className="auth-back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
        <Link to="/" className="auth-brand">InterviewMate</Link>
        <Link to="/register" className="auth-switch-btn">Sign Up</Link>
      </header>

      {/* Main layout */}
      <main className="auth-main">

        {/* Centered auth panel */}
        <div className="auth-right-panel">
          <div className="auth-card">
            <div className="auth-card-accent" />
            <div className="auth-card-body">
              <div className="auth-card-header">
                <div className="auth-avatar-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <h1 className="auth-card-title">Welcome Back</h1>
                <p className="auth-card-subtitle">Sign in to your InterviewMate account</p>
              </div>

              <button type="button" onClick={handleGoogleClick} disabled={busy} className="auth-google-btn">
                <IconGoogleLogo size={18} />
                <span>{socialLoading === "Google" ? "Signing in..." : "Continue with Google"}</span>
              </button>

              <div className="auth-divider">
                <div className="auth-divider-line" />
                <span className="auth-divider-text">or sign in with email</span>
                <div className="auth-divider-line" />
              </div>

              {authError && (
                <div className="auth-error-banner">
                  <IconAlertCircle size={15} color="var(--red)" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="auth-field">
                  <label className="auth-label" htmlFor="login-email">Email Address</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/>
                      </svg>
                    </span>
                    <input id="login-email" type="email" value={email}
                      onChange={e => { setEmail(e.target.value); setFieldErrors(f => ({ ...f, email: "" })); setAuthError(""); }}
                      placeholder="you@example.com" autoComplete="email"
                      className={`auth-input ${fieldErrors.email ? "auth-input-error" : ""}`}
                    />
                  </div>
                  {fieldErrors.email && <p className="auth-field-error">{fieldErrors.email}</p>}
                </div>

                <div className="auth-field">
                  <div className="auth-label-row">
                    <label className="auth-label" htmlFor="login-password">Password</label>
                    <Link to="/forgot-password" className="auth-forgot-link">Forgot password?</Link>
                  </div>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </span>
                    <input id="login-password" type={showPassword ? "text" : "password"} value={password}
                      onChange={e => { setPassword(e.target.value); setFieldErrors(f => ({ ...f, password: "" })); setAuthError(""); }}
                      placeholder="••••••••" autoComplete="current-password"
                      className={`auth-input auth-input-pr ${fieldErrors.password ? "auth-input-error" : ""}`}
                    />
                    <button type="button" onClick={() => setShowPassword(p => !p)} className="auth-eye-btn"
                      aria-label={showPassword ? "Hide password" : "Show password"}>
                      {showPassword ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {fieldErrors.password && <p className="auth-field-error">{fieldErrors.password}</p>}
                </div>

                <button id="login-submit" type="submit" disabled={busy} className="auth-submit-btn">
                  {isSubmitting ? <><AuthSpinner /> Signing in...</> : "Sign In"}
                </button>
              </form>

              <p className="auth-switch-text">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="auth-link">Create Account</Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <GoogleAuthModal isOpen={showGoogleModal} onClose={() => setShowGoogleModal(false)}
        onSuccess={handleGoogleSuccess} onError={(msg) => setAuthError(msg)} />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float1 { 0%,100% { transform:translateY(0px) rotate(0deg); } 50% { transform:translateY(-18px) rotate(5deg); } }
        @keyframes float2 { 0%,100% { transform:translateY(0px) rotate(0deg); } 50% { transform:translateY(14px) rotate(-6deg); } }
        @keyframes float3 { 0%,100% { transform:translateY(0px) rotate(0deg); } 50% { transform:translateY(-10px) rotate(8deg); } }
        @keyframes float4 { 0%,100% { transform:translateY(0px) rotate(0deg); } 50% { transform:translateY(20px) rotate(-4deg); } }
        @keyframes pulse-orb { 0%,100% { opacity:0.4; transform:scale(1); } 50% { opacity:0.65; transform:scale(1.08); } }

        .auth-page { min-height:100vh; display:flex; flex-direction:column; background:var(--bg); color:var(--text); position:relative; overflow:hidden; font-family:'Inter',sans-serif; }
        .auth-shapes { position:fixed; inset:0; z-index:0; pointer-events:none; }
        .auth-shape { position:absolute; color:var(--violet); }
        .auth-page.light .auth-shape { opacity:0.5; }
        .auth-page.dark .auth-shape { opacity:1; }
        .shape-1 { width:140px; height:140px; top:6%; right:7%; animation:float1 7s ease-in-out infinite; filter:drop-shadow(0 0 16px rgba(124,58,237,0.4)); }
        .shape-2 { width:110px; height:140px; bottom:9%; left:4%; animation:float2 9s ease-in-out infinite; filter:drop-shadow(0 0 12px rgba(124,58,237,0.3)); }
        .shape-3 { width:110px; height:90px; top:20%; left:5%; animation:float3 8s ease-in-out infinite; filter:drop-shadow(0 0 12px rgba(124,58,237,0.3)); }
        .shape-4 { width:90px; height:90px; bottom:22%; right:5%; animation:float4 10s ease-in-out infinite; filter:drop-shadow(0 0 10px rgba(124,58,237,0.25)); }
        .auth-orb { position:absolute; border-radius:50%; filter:blur(60px); animation:pulse-orb 6s ease-in-out infinite; pointer-events:none; }
        .orb-1 { width:300px; height:300px; background:var(--violet-glow); top:-80px; left:-60px; }
        .orb-2 { width:220px; height:220px; background:rgba(6,182,212,0.10); bottom:40px; right:-60px; animation-delay:2s; }
        .orb-3 { width:160px; height:160px; background:var(--violet-subtle); top:50%; left:50%; transform:translate(-50%,-50%); animation-delay:4s; }
        .auth-page.light .orb-1 { background:rgba(124,58,237,0.08); }
        .auth-page.light .orb-2 { background:rgba(6,182,212,0.05); }
        .auth-page.light .orb-3 { background:rgba(124,58,237,0.04); }

        .auth-header { position:relative; z-index:10; display:flex; align-items:center; justify-content:space-between; padding:16px 28px; border-bottom:1px solid var(--glass-border); backdrop-filter:blur(10px); }
        .auth-back-link { display:flex; align-items:center; gap:7px; text-decoration:none; color:var(--text-muted); font-size:13px; font-weight:600; transition:color 0.2s; }
        .auth-back-link:hover { color:var(--violet-light); }
        .auth-brand { font-family:'Sora',sans-serif; font-size:19px; font-weight:900; text-decoration:none; background:linear-gradient(135deg,var(--violet-light) 0%,var(--cyan) 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; letter-spacing:-0.5px; }
        .auth-switch-btn { font-size:13px; font-weight:700; color:var(--violet-light); text-decoration:none; padding:7px 18px; border:1px solid var(--border); border-radius:99px; background:var(--violet-subtle); transition:all 0.2s ease; }
        .auth-switch-btn:hover { background:rgba(124,58,237,0.15); border-color:var(--border-hover); }

        .auth-main { flex:1; display:flex; align-items:center; justify-content:center; position:relative; z-index:5; padding:40px 20px; }

        .auth-right-panel { width:100%; max-width:460px; display:flex; align-items:center; justify-content:center; }
        .auth-card { width:100%; max-width:420px; background:var(--card); backdrop-filter:blur(24px); border:1px solid var(--glass-border); border-radius:20px; overflow:hidden; box-shadow:0 24px 60px rgba(0,0,0,0.22),0 0 0 1px var(--border); }
        .auth-page.light .auth-card { box-shadow:0 8px 40px rgba(124,58,237,0.10),0 1px 4px rgba(0,0,0,0.07); }
        .auth-card-accent { height:3px; background:linear-gradient(90deg,var(--violet) 0%,var(--cyan) 100%); }
        .auth-card-body { padding:30px 32px 36px; }

        .auth-card-header { text-align:center; margin-bottom:24px; }
        .auth-avatar-icon { width:52px; height:52px; border-radius:14px; background:var(--violet-subtle); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; margin:0 auto 14px; color:var(--violet-light); box-shadow:0 4px 20px var(--violet-glow); }
        .auth-page.light .auth-avatar-icon { box-shadow:0 4px 16px rgba(124,58,237,0.12); }
        .auth-card-title { font-size:24px; font-weight:800; margin:0 0 6px; color:var(--text); letter-spacing:-0.4px; }
        .auth-card-subtitle { font-size:13.5px; color:var(--text-muted); margin:0; }

        .auth-google-btn { width:100%; display:flex; align-items:center; justify-content:center; gap:10px; padding:11px 18px; margin-bottom:18px; background:var(--glass); border:1px solid var(--glass-border); border-radius:11px; color:var(--text); font-size:14px; font-weight:600; cursor:pointer; transition:all 0.2s ease; font-family:inherit; }
        .auth-google-btn:hover:not(:disabled) { background:var(--violet-subtle); border-color:var(--border); }
        .auth-google-btn:disabled { opacity:0.6; cursor:not-allowed; }

        .auth-divider { display:flex; align-items:center; gap:10px; margin-bottom:18px; }
        .auth-divider-line { flex:1; height:1px; background:var(--glass-border); }
        .auth-divider-text { font-size:11.5px; font-weight:600; color:var(--text-muted); white-space:nowrap; }

        .auth-error-banner { display:flex; align-items:flex-start; gap:9px; padding:10px 13px; margin-bottom:16px; background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.25); border-radius:10px; color:#ef4444; font-size:13px; }
        .auth-page.light .auth-error-banner { background:rgba(239,68,68,0.05); }

        .auth-field { margin-bottom:15px; }
        .auth-label-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:7px; }
        .auth-label { display:block; font-size:12px; font-weight:700; color:var(--violet-light); margin-bottom:7px; letter-spacing:0.02em; }
        .auth-label-row .auth-label { margin-bottom:0; }
        .auth-forgot-link { font-size:11.5px; font-weight:600; color:var(--text-muted); background:none; border:none; cursor:pointer; font-family:inherit; text-decoration:none; transition:color 0.2s; }
        .auth-forgot-link:hover { color:var(--violet-light); }

        .auth-input-wrap { position:relative; }
        .auth-input-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:var(--text-muted); pointer-events:none; opacity:0.5; display:flex; align-items:center; }
        .auth-input { width:100%; box-sizing:border-box; padding:11px 14px 11px 40px; background:var(--glass); border:1px solid var(--glass-border); border-radius:10px; color:var(--text); font-size:13.5px; font-family:inherit; outline:none; transition:border-color 0.2s,box-shadow 0.2s; }
        .auth-input.auth-input-pr { padding-right:44px; }
        .auth-input::placeholder { color:var(--text-muted); opacity:0.5; }
        .auth-input:focus { border-color:var(--violet); box-shadow:0 0 0 3px var(--violet-subtle); }
        .auth-input.auth-input-error { border-color:rgba(239,68,68,0.5); }
        .auth-input.auth-input-error:focus { box-shadow:0 0 0 3px rgba(239,68,68,0.08); }
        .auth-eye-btn { position:absolute; right:11px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; padding:4px; border-radius:6px; color:var(--text-muted); opacity:0.6; display:flex; align-items:center; }
        .auth-eye-btn:hover { opacity:1; }
        .auth-field-error { margin:5px 0 0; font-size:11.5px; color:#ef4444; font-weight:600; }

        .auth-submit-btn { width:100%; padding:12px 20px; margin-top:6px; font-size:14px; font-weight:700; background:linear-gradient(135deg,var(--violet) 0%,var(--violet-dark) 100%); border:none; border-radius:11px; color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 4px 16px var(--violet-glow); transition:all 0.2s ease; font-family:inherit; letter-spacing:0.01em; }
        .auth-submit-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 24px var(--violet-glow); }
        .auth-submit-btn:disabled { opacity:0.7; cursor:not-allowed; transform:none; }

        .auth-switch-text { text-align:center; margin-top:20px; font-size:13px; color:var(--text-muted); }
        .auth-link { color:var(--violet-light); font-weight:700; text-decoration:none; border-bottom:1px solid transparent; transition:border-color 0.2s; }
        .auth-link:hover { border-bottom-color:var(--violet-light); }
      `}</style>
    </div>
  );
}

function AuthSpinner() {
  return (
    <span style={{ display:"inline-block", width:14, height:14, borderRadius:"50%", border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", animation:"spin 0.7s linear infinite" }} />
  );
}
