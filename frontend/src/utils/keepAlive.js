/**
 * keepAlive.js
 * Pings the Render backend every 10 minutes so the free-tier service
 * never spins down and users don't experience 502 / cold-start delays.
 */
const BACKEND_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const PING_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

let intervalId = null;

async function ping() {
  try {
    await fetch(`${BACKEND_URL}/health`, {
      method: "GET",
      // Don't send credentials for a simple health ping
      credentials: "omit",
      // Abort if the server doesn't respond within 8 seconds
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    // Silently ignore — the server might be waking up right now
  }
}

/**
 * Call once at app startup.
 * Sends an immediate ping, then repeats every 10 minutes.
 */
export function startKeepAlive() {
  if (intervalId !== null) return; // already running
  ping(); // fire immediately on start
  intervalId = setInterval(ping, PING_INTERVAL_MS);
}

/**
 * Call if you ever need to stop (e.g. user logs out and the app is idle).
 */
export function stopKeepAlive() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
