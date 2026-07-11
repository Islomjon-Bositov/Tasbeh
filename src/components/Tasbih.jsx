import React, { useState, useCallback, useRef, useEffect } from 'react'
import './Tasbih.css'

const TRANSLATIONS = {
  uz: {
    title: 'TASBIH',
    subtitle: 'Koinot Sanog\'i',
    soundOn: '🔊 Ovoz',
    soundOff: '🔇 Ovoz',
    lightMode: '☀️ Kunduzgi',
    darkMode: '🌙 Tungi',
    targetLabel: 'Maqsad: ',
    total: 'Jami',
    current: 'Hozirgi',
    rounds: 'Aylanma',
    goalReached: '✦ Maqsadga yetildi! ✦',
    reset: 'Tozalash',
    custom: 'Maxsus',
    settings: 'Sozlamalar',
    language: 'Til'
  },
  en: {
    title: 'TASBIH',
    subtitle: 'Cosmic Counter',
    soundOn: '🔊 Sound',
    soundOff: '🔇 Sound',
    lightMode: '☀️ Light',
    darkMode: '🌙 Dark',
    targetLabel: 'Target: ',
    total: 'Total',
    current: 'Current',
    rounds: 'Rounds',
    goalReached: '✦ Goal Reached! ✦',
    reset: 'Reset',
    custom: 'Custom',
    settings: 'Settings',
    language: 'Language'
  },
  ru: {
    title: 'ТАСБИХ',
    subtitle: 'Космический',
    soundOn: '🔊 Звук',
    soundOff: '🔇 Звук',
    lightMode: '☀️ Светлая',
    darkMode: '🌙 Темная',
    targetLabel: 'Цель: ',
    total: 'Всего',
    current: 'Текущий',
    rounds: 'Круги',
    goalReached: '✦ Цель достигнута! ✦',
    reset: 'Сброс',
    custom: 'Свой',
    settings: 'Настройки',
    language: 'Язык'
  }
}

const PARTICLE_COUNT = 15

function generateParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angleDeg = (360 / PARTICLE_COUNT) * i + Math.random() * 30
    const angleRad = (angleDeg * Math.PI) / 180
    const distance = 80 + Math.random() * 120
    return {
      id: i,
      endX: Math.cos(angleRad) * distance,
      endY: Math.sin(angleRad) * distance,
      size: 4 + Math.random() * 6,
      duration: 0.5 + Math.random() * 0.5,
      delay: Math.random() * 0.1,
    }
  })
}

let audioCtx = null;

const playSound = () => {
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      audioCtx = new AudioContext();
    }
    
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.1);
  } catch (e) {
    console.error("Audio error:", e);
  }
}

// React.memo bilan o'ralgan BeadRing, keraksiz re-renderlarni oldini oladi.
const BeadRing = React.memo(({ beadCount, hue }) => {
  const beads = Array.from({ length: 33 }, (_, i) => i)
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
        const angle = (i / 33) * 2 * Math.PI - Math.PI / 2
        const radius = 120
        const x = 150 + radius * Math.cos(angle)
        const y = 150 + radius * Math.sin(angle)
        const isActive = i < beadCount
        const beadHue = hue

        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={isActive ? 7 : 5}
            fill={isActive ? `hsl(${beadHue}, 80%, 60%)` : 'rgba(255,255,255,0.1)'}
            stroke={isActive ? `hsl(${beadHue}, 90%, 80%)` : 'rgba(255,255,255,0.05)'}
            strokeWidth={isActive ? 2 : 1}
            filter={isActive ? 'url(#glow)' : undefined}
            className={isActive ? 'bead-active' : 'bead-inactive'}
          />
        )
      })}
    </svg>
  )
})

