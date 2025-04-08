// CreditDebit Component
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function CreditDebit() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.background = "radial-gradient(circle, rgba(225,238,254,1) 0%, rgba(90,110,201,1) 100%)";
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

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="flex flex-col sm:flex-row justify-between items-center w-full rounded-lg mb-10 px-4 md:px-20">
        <img src="src/assets/CrimEdge.png" alt="Logo" className="w-35 h-12 mb-4 md:mb-0" />
        <button className="bg-white text-black px-5 py-1 rounded-full hover:bg-blue-700" onClick={() => navigate('/landing')}>
          Sign Out
        </button>
      </div>

      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Set up your credit or debit card</h2>
        <div className="flex flex-col items-center mb-6">
        <div className="flex justify-center items-center">
          <img src="src/assets/visa.png" alt="Visa" className="w-10 h-10 mb-4" />
          <img src="src/assets/mastercard.png" alt="Mastercard" className="w-10 h-10 mb-4" />
          </div>
          <input
            type="text"
            placeholder="Card number"
            className="w-full p-2 mb-2 border border-gray-300 rounded-md"
          />
          <div className="flex justify-between w-full mb-2">
            <input
              type="text"
              placeholder="Expiration date"
              className="w-1/2 p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="CVV"
              className="w-1/2 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <input
            type="text"
            placeholder="Name on card"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">{price}</span>
          <button className="text-blue-600 hover:underline">Change</button>
        </div>
        <p className="text-center mb-4">{plan} Plan</p>

        <div className="mb-4 text-justify">
          <input type="checkbox" id="agree" className="mr-2" />
          <label htmlFor="agree" className="text-sm">
            By checking the checkbox below, you agree to CrimEdge's Terms of Use, Privacy Policy, and that you are over 18.
            CrimEdge will automatically renew your subscription ({price}) to your payment method until you cancel.
            You may cancel anytime to avoid future charges.
          </label>
        </div>

        <button className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Start Membership
        </button>
      </div>
    </div>
  );
}