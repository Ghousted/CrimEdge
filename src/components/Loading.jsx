
import React from 'react';
import './index.css'; // Ensure this path is correct

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
      <p className="mt-4 text-lg text-gray-700">Loading...</p>
    </div>
  );
};

export default Loading;