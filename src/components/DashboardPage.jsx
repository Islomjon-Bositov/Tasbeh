import React from "react";

export default function DashboardPage({
  count,
  dailyStreak,
  bestStreak,
  glowColor,
  dashboardGoalProgress,
  dashboardLevel,
  dashboardChallengeCards,
  lessonCards,
  communityHighlights,
}) {
  return (
    <div className="duolingo-shell" style={{ borderColor: `${glowColor}30` }}>
      <div className="duolingo-topbar">
        <div className="duolingo-label">Home</div>
        <div className="duolingo-xp">
          <span>XP</span>
          <strong>{count}</strong>
        </div>
      </div>

      <div className="duolingo-hero" style={{ borderColor: `${glowColor}35` }}>
        <div className="duolingo-copy">
          <div className="duolingo-kicker">Daily path</div>
          <h2>Keep your streak alive</h2>
          <p>Complete your next round and push your habit higher.</p>
        </div>
        <div className="duolingo-ring-wrap" style={{ boxShadow: `0 0 25px ${glowColor}20` }}>
          <div
            className="duolingo-ring"
            style={{
              background: `conic-gradient(${glowColor} ${dashboardGoalProgress}%, rgba(255,255,255,0.12) 0)`,
            }}
          >
            <div className="duolingo-ring-inner">
              <strong>{Math.round(dashboardGoalProgress)}%</strong>
              <span>Goal</span>
            </div>
          </div>
        </div>
      </div>

      <div className="duolingo-metrics">
        <div className="duolingo-metric-card" style={{ borderColor: `${glowColor}35` }}>
          <span>Level</span>
          <strong>{dashboardLevel}</strong>
        </div>
        <div className="duolingo-metric-card" style={{ borderColor: `${glowColor}35` }}>
          <span>Streak</span>
          <strong>{dailyStreak}d</strong>
        </div>
        <div className="duolingo-metric-card" style={{ borderColor: `${glowColor}35` }}>
          <span>Best</span>
          <strong>{bestStreak}d</strong>
        </div>
      </div>

      <div className="duolingo-quest-card" style={{ borderColor: `${glowColor}35` }}>
        <div className="duolingo-quest-copy">
          <span className="duolingo-kicker">Today</span>
          <h3>Practice round</h3>
        </div>
        <button type="button" className="duolingo-primary-btn" style={{ background: glowColor, color: "#06111f" }}>
          Start now
        </button>
      </div>

      <div className="challenge-list">
        {dashboardChallengeCards.map((card) => {
          const progress = Math.min((card.value / (card.max || 1)) * 100, 100);
          return (
            <div key={card.id} className="challenge-card" style={{ borderColor: `${card.accent}35` }}>
              <div className="challenge-head">
                <div className="challenge-title-wrap">
                  <span className="challenge-icon" style={{ color: card.accent }}>{card.icon}</span>
                  <span>{card.title}</span>
                </div>
                <strong>{card.summary}</strong>
              </div>
              <div className="challenge-progress-track">
                <span className="challenge-progress-bar" style={{ width: `${progress}%`, background: card.accent }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="lesson-section">
        <div className="lesson-header">
          <span>Practice</span>
          <strong>3 lessons</strong>
        </div>
        <div className="lesson-list">
          {lessonCards.map((lesson) => (
            <button key={lesson.title} type="button" className="lesson-card" style={{ borderColor: `${lesson.accent}35` }}>
              <div className="lesson-card-top">
                <span className="lesson-badge" style={{ background: `${lesson.accent}20`, color: lesson.accent }}>
                  {lesson.badge}
                </span>
              </div>
              <h3>{lesson.title}</h3>
              <p>{lesson.subtitle}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="community-panel" style={{ borderColor: `${glowColor}30` }}>
        <div className="community-header">
          <span>Community</span>
          <strong>Live</strong>
        </div>
        <div className="community-list">
          {communityHighlights.map((item) => (
            <div key={item.title} className="community-card" style={{ borderColor: `${item.accent}35` }}>
              <span className="community-pill" style={{ background: `${item.accent}20`, color: item.accent }}>
                {item.badge}
              </span>
              <div className="community-copy">
                <h4>{item.title}</h4>
                <p>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
