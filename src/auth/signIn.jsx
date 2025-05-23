import React, { useState } from 'react';
import { authControl } from './components/authControl';
import { useNavigate } from 'react-router-dom';
import ReviewHubLogo from '../assets/ReviewHub.png';
import Loading from '../components/Loading';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ForgotPasswordModal from './utils/ForgotPassword';
import VerifyEmailModal from './utils/VerifyEmailNotice';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const { signIn } = authControl();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      alert('All fields are required!');
      setIsLoading(false);
      return;
    }

    try {
      setIsSignedIn(true);
      await signIn({
        email,
        password,
        onSuccess: () => {
          return;
        }
      });
    } catch (error) {
      console.error('Sign in error:', error);
      setIsLoading(false);
      setIsSignedIn(false);
    }
  };

  if (isSignedIn) {
    return <Loading />;
  }

  return (
    <section className="flex justify-center items-center min-h-screen p-2 bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-xl border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
        <div className="flex justify-center mb-4">
          <button
            onClick={() => navigate('/')}
            className="focus:outline-none hover:opacity-90 transition-all duration-300 transform hover:scale-105"
          >
            <img src={ReviewHubLogo} alt="ReviewHub Logo" className="h-18 object-contain" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
              placeholder="Email address"
            />
          </div>
          <div className="group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-md`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...\r\n
              </span>
            ) : (
              'Sign In'
            )}
          </button>
          {/* Forgot password moved here */}
          <div className="text-center text-sm text-gray-600">
            <button
              onClick={() => setShowForgotPassword(true)}
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <div className="space-y-3">
            <button
              type="button"
              className="w-full py-2.5 bg-white text-gray-700 text-sm font-semibold rounded-xl border border-gray-400 hover:bg-gray-100 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center"
            >
              <i className="bi bi-google mr-2"></i>
              Continue with Google
            </button>
            <button
              type="button"
              className="w-full py-2.5 bg-blue-700 text-white text-sm font-semibold rounded-xl hover:bg-blue-800 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center"
            >
              <i className="bi bi-facebook mr-2"></i>
              Continue with Facebook
            </button>
          </div>
          <div className="text-center text-sm text-gray-600 space-y-3">
            <div>
              <span>Don't have an account? </span>
              <button
                onClick={() => navigate('/signup')}
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline"
              >
                Sign Up
              </button>
            </div>
          </div>
        </form>
      </div>
      <ForgotPasswordModal show={showForgotPassword} onClose={() => setShowForgotPassword(false)} />
      <VerifyEmailModal show={showVerifyEmail} onClose={() => setShowVerifyEmail(false)} />
    </section>
  );
}
