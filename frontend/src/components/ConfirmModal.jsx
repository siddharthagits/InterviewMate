import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import AppIcon, { IconAlertTriangle, IconAlertCircle } from "./common/AppIcon";

/**
 * ConfirmModal — A beautiful, animated confirmation dialog.
 */
export default function ConfirmModal({
  open,
  title = "Are you sure?",
  message = "",
  confirmText = "Yes, Submit",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  icon = null,
  danger = false,
}) {
  const { theme } = useTheme?.() || {};
  const isLight = theme === "light";

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onCancel?.(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open) return null;

  const confirmBg = danger
    ? "linear-gradient(135deg, #ef4444, #b91c1c)"
    : "linear-gradient(135deg, #f59e0b, #d97706)";
  const confirmGlow = danger
    ? "rgba(239,68,68,0.4)"
    : "rgba(245,158,11,0.4)";

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        onClick={onCancel}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9000,
          background: isLight ? "rgba(15, 23, 42, 0.55)" : "rgba(4,8,15,0.75)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          animation: "cm-fade-in 0.18s ease",
        }}
      />

      {/* ── Dialog ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cm-title"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9001,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            pointerEvents: "auto",
            background: isLight ? "#ffffff" : "rgba(8,13,26,0.97)",
            border: isLight ? "1px solid rgba(124,58,237,0.25)" : "1px solid rgba(124,58,237,0.3)",
            borderRadius: 24,
            padding: "36px 32px 28px",
            width: "100%",
            maxWidth: 420,
            boxShadow: isLight
              ? "0 30px 70px rgba(0,0,0,0.12), 0 0 30px rgba(124,58,237,0.12)"
              : "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.15), inset 0 1px 0 rgba(255,255,255,0.04)",
            animation: "cm-slide-up 0.22s cubic-bezier(0.34,1.56,0.64,1)",
            textAlign: "center",
          }}
        >
          {/* Icon */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 14,
            filter: danger ? "drop-shadow(0 0 18px rgba(239,68,68,0.4))" : "drop-shadow(0 0 18px rgba(124,58,237,0.5))",
            animation: "cm-bounce 0.4s ease 0.1s both",
          }}>
            {typeof icon === "string" ? (
              <AppIcon name={icon} size={38} color={danger ? "#ef4444" : "#a78bfa"} />
            ) : icon ? (
              icon
            ) : (
              <IconAlertCircle size={38} color={danger ? "#ef4444" : "#a78bfa"} />
            )}
          </div>

          {/* Title */}
          <h2
            id="cm-title"
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: isLight ? "#0f172a" : "#f1f5f9",
              fontFamily: "'Sora', sans-serif",
              letterSpacing: "-0.3px",
              marginBottom: 10,
            }}
          >
            {title}
          </h2>

          {/* Message */}
          {message && (
            <p style={{
              fontSize: 14,
              color: isLight ? "#475569" : "var(--text-muted)",
              lineHeight: 1.65,
              marginBottom: 28,
            }}>
              {message}
            </p>
          )}

          {/* Divider */}
          <div style={{
            height: 1,
            background: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.05)",
            margin: "0 -4px 24px",
          }} />

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12 }}>
            {/* Cancel */}
            <button
              id="cm-cancel-btn"
              onClick={onCancel}
              style={{
                flex: 1,
                padding: "12px 0",
                borderRadius: 12,
                border: isLight ? "1px solid rgba(203,213,225,0.9)" : "1px solid rgba(255,255,255,0.1)",
                background: isLight ? "rgba(241,245,249,0.9)" : "rgba(255,255,255,0.04)",
                color: isLight ? "#334155" : "var(--text-muted)",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.18s",
                fontFamily: "inherit",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = isLight ? "rgba(226,232,240,0.9)" : "rgba(255,255,255,0.08)";
                e.currentTarget.style.color = isLight ? "#0f172a" : "var(--text)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = isLight ? "rgba(241,245,249,0.9)" : "rgba(255,255,255,0.04)";
                e.currentTarget.style.color = isLight ? "#334155" : "var(--text-muted)";
              }}
            >
              {cancelText}
            </button>

            {/* Confirm */}
            <button
              id="cm-confirm-btn"
              onClick={onConfirm}
              style={{
                flex: 1,
                padding: "12px 0",
                borderRadius: 12,
                border: "none",
                background: confirmBg,
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.18s",
                boxShadow: `0 4px 18px ${confirmGlow}`,
                fontFamily: "inherit",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 8px 28px ${confirmGlow}`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 4px 18px ${confirmGlow}`;
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>

      {/* ── Keyframe animations ── */}
      <style>{`
        @keyframes cm-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cm-slide-up {
          from { opacity: 0; transform: scale(0.88) translateY(20px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        @keyframes cm-bounce {
          0%   { transform: scale(0.4) rotate(-10deg); opacity: 0; }
          70%  { transform: scale(1.15) rotate(4deg);  opacity: 1; }
          100% { transform: scale(1)   rotate(0deg);   opacity: 1; }
        }
      `}</style>
    </>
  );
}
