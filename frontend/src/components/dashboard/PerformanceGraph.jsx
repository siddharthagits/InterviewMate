import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import AppIcon, { IconBarChart } from "../common/AppIcon";

/* ── Module color palette ── */
const MOD = {
  all:       { stroke: "#7c3aed", fill: "rgba(124,58,237,0.18)", light: "#a78bfa", label: "Overall" },
  technical: { stroke: "#7c3aed", fill: "rgba(124,58,237,0.18)", light: "#c4b5fd", label: "Technical" },
  voice:     { stroke: "#06b6d4", fill: "rgba(6,182,212,0.18)",  light: "#67e8f9", label: "Voice AI"  },
  company:   { stroke: "#f59e0b", fill: "rgba(245,158,11,0.18)", light: "#fde68a", label: "Company"   },
  typing:    { stroke: "#10b981", fill: "rgba(16,185,129,0.18)", light: "#6ee7b7", label: "Typing"    },
  subject:   { stroke: "#ec4899", fill: "rgba(236,72,153,0.18)", light: "#f9a8d4", label: "CS Bank"   },
  practice:  { stroke: "#6366f1", fill: "rgba(99,102,241,0.18)", light: "#a5b4fc", label: "Practice"  },
};

const DOMAIN_KEYS = ["technical", "voice", "company", "typing", "subject", "practice"];

