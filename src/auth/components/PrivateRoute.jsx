import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';

const PrivateRoute = ({ element, requiredRole }) => {
  const { authRole, loading, membershipStatus } = useAuth();

  if (loading) return <div>Loading...</div>;

  // Redirect subscribed users to dashboard
  if (membershipStatus) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!authRole || (requiredRole && authRole !== requiredRole)) {
    return <Navigate to="/landing" replace />;
  }

  return element;
};

export default PrivateRoute;
