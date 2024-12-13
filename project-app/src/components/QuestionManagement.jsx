// src/components/QuestionManagement.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import '../styles/question_management.css';


const QuestionManagement = () => {
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
    document.title = "Question Management";
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

  const showModal = (modalId) => {
    alert('Showing modal');
    const modal = document.getElementById(modalId);
    if (modal) modal.showModal();
  };

  const closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) modal.close();
  };

  const chooseRelatedQuestions = () => {
    showModal('relatedQuestionsModal');
  };

  const submitQuestion = () => {
    const questionText = document.getElementById('questionText').value;
    const optionA = document.getElementById('optionA').value;
    const optionB = document.getElementById('optionB').value;
    const optionC = document.getElementById('optionC').value;
    const optionD = document.getElementById('optionD').value;
    const correctAnswer = document.getElementById('correctAnswer').value;
    const category = document.getElementById('category').value;
    const difficulty = document.getElementById('difficulty').value;

    if (questionText && optionA && optionB && optionC && optionD && correctAnswer && category && difficulty) {
      alert('Question submitted successfully!');
      document.getElementById('addQuestionForm').reset();
      closeModal('addQuestionModal');
    } else {
      alert('Please fill in all fields.');
    }
  };

  const handleSearch = () => {
    // If needed, you can implement a search feature here
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
        role="admin"
      />
      <main id="mainContent" className="main-content">
        <section className="container">
          <h1>Question Management</h1>
          <div className="button-group">
            <button className="action-button" onClick={() => showModal('myQuestionsModal')}>
              Show My Questions
            </button>
            <button className="action-button" onClick={() => showModal('addQuestionModal')}>
              Add New Question
            </button>
          </div>
        </section>

        {/* My Questions Modal */}
        <dialog id="myQuestionsModal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => closeModal('myQuestionsModal')}>&times;</span>
            <h2>My Questions</h2>
            <div className="question-list">
              {/* Sample Questions */}
              <div className="question-item">
                <strong>Question 1:</strong> What is the capital of France?
              </div>
              <div className="question-item">
                <strong>Question 2:</strong> Who wrote 'Hamlet'?
              </div>
              <div className="question-item">
                <strong>Question 3:</strong> What is the chemical symbol for water?
              </div>
            </div>
          </div>
        </dialog>

        {/* Add Question Modal */}
        <dialog id="addQuestionModal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => closeModal('addQuestionModal')}>&times;</span>
            <h2>Add New Question</h2>
            <form id="addQuestionForm">
              <label htmlFor="questionText">Question Text:</label>
              <textarea id="questionText" rows="3" placeholder="Enter your question here"></textarea>

              <label htmlFor="optionA">Option A:</label>
              <input type="text" id="optionA" placeholder="Enter option A" />

              <label htmlFor="optionB">Option B:</label>
              <input type="text" id="optionB" placeholder="Enter option B" />

              <label htmlFor="optionC">Option C:</label>
              <input type="text" id="optionC" placeholder="Enter option C" />

              <label htmlFor="optionD">Option D:</label>
              <input type="text" id="optionD" placeholder="Enter option D" />

              <label htmlFor="correctAnswer">Correct Answer:</label>
              <select id="correctAnswer">
                <option value="">Select the correct answer</option>
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>

              <label htmlFor="category">Category:</label>
              <select id="category">
                <option value="">Select Category</option>
                <option value="math">Math</option>
                <option value="science">Science</option>
                <option value="history">History</option>
              </select>

              <label htmlFor="difficulty">Difficulty Level:</label>
              <input type="number" id="difficulty" min="1" max="10" placeholder="Enter difficulty level (1-10)" />

              <button type="button" onClick={chooseRelatedQuestions}>Choose Related Questions</button>
              <button type="button" onClick={submitQuestion}>Submit Question</button>
            </form>
          </div>
        </dialog>

        {/* Related Questions Modal */}
        <dialog id="relatedQuestionsModal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => closeModal('relatedQuestionsModal')}>&times;</span>
            <h2>Choose Related Questions</h2>
            <div className="question-list">
              {/* Sample Related Questions */}
              <div className="question-item">
                <input type="checkbox" id="related1" />
                <label htmlFor="related1">What is 2 + 2?</label>
              </div>
              <div className="question-item">
                <input type="checkbox" id="related2" />
                <label htmlFor="related2">Explain Newton's Second Law.</label>
              </div>
              <div className="question-item">
                <input type="checkbox" id="related3" />
                <label htmlFor="related3">Describe the events of World War II.</label>
              </div>
            </div>
            <button type="button" onClick={() => closeModal('relatedQuestionsModal')}>Done</button>
          </div>
        </dialog>
      </main>
    </>
  );
};

export default QuestionManagement;
