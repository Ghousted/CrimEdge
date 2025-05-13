import React, { useState } from 'react';
import { useAuth } from '../auth/components/authContext';
import { useEditAdminSettings } from '../hooks/useEditAdminSettings';
import { useNavigate } from 'react-router-dom';
import { useHandleUserMembership } from '../hooks/handleUserSubscription';
import { User, Settings, CreditCard, Shield, ArrowLeft, CheckCircle2 } from 'lucide-react';

const UpgradePlan = () => {
  const { userData, membershipPlan } = useAuth();
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
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-6xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <h1 className="text-3xl font-medium bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Upgrade Your Plan
          </h1>
        </div>

        <section className="mb-6">
          <h2 className="text-2xl font-medium mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            Current Plan
          </h2>
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-2xl font-bold text-blue-800">{membershipPlan.plan}</p>
              <div className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium">
                Active
              </div>
            </div>
            <ul className="space-y-1">
              {subscriptionPlans.find(plan => plan.plan === membershipPlan.plan)?.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-700">
                 
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-medium mb-4 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-blue-600" />
            Available Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {otherPlans.filter(plan => plan.plan).map((plan) => (
              <div
                key={plan.plan}
                className={`relative rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                  selectedPlan?.plan === plan.plan 
                    ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-500 shadow-xl scale-105' 
                    : 'bg-white border border-gray-200 hover:shadow-lg hover:scale-102'
                }`}
                onClick={() => setSelectedPlan(plan)}
              >
                <div className="absolute -top-3 -right-3">
                  {selectedPlan?.plan === plan.plan && (
                    <div className="bg-blue-600 text-white rounded-full p-2">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-semibold mb-1 text-gray-800">
                  {plan.plan === 'Free' ? 'Cancel Membership' : plan.plan}
                </h3>
                {plan.plan !== 'Free' && (
                  <p className="text-2xl font-bold text-blue-600 mb-2">{plan.price}</p>
                )}
                <ul className="space-y-2 mt-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-600">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-col gap-6">
          <button
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors w-fit"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          {selectedPlan && (
            <div className="p-6 border rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center gap-2 mb-4">
       
                <h2 className="text-2xl font-semibold text-blue-800">Selected Plan: {selectedPlan.plan}</h2>
              </div>
              <ul className="space-y-3 mb-6">
                {selectedPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700">
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                onClick={handleUpdatePlan}
              >
                Confirm Update Payment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpgradePlan;