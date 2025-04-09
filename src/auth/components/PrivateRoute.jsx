import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext'; // Ensure you have an auth context

const PrivateRoute = ({ element }) => {
  const { user } = useAuth(); // Get user from auth context

  // If user is authenticated, render the element, otherwise redirect to landing page
  return user ? element : <Navigate to="/landing" replace />;
};

export default PrivateRoute;
