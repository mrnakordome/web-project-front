import React from 'react';
import UserTypeSelector from './UserTypeSelector';
import PasswordInput from './PasswordInput';

const LoginForm = ({
  userType,
  onUserTypeChange,
  username,
  onUsernameChange,
  password,
  onPasswordChange,
  onSubmit,
  onRegisterLinkClick, // Add a prop for the register link click handler
}) => {
  return (
    <section className="login-box">
      <h2 style={{ fontWeight: 'bolder' }}>Login</h2>
      <UserTypeSelector userType={userType} onChange={onUserTypeChange} />
      <form onSubmit={onSubmit}>
        <div className="username-container">
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={onUsernameChange} 
            required 
          />
        </div>
        <PasswordInput value={password} onChange={onPasswordChange} />
        <input type="submit" value="Login" />
      </form>
      <div className="register">
        <p>
          Don't have an account?{' '}
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault(); // Prevent the default link behavior
              onRegisterLinkClick(); // Trigger the click handler
            }}
          >
            Register here
          </a>
        </p>
      </div>
    </section>
  );
};

export default LoginForm;
