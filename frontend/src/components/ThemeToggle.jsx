import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className="theme-toggle-btn"
      aria-label={`Switch to ${isDark ? "Light" : "Dark"} mode`}
      title={`Switch to ${isDark ? "Light" : "Dark"} mode`}
      style={{
        background: "transparent",
        border: "none",
        padding: "2px 4px",
        cursor: "pointer",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        userSelect: "none",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Switch Track */}
      <div
        style={{
          width: 48,
          height: 25,
          borderRadius: 999,
          background: !isDark ? "#d3d6dc" : "#1a1c20",
          border: !isDark
            ? "1px solid rgba(0,0,0,0.06)"
            : "1px solid rgba(255,255,255,0.1)",
          position: "relative",
          display: "flex",
          alignItems: "center",
          boxShadow: !isDark
            ? "inset 0 1px 3px rgba(0,0,0,0.12)"
            : "inset 0 2px 4px rgba(0,0,0,0.6)",
          transition: "background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
          flexShrink: 0,
        }}
      >
        {/* Sliding Knob */}
        <div
          style={{
            width: 19,
            height: 19,
            borderRadius: "50%",
            background: !isDark ? "#ffffff" : "#464a52",
            boxShadow: !isDark
              ? "0 2px 4px rgba(0,0,0,0.2)"
              : "0 2px 4px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.12)",
            position: "absolute",
            top: 2,
            left: 3,
            transform: isDark ? "translateX(23px)" : "translateX(0px)",
            transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), background 0.25s ease",
          }}
        />
      </div>

      {/* Mode Label Underneath */}
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: isDark ? "#f1f5f9" : "#1e293b",
          lineHeight: 1.1,
          letterSpacing: "-0.1px",
          transition: "color 0.25s ease",
        }}
      >
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
}
