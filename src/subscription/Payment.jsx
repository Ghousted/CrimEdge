// Payment Component
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.background = "radial-gradient(circle, rgba(225,238,254,1) 0%, rgba(90,110,201,1) 100%)";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflowX = "hidden";
  }, []);

  const queryParams = new URLSearchParams(location.search);
  const plan = queryParams.get('plan');
  
  const planPricing = {
    "Free Tier": "Free",
    "Basic Tier": "₱2,000 / month",
    "Premium Tier": "₱5,000 / month"
  };

  const price = planPricing[plan] || "Unknown Plan";

  const navigateToPayment = (plan, method) => {
    navigate(`/${method}?plan=${encodeURIComponent(plan)}&method=${encodeURIComponent(method)}`);
  };

  return (
    <section className="p-6 flex flex-col items-center">
      <div className="flex flex-col sm:flex-row justify-between items-center w-full rounded-lg mb-10 px-4 md:px-20">
        <img src="src/assets/CrimEdge.png" alt="Logo" className="w-35 h-12 mb-4 md:mb-0" />
        <button className="bg-white text-black px-5 py-1 rounded-full hover:bg-blue-700" onClick={() => navigate('/landing')}>
          Sign Out
        </button>
      </div>

      <div className="text-center mb-5">
        <h2 className="text-2xl font-semibold mb-2">You have selected the {plan} plan</h2>
        <p className="mb-2">Payment Amount: <span className="font-bold">{price}</span></p>
        <p className="mb-5">Your payment is encrypted, and you can change how you pay anytime.</p>
      </div>

      <div className="w-full max-w-lg p-6 rounded-lg">
        <h2 className="text-3xl font-semibold mb-5 text-center">Choose how to pay</h2>

        <button
          onClick={() => navigateToPayment(plan, 'creditdebit')}
          className="flex items-center justify-between w-full p-4 mb-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          <span className="text-lg font-medium">Credit or Debit Card</span>
          <div className="flex items-center space-x-5">
            <img src="src/assets/visa.png" alt="Visa" className="w-10 h-10" />
            <img src="src/assets/mastercard.png" alt="Mastercard" className="w-10 h-10" />
          </div>
        </button>

        <button
          onClick={() => navigateToPayment(plan, 'digitalwallet')}
          className="flex items-center justify-between w-full p-4 mb-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          <span className="text-lg font-medium">Digital Wallet</span>
          <div className="flex items-center space-x-5">
            <img src="src/assets/gcash.png" alt="GCash" className="w-10 h-10" />
            <img src="src/assets/paypal.png" alt="PayPal" className="w-10 h-10" />
          </div>
        </button>
      </div>
    </section>
  );
}