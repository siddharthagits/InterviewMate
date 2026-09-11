import React from "react";

/* ── Standard SVG Icon Base ── */
function SvgBase({ size = 18, color = "currentColor", strokeWidth = 2, className = "", style = {}, children, viewBox = "0 0 24 24" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
    >
      {children}
    </svg>
  );
}

/* ── Individual Named Icons ── */

export function IconUser({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </SvgBase>
  );
}

export function IconUserPlus({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </SvgBase>
  );
}

export function IconCheck({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <polyline points="20 6 9 17 4 12" />
    </SvgBase>
  );
}

export function IconCheckCircle({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </SvgBase>
  );
}

export function IconX({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </SvgBase>
  );
}

export function IconXCircle({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </SvgBase>
  );
}

export function IconAlertTriangle({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </SvgBase>
  );
}

export function IconAlertCircle({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </SvgBase>
  );
}

export function IconLock({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </SvgBase>
  );
}

export function IconBrain({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
    </SvgBase>
  );
}

export function IconCode({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </SvgBase>
  );
}

export function IconMic({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </SvgBase>
  );
}

export function IconMicOff({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </SvgBase>
  );
}

export function IconBuilding({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="9" y1="22" x2="9" y2="22.01" />
      <line x1="15" y1="22" x2="15" y2="22.01" />
      <line x1="9" y1="6" x2="9" y2="6.01" />
      <line x1="15" y1="6" x2="15" y2="6.01" />
      <line x1="9" y1="10" x2="9" y2="10.01" />
      <line x1="15" y1="10" x2="15" y2="10.01" />
      <line x1="9" y1="14" x2="9" y2="14.01" />
      <line x1="15" y1="14" x2="15" y2="14.01" />
      <line x1="9" y1="18" x2="9" y2="18.01" />
      <line x1="15" y1="18" x2="15" y2="18.01" />
    </SvgBase>
  );
}

export function IconKeyboard({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <line x1="6" y1="8" x2="6.01" y2="8" />
      <line x1="10" y1="8" x2="10.01" y2="8" />
      <line x1="14" y1="8" x2="14.01" y2="8" />
      <line x1="18" y1="8" x2="18.01" y2="8" />
      <line x1="6" y1="12" x2="6.01" y2="12" />
      <line x1="18" y1="12" x2="18.01" y2="12" />
      <line x1="8" y1="16" x2="16" y2="16" />
    </SvgBase>
  );
}

export function IconBook({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </SvgBase>
  );
}

export function IconBookOpen({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </SvgBase>
  );
}

export function IconBarChart({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </SvgBase>
  );
}

export function IconTrendingUp({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </SvgBase>
  );
}

export function IconTarget({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </SvgBase>
  );
}

export function IconClock({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </SvgBase>
  );
}

export function IconZap({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </SvgBase>
  );
}

export function IconSparkles({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <path d="M12 2l2.4 5 5.6.8-4 4 1 5.6-5-2.6-5 2.6 1-5.6-4-4 5.6-.8z" />
    </SvgBase>
  );
}

export function IconBot({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8.01" y2="16" />
      <line x1="16" y1="16" x2="16.01" y2="16" />
    </SvgBase>
  );
}

export function IconTrophy({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" />
      <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
      <path d="M6 4h12a2 2 0 0 1 2 2v3a6 6 0 0 1-6 6h0a6 6 0 0 1-6-6V6a2 2 0 0 1 2-2z" />
      <line x1="12" y1="15" x2="12" y2="19" />
      <line x1="8" y1="19" x2="16" y2="19" />
      <line x1="10" y1="22" x2="14" y2="22" />
    </SvgBase>
  );
}

export function IconLightbulb({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.76.76 1.23 1.52 1.41 2.5" />
    </SvgBase>
  );
}

export function IconCalendar({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </SvgBase>
  );
}

export function IconClipboard({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </SvgBase>
  );
}

export function IconCloud({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </SvgBase>
  );
}

export function IconTrash({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </SvgBase>
  );
}

export function IconRefresh({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </SvgBase>
  );
}

export function IconRotateCcw({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </SvgBase>
  );
}

export function IconSearch({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </SvgBase>
  );
}

export function IconFlag({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </SvgBase>
  );
}

export function IconPlay({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </SvgBase>
  );
}

export function IconPause({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </SvgBase>
  );
}

export function IconSquare({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    </SvgBase>
  );
}

export function IconVolume2({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </SvgBase>
  );
}

export function IconMessageSquare({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </SvgBase>
  );
}

export function IconKey({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <path d="M21 2l-2 2m-1.5 1.5L14 9l-1.5-1.5L11 9l-1 1 2 2-1 1-1.5-1.5L8 13l-1.5-1.5L5 13a6 6 0 1 0 8.5 8.5l9-9-1.5-1.5z" />
      <circle cx="7.5" cy="16.5" r="1.5" />
    </SvgBase>
  );
}

export function IconMap({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </SvgBase>
  );
}

export function IconFolder({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </SvgBase>
  );
}

export function IconHelpCircle({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </SvgBase>
  );
}

