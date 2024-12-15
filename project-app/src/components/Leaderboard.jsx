import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import '../styles/leaderboard.css';

const Leaderboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserRank, setCurrentUserRank] = useState(null);

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
    const fetchLeaderboard = async () => {
      try {
        // Fetch the leaderboard data from the backend
        const response = await fetch('http://localhost:5000/leaderboard');
        if (response.ok) {
          const { leaderboard } = await response.json(); // Destructure leaderboard
          setLeaderboard(leaderboard);

          // Get the current user's ID from localStorage
          const currentUserId = parseInt(localStorage.getItem('userId'), 10);
          if (currentUserId) {
            // Find the current user and their rank
            const currentUserIndex = leaderboard.findIndex(
              (user) => user.id === currentUserId
            );
            if (currentUserIndex !== -1) {
              setCurrentUser(leaderboard[currentUserIndex]);
              setCurrentUserRank(currentUserIndex + 1); // Rank is index + 1
            }
          }
        } else {
          console.error('Failed to fetch leaderboard data');
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);

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
          {leaderboard.length === 0 ? (
            <p className="empty-leaderboard">No leaderboard data available.</p>
          ) : (
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.slice(0, 10).map((user, index) => (
                  <tr
                    key={user.id}
                    className={`${
                      index < 3 ? 'top-player' : ''
                    } ${currentUser && user.id === currentUser.id ? 'current-user-row' : ''}`}
                  >
                    <td>
                      {index + 1}{' '}
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}
                    </td>
                    <td>{user.username}</td>
                    <td>{user.points}</td>
                  </tr>
                ))}
                {currentUserRank > 10 && (
                  <tr key={currentUser?.id} className="current-user-row">
                    <td>{currentUserRank}</td>
                    <td>{currentUser?.username || 'You'}</td>
                    <td>{currentUser?.points || 0}</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </>
  );
};

export default Leaderboard;
