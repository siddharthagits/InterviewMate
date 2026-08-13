import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import ParticleBackground from "../components/ParticleBackground";
import SocialAuthRow from "../components/SocialAuthRow";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [authError, setAuthError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = (data) => {
    try {
      setAuthError("");
      login(data.email, data.password);
      navigate("/dashboard");
    } catch (err) {
      setAuthError(err.message || "Failed to log in");
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Particle Background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <ParticleBackground />
      </div>

      {/* Ambient Glows */}
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
          background: `
            radial-gradient(ellipse 60% 45% at 50% 25%, rgba(124,58,237,0.12) 0%, transparent 65%),
            radial-gradient(ellipse 50% 40% at 85% 65%, rgba(6,182,212,0.06) 0%, transparent 60%)
          `,
        }}
      />

      {/* Top Bar with Home Link & Theme Toggle */}
      <header className="auth-topbar">
        <Link to="/" className="auth-back-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Home</span>
        </Link>

        <Link
          to="/"
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 20,
            fontWeight: 900,
            textDecoration: "none",
            background: "linear-gradient(135deg, #c4b5fd 0%, #06b6d4 60%, #fcd34d 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.5px",
          }}
        >
          Interview<span style={{ color: "#fcd34d" }}>Mate</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ThemeToggle />
        </div>
      </header>

      {/* Clean Centered Auth Card */}
      <div className="auth-container-centered">
        <div className="auth-card">
          <div className="auth-card-glow-bar" />

          <div className="auth-card-header" style={{ textAlign: "center", paddingBottom: 16 }}>
            <h1 className="auth-card-title">Welcome Back</h1>
            <p className="auth-card-sub">Sign in to your InterviewMate account</p>
          </div>

          <div className="auth-card-body">
            {/* Social Authentication */}
            <SocialAuthRow onError={(err) => setAuthError(err)} />

            {/* Divider */}
            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">Or with email</span>
              <div className="auth-divider-line" />
            </div>

            {/* Error Banner */}
            {authError && (
              <div style={{
                padding: "9px 12px",
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 10,
                color: "var(--red)",
                fontSize: 12.5,
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}>
                <span>⚠️</span>
                <span>{authError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div className="auth-field">
                <label className="auth-label">Email</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M22 7l-10 7L2 7" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    className="auth-input"
                    placeholder="you@example.com"
                    autoComplete="email"
                    {...register("email", { required: "Email is required" })}
                  />
                </div>
                {errors.email && (
                  <p className="auth-error-msg">⚠️ {errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="auth-field" style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                  <label className="auth-label" style={{ marginBottom: 0 }}>Password</label>
                  <span style={{ fontSize: 11.5, color: "var(--violet-light)", cursor: "pointer", fontWeight: 600 }}>
                    Forgot?
                  </span>
                </div>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="auth-input has-eye"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Min 6 characters" },
                    })}
                  />
                  <button
                    type="button"
                    className="auth-eye-btn"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="auth-error-msg">⚠️ {errors.password.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ width: "100%", padding: "11px", fontSize: 14.5, borderRadius: 12 }}
              >
                {isSubmitting ? "Signing in..." : "Sign In →"}
              </button>
            </form>

            {/* Switch */}
            <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--text-muted)" }}>
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{ color: "var(--violet-light)", fontWeight: 700, textDecoration: "none" }}
              >
                Get Started →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}