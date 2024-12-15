import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const UserMainPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch dark mode preference
    const savedMode = localStorage.getItem('isDarkMode');
    if (savedMode === 'true') {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('isDarkMode', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId'); // Retrieve the userId from localStorage
  
      if (!userId) {
        // Redirect to login if userId is not found
        alert('User not found. Redirecting to login.');
        navigate('/login');
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:5000/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setFollowersCount(data.followers);
          setFollowingCount(data.following);
        } else {
          const errorData = await response.json();
          console.error('Error fetching user data:', errorData);
          alert('Failed to fetch user data. Redirecting to login.');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Redirecting to login.');
        navigate('/login');
      }
    };
  
    fetchUserData();
  }, [navigate]);
  

  const handleToggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
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
          <button className="action-button" onClick={() => navigate('/user/user-question-management')}>
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
