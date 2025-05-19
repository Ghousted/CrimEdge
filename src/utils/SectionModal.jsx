import React from 'react';

export default function SectionModal({ 
  showModal, 
  onClose, 
  title, 
  setTitle, 
  description, 
  setDescription, 
  onSubmit 
}) {
  return (
    showModal && (
      <div className="modal-overlay">
        <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md">
          <h2 className="text-xl font-medium mb-4 text-gray-800">Add New Section</h2>
          <div className="mb-4">
            <label htmlFor="sectionTitle" className="block font-medium text-gray-700 text-base">Section Title</label>
            <input
              type="text"
              id="sectionTitle"
              className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-gray-50 text-sm"
              placeholder="Enter section title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="sectionDescription" className="block font-medium text-gray-700 text-base">Section Description</label>
            <textarea
              id="sectionDescription"
              className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-gray-50 text-sm resize-none"
              placeholder="Enter section description"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                onClose();
                setTitle('');
                setDescription('');
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-1.5 font-medium shadow-md shadow-blue-500/20 text-sm"
              disabled={!title.trim()}
            >
              Add Section
            </button>
          </div>
        </div>
      </div>
    )
  );
} 