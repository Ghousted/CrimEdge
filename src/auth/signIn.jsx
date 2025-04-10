import React, { useState } from 'react';
import { useAuth } from '../auth/components/authContext';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signInWithGoogle, authError, setAuthError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    try {
      await signIn(email, password);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In to CrimEdge</h2>
        
        {authError && (
          <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p>{authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={handleGoogleSignIn}
            className="w-full py-2 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <FcGoogle className="text-xl mr-2" />
            Sign in with Google
          </button>
        </div>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button 
              onClick={() => navigate('/signup')}
              className="text-blue-600 hover:underline"
            >
              Sign up
            </button>
          </p>
          <button 
            onClick={() => navigate('/forgot-password')}
            className="mt-2 text-blue-600 hover:underline text-sm"
          >
            Forgot password?
          </button>
        </div>
      </div>
    </section>
  );
}