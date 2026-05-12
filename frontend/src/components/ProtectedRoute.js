// components/ProtectedRoute.js - Redirects unauthenticated users to login
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
