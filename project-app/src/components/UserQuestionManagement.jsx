// src/components/UserQuestionManagement.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const UserQuestionManagement = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCategorySelect, setShowCategorySelect] = useState(false);

  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  // Dialog refs
  const answerQuestionModalRef = useRef(null);
  const questionHistoryModalRef = useRef(null);
  const questionModalRef = useRef(null);

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
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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

  const showModal = (modalRef) => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const closeModal = (modalRef) => {
    if (modalRef.current) {
      modalRef.current.close();
      // Reset category selection visibility if closing answerQuestionModal
      if (modalRef === answerQuestionModalRef) {
        setShowCategorySelect(false);
      }
    }
  };

  const showCategorySelection = () => {
    setShowCategorySelect(true);
  };

  const startRandomQuestion = () => {
    alert('Starting a random question...');
    closeModal(answerQuestionModalRef);
    showQuestionModal('What is 2 + 2?', ['3', '4', '5', '6']);
  };

  const startCategoryQuestion = () => {
    const category = document.getElementById('categorySelect').value;
    if (category) {
      alert('Starting a question in category: ' + category);
      closeModal(answerQuestionModalRef);
      showQuestionModal('What is the square root of 16?', ['2', '3', '4', '5']);
    } else {
      alert('Please select a category.');
    }
  };

  const showQuestionModal = (questionText, options) => {
    const questionTextElement = document.getElementById('questionText');
    const optionsContainer = document.getElementById('questionOptions');
    if (questionTextElement && optionsContainer) {
      questionTextElement.innerText = questionText;
      optionsContainer.innerHTML = '';
      options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = 'Option ' + String.fromCharCode(65 + index) + ': ' + option;
        button.onclick = () => submitAnswer(String.fromCharCode(65 + index));
        optionsContainer.appendChild(button);
      });
      showModal(questionModalRef);
    }
  };

  const submitAnswer = (selectedOption) => {
    alert('You selected: ' + selectedOption);
    closeModal(questionModalRef);
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
            <button className="action-button" onClick={() => showModal(answerQuestionModalRef)}>
              Answer a New Question
            </button>
            <button className="action-button" onClick={() => showModal(questionHistoryModalRef)}>
              My Question History
            </button>
          </div>
        </section>
        
        {/* Answer Question Modal */}
        <dialog id="answerQuestionModal" className="modal" ref={answerQuestionModalRef}>
          <div className="modal-content">
            <span className="close" onClick={() => closeModal(answerQuestionModalRef)}>&times;</span>
            <h2>Choose How to Answer</h2>
            <button onClick={startRandomQuestion}>Random Category</button>
            <button onClick={showCategorySelection}>Choose Category</button>
            {showCategorySelect && (
              <div id="categorySelection" style={{ marginTop: '20px' }}>
                <select id="categorySelect">
                  <option value="">Select Category</option>
                  <option value="math">Math</option>
                  <option value="science">Science</option>
                  <option value="history">History</option>
                </select>
                <button style={{ marginTop: '10px' }} onClick={startCategoryQuestion}>Start</button>
              </div>
            )}
          </div>
        </dialog>

        {/* Question History Modal */}
        <dialog id="questionHistoryModal" className="modal" ref={questionHistoryModalRef}>
          <div className="modal-content">
            <span className="close" onClick={() => closeModal(questionHistoryModalRef)}>&times;</span>
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
        <dialog id="questionModal" className="modal" ref={questionModalRef}>
          <div className="modal-content">
            <span className="close" onClick={() => closeModal(questionModalRef)}>&times;</span>
            <h2 id="questionText">Question goes here</h2>
            <div id="questionOptions" className="options"></div>
          </div>
        </dialog>
      </main>
    </>
  );
};

export default UserQuestionManagement;
