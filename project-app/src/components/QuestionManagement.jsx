import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import '../styles/question_management.css';

const QuestionManagement = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    test: '',
    options: { A: '', B: '', C: '', D: '' },
    correctAnswer: '',
    categoryId: '',
    difficulty: 1,
  });

  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const myQuestionsModalRef = useRef(null);
  const addQuestionModalRef = useRef(null);

  /* Fetch Categories on Load */
  useEffect(() => {
    fetchCategories();
    // Fetch Dark Mode preference from localStorage
    const savedMode = localStorage.getItem('isDarkMode');
    if (savedMode === 'true') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        alert('Failed to fetch categories.');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  /* Fetch Questions for Current Admin */
  const fetchQuestions = async () => {
    const adminId = localStorage.getItem('userId');
    try {
      const response = await fetch(`http://localhost:5000/admin/${adminId}/questions`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched Questions:', data); // Debugging
        setQuestions(data); // data is an array of QuestionResponseDTO
        showModal(myQuestionsModalRef);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to fetch questions.');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleInputChange = (e, field) => {
    setNewQuestion((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // Make sure we're setting uppercase keys
  const handleOptionsChange = (e, option) => {
    setNewQuestion(prev => ({
      ...prev,
      options: { ...prev.options, [option.toLowerCase()]: e.target.value },
    }));
  };
  


  /* Add New Question */
  const handleAddNewQuestion = async () => {
    const adminId = localStorage.getItem('userId'); // Current admin ID
    const { test, options, correctAnswer, categoryId, difficulty } = newQuestion;

    // Basic validation
    if (!test || !correctAnswer || !categoryId || !difficulty) {
      alert('Please fill all required fields!');
      return;
    }

    // Ensure all options are filled
    if (!options.a || !options.b || !options.c || !options.d) {
      alert('Please fill all options (A, B, C, D)!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/admin/questions', { // Corrected URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId, test, options, correctAnswer, categoryId, difficulty }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Add Question Response:', data); // Debugging

        alert('New question added successfully!');
        setQuestions((prev) => [...prev, data.question]); // Update local questions
        setNewQuestion({
          test: '',
          options: { A: '', B: '', C: '', D: '' },
          correctAnswer: '',
          categoryId: '',
          difficulty: 1,
        });
        closeModal(addQuestionModalRef);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to add the question.');
      }
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const showModal = (modalRef) => modalRef.current && modalRef.current.showModal();
  const closeModal = (modalRef) => modalRef.current && modalRef.current.close();

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      // Toggle dark mode class
      if (newMode) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('isDarkMode', 'true');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('isDarkMode', 'false');
      }
      return newMode;
    });
  };

  return (
    <>
      <Header
        onMenuClick={() => setIsSidebarOpen(true)}
        onLogout={() => navigate('/login')}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        ref={sidebarRef}
        role="admin"
      />
      <main className="main-content">
        <h1>Question Management</h1>
        <div className="button-group">
          <button className="action-button" onClick={fetchQuestions}>Show My Questions</button>
          <button className="action-button" onClick={() => showModal(addQuestionModalRef)}>Add New Question</button>
        </div>

        {/* My Questions Modal */}
        <dialog ref={myQuestionsModalRef}>
          <div className="modal-content">
            <span className="close" onClick={() => closeModal(myQuestionsModalRef)}>&times;</span>
            <h2>My Questions</h2>
            <div className="question-list">
              {questions.length > 0 ? (
                questions.map((q) => {
                  console.log('Rendering Question:', q); // Debugging
                  return (
                    <div key={q.id} className="question-item">
                      <h3>{q.test}</h3>
                      <ul>
                      <li>A: {q.options && q.options.a ? q.options.a : 'N/A'}</li>
<li>B: {q.options && q.options.b ? q.options.b : 'N/A'}</li>
<li>C: {q.options && q.options.c ? q.options.c : 'N/A'}</li>
<li>D: {q.options && q.options.d ? q.options.d : 'N/A'}</li>

                      </ul>
                      <p><strong>Correct Answer:</strong> {q.correctAnswer}</p>
                      <p><strong>Category ID:</strong> {q.categoryId}</p>
                      <p><strong>Difficulty:</strong> {q.difficulty}</p>
                    </div>
                  )
                })
              ) : (
                <div>No questions found.</div>
              )}
            </div>
          </div>
        </dialog>

        {/* Add New Question Modal */}
        <dialog ref={addQuestionModalRef}>
          <div className="modal-content">
            <span className="close" onClick={() => closeModal(addQuestionModalRef)}>&times;</span>
            <h2>Add New Question</h2>
            <input
              type="text"
              placeholder="Question Text"
              value={newQuestion.test}
              onChange={(e) => handleInputChange(e, 'test')}
            />
            <input
              type="text"
              placeholder="Option A"
              value={newQuestion.options.a}
              onChange={(e) => handleOptionsChange(e, 'a')}
            />
            <input
              type="text"
              placeholder="Option B"
              value={newQuestion.options.b}
              onChange={(e) => handleOptionsChange(e, 'b')}
            />
            <input
              type="text"
              placeholder="Option C"
              value={newQuestion.options.c}
              onChange={(e) => handleOptionsChange(e, 'c')}
            />
            <input
              type="text"
              placeholder="Option D"
              value={newQuestion.options.d}
              onChange={(e) => handleOptionsChange(e, 'd')}
            />
            <select
              value={newQuestion.correctAnswer}
              onChange={(e) => handleInputChange(e, 'correctAnswer')}
            >
              <option value="">Select Correct Answer</option>
              <option value="A">Option A</option>
              <option value="B">Option B</option>
              <option value="C">Option C</option>
              <option value="D">Option D</option>
            </select>
            <select
              value={newQuestion.categoryId}
              onChange={(e) => handleInputChange(e, 'categoryId')}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Difficulty (1-10)"
              value={newQuestion.difficulty}
              onChange={(e) => handleInputChange(e, 'difficulty')}
              min="1"
              max="10"
            />
            <button onClick={handleAddNewQuestion}>Add Question</button>
          </div>
        </dialog>
      </main>
    </>
  );
};

export default QuestionManagement;
