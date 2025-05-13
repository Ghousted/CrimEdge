import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authControl } from './components/authControl';
import ReviewHubLogo from '../assets/ReviewHub.png';

export default function SignUpPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = authControl();
  const navigate = useNavigate();

  useEffect(() => {
    // Set background color of body correctly here
    document.body.style.background = "#ffffff";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflowX = "hidden";

    // Cleanup on component unmount
    return () => {
      document.body.style.background = "";
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.overflowX = "";
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      setIsLoading(false);
      return;
    }

    if (!firstName || !lastName || !email || !contactNumber || !password) {
      alert('All fields are required!');
      setIsLoading(false);
      return;
    }

    try {
      await signUp({ email, confirmPassword, firstName, lastName, contactNumber });
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen p-2 bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-600 mb-1.5 group-focus-within:text-blue-600 transition-colors duration-200">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
                placeholder="John"
              />
            </div>
            <div className="group">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-600 mb-1.5 group-focus-within:text-blue-600 transition-colors duration-200">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
                placeholder="Doe"
              />
            </div>
          </div>
          <div className="group">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1.5 group-focus-within:text-blue-600 transition-colors duration-200">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
              placeholder="john.doe@example.com"
            />
          </div>
          <div className="group">
            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-600 mb-1.5 group-focus-within:text-blue-600 transition-colors duration-200">Contact Number</label>
            <input
              type="tel"
              id="contactNumber"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
              placeholder="+1234567890"
            />
          </div>
          <div className="group">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1.5 group-focus-within:text-blue-600 transition-colors duration-200">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
              placeholder="••••••••"
            />
          </div>
          <div className="group">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600 mb-1.5 group-focus-within:text-blue-600 transition-colors duration-200">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
              placeholder="••••••••"
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
                Creating Account...
              </span>
            ) : (
              'Sign Up'
            )}
          </button>
          <div className="text-center text-sm text-gray-600 space-y-3">
            <div>
              <span>Already have an account? </span>
              <button
                onClick={() => navigate('/signin')}
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline"
              >
                Sign In
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}