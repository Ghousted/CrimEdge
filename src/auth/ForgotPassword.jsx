import React, { useState, useEffect } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Set background color of body correctly here
    document.body.style.background = "radial-gradient(circle, rgba(225,238,254,1) 0%, rgba(90,110,201,1) 100%)";
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
    <section className="flex justify-center items-center h-screen p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">
            Reset Password
          </button>
        </form>
        <div className="text-center mt-4">
          <span>Remembered your password? </span>
          <a href="/sign-in" className="text-blue-500">Sign In</a>
        </div>
      </div>
    </section>
  );
}
