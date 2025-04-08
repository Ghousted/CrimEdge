import '../index.css';
import { FiMenu } from 'react-icons/fi';
import 'bootstrap-icons/font/bootstrap-icons.css';
import logo from '../assets/CrimEdge.png';

export default function Header({ toggleSidebar }) {
  return (
    <div className="header">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="menu-toggle">
        <FiMenu className="menu-icon" onClick={toggleSidebar} />
      </div>
      
      <div className="ml-auto flex items-center search-container">
        <i className="bi bi-search mr-3 text-lg"></i>
        <input 
          type="text" 
          placeholder="Search" 
          className="search-bar px-4 py-1 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 sm:max-w-xs md:max-w-md lg:max-w-lg"
        />
      </div>
    </div>
  );
}
