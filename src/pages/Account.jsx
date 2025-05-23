import React, { useState } from 'react';
import { useAuth } from '../auth/components/authContext';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../components/DarkModeContext'; // Import dark mode hook

export default function Account() {
  const [activeTab, setActiveTab] = useState('profile'); // Default tab
  const { userData, membershipPlan } = useAuth();
  const navigate = useNavigate();
  const { darkMode } = useDarkMode(); // Get dark mode state

  // Content for each tab with conditional text colors
  const content = {
    profile: (
      <div>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
          Profile Information
        </h2>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Here you can view and edit your profile details.
        </p>
        <div className="mt-4">
          <div className="flex justify-between">
            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Name:</span>
            <span className={`${darkMode ? 'text-gray-300' : ''}`}>
              {userData ? `${userData.firstName} ${userData.lastName}` : 'Loading...'}
            </span>
          </div>
          <div className="flex justify-between mt-2">
            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Email:</span>
            <span className={`${darkMode ? 'text-gray-300' : ''}`}>
              {userData ? userData.email : 'Loading...'}
            </span>
          </div>
          <div className="flex justify-between mt-2">
            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Phone:</span>
            <span className={`${darkMode ? 'text-gray-300' : ''}`}>
              {userData ? userData.contactNumber : 'Loading...'}
            </span>
          </div>
        </div>
      </div>
    ),
    settings: (
      <div>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
          Settings
        </h2>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Adjust your preferences below.
        </p>
        <div className="mt-4">
          <div className="flex justify-between">
            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Email Notifications:</span>
            <span className={`${darkMode ? 'text-gray-300' : ''}`}>Enabled</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Language:</span>
            <span className={`${darkMode ? 'text-gray-300' : ''}`}>English</span>
          </div>
        </div>
      </div>
    ),
    billing: (
      <div>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
          Billing Information
        </h2>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          View and manage your billing details below.
        </p>
        <div className="mt-4">
          <div className="flex justify-between">
            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Membership Plan:</span>
            <span className={`${darkMode ? 'text-gray-300' : ''}`}>
              {membershipPlan ? membershipPlan.plan : 'No plan selected'}
            </span>
          </div>
          <div className="flex justify-between mt-2">
            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Price:</span>
            <span className={`${darkMode ? 'text-gray-300' : ''}`}>
              {membershipPlan && membershipPlan.price ? `₱ ${membershipPlan.price}` : 'Free'}
            </span>
          </div>
          <div className="mt-4">
            <button
              onClick={() => navigate('/upgrade-plan')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit Plan
            </button>
          </div>
        </div>
      </div>
    ),
    security: (
      <div>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
          Security Settings
        </h2>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Manage your account's security settings.
        </p>
        <div className="mt-4">
          <div className="flex justify-between">
            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Two-Factor Authentication:</span>
            <span className={`${darkMode ? 'text-gray-300' : ''}`}>Enabled</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Last Login:</span>
            <span className={`${darkMode ? 'text-gray-300' : ''}`}>March 30, 2025, 10:30 AM</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Password:</span>
            <span className={`${darkMode ? 'text-gray-300' : ''}`}>Updated March 25, 2025</span>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <section className={`p-6 flex `}>
      {/* Sidebar Navigation */}
      <div
        className={`w-1/4 shadow-md rounded-lg p-4 mr-6 ${
          darkMode ? 'bg-[#242526] text-gray-200' : 'bg-white text-gray-700 shadow-md'
        }`}
      >
        <div className="page-title mb-4 text-2xl">
          <span className={darkMode ? 'text-gray-200' : 'text-gray-900'}>Account</span>
        </div>

        <div className="flex flex-col gap-4">
          {['profile', 'settings', 'billing', 'security'].map((tab) => (
            <a
              href="#"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-lg hover:text-blue-500 transition duration-200 ${
                activeTab === tab
                  ? 'text-blue-500'
                  : darkMode
                  ? 'text-gray-300'
                  : 'text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </a>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div
        className={`w-3/4 shadow-md rounded-lg p-4 ${
          darkMode ? 'bg-[#242526] text-gray-200' : 'bg-white text-gray-900 shadow-md'
        }`}
      >
        <div className="page-title mb-4 text-2xl">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </div>
        <div>{content[activeTab]}</div>
      </div>
    </section>
  );
}
