// src/routes/Routes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminMainPage from '../components/AdminMainPage';
import LoginPage from '../components/LoginPage';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route
        path="/admin"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AdminMainPage />
          </ProtectedRoute>
        }
      />
      
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
