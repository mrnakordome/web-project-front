// src/components/UserQuestionManagement.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import '../styles/user_question_management.css';


const UserQuestionManagement = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const sidebarRef = useRef(null);

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
    document.title = "User Question Management";
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

  // CHANGED PARTS:
  const showModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) modal.showModal(); // Use native dialog method
  };

  const closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.close(); // Use native dialog method
      if (modalId === 'answerQuestionModal') {
        document.getElementById('categorySelection').style.display = 'none';
      }
    }
  };

  const showCategorySelection = () => {
    document.getElementById('categorySelection').style.display = 'block';
  };

  const startRandomQuestion = () => {
    alert('Starting a random question...');
    closeModal('answerQuestionModal');
    showQuestionModal('What is 2 + 2?', ['3', '4', '5', '6']);
  };

  const startCategoryQuestion = () => {
    const category = document.getElementById('categorySelect').value;
    if (category) {
      alert('Starting a question in category: ' + category);
      closeModal('answerQuestionModal');
      showQuestionModal('What is the square root of 16?', ['2', '3', '4', '5']);
    } else {
      alert('Please select a category.');
    }
  };

  const showQuestionModal = (questionText, options) => {
    document.getElementById('questionText').innerText = questionText;
    const optionsContainer = document.querySelector('#questionModal .options');
    optionsContainer.innerHTML = '';
    options.forEach((option, index) => {
      const button = document.createElement('button');
      button.innerText = 'Option ' + String.fromCharCode(65 + index) + ': ' + option;
      button.onclick = () => submitAnswer(String.fromCharCode(65 + index));
      optionsContainer.appendChild(button);
    });
    showModal('questionModal');
  };

  const submitAnswer = (selectedOption) => {
    alert('You selected: ' + selectedOption);
    closeModal('questionModal');
  };
  // END CHANGED PARTS

  const handleSearch = () => {
    // Implement search if needed
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
        <section className="container">
          <h1>Welcome, User</h1>
          <div className="button-group">
            <button className="action-button" onClick={() => showModal('answerQuestionModal')}>
              Answer a New Question
            </button>
            <button className="action-button" onClick={() => showModal('questionHistoryModal')}>
              My Question History
            </button>
          </div>
        </section>
        
        {/* Answer Question Modal */}
        <dialog id="answerQuestionModal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => closeModal('answerQuestionModal')}>&times;</span>
            <h2>Choose How to Answer</h2>
            <button onClick={startRandomQuestion}>Random Category</button>
            <button onClick={showCategorySelection}>Choose Category</button>
            <div id="categorySelection" style={{display: 'none', marginTop: '20px'}}>
              <select id="categorySelect">
                <option value="">Select Category</option>
                <option value="math">Math</option>
                <option value="science">Science</option>
                <option value="history">History</option>
              </select>
              <button style={{marginTop: '10px'}} onClick={startCategoryQuestion}>Start</button>
            </div>
          </div>
        </dialog>

        {/* Question History Modal */}
        <dialog id="questionHistoryModal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => closeModal('questionHistoryModal')}>&times;</span>
            <h2>My Question History</h2>
            <div className="history-list">
              <div className="history-item">
                <strong>Question:</strong> What is the capital of Spain?<br />
                <strong>Your Answer:</strong> Madrid<br />
                <strong>Correct Answer:</strong> Madrid
              </div>
              <div className="history-item">
                <strong>Question:</strong> Who painted the Mona Lisa?<br />
                <strong>Your Answer:</strong> Vincent van Gogh<br />
                <strong>Correct Answer:</strong> Leonardo da Vinci
              </div>
            </div>
          </div>
        </dialog>

        {/* Question Modal */}
        <dialog id="questionModal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => closeModal('questionModal')}>&times;</span>
            <h2 id="questionText">Question goes here</h2>
            <div className="options"></div>
          </div>
        </dialog>
      </main>
    </>
  );
};

export default UserQuestionManagement;
