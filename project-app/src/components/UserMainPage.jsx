import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import '../styles/usermain.css';

/**
 * This component represents the main page for a "user" role.
 * It displays:
 *   - A profile section (username, followers, following)
 *   - A search bar to find and follow other users or admins
 *   - Buttons to navigate to user question management, leaderboard, and feed
 *   - A feed section that toggles on/off, showing multiple-choice questions
 *     from followed admins that the user has NOT yet answered.
 */
const UserMainPage = () => {
  // ==========================
  // State variables
  // ==========================
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [username, setUsername] = useState('');

  // For searching user/admin
  const [searchTarget, setSearchTarget] = useState('user'); 
  const [searchResult, setSearchResult] = useState(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Feed toggling & data
  const [showFeed, setShowFeed] = useState(false);     // true/false => display feed or not
  const [feedQuestions, setFeedQuestions] = useState([]); 
  const [answerInputs, setAnswerInputs] = useState({}); // keep track of typed answers per question

  const navigate = useNavigate();
  const searchModalRef = useRef(null);

  // ==========================
  // Effects
  // ==========================
  useEffect(() => {
    // Load dark mode preference
    const savedMode = localStorage.getItem('isDarkMode');
    if (savedMode === 'true') {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    // Apply or remove 'dark-mode' class to the body
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('isDarkMode', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    // Fetch user details (followers, following, username)
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

  // ==========================
  // Handlers
  // ==========================
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

  /**
   * Perform a search, either for a user or an admin
   * (determined by searchTarget).
   */
  const handleSearch = async () => {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) {
      alert('Please enter a search term.');
      return;
    }

    // user endpoint:   GET /user/username/{username}
    // admin endpoint:  GET /admin/username/{username}
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
        } else {
          alert('Admin not found.');
        }
      }
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  /**
   * Follow the searched user/admin.
   */
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

  /**
   * Fetch the Feed from backend (only unanswered Qs from followed admins).
   */
  const loadFeedFromServer = async () => {
    const currentUserId = localStorage.getItem('userId');
    try {
      const response = await fetch(`http://localhost:5000/user/${currentUserId}/feed`);
      if (response.ok) {
        const data = await response.json();
        // data.feed => array of question objects
        setFeedQuestions(data.feed || []);
      } else {
        console.error('Failed to fetch your feed.');
        alert('Failed to fetch feed.');
      }
    } catch (error) {
      console.error('Error fetching feed:', error);
      alert('Error fetching feed.');
    }
  };

  /**
   * Toggle the feed on/off.
   */
  const handleToggleFeed = async () => {
    if (!showFeed) {
      // If feed is currently hidden, we fetch & show it.
      await loadFeedFromServer();
    }
    setShowFeed(!showFeed); // toggle
  };

  /**
   * Submit an answer for a question in the feed.
   */
  const handleFeedAnswer = async (questionId) => {
    const currentUserId = localStorage.getItem('userId');
    const userAnswer = answerInputs[questionId] || '';

    if (!userAnswer.trim()) {
      alert('Please enter your answer.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/user/${currentUserId}/questions/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: questionId,
          userAnswer: userAnswer,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message); // "Correct answer!" or "Wrong answer!"

        // Remove that question from the feed
        setFeedQuestions((prev) => prev.filter((q) => q.id !== questionId));

        // Clear the typed answer for that question
        setAnswerInputs((prev) => {
          const updated = { ...prev };
          delete updated[questionId];
          return updated;
        });
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Error submitting answer. Check console.');
    }
  };

  /**
   * Controlled input for each question's answer in the feed.
   */
  const handleInputChange = (e, questionId) => {
    setAnswerInputs({
      ...answerInputs,
      [questionId]: e.target.value,
    });
  };

  // ==========================
  // Render
  // ==========================
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
        {/* =======================
            Search Bar
        ======================= */}
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

        {/* =======================
            User Profile
        ======================= */}
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

        {/* =======================
            Button Group
        ======================= */}
        <section className="button-group">
          <button onClick={() => navigate('/user/user-question-management')}>
            Question Management
          </button>
          <button onClick={() => navigate('/leaderboard')}>Leaderboard</button>

          {/* Toggle Feed */}
          <button onClick={handleToggleFeed}>
            {showFeed ? 'Hide Feed' : 'Feed'}
          </button>
        </section>

        {/* =======================
            Feed Section
        ======================= */}
        {showFeed && (
          <section className="feed-container">
            <h3>Feed Questions (from followed Admins)</h3>

            {feedQuestions.length === 0 ? (
              <p>No questions to display.</p>
            ) : (
              feedQuestions.map((question) => (
                <div key={question.id} className="feed-question-card">
                  {/* The question prompt */}
                  <p>
                    <strong>Question:</strong> {question.test}
                  </p>

                  {/* Show multiple-choice options if they exist */}
                  {question.options && (
                    <div className="mcq-options">
                      <p>A) {question.options.a}</p>
                      <p>B) {question.options.b}</p>
                      <p>C) {question.options.c}</p>
                      <p>D) {question.options.d}</p>
                    </div>
                  )}

                  {/* User's answer input */}
                  <input
                    type="text"
                    placeholder="Your answer (A, B, C, or D)"
                    value={answerInputs[question.id] || ''}
                    onChange={(e) => handleInputChange(e, question.id)}
                  />
                  <button onClick={() => handleFeedAnswer(question.id)}>
                    Submit Answer
                  </button>
                </div>
              ))
            )}
          </section>
        )}

        {/* =======================
            Search Result Modal
        ======================= */}
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
