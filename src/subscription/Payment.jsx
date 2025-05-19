import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/components/authContext';
import { useEditAdminSettings } from '../hooks/useEditAdminSettings';
import Loading from '../components/Loading';
import { authControl } from '../auth/components/authControl';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { membershipPlan } = useAuth();
  const { subscriptionPlans, isLoading: isLoadingPlans } = useEditAdminSettings();
  const { logout } = authControl();
  const [isNavigating, setIsNavigating] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const planId = queryParams.get('plan');

  const selectedPlan = subscriptionPlans ? subscriptionPlans.find((plan) => plan.id === planId) : null;

  const price = selectedPlan ? (selectedPlan.price === 0 ? 'Free' : `₱${selectedPlan.price} / month`) : 'Unknown Plan';
  const planName = selectedPlan ? selectedPlan.plan : 'Unknown Plan';

  const navigateToPayment = async (membershipPlan, method) => {
    setIsNavigating(true);
    // Add a small delay to ensure loading screen shows
    await new Promise(resolve => setTimeout(resolve, 500));
    navigate(`/${method}?plan=${encodeURIComponent(membershipPlan)}&method=${encodeURIComponent(method)}`);
  };

  const handleSignOut = async () => {
    setIsNavigating(true);
    try {
      // Add a small delay to ensure loading screen shows
      await new Promise(resolve => setTimeout(resolve, 500));
      await logout();
    } catch (error) {
      console.error("Error signing out:", error.message);
      setIsNavigating(false);
    }
  };

  if (isLoadingPlans || isNavigating) {
    return <Loading />;
  }

  return (
    <section className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200">
      <div className="container mx-auto px-4 py-6">
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

        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 bg-gradient-to-r from-[#161647] to-[#3535AD] bg-clip-text text-transparent">
          Complete Your Payment
        </h1>

        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">You have selected the {planName}</h2>
            <div className="inline-block bg-gray-50 px-4 py-2 rounded-full mb-3">
              <p className="text-lg">Payment Amount: <span className="font-bold text-[#161647]">{price}</span></p>
            </div>
            <p className="text-gray-600 max-w-xl mx-auto text-sm">
              Your payment is encrypted, and you can change how you pay anytime.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-5 text-center text-gray-800">Choose how to pay</h2>

            <button
              onClick={() => navigateToPayment(planId, 'creditdebit')}
              className="flex items-center justify-between w-full p-4 bg-white rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-[#161647] hover:shadow-md"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#161647] rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <span className="text-lg font-medium text-gray-800">Credit or Debit Card</span>
              </div>
              <div className="flex items-center space-x-4">
                <img src="src/assets/visa.png" alt="Visa" className="w-8 h-8 object-contain" />
                <img src="src/assets/mastercard.png" alt="Mastercard" className="w-8 h-8 object-contain" />
              </div>
            </button>

            <button
              onClick={() => navigateToPayment(planId, 'digitalwallet')}
              className="flex items-center justify-between w-full p-4 bg-white rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-[#161647] hover:shadow-md"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#161647] rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-lg font-medium text-gray-800">Digital Wallet</span>
              </div>
              <div className="flex items-center space-x-4">
                <img src="src/assets/gcash.png" alt="GCash" className="w-8 h-8 object-contain" />
                <img src="src/assets/paypal.png" alt="PayPal" className="w-8 h-8 object-contain" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
