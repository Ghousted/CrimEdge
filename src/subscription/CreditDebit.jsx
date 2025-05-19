// CreditDebit Component
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authControl } from '../auth/components/authControl';
import Loading from '../components/Loading';

export default function CreditDebit() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = authControl();
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set the background styling
    document.body.style.background = "linear-gradient(to bottom right, #f9fafb, #ffffff, #f0f9ff)";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflowX = "hidden";

    return () => {
      document.body.style.background = "";
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.overflowX = "";
    };
  }, []);

  const queryParams = new URLSearchParams(location.search);
  const plan = queryParams.get('plan');

  const getPriceForPlan = (plan) => {
    switch(plan) {
      case 'Free Tier':
        return 'Free';
      case 'Basic Tier':
        return '₱2,000/month';
      case 'Premium Tier':
        return '₱5,000/month';
      default:
        return 'Unknown Plan';
    }
  };

  const price = getPriceForPlan(plan);

  const handleStartMembership = async () => {
    setIsLoading(true);
    try {
      // Add your membership start logic here
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
      <div className="container mx-auto px-4 py-6 max-w-5xl">
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
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Set up your credit or debit card</h2>
            
            <div className="flex flex-col items-center mb-6">
              <div className="flex gap-6 justify-center items-center mb-4">
                <div className="flex flex-col items-center group">
                  <img 
                    src="src/assets/visa.png" 
                    alt="Visa" 
                    className="w-12 h-12 mb-1 transform group-hover:scale-110 transition-transform duration-300" 
                  />
                  <span className="text-xs text-gray-600">Visa</span>
                </div>
                <div className="flex flex-col items-center group">
                  <img 
                    src="src/assets/mastercard.png" 
                    alt="Mastercard" 
                    className="w-12 h-12 mb-1 transform group-hover:scale-110 transition-transform duration-300" 
                  />
                  <span className="text-xs text-gray-600">Mastercard</span>
                </div>
              </div>
              
              <div className="w-full space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Card number"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none text-base"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Expiration date"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none text-base"
                    />
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="CVV"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none text-base"
                    />
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Name on card"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none text-base"
                  />
                </div>
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
              <p className="text-base text-gray-600">{plan} Plan</p>
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