const Stats = React.memo(({ count, target, glowColor, t }) => (
  <div className="stats">
    <div className="stat">
      <span className="stat-value" style={{ color: glowColor }}>{count}</span>
      <span className="stat-label">{t.total}</span>
    </div>
    <div className="stat">
      <span className="stat-value" style={{ color: glowColor }}>
        {target === Infinity ? '∞' : count % target}
      </span>
      <span className="stat-label">{t.current}</span>
    </div>
    <div className="stat">
      <span className="stat-value" style={{ color: glowColor }}>
        {target === Infinity ? '∞' : Math.floor(count / target)}
      </span>
      <span className="stat-label">{t.rounds}</span>
    </div>
  </div>
))


export default function Tasbih() {
  const [lang, setLang] = useState(() => localStorage.getItem('tasbih_lang') || 'uz')
  const [showSettings, setShowSettings] = useState(false)

  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('tasbih_count');
    return saved !== null ? parseInt(saved, 10) : 0;
  })
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('tasbih_mode');
    return saved !== null ? parseInt(saved, 10) : 0;
  })
  const [customTarget, setCustomTarget] = useState(() => {
    const saved = localStorage.getItem('tasbih_customTarget');
    return saved !== null ? parseInt(saved, 10) : 10;
  })
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('tasbih_isDarkMode');
    return saved !== null ? saved === 'true' : true;
  })
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('tasbih_soundEnabled');
    return saved !== null ? saved === 'true' : true;
  })

  const [isEditingCustom, setIsEditingCustom] = useState(false)
  const [particles, setParticles] = useState([])
  const [ripples, setRipples] = useState([])
  
  const particleId = useRef(0)
  const timeouts = useRef([])
  const settingsRef = useRef(null)
  const buttonRef = useRef(null)

  const t = TRANSLATIONS[lang] || TRANSLATIONS.uz

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const DEFAULT_MODES = [
    { label: '33', target: 33 },
    { label: '99', target: 99 },
    { label: '100', target: 100 },
    { label: '∞', target: Infinity },
    { label: t.custom, target: 0, isCustom: true }, 
  ]

  useEffect(() => {
    return () => timeouts.current.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    localStorage.setItem('tasbih_count', count.toString());
    localStorage.setItem('tasbih_mode', mode.toString());
    localStorage.setItem('tasbih_customTarget', customTarget.toString());
    localStorage.setItem('tasbih_isDarkMode', isDarkMode.toString());
    localStorage.setItem('tasbih_lang', lang);
    localStorage.setItem('tasbih_soundEnabled', soundEnabled.toString());
  }, [count, mode, customTarget, isDarkMode, lang, soundEnabled]);

  const currentMode = DEFAULT_MODES[mode] || DEFAULT_MODES[0]
  let target = currentMode.isCustom ? customTarget : currentMode.target
  if (target === '' || isNaN(target) || target <= 0) target = 1;

  const progress = target === Infinity ? 0 : (count % target) / target

  const HUE = 210 // Statik ko'k/zangori rang, bu telefonni qiynamaydi
  const glowColor = `hsl(${HUE}, 80%, 60%)`
  const bgColor = isDarkMode ? `hsl(${HUE}, 40%, 8%)` : `hsl(${HUE}, 20%, 95%)`

  const handleCount = useCallback(() => {
    setCount(c => c + 1)
    
    if (soundEnabled) playSound()
    
    if (navigator.vibrate) navigator.vibrate(50)

    if (buttonRef.current) {
      buttonRef.current.classList.remove('shaking')
      void buttonRef.current.offsetWidth // reflow
      buttonRef.current.classList.add('shaking')
    }

    const newParticles = generateParticles().map(p => ({
      ...p,
      id: particleId.current++,
    }))
    setParticles(newParticles)
    const t2 = setTimeout(() => setParticles([]), 800)
    timeouts.current.push(t2)

    const ripple = { id: Date.now(), x: 0, y: 0 }
    setRipples(prev => [...prev, ripple])
    const t3 = setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== ripple.id))
    }, 700)
    timeouts.current.push(t3)
  }, [soundEnabled])

  const handleReset = useCallback(() => {
    setCount(0)
    if (navigator.vibrate) navigator.vibrate([30, 50, 30])
  }, [])

  const handleModeChange = (i) => {
    if (DEFAULT_MODES[i].isCustom) {
      setIsEditingCustom(true)
    } else {
      setIsEditingCustom(false)
    }
    setMode(i)
    setCount(0)
  }

  const beadCount = Math.min(count % (target === Infinity ? 33 : target), 33)

  return (
    <div className={`tasbih-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`} style={{ background: bgColor }}>
      <div className="stars" style={{ opacity: isDarkMode ? 1 : 0.1 }} />

      <div 
        className="settings-container" 
        ref={settingsRef}
        onMouseEnter={() => setShowSettings(true)}
        onMouseLeave={() => setShowSettings(false)}
      >
        <button 
          className="settings-icon" 
          onClick={() => setShowSettings(!showSettings)}
          style={{ color: glowColor }}
        >
          ⚙️
        </button>
        {showSettings && (
          <div className="settings-dropdown" style={{ borderColor: glowColor, boxShadow: `0 0 15px ${glowColor}40` }}>
            <h4 style={{ color: glowColor }}>{t.language}</h4>
            <div className="lang-buttons">
              <button className={lang === 'uz' ? 'active' : ''} onClick={() => setLang('uz')}>UZ</button>
              <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
              <button className={lang === 'ru' ? 'active' : ''} onClick={() => setLang('ru')}>RU</button>
            </div>
            
            <hr style={{ borderColor: `${glowColor}40`, margin: '10px 0' }}/>
            
            <button 
              className="sound-toggle full-width" 
              onClick={() => setSoundEnabled(!soundEnabled)}
              style={{ color: soundEnabled ? glowColor : 'inherit', borderColor: soundEnabled ? glowColor : 'rgba(128,128,128,0.5)' }}
            >
              {soundEnabled ? t.soundOn : t.soundOff}
            </button>
            <button 
              className="sound-toggle full-width" 
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{ color: glowColor, borderColor: glowColor, marginTop: '8px' }}
            >
              {isDarkMode ? t.lightMode : t.darkMode}
            </button>
          </div>
        )}
      </div>

      <div className="header">
        <h1 className="title" style={{ color: glowColor }}>{t.title}</h1>
        <p className="subtitle">{t.subtitle}</p>
      </div>

      <div className="mode-selector">
        {DEFAULT_MODES.map((m, i) => (
          <button
            key={m.label}
            className={`mode-btn ${i === mode ? 'active' : ''}`}
            onClick={() => handleModeChange(i)}
            style={i === mode ? { borderColor: glowColor, color: glowColor, boxShadow: `0 0 15px ${glowColor}40` } : {}}
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
              let val = e.target.value === '' ? '' : parseInt(e.target.value)
              if (val !== '' && val < 1) val = 1
              setCustomTarget(Number.isNaN(val) ? '' : val)
              setCount(0)
            }}
            style={{ borderColor: glowColor, color: glowColor, boxShadow: `0 0 10px ${glowColor}30` }}
            className="custom-input"
          />
        </div>
      )}

      <div className="bead-ring-container">
        <BeadRing beadCount={beadCount} hue={HUE} />

        {ripples.map(r => (
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

        {particles.map(p => (
          <div
            key={p.id}
            className="particle"
            style={{
              '--endX': `${p.endX}px`,
              '--endY': `${p.endY}px`,
              '--size': `${p.size}px`,
              '--duration': `${p.duration}s`,
              '--delay': `${p.delay}s`,
              background: glowColor,
            }}
          />
        ))}
      </div>

      <Stats count={count} target={target} glowColor={glowColor} t={t} />

      <div className="milestone-wrapper">
        {target !== Infinity && count >= target && count % target === 0 && count > 0 && (
          <div className="milestone" style={{ color: glowColor }}>
            {t.goalReached}
          </div>
        )}
      </div>

      <button className="reset-btn" onClick={handleReset} style={{ color: glowColor, borderColor: `${glowColor}40`, boxShadow: `0 0 10px ${glowColor}20` }}>
        {t.reset}
      </button>
    </div>
  )
}
