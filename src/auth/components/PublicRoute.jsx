import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext'; // Make sure you have an auth context

const PublicRoute = ({ element }) => {
  const { user } = useAuth(); // Get user from auth context

  // If user is authenticated, redirect to the dashboard (or any other page)
  return user ? <Navigate to="/dashboard" replace /> : element;
};

export default PublicRoute;
