import React from 'react';

export default function ReviewModal({
  showModal,
  onClose,
  review,
  setReview,
  onSubmit,
  error
}) {
  const handleRating = (rating) => {
    setReview((prev) => ({ ...prev, rating }));
  };

  return (
    showModal && (
      <div className="modal-overlay">
        <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-gray-800">Write a Review</h2>
            <button
              onClick={() => {
                onClose();
                setReview({ rating: 0, comment: '' });
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 flex items-center gap-2">
                <i className="bi bi-exclamation-circle"></i>
                {error}
              </p>
            </div>
          )}
          <div className="mb-4 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRating(star)}
                className={`text-2xl ${review.rating >= star ? 'text-amber-500' : 'text-gray-300'}`}
              >
                <i className="bi bi-star-fill"></i>
              </button>
            ))}
          </div>
          <div className="mb-4">
            <textarea
              className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-gray-50 text-sm resize-none"
              placeholder="Write your review here... (optional)"
              rows="4"
              value={review.comment}
              onChange={(e) => setReview((prev) => ({ ...prev, comment: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                onClose();
                setReview({ rating: 0, comment: '' });
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={review.rating === 0}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    )
  );
} 