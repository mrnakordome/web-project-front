import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import UserProfile from './UserProfile';
import '../styles/adminmain.css';

const AdminMainPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [followingCount, setFollowingCount] = useState(0); // Initialize to 0
  const [followersCount, setFollowersCount] = useState(0); // Initialize to 0
  const [adminName, setAdminName] = useState(''); // Store admin's name
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

  useEffect(() => {
    const fetchAdminData = async () => {
      const adminId = localStorage.getItem('userId'); // Retrieve admin ID from localStorage
      if (!adminId) {
        alert('Admin not found. Redirecting to login.');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/admin/${adminId}`);
        if (response.ok) {
          const data = await response.json();
          setFollowingCount(data.followin); // Set following count
          setFollowersCount(data.followers); // Set followers count
          setAdminName(data.username); // Set admin name
        } else {
          const errorData = await response.json();
          console.error('Error fetching admin data:', errorData);
          alert('Failed to fetch admin data. Redirecting to login.');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
      }
    };

    fetchAdminData();
  }, [navigate]);

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
        role="admin"
      />
      <main id="mainContent" className="main-content">
        <UserProfile
          followingCount={followingCount}
          followersCount={followersCount}
          name={adminName} // Pass admin's name if needed
        />
        {/* Add additional admin components or content here */}
        <section className="admin-dashboard">
          <h1>Welcome, {adminName}, to the Admin Dashboard</h1>
        </section>
        {/* Buttons */}
        <section className="button-group">
          <button className="action-button" onClick={() => navigate('/admin/question-management')}>
            Question Management
          </button>
          <button className="action-button" onClick={() => navigate('/admin/category-management')}>
            Category Management
          </button>
        </section>
      </main>
    </>
  );
};

export default AdminMainPage;
