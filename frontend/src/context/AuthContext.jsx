/**
 * AuthContext.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides authentication state and methods for the InterviewMate app.
 *
 * Strategy:
 *  1. Always try the MongoDB-backed FastAPI backend first.
 *  2. If the backend returns a user-facing error (401, 400, 409) → surface it
 *     directly to the user; do NOT fall through to local storage.
 *  3. If the backend is unreachable (network error / 5xx) → fall through to
 *     the localStorage / in-memory fallback so the app still works offline.
 *  4. Demo credentials always work locally without touching the network.
 */

import { createContext, useContext, useState, useEffect } from "react";
import {
  authRegister,
  authLogin,
  authSocial,
  authGoogle,
  authSendRegisterOtp,
  authForgotPassword,
  authResetPassword,
} from "../api/api";

const AuthContext = createContext(null);

const AUTH_KEY  = "im_auth_user";
const USERS_KEY = "im_registered_users";

export const DEFAULT_DEMO_USER = {
  id:         "usr-demo",
  name:       "Demo Candidate",
  email:      "demo@interviewmate.ai",
  password:   "password123",
  provider:   "email",
  created_at: "2025-01-01T00:00:00.000Z",
  joinedAt:   1735689600000,
};

// ── Local-storage helpers ─────────────────────────────────────────────────────

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getLocalUsers() {
  try {
    const list = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    // Always ensure demo account is present
    if (!list.some((u) => u.email === DEFAULT_DEMO_USER.email)) {
      list.unshift(DEFAULT_DEMO_USER);
      localStorage.setItem(USERS_KEY, JSON.stringify(list));
    }
    return list;
  } catch {
    return [DEFAULT_DEMO_USER];
  }
}

function saveLocalUsers(list) {
  localStorage.setItem(USERS_KEY, JSON.stringify(list));
}

function saveSession(userObj) {
  const session = { ...userObj, lastLogin: Date.now() };
  delete session.password;
  delete session.password_hash;
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  return session;
}

function broadcastAuth() {
  window.dispatchEvent(new Event("im_auth_changed"));
  window.dispatchEvent(new Event("im_activity_updated"));
}

/** Return true when the error is definitely a network / server error (not a
 *  user-facing validation rejection from the backend). */
function isNetworkOrServerError(err) {
  if (!err) return true;
  if (err.code === "ERR_NETWORK" || err.code === "ECONNREFUSED") return true;
  if (!err.response) return true;                   // no response at all
  const s = err.response?.status;
  return s >= 500 || s === 503 || s === 502;        // server-side failure
}

