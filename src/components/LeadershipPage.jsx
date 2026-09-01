import React from "react";

export default function LeadershipPage({
  leaderboardData,
  BADGES,
  profileName,
  glowColor,
  setSelectedProfileName,
  setActiveMenu,
}) {
  const badgeOrder = ["Bronze", "Silver", "Gold", "Diamond", "Legend", "Cosmic", "Eternal", "Supreme", "Ultimate"];

  const getWeeklyBadgeName = (weekIndex) => {
    return badgeOrder[weekIndex % badgeOrder.length] || "Badge";
  };

  const calculateWeekCubes = (loginDate) => {
    if (!loginDate) return Array(8).fill(null).map((_, i) => ({ name: getWeeklyBadgeName(i), active: false }));
    
    try {
      const loginDateObj = new Date(loginDate);
      const now = new Date();
      const weeksPassed = Math.floor((now - loginDateObj) / (7 * 24 * 60 * 60 * 1000));
      
      return Array(8).fill(null).map((_, i) => ({
        name: getWeeklyBadgeName(i),
        active: i <= weeksPassed,
      }));
    } catch {
      return Array(8).fill(null).map((_, i) => ({ name: getWeeklyBadgeName(i), active: false }));
    }
  };

  return (
    <>
      <div className="settings-title" style={{ color: glowColor }}>
        Leadership
      </div>

      <div className="leaderboard-panel">
        <div className="leaderboard-header">
          <span>Rank</span>
          <span>User</span>
          <span>Count</span>
        </div>

        {leaderboardData.map((account, index) => {
          const badge = BADGES.find((item) => item.id === account.badge) || {
            id: "none",
            label: "No badge",
            icon: "✨",
            color: "#94a3b8",
          };
          
          const weeklyCubes = calculateWeekCubes(account.loginDate);

          return (
            <button
              type="button"
              key={`${account.username}-${index}`}
              className={`leaderboard-row ${profileName.toLowerCase() === account.username.toLowerCase() ? "active-user" : ""}`}
              style={{ borderColor: `${glowColor}30` }}
              onClick={() => {
                setSelectedProfileName(account.username);
                setActiveMenu("profile");
              }}
            >
              <div className="leaderboard-rank">#{index + 1}</div>
              <div className="leaderboard-user">
                {account.profileImage ? (
                  <img src={account.profileImage} alt={account.username} className="leaderboard-user-image" />
                ) : (
                  <span className="leaderboard-badge" style={{ background: `${badge.color}20`, color: badge.color }}>
                    {badge.icon}
                  </span>
                )}
                <span>{account.username}</span>
              </div>
              <div className="leaderboard-count">{account.totalCount}</div>
              <div className="leaderboard-badge-cubes" aria-label={`${account.username} weekly badges`}>
                {weeklyCubes.map((cube, cubeIndex) => (
                  <div
                    key={`${account.username}-cube-${cubeIndex}`}
                    className={`badge-cube ${cube.active ? "active" : "inactive"}`}
                    style={{
                      background: cube.active ? `${badge.color}40` : "rgba(255,255,255,0.05)",
                      borderColor: cube.active ? badge.color : "rgba(255,255,255,0.1)",
                    }}
                    title={cube.name}
                  >
                    <span className="cube-name">{cube.name}</span>
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
