import '../index.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/components/authContext';

export default function Sidebar({ isOpen }) {
  const navigate = useNavigate();
  const { signOut } = useAuth();


  const handleSignOut = async () => {
    try {
      await signOut();  // Sign out user via the context method
      navigate('/landing');  // Redirect user to landing page after sign out
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <ul>
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <li className="flex items-center p-4 hover:bg-gray-200 cursor-pointer">
            <i className="bi bi-grid-1x2-fill"></i>
            <span className="ml-2">Dashboard</span>
          </li>
        </Link>
        <Link to="/certification" style={{ textDecoration: 'none' }}>
          <li>
            <i className="bi bi-card-checklist"></i>
            <span className="nav-link">Certification</span>
          </li>
        </Link>
        <Link to="/account" style={{ textDecoration: 'none' }}>
          <li className="flex items-center p-4 hover:bg-gray-200 cursor-pointer">
            <i className="bi bi-person-circle"></i>
            <span className="ml-2">Account</span>
          </li>
        </Link>
        <Link to="/support" style={{ textDecoration: 'none' }}>
          <li className="flex items-center p-4 hover:bg-gray-200 cursor-pointer">
            <i className="bi bi-headset"></i>
            <span className="ml-2">Support</span>
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
