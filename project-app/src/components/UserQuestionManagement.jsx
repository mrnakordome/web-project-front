import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const UserQuestionManagement = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCategorySelect, setShowCategorySelect] = useState(false);
  const [categories, setCategories] = useState([]);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionOptions, setQuestionOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');

  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  // Dialog refs
  const answerQuestionModalRef = useRef(null);
  const questionHistoryModalRef = useRef(null);
  const questionModalRef = useRef(null);

  useEffect(() => {
    fetchCategories();
    
    // Check if dark mode preference exists in localStorage
    const savedMode = localStorage.getItem('isDarkMode');
    if (savedMode === 'true') setIsDarkMode(true);
  }, []);

  // Apply dark mode when it changes
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('isDarkMode', isDarkMode);
  }, [isDarkMode]);

  /* Fetch categories */
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  /* Fetch question history */
  const fetchQuestionHistory = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return alert('User not found. Please log in again.');

    try {
      const response = await fetch(`http://localhost:5000/user/${userId}/questions/history`);
      if (response.ok) {
        const data = await response.json();
        setQuestionHistory(data);
        showModal(questionHistoryModalRef);
      } else {
        alert('Failed to fetch question history.');
      }
    } catch (error) {
      console.error('Error fetching question history:', error);
    }
  };

  /* Fetch a random unanswered question */
  const fetchRandomQuestion = async () => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch(`http://localhost:5000/user/${userId}/questions/random`);
      if (response.ok) {
        const data = await response.json();
        displayQuestion(data);
      } else {
        alert('No unanswered questions available.');
      }
    } catch (error) {
      console.error('Error fetching random question:', error);
    }
  };

  /* Fetch questions by category */
  const fetchCategoryQuestion = async () => {
    const categoryId = document.getElementById('categorySelect').value;
    const userId = localStorage.getItem('userId');
    if (!categoryId) return alert('Please select a category.');

    try {
      const response = await fetch(
        `http://localhost:5000/questions/category/${categoryId}?userId=${userId}`
      );
      if (response.ok) {
        const data = await response.json();
      } else {
        alert('No questions available for this category.');
      }
    } catch (error) {
      console.error('Error fetching category question:', error);
    }
  };

  /* Display question modal */
  const displayQuestion = (question) => {
    setCurrentQuestion(question);
    setQuestionOptions(Object.entries(question.options));
    setSelectedOption('');
    showModal(questionModalRef);
  };

  /* Submit answer */
  const submitAnswer = async () => {
    const userId = localStorage.getItem('userId');
    if (!selectedOption) return alert('Please select an option.');

    try {
      const response = await fetch(`http://localhost:5000/user/${userId}/questions/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQuestion._id,
          userAnswer: selectedOption,
        }),
      });

      if (response.ok) {
        if(currentQuestion.correctAnswer == selectedOption) {
          alert('Correct Answer!');
        }
        else {
          alert('Wrong Answer!');
        }
        
        closeModal(questionModalRef);
      } else {
        alert('Failed to submit answer.', currentQuestion);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  /* Show modal */
  const showModal = (modalRef) => modalRef.current?.showModal();

  /* Close modal */
  const closeModal = (modalRef) => modalRef.current?.close();

  return (
    <>
      <Header
        onMenuClick={() => setIsSidebarOpen(true)}
        onLogout={() => {
          localStorage.clear();
          navigate('/login');
        }}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)} // Toggle dark mode on button click
      />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={(path) => navigate(path)}
        ref={sidebarRef}
        role="user"
      />
      <main className="main-content">
        <h1>Welcome, User</h1>
        <div className="button-group">
          <button className="action-button" onClick={() => showModal(answerQuestionModalRef)}>
            Answer a New Question
          </button>
          <button className="action-button" onClick={fetchQuestionHistory}>
            My Question History
          </button>
        </div>

        {/* Answer Question Modal */}
        <dialog ref={answerQuestionModalRef}>
          <div className="modal-content">
            <span className="close" onClick={() => closeModal(answerQuestionModalRef)}>&times;</span>
            <h2>Choose How to Answer</h2>
            <button onClick={fetchRandomQuestion}>Random Question</button>
            <button onClick={() => setShowCategorySelect(true)}>Choose Category</button>
            {showCategorySelect && (
              <>
                <select id="categorySelect">
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <button onClick={fetchCategoryQuestion}>Start</button>
              </>
            )}
          </div>
        </dialog>

        {/* Question History Modal */}
        <dialog ref={questionHistoryModalRef}>
          <div className="modal-content">
            <span className="close" onClick={() => closeModal(questionHistoryModalRef)}>&times;</span>
            <h2>My Question History</h2>
            {questionHistory.length > 0 ? (
              questionHistory.map((q, index) => (
                <div key={index} className="history-item">
                  <p><strong>Question:</strong> {q.questionText}</p>
                  <p><strong>Your Answer:</strong> {q.userAnswer}</p>
                  <p><strong>Correct Answer:</strong> {q.correctAnswer}</p>
                </div>
              ))
            ) : (
              <p>No question history found.</p>
            )}
          </div>
        </dialog>

        {/* Question Modal */}
        <dialog ref={questionModalRef}>
          <div className="modal-content">
            <span className="close" onClick={() => closeModal(questionModalRef)}>&times;</span>
            <h2>{currentQuestion?.test}</h2>
            <div>
              {questionOptions.map(([option, text]) => (
                <button
                  key={option}
                  onClick={() => setSelectedOption(option)}
                  className={selectedOption === option ? 'selected' : ''}
                >
                  {option}: {text}
                </button>
              ))}
            </div>
            <button onClick={submitAnswer}>Submit</button>
          </div>
        </dialog>
      </main>
    </>
  );
};

export default UserQuestionManagement;
