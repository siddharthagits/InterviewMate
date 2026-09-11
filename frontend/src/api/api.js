import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
});

export default api;

// ── Auth helpers (MongoDB-backed with full validation) ─────────────────────────

/**
 * Send a 4-digit verification code to the user's email for registration.
 * @param {string} email
 * @param {string} [name]
 * @returns {Promise<Object>} { message, email, otp }
 */
export async function authSendRegisterOtp(email, name = "") {
  const res = await api.post("/auth/register/send-otp", { email, name });
  return res.data;
}

/**
 * Register a new user with name, email, password, optional 4-digit OTP, and optional gender.
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @param {string} [otp]
 * @param {string} [gender]
 * @returns {Promise<Object>} User object
 */
export async function authRegister(name, email, password, otp = null, gender = null) {
  const res = await api.post("/auth/register", { name, email, password, otp, gender });
  return res.data;
}

/**
 * Send a 4-digit password reset code to the user's email.
 * @param {string} email
 * @returns {Promise<Object>} { message, email, otp }
 */
export async function authForgotPassword(email) {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data;
}

/**
 * Reset user's password using the 4-digit verification code.
 * @param {string} email
 * @param {string} otp
 * @param {string} newPassword
 * @returns {Promise<Object>} { message, email }
 */
export async function authResetPassword(email, otp, newPassword) {
  const res = await api.post("/auth/reset-password", {
    email,
    otp,
    new_password: newPassword,
  });
  return res.data;
}

/**
 * Log in an existing user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} User object
 */
export async function authLogin(email, password) {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

/**
 * Authenticate via Social provider profile.
 * @param {{ name: string, email: string, provider: string }} profile
 * @returns {Promise<Object>} User object
 */
export async function authSocial(profile) {
  const res = await api.post("/auth/social", profile);
  return res.data;
}

/**
 * Authenticate with real Google ID token verified by backend & Google OAuth servers.
 * @param {string} credential  - Google ID token
 * @returns {Promise<Object>} User object
 */
export async function authGoogle(credential) {
  const res = await api.post("/auth/google", { credential });
  return res.data;
}

/**
 * Exchange an OAuth authorization code from GitHub or LinkedIn with backend.
 * @param {string} provider - "github" | "linkedin"
 * @param {string} code
 * @param {string} [redirectUri]
 * @returns {Promise<Object>} User object
 */
export async function authOAuthCode(provider, code, redirectUri) {
  const res = await api.post(`/auth/oauth/${provider.toLowerCase()}`, {
    code,
    redirect_uri: redirectUri,
  });
  return res.data;
}

/**
 * Fetch current user data by user id or email.
 * @param {string} userId
 * @returns {Promise<Object>} User object
 */
export async function authGetMe(userId) {
  const res = await api.get("/auth/me", { params: { user_id: userId } });
  return res.data;
}

// ── Interview Session helpers (MongoDB-backed) ────────────────────────────────

/**
 * Save a completed interview session to MongoDB.
 * Only saves if a valid user_id is provided (guest sessions are not stored).
 * @param {Object} sessionData  - { user_id, interview_data, answers, evaluation }
 * @returns {Promise<Object|null>}  The saved session doc or null on failure.
 */
export async function saveInterviewSession(sessionData) {
  if (!sessionData?.user_id) {
    return null;
  }
  try {
    const res = await api.post("/interview-sessions", sessionData);
    return res.data;
  } catch (err) {
    console.warn("[InterviewMate] Could not save session to DB:", err?.message);
    return null;
  }
}

/**
 * Fetch all sessions for an authenticated user_id.
 * Returns empty array immediately if userId is not provided.
 * @param {string|null} userId
 * @returns {Promise<Array>}  Array of InterviewSessionResponse objects.
 */
export async function fetchInterviewSessions(userId = null) {
  if (!userId) {
    return [];
  }
  try {
    const params = { user_id: userId, limit: 50 };
    const res = await api.get("/interview-sessions", { params });
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.warn("[InterviewMate] Could not fetch sessions from DB:", err?.message);
    return [];
  }
}

/**
 * Delete a single interview session by MongoDB id.
 * @param {string} sessionId
 * @returns {Promise<boolean>}  true on success, false on failure.
 */
export async function deleteInterviewSession(sessionId) {
  try {
    await api.delete(`/interview-sessions/${sessionId}`);
    return true;
  } catch (err) {
    console.warn("[InterviewMate] Could not delete session:", err?.message);
    return false;
  }
}

/**
 * Update user profile attributes (gender, phone, city, linkedin_url, target_role, experience_level, college_or_company, bio).
 * @param {string} userId
 * @param {Object} profileData
 * @returns {Promise<Object>} Updated User object
 */
export async function authUpdateProfile(userId, profileData) {
  const res = await api.put("/auth/profile", {
    user_id: userId,
    ...profileData,
  });
  return res.data;
}