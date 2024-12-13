// src/components/AdminMainPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import Header from './Header';
import Sidebar from './Sidebar';
import UserProfile from './UserProfile';

import '../styles/adminmain.css'; // Ensure this path is correct

const AdminMainPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [followingCount, setFollowingCount] = useState(50); // Example values
  const [followersCount, setFollowersCount] = useState(75); // Example values

  const navigate = useNavigate(); // Initialize navigate

  // Toggle dark mode by adding/removing 'dark-mode' class on <body>
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // Persist dark mode preference
    localStorage.setItem('isDarkMode', isDarkMode);
  }, [isDarkMode]);

  // Load dark mode preference on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('isDarkMode');
    if (savedMode === 'true') {
      setIsDarkMode(true);
    }
  }, []);

  const handleToggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const handleLogout = () => {
    // Clear authentication tokens or user data here if applicable
    // For example:
    // localStorage.removeItem('authToken');

    // Inform the user
    alert('Logging out...');

    // Redirect to the login page
    navigate('/login');
  };

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const handleNavigate = (path) => {
    // Close the sidebar before navigating
    setIsSidebarOpen(false);

    // Navigate to the desired path
    navigate(path);
  };

  // Sidebar ref for detecting outside clicks
  const sidebarRef = useRef(null);

  // Close sidebar when clicking outside
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
      />
      <main id="mainContent" className="main-content">
        <UserProfile followingCount={followingCount} followersCount={followersCount} />
        {/* Add additional admin components or content here */}
        <section className="admin-dashboard">
          <h1>Welcome to the Admin Dashboard</h1>
          {/* Future Components can be added here */}
        </section>
      </main>
    </>
  );
};

export default AdminMainPage;
