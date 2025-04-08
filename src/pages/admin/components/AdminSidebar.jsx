import '../../../index.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from 'react-router-dom';

export default function AdminSidebar({ isOpen }) {
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
        <Link to="/admin/content" style={{ textDecoration: 'none' }}>
          <li className="flex items-center p-4 hover:bg-gray-200 cursor-pointer">
            <i className="bi bi-file-earmark-text"></i>
            <span className="ml-2">Content</span>
          </li>
        </Link>
        <Link to="/admin/settings" style={{ textDecoration: 'none' }}>
          <li className="flex items-center p-4 hover:bg-gray-200 cursor-pointer">
            <i className="bi bi-gear-fill"></i>
            <span className="ml-2">Settings</span>
          </li>
        </Link>
        <Link to="/landing" style={{ textDecoration: 'none' }}>
          <li className="flex items-center p-4 hover:bg-gray-200 cursor-pointer">
            <i className="bi bi-box-arrow-right"></i>
            <span className="ml-2">Sign Out</span>
          </li>
        </Link>
      </ul>
    </div>
  );
}
