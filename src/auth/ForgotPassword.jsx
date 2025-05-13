import React, { useState, useEffect } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Set background color of body to white
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle forgot password logic
  };

  return (
    <section className="flex justify-center items-center min-h-screen p-4 bg-white">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Forgot Password</h2>
        <p className="text-gray-600 text-center mb-6">Enter your email address and we'll send you a link to reset your password.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
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
        <div className="text-center mt-6">
          <span className="text-gray-600">Remembered your password? </span>
          <a href="/signin" className="text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200">Sign In</a>
        </div>
      </div>
    </section>
  );
}
