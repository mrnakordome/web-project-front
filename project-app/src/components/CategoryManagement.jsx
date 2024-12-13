import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import '../styles/category_management.css';

const CategoryManagement = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  // Dialog refs
  const categoriesModalRef = useRef(null);
  const addCategoryModalRef = useRef(null);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('isDarkMode', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const savedMode = localStorage.getItem('isDarkMode');
    if (savedMode === 'true') {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    document.title = "Category Management";
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isSidebarOpen
      ) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    alert('Logging out...');
    navigate('/login');
  };

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const handleNavigate = (path) => {
    setIsSidebarOpen(false);
    navigate(path);
  };

  const showModal = (modalRef) => {
    if (modalRef.current) {
      modalRef.current.showModal(); // Use dialog's native showModal method
    }
  };

  const closeModal = (modalRef) => {
    if (modalRef.current) {
      modalRef.current.close(); // Use dialog's native close method
    }
  };

  const addCategory = () => {
    const categoryName = document.getElementById('newCategoryName').value;
    if (categoryName) {
      alert(`Category "${categoryName}" added!`);
      document.getElementById('newCategoryName').value = '';
      closeModal(addCategoryModalRef);
    } else {
      alert('Please enter a category name.');
    }
  };

  return (
    <>
      <Header
        onMenuClick={handleMenuClick}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        onNavigate={handleNavigate}
        ref={sidebarRef}
        role="admin"
      />
      <main id="mainContent" className="main-content">
        <div className="container">
          <h1>Category Management</h1>
          <div className="button-group">
            <button className="action-button" onClick={() => showModal(categoriesModalRef)}>
              Show Current Categories
            </button>
            <button className="action-button" onClick={() => showModal(addCategoryModalRef)}>
              Add New Category
            </button>
          </div>
        </div>

        <dialog id="categoriesModal" ref={categoriesModalRef}>
          <div className="modal-content">
            <span className="close" onClick={() => closeModal(categoriesModalRef)}>&times;</span>
            <h2>Select a Category</h2>
            <select>
              <option value="">Select Category</option>
              <option value="math">Math</option>
              <option value="science">Science</option>
              <option value="history">History</option>
            </select>
          </div>
        </dialog>

        <dialog id="addCategoryModal" ref={addCategoryModalRef}>
          <div className="modal-content">
            <span className="close" onClick={() => closeModal(addCategoryModalRef)}>&times;</span>
            <h2>Add New Category</h2>
            <input type="text" id="newCategoryName" placeholder="Enter category name" />
            <button onClick={addCategory}>Add</button>
          </div>
        </dialog>
      </main>
    </>
  );
};

export default CategoryManagement;
