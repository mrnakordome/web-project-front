import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import LoginForm from './LoginForm';
import '../styles/loginmenu.css';

const LoginPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userType, setUserType] = useState('user'); // Default to 'user'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registerType, setRegisterType] = useState('user'); // Register as user/admin
  const [registerFields, setRegisterFields] = useState({
    username: '',
    password: '',
    passwordAgain: '',
  });

  const registerModalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedMode = localStorage.getItem('isDarkMode');
    if (savedMode === 'true') setIsDarkMode(true);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('isDarkMode', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    document.title = 'Login';
  }, []);

  const handleToggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role: userType }),
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('userId', userData.id);

        if (userData.role === 'admin') navigate('/admin');
        else if (userData.role === 'user') navigate('/user');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Invalid username or password');
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('Something went wrong.');
    }
  };

  const showRegisterModal = () => {
    // Reset register fields when modal is opened
    setRegisterFields({ username: '', password: '', passwordAgain: '' });
    registerModalRef.current?.showModal();
  };

  const closeRegisterModal = () => registerModalRef.current?.close();

  const handleRegister = async () => {
    const { username, password, passwordAgain } = registerFields;

    if (!username.trim() || !password.trim() || !passwordAgain.trim()) {
      alert('All fields are required.');
      return;
    }

    if (password !== passwordAgain) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          role: registerType,
        }),
      });

      if (response.ok) {
        alert('Registration successful! You can now log in.');
        closeRegisterModal();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Registration failed.');
      }
    } catch (error) {
      console.error('Registration Error:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <>
      <DarkModeToggle isDarkMode={isDarkMode} onToggle={handleToggleDarkMode} />
      <main className="container">
        <LoginForm
          userType={userType}
          onUserTypeChange={(e) => setUserType(e.target.value)}
          username={username}
          onUsernameChange={(e) => setUsername(e.target.value)}
          password={password}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onSubmit={handleSubmit}
          onRegisterLinkClick={showRegisterModal}
        />
      </main>

      {/* Register Modal */}
      <dialog id="registerModal" ref={registerModalRef} className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeRegisterModal}>&times;</span>
          <h2>Register</h2>
          <form>
            <label htmlFor="registerType">Register As:</label>
            <select
              id="registerType"
              onChange={(e) => setRegisterType(e.target.value)}
              value={registerType}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <label htmlFor="registerUsername">Username:</label>
            <input
              type="text"
              id="registerUsername"
              placeholder="Enter your username"
              value={registerFields.username}
              onChange={(e) =>
                setRegisterFields({ ...registerFields, username: e.target.value })
              }
            />
            <label htmlFor="registerPassword">Password:</label>
            <input
              type="password"
              id="registerPassword"
              placeholder="Enter your password"
              value={registerFields.password}
              onChange={(e) =>
                setRegisterFields({ ...registerFields, password: e.target.value })
              }
            />
            <label htmlFor="registerPasswordAgain">Password Again:</label>
            <input
              type="password"
              id="registerPasswordAgain"
              placeholder="Confirm your password"
              value={registerFields.passwordAgain}
              onChange={(e) =>
                setRegisterFields({ ...registerFields, passwordAgain: e.target.value })
              }
            />
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
