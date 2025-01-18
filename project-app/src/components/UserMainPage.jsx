import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import '../styles/usermain.css';

const UserMainPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [username, setUsername] = useState('');
  const [searchTarget, setSearchTarget] = useState('user'); // Default to 'user'
  const [searchResult, setSearchResult] = useState(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const navigate = useNavigate();
  const searchModalRef = useRef(null);

  useEffect(() => {
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
      const userId = localStorage.getItem('userId');

      if (!userId) {
        alert('User not found. Redirecting to login.');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setFollowersCount(data.followersCount);
          setFollowingCount(data.followingCount);
          setUsername(data.username);
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
    setIsDarkMode((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    alert('Logging out...');
    navigate('/login');
  };

  const handleSearch = async () => {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) {
      alert('Please enter a search term.');
      return;
    }

    const endpoint =
      searchTarget === 'user'
        ? `http://localhost:5000/user/username/${query}`
        : `http://localhost:5000/admin/username/${query}`;

    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setSearchResult(data);
        setIsSearchModalOpen(true);
      } else {
        if(searchTarget === "user"){
          alert('User not found.');
        }
        else{
          alert('Admin not found.');
        }
      }
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  const handleFollow = async () => {
    if (!searchResult) return;

    const currentUserId = localStorage.getItem('userId');
    try {
      const response = await fetch('http://localhost:5000/user/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          followerId: currentUserId,
          followingId: searchResult.id,
          role: searchTarget,
        }),
      });

      if (response.ok) {
        alert(`You are now following ${searchResult.username}.`);
        setIsSearchModalOpen(false);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  return (
    <>
      <Header
        onMenuClick={() => setIsSidebarOpen(true)}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        role="user"
      />
      <main id="mainContent" className="main-content">
        {/* Search Bar with User/Admin Selection */}
        <section className="search-container">
          <div className="search-options">
            <label>
              <input
                type="radio"
                name="searchTarget"
                value="user"
                checked={searchTarget === 'user'}
                onChange={() => setSearchTarget('user')}
              />
              User
            </label>
            <label>
              <input
                type="radio"
                name="searchTarget"
                value="admin"
                checked={searchTarget === 'admin'}
                onChange={() => setSearchTarget('admin')}
              />
              Admin
            </label>
          </div>
          <input type="text" id="searchInput" placeholder="Search..." />
          <button onClick={handleSearch}>Search</button>
        </section>

        {/* User Profile */}
        <section className="user-profile">
          <div className="user-icon">👤</div>
          <h2>Welcome, {username}</h2>
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
          <button onClick={() => navigate('/user/user-question-management')}>
            Question Management
          </button>
          <button onClick={() => navigate('/leaderboard')}>Leaderboard</button>
        </section>

        {/* Search Result Modal */}
        {isSearchModalOpen && searchResult && (
          <dialog open className="search-modal">
            <div>
              <h2>{searchResult.username}</h2>
              <button onClick={handleFollow}>Follow</button>
              <button onClick={() => setIsSearchModalOpen(false)}>Close</button>
            </div>
          </dialog>
        )}
      </main>
    </>
  );
};

export default UserMainPage;
