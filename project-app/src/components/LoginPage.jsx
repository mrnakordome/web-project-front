// src/components/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import DarkModeToggle from './DarkModeToggle';
import LoginForm from './LoginForm';
import '../loginmenu.css'; // Ensure this path is correct

const LoginPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userType, setUserType] = useState('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate(); // Initialize navigate

  // Toggle dark mode by adding/removing 'dark-mode' class on <body>
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // Optional: Persist dark mode preference
    localStorage.setItem('isDarkMode', isDarkMode);
  }, [isDarkMode]);

  // Load dark mode preference on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('isDarkMode');
    if (savedMode === 'true') {
      setIsDarkMode(true);
    }
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
    // Handle the login logic here
    console.log('Logging in with:', { userType, username, password });
    
    // Example: Simple authentication simulation
    // In a real app, replace this with API calls and proper authentication logic
    if (userType === 'admin') {
      // Simulate successful login for admin
      alert('Logged in successfully! Redirecting to Admin Main Page...');
      navigate('/admin'); // Navigate to Admin Main Page
    } else {
      // Handle other user types or show an error
      alert('User login functionality is not implemented yet.');
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
