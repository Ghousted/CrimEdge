import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';

const PrivateRoute = ({ element, requiredRole }) => {
  const { authRole, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!authRole || (requiredRole && authRole !== requiredRole)) {
    return <Navigate to="/landing" replace />;
  }

  return element;
};

export default PrivateRoute;
