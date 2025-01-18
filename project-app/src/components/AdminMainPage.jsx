import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import '../styles/adminmain.css';

const AdminMainPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [followingCount, setFollowingCount] = useState(0); // Initialize following count
  const [followersCount, setFollowersCount] = useState(0); // Initialize followers count
  const [adminName, setAdminName] = useState(''); // Initialize admin's name

  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  // Manage Dark Mode
  useEffect(() => {
    const savedMode = localStorage.getItem('isDarkMode');
    if (savedMode === 'true') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    if (isDarkMode) {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('isDarkMode', 'false');
    } else {
      document.body.classList.add('dark-mode');
      localStorage.setItem('isDarkMode', 'true');
    }
  };

  // Fetch Admin Details
  useEffect(() => {
    const fetchAdminData = async () => {
      const adminId = localStorage.getItem('userId');
      if (!adminId) {
        alert('Admin not found. Redirecting to login.');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/admin/${adminId}`);
        if (response.ok) {
          const data = await response.json();
          setFollowingCount(data.followin);
          setFollowersCount(data.followersCount);
          setAdminName(data.username);
        } else {
          console.error('Error fetching admin data');
          alert('Failed to fetch data. Redirecting to login.');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
        alert('Something went wrong. Please try again.');
        navigate('/login');
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    alert('Logging out...');
    navigate('/login');
  };

  const showSidebar = () => setIsSidebarOpen(true);
  const hideSidebar = () => setIsSidebarOpen(false);

  // Close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isSidebarOpen
      ) {
        hideSidebar();
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  return (
    <>
      <Header
        onMenuClick={showSidebar}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={hideSidebar}
        onNavigate={(path) => {
          hideSidebar();
          navigate(path);
        }}
        ref={sidebarRef}
        role="admin"
      />
      <main id="mainContent" className="main-content">
        {/* Admin Profile Section */}
        <section className="user-profile">
          <div className="user-icon">👤</div>
          <div className="follow-stats">
            <div>
              <span>{followingCount}</span> Following
            </div>
            <div>
              <span>{followersCount}</span> Followers
            </div>
          </div>
        </section>

        {/* Admin Dashboard */}
        <section className="admin-dashboard">
          <h1>Welcome, {adminName}, to the Admin Dashboard</h1>
        </section>

        {/* Navigation Buttons */}
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
