import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import '../styles/category_management.css';

const CategoryManagement = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  // Dialog refs
  const categoriesModalRef = useRef(null);
  const addCategoryModalRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('isDarkMode', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const savedMode = localStorage.getItem('isDarkMode');
    if (savedMode === 'true') setIsDarkMode(true);
  }, []);

  const handleToggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    alert('Logging out...');
    navigate('/login');
  };

  const showModal = (modalRef) => modalRef.current?.showModal();
  const closeModal = (modalRef) => modalRef.current?.close();

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        showModal(categoriesModalRef);
      } else {
        console.error('Failed to fetch categories.');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const addCategory = async () => {
    const categoryName = document.getElementById('newCategoryName').value.trim();
    if (!categoryName) {
      alert('Please enter a category name.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Category "${data.category.name}" added successfully!`);
        setCategories((prevCategories) => [...prevCategories, data.category]); // Update state with the new category
        document.getElementById('newCategoryName').value = ''; // Clear input field
        closeModal(addCategoryModalRef); // Close modal
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to add category.');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Something went wrong. Please try again.');
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
