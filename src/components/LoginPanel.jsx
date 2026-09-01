import React from "react";

export default function LoginPanel({
  profileInput,
  setProfileInput,
  profilePassword,
  setProfilePassword,
  showPassword,
  setShowPassword,
  serviceUsers,
  MAX_SERVICE_CAPACITY,
  glowColor,
  loginMessage,
  handleLogin,
}) {
  return (
    <div className="account-panel">
      <label className="profile-label" htmlFor="tasbih-account-name">
        Login
      </label>
      <input
        id="tasbih-account-name"
        type="text"
        className="profile-input"
        value={profileInput}
        onChange={(event) => setProfileInput(event.target.value)}
        placeholder="Enter your login"
        style={{
          borderColor: glowColor,
          color: glowColor,
          boxShadow: `0 0 10px ${glowColor}30`,
        }}
      />

      <label className="profile-label" htmlFor="tasbih-account-password">
        Password
      </label>
      <div
        className="password-input-wrap"
        style={{ borderColor: glowColor, boxShadow: `0 0 10px ${glowColor}30` }}
      >
        <input
          id="tasbih-account-password"
          type={showPassword ? "text" : "password"}
          className="profile-input password-input"
          value={profilePassword}
          onChange={(event) => setProfilePassword(event.target.value)}
          placeholder="Enter your password"
          style={{
            borderColor: glowColor,
            color: glowColor,
          }}
        />
        <button
          type="button"
          className="password-toggle-btn"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          style={{ color: glowColor }}
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      </div>

      <div className="service-capacity" style={{ color: glowColor }}>
        Service capacity: {Math.min(serviceUsers.length, MAX_SERVICE_CAPACITY)}/{MAX_SERVICE_CAPACITY}
      </div>

      <button
        type="button"
        className="sound-toggle full-width"
        onClick={handleLogin}
        style={{
          color: glowColor,
          borderColor: glowColor,
          marginTop: "8px",
        }}
      >
        Log in
      </button>

      {loginMessage && <div className="login-message">{loginMessage}</div>}
    </div>
  );
}
