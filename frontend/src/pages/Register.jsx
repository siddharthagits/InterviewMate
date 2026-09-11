import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import GoogleAuthModal from "../components/GoogleAuthModal";
import { getGoogleClientId, promptGoogleAccountPicker, ensureGoogleScriptLoaded } from "../utils/googleAuth";
import { IconGoogleLogo, IconAlertCircle } from "../components/common/AppIcon";
import OtpInput from "../components/common/OtpInput";

function AuthSpinner() {
  return (
    <span style={{ display:"inline-block", width:14, height:14, borderRadius:"50%", border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", animation:"spin 0.7s linear infinite" }} />
  );
}

function PasswordField({ id, value, onChange, placeholder, autoComplete, hasError }) {
  const [show, setShow] = useState(false);
  return (
    <div className="auth-input-wrap">
      <span className="auth-input-icon">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </span>
      <input id={id} type={show ? "text" : "password"} value={value} onChange={onChange}
        placeholder={placeholder} autoComplete={autoComplete}
        className={`auth-input auth-input-pr${hasError ? " auth-input-error" : ""}`}
      />
      <button type="button" onClick={() => setShow(p => !p)} className="auth-eye-btn"
        aria-label={show ? "Hide password" : "Show password"}>
        {show ? (
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
  );
}

export default function Register() {
  const navigate = useNavigate();
  const { registerUser, sendRegisterOtp, socialLogin, googleLogin } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [step, setStep] = useState(1); // 1 = Details, 2 = 4-digit OTP email verification
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [infoMessage, setInfoMessage] = useState("");
  const [authError, setAuthError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // ── Disposable email domain blocklist (frontend quick-check) ──────────────
  const DISPOSABLE_DOMAINS = new Set([
    "mailinator.com","trashmail.com","guerrillamail.com","guerrillamail.net",
    "guerrillamail.de","guerrillamail.org","yopmail.com","yopmail.fr",
    "spam4.me","tempmail.com","temp-mail.org","temp-mail.io",
    "throwam.com","fakeinbox.com","dispostable.com","maildrop.cc",
    "mailnull.com","10minutemail.com","10minutemail.net","10mail.org",
    "20minutemail.com","sharklasers.com","grr.la","jourrapide.com",
    "discard.email","getairmail.com","emailondeck.com",
    "trashmail.at","trashmail.io","trashmail.me","trashmail.net",
    "trashmail.xyz","trashmailer.com","mailexpire.com",
    "mytrashmail.com","tempmail.de","tempmail.eu","tempr.email",
    "spamgourmet.com","spambob.com","spaml.com","spambox.us",
    "jetable.com","jetable.net","jetable.org",
  ]);

  // ── Password strength ─────────────────────────────────────────────────────
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-zA-Z]/.test(pwd) && /[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    const levels = [
      { label: "Too short", color: "#ef4444" },
      { label: "Weak",      color: "#f97316" },
      { label: "Fair",      color: "#eab308" },
      { label: "Good",      color: "#22c55e" },
      { label: "Strong",    color: "#10b981" },
    ];
    return { score, ...levels[score] };
  };
  const pwStrength = getPasswordStrength(password);

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
              } catch (err) { setAuthError(err.message || "Google registration failed"); }
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
    if (!name.trim()) errs.name = "Full name is required";
    else if (name.trim().length < 2) errs.name = "Name must be at least 2 characters";
    if (!email.trim()) {
      errs.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Enter a valid email address";
    } else {
      const domain = email.trim().toLowerCase().split("@")[1];
      if (DISPOSABLE_DOMAINS.has(domain)) {
        errs.email = "Disposable or temporary email addresses are not allowed. Please use a real email.";
      }
    }
    if (!password) {
      errs.password = "Password is required";
    } else if (password.length < 8) {
      errs.password = "Password must be at least 8 characters";
    } else if (!/[a-zA-Z]/.test(password)) {
      errs.password = "Password must contain at least one letter";
    } else if (!/[0-9]/.test(password)) {
      errs.password = "Password must contain at least one number";
    }
    if (!confirmPassword) errs.confirmPassword = "Confirm your password";
    else if (confirmPassword !== password) errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleInitiateRegister = async (e) => {
    e.preventDefault();
    setAuthError("");
    setInfoMessage("");
    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;
    try {
      setIsSubmitting(true);
      const res = await sendRegisterOtp(email.trim().toLowerCase(), name.trim());
      setInfoMessage(res?.message || "A 4-digit verification code has been sent to your email.");
      setCountdown(30);
      setStep(2);
    } catch (err) {
      setAuthError(err.message || "Failed to send verification code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || isSubmitting) return;
    setAuthError("");
    setInfoMessage("");
    try {
      setIsSubmitting(true);
      const res = await sendRegisterOtp(email.trim().toLowerCase(), name.trim());
      setInfoMessage("A new 4-digit verification code has been sent to your email.");
      setCountdown(30);
    } catch (err) {
      setAuthError(err.message || "Failed to resend code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtpAndRegister = async (e) => {
    e.preventDefault();
    setAuthError("");
    setInfoMessage("");

    if (!otp.trim() || otp.trim().length !== 4) {
      setFieldErrors({ otp: "Please enter the 4-digit code" });
      return;
    }

    try {
      setIsSubmitting(true);
      await registerUser(name.trim(), email.trim().toLowerCase(), password, otp.trim(), gender || null);
      navigate("/dashboard");
    } catch (err) {
      setAuthError(err.message || "Failed to create account. Please check the code and try again.");
    } finally {
      setIsSubmitting(false);
    }
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
    } catch (err) { setAuthError(err.message || "Google registration failed."); }
    finally { setSocialLoading(null); }
  };

  const busy = isSubmitting || !!socialLoading;
  const clearErr = (field) => setFieldErrors(f => ({ ...f, [field]: "" }));

  return (
    <div className={`auth-page ${isLight ? "light" : "dark"}`}>
      {/* Floating decorative shapes */}
      <div className="auth-shapes" aria-hidden="true">
        <svg className="auth-shape shape-1" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 4" opacity="0.4"/>
          <circle cx="60" cy="60" r="30" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
          <path d="M40 60 Q50 40 60 60 Q70 80 80 60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7"/>
          <circle cx="40" cy="60" r="4" fill="currentColor" opacity="0.6"/>
          <circle cx="80" cy="60" r="4" fill="currentColor" opacity="0.6"/>
          <circle cx="60" cy="35" r="3" fill="currentColor" opacity="0.4"/>
          <circle cx="60" cy="85" r="3" fill="currentColor" opacity="0.4"/>
        </svg>
        <svg className="auth-shape shape-2" viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="80" height="110" rx="8" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
          <rect x="22" y="28" width="45" height="7" rx="3" fill="currentColor" opacity="0.3"/>
          <rect x="22" y="44" width="56" height="4" rx="2" fill="currentColor" opacity="0.22"/>
          <rect x="22" y="54" width="50" height="4" rx="2" fill="currentColor" opacity="0.22"/>
          <rect x="22" y="64" width="38" height="4" rx="2" fill="currentColor" opacity="0.18"/>
          <rect x="22" y="80" width="56" height="4" rx="2" fill="currentColor" opacity="0.22"/>
          <rect x="22" y="90" width="44" height="4" rx="2" fill="currentColor" opacity="0.18"/>
        </svg>
        <svg className="auth-shape shape-3" viewBox="0 0 110 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="8" width="70" height="50" rx="12" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
          <path d="M20 58 L28 73 L36 58" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4"/>
          <circle cx="28" cy="33" r="4" fill="currentColor" opacity="0.35"/>
          <circle cx="44" cy="33" r="4" fill="currentColor" opacity="0.35"/>
          <circle cx="60" cy="33" r="4" fill="currentColor" opacity="0.35"/>
        </svg>
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
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link to="/login" className="auth-link">Sign In</Link>
        </div>
      </header>

      {/* Main layout */}
      <main className="auth-main">

        {/* Centered auth panel */}
        <div className="auth-right-panel">
          <div className="auth-card">
            <div className="auth-card-accent" />
            <div className="auth-card-body">
              {step === 1 ? (
                <>
                  <div className="auth-card-header">
                    <div className="auth-avatar-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <line x1="19" y1="8" x2="19" y2="14"/>
                        <line x1="22" y1="11" x2="16" y2="11"/>
                      </svg>
                    </div>
                    <h1 className="auth-card-title">Create Account</h1>
                    <p className="auth-card-subtitle">Start your AI interview prep journey for free</p>
                  </div>

                  <button type="button" onClick={handleGoogleClick} disabled={busy} className="auth-google-btn">
                    <IconGoogleLogo size={18} />
                    <span>{socialLoading === "Google" ? "Signing up..." : "Sign up with Google"}</span>
                  </button>

                  <div className="auth-divider">
                    <div className="auth-divider-line" />
                    <span className="auth-divider-text">or create with email</span>
                    <div className="auth-divider-line" />
                  </div>

                  {authError && (
                    <div className="auth-error-banner">
                      <IconAlertCircle size={15} color="var(--red)" style={{ flexShrink: 0, marginTop: 1 }} />
                      <span>{authError}</span>
                    </div>
                  )}

                  <form onSubmit={handleInitiateRegister} noValidate>
                    <div className="auth-field">
                      <label className="auth-label" htmlFor="register-name">Full Name</label>
                      <div className="auth-input-wrap">
                        <span className="auth-input-icon">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                          </svg>
                        </span>
                        <input id="register-name" type="text" value={name}
                          onChange={e => { setName(e.target.value); clearErr("name"); setAuthError(""); }}
                          placeholder="e.g. Alex Morgan" autoComplete="name"
                          className={`auth-input ${fieldErrors.name ? "auth-input-error" : ""}`}
                        />
                      </div>
                      {fieldErrors.name && <p className="auth-field-error">{fieldErrors.name}</p>}
                    </div>

                    <div className="auth-field">
                      <label className="auth-label" htmlFor="register-email">Email Address</label>
                      <div className="auth-input-wrap">
                        <span className="auth-input-icon">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/>
                          </svg>
                        </span>
                        <input id="register-email" type="email" value={email}
                          onChange={e => { setEmail(e.target.value); clearErr("email"); setAuthError(""); }}
                          placeholder="you@example.com" autoComplete="email"
                          className={`auth-input ${fieldErrors.email ? "auth-input-error" : ""}`}
                        />
                      </div>
                      {fieldErrors.email && <p className="auth-field-error">{fieldErrors.email}</p>}
                    </div>

                    <div className="auth-field">
                      <label className="auth-label">Gender <span style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 500 }}>(Optional)</span></label>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 4 }}>
                        {["Male", "Female", "Other"].map((g) => {
                          const active = gender === g;
                          return (
                            <button
                              key={g}
                              type="button"
                              onClick={() => {
                                setGender(active ? "" : g);
                                setAuthError("");
                              }}
                              className={`gender-select-btn ${active ? "active" : ""}`}
                            >
                              {active && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />}
                              {g}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="auth-field">
                      <label className="auth-label" htmlFor="register-password">Password</label>
                      <PasswordField id="register-password" value={password}
                        onChange={e => { setPassword(e.target.value); clearErr("password"); setAuthError(""); }}
                        placeholder="8+ chars with letters & numbers" autoComplete="new-password"
                        hasError={!!fieldErrors.password}
                      />
                      {password && (
                        <div className="pw-strength-wrap">
                          <div className="pw-strength-bars">
                            {[1,2,3,4].map(i => (
                              <div key={i} className="pw-strength-bar"
                                style={{ background: i <= pwStrength.score ? pwStrength.color : "var(--glass-border)" }}
                              />
                            ))}
                          </div>
                          {pwStrength.label && (
                            <span className="pw-strength-label" style={{ color: pwStrength.color }}>
                              {pwStrength.label}
                            </span>
                          )}
                        </div>
                      )}
                      {fieldErrors.password && <p className="auth-field-error">{fieldErrors.password}</p>}
                    </div>

                    <div className="auth-field">
                      <label className="auth-label" htmlFor="register-confirm-password">Confirm Password</label>
                      <PasswordField id="register-confirm-password" value={confirmPassword}
                        onChange={e => { setConfirmPassword(e.target.value); clearErr("confirmPassword"); setAuthError(""); }}
                        placeholder="Re-enter your password" autoComplete="new-password"
                        hasError={!!fieldErrors.confirmPassword}
                      />
                      {fieldErrors.confirmPassword && <p className="auth-field-error">{fieldErrors.confirmPassword}</p>}
                    </div>

                    <button id="register-submit" type="submit" disabled={busy} className="auth-submit-btn">
                      {isSubmitting ? <><AuthSpinner /> Sending verification code...</> : "Verify Email & Create Account"}
                    </button>
                  </form>

                  <p className="auth-switch-text">
                    Already have an account?{" "}
                    <Link to="/login" className="auth-link">Sign In</Link>
                  </p>
                </>
              ) : (
                <>
                  <div className="auth-card-header">
                    <div className="auth-avatar-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                    </div>
                    <h1 className="auth-card-title">Verify Your Email</h1>
                    <p className="auth-card-subtitle">
                      Enter the 4-digit code sent to <strong style={{ color: "var(--text)" }}>{email}</strong>
                    </p>
                  </div>

                  {infoMessage && (
                    <div className="auth-info-banner">
                      <span>{infoMessage}</span>
                    </div>
                  )}

                  {authError && (
                    <div className="auth-error-banner">
                      <IconAlertCircle size={15} color="var(--red)" style={{ flexShrink: 0, marginTop: 1 }} />
                      <span>{authError}</span>
                    </div>
                  )}

                  <form onSubmit={handleVerifyOtpAndRegister} noValidate>
                    <div className="auth-field" style={{ textAlign: "center" }}>
                      <label className="auth-label">Enter 4-Digit Code</label>
                      <OtpInput
                        value={otp}
                        onChange={(val) => {
                          setOtp(val);
                          setFieldErrors((f) => ({ ...f, otp: "" }));
                          setAuthError("");
                        }}
                        length={4}
                        disabled={isSubmitting}
                        hasError={!!fieldErrors.otp}
                      />
                      {fieldErrors.otp && <p className="auth-field-error">{fieldErrors.otp}</p>}
                    </div>

                    <button id="verify-register-submit" type="submit" disabled={busy} className="auth-submit-btn" style={{ marginTop: 16 }}>
                      {isSubmitting ? <><AuthSpinner /> Verifying...</> : "Verify & Complete Registration"}
                    </button>

                    <div className="auth-otp-actions">
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={countdown > 0 || isSubmitting}
                        className="auth-resend-btn"
                      >
                        {countdown > 0 ? `Resend code in ${countdown}s` : "Resend code"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setStep(1);
                          setOtp("");
                          setAuthError("");
                          setInfoMessage("");
                        }}
                        className="auth-back-step-btn"
                      >
                        Change Details
                      </button>
                    </div>

                    <div style={{ marginTop: 18, textAlign: "center", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, background: "rgba(124, 58, 237, 0.06)", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(124, 58, 237, 0.15)" }}>
                      Can’t find the email? Check your <strong>Spam / Junk</strong> or <strong>Promotions</strong> folder.
                    </div>
                  </form>
                </>
              )}
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

        .auth-main { flex:1; display:flex; align-items:center; justify-content:center; position:relative; z-index:5; padding:32px 20px; }

        .auth-right-panel { width:100%; max-width:480px; display:flex; align-items:center; justify-content:center; }
        .auth-card { width:100%; max-width:440px; background:var(--card); backdrop-filter:blur(24px); border:1px solid var(--glass-border); border-radius:20px; overflow:hidden; box-shadow:0 24px 60px rgba(0,0,0,0.22),0 0 0 1px var(--border); }
        .auth-page.light .auth-card { box-shadow:0 8px 40px rgba(124,58,237,0.10),0 1px 4px rgba(0,0,0,0.07); }
        .auth-card-accent { height:3px; background:linear-gradient(90deg,var(--violet) 0%,var(--cyan) 100%); }
        .auth-card-body { padding:28px 30px 34px; }

        .auth-card-header { text-align:center; margin-bottom:22px; }
        .auth-avatar-icon { width:52px; height:52px; border-radius:14px; background:var(--violet-subtle); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; margin:0 auto 12px; color:var(--violet-light); box-shadow:0 4px 20px var(--violet-glow); }
        .auth-page.light .auth-avatar-icon { box-shadow:0 4px 16px rgba(124,58,237,0.12); }
        .auth-card-title { font-size:23px; font-weight:800; margin:0 0 5px; color:var(--text); letter-spacing:-0.4px; }
        .auth-card-subtitle { font-size:13px; color:var(--text-muted); margin:0; }

        .auth-google-btn { width:100%; display:flex; align-items:center; justify-content:center; gap:10px; padding:11px 18px; margin-bottom:16px; background:var(--glass); border:1px solid var(--glass-border); border-radius:11px; color:var(--text); font-size:14px; font-weight:600; cursor:pointer; transition:all 0.2s ease; font-family:inherit; }
        .auth-google-btn:hover:not(:disabled) { background:var(--violet-subtle); border-color:var(--border); }
        .auth-google-btn:disabled { opacity:0.6; cursor:not-allowed; }

        .auth-divider { display:flex; align-items:center; gap:10px; margin-bottom:16px; }
        .auth-divider-line { flex:1; height:1px; background:var(--glass-border); }
        .auth-divider-text { font-size:11.5px; font-weight:600; color:var(--text-muted); white-space:nowrap; }

        .auth-error-banner { display:flex; align-items:flex-start; gap:9px; padding:10px 13px; margin-bottom:14px; background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.25); border-radius:10px; color:#ef4444; font-size:13px; }
        .auth-page.light .auth-error-banner { background:rgba(239,68,68,0.05); }

        .auth-field { margin-bottom:13px; }
        .auth-label { display:block; font-size:12px; font-weight:700; color:var(--violet-light); margin-bottom:6px; letter-spacing:0.02em; }
        .auth-input-wrap { position:relative; }
        .auth-input-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:var(--text-muted); pointer-events:none; opacity:0.5; display:flex; align-items:center; }
        .auth-input { width:100%; box-sizing:border-box; padding:10px 14px 10px 40px; background:var(--glass); border:1px solid var(--glass-border); border-radius:10px; color:var(--text); font-size:13.5px; font-family:inherit; outline:none; transition:border-color 0.2s,box-shadow 0.2s; }
        .auth-input.auth-input-pr { padding-right:44px; }
        .auth-input::placeholder { color:var(--text-muted); opacity:0.5; }
        .auth-input:focus { border-color:var(--violet); box-shadow:0 0 0 3px var(--violet-subtle); }
        .auth-input.auth-input-error { border-color:rgba(239,68,68,0.5); }
        .auth-input.auth-input-error:focus { box-shadow:0 0 0 3px rgba(239,68,68,0.08); }
        .auth-eye-btn { position:absolute; right:11px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; padding:4px; border-radius:6px; color:var(--text-muted); opacity:0.6; display:flex; align-items:center; }
        .auth-eye-btn:hover { opacity:1; }
        .auth-field-error { margin:4px 0 0; font-size:11.5px; color:#ef4444; font-weight:600; }

        .auth-submit-btn { width:100%; padding:12px 20px; margin-top:6px; font-size:14px; font-weight:700; background:linear-gradient(135deg,var(--violet) 0%,var(--violet-dark) 100%); border:none; border-radius:11px; color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 4px 16px var(--violet-glow); transition:all 0.2s ease; font-family:inherit; letter-spacing:0.01em; }
        .auth-submit-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 24px var(--violet-glow); }
        .auth-submit-btn:disabled { opacity:0.7; cursor:not-allowed; transform:none; }

        .auth-switch-text { text-align:center; margin-top:18px; font-size:13px; color:var(--text-muted); }
        .auth-link { color:var(--violet-light); font-weight:700; text-decoration:none; border-bottom:1px solid transparent; transition:border-color 0.2s; }
        .auth-link:hover { border-bottom-color:var(--violet-light); }

        .auth-info-banner { display:flex; align-items:center; gap:8px; padding:10px 13px; margin-bottom:14px; background:rgba(6,182,212,0.08); border:1px solid rgba(6,182,212,0.25); border-radius:10px; color:var(--cyan); font-size:13px; }

        .auth-otp-actions { display:flex; align-items:center; justify-content:space-between; margin-top:16px; }
        .auth-resend-btn { font-size:12.5px; font-weight:600; color:var(--violet-light); background:none; border:none; cursor:pointer; font-family:inherit; padding:4px 0; }
        .auth-resend-btn:disabled { color:var(--text-muted); cursor:not-allowed; }
        .auth-back-step-btn { font-size:12.5px; font-weight:600; color:var(--text-muted); background:none; border:none; cursor:pointer; font-family:inherit; padding:4px 0; }
        .auth-back-step-btn:hover { color:var(--violet-light); }

        .pw-strength-wrap { display:flex; align-items:center; gap:8px; margin-top:7px; }
        .pw-strength-bars { display:flex; gap:4px; flex:1; }
        .pw-strength-bar { height:3px; flex:1; border-radius:99px; transition:background 0.3s ease; }
        .pw-strength-label { font-size:11px; font-weight:700; white-space:nowrap; transition:color 0.3s; }
      `}</style>
    </div>
  );
}
