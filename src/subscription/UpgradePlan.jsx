import React, { useState } from 'react';
import { useAuth } from '../auth/components/authContext';
import { useNavigate } from 'react-router-dom';
import { User, Settings, CreditCard, Shield } from 'lucide-react';

export default function Account() {
  const [activeTab, setActiveTab] = useState('profile');
  const { userData, membershipPlan } = useAuth();
  const navigate = useNavigate();

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5 mr-2" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5 mr-2" /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="w-5 h-5 mr-2" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-5 h-5 mr-2" /> },
  ];

  const content = {
    profile: (
      <div>
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <div className="space-y-2 text-gray-700">
          <p><strong>Name:</strong> {userData ? `${userData.firstName} ${userData.lastName}` : 'Loading...'}</p>
          <p><strong>Email:</strong> {userData ? userData.email : 'Loading...'}</p>
          <p><strong>Phone:</strong> {userData ? userData.contactNumber : 'Loading...'}</p>
        </div>
      </div>
    ),
    settings: (
      <div>
        <h2 className="text-xl font-semibold mb-4">Settings</h2>
        <ul className="text-gray-700 space-y-2">
          <li><strong>Email Notifications:</strong> Enabled</li>
          <li><strong>Dark Mode:</strong> Off</li>
          <li><strong>Language:</strong> English</li>
        </ul>
      </div>
    ),
    billing: (
      <div>
        <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
        <ul className="text-gray-700 space-y-2">
          <li><strong>Membership Plan:</strong> {membershipPlan?.plan || 'No plan selected'}</li>
          <li><strong>Price:</strong> {membershipPlan?.price ? `₱ ${membershipPlan.price}` : 'Free'}</li>
        </ul>
        <button
          onClick={() => navigate('/upgrade-plan')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Edit Plan
        </button>
      </div>
    ),
    security: (
      <div>
        <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
        <ul className="text-gray-700 space-y-2">
          <li><strong>Two-Factor Authentication:</strong> Enabled</li>
          <li><strong>Last Login:</strong> March 30, 2025, 10:30 AM</li>
          <li><strong>Password:</strong> Updated March 25, 2025</li>
        </ul>
      </div>
    ),
  };

  return (
    <section className="p-6 flex gap-6">
      {/* Sidebar Navigation */}
      <div className="w-1/4 bg-white shadow-md rounded-xl p-4">
        <h1 className="text-2xl font-bold mb-6">Account</h1>
        <nav className="space-y-3">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center w-full px-4 py-2 rounded-lg transition ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="w-3/4 bg-white shadow-md rounded-xl p-6 transition-all duration-300">
        {content[activeTab]}
      </div>
    </section>
  );
}
