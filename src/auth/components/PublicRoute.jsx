import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';

const PublicRoute = ({ element }) => {
  const { authRole } = useAuth();
  const location = window.location.pathname;

  // Allow access to verify-email page even if logged in
  if (location === '/verify-email') {
    return element;
  }

  // If the user is logged in (has a role), redirect to the appropriate dashboard
  if (authRole) {
    return (
      <Navigate
        to={
          authRole === 'admin'
            ? '/admin/dashboard'
            : authRole === 'instructor'
              ? '/insdashboard'
              : '/dashboard'
        }
        replace
      />
    );
  }

  // If not logged in, show the public route
  return element;
};

export default PublicRoute;
