import React from "react";

export default function AccountPage({
  profileName,
  currentBadge,
  currentAccount,
  serviceUsers,
  MAX_SERVICE_CAPACITY,
  glowColor,
  openProfileModal,
  setActiveMenu,
  handleLogout,
}) {
  return (
    <>
      <div className="settings-title" style={{ color: glowColor }}>
        Account
      </div>

      <div className="account-panel">
        <div className="account-summary-card" style={{ borderColor: `${glowColor}50` }}>
          <div className="account-summary-header">
            <span className="account-user-icon">{currentBadge.icon}</span>
            <div className="account-summary-meta">
              <strong>{profileName}</strong>
              <span>Service member</span>
            </div>
          </div>
          <div className="account-small-metrics">
            <div className="account-metric-card">
              <span>Level</span>
              <strong>{Math.max(1, Math.floor((currentAccount?.count || 0) / 100) + 1)}</strong>
            </div>
            <div className="account-metric-card">
              <span>Badge</span>
              <strong>{currentBadge.label}</strong>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="sound-toggle full-width"
          onClick={openProfileModal}
          style={{ color: glowColor, borderColor: glowColor }}
        >
          Edit profile
        </button>
        <button
          type="button"
          className="sound-toggle full-width"
          onClick={() => setActiveMenu("profile")}
          style={{ color: glowColor, borderColor: glowColor }}
        >
          View profile
        </button>
        <div className="service-capacity" style={{ color: glowColor }}>
          Service: {Math.min(serviceUsers.length, MAX_SERVICE_CAPACITY)}/{MAX_SERVICE_CAPACITY}
        </div>
        <button
          type="button"
          className="sound-toggle full-width"
          onClick={handleLogout}
          style={{
            color: glowColor,
            borderColor: glowColor,
            marginTop: "8px",
          }}
        >
          Log out
        </button>
      </div>
    </>
  );
}
