import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Membership() {
  useEffect(() => {
    document.body.style.background = "radial-gradient(circle, rgba(225,238,254,1) 0%, rgba(90,110,201,1) 100%)";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflowX = "hidden";
  }, []);

  const navigate = useNavigate();

  const navigateToPayment = (plan) => {
    // Navigate to the payment page with the selected plan as a query parameter
    navigate(`/payment?plan=${encodeURIComponent(plan)}`);
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
        {/* Free Tier */}
        <div
          className="plan p-4 rounded-lg shadow-md bg-white text-center cursor-pointer transition-transform transform hover:scale-105"
          onClick={() => navigateToPayment("Free Tier")}
        >
          <div
            className="mb-2 text-lg font-semibold text-white rounded-lg py-1"
            style={{
              background: 'linear-gradient(to right, #161647, #3535AD)',
            }}
          >
            Free Tier
          </div>
          <div className="price mb-4 text-gray-600">Free</div>
          <div className="features mb-4 text-gray-700 text-left px-4">
            <p><strong>Access & Features</strong></p>
            <ul className="list-disc pl-5 space-y-2">
              <li>For One Month of Access Only.</li>
              <li>Limited Access to Content</li>
              <li>Basic Course Overview</li>
              <li>Limited Assessments</li>
            </ul>
          </div>
        </div>

        {/* Basic Tier */}
        <div
          className="plan p-4 rounded-lg shadow-md bg-white text-center cursor-pointer transition-transform transform hover:scale-105"
          onClick={() => navigateToPayment("Basic Tier")}
        >
          <div
            className="mb-2 text-lg font-semibold text-white rounded-lg py-1"
            style={{
              background: 'linear-gradient(to right, #161647, #3535AD)',
            }}
          >
            Basic Tier
          </div>
          <div className="price mb-4 text-gray-600">₱2,000 / month</div>
          <div className="features mb-4 text-gray-700 text-left px-4">
            <p><strong>Access & Features</strong></p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Access to Pre-Recorded Lectures</li>
              <li>Practice Exams & Quizzes</li>
              <li>Downloadable Study Materials</li>
              <li>Limited Live Q&A</li>
            </ul>
          </div>
        </div>

        {/* Premium Tier */}
        <div
          className="plan p-4 rounded-lg shadow-md bg-white text-center cursor-pointer transition-transform transform hover:scale-105"
          onClick={() => navigateToPayment("Premium Tier")}
        >
          <div
            className="mb-2 text-lg font-semibold text-white rounded-lg py-1"
            style={{
              background: 'linear-gradient(to right, #161647, #3535AD)',
            }}
          >
            Premium Tier
          </div>
          <div className="price mb-4 text-gray-600">₱5,000 / month</div>
          <div className="features mb-4 text-gray-700 text-left px-4">
            <p><strong>Access & Features</strong></p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Full Access to All Course Materials</li>
              <li>Live Classes & Coaching</li>
              <li>Full-Length Mock Exams</li>
              <li>Performance Analytics</li>
              <li>Exclusive Mentorship</li>
              <li>Offline Mode</li>
              <li>Certifications & Career Assistance</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
