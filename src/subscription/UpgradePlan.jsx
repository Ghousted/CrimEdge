import React, { useState } from 'react';
import { useAuth } from '../auth/components/authContext';
import { useEditAdminSettings } from '../hooks/useEditAdminSettings';
import { useNavigate } from 'react-router-dom';
import { useHandleUserMembership } from '../hooks/handleUserSubscription';
import { User, Settings, CreditCard, Shield, ArrowLeft, CheckCircle2, Check } from 'lucide-react';
import { useDarkMode } from '../components/DarkModeContext'; // Import the useDarkMode hook

const UpgradePlan = () => {
  const { userData, membershipPlan } = useAuth();
  const { subscriptionPlans } = useEditAdminSettings();
  const navigate = useNavigate();
  const { updateMembershipPlan } = useHandleUserMembership();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { darkMode } = useDarkMode(); // Use the useDarkMode hook

  const otherPlans = subscriptionPlans.filter(plan => plan.plan !== membershipPlan.plan);

  const handleUpdatePlan = async () => {
    console.log('Selected Plan:', selectedPlan);
    const plan = selectedPlan?.plan || 'Free';
    await updateMembershipPlan(plan);
    setSelectedPlan(null);
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-8 ${darkMode ? 'bg-[#18191A]' : 'bg-[#F0F2F5]'}`}>
      <div className={`max-w-6xl w-full rounded-xl shadow-lg p-8 ${darkMode ? 'bg-[#242526] border border-[#3E4042] text-gray-200' : 'bg-white text-gray-800'}`}>
        <div className="flex items-center mb-6">
          <h1 className={`text-3xl font-bold`}>
            Upgrade your Plan
          </h1>
        </div>

        <section className="mb-6">
          <h2 className="text-2xl font-medium mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            Current Plan
          </h2>
          <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200'}`}>
            <div className="flex items-center justify-between mb-2">
<p className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>
  {membershipPlan.plan}
</p>
              <div className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium">
                Active
              </div>
            </div>
            <ul className="space-y-1">
              {subscriptionPlans.find(plan => plan.plan === membershipPlan.plan)?.features.map((feature, index) => (
                <li key={index} className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Check className="w-4 h-4 text-blue-500" />
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
            {otherPlans.filter(plan => plan.plan).map((plan) => {
              const isSelected = selectedPlan?.plan === plan.plan;
              return (
                <div
                  key={plan.plan}
                  className={`relative rounded-xl p-6 cursor-pointer transition-all duration-300
                    ${isSelected
                      ? darkMode
                        ? 'bg-blue-900 border-2 border-blue-500 shadow-[0_0_15px_3px_rgba(35,116,225,0.7)] scale-105'
                        : 'bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-500 shadow-xl scale-105'
                      : darkMode
                        ? 'bg-gray-700 border border-gray-600 hover:shadow-lg hover:scale-[1.02]'
                        : 'bg-white border border-gray-200 hover:shadow-lg hover:scale-[1.02]'
                    }
                  `}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <div className="absolute -top-3 -right-3">
                    {isSelected && (
                      <div className="bg-blue-600 text-white rounded-full p-2">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <h3 className={`text-2xl font-semibold mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {plan.plan === 'Free' ? 'Cancel Membership' : plan.plan}
                  </h3>
                  {plan.plan !== 'Free' && (
                    <p className={`text-lg font-medium text-blue-600`}>
                      {plan.price}
                    </p>
                  )}
                  <ul className="space-y-2 mt-4">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                      >
                        {isSelected && <Check className="w-4 h-4 text-blue-500" />}
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        <div className="flex flex-col gap-6">
          <button
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors w-fit
              ${darkMode
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          {selectedPlan && (
            <div className={`p-6 rounded-xl border
              ${darkMode
                ? 'bg-gray-800 border-blue-700 text-blue-300'
                : 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-800'}`}>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-2xl font-semibold">
                  Selected Plan: {selectedPlan.plan}
                </h2>
              </div>
             <ul className="space-y-3 mb-6">
              {selectedPlan.features.map((feature, index) => (
                <li
                  key={index}
                  className={`flex items-center gap-2 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}
                >
                  <Check className="w-5 h-5" />
                  {feature}
                </li>
              ))}
            </ul>

              <button
                className={`w-full px-8 py-4 rounded-lg font-semibold shadow-lg transition-all duration-300
                  ${darkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl'
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl'}`}
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
