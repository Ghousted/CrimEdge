import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useEditAdminSettings } from '../hooks/useEditAdminSettings';
import { useHandleUserMembership } from '../hooks/handleUserSubscription';
import { useAuth } from '../auth/components/authContext';
import { authControl } from '../auth/components/authControl';
import Loading from '../components/Loading';

export default function DigitalWallet() {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshUserData } = useAuth();
  const { subscriptionPlans } = useEditAdminSettings();
  const { subscriptionStatus } = useHandleUserMembership();
  const { logout } = authControl();

  const [plan, setPlan] = useState('');
  const [price, setPrice] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set the background styling
   
    const queryParams = new URLSearchParams(location.search);
    const planId = queryParams.get('plan');
    const paymentMethod = queryParams.get('method');

    const selectedPlan = subscriptionPlans ? subscriptionPlans.find((p) => p.id === planId) : null;

    if (selectedPlan) {
      setPlan(selectedPlan.plan);
      setPrice(selectedPlan.price === 0 ? 'Free' : `₱${selectedPlan.price}/month`);
    } else {
      setPlan('Unknown Plan');
      setPrice('Unknown Price');
    }

    console.log(`Selected payment method: ${paymentMethod}`);

    // Cleanup function to reset styles when component is unmounted
    return () => {
      document.body.style.background = ''; // Reset to default background
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflowX = '';
    };
  }, [location.search, subscriptionPlans]);

  const handleStartMembership = async () => {
    setIsLoading(true);
    try {
      await subscriptionStatus(true);
      await refreshUserData(); // Refresh user data after updating membership status
      console.log(`Starting ${plan} membership with payment of ${price}`);
      // Add a small delay to ensure loading screen shows
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate('/dashboard');
    } catch (error) {
      console.error('Error starting membership:', error);
      setIsLoading(false);
    }
  };

  const handleChangePlan = async () => {
    setIsLoading(true);
    try {
      // Add a small delay to ensure loading screen shows
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate('/membership');
    } catch (error) {
      console.error("Error changing plan:", error);
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      // Add a small delay to ensure loading screen shows
      await new Promise(resolve => setTimeout(resolve, 500));
      await logout();
    } catch (error) {
      console.error("Error signing out:", error.message);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <section className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200">
      <div className='container mx-auto px-4 py-6 max-w-5xl'>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
          <img
            src="src/assets/ReviewHub.png"
            alt="Logo"
            className="w-40 h-14 object-contain mb-4 sm:mb-0"
          />
          <button
            className="bg-[#161647] text-white px-6 py-2 rounded-full hover:bg-[#3535AD] transition-colors duration-300 shadow-md"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg transform hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Set up your digital wallet</h2>
            
            <div className="flex flex-col items-center mb-6">
              <div className="flex gap-6 justify-center items-center mb-4">
                <div className="flex flex-col items-center group">
                  <img 
                    src="src/assets/gcash.png" 
                    alt="GCash" 
                    className="w-12 h-12 mb-1 transform group-hover:scale-110 transition-transform duration-300" 
                  />
                  <span className="text-xs text-gray-600">GCash</span>
                </div>
                <div className="flex flex-col items-center group">
                  <img 
                    src="src/assets/paypal.png" 
                    alt="Paypal" 
                    className="w-12 h-12 mb-1 transform group-hover:scale-110 transition-transform duration-300" 
                  />
                  <span className="text-xs text-gray-600">PayPal</span>
                </div>
              </div>
              
              <div className="w-full relative">
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none text-base"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xl font-bold text-gray-800">{price}</span>
                <button 
                  onClick={handleChangePlan}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300 text-sm hover:underline"
                >
                  Change Plan
                </button>
              </div>
              <p className="text-base text-gray-600">{plan}</p>
            </div>

            <div className="mb-6">
              <label className="flex items-start space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  id="agree"
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors duration-300"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span className="text-xs text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                  By checking the checkbox below, you agree to CrimEdge's Terms of Use, Privacy Policy, and that you are over 18. CrimEdge will automatically renew your subscription ({price}) to your payment method until you cancel.
                  You may cancel anytime to avoid future charges.
                </span>
              </label>
            </div>

            <button
              onClick={handleStartMembership}
              disabled={!agreed}
              className={`w-full py-3 text-base font-semibold text-white rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 ${
                agreed 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Start Membership
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
