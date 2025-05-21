import React from 'react';

export default function QuestionModal({
  showModal,
  onClose,
  question,
  setQuestion,
  onSubmit,
  error,
  lessons,
  selectedLectureId,
  setSelectedLectureId,
}) {
  return (
    showModal && (
      <div className="modal-overlay">
        <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-gray-800">Ask a Question</h2>
            <button
              onClick={() => {
                onClose();
                setQuestion('');
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
          <div className="mb-4">
            <textarea
              className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-gray-50 text-sm resize-none"
              placeholder="Type your question here..."
              rows="4"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Lecture</label>
            <select
              className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-gray-50 text-sm"
              value={selectedLectureId}
              onChange={(e) => setSelectedLectureId(e.target.value)}
            >
              <option value="" disabled>Select a lecture</option>
              {lessons?.map((lesson) => (
                <optgroup key={lesson.id} label={lesson.title}>
                  {lesson.lectures?.map((lecture) => (
                    <option key={lecture.id} value={lecture.id}>
                      {lecture.title}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                onClose();
                setQuestion('');
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!question.trim()}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    )
  );
} 