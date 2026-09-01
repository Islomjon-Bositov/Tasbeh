import React, { useState, useCallback, useRef, useEffect } from "react";
import LeadershipPage from "./LeadershipPage";
import ProfilePage from "./ProfilePage";
import LoginPanel from "./LoginPanel";
import SidebarNav from "./SidebarNav";
import "./Tasbih.css";

const TRANSLATIONS = {
  uz: {
    title: "TASBIH",
    subtitle: "Koinot Sanog'i",
    soundOn: "🔊 Ovoz",
    soundOff: "🔇 Ovoz",
    lightMode: "☀️ Kunduzgi",
    darkMode: "🌙 Tungi",
    targetLabel: "Maqsad: ",
    total: "Jami",
    current: "Hozirgi",
    rounds: "Aylanma",
    goalReached: "✦ Maqsadga yetildi! ✦",
    reset: "Tozalash",
    custom: "Maxsus",
    settings: "Sozlamalar",
    language: "Til",
    dailyStreak: "Kunlik streak",
    bestStreak: "Eng yaxshi streak",
    freeze: "Streak freeze",
    freezes: "dona",
    days: "kun",
    quickActions: "Tezkor amallar",
    undo: "Ortga qaytarish",
    copy: "Nusxalash",
    vibration: "Vibratsiya",
    today: "Bugun",
    stats: "Statistika",
    noData: "Ma'lumot yo'q",
    goal: "Maqsad",
    counted: "sanalgan",
  },
  en: {
    title: "TASBIH",
    subtitle: "Cosmic Counter",
    soundOn: "🔊 Sound",
    soundOff: "🔇 Sound",
    lightMode: "☀️ Light",
    darkMode: "🌙 Dark",
    targetLabel: "Target: ",
    total: "Total",
    current: "Current",
    rounds: "Rounds",
    goalReached: "✦ Goal Reached! ✦",
    reset: "Reset",
    custom: "Custom",
    settings: "Settings",
    language: "Language",
    dailyStreak: "Daily streak",
    bestStreak: "Best streak",
    freeze: "Streak freeze",
    freezes: "freezes",
    days: "days",
    quickActions: "Quick actions",
    undo: "Undo",
    copy: "Copy",
    vibration: "Vibration",
    today: "Today",
    stats: "Statistics",
    noData: "No data",
    goal: "Goal",
    counted: "counted",
  },
  ru: {
    title: "ТАСБИХ",
    subtitle: "Космический",
    soundOn: "🔊 Звук",
    soundOff: "🔇 Звук",
    lightMode: "☀️ Светлая",
    darkMode: "🌙 Темная",
    targetLabel: "Цель: ",
    total: "Всего",
    current: "Текущий",
    rounds: "Круги",
    goalReached: "✦ Цель достигнута! ✦",
    reset: "Сброс",
    custom: "Свой",
    settings: "Настройки",
    language: "Язык",
    dailyStreak: "Ежедневный streak",
    bestStreak: "Лучший streak",
    freeze: "Заморозка streak",
    freezes: "шт",
    days: "дней",
    quickActions: "Быстрые действия",
    undo: "Назад",
    copy: "Копия",
    vibration: "Вибрация",
    today: "Сегодня",
    stats: "Статистика",
    noData: "Нет данных",
    goal: "Цель",
    counted: "счёт",
  },
};

const PARTICLE_COUNT = 15;
const FREEZE_EVERY_COUNT = 1000;

function generateParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angleDeg = (360 / PARTICLE_COUNT) * i + Math.random() * 30;
    const angleRad = (angleDeg * Math.PI) / 180;
    const distance = 80 + Math.random() * 120;
    return {
      id: i,
      endX: Math.cos(angleRad) * distance,
      endY: Math.sin(angleRad) * distance,
      size: 4 + Math.random() * 6,
      duration: 0.5 + Math.random() * 0.5,
      delay: Math.random() * 0.1,
    };
  });
}

let audioCtx = null;

const playSound = () => {
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      audioCtx = new AudioContext();
    }

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.1);
  } catch (e) {
    console.error("Audio error:", e);
  }
};

// React.memo bilan o'ralgan BeadRing, keraksiz re-renderlarni oldini oladi.
const BeadRing = React.memo(({ beadCount, hue }) => {
  const beads = Array.from({ length: 33 }, (_, i) => i);
  return (
    <svg className="bead-ring" viewBox="0 0 300 300">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {beads.map((_, i) => {
        const angle = (i / 33) * 2 * Math.PI - Math.PI / 2;
        const radius = 120;
        const x = 150 + radius * Math.cos(angle);
        const y = 150 + radius * Math.sin(angle);
        const isActive = i < beadCount;
        const beadHue = hue;

        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={isActive ? 7 : 5}
            fill={
              isActive ? `hsl(${beadHue}, 80%, 60%)` : "rgba(255,255,255,0.1)"
            }
            stroke={
              isActive ? `hsl(${beadHue}, 90%, 80%)` : "rgba(255,255,255,0.05)"
            }
            strokeWidth={isActive ? 2 : 1}
            filter={isActive ? "url(#glow)" : undefined}
            className={isActive ? "bead-active" : "bead-inactive"}
          />
        );
      })}
    </svg>
  );
});

const Stats = React.memo(({ count, target, glowColor, t }) => (
  <div className="stats">
    <div className="stat">
      <span className="stat-value" style={{ color: glowColor }}>
        {count}
      </span>
      <span className="stat-label">{t.total}</span>
    </div>
    <div className="stat">
      <span className="stat-value" style={{ color: glowColor }}>
        {target === Infinity ? "∞" : count % target}
      </span>
      <span className="stat-label">{t.current}</span>
    </div>
    <div className="stat">
      <span className="stat-value" style={{ color: glowColor }}>
        {target === Infinity ? "∞" : Math.floor(count / target)}
      </span>
      <span className="stat-label">{t.rounds}</span>
    </div>
  </div>
));

