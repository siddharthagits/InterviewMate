import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

const MODULE_COLORS = {
  all: { stroke: "#7c3aed", fill: "rgba(124,58,237,0.18)", light: "#a78bfa" },
  technical: { stroke: "#7c3aed", fill: "rgba(124,58,237,0.18)", light: "#c4b5fd" },
  voice: { stroke: "#06b6d4", fill: "rgba(6,182,212,0.18)", light: "#67e8f9" },
  company: { stroke: "#f59e0b", fill: "rgba(245,158,11,0.18)", light: "#fde68a" },
  typing: { stroke: "#10b981", fill: "rgba(16,185,129,0.18)", light: "#6ee7b7" },
};

function formatDate(timestamp) {
  if (!timestamp) return "Today";
  const d = new Date(timestamp);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatFullDate(timestamp) {
  if (!timestamp) return "Today";
  const d = new Date(timestamp);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function PerformanceGraph({ activities = [], overallScore = 0 }) {
  const [activeMetric, setActiveMetric] = useState("all");
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const theme = MODULE_COLORS[activeMetric] || MODULE_COLORS.all;

  // Filter activities strictly by selected track
  const filteredActivities = useMemo(() => {
    const list = activeMetric === "all"
      ? activities
      : activities.filter((a) => a.type === activeMetric);
    // Sort oldest to newest for left-to-right progression
    return [...list].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
  }, [activities, activeMetric]);

  const hasData = filteredActivities.length > 0;

  // Chart dimensions & scaling
  const width = 760;
  const height = 240;
  const padX = 45;
  const padY = 25;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const points = useMemo(() => {
    if (!hasData) return [];
    const len = filteredActivities.length;
    return filteredActivities.map((act, i) => {
      const x = len === 1 ? width / 2 : padX + (i / (len - 1)) * innerW;
      const score = Math.max(0, Math.min(100, Number(act.score) || 0));
      const minS = 0;
      const maxS = 100;
      const normalized = (score - minS) / (maxS - minS);
      const y = height - padY - normalized * innerH;
      return {
        ...act,
        x,
        y,
        score,
        day: formatDate(act.timestamp),
        fullDate: formatFullDate(act.timestamp),
      };
    });
  }, [filteredActivities, hasData, innerW, innerH, height, padX, padY, width]);

  // Generate smooth SVG Bezier path for real points
  const pathD = useMemo(() => {
    if (points.length === 0) return "";
    if (points.length === 1) return `M ${padX},${points[0].y} L ${width - padX},${points[0].y}`;
    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) * 0.45;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) * 0.55;
      const cpY2 = p1.y;
      d += ` C ${cpX1},${cpY1} ${cpX2},${cpY2} ${p1.x},${p1.y}`;
    }
    return d;
  }, [points, padX, width]);

  const areaD = useMemo(() => {
    if (points.length === 0) return "";
    if (points.length === 1) return "";
    return `${pathD} L ${points[points.length - 1].x},${height - padY} L ${points[0].x},${height - padY} Z`;
  }, [pathD, points, height, padY]);

  const startScore = points[0]?.score || 0;
  const latestScore = points[points.length - 1]?.score || 0;
  const gain = points.length > 1 ? latestScore - startScore : 0;
  const peakScore = points.length > 0 ? Math.max(...points.map((p) => p.score)) : 0;

  return (
    <div
      className="glass fade-up"
      style={{
        padding: "26px 30px",
        borderRadius: 24,
        marginBottom: 32,
        position: "relative",
        overflow: "hidden",
        border: `1px solid ${theme.stroke}35`,
        background: `radial-gradient(ellipse 90% 70% at 85% 20%, ${theme.stroke}10, transparent 65%), linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))`,
      }}
    >
      {/* ── HEADER ROW: METRIC TABS & REAL STATS ──────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: theme.stroke,
                background: `${theme.stroke}18`,
                padding: "3px 10px",
                borderRadius: 99,
                border: `1px solid ${theme.stroke}35`,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              📈 Live Performance Progress
            </span>
            {hasData && (
              <span style={{ fontSize: 13, fontWeight: 700, color: gain >= 0 ? "#10b981" : "#ef4444" }}>
                {gain >= 0 ? `+${gain}%` : `${gain}%`} Net Change
              </span>
            )}
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.5px", margin: 0, color: "var(--text)" }}>
            Progress &amp; Performance Trajectory
          </h2>
        </div>

        {/* Module Switcher Tabs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {[
            { id: "all", label: "🌟 Overall Readiness" },
            { id: "technical", label: "💻 Technical Mock" },
            { id: "voice", label: "🎙️ Voice AI" },
            { id: "company", label: "🏢 Company Exams" },
            { id: "typing", label: "⌨️ Typing Speed" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveMetric(tab.id);
                setHoveredPoint(null);
              }}
              style={{
                padding: "6px 12px",
                borderRadius: 99,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                border: activeMetric === tab.id ? `1px solid ${theme.stroke}` : "1px solid var(--glass-border)",
                background: activeMetric === tab.id ? theme.stroke : "rgba(255,255,255,0.03)",
                color: activeMetric === tab.id ? "#fff" : "var(--text-muted)",
                transition: "all 0.2s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── KEY METRIC CHIPS ──────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 20 }}>
        <div style={{ padding: "10px 14px", background: "rgba(0,0,0,0.18)", borderRadius: 12, border: "1px solid var(--glass-border)" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>RECORDED SESSIONS</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: theme.stroke, fontFamily: "'Sora', sans-serif" }}>
            {filteredActivities.length}
          </div>
        </div>

        <div style={{ padding: "10px 14px", background: "rgba(0,0,0,0.18)", borderRadius: 12, border: "1px solid var(--glass-border)" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>LATEST SCORE</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: hasData ? theme.stroke : "var(--text-muted)", fontFamily: "'Sora', sans-serif" }}>
            {hasData ? `${latestScore}%` : "—"}
          </div>
        </div>

        <div style={{ padding: "10px 14px", background: "rgba(0,0,0,0.18)", borderRadius: 12, border: "1px solid var(--glass-border)" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>PEAK SCORE</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: hasData ? "var(--cyan)" : "var(--text-muted)", fontFamily: "'Sora', sans-serif" }}>
            {hasData ? `${peakScore}%` : "—"}
          </div>
        </div>

        <div style={{ padding: "10px 14px", background: "rgba(0,0,0,0.18)", borderRadius: 12, border: "1px solid var(--glass-border)" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>STATUS</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: hasData ? "#10b981" : "var(--text-muted)", marginTop: 2 }}>
            {hasData ? "Active Tracking" : "Ready to Start"}
          </div>
        </div>
      </div>

      {/* ── GRAPH OR CLEAN EMPTY STATE ────────────────────────────────────── */}
      {!hasData ? (
        <div
          style={{
            padding: "48px 24px",
            textAlign: "center",
            background: "rgba(0,0,0,0.12)",
            borderRadius: 16,
            border: "1px dashed var(--glass-border)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ fontSize: 36 }}>📊</div>
          <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: "var(--text)" }}>
            No {activeMetric === "all" ? "Activity" : activeMetric.toUpperCase()} Sessions Recorded Yet
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: 13.5, maxWidth: 460, margin: 0 }}>
            Complete your first session in this category to start charting your live score progression and velocity over time.
          </p>
          <div style={{ marginTop: 8 }}>
            <Link
              to={
                activeMetric === "voice"
                  ? "/voice"
                  : activeMetric === "company"
                  ? "/company-assessment"
                  : activeMetric === "typing"
                  ? "/typing-test"
                  : "/setup"
              }
              className="btn btn-primary"
              style={{ padding: "9px 20px", fontSize: 13 }}
            >
              Start {activeMetric === "voice" ? "Voice AI" : activeMetric === "company" ? "Company Exam" : activeMetric === "typing" ? "Typing Test" : "Mock Interview"} →
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ position: "relative", width: "100%", overflowX: "auto" }}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            style={{ width: "100%", height: "auto", minWidth: 500, overflow: "visible" }}
          >
            <defs>
              <linearGradient id={`grad-${activeMetric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.stroke} stopOpacity="0.3" />
                <stop offset="100%" stopColor={theme.stroke} stopOpacity="0.0" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Grid lines (horizontal) */}
            {[100, 75, 50, 25, 0].map((val) => {
              const minS = 0;
              const maxS = 100;
              const normalized = (val - minS) / (maxS - minS);
              const y = height - padY - normalized * innerH;
              return (
                <g key={val}>
                  <line
                    x1={padX}
                    y1={y}
                    x2={width - padX}
                    y2={y}
                    stroke="rgba(255,255,255,0.06)"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={padX - 8}
                    y={y + 4}
                    fill="var(--text-muted)"
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
            {areaD && <path d={areaD} fill={`url(#grad-${activeMetric})`} />}

            {/* Main Trend Line */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke={theme.stroke}
                strokeWidth="3.5"
                strokeLinecap="round"
                filter="url(#glow)"
              />
            )}

            {/* Interactive Data Nodes */}
            {points.map((pt) => {
              const isHovered = hoveredPoint?.id === pt.id;
              return (
                <g
                  key={pt.id}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  {isHovered && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="12"
                      fill={theme.stroke}
                      opacity="0.25"
                    />
                  )}

                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? "7" : "5"}
                    fill={isHovered ? "#fff" : theme.stroke}
                    stroke={theme.stroke}
                    strokeWidth="2.5"
                    style={{ transition: "all 0.2s ease" }}
                  />

                  <text
                    x={pt.x}
                    y={height - 6}
                    fill={isHovered ? "var(--text)" : "var(--text-muted)"}
                    fontSize="11"
                    fontWeight={isHovered ? "800" : "600"}
                    textAnchor="middle"
                  >
                    {pt.day}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Dynamic Hover Tooltip */}
          {hoveredPoint && (
            <div
              style={{
                position: "absolute",
                left: `${(hoveredPoint.x / width) * 100}%`,
                top: `${(hoveredPoint.y / height) * 100}%`,
                transform: "translate(-50%, -115%)",
                background: "var(--card-bg, #1a1528)",
                border: `1px solid ${theme.stroke}60`,
                boxShadow: `0 8px 24px ${theme.stroke}35`,
                borderRadius: 10,
                padding: "8px 12px",
                pointerEvents: "none",
                zIndex: 30,
                whiteSpace: "nowrap",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>
                {hoveredPoint.fullDate || hoveredPoint.day}
              </div>
              <div style={{ fontSize: 14, fontWeight: 900, color: theme.stroke, margin: "2px 0" }}>
                {hoveredPoint.score}% Score
              </div>
              <div style={{ fontSize: 11, color: "var(--text-dim)" }}>
                {hoveredPoint.title || hoveredPoint.label}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
