import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle theme"
      style={{
        width: 42,
        height: 42,
        borderRadius: "50%",
        border: isDark
          ? "1px solid rgba(255,255,255,0.1)"
          : "1px solid rgba(0,0,0,0.12)",
        background: isDark
          ? "rgba(255,255,255,0.06)"
          : "rgba(0,0,0,0.06)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "scale(1.1) rotate(15deg)";
        e.currentTarget.style.background = isDark
          ? "rgba(255,255,255,0.12)"
          : "rgba(0,0,0,0.1)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "scale(1) rotate(0deg)";
        e.currentTarget.style.background = isDark
          ? "rgba(255,255,255,0.06)"
          : "rgba(0,0,0,0.06)";
      }}
    >
      {/* Animated icon */}
      <span
        style={{
          fontSize: 18,
          display: "block",
          transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s",
          transform: isDark ? "rotate(0deg)" : "rotate(180deg)",
        }}
      >
        {isDark ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
