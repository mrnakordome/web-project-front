// src/components/Sidebar.jsx
import React, { forwardRef } from 'react';

const Sidebar = forwardRef(({ isOpen, onClose, onNavigate }, ref) => {
  const sidebarStyle = {
    width: isOpen ? '250px' : '0',
    transition: 'width 0.3s',
  };

  return (
    <aside id="sidebar" className="sidebar" style={sidebarStyle} ref={ref}>
      <a href="#!" className="close-sidebar" onClick={onClose} aria-label="Close Sidebar">
        &times;
      </a>
      <a
        href="#!"
        style={{ backgroundColor: '#cec69e' }}
        onClick={() => onNavigate('/admin')}
      >
        Admin Main Page
      </a>
      {/* Future Navigation Links */}
      {/*
        <a href="#!" onClick={() => onNavigate('/question-management')}>
          Question Management
        </a>
        <a href="#!" onClick={() => onNavigate('/category-management')}>
          Category Management
        </a>
      */}
    </aside>
  );
});

export default Sidebar;
