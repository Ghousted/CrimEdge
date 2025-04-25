import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './authContext';

const PrivateRoute = ({ element, requiredRole }) => {
  const { authRole, loading, membershipStatus } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  // Redirect to landing if not authenticated
  if (!authRole) {
    return <Navigate to="/landing" replace />;
  }

  // ===== Handle 'user' role first, including membership logic =====
  if (authRole === 'user') {
    const allowedPaths = [
      '/membership',
      '/payment',
      '/digitalwallet',
      '/creditdebit',
      '/signin',
    ];

    // Allow access to membership/payment-related pages without membership
    if (!membershipStatus && allowedPaths.includes(location.pathname.toLowerCase())) {
      return element;
    }

    // Redirect to /membership if not verified and not already verifying email
    if (!membershipStatus && !location.pathname.toLowerCase().includes('/verify-email')) {
      return <Navigate to="/membership" replace />;
    }

    // Optional: restrict access if `requiredRole` is not "user"
    if (requiredRole && requiredRole !== 'user') {
      return <Navigate to="/dashboard" replace />;
    }

    return element;
  }

  // ===== Non-user roles: enforce role-based access if required =====
  if (requiredRole && authRole !== requiredRole) {
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

  return element;
};

export default PrivateRoute;
