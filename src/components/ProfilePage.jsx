import React from "react";

export default function ProfilePage({
  viewedProfileName,
  viewedProfileAccount,
  viewedProfileBadge,
  viewedProfileSocial,
  isViewingOwnProfile,
  isFollowingViewedProfile,
  toggleFollowUser,
  getLastSevenWeekSlots,
  dailyStreak,
  bestStreak,
  count,
  countAchievements,
  streakAchievements,
  BADGES,
  glowColor,
  openProfileModal,
  handleLogout,
  profileImage,
  followListType,
  setFollowListType,
  loginDate,
  t,
}) {
  const currentFollowList =
    followListType === "followers"
      ? viewedProfileSocial.followersUsers || []
      : followListType === "following"
        ? viewedProfileSocial.followingUsers || []
        : [];

  return (
    <>
      <div className="settings-title" style={{ color: glowColor }}>
        Profile
      </div>

      <div className="profile-view">
        <div className="profile-hero" style={{ borderColor: `${glowColor}40` }}>
          <div className="profile-avatar" style={{ background: `${viewedProfileBadge.color}25`, color: viewedProfileBadge.color }}>
            {profileImage ? (
              <img src={profileImage} alt={viewedProfileName} className="profile-avatar-image" />
            ) : (
              viewedProfileBadge.icon
            )}
          </div>
          <div className="profile-meta">
            <div className="profile-name">{viewedProfileName}</div>
            <div className="profile-level">Level {Math.max(1, Math.floor((viewedProfileAccount?.count || 0) / 100) + 1)}</div>
          </div>
        </div>

        <div className="profile-metrics">
          <button type="button" className="profile-metric" onClick={() => setFollowListType((prev) => (prev === "followers" ? null : "followers"))}>
            <span>Followers</span>
            <strong>{viewedProfileSocial.followers}</strong>
          </button>
          <button type="button" className="profile-metric" onClick={() => setFollowListType((prev) => (prev === "following" ? null : "following"))}>
            <span>Following</span>
            <strong>{viewedProfileSocial.following}</strong>
          </button>
          <div className="profile-metric">
            <span>Count</span>
            <strong>{viewedProfileAccount?.count || 0}</strong>
          </div>
        </div>

        {!isViewingOwnProfile && (
          <button
            type="button"
            className="sound-toggle full-width"
            onClick={() => toggleFollowUser(viewedProfileName)}
            style={{ color: glowColor, borderColor: glowColor }}
          >
            {isFollowingViewedProfile ? "Following" : "Follow"}
          </button>
        )}
        {isViewingOwnProfile && (
          <>
            <button
              type="button"
              className="sound-toggle full-width"
              onClick={openProfileModal}
              style={{ color: glowColor, borderColor: glowColor }}
            >
              Edit profile
            </button>
          </>
        )}

        {followListType && (
          <div className="profile-card" style={{ borderColor: `${glowColor}40` }}>
            <div className="profile-card-label" style={{ color: glowColor }}>
              {followListType === "followers" ? "Followers" : "Following"}
            </div>
            <div className="mini-social-list">
              {currentFollowList.length ? (
                currentFollowList.map((name) => (
                  <button
                    key={name}
                    type="button"
                    className="mini-social-item"
                    onClick={() => setFollowListType(null)}
                  >
                    {name}
                  </button>
                ))
              ) : (
                <div className="profile-empty-state">No one yet</div>
              )}
            </div>
          </div>
        )}

        <div className="profile-card" style={{ borderColor: `${glowColor}40` }}>
          <div className="profile-card-label" style={{ color: glowColor }}>
            About
          </div>
          <div className="profile-bio">{viewedProfileSocial.bio}</div>
          <div className="profile-location">📍 {viewedProfileSocial.location}</div>
        </div>

        <div className="profile-card" style={{ borderColor: `${glowColor}40` }}>
          <div className="profile-card-label" style={{ color: glowColor }}>
            Member since
          </div>
          <div className="member-since-info">
            {loginDate ? new Date(loginDate).toLocaleDateString(lang === "uz" ? "uz-UZ" : "en-US") : "Unknown"}
          </div>
        </div>

        <div className="profile-card" style={{ borderColor: `${glowColor}40` }}>
          <div className="profile-card-label" style={{ color: glowColor }}>
            Weekly streak
          </div>
          <div className="leaderboard-week-grid profile-week-grid">
            {getLastSevenWeekSlots(viewedProfileAccount?.activityLog || {}).map((slot, slotIndex) => (
              <span
                key={`${viewedProfileName}-weekly-${slotIndex}`}
                className={`leaderboard-slot ${slot ? "active" : "inactive"}`}
                style={{
                  background: slot ? viewedProfileBadge.color : "rgba(255,255,255,0.08)",
                  borderColor: slot ? `${viewedProfileBadge.color}80` : "rgba(255,255,255,0.08)",
                }}
              />
            ))}
          </div>
        </div>

        <div className="profile-card" style={{ borderColor: `${glowColor}40` }}>
          <div className="profile-card-label" style={{ color: glowColor }}>
            Progress
          </div>
          <div className="profile-progress-stack">
            <div className="daily-streak-card" style={{ borderColor: `${glowColor}60`, boxShadow: `0 0 12px ${glowColor}25` }}>
              <div className="daily-streak-label">{t.dailyStreak}</div>
              <div className="daily-streak-value" style={{ color: glowColor }}>
                <span className="streak-icon">🔥</span>
                <strong>{dailyStreak}</strong>
                <span className="streak-unit">{t.days}</span>
              </div>
            </div>
            <div className="profile-progress-row">
              <span>Best streak</span>
              <strong>{bestStreak}</strong>
            </div>
            <div className="profile-progress-row">
              <span>Total count</span>
              <strong>{count}</strong>
            </div>
          </div>
        </div>

        <div className="profile-card" style={{ borderColor: `${glowColor}40` }}>
          <div className="profile-card-label" style={{ color: glowColor }}>
            Achievements
          </div>
          <div className="achievement-list">
            {countAchievements.map((achievement) => {
              const unlocked = count >= achievement.goal;
              const progress = Math.min((count / achievement.goal) * 100, 100);
              return (
                <div
                  key={achievement.goal + achievement.label}
                  className={`achievement-item ${unlocked ? "unlocked" : "locked"}`}
                  style={{
                    borderColor: unlocked ? `${glowColor}80` : "rgba(255,255,255,0.12)",
                    color: unlocked ? glowColor : "rgba(255,255,255,0.7)",
                    background: unlocked ? `${achievement.color}15` : "rgba(255,255,255,0.03)",
                  }}
                >
                  <div className="achievement-head">
                    <span className="achievement-icon">{achievement.icon}</span>
                    <span>{achievement.label}</span>
                  </div>
                  <div className="achievement-progress-track">
                    <span
                      className="achievement-progress-bar"
                      style={{
                        width: `${progress}%`,
                        background: achievement.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="profile-card" style={{ borderColor: `${glowColor}40` }}>
          <div className="profile-card-label" style={{ color: glowColor }}>
            Streak goals
          </div>
          <div className="achievement-list">
            {streakAchievements.map((achievement) => {
              const unlocked = dailyStreak >= achievement.goal;
              const progress = Math.min((dailyStreak / achievement.goal) * 100, 100);
              return (
                <div
                  key={achievement.goal + achievement.label}
                  className={`achievement-item ${unlocked ? "unlocked" : "locked"}`}
                  style={{
                    borderColor: unlocked ? `${glowColor}80` : "rgba(255,255,255,0.12)",
                    color: unlocked ? glowColor : "rgba(255,255,255,0.7)",
                    background: unlocked ? `${achievement.color}15` : "rgba(255,255,255,0.03)",
                  }}
                >
                  <div className="achievement-head">
                    <span className="achievement-icon">{achievement.icon}</span>
                    <span>{achievement.label}</span>
                  </div>
                  <div className="achievement-progress-track">
                    <span
                      className="achievement-progress-bar"
                      style={{
                        width: `${progress}%`,
                        background: achievement.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="profile-card" style={{ borderColor: `${glowColor}40` }}>
          <div className="profile-card-label" style={{ color: glowColor }}>
            Badge
          </div>
          <div className="current-badge-box" style={{ borderColor: `${viewedProfileBadge.color}80`, background: `${viewedProfileBadge.color}12` }}>
            <span className="badge-icon" style={{ color: viewedProfileBadge.color }}>{viewedProfileBadge.icon}</span>
            <strong>{viewedProfileBadge.label}</strong>
          </div>
        </div>

        {isViewingOwnProfile && (
          <button
            type="button"
            className="edit-pencil-btn"
            onClick={openProfileModal}
            style={{ color: glowColor, borderColor: glowColor }}
            title="Edit profile"
          >
            ✏️
          </button>
        )}

        <div className="profile-actions">
          {!isViewingOwnProfile && (
            <button
              type="button"
              className="sound-toggle full-width"
              onClick={() => toggleFollowUser(viewedProfileName)}
              style={{ color: glowColor, borderColor: glowColor }}
            >
              {isFollowingViewedProfile ? "Following" : "Follow"}
            </button>
          )}
          <button
            type="button"
            className="sound-toggle full-width"
            onClick={handleLogout}
            style={{ color: glowColor, borderColor: glowColor }}
          >
            Log out
          </button>
        </div>
      </div>
    </>
  );
}
