// Activity & Performance Tracker for InterviewMate WebApp
// Stores and retrieves ONLY REAL user activities scoped to the authenticated user.
// Before a user logs in or before any tests are taken, all metrics are strictly NIL.

const GUEST_KEY = "im_guest_activities";

function getStorageKey() {
  try {
    const rawUser = localStorage.getItem("im_auth_user");
    if (rawUser) {
      const user = JSON.parse(rawUser);
      if (user && user.email) {
        return `im_user_activities_${user.email.trim().toLowerCase()}`;
      }
    }
  } catch {
    // fallback
  }
  return GUEST_KEY;
}

export function getStoredActivities() {
  try {
    const key = getStorageKey();
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function logUserActivity(activity) {
  try {
    if (!activity || !activity.type) return null;
    const key = getStorageKey();
    const current = getStoredActivities();
    const newEntry = {
      id: "act-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      timestamp: Date.now(),
      maxScore: 100,
      ...activity,
    };
    const updated = [newEntry, ...current].slice(0, 100); // retain latest 100 real activities
    localStorage.setItem(key, JSON.stringify(updated));
    window.dispatchEvent(new Event("im_activity_updated"));
    return newEntry;
  } catch (err) {
    console.error("Failed to log activity", err);
    return null;
  }
}

export function clearActivityHistory() {
  try {
    const key = getStorageKey();
    localStorage.removeItem(key);
    window.dispatchEvent(new Event("im_activity_updated"));
  } catch (err) {
    console.error("Failed to clear activity history", err);
  }
}

export function calculateOverallStats(activities = []) {
  if (!Array.isArray(activities) || activities.length === 0) {
    return {
      hasData: false,
      compositeScore: 0,
      totalActivities: 0,
      domains: {
        technical: { score: 0, count: 0, label: "Technical Coding & MCQs", color: "#7c3aed" },
        voice: { score: 0, count: 0, label: "Spoken AI Communication", color: "#06b6d4" },
        company: { score: 0, count: 0, label: "Company Assessment Tracks", color: "#f59e0b" },
        subject: { score: 0, count: 0, label: "CS Core Fundamentals", color: "#ec4899" },
        typing: { score: 0, count: 0, label: "Typing Speed & Accuracy", color: "#10b981" },
        practice: { score: 0, count: 0, label: "Aptitude & Problem Solving", color: "#6366f1" },
      },
      peakTypingWpm: "—",
      voiceClarity: "—",
      streakDays: 0,
    };
  }

  const technical = activities.filter((a) => a.type === "technical");
  const voice     = activities.filter((a) => a.type === "voice");
  const company   = activities.filter((a) => a.type === "company");
  const typing    = activities.filter((a) => a.type === "typing");
  const subject   = activities.filter((a) => a.type === "subject");
  const practice  = activities.filter((a) => a.type === "practice");

  const avg = (arr) => {
    if (arr.length === 0) return 0;
    const sum = arr.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0);
    return Math.round(sum / arr.length);
  };

  const techAvg = avg(technical);
  const voiceAvg = avg(voice);
  const companyAvg = avg(company);
  const typingAvg = avg(typing);
  const subjectAvg = avg(subject);
  const practiceAvg = avg(practice);

  // Active domains used for composite calculation
  const activeDomains = [
    { avg: techAvg, weight: 0.25, count: technical.length },
    { avg: voiceAvg, weight: 0.20, count: voice.length },
    { avg: companyAvg, weight: 0.20, count: company.length },
    { avg: subjectAvg, weight: 0.15, count: subject.length },
    { avg: typingAvg, weight: 0.10, count: typing.length },
    { avg: practiceAvg, weight: 0.10, count: practice.length },
  ].filter((d) => d.count > 0);

  let compositeScore = 0;
  if (activeDomains.length > 0) {
    const totalWeight = activeDomains.reduce((acc, d) => acc + d.weight, 0);
    const weightedSum = activeDomains.reduce((acc, d) => acc + d.avg * d.weight, 0);
    compositeScore = Math.round(weightedSum / totalWeight);
  }

  // Peak typing speed from real typing sessions
  let peakWpm = "—";
  if (typing.length > 0) {
    const wpmValues = typing
      .map((t) => {
        const val = t.metrics?.wpm ? parseInt(t.metrics.wpm, 10) : t.score;
        return isNaN(val) ? 0 : val;
      })
      .filter((v) => v > 0);
    if (wpmValues.length > 0) {
      peakWpm = `${Math.max(...wpmValues)} WPM`;
    }
  }

  // Voice clarity from real voice sessions
  let voiceClarity = "—";
  if (voice.length > 0) {
    const clarities = voice.map((v) => v.metrics?.clarity).filter(Boolean);
    voiceClarity = clarities.length > 0 ? clarities[0] : `${voiceAvg}%`;
  }

  // Calculate real active streak (days with at least 1 activity)
  const uniqueDays = new Set(
    activities.map((a) => new Date(a.timestamp || Date.now()).toDateString())
  );

  return {
    hasData: true,
    compositeScore,
    totalActivities: activities.length,
    domains: {
      technical: { score: techAvg, count: technical.length, label: "Technical Coding & MCQs", color: "#7c3aed" },
      voice: { score: voiceAvg, count: voice.length, label: "Spoken AI Communication", color: "#06b6d4" },
      company: { score: companyAvg, count: company.length, label: "Company Assessment Tracks", color: "#f59e0b" },
      subject: { score: subjectAvg, count: subject.length, label: "CS Core Fundamentals", color: "#ec4899" },
      typing: { score: typingAvg, count: typing.length, label: "Typing Speed & Accuracy", color: "#10b981" },
      practice: { score: practiceAvg, count: practice.length, label: "Aptitude & Problem Solving", color: "#6366f1" },
    },
    peakTypingWpm: peakWpm,
    voiceClarity,
    streakDays: uniqueDays.size,
  };
}
