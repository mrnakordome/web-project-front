// src/components/Leaderboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import '../styles/leaderboard.css'; // Ensure this path is correct


const Leaderboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    localStorage.setItem('isDarkMode', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const savedMode = localStorage.getItem('isDarkMode');
    if (savedMode === 'true') {
      setIsDarkMode(true);
    }
  }, []);

  const handleToggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    alert('Logging out...');
    navigate('/login');
  };

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const handleNavigate = (path) => {
    setIsSidebarOpen(false);
    navigate(path);
  };

  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isSidebarOpen
      ) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <>
      <Header
        onMenuClick={handleMenuClick}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        onNavigate={handleNavigate}
        ref={sidebarRef}
        role="user"
      />
      <main className="main-content">
        <section className="leaderboard-container">
          <h1 className="leaderboard-title">Leaderboard</h1>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {/* Top 3 Players with Trophy Icons */}
              <tr className="top-player">
                <td>1 <span className="trophy">🥇</span></td>
                <td>Alice</td>
                <td>1500</td>
              </tr>
              <tr className="top-player">
                <td>2 <span className="trophy">🥈</span></td>
                <td>Bob</td>
                <td>1400</td>
              </tr>
              <tr className="top-player">
                <td>3 <span className="trophy">🥉</span></td>
                <td>Charlie</td>
                <td>1300</td>
              </tr>
              {/* Other Players */}
              <tr>
                <td>4</td>
                <td>David</td>
                <td>1200</td>
              </tr>
              <tr>
                <td>5</td>
                <td>Emma</td>
                <td>1100</td>
              </tr>
              {/* Current User Highlighted */}
              <tr style={{ backgroundColor: '#cec69e' }}>
                <td>6</td>
                <td>You</td>
                <td>1000</td>
              </tr>
              {/* More Players */}
              <tr>
                <td>7</td>
                <td>Frank</td>
                <td>900</td>
              </tr>
              <tr>
                <td>8</td>
                <td>Grace</td>
                <td>800</td>
              </tr>
              {/* Add more players as needed */}
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
};

export default Leaderboard;