export function IconPin({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <line x1="12" y1="17" x2="12" y2="22" />
      <path d="M5 17h14v-2l-2-2V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v8l-2 2v2z" />
    </SvgBase>
  );
}

export function IconArrowRight({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </SvgBase>
  );
}

export function IconChevronRight({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <polyline points="9 18 15 12 9 6" />
    </SvgBase>
  );
}

export function IconChevronLeft({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <polyline points="15 18 9 12 15 6" />
    </SvgBase>
  );
}

export function IconChevronDown({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <polyline points="6 9 12 15 18 9" />
    </SvgBase>
  );
}

export function IconStar({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </SvgBase>
  );
}

export function IconCompass({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </SvgBase>
  );
}

export function IconSliders({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </SvgBase>
  );
}

export function IconDatabase({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </SvgBase>
  );
}

export function IconLayers({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </SvgBase>
  );
}

export function IconCpu({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </SvgBase>
  );
}

export function IconGlobe({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </SvgBase>
  );
}

export function IconShuffle({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </SvgBase>
  );
}

export function IconDna({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <path d="M2 15c6.667-6 13.333 0 20-6" />
      <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
      <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" />
      <path d="M17 6l-2.5-2.5" />
      <path d="M14 8l-1-1" />
      <path d="M7 18l2.5 2.5" />
      <path d="M3.5 14.5l.5.5" />
      <path d="M20 9.5l.5.5" />
      <path d="M2 9c6.667 6 13.333 0 20 6" />
    </SvgBase>
  );
}

export function IconWrench({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </SvgBase>
  );
}

export function IconPalette({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.992 6.012 17.48 2 12 2z" />
    </SvgBase>
  );
}

export function IconBriefcase({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </SvgBase>
  );
}

export function IconEdit({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </SvgBase>
  );
}

export function IconGrid({ size = 18, color = "currentColor", ...props }) {
  return (
    <SvgBase size={size} color={color} {...props}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </SvgBase>
  );
}

export function IconGoogleLogo({ size = 18, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }} {...props}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
    </svg>
  );
}

/* ── Universal Map for Dynamic Lookup ── */
const ICON_MAP = {
  user: IconUser,
  "user-plus": IconUserPlus,
  check: IconCheck,
  "check-circle": IconCheckCircle,
  x: IconX,
  "x-circle": IconXCircle,
  close: IconX,
  warning: IconAlertTriangle,
  "alert-circle": IconAlertCircle,
  lock: IconLock,
  brain: IconBrain,
  code: IconCode,
  mic: IconMic,
  "mic-off": IconMicOff,
  building: IconBuilding,
  company: IconBuilding,
  keyboard: IconKeyboard,
  typing: IconKeyboard,
  book: IconBook,
  "book-open": IconBookOpen,
  subject: IconBook,
  chart: IconBarChart,
  "bar-chart": IconBarChart,
  barchart: IconBarChart,
  analytics: IconBarChart,
  trending: IconTrendingUp,
  target: IconTarget,
  clock: IconClock,
  timer: IconClock,
  zap: IconZap,
  sparkles: IconSparkles,
  bot: IconBot,
  ai: IconBot,
  trophy: IconTrophy,
  award: IconTrophy,
  lightbulb: IconLightbulb,
  idea: IconLightbulb,
  calendar: IconCalendar,
  clipboard: IconClipboard,
  cloud: IconCloud,
  trash: IconTrash,
  refresh: IconRefresh,
  replay: IconRotateCcw,
  "rotate-ccw": IconRotateCcw,
  rotateccw: IconRotateCcw,
  search: IconSearch,
  flag: IconFlag,
  play: IconPlay,
  pause: IconPause,
  square: IconSquare,
  stop: IconSquare,
  volume: IconVolume2,
  message: IconMessageSquare,
  "message-square": IconMessageSquare,
  messagesquare: IconMessageSquare,
  key: IconKey,
  map: IconMap,
  folder: IconFolder,
  help: IconHelpCircle,
  pin: IconPin,
  arrowRight: IconArrowRight,
  chevronRight: IconChevronRight,
  chevronLeft: IconChevronLeft,
  chevronDown: IconChevronDown,
  star: IconStar,
  compass: IconCompass,
  sliders: IconSliders,
  database: IconDatabase,
  dbms: IconDatabase,
  layers: IconLayers,
  cpu: IconCpu,
  os: IconCpu,
  globe: IconGlobe,
  network: IconGlobe,
  shuffle: IconShuffle,
  dna: IconDna,
  wrench: IconWrench,
  palette: IconPalette,
  briefcase: IconBriefcase,
  edit: IconEdit,
  grid: IconGrid,
  google: IconGoogleLogo,
};

/* ── Fallback/Convenience Resolver ── */
export function AppIcon({ name = "sparkles", size = 18, color = "currentColor", className = "", style = {}, ...props }) {
  if (!name) return null;

  // Clean the name string if needed
  const key = String(name).toLowerCase().trim().replace(/[^a-z0-9-]/g, "");
  const Component = ICON_MAP[key] || ICON_MAP[name] || IconSparkles;
  return <Component size={size} color={color} className={className} style={style} {...props} />;
}

export default AppIcon;
