// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminMainPage from './components/AdminMainPage';
import UserMainPage from './components/UserMainPage';
import LoginPage from './components/LoginPage';
import Leaderboard from './components/Leaderboard';
import ProtectedRoute from './routes/ProtectedRoute';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected Route for Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminMainPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Route for User */}
      <Route
        path="/user"
        element={
          <ProtectedRoute requiredRole="user">
            <UserMainPage />
          </ProtectedRoute>
        }
      />
      
      {/* Protected Route for Leaderboard */}
      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute requiredRole="user">
            <Leaderboard />
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
