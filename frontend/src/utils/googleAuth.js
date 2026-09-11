/**
 * googleAuth.js — Google Identity Services (GIS) integration for InterviewMate
 * Supports:
 * 1. Native Google OAuth 2.0 Token Client popup (select real device Google account)
 * 2. Profile retrieval from Google UserInfo API (https://www.googleapis.com/oauth2/v3/userinfo)
 * 3. Client ID persistence in localStorage and .env detection
 */

export function getGoogleClientId() {
  const envId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || "").trim();
  if (envId && !envId.includes("your_google_client_id")) {
    return envId;
  }
  const storedId = (localStorage.getItem("vite_google_client_id") || "").trim();
  if (storedId && !storedId.includes("your_google_client_id")) {
    return storedId;
  }
  return "";
}

export function setGoogleClientId(clientId) {
  if (clientId && clientId.trim()) {
    localStorage.setItem("vite_google_client_id", clientId.trim());
  } else {
    localStorage.removeItem("vite_google_client_id");
  }
}

/**
 * Ensure the Google Identity Services SDK script is loaded in the DOM.
 */
export function ensureGoogleScriptLoaded() {
  return new Promise((resolve) => {
    if (window.google?.accounts?.oauth2) {
      return resolve(true);
    }
    const existing = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
    if (existing) {
      let checks = 0;
      const interval = setInterval(() => {
        checks++;
        if (window.google?.accounts?.oauth2) {
          clearInterval(interval);
          resolve(true);
        } else if (checks > 20) {
          clearInterval(interval);
          resolve(false);
        }
      }, 150);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      let checks = 0;
      const interval = setInterval(() => {
        checks++;
        if (window.google?.accounts?.oauth2) {
          clearInterval(interval);
          resolve(true);
        } else if (checks > 15) {
          clearInterval(interval);
          resolve(false);
        }
      }, 100);
    };
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

/**
 * Launch the official Google Account Picker popup for this device.
 * Resolves with user profile: { name, email, picture, sub, accessToken }
 */
export async function promptGoogleAccountPicker(customClientId = null) {
  await ensureGoogleScriptLoaded();

  if (!window.google?.accounts?.oauth2) {
    throw new Error(
      "Google Identity Services is unavailable. Please check your internet connection and try again."
    );
  }

  const clientId = (customClientId || getGoogleClientId()).trim();
  if (!clientId) {
    const err = new Error("Google OAuth Client ID is not configured.");
    err.code = "MISSING_CLIENT_ID";
    throw err;
  }

  return new Promise((resolve, reject) => {
    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "openid profile email",
        prompt: "select_account", // Force account picker to choose device account
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            return reject(
              new Error(tokenResponse.error_description || tokenResponse.error || "Google authentication failed")
            );
          }

          if (!tokenResponse.access_token) {
            return reject(new Error("No access token returned by Google."));
          }

          try {
            // Fetch real user info from Google
            const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
              },
            });

            if (!userInfoRes.ok) {
              throw new Error("Failed to fetch user profile from Google.");
            }

            const profile = await userInfoRes.json();
            if (!profile.email) {
              throw new Error("Google account did not return an email address.");
            }

            resolve({
              name: profile.name || profile.given_name || profile.email.split("@")[0],
              email: profile.email.toLowerCase().trim(),
              picture: profile.picture || null,
              sub: profile.sub,
              accessToken: tokenResponse.access_token,
            });
          } catch (fetchErr) {
            reject(fetchErr);
          }
        },
        error_callback: (error) => {
          reject(new Error(error?.message || "Google popup encountered an error."));
        },
      });

      tokenClient.requestAccessToken({ prompt: "select_account" });
    } catch (err) {
      reject(err);
    }
  });
}
