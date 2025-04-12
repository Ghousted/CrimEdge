import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';

const PublicRoute = ({ element }) => {
  const { authRole } = useAuth();

  // If the user is logged in (has a role), redirect to the appropriate dashboard
  if (authRole) {
    return <Navigate to={authRole === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
  }

  // If not logged in, show the public route
  return element;
};

export default PublicRoute;
