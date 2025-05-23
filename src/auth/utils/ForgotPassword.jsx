import React, { useState } from 'react';

const ForgotPasswordModal = ({ show, onClose }) => {
  const [email, setEmail] = useState('');

  if (!show) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle forgot password logic
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md text-center">
        <div className="border-b border-gray-200 p-4 bg-gray-100 rounded-t-xl flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Forgot Password</h2>
          <button
            onClick={onClose}
            className="text-3xl text-gray-500 hover:text-gray-700 cursor-pointer transition-all duration-200"
          >
            &times;
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-4 text-justify">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              Send Reset Link
            </button>
          </form>
        
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