export default function Tasbih() {
  const MAX_SERVICE_CAPACITY = 1000;
  const [lang, setLang] = useState(
    () => localStorage.getItem("tasbih_lang") || "uz",
  );
  const [showSettings, setShowSettings] = useState(() =>
    Boolean(localStorage.getItem("tasbih_profile_name")),
  );
  const [activeMenu, setActiveMenu] = useState(() =>
    localStorage.getItem("tasbih_profile_name") ? "stats" : "account",
  );
  const [profileName, setProfileName] = useState(() =>
    localStorage.getItem("tasbih_profile_name") || "",
  );
  const [profileInput, setProfileInput] = useState(() =>
    localStorage.getItem("tasbih_profile_name") || "",
  );
  const [selectedProfileName, setSelectedProfileName] = useState(() =>
    localStorage.getItem("tasbih_profile_name") || "",
  );
  const [profilePassword, setProfilePassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [loginDate, setLoginDate] = useState(() =>
    localStorage.getItem("tasbih_login_date") || "",
  );
  const [socialProfiles, setSocialProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem("tasbih_social_profiles");
      if (!saved) return {};
      const parsed = JSON.parse(saved);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  });
  const BADGES = [
    { id: "bronze", label: "Bronze", icon: "🥉", color: "#cd7c32" },
    { id: "silver", label: "Silver", icon: "🥈", color: "#c0c0c0" },
    { id: "gold", label: "Gold", icon: "🥇", color: "#fbbf24" },
    { id: "diamond", label: "Diamond", icon: "💎", color: "#60a5fa" },
    { id: "legend", label: "Legend", icon: "👑", color: "#f472b6" },
    { id: "cosmic", label: "Cosmic", icon: "🚀", color: "#a78bfa" },
  ];

  const [accounts, setAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem("tasbih_accounts");
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((account) => ({
        username: account.username || "",
        password: account.password || "",
        count: Number(account.count) || 0,
        badge: account.badge || "none",
        activityLog: account.activityLog && typeof account.activityLog === "object" ? account.activityLog : {},
      }));
    } catch {
      return [];
    }
  });
  const [serviceUsers, setServiceUsers] = useState(() => {
    try {
      const saved = localStorage.getItem("tasbih_service_users");
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.slice(0, MAX_SERVICE_CAPACITY) : [];
    } catch {
      return [];
    }
  });
  const [dailyStreak, setDailyStreak] = useState(() => {
    const savedStreak = Number(localStorage.getItem("tasbih_daily_streak") || "0");
    const savedDate = localStorage.getItem("tasbih_last_active_date");
    const today = new Date().toISOString().slice(0, 10);

    if (!savedDate) {
      localStorage.setItem("tasbih_last_active_date", today);
      localStorage.setItem("tasbih_daily_streak", "0");
      return 0;
    }

    return Number.isFinite(savedStreak) && savedStreak >= 0 ? savedStreak : 0;
  });
  const [bestStreak, setBestStreak] = useState(() =>
    Number(localStorage.getItem("tasbih_best_streak") || "0"),
  );
  const [streakFreezes, setStreakFreezes] = useState(() =>
    Number(localStorage.getItem("tasbih_streak_freezes") || "0"),
  );
  const [freezeCounter, setFreezeCounter] = useState(() =>
    Number(localStorage.getItem("tasbih_freeze_counter") || "0"),
  );
  const [countHistory, setCountHistory] = useState([]);
  const [copyStatus, setCopyStatus] = useState("");
  const [activityLog, setActivityLog] = useState(() => {
    const saved = localStorage.getItem("tasbih_activity_log");
    const defaultLog = { "2026-08-31": 100 };

    try {
      const parsed = saved ? JSON.parse(saved) : {};
      if (!parsed || typeof parsed !== "object") return defaultLog;
      if (!Object.prototype.hasOwnProperty.call(parsed, "2026-08-31")) {
        return { ...parsed, "2026-08-31": 100 };
      }
      return parsed;
    } catch {
      return defaultLog;
    }
  });

  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem("tasbih_count");
    if (saved !== null) return parseInt(saved, 10) || 0;
    return 100;
  });
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem("tasbih_mode");
    return saved !== null ? parseInt(saved, 10) : 0;
  });
  const [customTarget, setCustomTarget] = useState(() => {
    const saved = localStorage.getItem("tasbih_customTarget");
    return saved !== null ? parseInt(saved, 10) : 10;
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("tasbih_isDarkMode");
    return saved !== null ? saved === "true" : true;
  });
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem("tasbih_soundEnabled");
    return saved !== null ? saved === "true" : true;
  });

  const [isEditingCustom, setIsEditingCustom] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileDraftName, setProfileDraftName] = useState("");
  const [profileDraftPassword, setProfileDraftPassword] = useState("");
  const [profileDraftImage, setProfileDraftImage] = useState("");
  const [profileImage, setProfileImage] = useState(() => {
    try {
      return localStorage.getItem("tasbih_profile_image") || "";
    } catch {
      return "";
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [selectedBadgeId, setSelectedBadgeId] = useState("none");
  const [followListType, setFollowListType] = useState(null);
  const [particles, setParticles] = useState([]);
  const [ripples, setRipples] = useState([]);

  const particleId = useRef(0);
  const timeouts = useRef([]);
  const settingsRef = useRef(null);
  const buttonRef = useRef(null);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.uz;
  const isLoggedIn = Boolean(profileName);
  const currentAccount =
    profileName && accounts.find((account) => account.username.toLowerCase() === profileName.toLowerCase());
  const currentBadge =
    BADGES.find((badge) => badge.id === (currentAccount?.badge || selectedBadgeId)) ||
    { id: "none", label: "No badge", icon: "✨", color: "#94a3b8" };

  const ensureSocialRecord = useCallback((name, record) => {
    const key = (name || "").trim().toLowerCase();
    const existing = record && typeof record === "object" ? record : {};
    return {
      bio: existing.bio || "Every count builds a better routine.",
      location: existing.location || "Earth",
      followers: Number(existing.followers) || 0,
      following: Number(existing.following) || 0,
      followersUsers: Array.isArray(existing.followersUsers) ? existing.followersUsers : [],
      followingUsers: Array.isArray(existing.followingUsers) ? existing.followingUsers : [],
      key,
    };
  }, []);

  const getProfileSocial = useCallback((name) => {
    const key = (name || "").trim().toLowerCase();
    if (!key) {
      return ensureSocialRecord("", {});
    }
    return ensureSocialRecord(key, socialProfiles[key]);
  }, [ensureSocialRecord, socialProfiles]);

  const getLastSevenWeekSlots = useCallback((activityLogObject = {}) => {
    const slots = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index) * 7);
      const weekStart = new Date(date);
      weekStart.setHours(0, 0, 0, 0);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());

      const hasActiveInWeek = Object.entries(activityLogObject).some(([key, value]) => {
        const activityDate = new Date(key);
        if (!Number(value)) return false;
        const currentWeekStart = new Date(activityDate);
        currentWeekStart.setHours(0, 0, 0, 0);
        currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());
        return currentWeekStart.getTime() === weekStart.getTime();
      });

      return hasActiveInWeek ? 1 : 0;
    });

    return slots;
  }, []);

  useEffect(() => {
    const settingsNode = settingsRef.current;
    if (!settingsNode) return undefined;

    const handleClickOutside = (event) => {
      if (!settingsNode.contains(event.target)) {
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const DEFAULT_MODES = [
    { label: "33", target: 33 },
    { label: "99", target: 99 },
    { label: "100", target: 100 },
    { label: "∞", target: Infinity },
    { label: t.custom, target: 0, isCustom: true },
  ];

  const countAchievements = [
    { goal: 1, label: "1", icon: "✨", color: "#93c5fd" },
    { goal: 100, label: "100", icon: "💯", color: "#60a5fa" },
    { goal: 250, label: "250", icon: "🎯", color: "#2dd4bf" },
    { goal: 500, label: "500", icon: "🚀", color: "#34d399" },
    { goal: 1000, label: "1000", icon: "🏅", color: "#22c55e" },
    { goal: 5000, label: "5000", icon: "⭐", color: "#fbbf24" },
    { goal: 10000, label: "10000", icon: "👑", color: "#f59e0b" },
    { goal: 25000, label: "25000", icon: "🌠", color: "#a78bfa" },
    { goal: 50000, label: "50000", icon: "🌌", color: "#c084fc" },
    { goal: 100000, label: "100000", icon: "🚀", color: "#f472b6" },
  ];
  const streakAchievements = [
    { goal: 3, label: "3-day streak", icon: "🔥", color: "#f97316" },
    { goal: 7, label: "7-day streak", icon: "⚡", color: "#38bdf8" },
    { goal: 14, label: "14-day streak", icon: "🌟", color: "#60a5fa" },
    { goal: 30, label: "30-day streak", icon: "🏆", color: "#a78bfa" },
    { goal: 60, label: "60-day streak", icon: "💎", color: "#2dd4bf" },
    { goal: 90, label: "90-day streak", icon: "👑", color: "#facc15" },
    { goal: 180, label: "180-day streak", icon: "🌙", color: "#38bdf8" },
    { goal: 365, label: "365-day streak", icon: "🏆", color: "#f59e0b" },
  ];
  useEffect(() => {
    const currentTimeouts = timeouts.current;
    return () => currentTimeouts.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasbih_count", count.toString());
    localStorage.setItem("tasbih_mode", mode.toString());
    localStorage.setItem("tasbih_customTarget", customTarget.toString());
    localStorage.setItem("tasbih_isDarkMode", isDarkMode.toString());
    localStorage.setItem("tasbih_lang", lang);
    localStorage.setItem("tasbih_soundEnabled", soundEnabled.toString());
    localStorage.setItem("tasbih_daily_streak", dailyStreak.toString());
    localStorage.setItem("tasbih_best_streak", bestStreak.toString());
    localStorage.setItem("tasbih_streak_freezes", streakFreezes.toString());
    localStorage.setItem("tasbih_freeze_counter", freezeCounter.toString());
    localStorage.setItem("tasbih_activity_log", JSON.stringify(activityLog));
    localStorage.setItem("tasbih_service_users", JSON.stringify(serviceUsers));
    localStorage.setItem("tasbih_accounts", JSON.stringify(accounts));
    localStorage.setItem("tasbih_social_profiles", JSON.stringify(socialProfiles));
    localStorage.setItem("tasbih_profile_image", profileImage || "");
    localStorage.setItem("tasbih_login_date", loginDate || "");
    if (profileName) {
      localStorage.setItem("tasbih_profile_name", profileName);
    } else {
      localStorage.removeItem("tasbih_profile_name");
    }
  }, [
    count,
    mode,
    customTarget,
    isDarkMode,
    lang,
    soundEnabled,
    dailyStreak,
    bestStreak,
    streakFreezes,
    freezeCounter,
    activityLog,
    serviceUsers,
    socialProfiles,
    profileName,
    accounts,
    profileImage,
    loginDate,
  ]);

  const handleLogin = useCallback(() => {
    const trimmedName = profileInput.trim();
    const trimmedPassword = profilePassword.trim();

    if (!trimmedName) {
      setLoginMessage("Account name is required");
      return;
    }

    if (!trimmedPassword) {
      setLoginMessage("Password is required");
      return;
    }

    const normalizedName = trimmedName.toLowerCase();
    const activeUsers = serviceUsers.filter(Boolean);
    const existingAccount = accounts.find(
      (account) => account.username.toLowerCase() === normalizedName,
    );

    let nextAccounts = accounts;

    if (existingAccount) {
      if (existingAccount.password !== trimmedPassword) {
        setLoginMessage("Incorrect password");
        return;
      }
      setCount(Number(existingAccount.count) || 0);
    } else {
      if (!isLoggedIn && activeUsers.length >= MAX_SERVICE_CAPACITY) {
        setLoginMessage(`Service is full: ${MAX_SERVICE_CAPACITY} users max capacity`);
        return;
      }

      nextAccounts = [
        ...accounts,
        {
          username: trimmedName,
          password: trimmedPassword,
          count: 0,
          badge: "none",
          activityLog: {},
        },
      ];
      setAccounts(nextAccounts);
      setCount(0);
    }

    const nextUsers = [...new Set([...activeUsers, trimmedName])].slice(
      -MAX_SERVICE_CAPACITY,
    );
    const normalizedKey = trimmedName.toLowerCase();
    setProfileName(trimmedName);
    setSelectedProfileName(trimmedName);
    setServiceUsers(nextUsers);
    setProfileInput(trimmedName);
    setProfilePassword("");
    setSocialProfiles((prev) => ({
      ...prev,
      [normalizedKey]: ensureSocialRecord(normalizedKey, prev[normalizedKey]),
    }));
    setLoginMessage("Account connected");
    setShowSettings(true);
    setActiveMenu("stats");
    setLoginDate(new Date().toISOString());
    localStorage.setItem("tasbih_service_users", JSON.stringify(nextUsers));
    localStorage.setItem("tasbih_profile_name", trimmedName);
    localStorage.setItem("tasbih_accounts", JSON.stringify(nextAccounts));
    localStorage.setItem("tasbih_login_date", new Date().toISOString());
  }, [MAX_SERVICE_CAPACITY, accounts, ensureSocialRecord, isLoggedIn, profileInput, profilePassword, serviceUsers]);

  const handleLogout = useCallback(() => {
    const nameToRemove = profileName.trim();
    const nextUsers = serviceUsers.filter((name) => name !== nameToRemove);
    setServiceUsers(nextUsers);
    setProfileName("");
    setSelectedProfileName("");
    setProfileInput("");
    setProfilePassword("");
    setShowSettings(false);
    setLoginMessage("Logged out successfully");
    localStorage.setItem("tasbih_service_users", JSON.stringify(nextUsers));
    localStorage.removeItem("tasbih_profile_name");
    setActiveMenu("account");
  }, [profileName, serviceUsers]);

  const openProfileModal = useCallback(() => {
    const account = accounts.find(
      (item) => item.username.toLowerCase() === profileName.toLowerCase(),
    );

    setProfileDraftName(profileName);
    setProfileDraftPassword(account?.password || "");
    setProfileDraftImage(profileImage || "");
    setSelectedBadgeId(account?.badge || "none");
    setProfileModalOpen(true);
  }, [accounts, profileImage, profileName]);

  const handleProfileImageChange = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setProfileDraftImage(result);
    };
    reader.readAsDataURL(file);
  }, []);

  const saveProfileChanges = useCallback(() => {
    const normalizedName = profileDraftName.trim();
    if (!normalizedName) {
      setLoginMessage("Account name is required");
      return;
    }

    const duplicate = accounts.find(
      (account) =>
        account.username.toLowerCase() !== profileName.toLowerCase() &&
        account.username.toLowerCase() === normalizedName.toLowerCase(),
    );

    if (duplicate) {
      setLoginMessage("This account name is already taken");
      return;
    }

    const nextAccounts = accounts.map((account) => {
      if (account.username.toLowerCase() !== profileName.toLowerCase()) return account;
      return {
        ...account,
        username: normalizedName,
        password: profileDraftPassword.trim() || account.password,
        badge: selectedBadgeId === "none" ? account.badge : selectedBadgeId,
      };
    });

    setAccounts(nextAccounts);
    setProfileName(normalizedName);
    setSelectedProfileName(normalizedName);
    setProfileInput(normalizedName);
    setProfileImage(profileDraftImage || profileImage || "");
    setProfileModalOpen(false);
    setServiceUsers((prev) =>
      prev.map((name) => (name.toLowerCase() === profileName.toLowerCase() ? normalizedName : name)),
    );
    setSocialProfiles((prev) => {
      const currentKey = profileName.toLowerCase();
      const next = { ...prev };
      if (next[currentKey]) {
        next[normalizedName.toLowerCase()] = {
          ...next[currentKey],
          followersUsers: next[currentKey].followersUsers || [],
          followingUsers: next[currentKey].followingUsers || [],
        };
        delete next[currentKey];
      }
      return next;
    });
    localStorage.setItem("tasbih_accounts", JSON.stringify(nextAccounts));
    localStorage.setItem("tasbih_profile_name", normalizedName);
    localStorage.setItem("tasbih_profile_image", profileDraftImage || profileImage || "");
    localStorage.setItem("tasbih_service_users", JSON.stringify(
      serviceUsers.map((name) =>
        name.toLowerCase() === profileName.toLowerCase() ? normalizedName : name,
      ),
    ));
  }, [accounts, profileDraftImage, profileDraftName, profileDraftPassword, profileImage, profileName, selectedBadgeId, serviceUsers]);

  const equipBadge = useCallback((badgeId) => {
    const nextBadgeId = badgeId || "none";
    setSelectedBadgeId(nextBadgeId);
    setAccounts((prev) => {
      const updated = prev.map((account) => {
        if (account.username.toLowerCase() !== profileName.toLowerCase()) return account;
        return { ...account, badge: nextBadgeId };
      });
      localStorage.setItem("tasbih_accounts", JSON.stringify(updated));
      return updated;
    });
    setProfileDraftName(profileName);
    setProfileDraftPassword(currentAccount?.password || "");
  }, [currentAccount?.password, profileName]);

  const toggleFollowUser = useCallback((targetUser) => {
    if (!profileName || !targetUser || profileName.toLowerCase() === targetUser.toLowerCase()) {
      return;
    }

    setSocialProfiles((prev) => {
      const currentKey = profileName.toLowerCase();
      const targetKey = targetUser.toLowerCase();
      const currentEntry = ensureSocialRecord(currentKey, prev[currentKey]);
      const targetEntry = ensureSocialRecord(targetKey, prev[targetKey]);
      const alreadyFollowing = currentEntry.followingUsers.includes(targetKey);

      const nextCurrentFollowingUsers = alreadyFollowing
        ? currentEntry.followingUsers.filter((item) => item !== targetKey)
        : [...currentEntry.followingUsers, targetKey];
      const nextTargetFollowersUsers = alreadyFollowing
        ? targetEntry.followersUsers.filter((item) => item !== currentKey)
        : [...targetEntry.followersUsers, currentKey];

      const nextState = {
        ...prev,
        [currentKey]: {
          ...currentEntry,
          following: nextCurrentFollowingUsers.length,
          followingUsers: nextCurrentFollowingUsers,
        },
        [targetKey]: {
          ...targetEntry,
          followers: nextTargetFollowersUsers.length,
          followersUsers: nextTargetFollowersUsers,
        },
      };

      localStorage.setItem("tasbih_social_profiles", JSON.stringify(nextState));
      return nextState;
    });
  }, [ensureSocialRecord, profileName]);

  const syncDailyStreakToCurrentDate = useCallback(() => {
    if (!profileName) return;

    const today = new Date().toISOString().slice(0, 10);
    const savedDate = localStorage.getItem("tasbih_last_active_date");

    if (!savedDate) {
      setDailyStreak(0);
      localStorage.setItem("tasbih_last_active_date", today);
      localStorage.setItem("tasbih_daily_streak", "0");
      return;
    }

    const diffDays = Math.floor(
      (new Date(today).getTime() -
        new Date(`${savedDate}T00:00:00`).getTime()) /
        86400000,
    );

    if (diffDays >= 1) {
      setDailyStreak(0);
      localStorage.setItem("tasbih_daily_streak", "0");
      localStorage.setItem("tasbih_last_active_date", today);
    }
  }, [profileName]);

  const updateDailyStreakOnActivity = useCallback(() => {
    if (!profileName) return;

    const today = new Date().toISOString().slice(0, 10);
    const savedDate = localStorage.getItem("tasbih_last_active_date");

    if (!savedDate) {
      const next = 1;
      setDailyStreak(next);
      localStorage.setItem("tasbih_last_active_date", today);
      localStorage.setItem("tasbih_daily_streak", String(next));
      return;
    }

    const diffDays = Math.floor(
      (new Date(today).getTime() -
        new Date(`${savedDate}T00:00:00`).getTime()) /
        86400000,
    );

    if (diffDays <= 0) {
      const next = dailyStreak === 0 ? 1 : dailyStreak;
      setDailyStreak(next);
      localStorage.setItem("tasbih_daily_streak", String(next));
      localStorage.setItem("tasbih_last_active_date", today);
      return;
    }

    if (streakFreezes > 0) {
      setStreakFreezes((prev) => {
        const next = Math.max(0, prev - 1);
        localStorage.setItem("tasbih_streak_freezes", String(next));
        return next;
      });
      localStorage.setItem("tasbih_last_active_date", today);
      return;
    }

    setDailyStreak((prev) => {
      const next = diffDays === 1 ? Math.max(0, prev + 1) : 1;
      localStorage.setItem("tasbih_daily_streak", String(next));
      return next;
    });
    localStorage.setItem("tasbih_last_active_date", today);
  }, [dailyStreak, profileName, streakFreezes]);

  useEffect(() => {
    syncDailyStreakToCurrentDate();
  }, [profileName, syncDailyStreakToCurrentDate]);

  useEffect(() => {
    if (dailyStreak > bestStreak) {
      setBestStreak(dailyStreak);
    }
  }, [dailyStreak, bestStreak]);

  useEffect(() => {
    if (!copyStatus) return undefined;
    const timer = setTimeout(() => setCopyStatus(""), 1200);
    return () => clearTimeout(timer);
  }, [copyStatus]);

  const currentMode = DEFAULT_MODES[mode] || DEFAULT_MODES[0];
  let target = currentMode.isCustom ? customTarget : currentMode.target;
  if (target === "" || isNaN(target) || target <= 0) target = 1;

  const HUE = 210; // Statik ko'k/zangori rang, bu telefonni qiynamaydi
  const glowColor = `hsl(${HUE}, 80%, 60%)`;
  const bgColor = isDarkMode ? `hsl(${HUE}, 40%, 8%)` : `hsl(${HUE}, 20%, 95%)`;

  const handleCount = useCallback(() => {
    updateDailyStreakOnActivity();
    setCountHistory((prev) => [...prev.slice(-9), count]);
    const nextCount = count + 1;
    setCount(nextCount);

    if (profileName) {
      const todayKey = new Date().toISOString().slice(0, 10);
      setAccounts((prev) =>
        prev.map((account) => {
          if (account.username.toLowerCase() !== profileName.toLowerCase()) return account;
          const nextActivity = {
            ...(account.activityLog || {}),
            [todayKey]: (Number((account.activityLog || {})[todayKey]) || 0) + 1,
          };
          return {
            ...account,
            count: nextCount,
            activityLog: nextActivity,
          };
        }),
      );
    }

    setFreezeCounter((prevFreezeCounter) => {
      const nextFreezeCounter = prevFreezeCounter + 1;
      const earnedFreezes =
        Math.floor(nextFreezeCounter / FREEZE_EVERY_COUNT) -
        Math.floor(prevFreezeCounter / FREEZE_EVERY_COUNT);

      if (earnedFreezes > 0) {
        setStreakFreezes((prevFreezes) => {
          const updated = prevFreezes + earnedFreezes;
          localStorage.setItem("tasbih_streak_freezes", String(updated));
          return updated;
        });
      }

      localStorage.setItem("tasbih_freeze_counter", String(nextFreezeCounter));
      return nextFreezeCounter;
    });

    if (soundEnabled) playSound();

    if (buttonRef.current) {
      buttonRef.current.classList.remove("shaking");
      void buttonRef.current.offsetWidth; // reflow
      buttonRef.current.classList.add("shaking");
    }

    const todayKey = new Date().toISOString().slice(0, 10);
    setActivityLog((prev) => ({
      ...prev,
      [todayKey]: (Number(prev[todayKey]) || 0) + 1,
    }));

    const newParticles = generateParticles().map((p) => ({
      ...p,
      id: particleId.current++,
    }));
    setParticles(newParticles);
    const t2 = setTimeout(() => setParticles([]), 800);
    timeouts.current.push(t2);

    const ripple = { id: Date.now(), x: 0, y: 0 };
    setRipples((prev) => [...prev, ripple]);
    const t3 = setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
    }, 700);
    timeouts.current.push(t3);
  }, [count, profileName, soundEnabled, updateDailyStreakOnActivity]);

  const handleUndo = useCallback(() => {
    if (!countHistory.length) return;
    const previousCount = countHistory[countHistory.length - 1];
    setCountHistory((prev) => prev.slice(0, -1));
    setCount(previousCount);
    const todayKey = new Date().toISOString().slice(0, 10);
    setActivityLog((prev) => ({
      ...prev,
      [todayKey]: Math.max(0, (Number(prev[todayKey]) || 0) - 1),
    }));
  }, [countHistory]);

  const handleCopyCount = useCallback(() => {
    const value = String(count);

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(value).then(() => {
        setCopyStatus(t.copy);
      });
      return;
    }

    setCopyStatus(t.copy);
  }, [count, t.copy]);

  const handleReset = useCallback(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    setActivityLog((prev) => ({
      ...prev,
      [todayKey]: 0,
    }));
  }, []);

  const handleModeChange = (i) => {
    if (DEFAULT_MODES[i].isCustom) {
      setIsEditingCustom(true);
    } else {
      setIsEditingCustom(false);
    }
    setMode(i);
  };

  const beadCount = Math.min(count % (target === Infinity ? 33 : target), 33);

  const todayKey = new Date().toISOString().slice(0, 10);
  const totalToday = activityLog[todayKey] || 0;
  const totalCount = Object.values(activityLog).reduce(
    (sum, value) => sum + (Number(value) || 0),
    0,
  );
  const progressPercent =
    target === Infinity || target <= 0
      ? 0
      : Math.min((count / target) * 100, 100);
  const maxDailyValue = Math.max(
    1,
    ...Object.values(activityLog).map((item) => Number(item) || 0),
  );
  const activitySquares = Array.from({ length: 28 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (27 - index));
    const key = date.toISOString().slice(0, 10);
    const value = Number(activityLog[key] || 0);
    let level = 0;
    if (value > 0)
      level =
        value >= maxDailyValue
          ? 4
          : value >= maxDailyValue * 0.75
            ? 3
            : value >= maxDailyValue * 0.4
              ? 2
              : 1;
    return { key, value, level, date };
  });

  const leaderboardData = [...accounts]
    .filter((account) => account.username)
    .map((account) => ({
      ...account,
      totalCount: Number(account.count) || 0,
      weeklySlots: getLastSevenWeekSlots(account.activityLog || {}),
      profileImage: account.profileImage || "",
      loginDate: account.loginDate || "",
    }))
    .sort((a, b) => b.totalCount - a.totalCount)
    .slice(0, 8);
  const dashboardLevel = Math.max(1, Math.floor((count || 0) / 100) + 1);
  const dashboardGoalMax = target === Infinity ? Math.max(1000, count || 1000) : target;
  const dashboardGoalProgress = Math.min((count / dashboardGoalMax) * 100, 100);
  const dashboardChallengeCards = [
    {
      id: "streak",
      title: "Daily streak",
      icon: "🔥",
      value: dailyStreak,
      max: 365,
      accent: glowColor,
      summary: `${dailyStreak} day streak`,
    },
    {
      id: "xp",
      title: "XP",
      icon: "✨",
      value: count,
      max: 1000,
      accent: "#a78bfa",
      summary: `${count} total points`,
    },
    {
      id: "goal",
      title: "Goal",
      icon: "🎯",
      value: Math.min(count, dashboardGoalMax),
      max: dashboardGoalMax,
      accent: "#34d399",
      summary: `${Math.round(dashboardGoalProgress)}% to target`,
    },
  ];
  const lessonCards = [
    { title: "Focus round", subtitle: "Finish your current set", badge: "10 XP", accent: glowColor },
    { title: "Power streak", subtitle: "Keep the daily chain alive", badge: "+25 XP", accent: "#f97316" },
    { title: "Victory lane", subtitle: "Reach your next achievement", badge: "Elite", accent: "#a78bfa" },
  ];
  const bottomNavItems = [
    { key: "stats", label: "Home", icon: "⌂" },
    { key: "leadership", label: "Leadership", icon: "🏆" },
    { key: "profile", label: "Profile", icon: "◉" },
    { key: "account", label: "Account", icon: "⚙" },
  ];
  const communityHighlights = [
    { title: "Leaderboard", detail: "Top habit streaks", badge: "#1", accent: "#60a5fa" },
    { title: "Guilds", detail: "3 squads active", badge: "4", accent: "#fbbf24" },
    { title: "Rewards", detail: "7 badges earned", badge: "7", accent: "#34d399" },
  ];
  const viewedProfileName = selectedProfileName || profileName;
  const viewedProfileAccount =
    accounts.find((account) => account.username.toLowerCase() === viewedProfileName.toLowerCase()) ||
    null;
  const viewedProfileBadge =
    BADGES.find((badge) => badge.id === viewedProfileAccount?.badge) ||
    { id: "none", label: "No badge", icon: "✨", color: "#94a3b8" };
  const viewedProfileSocial = getProfileSocial(viewedProfileName);
  const isViewingOwnProfile =
    Boolean(profileName) && Boolean(viewedProfileName) && profileName.toLowerCase() === viewedProfileName.toLowerCase();
  const isFollowingViewedProfile =
    Boolean(profileName) &&
    Boolean(viewedProfileName) &&
    !isViewingOwnProfile &&
    getProfileSocial(profileName).followingUsers.includes(viewedProfileName.toLowerCase());

  return (
    <div
      className={`tasbih-container ${isDarkMode ? "dark-mode" : "light-mode"}`}
      style={{ background: bgColor }}
    >
      <div className="stars" style={{ opacity: isDarkMode ? 1 : 0.1 }} />

      <div
        className={`settings-container ${showSettings || !isLoggedIn ? "show-settings" : ""} ${isLoggedIn ? "logged-in-shell" : ""}`}
        ref={settingsRef}
      >
        {!isLoggedIn ? (
          <button
            type="button"
            className="login-entry-btn"
            onClick={() => {
              setActiveMenu("account");
              setShowSettings(true);
            }}
            style={{
              color: glowColor,
              borderColor: glowColor,
              boxShadow: `0 0 15px ${glowColor}35`,
            }}
          >
            Log in
          </button>
        ) : (
          <div className="settings-header-inline">
            <button
              type="button"
              className="sidebar-toggle-btn"
              onClick={() => setShowSettings(!showSettings)}
              style={{
                color: glowColor,
                borderColor: `${glowColor}70`,
                boxShadow: `0 0 12px ${glowColor}40`,
              }}
              aria-label={`Open account menu for ${profileName}`}
              aria-expanded={showSettings}
            >
              <span className="hamburger-lines" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span className="profile-chip-name">{profileName}</span>
            </button>
          </div>
        )}
        {(showSettings || !isLoggedIn) && (
          <div
            id="tasbih-settings-dropdown"
            className="settings-dropdown"
            style={{
              borderColor: glowColor,
              boxShadow: `0 0 15px ${glowColor}40`,
            }}
          >
            <div className="settings-scroll">
              {isLoggedIn && (
                <SidebarNav
                  activeMenu={activeMenu}
                  setActiveMenu={(key) => {
                    if (key === "profile") {
                      setSelectedProfileName(profileName || selectedProfileName || "");
                    }
                    setActiveMenu(key);
                  }}
                />
              )}

              {!isLoggedIn && (activeMenu === "account" || activeMenu === "login") && (
                <LoginPanel
                  profileInput={profileInput}
                  setProfileInput={setProfileInput}
                  profilePassword={profilePassword}
                  setProfilePassword={setProfilePassword}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  serviceUsers={serviceUsers}
                  MAX_SERVICE_CAPACITY={MAX_SERVICE_CAPACITY}
                  glowColor={glowColor}
                  loginMessage={loginMessage}
                  handleLogin={handleLogin}
                />
              )}

              {activeMenu === "stats" && (
                <>
                  <div className="settings-title" style={{ color: glowColor }}>
                    {t.stats}
                  </div>

                  <div
                    className="daily-streak-card"
                    style={{
                      borderColor: `${glowColor}60`,
                      boxShadow: `0 0 12px ${glowColor}25`,
                    }}
                  >
                    <div className="daily-streak-label">{t.dailyStreak}</div>
                    <div className="daily-streak-value" style={{ color: glowColor }}>
                      <span className="streak-icon">🔥</span>
                      <strong>{dailyStreak}</strong>
                      <span className="streak-unit">{t.days}</span>
                    </div>
                  </div>

                  <div
                    className="daily-streak-card best-card"
                    style={{
                      borderColor: `${glowColor}60`,
                      boxShadow: `0 0 12px ${glowColor}25`,
                    }}
                  >
                    <div className="daily-streak-label">{t.bestStreak}</div>
                    <div className="daily-streak-value" style={{ color: glowColor }}>
                      <span className="streak-icon">🏆</span>
                      <strong>{bestStreak}</strong>
                      <span className="streak-unit">{t.days}</span>
                    </div>
                  </div>

                  <div
                    className="daily-streak-card"
                    style={{
                      borderColor: `${glowColor}60`,
                      boxShadow: `0 0 12px ${glowColor}25`,
                    }}
                  >
                    <div className="daily-streak-label">{t.freeze}</div>
                    <div className="daily-streak-value" style={{ color: glowColor }}>
                      <span className="streak-icon">❄️</span>
                      <strong>{streakFreezes}</strong>
                      <span className="streak-unit">{t.freezes}</span>
                    </div>
                  </div>

                  <div className="mini-stats" style={{ borderColor: `${glowColor}40` }}>
                    <div className="mini-stat">
                      <span>{t.today}</span>
                      <strong style={{ color: glowColor }}>{totalToday}</strong>
                    </div>
                    <div className="mini-stat">
                      <span>{t.total}</span>
                      <strong style={{ color: glowColor }}>{totalCount}</strong>
                    </div>
                    <div className="mini-stat">
                      <span>Current</span>
                      <strong style={{ color: glowColor }}>{count % (target === Infinity ? 1 : target || 1)}</strong>
                    </div>
                    <div className="mini-stat">
                      <span>Rounds</span>
                      <strong style={{ color: glowColor }}>{target === Infinity ? 0 : Math.floor(count / target)}</strong>
                    </div>
                  </div>

                  <div className="heatmap-block">
                    <div className="heatmap-label" style={{ color: glowColor }}>
                      {t.stats}
                    </div>
                    <div className="heatmap-content">
                      <div className="activity-grid" aria-label="activity heatmap">
                        {activitySquares.map((item) => (
                          <span
                            key={item.key}
                            className={`activity-cell level-${item.level}`}
                            aria-label={`${item.date.toLocaleDateString()} • ${item.value} ${t.counted}`}
                            data-tooltip={`${item.date.toLocaleDateString()} • ${item.value} ${t.counted}`}
                          />
                        ))}
                      </div>

                      <div className="activity-scale" aria-label="Activity intensity scale">
                        {Array.from({ length: 5 }, (_, index) => (
                          <span
                            key={`scale-${index}`}
                            className={`activity-scale-cell level-${Math.min(4, index)}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {target !== Infinity && (
                    <div className="goal-progress" style={{ borderColor: `${glowColor}40` }}>
                      <div className="goal-progress-header" style={{ color: glowColor }}>
                        <span>{t.goal}</span>
                        <strong>{Math.min(Math.round(progressPercent), 100)}%</strong>
                      </div>
                      <div className="progress-track">
                        <div
                          className="progress-bar"
                          style={{
                            width: `${Math.min(progressPercent, 100)}%`,
                            background: `linear-gradient(90deg, ${glowColor}, rgba(255,255,255,0.9))`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="quick-actions">
                    <div className="quick-title" style={{ color: glowColor }}>
                      {t.quickActions}
                    </div>
                    <div className="action-buttons">
                      <button
                        type="button"
                        className="action-btn"
                        onClick={handleUndo}
                        disabled={!countHistory.length}
                        aria-label={t.undo}
                        style={{
                          color: glowColor,
                          borderColor: glowColor,
                          opacity: countHistory.length ? 1 : 0.5,
                        }}
                      >
                        {t.undo}
                      </button>
                      <button
                        type="button"
                        className="action-btn"
                        onClick={handleCopyCount}
                        aria-label={t.copy}
                        style={{
                          color: glowColor,
                          borderColor: glowColor,
                        }}
                      >
                        {copyStatus || t.copy}
                      </button>
                    </div>
                  </div>

                  <h4 style={{ color: glowColor }}>{t.language}</h4>
                  <div className="lang-buttons">
                    <button
                      type="button"
                      className={lang === "uz" ? "active" : ""}
                      onClick={() => setLang("uz")}
                      aria-label="Switch language to Uzbek"
                      aria-pressed={lang === "uz"}
                    >
                      UZ
                    </button>
                    <button
                      type="button"
                      className={lang === "en" ? "active" : ""}
                      onClick={() => setLang("en")}
                      aria-label="Switch language to English"
                      aria-pressed={lang === "en"}
                    >
                      EN
                    </button>
                    <button
                      type="button"
                      className={lang === "ru" ? "active" : ""}
                      onClick={() => setLang("ru")}
                      aria-label="Switch language to Russian"
                      aria-pressed={lang === "ru"}
                    >
                      RU
                    </button>
                  </div>

                  <hr style={{ borderColor: `${glowColor}40`, margin: "10px 0" }} />

                  <button
                    type="button"
                    className="sound-toggle full-width"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    aria-label={soundEnabled ? "Turn sound off" : "Turn sound on"}
                    aria-pressed={soundEnabled}
                    style={{
                      color: soundEnabled ? glowColor : "inherit",
                      borderColor: soundEnabled ? glowColor : "rgba(128,128,128,0.5)",
                    }}
                  >
                    {soundEnabled ? t.soundOn : t.soundOff}
                  </button>
                  <button
                    type="button"
                    className="sound-toggle full-width"
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                    style={{
                      color: glowColor,
                      borderColor: glowColor,
                      marginTop: "8px",
                    }}
                  >
                    {isDarkMode ? t.lightMode : t.darkMode}
                  </button>
                </>
              )}

              {activeMenu === "stats" && (
                <div className="theme-panel" style={{ borderColor: `${glowColor}40` }}>
                  <div className="theme-panel-header" style={{ color: glowColor }}>
                    Theme
                  </div>
                  <div className="theme-options">
                    <button
                      type="button"
                      className={`theme-option ${isDarkMode ? "selected" : ""}`}
                      onClick={() => setIsDarkMode(true)}
                      style={{
                        borderColor: isDarkMode ? glowColor : "rgba(255,255,255,0.15)",
                        color: glowColor,
                        background: isDarkMode ? `${glowColor}18` : "transparent",
                      }}
                    >
                      Dark
                    </button>
                    <button
                      type="button"
                      className={`theme-option ${!isDarkMode ? "selected" : ""}`}
                      onClick={() => setIsDarkMode(false)}
                      style={{
                        borderColor: !isDarkMode ? glowColor : "rgba(255,255,255,0.15)",
                        color: glowColor,
                        background: !isDarkMode ? `${glowColor}18` : "transparent",
                      }}
                    >
                      Light
                    </button>
                  </div>
                </div>
              )}

              {activeMenu === "leadership" && isLoggedIn && (
                <LeadershipPage
                  leaderboardData={leaderboardData}
                  BADGES={BADGES}
                  profileName={profileName}
                  glowColor={glowColor}
                  setSelectedProfileName={setSelectedProfileName}
                  setActiveMenu={setActiveMenu}
                />
              )}

              {activeMenu === "profile" && isLoggedIn && (
                <ProfilePage
                  viewedProfileName={viewedProfileName}
                  viewedProfileAccount={viewedProfileAccount}
                  viewedProfileBadge={viewedProfileBadge}
                  viewedProfileSocial={viewedProfileSocial}
                  isViewingOwnProfile={isViewingOwnProfile}
                  isFollowingViewedProfile={isFollowingViewedProfile}
                  toggleFollowUser={toggleFollowUser}
                  getLastSevenWeekSlots={getLastSevenWeekSlots}
                  dailyStreak={dailyStreak}
                  bestStreak={bestStreak}
                  count={count}
                  countAchievements={countAchievements}
                  streakAchievements={streakAchievements}
                  BADGES={BADGES}
                  glowColor={glowColor}
                  openProfileModal={openProfileModal}
                  handleLogout={handleLogout}
                  profileImage={profileImage}
                  followListType={followListType}
                  setFollowListType={setFollowListType}
                  loginDate={loginDate}
                  t={t}
                />
              )}

            </div>
          </div>
        )}
      </div>

      {profileModalOpen && (
        <div className="profile-modal-backdrop" onClick={() => setProfileModalOpen(false)}>
          <div
            className="profile-modal"
            style={{ borderColor: `${glowColor}60`, boxShadow: `0 0 30px ${glowColor}30` }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="profile-modal-header" style={{ color: glowColor }}>
              <span className="account-user-icon">{currentBadge.icon}</span>
              <strong>{profileName}</strong>
            </div>

            <div className="profile-modal-section">
              <label className="profile-label" htmlFor="edit-profile-image">
                Profile photo
              </label>
              <div className="profile-upload-row">
                <div className="profile-avatar profile-avatar-modal" style={{ background: `${glowColor}20`, color: glowColor }}>
                  {profileDraftImage ? (
                    <img src={profileDraftImage} alt="Profile preview" className="profile-avatar-image" />
                  ) : (
                    currentBadge.icon
                  )}
                </div>
                <label className="upload-button" style={{ borderColor: glowColor, color: glowColor }} htmlFor="edit-profile-image">
                  Upload
                </label>
              </div>
              <input
                id="edit-profile-image"
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden-file-input"
              />
            </div>

            <div className="profile-modal-section">
              <label className="profile-label" htmlFor="edit-profile-name">
                Edit name
              </label>
              <input
                id="edit-profile-name"
                type="text"
                value={profileDraftName}
                onChange={(event) => setProfileDraftName(event.target.value)}
                className="profile-input"
                style={{ borderColor: glowColor, color: glowColor }}
              />
              <button
                type="button"
                className="sound-toggle full-width"
                onClick={saveProfileChanges}
                style={{ color: glowColor, borderColor: glowColor }}
              >
                Save name
              </button>
            </div>

            <div className="profile-modal-section">
              <label className="profile-label" htmlFor="edit-profile-password">
                Edit password
              </label>
              <input
                id="edit-profile-password"
                type="password"
                value={profileDraftPassword}
                onChange={(event) => setProfileDraftPassword(event.target.value)}
                className="profile-input"
                style={{ borderColor: glowColor, color: glowColor }}
              />
              <button
                type="button"
                className="sound-toggle full-width"
                onClick={saveProfileChanges}
                style={{ color: glowColor, borderColor: glowColor }}
              >
                Save password
              </button>
            </div>

            <div className="profile-modal-section">
              <div className="profile-modal-label" style={{ color: glowColor }}>
                Badges
              </div>
              <div className="badge-grid">
                {BADGES.map((badge) => {
                  const selected = selectedBadgeId === badge.id;
                  return (
                    <div
                      key={badge.id}
                      className={`badge-card ${selected ? "selected" : ""}`}
                      style={{
                        borderColor: selected ? glowColor : "rgba(255,255,255,0.10)",
                        background: selected ? `${badge.color}18` : "rgba(255,255,255,0.02)",
                      }}
                    >
                      <div className="badge-icon" style={{ color: badge.color }}>
                        {badge.icon}
                      </div>
                      <div className="badge-name">{badge.label}</div>
                      <button
                        type="button"
                        className="badge-equip-btn"
                        onClick={() => equipBadge(badge.id)}
                        style={{ borderColor: glowColor, color: glowColor }}
                      >
                        {selected ? "Equipped" : "Equip"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="header">
        <h1 className="title" style={{ color: glowColor }}>
          {t.title}
        </h1>
        <p className="subtitle">{t.subtitle}</p>
      </div>

      <div className="mode-selector">
        {DEFAULT_MODES.map((m, i) => (
          <button
            type="button"
            key={m.label}
            className={`mode-btn ${i === mode ? "active" : ""}`}
            onClick={() => handleModeChange(i)}
            aria-label={`Select ${m.label} count target mode`}
            aria-pressed={i === mode}
            style={
              i === mode
                ? {
                    borderColor: glowColor,
                    color: glowColor,
                    boxShadow: `0 0 15px ${glowColor}40`,
                  }
                : {}
            }
          >
            {m.label}
          </button>
        ))}
      </div>

      {isEditingCustom && currentMode.isCustom && (
        <div className="custom-input-container">
          <label style={{ color: glowColor }}>{t.targetLabel}</label>
          <input
            type="number"
            min="1"
            value={customTarget}
            aria-label="Custom target count"
            onChange={(e) => {
              let val = e.target.value === "" ? "" : parseInt(e.target.value);
              if (val !== "" && val < 1) val = 1;
              setCustomTarget(Number.isNaN(val) ? "" : val);
            }}
            style={{
              borderColor: glowColor,
              color: glowColor,
              boxShadow: `0 0 10px ${glowColor}30`,
            }}
            className="custom-input"
          />
        </div>
      )}

      <div className="bead-ring-container">
        <BeadRing beadCount={beadCount} hue={HUE} />

        {ripples.map((r) => (
          <div
            key={r.id}
            className="ripple"
            style={{ borderColor: glowColor }}
          />
        ))}

        <button
          type="button"
          ref={buttonRef}
          className="count-button"
          onClick={handleCount}
          aria-label={`Add one count to tasbih. Current total is ${count}.`}
          aria-live="polite"
          style={{
            boxShadow: `0 0 40px ${glowColor}, 0 0 80px ${glowColor}40, inset 0 0 30px ${glowColor}20`,
            borderColor: glowColor,
          }}
        >
          <span className="count-number" style={{ color: glowColor }} aria-live="polite">
            {count % (target === Infinity ? Infinity : target)}
          </span>
        </button>

        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              "--endX": `${p.endX}px`,
              "--endY": `${p.endY}px`,
              "--size": `${p.size}px`,
              "--duration": `${p.duration}s`,
              "--delay": `${p.delay}s`,
              background: glowColor,
            }}
          />
        ))}
      </div>

      <Stats count={count} target={target} glowColor={glowColor} t={t} />

      <div className="milestone-wrapper">
        {target !== Infinity &&
          count >= target &&
          count % target === 0 &&
          count > 0 && (
            <div className="milestone" style={{ color: glowColor }}>
              {t.goalReached}
            </div>
          )}
      </div>

      <button
        type="button"
        className="reset-btn"
        onClick={handleReset}
        aria-label="Reset current tasbih count"
        style={{
          color: glowColor,
          borderColor: `${glowColor}40`,
          boxShadow: `0 0 10px ${glowColor}20`,
        }}
      >
        {t.reset}
      </button>
    </div>
  );
}
