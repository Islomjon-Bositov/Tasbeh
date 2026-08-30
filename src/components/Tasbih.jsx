import React, { useState, useCallback, useRef, useEffect } from "react";
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
  const [lang, setLang] = useState(
    () => localStorage.getItem("tasbih_lang") || "uz",
  );
  const [showSettings, setShowSettings] = useState(false);
  const [dailyStreak, setDailyStreak] = useState(() => {
    const savedStreak = Number(
      localStorage.getItem("tasbih_daily_streak") || "1",
    );
    const savedDate = localStorage.getItem("tasbih_last_active_date");
    const today = new Date().toISOString().slice(0, 10);

    if (!savedDate) {
      localStorage.setItem("tasbih_last_active_date", today);
      localStorage.setItem("tasbih_daily_streak", "1");
      return 1;
    }

    const diffDays = Math.floor(
      (new Date(today).getTime() -
        new Date(`${savedDate}T00:00:00`).getTime()) /
        86400000,
    );

    if (diffDays === 0) return savedStreak;
    if (diffDays === 1) {
      const next = savedStreak + 1;
      localStorage.setItem("tasbih_last_active_date", today);
      localStorage.setItem("tasbih_daily_streak", String(next));
      return next;
    }

    localStorage.setItem("tasbih_last_active_date", today);
    localStorage.setItem("tasbih_daily_streak", "1");
    return 1;
  });
  const [bestStreak, setBestStreak] = useState(() =>
    Number(localStorage.getItem("tasbih_best_streak") || "1"),
  );
  const [streakFreezes, setStreakFreezes] = useState(() =>
    Number(localStorage.getItem("tasbih_streak_freezes") || "0"),
  );
  const [freezeCounter, setFreezeCounter] = useState(() =>
    Number(localStorage.getItem("tasbih_freeze_counter") || "0"),
  );
  const [countHistory, setCountHistory] = useState([]);
  const [copyStatus, setCopyStatus] = useState("");
  const [vibrationEnabled, setVibrationEnabled] = useState(() => {
    const saved = localStorage.getItem("tasbih_vibration_enabled");
    return saved !== null ? saved === "true" : true;
  });
  const [activityLog, setActivityLog] = useState(() => {
    const saved = localStorage.getItem("tasbih_activity_log");
    try {
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem("tasbih_count");
    return saved !== null ? parseInt(saved, 10) : 0;
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
  const [particles, setParticles] = useState([]);
  const [ripples, setRipples] = useState([]);

  const particleId = useRef(0);
  const timeouts = useRef([]);
  const settingsRef = useRef(null);
  const buttonRef = useRef(null);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.uz;

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
    localStorage.setItem(
      "tasbih_vibration_enabled",
      vibrationEnabled.toString(),
    );
    localStorage.setItem("tasbih_activity_log", JSON.stringify(activityLog));
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
    vibrationEnabled,
    activityLog,
  ]);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const savedDate = localStorage.getItem("tasbih_last_active_date");
    if (!savedDate) {
      localStorage.setItem("tasbih_last_active_date", today);
      return;
    }

    const diffDays = Math.floor(
      (new Date(today).getTime() -
        new Date(`${savedDate}T00:00:00`).getTime()) /
        86400000,
    );

    if (diffDays <= 0) return;

    if (streakFreezes > 0) {
      setStreakFreezes((prev) => {
        const next = Math.max(0, prev - 1);
        localStorage.setItem("tasbih_streak_freezes", String(next));
        return next;
      });
      localStorage.setItem("tasbih_last_active_date", today);
      return;
    }

    const next = diffDays === 1 ? dailyStreak + 1 : 1;
    setDailyStreak(next);
    localStorage.setItem("tasbih_daily_streak", String(next));
    localStorage.setItem("tasbih_last_active_date", today);
  }, [dailyStreak, streakFreezes]);

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
    setCountHistory((prev) => [...prev.slice(-9), count]);
    const nextCount = count + 1;
    setCount(nextCount);

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

    if (vibrationEnabled && navigator.vibrate) navigator.vibrate(50);

    if (buttonRef.current) {
      buttonRef.current.classList.remove("shaking");
      void buttonRef.current.offsetWidth; // reflow
      buttonRef.current.classList.add("shaking");
    }

    const todayKey = new Date().toISOString().slice(0, 10);
    setActivityLog((prev) => ({
      ...prev,
      [todayKey]: nextCount,
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
  }, [count, soundEnabled, vibrationEnabled]);

  const handleUndo = useCallback(() => {
    if (!countHistory.length) return;
    const previousCount = countHistory[countHistory.length - 1];
    setCountHistory((prev) => prev.slice(0, -1));
    setCount(previousCount);
    if (navigator.vibrate) navigator.vibrate(30);
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
    setCountHistory((prev) => [...prev.slice(-9), count]);
    setCount(0);
    const todayKey = new Date().toISOString().slice(0, 10);
    setActivityLog((prev) => ({
      ...prev,
      [todayKey]: 0,
    }));
    if (vibrationEnabled && navigator.vibrate) navigator.vibrate([30, 50, 30]);
  }, [count, vibrationEnabled]);

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

  const activitySquares = Array.from({ length: 28 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (27 - index));
    const key = date.toISOString().slice(0, 10);
    const value = Number(activityLog[key] || 0);
    const maxValue = Math.max(
      1,
      ...Object.values(activityLog).map((item) => Number(item) || 0),
    );
    let level = 0;
    if (value > 0)
      level =
        value >= maxValue
          ? 4
          : value >= maxValue * 0.75
            ? 3
            : value >= maxValue * 0.4
              ? 2
              : 1;
    return { key, value, level, date };
  });

  return (
    <div
      className={`tasbih-container ${isDarkMode ? "dark-mode" : "light-mode"}`}
      style={{ background: bgColor }}
    >
      <div className="stars" style={{ opacity: isDarkMode ? 1 : 0.1 }} />

      <div
        className={`settings-container ${showSettings ? "show-settings" : ""}`}
        ref={settingsRef}
      >
        <div className="settings-header-inline">
          <div
            className="streak-mini-badge"
            style={{
              color: glowColor,
              borderColor: `${glowColor}70`,
              boxShadow: `0 0 12px ${glowColor}40`,
            }}
          >
            <span className="mini-badge-icon">🔥</span>
            {dailyStreak}
          </div>
          <div
            className="streak-mini-badge"
            style={{
              color: glowColor,
              borderColor: `${glowColor}70`,
              boxShadow: `0 0 12px ${glowColor}40`,
            }}
          >
            <span className="mini-badge-icon">❄️</span>
            {streakFreezes}
          </div>
          <button
            className={`settings-icon ${showSettings ? "open" : ""}`}
            onClick={() => setShowSettings(!showSettings)}
            style={{ color: glowColor }}
            aria-label={t.settings}
            aria-expanded={showSettings}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
        {showSettings && (
          <div
            className="settings-dropdown"
            style={{
              borderColor: glowColor,
              boxShadow: `0 0 15px ${glowColor}40`,
            }}
          >
            <div className="settings-title" style={{ color: glowColor }}>
              {t.settings}
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

            <div
              className="mini-stats"
              style={{ borderColor: `${glowColor}40` }}
            >
              <div className="mini-stat">
                <span>{t.today}</span>
                <strong style={{ color: glowColor }}>{totalToday}</strong>
              </div>
              <div className="mini-stat">
                <span>{t.total}</span>
                <strong style={{ color: glowColor }}>{totalCount}</strong>
              </div>
            </div>

            {target !== Infinity && (
              <div
                className="goal-progress"
                style={{ borderColor: `${glowColor}40` }}
              >
                <div
                  className="goal-progress-header"
                  style={{ color: glowColor }}
                >
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

            <div className="heatmap-block">
              <div className="heatmap-label" style={{ color: glowColor }}>
                {t.stats}
              </div>
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
            </div>

            <div className="quick-actions">
              <div className="quick-title" style={{ color: glowColor }}>
                {t.quickActions}
              </div>
              <div className="action-buttons">
                <button
                  className="action-btn"
                  onClick={handleUndo}
                  disabled={!countHistory.length}
                  style={{
                    color: glowColor,
                    borderColor: glowColor,
                    opacity: countHistory.length ? 1 : 0.5,
                  }}
                >
                  {t.undo}
                </button>
                <button
                  className="action-btn"
                  onClick={handleCopyCount}
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
                className={lang === "uz" ? "active" : ""}
                onClick={() => setLang("uz")}
              >
                UZ
              </button>
              <button
                className={lang === "en" ? "active" : ""}
                onClick={() => setLang("en")}
              >
                EN
              </button>
              <button
                className={lang === "ru" ? "active" : ""}
                onClick={() => setLang("ru")}
              >
                RU
              </button>
            </div>

            <hr style={{ borderColor: `${glowColor}40`, margin: "10px 0" }} />

            <button
              className="sound-toggle full-width"
              onClick={() => setSoundEnabled(!soundEnabled)}
              style={{
                color: soundEnabled ? glowColor : "inherit",
                borderColor: soundEnabled ? glowColor : "rgba(128,128,128,0.5)",
              }}
            >
              {soundEnabled ? t.soundOn : t.soundOff}
            </button>
            <button
              className="sound-toggle full-width"
              onClick={() => setVibrationEnabled(!vibrationEnabled)}
              style={{
                color: vibrationEnabled ? glowColor : "inherit",
                borderColor: vibrationEnabled
                  ? glowColor
                  : "rgba(128,128,128,0.5)",
                marginTop: "8px",
              }}
            >
              {t.vibration}: {vibrationEnabled ? "ON" : "OFF"}
            </button>
            <button
              className="sound-toggle full-width"
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                color: glowColor,
                borderColor: glowColor,
                marginTop: "8px",
              }}
            >
              {isDarkMode ? t.lightMode : t.darkMode}
            </button>
          </div>
        )}
      </div>

      <div className="header">
        <h1 className="title" style={{ color: glowColor }}>
          {t.title}
        </h1>
        <p className="subtitle">{t.subtitle}</p>
      </div>

      <div className="mode-selector">
        {DEFAULT_MODES.map((m, i) => (
          <button
            key={m.label}
            className={`mode-btn ${i === mode ? "active" : ""}`}
            onClick={() => handleModeChange(i)}
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
          ref={buttonRef}
          className="count-button"
          onClick={handleCount}
          style={{
            boxShadow: `0 0 40px ${glowColor}, 0 0 80px ${glowColor}40, inset 0 0 30px ${glowColor}20`,
            borderColor: glowColor,
          }}
        >
          <span className="count-number" style={{ color: glowColor }}>
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
        className="reset-btn"
        onClick={handleReset}
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
