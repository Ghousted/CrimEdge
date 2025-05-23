import React from "react";
import { FiMail, FiArrowRight } from "react-icons/fi";
import { authControl } from "../components/authControl";

const VerifyEmailModal = ({ show, onClose }) => {
  const { logout } = authControl();

  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="bg-white shadow-md rounded-lg max-w-md w-full p-8 text-center">
        <div className="flex justify-center items-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
          <FiMail className="text-blue-600 text-2xl" />
        </div>

        <h2 className="text-2xl font-semibold mb-2">Verify Your Email</h2>
        <p className="text-gray-600 mb-4">
          We’ve sent a verification link to your email. Please check your inbox and click the link to activate your account.
        </p>
        <p className="text-gray-500 mb-6">
          Didn't receive it? Check your spam folder or request another.
        </p>

        <button
          onClick={async () => {
            await logout();
            onClose();
          }}
          className="flex items-center gap-2 justify-center bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-all"
        >
          Go to Sign In <FiArrowRight />
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailModal;
