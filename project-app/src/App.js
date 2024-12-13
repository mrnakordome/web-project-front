// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminMainPage from './components/AdminMainPage';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './routes/ProtectedRoute'; // Import ProtectedRoute

const App = () => {
  // For demonstration, we'll use a simple auth state.
  // In a real application, you'd manage authentication state more securely.
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected Route for Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute isAuthenticated={true}>
            <AdminMainPage />
          </ProtectedRoute>
        }
      />
      
      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" />} />
      
      {/* Redirect any undefined routes to login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
