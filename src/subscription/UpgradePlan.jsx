import React, { useState } from 'react';
import { useAuth } from '../auth/components/authContext';
import { useEditAdminSettings } from '../hooks/useEditAdminSettings';
import { useNavigate } from 'react-router-dom';
import { useHandleUserMembership } from '../hooks/handleUserSubscription';


const UpgradePlan = () => {
  // Placeholder current plan - this will be dynamic later

  const { userData, membershipPlan, } = useAuth();
  const { subscriptionPlans } = useEditAdminSettings();
  const navigate = useNavigate();
  const { updateMembershipPlan } = useHandleUserMembership();

  const [selectedPlan, setSelectedPlan] = useState(null);

  const otherPlans = subscriptionPlans.filter(plan => plan.plan !== membershipPlan.plan);

  const handleUpdatePlan = async () => {
    console.log('Selected Plan:', selectedPlan);
    const plan = selectedPlan?.plan || 'Free';
    await updateMembershipPlan(plan);
    setSelectedPlan(null);
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md">
      <h1 className="text-3xl font-bold mb-6">Upgrade Your Plan</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Current Plan</h2>
        <div className="p-4 bg-blue-100 rounded">
          <p className="text-lg font-medium">{membershipPlan.plan}</p>
          <ul className="list-disc list-inside text-gray-600 mt-2">
            {subscriptionPlans.find(plan => plan.plan === membershipPlan.plan)?.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Other Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {otherPlans.filter(plan => plan.plan).map((plan) => (
            <div
              key={plan.plan}
              className={`border rounded p-4 cursor-pointer hover:shadow-lg transition-shadow ${selectedPlan?.plan === plan.plan ? 'border-blue-600 shadow-lg' : ''
                }`}
              onClick={() => setSelectedPlan(plan)}
            >
              <h3 className="text-lg font-bold mb-2">
                {plan.plan === 'Free' ? 'Cancel Membership' : plan.plan}
              </h3>
              {plan.plan !== 'Free' && (
                <p className="text-gray-700 mb-2">{plan.price}</p>
              )}
            </div>
          ))}
        </div>




        <button
          className="ml-4 px-6 py-3 bg-gray-400 text-white rounded hover:bg-gray-500"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
      </section>

      {selectedPlan && (
        <section className="mt-8 p-4 border rounded bg-green-50">
          <h2 className="text-xl font-semibold mb-2">Selected Plan: {selectedPlan.plan}</h2>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            {selectedPlan.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          <button
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => handleUpdatePlan()}
          >
            Confirm Update Payment
          </button>
        </section>
      )}
    </div>
  );
};

export default UpgradePlan;
