import '../../../index.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../auth/components/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { authControl } from '../../../auth/components/authControl';
import ReviewHubLogo from '../../../assets/ReviewHub.png';

export default function InstructorHeader() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const { userData, currentUser } = useAuth();
  const navigate = useNavigate();
  const { logout } = authControl();

  // Helper to get initials
  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return '';
    if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
    return (firstName || lastName)[0].toUpperCase();
  };

  const initials = userData ? getInitials(userData.firstName, userData.lastName) : '';
  const name = userData ? `${userData.firstName} ${userData.lastName}` : 'Loading...';
  const email = userData ? userData.email : currentUser ? currentUser.email : 'Loading...';

  // Close dropdowns when clicking outside
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

  // Dummy notifications for demonstration
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
    <header className="w-full h-[70px] flex items-center justify-between bg-white border-b border-gray-200 px-5 fixed top-0 left-0 z-50">
      {/* Left: Logo */}
      <div className="flex items-center gap-[18px]">
        <Link to="/dashboard" className="no-underline">
          <span className="font-bold text-3xl text-[#2d2f31] font-sans tracking-[-2px]  flex items-center cursor-pointer">
            <img src={ReviewHubLogo} alt="Logo" className="w-40 mb-2" />
          </span>
        </Link>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 flex justify-center items-center">
        <div className="relative w-[60%] max-w-[600px]">
          <i className="bi bi-search absolute left-[18px] top-1/2 -translate-y-1/2 text-gray-500 text-lg"></i>
          <input
            type="text"
            placeholder="Find expert-led courses to boost your career"
            className="w-full py-2.5 px-[18px] pl-11 rounded-3xl border border-[#d1d7dc] bg-[#f7f9fa] text-base outline-none transition-colors duration-200"
          />
        </div>
      </div>

      {/* Right: Icons and Dropdowns */}
      <div className="flex items-center gap-[18px]">
        {/* Notification Bell */}
        <div ref={notifRef} className="relative">
          <i
            className="bi bi-bell text-2xl text-[#2d2f31] cursor-pointer"
            onClick={() => setNotifOpen((open) => !open)}
          ></i>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border border-gray-100 py-3">
              <div className="font-semibold text-[#2d2f31] px-[18px] pb-2 border-b border-gray-100">Notifications</div>
              {notifications.length === 0 ? (
                <div className="p-[18px] text-gray-500">No notifications</div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className="p-[10px] px-[18px] text-[#2d2f31] text-[15px] border-b border-gray-100">{n.text}</div>
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
              <span className="text-[#2d2f31] font-medium text-sm">{name}</span>
              <i className={`bi bi-chevron-down text-[#2d2f31] text-sm transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}></i>
            </div>
          </div>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-[280px] bg-white rounded-lg shadow-lg z-50 border border-gray-100">
              <div className="flex items-center p-4 border-b border-gray-100">
                <div className="bg-[#a435f0] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-[22px] mr-3">
                  {initials || 'U'}
                </div>
                <div>
                  <div className="font-semibold text-[#2d2f31]">{name}</div>
                  <div className="text-sm text-gray-500">{email}</div>
                </div>
              </div>
              <ul className="m-0 p-0 list-none">
                <li className="p-[10px] px-[18px] cursor-pointer text-[#2d2f31] font-medium border-b border-gray-100">Account settings</li>
                <li
                  onClick={handleLogout}
                  className="px-[18px] py-2.5 cursor-pointer text-red-500 font-medium hover:bg-red-50 transition-colors duration-200"
                >
                  Sign out
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
