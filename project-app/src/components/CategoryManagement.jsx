import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import '../styles/category_management.css';

const CategoryManagement = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]); // State to hold categories
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

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    alert('Logging out...');
    navigate('/login');
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

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/categories'); // Fetch categories from backend
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        showModal(categoriesModalRef); // Show modal after fetching data
      } else {
        console.error('Failed to fetch categories.');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
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
        onMenuClick={() => setIsSidebarOpen(true)}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={(path) => {
          setIsSidebarOpen(false);
          navigate(path);
        }}
        ref={sidebarRef}
        role="admin"
      />
      <main id="mainContent" className="main-content">
        <div className="container">
          <h1>Category Management</h1>
          <div className="button-group">
            <button className="action-button" onClick={fetchCategories}>
              Show Current Categories
            </button>
            <button className="action-button" onClick={() => showModal(addCategoryModalRef)}>
              Add New Category
            </button>
          </div>
        </div>

        {/* Show Current Categories Modal */}
        <dialog id="categoriesModal" ref={categoriesModalRef}>
          <div className="modal-content">
            <span className="close" onClick={() => closeModal(categoriesModalRef)}>&times;</span>
            <h2>Current Categories</h2>
            <div className="category-list">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <div className="category-item" key={category.id}>
                    {category.name}
                  </div>
                ))
              ) : (
                <div>No categories found.</div>
              )}
            </div>
          </div>
        </dialog>

        {/* Add New Category Modal */}
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