/** Decode a Google JWT token payload (base64url → JSON). */
function decodeJwt(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(
      decodeURIComponent(
        atob(base64).split("").map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
      )
    );
  } catch {
    return null;
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());

  useEffect(() => {
    const handle = () => setUser(getStoredUser());
    window.addEventListener("im_auth_changed", handle);
    return () => window.removeEventListener("im_auth_changed", handle);
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────

  const login = async (email, password) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail)  throw new Error("Please enter your email address.");
    if (!password)    throw new Error("Please enter your password.");

    // Demo fast-path (local only, no network)
    if (
      cleanEmail === DEFAULT_DEMO_USER.email &&
      (password === DEFAULT_DEMO_USER.password || password === "demo123")
    ) {
      const session = saveSession(DEFAULT_DEMO_USER);
      setUser(session);
      broadcastAuth();
      return session;
    }

    // ── Try backend (MongoDB) first ───────────────────────────────────────
    try {
      const serverUser = await authLogin(cleanEmail, password);

      // Cache locally for offline access
      const users = getLocalUsers().filter((u) => u.email !== cleanEmail);
      users.push({ ...serverUser, password }); // store plain pw for offline verify
      saveLocalUsers(users);

      const session = saveSession(serverUser);
      setUser(session);
      broadcastAuth();
      return session;

    } catch (err) {
      // If backend gave a clear user-facing error → propagate it, don't fall back
      if (!isNetworkOrServerError(err)) {
        const detail = err.response?.data?.detail || err.message;
        throw new Error(detail || "Login failed. Please check your credentials.");
      }

      // Backend unreachable → try local fallback
      console.warn("[Auth] Backend unreachable — checking local credentials.");
    }

    // ── Local fallback (backend offline) ─────────────────────────────────
    const users  = getLocalUsers();
    const found  = users.find((u) => u.email === cleanEmail);

    if (!found) {
      throw new Error("No account found with this email. Please sign up first.");
    }
    if (found.password && found.password !== password) {
      throw new Error("Incorrect password. Please check and try again.");
    }

    const session = saveSession(found);
    setUser(session);
    broadcastAuth();
    return session;
  };

  // ── Demo Login ────────────────────────────────────────────────────────────

  const demoLogin = async () => login(DEFAULT_DEMO_USER.email, DEFAULT_DEMO_USER.password);

  // ── Register Send OTP ─────────────────────────────────────────────────────

  const sendRegisterOtp = async (email, name = "") => {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanName  = (name  || "").trim();
    if (!cleanEmail) throw new Error("Please enter your email address.");

    try {
      return await authSendRegisterOtp(cleanEmail, cleanName);
    } catch (err) {
      if (err.response?.data?.detail) {
        throw new Error(err.response.data.detail);
      }
      if (err.response) {
        throw new Error("Failed to send verification code. Please try again.");
      }
      // Offline fallback: only when server is truly unreachable
      const users = getLocalUsers();
      if (users.some((u) => u.email === cleanEmail && u.email !== DEFAULT_DEMO_USER.email)) {
        throw new Error("An account with this email already exists. Please sign in.");
      }
      const localOtp = Math.floor(1000 + Math.random() * 9000).toString();
      localStorage.setItem(`im_reg_otp_${cleanEmail}`, localOtp);
      return {
        message: "A 4-digit verification code has been sent.",
        email: cleanEmail,
      };
    }
  };

  // ── Register ──────────────────────────────────────────────────────────────

  const registerUser = async (name, email, password, otp = null) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanName  = (name  || "").trim();

    if (cleanName.length < 2)    throw new Error("Full name must be at least 2 characters.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) throw new Error("Please enter a valid email address.");
    if (!password || password.length < 8) throw new Error("Password must be at least 8 characters.");

    // ── Try backend (MongoDB) first ───────────────────────────────────────
    try {
      const serverUser = await authRegister(cleanName, cleanEmail, password, otp);

      // Cache locally
      const users = getLocalUsers().filter((u) => u.email !== cleanEmail);
      users.push({ ...serverUser, password });
      saveLocalUsers(users);

      const session = saveSession(serverUser);
      setUser(session);
      broadcastAuth();
      return session;

    } catch (err) {
      // 409 Conflict = email already registered → hard error, no fallback
      if (err.response?.status === 409) {
        throw new Error(err.response.data?.detail || "An account with this email already exists. Please sign in.");
      }
      if (err.response?.data?.detail) {
        throw new Error(err.response.data.detail);
      }
      if (err.response) {
        throw new Error("Registration failed. Please check your details and try again.");
      }
      // Backend offline → fall through to local storage
      console.warn("[Auth] Backend unreachable — saving account locally.");
    }

    // ── Local fallback ────────────────────────────────────────────────────
    if (otp) {
      const storedOtp = localStorage.getItem(`im_reg_otp_${cleanEmail}`);
      if (storedOtp && storedOtp !== otp.trim()) {
        throw new Error("Invalid 4-digit verification code. Please check and try again.");
      }
      localStorage.removeItem(`im_reg_otp_${cleanEmail}`);
    }

    const users = getLocalUsers();
    if (users.some((u) => u.email === cleanEmail && u.email !== DEFAULT_DEMO_USER.email)) {
      throw new Error("An account with this email already exists. Please sign in.");
    }

    const newUser = {
      id:         "usr-" + Date.now(),
      name:       cleanName,
      email:      cleanEmail,
      provider:   "email",
      created_at: new Date().toISOString(),
      joinedAt:   Date.now(),
    };

    const updated = users.filter((u) => u.email !== cleanEmail);
    updated.push({ ...newUser, password });
    saveLocalUsers(updated);

    const session = saveSession(newUser);
    setUser(session);
    broadcastAuth();
    return session;
  };

  // ── Forgot & Reset Password ───────────────────────────────────────────────

  const requestPasswordReset = async (email) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail) throw new Error("Please enter your email address.");

    try {
      return await authForgotPassword(cleanEmail);
    } catch (err) {
      if (err.response?.data?.detail) {
        throw new Error(err.response.data.detail);
      }
      if (err.response) {
        throw new Error("Failed to request password reset. Please try again.");
      }

      // Local offline fallback
      const users = getLocalUsers();
      const found = users.find((u) => u.email === cleanEmail);
      if (!found) {
        throw new Error("No account found with this email. Please check and try again.");
      }
      const localOtp = Math.floor(1000 + Math.random() * 9000).toString();
      localStorage.setItem(`im_reset_otp_${cleanEmail}`, localOtp);
      return {
        message: "A 4-digit password reset code has been sent.",
        email: cleanEmail,
      };
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanOtp   = (otp || "").trim();

    if (!cleanEmail) throw new Error("Email is required.");
    if (!cleanOtp)   throw new Error("Please enter the 4-digit verification code.");
    if (!newPassword || newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }

    try {
      const res = await authResetPassword(cleanEmail, cleanOtp, newPassword);

      // Update local cache user password as well
      const users = getLocalUsers();
      const idx = users.findIndex((u) => u.email === cleanEmail);
      if (idx !== -1) {
        users[idx].password = newPassword;
        saveLocalUsers(users);
      }
      return res;
    } catch (err) {
      if (!isNetworkOrServerError(err)) {
        throw new Error(err.response?.data?.detail || err.message || "Password reset failed.");
      }

      // Offline fallback
      const storedOtp = localStorage.getItem(`im_reset_otp_${cleanEmail}`);
      if (!storedOtp || storedOtp !== cleanOtp) {
        throw new Error("Invalid 4-digit verification code. Please check and try again.");
      }
      const users = getLocalUsers();
      const idx = users.findIndex((u) => u.email === cleanEmail);
      if (idx === -1) {
        throw new Error("Account not found locally.");
      }
      users[idx].password = newPassword;
      saveLocalUsers(users);
      localStorage.removeItem(`im_reset_otp_${cleanEmail}`);
      return {
        message: "Password reset successful (offline mode). You can now log in.",
        email: cleanEmail,
      };
    }
  };

  // ── Social Login ──────────────────────────────────────────────────────────

  const socialLogin = async (profile) => {
    const cleanEmail = (profile.email || "").trim().toLowerCase();
    const cleanName  = (profile.name  || "").trim() || cleanEmail.split("@")[0];
    const provider   = (profile.provider || "Google").trim();

    if (!cleanEmail) throw new Error("Email is required for social login.");

    // ── Try backend first ─────────────────────────────────────────────────
    try {
      const serverUser = await authSocial({ name: cleanName, email: cleanEmail, provider });
      const session = saveSession(serverUser);
      setUser(session);
      broadcastAuth();
      return session;
    } catch (err) {
      if (!isNetworkOrServerError(err)) {
        throw new Error(err.response?.data?.detail || "Social login failed.");
      }
      console.warn("[Auth] Backend offline for social login — using local fallback.");
    }

    // ── Local fallback ────────────────────────────────────────────────────
    const users = getLocalUsers();
    let existing = users.find((u) => u.email === cleanEmail);

    if (!existing) {
      existing = {
        id:         "usr-" + Date.now(),
        name:       cleanName,
        email:      cleanEmail,
        provider,
        created_at: new Date().toISOString(),
        joinedAt:   Date.now(),
      };
      users.push(existing);
      saveLocalUsers(users);
    } else {
      existing.name     = cleanName;
      existing.provider = provider;
      saveLocalUsers(users);
    }

    const session = saveSession(existing);
    setUser(session);
    broadcastAuth();
    return session;
  };

  // ── Google OAuth (ID token) ───────────────────────────────────────────────

  const googleLogin = async (credential) => {
    try {
      const serverUser = await authGoogle(credential);
      const session = saveSession(serverUser);
      setUser(session);
      broadcastAuth();
      return session;
    } catch (err) {
      if (!isNetworkOrServerError(err)) {
        throw new Error(err.response?.data?.detail || "Google Sign-In failed.");
      }
      // Backend offline → decode JWT locally and use social fallback
      console.warn("[Auth] Backend offline for Google auth — decoding JWT locally.");
      const profile = decodeJwt(credential);
      return socialLogin({
        name:     profile?.name  || "Google User",
        email:    profile?.email || "user@gmail.com",
        provider: "Google",
      });
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
    broadcastAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        demoLogin,
        sendRegisterOtp,
        registerUser,
        requestPasswordReset,
        resetPassword,
        socialLogin,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
