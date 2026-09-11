import { useTheme } from "../../context/ThemeContext";

export default function ThemeBackground() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div
      className={`theme-ambient-viewport ${isLight ? "theme-light" : "theme-dark"}`}
      aria-hidden="true"
    >
      {isLight ? (
        /* ─── LAGO STYLE: Warm Ivory Canvas with Radiant Peach/Apricot Bloom ─── */
        <div className="lago-ambient-container">
          {/* Base Warm Ivory Gradient Canvas */}
          <div className="lago-base-ivory" />

          {/* Primary Top-Center Radiant Peach Bloom */}
          <div className="lago-bloom-center" />

          {/* Secondary Upper-Right Warm Coral/Blush Glow */}
          <div className="lago-bloom-right" />

          {/* Gentle Left Warmth Accent */}
          <div className="lago-bloom-left" />

          {/* Subtle Mid-Canopy Radiant Warm Veil */}
          <div className="lago-warm-veil" />
        </div>
      ) : (
        /* ─── ZEABUR STYLE: Deep Cosmic Obsidian with Organic Animated Silk Purple Waves ─── */
        <div className="zeabur-ambient-container">
          {/* Deep Space Obsidian Base (#06030c) */}
          <div className="zeabur-base-space" />

          {/* 1. Deep Cosmic Nebula Glow (Soft wide wash) */}
          <div className="zeabur-nebula-ambient" />

          {/* 2. Primary Silk Aurora Wave (Anchored far left, organic hourglass curves with wide bleed) */}
          <svg
            className="zeabur-aurora-svg wave-primary"
            viewBox="0 0 1440 900"
            fill="none"
            preserveAspectRatio="none"
            style={{ overflow: "visible" }}
          >
            <path
              d="M -400 -300 L -400 1200 L 120 1200 C 320 1050 480 820 280 560 C 140 380 480 180 320 -300 Z"
              fill="url(#zeabur-grad-1)"
              filter="url(#zeabur-blur-deep)"
            />
            <defs>
              <linearGradient id="zeabur-grad-1" x1="0%" y1="0%" x2="85%" y2="80%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.92" />
                <stop offset="30%" stopColor="#9333ea" stopOpacity="0.84" />
                <stop offset="65%" stopColor="#4c1d95" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#06030c" stopOpacity="0" />
              </linearGradient>
              <filter id="zeabur-blur-deep" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="60" />
              </filter>
            </defs>
          </svg>

          {/* 3. Secondary Interlaced Silk Fold (Complementary undulating counter-rhythm) */}
          <svg
            className="zeabur-aurora-svg wave-secondary"
            viewBox="0 0 1440 900"
            fill="none"
            preserveAspectRatio="none"
            style={{ overflow: "visible" }}
          >
            <path
              d="M -400 -300 L -400 1200 L 60 1200 C 240 1060 420 780 220 540 C 100 360 400 200 240 -300 Z"
              fill="url(#zeabur-grad-2)"
              filter="url(#zeabur-blur-medium)"
            />
            <defs>
              <linearGradient id="zeabur-grad-2" x1="0%" y1="0%" x2="80%" y2="80%">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.82" />
                <stop offset="38%" stopColor="#7c3aed" stopOpacity="0.70" />
                <stop offset="78%" stopColor="#3b0764" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#06030c" stopOpacity="0" />
              </linearGradient>
              <filter id="zeabur-blur-medium" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="45" />
              </filter>
            </defs>
          </svg>

          {/* 4. Silk Crest Spine (Luminous highlighting ribbon along the fold ridge) */}
          <svg
            className="zeabur-aurora-svg wave-crest"
            viewBox="0 0 1440 900"
            fill="none"
            preserveAspectRatio="none"
            style={{ overflow: "visible" }}
          >
            <path
              d="M -400 -300 L -400 1200 L 30 1200 C 180 1020 340 740 180 520 C 80 370 320 220 190 -300 Z"
              fill="url(#zeabur-grad-crest)"
              filter="url(#zeabur-blur-crest)"
            />
            <defs>
              <linearGradient id="zeabur-grad-crest" x1="0%" y1="0%" x2="75%" y2="80%">
                <stop offset="0%" stopColor="#f3e8ff" stopOpacity="0.65" />
                <stop offset="30%" stopColor="#d8b4fe" stopOpacity="0.75" />
                <stop offset="65%" stopColor="#a855f7" stopOpacity="0.50" />
                <stop offset="100%" stopColor="#06030c" stopOpacity="0" />
              </linearGradient>
              <filter id="zeabur-blur-crest" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="28" />
              </filter>
            </defs>
          </svg>

          {/* 5. Lower Left Cosmic Violet Aura Pool */}
          <div className="zeabur-glow-ambient" />
        </div>
      )}
    </div>
  );
}
