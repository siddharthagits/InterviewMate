import { AppIcon } from "../components/common/AppIcon";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getStoredActivities, calculateOverallStats, clearActivityHistory } from "../utils/activityTracker";

const COUNTRY_CODES = [
  { code: "+91", label: "🇮🇳 +91", country: "India", digits: 10, placeholder: "98765 43210" },
  { code: "+1",  label: "🇺🇸 +1",  country: "US / Canada", digits: 10, placeholder: "(555) 000-1234" },
  { code: "+44", label: "🇬🇧 +44", country: "UK", digits: 10, placeholder: "7911 123456" },
  { code: "+61", label: "🇦🇺 +61", country: "Australia", digits: 9, placeholder: "412 345 678" },
  { code: "+971",label: "🇦🇪 +971", country: "UAE", digits: 9, placeholder: "50 123 4567" },
  { code: "+65", label: "🇸🇬 +65", country: "Singapore", digits: 8, placeholder: "8123 4567" },
  { code: "+49", label: "🇩🇪 +49", country: "Germany", digits: 10, placeholder: "151 12345678" },
  { code: "+33", label: "🇫🇷 +33", country: "France", digits: 9, placeholder: "6 12 34 56 78" },
  { code: "+81", label: "🇯🇵 +81", country: "Japan", digits: 10, placeholder: "90 1234 5678" },
  { code: "+",   label: "🌐 +",   country: "Other", digits: null, placeholder: "Enter international phone number" },
];

const COUNTRY_TO_PHONE_CODE = {
  "India": "+91",
  "United States": "+1",
  "United Kingdom": "+44",
  "Canada": "+1",
  "Australia": "+61",
  "United Arab Emirates": "+971",
  "Singapore": "+65",
  "Germany": "+49",
  "France": "+33",
  "Japan": "+81",
};

const COUNTRY_CITY_MAP = {
  "India": [
    "Bengaluru",
    "Mumbai",
    "Delhi NCR / New Delhi",
    "Hyderabad",
    "Pune",
    "Chennai",
    "Kolkata",
    "Ahmedabad",
    "Jaipur",
    "Kochi",
    "Chandigarh",
    "Noida",
    "Gurugram",
    "Indore",
    "Coimbatore",
    "Other",
  ],
  "United States": [
    "San Francisco / Bay Area",
    "New York City",
    "Seattle",
    "Austin",
    "Boston",
    "Chicago",
    "Los Angeles",
    "Atlanta",
    "Denver",
    "San Diego",
    "Washington D.C.",
    "Dallas / Fort Worth",
    "Other",
  ],
  "United Kingdom": [
    "London",
    "Manchester",
    "Birmingham",
    "Edinburgh",
    "Bristol",
    "Cambridge",
    "Oxford",
    "Leeds",
    "Glasgow",
    "Other",
  ],
  "Canada": [
    "Toronto",
    "Vancouver",
    "Montreal",
    "Ottawa",
    "Calgary",
    "Waterloo",
    "Edmonton",
    "Other",
  ],
  "Australia": [
    "Sydney",
    "Melbourne",
    "Brisbane",
    "Perth",
    "Adelaide",
    "Canberra",
    "Other",
  ],
  "United Arab Emirates": [
    "Dubai",
    "Abu Dhabi",
    "Sharjah",
    "Ajman",
    "Other",
  ],
  "Germany": [
    "Berlin",
    "Munich",
    "Frankfurt",
    "Hamburg",
    "Stuttgart",
    "Cologne",
    "Other",
  ],
  "Singapore": [
    "Singapore Central",
    "Jurong",
    "Changi",
    "Tampines",
    "Woodlands",
    "Other",
  ],
  "France": [
    "Paris",
    "Lyon",
    "Marseille",
    "Toulouse",
    "Nice",
    "Bordeaux",
    "Other",
  ],
  "Japan": [
    "Tokyo",
    "Osaka",
    "Kyoto",
    "Yokohama",
    "Nagoya",
    "Fukuoka",
    "Other",
  ],
  "Netherlands": [
    "Amsterdam",
    "Rotterdam",
    "Utrecht",
    "The Hague",
    "Eindhoven",
    "Other",
  ],
  "Ireland": [
    "Dublin",
    "Cork",
    "Galway",
    "Limerick",
    "Other",
  ],
  "Other": [
    "Other",
  ],
};

