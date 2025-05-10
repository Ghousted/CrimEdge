import React, { useState } from 'react';
import { useAuth } from '../auth/components/authContext';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const [activeTab, setActiveTab] = useState('profile'); // Default tab is 'profile'
  const { userData, membershipPlan } = useAuth();
  const navigate = useNavigate();
  console.log(membershipPlan);

  // Content for each tab
  const content = {
    profile: (
      <div>
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <p className="text-gray-700">Here you can view and edit your profile details.</p>
        <div className="mt-4">
          <div className="flex justify-between">
            <span className="font-medium">Name:</span>
            <span>{userData ? `${userData.firstName} ${userData.lastName}` : 'Loading...'}</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-medium">Email:</span>
            <span>{userData ? userData.email : 'Loading...'}</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-medium">Phone:</span>
            <span>{userData ? userData.contactNumber : 'Loading...'}</span>
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
            <span className="font-medium">Membership Plan:</span>
            <span>{membershipPlan ? membershipPlan.plan : 'No plan selected'}</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-medium">Price:</span>
            <span>{membershipPlan && membershipPlan.price ? `₱ ${membershipPlan.price}` : 'Free'}</span>
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
