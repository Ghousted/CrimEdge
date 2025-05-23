import '../../../index.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../auth/components/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { authControl } from '../../../auth/components/authControl';
import ReviewHubLogo from '../../../assets/ReviewHub.png';
import { useDarkMode } from '../../../components/DarkModeContext';

export default function AdminHeader({ toggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const { userData, currentUser } = useAuth();
  const navigate = useNavigate();
  const { logout } = authControl();
  const { darkMode, toggleDarkMode } = useDarkMode();

  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return '';
    if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
    return (firstName || lastName)[0].toUpperCase();
  };

  const initials = userData ? getInitials(userData.firstName, userData.lastName) : '';
  const name = userData ? `${userData.firstName} ${userData.lastName}` : 'Loading...';
  const email = userData ? userData.email : currentUser ? currentUser.email : 'Loading...';

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const notifications = [
    { id: 1, text: 'New student enrolled in your course.' },
    { id: 2, text: 'Your course was approved.' },
    { id: 3, text: 'You have a new message.' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/landing');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header
      className={`w-full h-[70px] flex items-center justify-between border-b px-5 fixed top-0 left-0 z-50
        ${darkMode ? 'bg-[#18191A] border-gray-700' : 'bg-white border-gray-200'}`}
    >
      {/* Left: Hamburger + Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className={`text-3xl cursor-pointer select-none
            ${darkMode ? 'text-white' : 'text-[#2d2f31]'}
            hover:text-gray-500 focus:outline-none`}
          aria-label="Toggle sidebar"
        >
          &#9776;
        </button>
        <Link to="/dashboard" className="no-underline">
          <img src={ReviewHubLogo} alt="Logo" className="w-40 mb-2" />
        </Link>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 flex justify-center items-center">
        <div className="relative w-[60%] max-w-[600px]">
          <i className="bi bi-search absolute left-[18px] top-1/2 -translate-y-1/2 text-gray-500 text-lg"></i>
          <input
            type="text"
            placeholder="Find expert-led courses to boost your career"
            className={`w-full py-2.5 px-[18px] pl-11 rounded-3xl border
              ${darkMode ? 'border-gray-600 bg-[#242526] text-white placeholder-gray-400' : 'border-[#d1d7dc] bg-[#f7f9fa] text-black placeholder-gray-500'}
              text-base outline-none transition-colors duration-200`}
          />
        </div>
      </div>

      {/* Right: Notifications + User Dropdown */}
      <div className="flex items-center gap-[18px]">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative cursor-pointer"
            aria-label="Toggle notifications"
          >
            <i
              className={`bi bi-bell text-xl
              ${darkMode ? 'text-white' : 'text-gray-700'}
              hover:text-gray-500`}
            ></i>
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
            )}
          </button>
          {notifOpen && (
            <div
              className={`absolute right-0 mt-2 w-64 max-h-72 overflow-auto rounded-md border
                ${darkMode ? 'border-gray-600 bg-[#242526]' : 'border-gray-300 bg-white'} shadow-lg z-50`}
            >
              <ul className="divide-y divide-gray-300">
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-300
                      ${darkMode ? 'hover:bg-gray-700 text-white' : 'text-gray-700'}`}
                  >
                    {notif.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center gap-2 rounded-full border-2 border-gray-400 p-1 hover:shadow-lg cursor-pointer
              ${darkMode ? 'border-gray-600' : 'border-gray-400'}`}
            aria-label="User menu"
          >
            <div
              className="rounded-full w-8 h-8 flex items-center justify-center bg-gray-400 text-white uppercase font-semibold"
              title={name}
            >
              {initials || 'NA'}
            </div>
            <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-[#2d2f31]'}`}>
              {name}
            </span>
          </button>

          {dropdownOpen && (
            <div
              className={`absolute right-0 mt-2 w-64 rounded-md border shadow-lg
                ${darkMode ? 'border-gray-600 bg-[#242526] text-white' : 'border-gray-300 bg-white text-gray-900'}`}
            >
              <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                <p className="text-sm font-semibold">{name}</p>
                <p className="text-xs text-gray-500 truncate">{email}</p>
              </div>
              <ul>
                <li className={`px-4 py-2 flex items-center justify-between border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                  <span className="text-sm font-medium">Dark mode</span>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={toggleDarkMode}
                        className="sr-only peer"
                      />
                      <div className={`w-9 h-5 rounded-full transition-colors duration-200 ${darkMode ? 'bg-[#5a5a5a]' : 'bg-gray-300'}`}></div>
                      <div
                        className={`absolute left-1 top-1 w-3 h-3 rounded-full bg-white shadow-md transition-transform duration-200 flex items-center justify-center
                          ${darkMode ? 'translate-x-4' : ''}`}
                      >
                        {darkMode ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-[#5a5a5a]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 18a6 6 0 100-12 6 6 0 000 12zm0 2a8 8 0 100-16 8 8 0 000 16zm0-18a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm0 16a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zm9-7a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zm-16 0a1 1 0 01-1 1H2a1 1 0 110-2h2a1 1 0 011 1zm11.657-5.657a1 1 0 010 1.414L17.414 8.5a1 1 0 11-1.414-1.414l1.243-1.243a1 1 0 011.414 0zm-11.314 11.314a1 1 0 010-1.414L6.586 15.5a1 1 0 111.414 1.414l-1.243 1.243a1 1 0 01-1.414 0zM17.414 17.5a1 1 0 011.414 0l1.243 1.243a1 1 0 01-1.414 1.414l-1.243-1.243a1 1 0 010-1.414zM6.586 8.5a1 1 0 01-1.414 0L3.93 7.257a1 1 0 111.414-1.414L6.586 8.5z" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </label>
                </li>
                <li className={`border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                  <Link
                    to="/admin/settings"
                    className={`block px-4 py-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <i className='bi bi-gear-fill mr-2'></i><span>Settings</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className={`w-full text-left px-4 py-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                  >
                    <i className="bi bi-box-arrow-right mr-2"></i><span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
