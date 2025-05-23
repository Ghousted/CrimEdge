import React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { useDarkMode } from '../components/DarkModeContext';

const UpdateMembershipModal = ({ isOpen, onClose, planName }) => {
  const { darkMode } = useDarkMode();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className={`relative max-w-md w-full rounded-xl p-6 shadow-lg ${
          darkMode ? 'bg-[#242526] border border-[#3E4042] text-gray-200' : 'bg-white text-gray-800'
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent modal close on clicking inside
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 rounded-full p-1 hover:bg-gray-300 hover:text-gray-700 ${
            darkMode ? 'hover:bg-gray-600 hover:text-gray-200' : ''
          }`}
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center gap-4">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
          <h2 className="text-2xl font-semibold">
            Membership Updated!
          </h2>
          <p className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Your plan has been successfully updated to <span className="font-bold">{planName}</span>.
          </p>
          <button
            onClick={onClose}
            className={`mt-6 px-6 py-3 rounded-lg font-semibold transition-colors ${
              darkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateMembershipModal;
