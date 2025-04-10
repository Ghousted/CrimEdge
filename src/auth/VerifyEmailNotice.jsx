import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiArrowRight } from 'react-icons/fi';

export default function VerifyEmailNotice() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <FiMail className="text-blue-600 text-2xl" />
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
        <p className="text-gray-600 mb-6">
          We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
        </p>
        
        <p className="text-gray-600 mb-6">
          Didn't receive the email? Check your spam folder or request a new verification link.
        </p>
        
        <button
          onClick={() => navigate('/signin')}
          className="flex items-center justify-center mx-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Sign In <FiArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
}