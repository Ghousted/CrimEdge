import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHandleUserMembership } from '../hooks/handleUserSubscription';
import { useEditAdminSettings } from '../hooks/useEditAdminSettings';
import { authControl } from '../auth/components/authControl';
import Loading from '../components/Loading';

export default function Membership() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.body.style.background = "#ffffff";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflowX = "hidden";
  }, []);

  const { captureMembershipPlan } = useHandleUserMembership();
  const { subscriptionPlans } = useEditAdminSettings();
  const navigate = useNavigate();
  const { logout } = authControl();

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      await logout();
    } catch (error) {
      console.error("Error signing out:", error.message);
      setIsLoading(false);
    }
  };

  const navigateToPayment = async (planId) => {
    setIsLoading(true);
    try {
      const selectedPlan = subscriptionPlans ? subscriptionPlans.find((plan) => plan.id === planId) : null;
      const planName = selectedPlan ? selectedPlan.plan : 'Unknown Plan';
      captureMembershipPlan(planName);
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate(`/payment?plan=${encodeURIComponent(planId)}`);
    } catch (error) {
      console.error("Error navigating to payment:", error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <section className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
          <img src="src/assets/ReviewHub.png" alt="Logo" className="w-40 h-14 object-contain mb-4 sm:mb-0" />
          <button 
            onClick={handleSignOut}
            className="bg-[#161647] text-white px-6 py-2 rounded-full hover:bg-[#3535AD] transition-colors duration-300 shadow-md"
          >
            Sign Out
          </button>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#161647] to-[#3535AD] bg-clip-text text-transparent">
          Choose Your Membership Plan
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {subscriptionPlans && subscriptionPlans.length > 0 ? (
            subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-100"
                onClick={() => navigateToPayment(plan.id)}
              >
                <div className="p-6">
                  <div className="bg-gradient-to-r from-[#161647] to-[#3535AD] text-white rounded-lg py-3 px-4 mb-6 text-xl font-semibold text-center">
                    {plan.plan}
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    {plan.price === 0 ? 'Free' : `₱${plan.price}`}
                    {plan.price !== 0 && <span className="text-lg font-normal text-gray-600">/month</span>}
                  </div>
                  <div className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features && plan.features.length > 0 ? (
                        plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="w-5 h-5 text-[#3535AD] mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500">No features listed</li>
                      )}
                    </ul>
                  </div>
                 
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-600 py-12">
              No membership plans available.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
