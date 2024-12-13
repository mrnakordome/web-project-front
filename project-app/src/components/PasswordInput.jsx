// src/components/PasswordInput.jsx
import React, { useState } from 'react';

const PasswordInput = ({ value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="password-container">
      <input 
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={value}
        onChange={onChange}
        required 
      />
      <button 
        type="button" 
        className="eye-button" 
        onClick={toggleVisibility}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? '❌' : '👁️'}
      </button>
    </div>
  );
};

export default PasswordInput;
