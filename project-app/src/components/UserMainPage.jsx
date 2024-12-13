// src/components/UserMainPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import UserProfile from './UserProfile';

const UserMainPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [followingCount, setFollowingCount] = useState(150);
  const [followersCount, setFollowersCount] = useState(200);

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

  const handleSearch = () => {
    const query = document.getElementById('searchInput').value;
    if (query) {
      alert(`Searching for: ${query}`);
      // Implement search logic here
    } else {
      alert('Please enter a search term.');
    }
  };

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
      <main id="mainContent" className="main-content">
        {/* Search Bar */}
        <section className="search-container">
          <input type="text" id="searchInput" placeholder="Search users..." />
          <button onClick={handleSearch}>Search</button>
        </section>

        {/* User Profile */}
        <section className="user-profile">
          <div className="user-icon">👤</div>
          <div className="follow-stats">
            <div>
              <span>{followingCount}</span>
              Following
            </div>
            <div>
              <span>{followersCount}</span>
              Followers
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="button-group">
          <button className="action-button" onClick={() => navigate('/user/question-management')}>
            Question Management
          </button>
          <button className="action-button" onClick={() => navigate('/leaderboard')}>
            Leaderboard
          </button>
        </section>
      </main>
    </>
  );
};

export default UserMainPage;
