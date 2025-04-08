import React, { useState } from 'react';

export default function Account() {
  const [activeTab, setActiveTab] = useState('profile'); // Default tab is 'profile'

  // Content for each tab
  const content = {
    profile: (
      <div>
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <p className="text-gray-700">Here you can view and edit your profile details.</p>
        <div className="mt-4">
          <div className="flex justify-between">
            <span className="font-medium">Name:</span>
            <span>John Doe</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-medium">Email:</span>
            <span>johndoe@example.com</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-medium">Phone:</span>
            <span>(123) 456-7890</span>
          </div>
        </div>
      </div>
    ),
    settings: (
      <div>
        <h2 className="text-xl font-semibold mb-4">Settings</h2>
        <p className="text-gray-700">Adjust your preferences below.</p>
        <div className="mt-4">
          <div className="flex justify-between">
            <span className="font-medium">Email Notifications:</span>
            <span>Enabled</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-medium">Dark Mode:</span>
            <span>Off</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-medium">Language:</span>
            <span>English</span>
          </div>
        </div>
      </div>
    ),
    billing: (
      <div>
        <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
        <p className="text-gray-700">View and manage your billing details below.</p>
        <div className="mt-4">
          <div className="flex justify-between">
            <span className="font-medium">Billing Address:</span>
            <span>123 Main St, City, Country</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-medium">Payment Method:</span>
            <span>Visa **** 1234</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-medium">Last Payment:</span>
            <span>$99.99 - March 25, 2025</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-medium">Upcoming Payment:</span>
            <span>$99.99 - April 25, 2025</span>
          </div>
        </div>
      </div>
    ),
    security: (
      <div>
        <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
        <p className="text-gray-700">Manage your account's security settings.</p>
        <div className="mt-4">
          <div className="flex justify-between">
            <span className="font-medium">Two-Factor Authentication:</span>
            <span>Enabled</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-medium">Last Login:</span>
            <span>March 30, 2025, 10:30 AM</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-medium">Password:</span>
            <span>Updated March 25, 2025</span>
          </div>
        </div>
      </div>
    ),
    logout: (
      <div>
        <h2 className="text-xl font-semibold mb-4">Logout</h2>
        <p className="text-gray-700">Are you sure you want to log out?</p>
        <button className="mt-4 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200">
          Log Out
        </button>
      </div>
    ),
  };

  return (
    <section className='p-6 flex'>
      <div className="w-1/4 bg-white shadow-md rounded-lg p-4 mr-6">
        <div className="page-title mb-4 text-2xl">Account</div>
        
        {/* Account Navigation Links */}
        <div className="flex flex-col gap-4">
          <a
            href="#"
            onClick={() => setActiveTab('profile')}
            className={`text-lg ${activeTab === 'profile' ? 'text-blue-500' : 'text-gray-700'} hover:text-blue-500 transition duration-200`}
          >
            Profile
          </a>
          <a
            href="#"
            onClick={() => setActiveTab('settings')}
            className={`text-lg ${activeTab === 'settings' ? 'text-blue-500' : 'text-gray-700'} hover:text-blue-500 transition duration-200`}
          >
            Settings
          </a>
          <a
            href="#"
            onClick={() => setActiveTab('billing')}
            className={`text-lg ${activeTab === 'billing' ? 'text-blue-500' : 'text-gray-700'} hover:text-blue-500 transition duration-200`}
          >
            Billing
          </a>
          <a
            href="#"
            onClick={() => setActiveTab('security')}
            className={`text-lg ${activeTab === 'security' ? 'text-blue-500' : 'text-gray-700'} hover:text-blue-500 transition duration-200`}
          >
            Security
          </a>
          <a
            href="#"
            onClick={() => setActiveTab('logout')}
            className={`text-lg ${activeTab === 'logout' ? 'text-blue-500' : 'text-red-500'} hover:text-red-700 transition duration-200`}
          >
            Logout
          </a>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-3/4 bg-white shadow-md rounded-lg p-4">
        <div className="page-title mb-4 text-2xl">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</div>
        <div>{content[activeTab]}</div>
      </div>
    </section>
  );
}
