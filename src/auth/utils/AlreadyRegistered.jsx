import React from "react";

export default function AlreadyRegisteredEmail({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md relative">
        <div className="border-b border-gray-200 p-4 bg-gray-100 rounded-t-xl">
          <h2 className="text-xl font-semibold text-center text-red-600">Sign In Failed</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-600 text-justify mb-4">
            This email is already registered. Please sign in.
          </p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
