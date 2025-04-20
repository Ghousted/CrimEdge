import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './authContext';

const PrivateRoute = ({ element, requiredRole }) => {
  const { authRole, loading, membershipStatus } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;
  
  if (!authRole || (requiredRole && authRole !== requiredRole)) {
    console.log(authRole, membershipStatus);
    return <Navigate to="/landing" replace />;
  }

  // Allow access to membership and payment-related pages even if membershipStatus is false
  const allowedPaths = ['/membership', '/payment', '/digitalwallet', '/creditdebit'];
  if (!membershipStatus && allowedPaths.includes(location.pathname.toLowerCase())) {
    return element;
  }

  // If membership status is false and not on allowed paths, redirect to membership page
  if (!membershipStatus) {
    return <Navigate to="/membership" replace />;
  }



  return element;
};

export default PrivateRoute;
