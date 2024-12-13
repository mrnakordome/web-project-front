// src/components/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import LoginForm from './LoginForm';
import '../styles/loginmenu.css';

const LoginPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userType, setUserType] = useState('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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

  // **New Effect to set the document title**
  useEffect(() => {
    document.title = "Login";
  }, []);

  const handleToggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
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
        />
      </main>
    </>
  );
};

export default LoginPage;