function splitPhone(fullPhone) {
  if (!fullPhone) return { countryCode: "+91", phoneDigits: "" };
  const trimmed = fullPhone.trim();
  for (const c of COUNTRY_CODES) {
    if (c.code !== "+" && trimmed.startsWith(c.code)) {
      return { countryCode: c.code, phoneDigits: trimmed.slice(c.code.length).trim() };
    }
  }
  return { countryCode: "+91", phoneDigits: trimmed };
}

function Profile() {
  const { user, isLoggedIn, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [copied, setCopied] = useState(false);

  // Profile Edit / Complete Mode
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");
  const [saveError, setSaveError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    country: "",
    city: "",
    address: "",
    linkedin_url: "",
    target_role: "",
    experience_level: "",
    college_or_company: "",
    bio: "",
  });

  const [isCustomCity, setIsCustomCity] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneDigits, setPhoneDigits] = useState("");

  useEffect(() => {
    setActivities(getStoredActivities());
    const handleUpdate = () => setActivities(getStoredActivities());
    window.addEventListener("im_activity_updated", handleUpdate);
    return () => window.removeEventListener("im_activity_updated", handleUpdate);
  }, [user]);

  useEffect(() => {
    if (user) {
      const userCountry = user.country || "";
      const userCity = user.city || "";
      const cities = userCountry && COUNTRY_CITY_MAP[userCountry] ? COUNTRY_CITY_MAP[userCountry] : [];
      const isKnownCity = cities.includes(userCity) && userCity !== "Other";

      setFormData({
        name: user.name || "",
        gender: user.gender || "",
        country: userCountry,
        city: userCity,
        address: user.address || "",
        linkedin_url: user.linkedin_url || "",
        target_role: user.target_role || "",
        experience_level: user.experience_level || "",
        college_or_company: user.college_or_company || "",
        bio: user.bio || "",
      });

      if (userCity && !isKnownCity) {
        setIsCustomCity(true);
      } else {
        setIsCustomCity(false);
      }

      const parsed = splitPhone(user.phone);
      setCountryCode(parsed.countryCode);
      setPhoneDigits(parsed.phoneDigits);
    }
  }, [user]);

  const stats = calculateOverallStats(activities);

  const calculateProfileCompletion = (u) => {
    if (!u) return 0;
    let score = 0;
    if (u.name) score += 10;
    if (u.email) score += 10;
    if (u.gender) score += 10;
    if (u.phone) score += 10;
    if (u.country) score += 10;
    if (u.city) score += 10;
    if (u.address) score += 10;
    if (u.linkedin_url) score += 10;
    if (u.target_role) score += 10;
    if (u.experience_level) score += 10;
    return Math.min(100, score);
  };

  const completionPct = calculateProfileCompletion(user);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to reset all your test records and performance history? This cannot be undone.")) {
      clearActivityHistory();
    }
  };

  const clearErr = (field) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleCountryChange = (e) => {
    const selected = e.target.value;
    setFormData((prev) => ({
      ...prev,
      country: selected,
      city: "",
    }));
    setIsCustomCity(false);
    clearErr("country");
    clearErr("city");

    if (COUNTRY_TO_PHONE_CODE[selected]) {
      setCountryCode(COUNTRY_TO_PHONE_CODE[selected]);
      clearErr("phone");
    }
  };

  const handleCityChange = (e) => {
    const selected = e.target.value;
    if (selected === "Other") {
      setIsCustomCity(true);
      setFormData((prev) => ({ ...prev, city: "" }));
    } else {
      setIsCustomCity(false);
      setFormData((prev) => ({ ...prev, city: selected }));
    }
    clearErr("city");
  };

  const validateForm = () => {
    const errs = {};

    // 1. Full Name: required, min 2 chars, letters, spaces, dots, hyphens
    if (!formData.name.trim()) {
      errs.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      errs.name = "Full name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s\.\-']+$/.test(formData.name.trim())) {
      errs.name = "Full name can only contain letters, spaces, dots, and hyphens";
    }

    // 2. Phone Number: validate length and country code
    if (phoneDigits && phoneDigits.trim()) {
      const rawDigits = phoneDigits.replace(/\D/g, "");
      const selected = COUNTRY_CODES.find((c) => c.code === countryCode) || COUNTRY_CODES[0];

      if (rawDigits.length === 0) {
        errs.phone = "Please enter valid numeric phone digits";
      } else if (selected.digits && rawDigits.length !== selected.digits) {
        errs.phone = `Phone number must be exactly ${selected.digits} digits for ${selected.code} (${selected.country}). Entered ${rawDigits.length} digits.`;
      } else if (rawDigits.length < 7 || rawDigits.length > 15) {
        errs.phone = `Phone number must contain between 7 and 15 digits (entered ${rawDigits.length})`;
      }
    }

    // 3. Country: optional, min 2 chars
    if (formData.country && formData.country.trim()) {
      if (formData.country.trim().length < 2) {
        errs.country = "Please select or enter a valid country";
      }
    }

    // 4. City / Location: optional, min 2 chars, valid text
    if (formData.city && formData.city.trim()) {
      const city = formData.city.trim();
      if (city.length < 2) {
        errs.city = "City / Location must be at least 2 characters";
      } else if (city.length > 100) {
        errs.city = "City name cannot exceed 100 characters";
      } else if (/[<>{}\[\]=;]/.test(city)) {
        errs.city = "City contains invalid characters";
      }
    }

    // 5. Address: optional, min 3 chars, max 250 chars
    if (formData.address && formData.address.trim()) {
      const addr = formData.address.trim();
      if (addr.length < 3) {
        errs.address = "Address must be at least 3 characters";
      } else if (addr.length > 250) {
        errs.address = "Address cannot exceed 250 characters";
      } else if (/[<>{}]/.test(addr)) {
        errs.address = "Address contains invalid characters";
      }
    }

    // 6. LinkedIn Profile / ID: optional, valid username or url
    if (formData.linkedin_url && formData.linkedin_url.trim()) {
      const li = formData.linkedin_url.trim().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
      if (!li.includes("linkedin.com") && !/^[a-zA-Z0-9_\-]{2,50}$/.test(li)) {
        errs.linkedin_url = "Enter a valid LinkedIn username (e.g. your-profile) or URL (e.g. linkedin.com/in/your-profile)";
      } else if (li.includes("linkedin.com") && !/^linkedin\.com\/(in\/)?[a-zA-Z0-9_\-\.%]+$/i.test(li)) {
        errs.linkedin_url = "Enter a valid LinkedIn URL format (e.g. linkedin.com/in/your-profile)";
      }
    }

    // 7. Target Role: optional, min 2 chars
    if (formData.target_role && formData.target_role.trim()) {
      if (formData.target_role.trim().length < 2) {
        errs.target_role = "Target role must be at least 2 characters";
      }
    }

    // 8. College / Company: optional, min 2 chars
    if (formData.college_or_company && formData.college_or_company.trim()) {
      if (formData.college_or_company.trim().length < 2) {
        errs.college_or_company = "College / Company must be at least 2 characters";
      }
    }

    // 9. Bio: optional, max 500 chars
    if (formData.bio && formData.bio.length > 500) {
      errs.bio = "Bio cannot exceed 500 characters";
    }

    return errs;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveError("");
    setSaveSuccess("");

    const errs = validateForm();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      return;
    }

    setIsSaving(true);
    try {
      // Assemble full phone with country code
      let fullPhone = null;
      if (phoneDigits && phoneDigits.trim()) {
        const cleanNumber = phoneDigits.trim();
        fullPhone = countryCode === "+" ? cleanNumber : `${countryCode} ${cleanNumber}`;
      }

      const payload = {
        ...formData,
        phone: fullPhone,
      };

      await updateProfile(payload);
      setSaveSuccess("Profile successfully updated and saved to database!");
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(""), 4000);
    } catch (err) {
      setSaveError(err.message || "Failed to update profile. Please check the inputs and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedCountryObj = COUNTRY_CODES.find((c) => c.code === countryCode) || COUNTRY_CODES[0];
  const citiesForCountry = formData.country && COUNTRY_CITY_MAP[formData.country]
    ? COUNTRY_CITY_MAP[formData.country]
    : [];
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : "G");

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
            <AppIcon name="user" size={13} color="var(--violet-light)" /> User Account &amp; Credentials
          </span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 6, letterSpacing: "-0.5px" }}>
          User Profile
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Manage your personal credentials, customize your AI interview persona, and control test activity logs.
        </p>
      </div>

      {saveSuccess && (
        <div
          style={{
            padding: "14px 20px",
            borderRadius: 14,
            background: "rgba(16, 185, 129, 0.12)",
            border: "1.5px solid rgba(16, 185, 129, 0.4)",
            color: "#34d399",
            fontWeight: 700,
            fontSize: 14,
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <AppIcon name="check" size={16} color="#10b981" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {saveError && (
        <div
          style={{
            padding: "14px 20px",
            borderRadius: 14,
            background: "rgba(239, 68, 68, 0.12)",
            border: "1.5px solid rgba(239, 68, 68, 0.4)",
            color: "#f87171",
            fontWeight: 700,
            fontSize: 14,
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <AppIcon name="help" size={16} color="#ef4444" />
          <span>{saveError}</span>
        </div>
      )}

      {isLoggedIn && user ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Main User Identity Card */}
          <div
            className="glass profile-card-container"
            style={{
              padding: "32px 36px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0, height: 3,
                background: "linear-gradient(90deg, var(--violet), var(--cyan), var(--gold))",
              }}
            />

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <div
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--violet), var(--cyan))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 30,
                    fontWeight: 900,
                    color: "#fff",
                    boxShadow: "0 8px 24px rgba(124,58,237,0.35)",
                    flexShrink: 0,
                  }}
                >
                  {initial}
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <h2 style={{ fontSize: 22, fontWeight: 900, margin: 0, letterSpacing: "-0.3px" }}>
                      {user.name || "InterviewMate Candidate"}
                    </h2>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        padding: "2px 10px",
                        borderRadius: 99,
                        background: "rgba(16,185,129,0.15)",
                        color: "#34d399",
                        border: "1px solid rgba(16,185,129,0.35)",
                      }}
                    >
                      Active Session
                    </span>
                    {user.target_role && (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "2px 10px",
                          borderRadius: 99,
                          background: "rgba(124,58,237,0.15)",
                          color: "var(--violet-light)",
                          border: "1px solid rgba(124,58,237,0.35)",
                        }}
                      >
                        {user.target_role}
                      </span>
                    )}
                  </div>
                  <p style={{ color: "var(--text-muted)", fontSize: 14, margin: "4px 0 8px 0" }}>
                    {user.email}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", fontSize: 12, color: "var(--text-dim)" }}>
                    <span>
                      User ID: <code style={{ color: "var(--cyan)", background: "rgba(0,0,0,0.25)", padding: "2px 7px", borderRadius: 5, border: "1px solid rgba(6,182,212,0.3)" }}>{user.id || "usr-current"}</code>
                    </span>
                    <span>•</span>
                    <span>Provider: <strong style={{ color: "var(--text-main)" }}>{user.provider || "email"}</strong></span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn btn-primary"
                  style={{
                    padding: "10px 20px",
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 800,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <AppIcon name="edit" size={14} />
                  <span>{isEditing ? "Close Editor ✕" : (completionPct < 100 ? "Complete Profile ✎" : "Edit Profile ✎")}</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-outline"
                  style={{
                    padding: "10px 20px",
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 700,
                    borderColor: "rgba(239,68,68,0.45)",
                    color: "var(--red)",
                  }}
                >
                  Sign Out ⎋
                </button>
              </div>
            </div>
          </div>

          {/* Profile Completion Callout Bar */}
          <div
            className="glass profile-card-container"
            style={{
              padding: "22px 30px",
              border: completionPct === 100 ? "1.5px solid rgba(16,185,129,0.4)" : undefined,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: completionPct === 100 ? "rgba(16,185,129,0.2)" : "rgba(124,58,237,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: completionPct === 100 ? "1px solid rgba(16,185,129,0.4)" : "1px solid rgba(124,58,237,0.4)",
                  }}
                >
                  <AppIcon name={completionPct === 100 ? "check" : "sparkles"} size={17} color={completionPct === 100 ? "#10b981" : "var(--violet-light)"} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-main)" }}>
                    {completionPct === 100 ? "Profile 100% Complete!" : `Profile Status: ${completionPct}% Complete`}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    {completionPct === 100
                      ? "All credentials and candidate persona details are synced with MongoDB Atlas."
                      : "Add your gender, phone number, country, city, address, and LinkedIn profile to unlock fully tailored AI interview feedback."}
                  </div>
                </div>
              </div>

              {completionPct < 100 && !isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  style={{
                    background: "rgba(124,58,237,0.12)",
                    border: "1px solid rgba(124,58,237,0.35)",
                    color: "var(--violet-light)",
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: "pointer",
                    padding: "6px 14px",
                    borderRadius: 8,
                    transition: "all 0.2s ease",
                  }}
                >
                  Complete Details Now →
                </button>
              )}
            </div>

            {/* Progress Bar */}
            <div style={{ width: "100%", height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
              <div
                style={{
                  width: `${completionPct}%`,
                  height: "100%",
                  background: completionPct === 100 ? "linear-gradient(90deg, #10b981, #06b6d4)" : "linear-gradient(90deg, var(--violet), var(--violet-light))",
                  borderRadius: 99,
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>

          {/* Interactive Profile Editor Mode */}
          {isEditing ? (
            <div className="glass profile-card-container" style={{ padding: "32px 36px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 4px 0" }}>
                    Complete Your Profile
                  </h3>
                  <p style={{ fontSize: 13.5, color: "var(--text-muted)", margin: 0 }}>
                    Changes are validated and securely saved directly into your MongoDB database record.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 8,
                    padding: "6px 12px",
                    color: "var(--text-muted)",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Cancel ✕
                </button>
              </div>

              <form onSubmit={handleSaveProfile} noValidate>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18, marginBottom: 20 }}>
                  {/* Full Name */}
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6 }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        clearErr("name");
                      }}
                      required
                      placeholder="e.g. Alex Morgan"
                      className={`profile-input ${fieldErrors.name ? "profile-input-error" : ""}`}
                    />
                    {fieldErrors.name && (
                      <p className="profile-field-error">
                        <AppIcon name="help" size={12} /> {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6 }}>
                      Gender
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                      {["Male", "Female", "Other"].map((g) => {
                        const active = formData.gender === g;
                        return (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setFormData({ ...formData, gender: active ? "" : g })}
                            className={`gender-select-btn ${active ? "active" : ""}`}
                          >
                            {active && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />}
                            {g}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Phone Number with Country Code */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)" }}>
                        Phone Number
                      </label>
                      {selectedCountryObj.digits && (
                        <span style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600 }}>
                          Requires {selectedCountryObj.digits} digits
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <select
                        value={countryCode}
                        onChange={(e) => {
                          setCountryCode(e.target.value);
                          clearErr("phone");
                        }}
                        className="profile-input"
                        style={{ width: "120px", flexShrink: 0, padding: "11px 8px", cursor: "pointer", fontWeight: 700 }}
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code} style={{ background: "var(--bg2, #080d1a)", color: "var(--text)" }}>
                            {c.label} {c.country ? `(${c.country})` : ""}
                          </option>
                        ))}
                      </select>

                      <input
                        type="tel"
                        value={phoneDigits}
                        onChange={(e) => {
                          setPhoneDigits(e.target.value);
                          clearErr("phone");
                        }}
                        placeholder={`e.g. ${selectedCountryObj.placeholder}`}
                        className={`profile-input ${fieldErrors.phone ? "profile-input-error" : ""}`}
                        style={{ flex: 1 }}
                      />
                    </div>
                    {fieldErrors.phone && (
                      <p className="profile-field-error">
                        <AppIcon name="help" size={12} /> {fieldErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Country Dropdown */}
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6 }}>
                      Country
                    </label>
                    <select
                      value={formData.country}
                      onChange={handleCountryChange}
                      className={`profile-input ${fieldErrors.country ? "profile-input-error" : ""}`}
                      style={{ cursor: "pointer" }}
                    >
                      <option value="" style={{ background: "var(--bg2, #080d1a)", color: "var(--text)" }}>
                        Select country...
                      </option>
                      {Object.keys(COUNTRY_CITY_MAP).map((c) => (
                        <option key={c} value={c} style={{ background: "var(--bg2, #080d1a)", color: "var(--text)" }}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.country && (
                      <p className="profile-field-error">
                        <AppIcon name="help" size={12} /> {fieldErrors.country}
                      </p>
                    )}
                  </div>

                  {/* City Dropdown (Dependent on Selected Country) */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)" }}>
                        City / Location
                      </label>
                      {formData.country && (
                        <span style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600 }}>
                          {formData.country}
                        </span>
                      )}
                    </div>
                    <select
                      value={isCustomCity ? "Other" : (citiesForCountry.includes(formData.city) ? formData.city : (formData.city ? "Other" : ""))}
                      onChange={handleCityChange}
                      disabled={!formData.country}
                      className={`profile-input ${fieldErrors.city ? "profile-input-error" : ""}`}
                      style={{
                        cursor: formData.country ? "pointer" : "not-allowed",
                        opacity: formData.country ? 1 : 0.65,
                      }}
                    >
                      <option value="" style={{ background: "var(--bg2, #080d1a)", color: "var(--text)" }}>
                        {formData.country ? "Select city..." : "← Select country first"}
                      </option>
                      {citiesForCountry.map((ct) => (
                        <option key={ct} value={ct} style={{ background: "var(--bg2, #080d1a)", color: "var(--text)" }}>
                          {ct}
                        </option>
                      ))}
                    </select>

                    {/* Custom City input if "Other" is chosen */}
                    {isCustomCity && (
                      <div style={{ marginTop: 8 }}>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => {
                            setFormData({ ...formData, city: e.target.value });
                            clearErr("city");
                          }}
                          placeholder="Type your city or town name..."
                          className={`profile-input ${fieldErrors.city ? "profile-input-error" : ""}`}
                        />
                      </div>
                    )}

                    {fieldErrors.city && (
                      <p className="profile-field-error">
                        <AppIcon name="help" size={12} /> {fieldErrors.city}
                      </p>
                    )}
                  </div>

                  {/* Residential / Street Address */}
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6 }}>
                      Residential / Street Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => {
                        setFormData({ ...formData, address: e.target.value });
                        clearErr("address");
                      }}
                      placeholder="e.g. 450 Mission St, Suite 200 or 100 Feet Road, Indiranagar"
                      className={`profile-input ${fieldErrors.address ? "profile-input-error" : ""}`}
                    />
                    {fieldErrors.address && (
                      <p className="profile-field-error">
                        <AppIcon name="help" size={12} /> {fieldErrors.address}
                      </p>
                    )}
                  </div>

                  {/* LinkedIn ID / URL */}
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6 }}>
                      LinkedIn Profile / ID
                    </label>
                    <input
                      type="text"
                      value={formData.linkedin_url}
                      onChange={(e) => {
                        setFormData({ ...formData, linkedin_url: e.target.value });
                        clearErr("linkedin_url");
                      }}
                      placeholder="e.g. linkedin.com/in/your-profile"
                      className={`profile-input ${fieldErrors.linkedin_url ? "profile-input-error" : ""}`}
                    />
                    {fieldErrors.linkedin_url && (
                      <p className="profile-field-error">
                        <AppIcon name="help" size={12} /> {fieldErrors.linkedin_url}
                      </p>
                    )}
                  </div>

                  {/* Target Role */}
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6 }}>
                      Target Role / Dream Job
                    </label>
                    <input
                      type="text"
                      value={formData.target_role}
                      onChange={(e) => {
                        setFormData({ ...formData, target_role: e.target.value });
                        clearErr("target_role");
                      }}
                      placeholder="e.g. Full Stack Developer, Software Engineer"
                      className={`profile-input ${fieldErrors.target_role ? "profile-input-error" : ""}`}
                    />
                    {fieldErrors.target_role && (
                      <p className="profile-field-error">
                        <AppIcon name="help" size={12} /> {fieldErrors.target_role}
                      </p>
                    )}
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6 }}>
                      Experience Level
                    </label>
                    <select
                      value={formData.experience_level}
                      onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                      className="profile-input"
                    >
                      <option value="">Select experience level...</option>
                      <option value="Student / Fresher">Student / Fresher</option>
                      <option value="1–3 Years">1–3 Years (Junior)</option>
                      <option value="3–5 Years">3–5 Years (Mid-Level)</option>
                      <option value="5+ Years">5+ Years (Senior)</option>
                      <option value="Lead / Architect">Lead / Architect</option>
                    </select>
                  </div>

                  {/* College / Current Company */}
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6 }}>
                      College / Current Company
                    </label>
                    <input
                      type="text"
                      value={formData.college_or_company}
                      onChange={(e) => {
                        setFormData({ ...formData, college_or_company: e.target.value });
                        clearErr("college_or_company");
                      }}
                      placeholder="e.g. Stanford University or Acme Inc."
                      className={`profile-input ${fieldErrors.college_or_company ? "profile-input-error" : ""}`}
                    />
                    {fieldErrors.college_or_company && (
                      <p className="profile-field-error">
                        <AppIcon name="help" size={12} /> {fieldErrors.college_or_company}
                      </p>
                    )}
                  </div>
                </div>

                {/* Professional Bio */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)" }}>
                      Professional Summary / Bio
                    </label>
                    <span style={{ fontSize: 11.5, color: (formData.bio?.length || 0) > 480 ? "#ef4444" : "var(--text-dim)" }}>
                      {formData.bio?.length || 0} / 500 characters
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => {
                      setFormData({ ...formData, bio: e.target.value });
                      clearErr("bio");
                    }}
                    placeholder="Briefly describe your background, key technical strengths, and career goals..."
                    className={`profile-input ${fieldErrors.bio ? "profile-input-error" : ""}`}
                    style={{ resize: "vertical", minHeight: 74 }}
                    maxLength={500}
                  />
                  {fieldErrors.bio && (
                    <p className="profile-field-error">
                      <AppIcon name="help" size={12} /> {fieldErrors.bio}
                    </p>
                  )}
                </div>

                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn btn-primary"
                    style={{ padding: "12px 28px", fontSize: 14, fontWeight: 800 }}
                  >
                    {isSaving ? "Saving to Database..." : "Save Profile Changes ✓"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFieldErrors({});
                    }}
                    className="btn btn-outline"
                    style={{ padding: "12px 22px", fontSize: 14 }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Candidate Profile Details Overview Card */
            <div className="glass profile-card-container" style={{ padding: "30px 36px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
                <h3 style={{ fontSize: 19, fontWeight: 800, margin: 0 }}>
                  Candidate Credentials &amp; Personal Info
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="btn btn-outline"
                  style={{
                    padding: "7px 16px",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <AppIcon name="edit" size={13} /> Edit Details
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                <div className="profile-info-tile">
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Gender</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: user.gender ? "var(--text-main)" : "var(--text-dim)", marginTop: 6 }}>
                    {user.gender || "Not specified"}
                  </div>
                </div>

                <div className="profile-info-tile">
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Phone Number</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: user.phone ? "var(--text-main)" : "var(--text-dim)", marginTop: 6 }}>
                    {user.phone || "Not added"}
                  </div>
                </div>

                <div className="profile-info-tile">
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Country</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: user.country ? "var(--text-main)" : "var(--text-dim)", marginTop: 6 }}>
                    {user.country || "Not specified"}
                  </div>
                </div>

                <div className="profile-info-tile">
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>City / Location</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: user.city ? "var(--text-main)" : "var(--text-dim)", marginTop: 6 }}>
                    {user.city || "Not added"}
                  </div>
                </div>

                <div className="profile-info-tile" style={{ gridColumn: "span 2" }}>
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Residential / Street Address</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: user.address ? "var(--text-main)" : "var(--text-dim)", marginTop: 6 }}>
                    {user.address || "Not added"}
                  </div>
                </div>

                <div className="profile-info-tile">
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>LinkedIn Profile</div>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: user.linkedin_url ? "var(--cyan)" : "var(--text-dim)", marginTop: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.linkedin_url ? (
                      <a
                        href={user.linkedin_url.startsWith("http") ? user.linkedin_url : `https://${user.linkedin_url}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "var(--cyan)", textDecoration: "underline" }}
                      >
                        {user.linkedin_url.replace(/^https?:\/\//, "")} ↗
                      </a>
                    ) : (
                      "Not added"
                    )}
                  </div>
                </div>

                <div className="profile-info-tile">
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Target Role</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: user.target_role ? "var(--text-main)" : "var(--text-dim)", marginTop: 6 }}>
                    {user.target_role || "Not specified"}
                  </div>
                </div>

                <div className="profile-info-tile">
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Experience</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: user.experience_level ? "var(--text-main)" : "var(--text-dim)", marginTop: 6 }}>
                    {user.experience_level || "Not specified"}
                  </div>
                </div>

                <div className="profile-info-tile" style={{ gridColumn: "span 2" }}>
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>College / Organization</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: user.college_or_company ? "var(--text-main)" : "var(--text-dim)", marginTop: 6 }}>
                    {user.college_or_company || "Not added"}
                  </div>
                </div>
              </div>

              {user.bio && (
                <div className="profile-info-tile" style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Candidate Bio</div>
                  <p style={{ margin: 0, fontSize: 14, color: "var(--text-main)", lineHeight: 1.6 }}>{user.bio}</p>
                </div>
              )}
            </div>
          )}

          {/* User Real Performance Summary */}
          <div className="glass profile-card-container" style={{ padding: "28px 34px" }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 18 }}>
              Account Activity &amp; Live Performance Records
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              <div className="profile-info-tile">
                <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Total Completed Sessions</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: "var(--violet-light)", marginTop: 6, fontFamily: "'Sora', sans-serif" }}>
                  {stats.totalActivities}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>
                  {stats.totalActivities === 0 ? "No tests taken yet" : "Real logged attempts"}
                </div>
              </div>

              <div className="profile-info-tile">
                <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Overall Readiness Score</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: "var(--violet-light)", marginTop: 6, fontFamily: "'Sora', sans-serif" }}>
                  {stats.hasData ? `${stats.compositeScore}/100` : "Nil"}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>
                  {stats.hasData ? "Composite proficiency" : "Starts at 0 / Nil"}
                </div>
              </div>

              <div className="profile-info-tile">
                <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Peak Typing Speed</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: "var(--violet-light)", marginTop: 6, fontFamily: "'Sora', sans-serif" }}>
                  {stats.peakTypingWpm !== "—" ? stats.peakTypingWpm : "Nil"}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>
                  {stats.domains.typing.count > 0 ? `${stats.domains.typing.count} typing test(s)` : "No typing tests yet"}
                </div>
              </div>

              <div className="profile-info-tile">
                <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Voice AI Metric</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: "var(--violet-light)", marginTop: 6, fontFamily: "'Sora', sans-serif" }}>
                  {stats.voiceClarity !== "—" ? stats.voiceClarity : "Nil"}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>
                  {stats.domains.voice.count > 0 ? `${stats.domains.voice.count} voice session(s)` : "No voice tests yet"}
                </div>
              </div>
            </div>
          </div>

          {/* Account Data Management */}
          <div className="glass profile-card-container" style={{ padding: "28px 34px" }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>
              Data &amp; Privacy Controls
            </h3>
            <p style={{ fontSize: 13.5, color: "var(--text-muted)", marginBottom: 20 }}>
              All your activity records, profile metadata, and evaluation analytics are scoped to your account credentials.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              <button
                type="button"
                onClick={handleClearHistory}
                className="btn btn-outline"
                style={{
                  padding: "10px 18px",
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 700,
                  borderColor: "rgba(239,68,68,0.4)",
                  color: "var(--red)",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <AppIcon name="trash" size={14} color="var(--red)" /> Reset My Account Test History
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify({ user, stats, activities }, null, 2));
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2500);
                }}
                className="btn btn-outline"
                style={{ padding: "10px 18px", borderRadius: 12, fontSize: 13, fontWeight: 700 }}
              >
                {copied ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <AppIcon name="check" size={14} color="#10b981" /> Copied Data to Clipboard!
                  </span>
                ) : (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <AppIcon name="clipboard" size={14} /> Export Account Data (JSON)
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Guest / Not Logged In State */
        <div
          className="glass profile-card-container"
          style={{
            padding: "48px 36px",
            textAlign: "center",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
            <AppIcon name="lock" size={48} color="var(--violet-light)" />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8, letterSpacing: "-0.4px" }}>
            Not Logged In
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 14.5, lineHeight: 1.6, marginBottom: 28 }}>
            Sign in with your credentials to view your profile details, customize your AI persona, and control test activity logs.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 14 }}>
            <Link to="/login" className="btn btn-primary" style={{ padding: "11px 28px", fontSize: 14 }}>
              Sign In →
            </Link>
            <Link to="/register" className="btn btn-outline" style={{ padding: "11px 24px", fontSize: 14 }}>
              Create Account
            </Link>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Profile;
