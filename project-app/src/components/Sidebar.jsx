// src/components/Sidebar.jsx
import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = forwardRef(({ isOpen, onClose, role }, ref) => {
  const sidebarStyle = {
    width: isOpen ? '250px' : '0',
    transition: 'width 0.3s',
  };

  return (
    <aside id="sidebar" className="sidebar" style={sidebarStyle} ref={ref}>
      <a href="#!" className="close-sidebar" onClick={onClose} aria-label="Close Sidebar">
        &times;
      </a>
      {role === 'admin' ? (
        <>
          <Link to="/admin" style={{ backgroundColor: '#cec69e' }}>
            Admin Main Page
          </Link>
          {/* Future Admin Navigation Links */}
        </>
      ) : (
        <>
          <Link to="/user" style={{ backgroundColor: '#cec69e' }}>
            User Main Page
          </Link>
          <Link to="/user/question-management">Question Management</Link>
          <Link to="/leaderboard">Leaderboard</Link>
        </>
      )}
    </aside>
  );
});

export default Sidebar;
