// src/components/Sidebar.jsx
import React, { forwardRef } from 'react';

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
          <a
            href="#!"
            style={{ backgroundColor: '#cec69e' }}
            onClick={() => onNavigate('/admin')}
          >
            Admin Main Page
          </a>
          {/* Future Admin Navigation Links */}
        </>
      ) : (
        <>
          <a
            href="#!"
            style={{ backgroundColor: '#cec69e' }}
            onClick={() => onNavigate('/user')}
          >
            User Main Page
          </a>
        </>
      )}
    </aside>
  );
});

export default Sidebar;
