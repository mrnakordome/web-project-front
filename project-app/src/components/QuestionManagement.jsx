import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import '../styles/question_management.css';

const QuestionManagement = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [questions, setQuestions] = useState([]); // State for admin's questions
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
    localStorage.removeItem('userId');
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

  const fetchQuestions = async () => {
    const adminId = localStorage.getItem('userId'); // Get admin ID from localStorage
    if (!adminId) {
      alert('Admin not found. Redirecting to login.');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/admin/${adminId}/questions`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions); // Update the questions state
        showModal(myQuestionsModalRef); // Show the modal after fetching data
      } else {
        const errorData = await response.json();
        console.error('Error fetching questions:', errorData);
        alert('Failed to fetch questions.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
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
            <button className="action-button" onClick={fetchQuestions}>
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
              {questions.length > 0 ? (
                questions.map((question, index) => (
                  <div className="question-item" key={index}>
                    {question}
                  </div>
                ))
              ) : (
                <div>No questions found.</div>
              )}
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
