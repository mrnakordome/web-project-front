// src/components/AdminSection2.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Added import
import Header from './Header';
import Sidebar from './Sidebar';

const AdminSection2 = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate(); // Initialized useNavigate
  const sidebarRef = useRef(null); // Defined sidebarRef

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

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    alert('Logging out...');
    navigate('/login'); // Navigates to login
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
        ref={sidebarRef} // Passed sidebarRef
        role="admin"
      />
      <main className="main-content">
        <h1>Admin Section 2</h1>
        {/* Add content for Admin Section 2 */}
      </main>
    </>
  );
};

export default AdminSection2;
