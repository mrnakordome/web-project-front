// src/components/Sidebar.jsx
import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = forwardRef(({ isOpen, onClose, onNavigate, role }, ref) => {
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
          <Link to="/admin/category-management">Category Management</Link>
          <Link to="/admin/question-management">Question Management</Link>
          {/* Admin links only, no user links */}
        </>
      ) : (
        <>
          <Link to="/user" style={{ backgroundColor: '#cec69e' }}>
            User Main Page
          </Link>
          <Link to="/user/user-question-management">User Question Management</Link>
          <Link to="/leaderboard">Leaderboard</Link>
        </>
      )}
    </aside>
  );
});

export default Sidebar;
