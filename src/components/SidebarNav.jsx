import React from "react";

export default function SidebarNav({ activeMenu, setActiveMenu, style }) {
  const navItems = [
    { key: "stats", label: "Stats" },
    { key: "leadership", label: "Leadership" },
    { key: "profile", label: "Profile" },
  ];

  return (
    <div className="menu-nav" role="tablist" aria-label="Menu navigation" style={style}>
      {navItems.map((item) => (
        <button
          key={item.key}
          type="button"
          className={`menu-nav-btn ${activeMenu === item.key ? "active" : ""}`}
          onClick={() => setActiveMenu(item.key)}
          aria-selected={activeMenu === item.key}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
