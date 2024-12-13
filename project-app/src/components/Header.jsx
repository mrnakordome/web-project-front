// src/components/Header.jsx (Ensure props are correctly passed)
import React from 'react';
import DarkModeToggle from './DarkModeToggle';

const Header = ({ onMenuClick, onLogout, isDarkMode, onToggleDarkMode }) => {
  return (
    <header className="header">
      <div className="left-buttons">
        <button
          className="menu-button"
          onClick={onMenuClick}
          aria-label="Open Sidebar"
        >
          ☰
        </button>
        <button
          className="logout-button"
          onClick={onLogout}
          aria-label="Logout"
        >
          🔓
        </button>
      </div>
      <DarkModeToggle isDarkMode={isDarkMode} onToggle={onToggleDarkMode} />
    </header>
  );
};

export default Header;
