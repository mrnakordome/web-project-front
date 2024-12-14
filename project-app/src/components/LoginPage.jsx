import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import LoginForm from './LoginForm';
import '../styles/loginmenu.css';

const LoginPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userType, setUserType] = useState('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const registerModalRef = useRef(null);

  const navigate = useNavigate();

  // Effect to handle dark mode class and localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('isDarkMode', isDarkMode);
  }, [isDarkMode]);

  // Effect to retrieve dark mode preference from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('isDarkMode');
    if (savedMode === 'true') {
      setIsDarkMode(true);
    }
  }, []);

  // Effect to set the document title
  useEffect(() => {
    document.title = "Login";
  }, []);

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Logging in with:', { userType, username, password });

    if (userType === 'admin') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'admin');
      alert('Logged in successfully! Redirecting to Admin Main Page...');
      navigate('/admin');
    } else if (userType === 'user') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'user');
      alert('Logged in successfully! Redirecting to User Main Page...');
      navigate('/user');
    } else {
      alert('Invalid user type selected.');
    }
  };

  const showRegisterModal = () => {
    if (registerModalRef.current) {
      registerModalRef.current.showModal(); // Show the modal using the native method
    }
  };

  const closeRegisterModal = () => {
    if (registerModalRef.current) {
      registerModalRef.current.close(); // Close the modal using the native method
    }
  };

  const handleRegisterLinkClick = () => {
    showRegisterModal();
  };

  const handleRegister = () => {
    const registerUsername = document.getElementById('registerUsername');
    const registerPassword = document.getElementById('registerPassword');
    const registerPasswordAgain = document.getElementById('registerPasswordAgain');

    if (!registerUsername.value.trim() || !registerPassword.value.trim() || !registerPasswordAgain.value.trim()) {
      alert('All fields are required.');
      return;
    }

    if (registerPassword.value !== registerPasswordAgain.value) {
      alert('Passwords do not match.');
      return;
    }

    alert('Registration successful! Returning to login menu.');

    // Clear the fields
    registerUsername.value = '';
    registerPassword.value = '';
    registerPasswordAgain.value = '';

    // Close the modal
    closeRegisterModal();
  };

  return (
    <>
      <DarkModeToggle isDarkMode={isDarkMode} onToggle={handleToggleDarkMode} />
      <main className="container">
        <LoginForm
          userType={userType}
          onUserTypeChange={handleUserTypeChange}
          username={username}
          onUsernameChange={handleUsernameChange}
          password={password}
          onPasswordChange={handlePasswordChange}
          onSubmit={handleSubmit}
          onRegisterLinkClick={handleRegisterLinkClick} // Pass the handler as a prop
        />
      </main>

      {/* Register Modal */}
      <dialog id="registerModal" ref={registerModalRef} className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeRegisterModal}>&times;</span>
          <h2>Register</h2>
          <form>
            <label htmlFor="registerUsername">Username:</label>
            <input type="text" id="registerUsername" placeholder="Enter your username" />
            <label htmlFor="registerPassword">Password:</label>
            <input type="password" id="registerPassword" placeholder="Enter your password" />
            <label htmlFor="registerPasswordAgain">Password Again:</label>
            <input type="password" id="registerPasswordAgain" placeholder="Confirm your password" />
            <button type="button" onClick={handleRegister}>
              Sign Up
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default LoginPage;
