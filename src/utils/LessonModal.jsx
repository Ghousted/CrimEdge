import React from 'react';

export default function LessonModal({
  showModal,
  onClose,
  title,
  setTitle,
  description,
  setDescription,
  file,
  onFileChange,
  onRemoveFile,
  error,
  onSubmit
}) {
  return (
    showModal && (
      <div className="modal-overlay">
        <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-gray-800">Add New Lecture</h2>
            <button
              onClick={() => {
                onClose();
                setTitle('');
                setDescription('');
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
          <div className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Lecture Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pl-5"
              />
            </div>
            <div className="relative">
              <textarea
                placeholder="Lecture Content"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none pl-5"
                rows={2}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <label className="cursor-pointer border-2 border-blue-600 text-blue-600 hover:text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center gap-2 font-medium">
                <i className="bi bi-upload"></i>
                <span>Upload File (PDF/Video)</span>
                <input
                  type="file"
                  accept=".pdf,video/*"
                  onChange={onFileChange}
                  className="hidden"
                />
              </label>
              <button
                onClick={onSubmit}
                disabled={!description || !title.trim()}
                className="bg-blue-600 text-white py-2 px-8 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
              >
                <i className="bi bi-cloud-upload"></i>
                Upload Lecture
              </button>
            </div>
            {file && (
              <div className="flex items-center gap-4 p-5 bg-gray-50 border-2 border-gray-200 rounded-lg">
                <div className='flex justify-between w-full items-center'>
                  <div className="flex items-center gap-3">
                    <i className={`bi ${file.type.includes('pdf') ? 'bi-file-pdf' : 'bi-file-play'} text-2xl text-blue-600`}></i>
                    <span className="text-gray-700 font-medium">{file.name}</span>
                  </div>
                  <button
                    onClick={onRemoveFile}
                    className="text-red-600 hover:text-red-800 flex items-center gap-2"
                  >
                    <i className="bi bi-trash"></i>
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
} 