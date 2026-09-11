import { AppIcon } from "../components/common/AppIcon";
import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getStoredActivities, dbSessionToActivity } from "../utils/activityTracker";
import { fetchInterviewSessions, deleteInterviewSession } from "../api/api";
import { useAuth } from "../context/AuthContext";

function perfColor(score) {
  if (score >= 85) return "#10b981";
  if (score >= 70) return "#7c3aed";
  if (score >= 55) return "#f59e0b";
  return "#ef4444";
}

function formatTimeAgo(timestamp) {
  if (!timestamp) return "Recently";
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Loading skeleton card
function SkeletonCard() {
  return (
    <div
      className="glass"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
        padding: "20px 24px",
        borderRadius: 16,
        border: "1px solid var(--glass-border)",
        opacity: 0.5,
        animation: "pulse 1.5s infinite",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(124,58,237,0.12)" }} />
        <div>
          <div style={{ width: 180, height: 14, background: "rgba(255,255,255,0.08)", borderRadius: 6, marginBottom: 8 }} />
          <div style={{ width: 120, height: 11, background: "rgba(255,255,255,0.05)", borderRadius: 6 }} />
        </div>
      </div>
      <div style={{ width: 56, height: 28, background: "rgba(255,255,255,0.08)", borderRadius: 8 }} />
    </div>
  );
}

function History() {
  const nav = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [activities, setActivities] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Merge local activities + persistent sessions (deduplicated by id)
  const loadAll = useCallback(async () => {
    if (!isLoggedIn || !user?.id) {
      setActivities([]);
      setLoading(false);
      return;
    }
    const local = getStoredActivities();

    // Fetch DB sessions and merge
    setLoading(true);
    try {
      const dbSessions = await fetchInterviewSessions(user.id);
      const dbActivities = dbSessions.map(dbSessionToActivity);

      // Deduplicate: DB entries take priority over localStorage duplicates
      const dbIds = new Set(dbActivities.map((a) => a._dbId));

      // Keep localStorage entries that are NOT a technical interview already in DB
      const filteredLocal = local.filter((a) => {
        if (a.type !== "technical") return true; // keep non-technical always
        return dbIds.size === 0; // only keep local technical if DB returned nothing
      });

      const merged = [...dbActivities, ...filteredLocal].sort(
        (a, b) => (b.timestamp || 0) - (a.timestamp || 0)
      );
      setActivities(merged);
    } catch {
      setActivities(local);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, user?.id]);

  useEffect(() => {
    loadAll();
    const handleUpdate = () => loadAll();
    window.addEventListener("im_activity_updated", handleUpdate);
    window.addEventListener("im_auth_changed", handleUpdate);
    return () => {
      window.removeEventListener("im_activity_updated", handleUpdate);
      window.removeEventListener("im_auth_changed", handleUpdate);
    };
  }, [loadAll]);

  const handleDelete = async (act) => {
    if (!act._dbId) return;
    if (!window.confirm("Delete this session? This cannot be undone.")) return;
    setDeletingId(act._dbId);
    const ok = await deleteInterviewSession(act._dbId);
    if (ok) {
      setActivities((prev) => prev.filter((a) => a._dbId !== act._dbId));
    } else {
      alert("Could not delete session. Please try again.");
    }
    setDeletingId(null);
  };

  const filtered = activities.filter((a) => {
    if (activeFilter === "all") return true;
    return a.type === activeFilter;
  });

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
            fontSize: 12,
            color: "var(--violet-light)",
            fontWeight: 800,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ width: 18, height: 1.5, background: "var(--violet-light)", display: "inline-block", borderRadius: 2 }} />
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <AppIcon name="clock" size={13} color="var(--violet-light)" /> Complete Session Logs
          </span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 6, letterSpacing: "-0.5px" }}>
          Activity &amp; Test History
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0 }}>
            {isLoggedIn && user
              ? `Comprehensive record of all tests, voice interviews, and practice sessions for ${user.name || user.email}.`
              : "Comprehensive real-time records of completed interviews and practice sessions."}
          </p>
        </div>
      </div>

      {!isLoggedIn || !user ? (
        <div
          className="glass"
          style={{
            padding: "54px 32px",
            textAlign: "center",
            borderRadius: 20,
            maxWidth: 620,
            margin: "20px auto 40px auto",
            border: "1px solid var(--glass-border)",
          }}
        >
          <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}><AppIcon name="lock" size={48} color="var(--violet-light)" /></div>
          <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8, letterSpacing: "-0.4px" }}>
            Sign In Required to View History
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6, maxWidth: 480, margin: "0 auto 24px auto" }}>
            Guest mode has been disabled. All interview logs, test scores, and performance analytics are strictly tied to authenticated user accounts.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <Link to="/login" className="btn btn-primary" style={{ padding: "10px 24px", fontSize: 13.5 }}>
              Sign In →
            </Link>
            <Link to="/register" className="btn btn-outline" style={{ padding: "10px 22px", fontSize: 13.5 }}>
              Create Account
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Filter Tabs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
        {[
          { id: "all", label: "All Records", icon: "grid" },
          { id: "technical", label: "Technical", icon: "code" },
          { id: "voice", label: "Voice AI", icon: "mic" },
          { id: "company", label: "Company Exams", icon: "building" },
          { id: "typing", label: "Typing", icon: "keyboard" },
          { id: "subject", label: "CS Bank", icon: "book" },
          { id: "practice", label: "Practice", icon: "brain" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            style={{
              padding: "7px 16px",
              borderRadius: 99,
              fontSize: 12.5,
              fontWeight: 700,
              cursor: "pointer",
              border: activeFilter === tab.id ? "1px solid var(--violet-light)" : "1px solid var(--glass-border)",
              background: activeFilter === tab.id ? "var(--violet)" : "rgba(255,255,255,0.03)",
              color: activeFilter === tab.id ? "#fff" : "var(--text-muted)",
              transition: "all 0.2s ease",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><AppIcon name={tab.icon} size={13} /> {tab.label}</span>
          </button>
        ))}
      </div>

      {/* History Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Loading skeleton */}
        {loading && activities.length === 0 && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {!loading && filtered.length === 0 ? (
          <div className="glass" style={{ padding: "48px 30px", textAlign: "center", borderRadius: 20 }}>
            <div style={{ marginBottom: 14, display: "flex", justifyContent: "center" }}><AppIcon name="clipboard" size={38} color="var(--violet-light)" /></div>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>
              {activities.length === 0 ? "No Test History Recorded Yet (Nil)" : "No Activities Found for this Filter"}
            </h3>
            <p style={{ fontSize: 13.5, color: "var(--text-muted)", maxWidth: 460, margin: "0 auto 22px auto" }}>
              {activities.length === 0
                ? "Your activity history starts clean. Take a mock interview, voice session, or company test to start logging your real scores."
                : "Try selecting another category or take a new test in this track."}
            </p>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12 }}>
              <Link to="/setup" className="btn btn-primary" style={{ padding: "9px 20px", fontSize: 13 }}>
                Start Mock Interview →
              </Link>
              <Link to="/voice" className="btn btn-gold" style={{ padding: "9px 20px", fontSize: 13 }}>
                Voice AI Interview →
              </Link>
              <Link to="/typing-test" className="btn btn-outline" style={{ padding: "9px 20px", fontSize: 13 }}>
                Typing Test →
              </Link>
            </div>
          </div>
        ) : (
          filtered.map((act) => {
            const scoreCol = perfColor(act.score);
            const isDbEntry = act._source === "db";
            const isDeleting = deletingId === act._dbId;

            return (
              <div
                key={act.id}
                className="glass"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                  padding: "20px 24px",
                  borderRadius: 16,
                  border: "1px solid var(--glass-border)",
                  transition: "all 0.2s ease",
                  opacity: isDeleting ? 0.5 : 1,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: `${act.color || "#7c3aed"}18`,
                      border: `1px solid ${act.color || "#7c3aed"}35`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                    }}
                  >
                    <AppIcon name={act.icon || "file"} size={22} color={act.color || "#7c3aed"} />
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: "var(--text)" }}>
                        {act.title}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: act.color || "#7c3aed",
                          background: `${act.color || "#7c3aed"}15`,
                          padding: "2px 8px",
                          borderRadius: 99,
                          border: `1px solid ${act.color || "#7c3aed"}30`,
                        }}
                      >
                        {act.category}
                      </span>
                    </div>

                    <div style={{ fontSize: 12.5, color: "var(--text-muted)", display: "flex", gap: 12, flexWrap: "wrap" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><AppIcon name="clock" size={12} color="var(--text-muted)" /> {formatTimeAgo(act.timestamp)}</span>
                      {act.metrics &&
                        Object.entries(act.metrics).map(([k, v]) => (
                          <span key={k}>
                            • <strong style={{ color: "var(--text-dim)", textTransform: "capitalize" }}>{k}:</strong> {v}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: scoreCol, fontFamily: "'Sora', sans-serif" }}>
                      {act.score}%
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 600 }}>
                      {act.badge || "Recorded"}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (act.type === "technical") nav("/setup");
                      else if (act.type === "voice") nav("/voice");
                      else if (act.type === "company") nav("/company-assessment");
                      else if (act.type === "typing") nav("/typing-test");
                      else if (act.type === "subject") nav("/question-bank");
                      else nav("/practice");
                    }}
                    className="btn btn-outline"
                    style={{ padding: "8px 16px", fontSize: 13 }}
                  >
                    Practice Again →
                  </button>

                  {/* Delete button — only for cloud sessions */}
                  {isDbEntry && (
                    <button
                      onClick={() => handleDelete(act)}
                      disabled={isDeleting}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: isDeleting ? "not-allowed" : "pointer",
                        border: "1px solid rgba(239,68,68,0.3)",
                        background: "rgba(239,68,68,0.06)",
                        color: "#ef4444",
                        transition: "all 0.2s ease",
                      }}
                      title="Delete session"
                    >
                      {isDeleting ? "…" : <AppIcon name="trash" size={15} color="#ef4444" />}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      </>
      )}
    </DashboardLayout>
  );
}

export default History;


