import { useState, useEffect } from "react";
import { getGoogleClientId, setGoogleClientId, promptGoogleAccountPicker } from "../utils/googleAuth";
import { IconX, IconAlertTriangle } from "./common/AppIcon";

export default function GoogleAuthModal({ isOpen, onClose, onSuccess, onError }) {
  const [clientId, setClientId] = useState(() => getGoogleClientId());
  const [activeTab, setActiveTab] = useState(clientId ? "oauth" : "oauth");
  const [showInstructions, setShowInstructions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Direct manual Google account inputs (fallback)
  const [manualEmail, setManualEmail] = useState("");
  const [manualName, setManualName] = useState("");

  if (!isOpen) return null;

  const handleConnectWithOAuth = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");
    const cleanId = clientId.trim();

    if (!cleanId) {
      setErrorMsg("Please enter your Google OAuth Client ID.");
      return;
    }
    if (!cleanId.includes(".apps.googleusercontent.com")) {
      setErrorMsg("Client ID usually ends with '.apps.googleusercontent.com'. Please check the format.");
      return;
    }

    try {
      setLoading(true);
      setGoogleClientId(cleanId);
      const profile = await promptGoogleAccountPicker(cleanId);
      onSuccess(profile);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Google Sign-In was cancelled or failed.");
      if (onError) onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleManualGoogleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    const cleanEmail = manualEmail.trim().toLowerCase();
    const cleanName = manualName.trim() || cleanEmail.split("@")[0];

    if (!cleanEmail) {
      setErrorMsg("Please enter your Google email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      onSuccess({
        name: cleanName,
        email: cleanEmail,
        provider: "Google",
        picture: null,
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          background: "linear-gradient(145deg, #161226 0%, #0d0c18 100%)",
          border: "1px solid rgba(124, 58, 237, 0.3)",
          borderRadius: 20,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(124, 58, 237, 0.2)",
          padding: "28px 26px",
          color: "#f8fafc",
          position: "relative",
          animation: "modalPop 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.6)",
            cursor: "pointer",
            fontSize: 16,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
        >
          <IconX size={16} />
        </button>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#fff" }}>
              Sign in with Google
            </h3>
            <p style={{ margin: "3px 0 0", fontSize: 13, color: "rgba(226, 232, 240, 0.65)" }}>
              Authenticate with your real Google account on this device
            </p>
          </div>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div
            style={{
              padding: "10px 14px",
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.35)",
              borderRadius: 10,
              color: "#fca5a5",
              fontSize: 13,
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <IconAlertTriangle size={16} color="#fca5a5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab switch */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 6,
            background: "rgba(0,0,0,0.3)",
            padding: 4,
            borderRadius: 12,
            marginBottom: 20,
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("oauth")}
            style={{
              padding: "8px 12px",
              borderRadius: 9,
              border: "none",
              background: activeTab === "oauth" ? "rgba(124, 58, 237, 0.35)" : "transparent",
              color: activeTab === "oauth" ? "#fff" : "rgba(255,255,255,0.6)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Official Google Popup
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("direct")}
            style={{
              padding: "8px 12px",
              borderRadius: 9,
              border: "none",
              background: activeTab === "direct" ? "rgba(124, 58, 237, 0.35)" : "transparent",
              color: activeTab === "direct" ? "#fff" : "rgba(255,255,255,0.6)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Quick Google Email
          </button>
        </div>

        {/* ── TAB 1: OFFICIAL GOOGLE OAUTH POPUP ── */}
        {activeTab === "oauth" && (
          <div>
            <p style={{ margin: "0 0 12px", fontSize: 13, color: "rgba(226, 232, 240, 0.75)", lineHeight: 1.5 }}>
              Google requires an <strong>OAuth 2.0 Client ID</strong> to pop up the account chooser listing your actual Google accounts on this device:
            </p>

            <form onSubmit={handleConnectWithOAuth}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(226, 232, 240, 0.8)", marginBottom: 6 }}>
                  Google OAuth Client ID
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder="e.g. 1234567890-abcdef.apps.googleusercontent.com"
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "11px 40px 11px 12px",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 10,
                      color: "#fff",
                      fontSize: 13,
                      outline: "none",
                      fontFamily: "monospace",
                    }}
                  />
                  {clientId && (
                    <button
                      type="button"
                      onClick={() => setClientId("")}
                      style={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "rgba(255,255,255,0.4)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <IconX size={14} />
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: 11,
                  border: "none",
                  background: "linear-gradient(135deg, #4285F4 0%, #2b6cb0 100%)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: loading ? "wait" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  boxShadow: "0 4px 14px rgba(66, 133, 244, 0.35)",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  opacity: loading ? 0.75 : 1,
                }}
              >
                {loading ? (
                  <>Opening Google Account Selector…</>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    Open Google Account Selector
                  </>
                )}
              </button>
            </form>

            {/* Collapsible How-To */}
            <div style={{ marginTop: 14 }}>
              <button
                type="button"
                onClick={() => setShowInstructions(!showInstructions)}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(167, 139, 250, 0.9)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: 0,
                }}
              >
                <span>{showInstructions ? "▼" : "▶"}</span>
                <span>How to get a Google Client ID in 2 minutes (Free)</span>
              </button>

              {showInstructions && (
                <div
                  style={{
                    marginTop: 10,
                    padding: "12px 14px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 10,
                    fontSize: 12,
                    color: "rgba(226, 232, 240, 0.8)",
                    lineHeight: 1.6,
                  }}
                >
                  <ol style={{ margin: 0, paddingLeft: 18 }}>
                    <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" style={{ color: "#60a5fa" }}>Google Cloud Console &rarr; Credentials</a>.</li>
                    <li>Click <strong>+ Create Credentials</strong> &rarr; <strong>OAuth client ID</strong>.</li>
                    <li>Choose <strong>Web application</strong> as Application type.</li>
                    <li>Under <strong>Authorized JavaScript origins</strong>, add:
                      <div style={{ margin: "4px 0", fontFamily: "monospace", color: "#34d399", background: "rgba(0,0,0,0.4)", padding: "3px 6px", borderRadius: 4 }}>
                        http://localhost:5173
                      </div>
                    </li>
                    <li>Click <strong>Create</strong> and copy your <strong>Client ID</strong> here!</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: QUICK DIRECT GOOGLE EMAIL ── */}
        {activeTab === "direct" && (
          <div>
            <p style={{ margin: "0 0 14px", fontSize: 13, color: "rgba(226, 232, 240, 0.75)", lineHeight: 1.5 }}>
              Quickly sign in with your real Google account without configuring Google Cloud Console:
            </p>

            <form onSubmit={handleManualGoogleSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(226, 232, 240, 0.8)", marginBottom: 6 }}>
                  Your Google Email
                </label>
                <input
                  type="email"
                  required
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  placeholder="e.g. alex.chen@gmail.com"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "11px 12px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 10,
                    color: "#fff",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(226, 232, 240, 0.8)", marginBottom: 6 }}>
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="e.g. Alex Chen"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "11px 12px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 10,
                    color: "#fff",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: 11,
                  border: "none",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: loading ? "wait" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
                }}
              >
                {loading ? "Signing in…" : "Sign In with Google Identity"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
