import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle({ style = {}, className = "" }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      className={`theme-toggle-btn ${className}`}
      aria-label={`Switch to ${isDark ? "Light" : "Dark"} mode`}
      title={`Switch to ${isDark ? "Light" : "Dark"} mode`}
      style={{
        background: "transparent",
        border: "none",
        padding: 0,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
    >
      {/* Pill Track */}
      <div
        style={{
          width: 68,
          height: 34,
          borderRadius: 9999,
          position: "relative",
          background: isDark
            ? "linear-gradient(180deg, #2c2c36 0%, #1f1f26 100%)"
            : "linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)",
          border: isDark
            ? "1.5px solid rgba(255, 255, 255, 0.32)"
            : "1.5px solid rgba(0, 0, 0, 0.14)",
          boxShadow: isDark
            ? "0 0 0 1px rgba(255, 255, 255, 0.08), 0 2px 8px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(0, 0, 0, 0.6)"
            : "0 1px 3px rgba(0, 0, 0, 0.08), inset 0 2px 4px rgba(0, 0, 0, 0.06)",
          transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Sun Icon (Visible on Left in Light Mode) */}
        <div
          style={{
            position: "absolute",
            left: 8,
            top: "50%",
            transform: isDark ? "translateY(-50%) scale(0.6)" : "translateY(-50%) scale(1)",
            opacity: isDark ? 0 : 1,
            transition: "opacity 0.25s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            width: 18,
            height: 18,
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1c1917"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4.5" />
            <line x1="12" y1="1.5" x2="12" y2="3.8" />
            <line x1="12" y1="20.2" x2="12" y2="22.5" />
            <line x1="4.5" y1="4.5" x2="6.2" y2="6.2" />
            <line x1="17.8" y1="17.8" x2="19.5" y2="19.5" />
            <line x1="1.5" y1="12" x2="3.8" y2="12" />
            <line x1="20.2" y1="12" x2="22.5" y2="12" />
            <line x1="4.5" y1="19.5" x2="6.2" y2="17.8" />
            <line x1="17.8" y1="6.2" x2="19.5" y2="4.5" />
          </svg>
        </div>

        {/* Moon with Stars Icon (Visible on Right in Dark Mode) */}
        <div
          style={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: isDark ? "translateY(-50%) scale(1)" : "translateY(-50%) scale(0.6)",
            opacity: isDark ? 1 : 0,
            transition: "opacity 0.25s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            width: 18,
            height: 18,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff" style={{ filter: "drop-shadow(0 0 3px rgba(255,255,255,0.6))" }}>
            {/* Crescent Moon */}
            <path d="M10 2.5a8.5 8.5 0 0 0 0 17 8.5 8.5 0 0 0 7.8-5.1A7 7 0 1 1 8.9 4.7 8.35 8.35 0 0 0 10 2.5z" />
            {/* Larger 4-point Sparkle Star */}
            <path d="M18.5 2.5c0 1.3-.7 2.2-2 2.2 1.3 0 2 .9 2 2.2 0-1.3.7-2.2 2-2.2-1.3 0-2-.9-2-2.2z" />
            {/* Smaller 4-point Sparkle Star */}
            <path d="M21 9.5c0 .9-.5 1.5-1.4 1.5.9 0 1.4.6 1.4 1.5 0-.9.5-1.5 1.4-1.5-.9 0-1.4-.6-1.4-1.5z" />
          </svg>
        </div>

        {/* Sliding Circular Knob */}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            position: "absolute",
            top: 2,
            left: 3,
            background: isDark ? "#ffffff" : "#222226",
            boxShadow: isDark
              ? "0 2px 8px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.4)"
              : "0 3px 8px rgba(0, 0, 0, 0.25), 0 1px 2px rgba(0, 0, 0, 0.15)",
            transform: isDark ? "translateX(0px)" : "translateX(34px)",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease, box-shadow 0.3s ease",
            zIndex: 2,
          }}
        />
      </div>
    </button>
  );
}
