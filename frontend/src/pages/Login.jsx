import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [authError, setAuthError] = useState("");
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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        background: "var(--bg)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top right Theme Toggle */}
      <div style={{ position: "fixed", top: 20, right: 24, zIndex: 50 }}>
        <ThemeToggle />
      </div>

      {/* Glow blob */}
      <div
        style={{
          position: "absolute",
          top: "20%", left: "50%",
          transform: "translateX(-50%)",
          width: 500, height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: 440, position: "relative" }}>
        {/* Logo link */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link
            to="/"
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 26,
              fontWeight: 900,
              textDecoration: "none",
              background: "linear-gradient(135deg, #c4b5fd, #06b6d4, #fcd34d)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.5px",
            }}
          >
            InterviewMate
          </Link>
        </div>

        {/* Card */}
        <div
          className="glass"
          style={{
            overflow: "hidden",
            boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.1)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "32px 36px 24px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Top glow line */}
            <div
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0, height: 2,
                background: "linear-gradient(90deg, var(--violet), var(--cyan), transparent)",
              }}
            />
            <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.5px", fontFamily: "'Sora', sans-serif" }}>
              Welcome back
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>
              Sign in to continue your interview journey
            </p>
          </div>

          {/* Form */}
          <div style={{ padding: "28px 36px 36px" }}>
            {authError && (
              <div style={{ padding: "10px 14px", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, color: "var(--red)", fontSize: 13, marginBottom: 18 }}>
                ⚠️ {authError}
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block", fontSize: 11, fontWeight: 700,
                    color: "var(--text-muted)", textTransform: "uppercase",
                    letterSpacing: "0.08em", marginBottom: 8,
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p style={{ color: "var(--red)", fontSize: 12, marginTop: 5 }}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: 24 }}>
                <label
                  style={{
                    display: "block", fontSize: 11, fontWeight: 700,
                    color: "var(--text-muted)", textTransform: "uppercase",
                    letterSpacing: "0.08em", marginBottom: 8,
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  className="input"
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password required",
                    minLength: { value: 6, message: "Min 6 characters" },
                  })}
                />
                {errors.password && (
                  <p style={{ color: "var(--red)", fontSize: 12, marginTop: 5 }}>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", fontSize: 15 }}>
                Sign In →
              </button>
            </form>

            <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--text-muted)" }}>
              No account?{" "}
              <Link
                to="/register"
                style={{ color: "var(--violet-light)", fontWeight: 700, textDecoration: "none" }}
              >
                Register free →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;