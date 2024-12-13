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

  // Dialog refs
  const myQuestionsModalRef = useRef(null);
  const addQuestionModalRef = useRef(null);

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
    setIsDarkMode((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    alert('Logging out...');
    navigate('/login');
  };

  const showModal = (modalRef) => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const closeModal = (modalRef) => {
    if (modalRef.current) {
      modalRef.current.close();
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
        onNavigate={(path) => {
          setIsSidebarOpen(false);
          navigate(path);
        }}
        ref={sidebarRef}
        role="admin"
      />
      <main id="mainContent" className="main-content">
        <section className="container">
          <h1>Question Management</h1>
          <div className="button-group">
            <button className="action-button" onClick={() => showModal(myQuestionsModalRef)}>
              Show My Questions
            </button>
            <button className="action-button" onClick={() => showModal(addQuestionModalRef)}>
              Add New Question
            </button>
          </div>
        </section>

        {/* My Questions Modal */}
        <dialog id="myQuestionsModal" ref={myQuestionsModalRef}>
          <div className="modal-content">
            <span className="close" onClick={() => closeModal(myQuestionsModalRef)}>&times;</span>
            <h2>My Questions</h2>
            <div className="question-list">
              <div className="question-item">What is 2 + 2?</div>
              <div className="question-item">What is the capital of France?</div>
            </div>
          </div>
        </dialog>

        {/* Add Question Modal */}
        <dialog id="addQuestionModal" ref={addQuestionModalRef}>
          <div className="modal-content">
            <span className="close" onClick={() => closeModal(addQuestionModalRef)}>&times;</span>
            <h2>Add New Question</h2>
            <form>
              <label>Question Text:</label>
              <input type="text" placeholder="Enter your question" />
              <button type="button" onClick={() => alert('Question submitted!')}>
                Submit
              </button>
            </form>
          </div>
        </dialog>
      </main>
    </>
  );
};

export default QuestionManagement;
