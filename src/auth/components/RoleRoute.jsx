import { useAuth } from './authContext';
import { Navigate, useLocation } from 'react-router-dom';

export default function RoleRoute({ children, allowedRoles }) {
  const { userData } = useAuth();
  const location = useLocation();

  if (!allowedRoles.includes(userData?.role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
}