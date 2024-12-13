// src/components/UserTypeSelector.jsx
import React from 'react';

const UserTypeSelector = ({ userType, onChange }) => {
  return (
    <div className="user-type">
      <label>
        <input 
          type="radio" 
          name="userType" 
          value="user"
          checked={userType === 'user'}
          onChange={onChange}
        /> User
      </label>
      <label>
        <input 
          type="radio" 
          name="userType" 
          value="admin"
          checked={userType === 'admin'}
          onChange={onChange}
        /> Admin
      </label>
    </div>
  );
};

export default UserTypeSelector;
