// src/components/DarkModeToggle.jsx
import React from 'react';

const DarkModeToggle = ({ isDarkMode, onToggle }) => {
  return (
    <button
      className="toggle-button"
      onClick={onToggle}
      aria-label="Toggle Dark Mode"
    >
      {isDarkMode ? '🌞' : '🌙'}
    </button>
  );
};

export default DarkModeToggle;