function fmt(ts) {
  if (!ts) return "Today";
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function fmtFull(ts) {
  if (!ts) return "Today";
  return new Date(ts).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

/* ── Donut Chart ── */
function DonutChart({ data, total, isLight = false }) {
  const R = 52, cx = 68, cy = 68, stroke = 16;
  const circumference = 2 * Math.PI * R;
  let offset = 0;
  const segments = data.filter(d => d.value > 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width={136} height={136} viewBox="0 0 136 136" style={{ overflow: "visible" }}>
        {/* Background ring */}
        <circle
          cx={cx}
          cy={cy}
          r={R}
          fill="none"
          stroke={isLight ? "rgba(100, 116, 139, 0.14)" : "rgba(255, 255, 255, 0.06)"}
          strokeWidth={stroke}
        />

        {segments.map((seg, i) => {
          const pct = seg.value / (total || 1);
          const dash = circumference * pct;
          const gap = circumference - dash;
          const el = (
            <circle
              key={i}
              cx={cx} cy={cy} r={R}
              fill="none"
              stroke={seg.color}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 0.6s ease", transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
            />
          );
          offset += dash;
          return el;
        })}

        {/* Center label */}
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          fill={isLight ? "#0f172a" : "#f1f5f9"}
          fontSize="20"
          fontWeight="900"
          fontFamily="'Sora', sans-serif"
        >
          {total}
        </text>
        <text
          x={cx}
          y={cy + 11}
          textAnchor="middle"
          fill={isLight ? "#64748b" : "rgba(148, 163, 184, 0.7)"}
          fontSize="11"
          fontWeight="600"
        >
          Sessions
        </text>
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 12px", justifyContent: "center", maxWidth: 210 }}>
        {segments.map((seg, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: seg.color, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: isLight ? "#334155" : "rgba(148, 163, 184, 0.8)", fontWeight: 600 }}>
              {seg.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Bar Chart ── */
function BarChart({ data, isLight = false }) {
  const [hov, setHov] = useState(null);
  const max = Math.max(...data.map(d => d.value), 1);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 95, paddingBottom: 0 }}>
        {data.map((d, i) => {
          const pct = (d.value / max) * 100;
          const isHov = hov === i;
          return (
            <div
              key={i}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "default" }}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
            >
              {isHov && d.value > 0 && (
                <span style={{ fontSize: 10.5, fontWeight: 800, color: d.color, whiteSpace: "nowrap" }}>
                  {d.value > 0 ? `${d.score}%` : "—"}
                </span>
              )}
              <div style={{
                width: "100%", borderRadius: "5px 5px 0 0",
                height: pct > 0 ? `${Math.max(pct * 0.82, 4)}px` : "4px",
                background: d.value > 0
                  ? `linear-gradient(180deg, ${d.color} 0%, ${d.color}99 100%)`
                  : (isLight ? "rgba(100, 116, 139, 0.12)" : "rgba(255, 255, 255, 0.06)"),
                transition: "height 0.5s ease, opacity 0.2s",
                opacity: isHov ? 1 : 0.82,
                boxShadow: isHov ? `0 0 12px ${d.color}60` : "none",
              }} />
            </div>
          );
        })}
      </div>
      {/* X Labels */}
      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <span style={{ fontSize: 9.5, color: isLight ? "#64748b" : "rgba(148, 163, 184, 0.6)", fontWeight: 700, display: "block", lineHeight: 1.2 }}>
              {d.shortLabel}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Line/Area Chart ── */
function LineChart({ points, theme, isLight = false, width = 620, height = 210 }) {
  const [hovPt, setHovPt] = useState(null);
  const padX = 40, padY = 22;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const pathD = useMemo(() => {
    if (points.length === 0) return "";
    if (points.length === 1) return `M ${padX},${points[0].y} L ${width - padX},${points[0].y}`;
    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i], p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) * 0.45;
      const cpX2 = p0.x + (p1.x - p0.x) * 0.55;
      d += ` C ${cpX1},${p0.y} ${cpX2},${p1.y} ${p1.x},${p1.y}`;
    }
    return d;
  }, [points, padX, width]);

  const areaD = points.length > 1
    ? `${pathD} L ${points[points.length - 1].x},${height - padY} L ${points[0].x},${height - padY} Z`
    : "";

  const gridId = `grad-perf-${theme.stroke.replace("#", "")}-${isLight ? "light" : "dark"}`;

  return (
    <div style={{ position: "relative", width: "100%", overflowX: "auto" }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", minWidth: 360, overflow: "visible" }}>
        <defs>
          <linearGradient id={gridId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={theme.stroke} stopOpacity={isLight ? "0.22" : "0.35"} />
            <stop offset="100%" stopColor={theme.stroke} stopOpacity="0" />
          </linearGradient>
          <filter id="glow-perf">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Grid lines */}
        {[100, 75, 50, 25, 0].map((val) => {
          const y = height - padY - (val / 100) * innerH;
          return (
            <g key={val}>
              <line
                x1={padX}
                y1={y}
                x2={width - padX}
                y2={y}
                stroke={isLight ? "rgba(100, 116, 139, 0.16)" : "rgba(255, 255, 255, 0.06)"}
                strokeDasharray="4 4"
              />
              <text
                x={padX - 6}
                y={y + 4}
                fill={isLight ? "#64748b" : "rgba(148, 163, 184, 0.5)"}
                fontSize="10"
                fontWeight="600"
                textAnchor="end"
              >
                {val}%
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        {areaD && <path d={areaD} fill={`url(#${gridId})`} />}

        {/* Trend line */}
        {pathD && (
          <path d={pathD} fill="none" stroke={theme.stroke} strokeWidth="3" strokeLinecap="round" filter="url(#glow-perf)" />
        )}

        {/* Data nodes */}
        {points.map((pt) => {
          const isH = hovPt?.id === pt.id;
          return (
            <g key={pt.id} style={{ cursor: "pointer" }} onMouseEnter={() => setHovPt(pt)} onMouseLeave={() => setHovPt(null)}>
              {isH && <circle cx={pt.x} cy={pt.y} r="11" fill={theme.stroke} opacity="0.25" />}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isH ? 6 : 4.5}
                fill="#ffffff"
                stroke={theme.stroke}
                strokeWidth="2.5"
                style={{ transition: "all 0.15s ease" }}
              />
              <text
                x={pt.x}
                y={height - 5}
                fill={isH ? (isLight ? theme.stroke : "#f1f5f9") : (isLight ? "#64748b" : "rgba(148, 163, 184, 0.55)")}
                fontSize="10"
                fontWeight={isH ? "800" : "600"}
                textAnchor="middle"
              >
                {pt.day}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hovPt && (
        <div style={{
          position: "absolute",
          left: `${(hovPt.x / width) * 100}%`,
          top: `${(hovPt.y / height) * 100}%`,
          transform: "translate(-50%, -115%)",
          background: isLight ? "#ffffff" : "rgba(15, 10, 30, 0.95)",
          border: isLight ? `1px solid rgba(124, 58, 237, 0.25)` : `1px solid ${theme.stroke}55`,
          boxShadow: isLight
            ? "0 10px 25px rgba(0, 0, 0, 0.10), 0 2px 6px rgba(124, 58, 237, 0.12)"
            : `0 8px 24px ${theme.stroke}30`,
          borderRadius: 10,
          padding: "8px 12px",
          pointerEvents: "none",
          zIndex: 30,
          whiteSpace: "nowrap",
          textAlign: "center",
          backdropFilter: "blur(10px)",
        }}>
          <div style={{ fontSize: 10.5, color: isLight ? "#64748b" : "rgba(148, 163, 184, 0.7)", fontWeight: 600 }}>
            {hovPt.fullDate || hovPt.day}
          </div>
          <div style={{ fontSize: 14, fontWeight: 900, color: theme.stroke, margin: "2px 0" }}>
            {hovPt.score}% Score
          </div>
          <div style={{ fontSize: 11, color: isLight ? "#475569" : "rgba(148, 163, 184, 0.6)" }}>
            {hovPt.title || ""}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Export ── */
export default function PerformanceDashboard({ activities = [], overallScore = 0 }) {
  const [activeTab, setActiveTab] = useState("all");
  const themeCtx = useTheme?.();
  const isLight = themeCtx?.theme === "light";
  const theme = MOD[activeTab] || MOD.all;

  /* Filtered + sorted activities for line chart */
  const filtered = useMemo(() => {
    const list = activeTab === "all" ? activities : activities.filter(a => a.type === activeTab);
    return [...list].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
  }, [activities, activeTab]);

  const hasData = filtered.length > 0;

  /* Line chart point calculation */
  const W = 620, H = 210, PX = 40, PY = 22;
  const innerW = W - PX * 2, innerH = H - PY * 2;

  const points = useMemo(() => {
    if (!hasData) return [];
    const len = filtered.length;
    return filtered.map((act, i) => {
      const x = len === 1 ? W / 2 : PX + (i / (len - 1)) * innerW;
      const score = Math.max(0, Math.min(100, Number(act.score) || 0));
      const y = H - PY - (score / 100) * innerH;
      return { ...act, x, y, score, day: fmt(act.timestamp), fullDate: fmtFull(act.timestamp) };
    });
  }, [filtered, hasData, innerW, innerH]);

  const latestScore = points[points.length - 1]?.score || 0;
  const peakScore = points.length > 0 ? Math.max(...points.map(p => p.score)) : 0;
  const gain = points.length > 1 ? latestScore - (points[0]?.score || 0) : 0;

  /* Per-domain stats for donut & bar */
  const domainStats = useMemo(() => {
    const map = {};
    DOMAIN_KEYS.forEach(k => { map[k] = { count: 0, totalScore: 0 }; });
    activities.forEach(a => {
      if (map[a.type]) {
        map[a.type].count++;
        map[a.type].totalScore += Number(a.score) || 0;
      }
    });
    return DOMAIN_KEYS.map(k => ({
      key: k,
      label: MOD[k].label,
      shortLabel: MOD[k].label.slice(0, 4),
      color: MOD[k].stroke,
      value: map[k].count,
      score: map[k].count > 0 ? Math.round(map[k].totalScore / map[k].count) : 0,
    }));
  }, [activities]);

  const totalSessions = activities.length;

  /* Donut segments (only non-zero) */
  const donutData = domainStats.filter(d => d.value > 0).map(d => ({
    label: d.label, value: d.value, color: d.color,
  }));

  const TABS = [
    { id: "all", label: "All Categories", icon: "sparkles" },
    { id: "technical", label: "Technical", icon: "code" },
    { id: "voice", label: "Voice AI", icon: "mic" },
    { id: "company", label: "Company", icon: "building" },
    { id: "typing", label: "Typing", icon: "keyboard" },
    { id: "subject", label: "CS Bank", icon: "book" },
    { id: "practice", label: "Practice", icon: "brain" },
  ];

  return (
    <div
      style={{
        borderRadius: 24,
        marginBottom: 32,
        overflow: "hidden",
        border: "1px solid var(--glass-border)",
        background: "var(--card)",
        boxShadow: isLight
          ? "0 10px 30px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.02)"
          : "0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
        transition: "all 0.3s ease",
      }}
    >
      {/* ── GRADIENT ACCENT BAR ── */}
      <div style={{ height: 3, background: "linear-gradient(90deg, var(--violet), var(--cyan))" }} />

      <div style={{ padding: "24px 28px 28px" }}>
        {/* ── HEADER ── */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 14, marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
              <span style={{
                fontSize: 11, fontWeight: 800, color: "var(--violet-light)",
                background: "var(--bg2)",
                padding: "4px 10px",
                borderRadius: 99,
                border: "1px solid var(--glass-border)",
                letterSpacing: "0.06em", textTransform: "uppercase",
                display: "inline-flex", alignItems: "center", gap: 6,
              }}>
                <IconBarChart size={13} color="var(--violet-light)" />
                <span>Performance Analytics</span>
              </span>
              {hasData && (
                <span style={{ fontSize: 13, fontWeight: 700, color: gain >= 0 ? "#10b981" : "#ef4444" }}>
                  {gain >= 0 ? `+${gain}%` : `${gain}%`} net change
                </span>
              )}
            </div>
            <h2 style={{
              fontSize: 22,
              fontWeight: 900,
              margin: 0,
              letterSpacing: "-0.4px",
              color: "var(--text)",
            }}>
              Progress Trajectory & Score Distribution
            </h2>
          </div>

          {/* Tab switcher */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {TABS.map(t => {
              const isAct = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    padding: "6px 13px",
                    borderRadius: 99,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    border: isAct
                      ? "1px solid var(--violet)"
                      : "1px solid var(--glass-border)",
                    background: isAct
                      ? "var(--violet)"
                      : "var(--bg2)",
                    color: isAct
                      ? "#ffffff"
                      : "var(--text-muted)",
                    boxShadow: isAct ? "0 3px 10px rgba(124,58,237,0.35)" : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  <AppIcon name={t.icon} size={13} color={isAct ? "#ffffff" : "var(--text-muted)"} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── KPI ROW ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginBottom: 22 }}>
          {[
            { label: "TOTAL SESSIONS", value: totalSessions, color: "var(--text)" },
            { label: "TRACKED (FILTER)", value: filtered.length, color: "var(--text)" },
            { label: "LATEST SCORE", value: hasData ? `${latestScore}%` : "—", color: hasData ? "var(--violet-light)" : "var(--text-dim)" },
            { label: "PEAK SCORE", value: hasData ? `${peakScore}%` : "—", color: hasData ? "var(--cyan)" : "var(--text-dim)" },
            { label: "OVERALL READINESS", value: overallScore > 0 ? `${overallScore}%` : "—", color: overallScore > 0 ? "var(--green)" : "var(--text-dim)" },
          ].map((k, i) => (
            <div key={i} style={{
              padding: "10px 14px",
              background: "var(--bg2)",
              borderRadius: 12,
              border: "1px solid var(--glass-border)",
            }}>
              <div style={{
                fontSize: 10,
                color: "var(--text-muted)",
                fontWeight: 700,
                letterSpacing: "0.05em",
                marginBottom: 4,
              }}>
                {k.label}
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: k.color, fontFamily: "'Sora', sans-serif" }}>
                {k.value}
              </div>
            </div>
          ))}
        </div>

        {/* ── CHART SECTION: Line + Donut + Bar ── */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
          alignItems: "stretch",
        }}>

          {/* Line / Area Chart */}
          <div style={{ flex: "1 1 480px", minWidth: 320 }}>
            <div style={{
              fontSize: 12,
              fontWeight: 700,
              color: "var(--text-muted)",
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--violet)", display: "inline-block" }} />
              Score Progression — {theme.label}
            </div>

            {!hasData ? (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                height: 210,
                background: "var(--bg2)",
                borderRadius: 14,
                border: "1px dashed var(--glass-border)",
                gap: 10, textAlign: "center", padding: 24,
              }}>
                <AppIcon name="chart" size={32} color="var(--violet-light)" />
                <span style={{ fontSize: 14.5, fontWeight: 800, color: "var(--text)" }}>
                  No {activeTab === "all" ? "" : theme.label + " "}Sessions Yet
                </span>
                <span style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 360 }}>
                  Complete a session to start tracking your performance trajectory.
                </span>
                <Link to={activeTab === "voice" ? "/voice" : activeTab === "company" ? "/company-assessment" : activeTab === "typing" ? "/typing-test" : "/setup"}
                  className="btn btn-primary"
                  style={{
                    marginTop: 6, padding: "8px 18px",
                    textDecoration: "none",
                    fontSize: 12.5, fontWeight: 700,
                  }}>
                  Start Now →
                </Link>
              </div>
            ) : (
              <LineChart points={points} theme={theme} isLight={isLight} width={620} height={210} />
            )}
          </div>

          {/* Right Side Visuals (Donut + Bar) */}
          <div style={{ flex: "1 1 340px", display: "flex", gap: 14, flexWrap: "wrap" }}>
            {/* Donut Chart */}
            <div style={{
              flex: "1 1 150px",
              padding: "14px 16px",
              background: "var(--bg2)",
              borderRadius: 16,
              border: "1px solid var(--glass-border)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              alignItems: "center",
            }}>
              <div style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--text-muted)",
                textAlign: "center",
                letterSpacing: "0.04em",
              }}>
                SESSION SPLIT
              </div>
              {totalSessions === 0 ? (
                <div style={{
                  width: 136, height: 136, borderRadius: "50%",
                  border: isLight ? "16px solid rgba(100, 116, 139, 0.14)" : "16px solid rgba(255,255,255,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700 }}>
                    No Data
                  </span>
                </div>
              ) : (
                <DonutChart data={donutData} total={totalSessions} isLight={isLight} />
              )}
            </div>

            {/* Bar Chart */}
            <div style={{
              flex: "1 1 170px",
              padding: "14px 16px",
              background: "var(--bg2)",
              borderRadius: 16,
              border: "1px solid var(--glass-border)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}>
              <div style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--text-muted)",
                letterSpacing: "0.04em",
              }}>
                AVG SCORE BY MODULE
              </div>
              <BarChart data={domainStats} isLight={isLight} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
