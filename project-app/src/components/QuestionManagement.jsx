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

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    alert('Logging out...');
    navigate('/login');
  };

  const showModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.showModal();
    }
  };

  const closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.close();
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
            <button onClick={() => showModal('myQuestionsModal')}>Show My Questions</button>
            <button onClick={() => showModal('addQuestionModal')}>Add New Question</button>
          </div>
        </section>

        {/* My Questions Modal */}
        <dialog id="myQuestionsModal">
          <div>
            <button onClick={() => closeModal('myQuestionsModal')}>&times; Close</button>
            <h2>My Questions</h2>
            <p>Here are some questions...</p>
          </div>
        </dialog>

        {/* Add Question Modal */}
        <dialog id="addQuestionModal">
          <div>
            <button onClick={() => closeModal('addQuestionModal')}>&times; Close</button>
            <h2>Add New Question</h2>
            <form>
              <label>Question Text</label>
              <input type="text" />
              <button type="button" onClick={() => alert('Submitted!')}>Submit</button>
            </form>
          </div>
        </dialog>
      </main>
    </>
  );
};

export default QuestionManagement;
