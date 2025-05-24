import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../auth/components/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { authControl } from '../../auth/components/authControl';
import ReviewHubLogo from '../../assets/ReviewHub.png';
import { useDarkMode } from '../../components/DarkModeContext';

export default function InstructorHeader() {
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
        <header className={`w-full h-[60px] flex items-center justify-between border-b px-5 fixed top-0 left-0 z-50 ${darkMode ? 'bg-[#242526] border-gray-700' : 'bg-[#f5f5f5] border-gray-300'}`}>

      {/* Left: Logo */}
      <div className="flex items-center gap-[18px]">
        <Link to="/dashboard" className="no-underline">
          <span className={`font-bold text-3xl font-sans tracking-[-2px] flex items-center cursor-pointer
            ${darkMode ? 'text-white' : 'text-[#2d2f31]'}`}>
            <img src={ReviewHubLogo} alt="Logo" className="w-40 mb-2" />
          </span>
        </Link>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 flex justify-center items-center">
        <div className="relative w-[60%] max-w-[600px]">
          <i className={`bi bi-search absolute left-[18px] top-1/2 -translate-y-1/2 text-lg
            ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}></i>
          <input
            type="text"
            placeholder="Find expert-led courses to boost your career"
            className={`w-full py-2 px-[18px] pl-11 rounded-xl border text-sm outline-none transition-colors duration-200
              ${darkMode ? 'border-gray-600 bg-[#242526] text-white placeholder-gray-400' : 'border-[#d1d7dc] bg-[#f7f9fa] text-black placeholder-gray-500'}`}
          />
        </div>
      </div>

      {/* Right: Icons and Dropdowns */}
      <div className="flex items-center gap-[18px]">
        {/* Notification Bell */}
        <div ref={notifRef} className="relative">
          <i
            className={`bi bi-bell text-2xl cursor-pointer
              ${darkMode ? 'text-white' : 'text-[#2d2f31]'}`}
            onClick={() => setNotifOpen((open) => !open)}
          ></i>
          {notifOpen && (
            <div className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg z-50 border py-3
              ${darkMode ? 'border-gray-600 bg-[#242526] text-white' : 'border-gray-100 bg-white text-[#2d2f31]'}`}>
              <div className={`font-semibold px-[18px] pb-2 border-b
                ${darkMode ? 'border-gray-600' : 'border-gray-100'}`}>Notifications</div>
              {notifications.length === 0 ? (
                <div className={`p-[18px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No notifications</div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className={`p-[10px] px-[18px] text-[15px] border-b
                    ${darkMode ? 'border-gray-600 text-white' : 'border-gray-100 text-[#2d2f31]'}`}>{n.text}</div>
                ))
              )}
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setDropdownOpen((open) => !open)}>
            <div className="flex items-center justify-center bg-[#a435f0] text-white rounded-full w-9 h-9 font-bold text-lg">
              {initials || 'U'}
            </div>
            <div className="flex items-center gap-1">
              <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-[#2d2f31]'}`}>{name}</span>
              <i className={`bi bi-chevron-down text-sm transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}
                ${darkMode ? 'text-white' : 'text-[#2d2f31]'}`}></i>
            </div>
          </div>
          {dropdownOpen && (
            <div className={`absolute right-0 mt-2 w-[280px] rounded-lg shadow-lg z-50 border
              ${darkMode ? 'border-gray-600 bg-[#242526] text-white' : 'border-gray-100 bg-white text-[#2d2f31]'}`}>
              <div className={`flex items-center p-4 border-b
                ${darkMode ? 'border-gray-600' : 'border-gray-100'}`}>
                <div className="bg-[#a435f0] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-[22px] mr-3">
                  {initials || 'U'}
                </div>
                <div>
                  <div className="font-semibold">{name}</div>
                  <div className="text-sm text-gray-500">{email}</div>
                </div>
              </div>
              <ul className="m-0 p-0 list-none">
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
                  <li>
                  <button
                    onClick={handleLogout}
                    className={`w-full text-sm text-left px-4 py-2 hover:rounded-b-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
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
