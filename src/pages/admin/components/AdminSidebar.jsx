import '../../../index.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link, useNavigate } from 'react-router-dom';
import { authControl } from "../../../../src/auth/components/authControl";



export default function AdminSidebar({ isOpen }) {
  const navigate = useNavigate();
  const { logout } = authControl();


  const handleSignOut = async () => {
    try {
      await logout();  // Sign out user via the context method
      navigate('/landing');  // Redirect user to landing page after sign out
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <ul>
        <Link to="/admin/dashboard" style={{ textDecoration: 'none' }}>
          <li className="flex items-center p-4 hover:bg-gray-200 cursor-pointer">
            <i className="bi bi-speedometer2"></i>
            <span className="ml-2">Dashboard</span>
          </li>
        </Link>
        <Link to="/admin/users" style={{ textDecoration: 'none' }}>
          <li className="flex items-center p-4 hover:bg-gray-200 cursor-pointer">
            <i className="bi bi-people-fill"></i>
            <span className="ml-2">User Management</span>
          </li>
        </Link>
        <Link to="/admin/settings" style={{ textDecoration: 'none' }}>
          <li className="flex items-center p-4 hover:bg-gray-200 cursor-pointer">
            <i className="bi bi-gear-fill"></i>
            <span className="ml-2">Settings</span>
          </li>
        </Link>
        <li
          className="flex items-center p-4 hover:bg-gray-200 cursor-pointer"
          onClick={handleSignOut}
        >
          <i className="bi bi-box-arrow-right"></i>
          <span className="ml-2">Sign Out</span>
        </li>
      </ul>
    </div>
  );
}
