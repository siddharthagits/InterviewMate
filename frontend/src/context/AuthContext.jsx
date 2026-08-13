import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = "im_auth_user";
const USERS_STORAGE_KEY = "im_registered_users";

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getStoredUser());
    };
    window.addEventListener("im_auth_changed", handleAuthChange);
    return () => window.removeEventListener("im_auth_changed", handleAuthChange);
  }, []);

  const login = (email, password) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail) throw new Error("Please enter a valid email");

    // Look up in registered users or create account session for the credentials
    let registered = [];
    try {
      registered = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || "[]");
    } catch {
      registered = [];
    }

    let existing = registered.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!existing) {
      // Create user record
      const userName = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
      const capitalized = userName.charAt(0).toUpperCase() + userName.slice(1);
      existing = {
        id: "usr-" + Date.now(),
        name: capitalized,
        email: cleanEmail,
        joinedAt: Date.now(),
      };
      registered.push(existing);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(registered));
    }

    const sessionUser = {
      ...existing,
      lastLogin: Date.now(),
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    window.dispatchEvent(new Event("im_auth_changed"));
    window.dispatchEvent(new Event("im_activity_updated"));
    return sessionUser;
  };

  const registerUser = (name, email, password) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanName = (name || "").trim() || cleanEmail.split("@")[0];

    if (!cleanEmail) throw new Error("Please enter an email");

    let registered = [];
    try {
      registered = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || "[]");
    } catch {
      registered = [];
    }

    const newUser = {
      id: "usr-" + Date.now(),
      name: cleanName,
      email: cleanEmail,
      joinedAt: Date.now(),
    };

    // Replace or add
    const filtered = registered.filter((u) => u.email.toLowerCase() !== cleanEmail);
    filtered.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filtered));

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
    window.dispatchEvent(new Event("im_auth_changed"));
    window.dispatchEvent(new Event("im_activity_updated"));
    return newUser;
  };

  const socialLogin = (provider = "google") => {
    const providerProfiles = {
      google: { name: "Alex Morgan", email: "alex.morgan@gmail.com", provider: "Google" },
      github: { name: "Dev Siddhartha", email: "dev.siddhartha@github.com", provider: "GitHub" },
      linkedin: { name: "Sarah Chen", email: "sarah.chen@linkedin.com", provider: "LinkedIn" },
      x: { name: "Max Rivera", email: "max.rivera@x.com", provider: "X" },
    };

    const profile = providerProfiles[provider] || {
      name: `${provider.toUpperCase()} User`,
      email: `${provider}.user@interviewmate.ai`,
      provider: provider.toUpperCase(),
    };

    let registered = [];
    try {
      registered = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || "[]");
    } catch {
      registered = [];
    }

    let existing = registered.find((u) => u.email.toLowerCase() === profile.email.toLowerCase());
    if (!existing) {
      existing = {
        id: "usr-" + Date.now(),
        name: profile.name,
        email: profile.email,
        provider: profile.provider,
        joinedAt: Date.now(),
      };
      registered.push(existing);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(registered));
    }

    const sessionUser = {
      ...existing,
      lastLogin: Date.now(),
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    window.dispatchEvent(new Event("im_auth_changed"));
    window.dispatchEvent(new Event("im_activity_updated"));
    return sessionUser;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    window.dispatchEvent(new Event("im_auth_changed"));
    window.dispatchEvent(new Event("im_activity_updated"));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        registerUser,
        socialLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
