import React from 'react';

export default function NoRecord({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm text-center">
        <div className="border-b border-gray-200 p-4 bg-gray-100 rounded-t-xl">
          <h2 className="text-xl font-semibold text-red-600">No Record Found</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-4 text-justify">
            Your account has no associated user record. Please contact support for assistance.
          </p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
