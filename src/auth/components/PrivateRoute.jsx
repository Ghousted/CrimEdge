import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './authContext';

const PrivateRoute = ({ element, requiredRole }) => {
  const { authRole, loading, membershipStatus } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  // Redirect to landing if authRole is null or undefined
  if (!authRole) {
    return <Navigate to="/landing" replace />;
  }


  // For 'user' role, apply membership status checks
  if (authRole === 'user') {
    const allowedPaths = ['/membership', '/payment', '/digitalwallet', '/creditdebit', '/signin'];

    if (!membershipStatus && allowedPaths.includes(location.pathname.toLowerCase())) {
      return element;
    }

    if (!membershipStatus && !location.pathname.toLowerCase().includes('/verify-email')) {
      return <Navigate to="/membership" replace />;
    }
  }

  return element;
};

export default PrivateRoute;
