import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHandleUserMembership } from './components/handleUserSubscription';
import { useEditAdminSettings } from '../hooks/useEditAdminSettings';

export default function Membership() {
  useEffect(() => {
    document.body.style.background = "radial-gradient(circle, rgba(225,238,254,1) 0%, rgba(90,110,201,1) 100%)";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflowX = "hidden";
  }, []);

  const { captureMembershipPlan } = useHandleUserMembership();
  const { subscriptionPlans } = useEditAdminSettings();
  const navigate = useNavigate();

  const navigateToPayment = (planId) => {
    const selectedPlan = subscriptionPlans ? subscriptionPlans.find((plan) => plan.id === planId) : null;
    const planName = selectedPlan ? selectedPlan.plan : 'Unknown Plan';
    captureMembershipPlan(planName);
    navigate(`/payment?plan=${encodeURIComponent(planId)}`);
  };

  return (
    <section className="p-6 flex flex-col items-center">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center w-full rounded-lg mb-10 px-4 md:px-20">
        <img src="src/assets/CrimEdge.png" alt="Logo" className="w-35 h-12 mb-4 md:mb-0" />
        <Link to="/landing">
          <button className="bg-white text-black px-5 py-1 rounded-full hover:bg-blue-700">Sign Out</button>
        </Link>
      </div>

      <div
        className="page-title mb-4 text-2xl font-bold"
        style={{
          background: 'linear-gradient(to right, #161647, #3535AD)',
          WebkitBackgroundClip: 'text',
          color: 'transparent'
        }}
      >
        Membership Plans
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {subscriptionPlans && subscriptionPlans.length > 0 ? (
          subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className="plan p-4 rounded-lg shadow-md bg-white text-center cursor-pointer transition-transform transform hover:scale-105"
              onClick={() => navigateToPayment(plan.id)}
            >
              <div
                className="mb-2 text-lg font-semibold text-white rounded-lg py-1"
                style={{
                  background: 'linear-gradient(to right, #161647, #3535AD)',
                }}
              >
                {plan.plan}
              </div>
              <div className="price mb-4 text-gray-600">
                {plan.price === 0 ? 'Free' : `₱${plan.price} / month`}
              </div>
              <div className="features mb-4 text-gray-700 text-left px-4">
                <ul className="list-disc pl-5 space-y-2">
                  {plan.features && plan.features.length > 0 ? (
                    plan.features.map((feature, index) => (
                      <li key={index}>
                        {feature}
                      </li>
                    ))
                  ) : (
                    <li>No features listed</li>
                  )}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <div>No membership plans available.</div>
        )}
      </div>
    </section>
  );
}
