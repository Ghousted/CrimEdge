import React from 'react';
import { useDarkMode } from '../components/DarkModeContext'; // import your dark mode hook

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
  const { darkMode } = useDarkMode();

  return (
    showModal && (
      <div className={`modal-overlay fixed inset-0 flex items-center justify-center z-50
        ${darkMode ? 'bg-black bg-opacity-70' : 'bg-gray-500 bg-opacity-40'}`}>
        <div
          className={`p-6 rounded-xl shadow-xl w-[90%] max-w-md
            ${darkMode ? 'bg-[#242526] text-gray-200' : 'bg-white text-gray-800'}`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Ask a Question
            </h2>
            <button
              onClick={() => {
                onClose();
                setQuestion('');
              }}
              className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {error && (
            <div className={`mb-4 p-4 rounded-lg border
              ${darkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200'}`}>
              <p className={`flex items-center gap-2
                ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                <i className="bi bi-exclamation-circle"></i>
                {error}
              </p>
            </div>
          )}

          <div className="mb-4">
            <textarea
              className={`w-full p-2 rounded-md transition
                border
                ${darkMode
                  ? 'bg-[#3A3B3C] border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
                  : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
                }`}
              placeholder="Type your question here..."
              rows="4"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className={`block text-sm font-medium mb-1
              ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Select Lecture
            </label>
            <select
              className={`w-full p-2 rounded-md transition
                border
                ${darkMode
                  ? 'bg-[#3A3B3C] border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500'
                  : 'bg-gray-50 border-gray-200 text-gray-800 focus:ring-blue-500 focus:border-blue-500'
                }`}
              value={selectedLectureId}
              onChange={(e) => setSelectedLectureId(e.target.value)}
            >
              <option value="" disabled>
                Select a lecture
              </option>
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
              className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm
                ${darkMode
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={!question.trim()}
              className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm
                ${darkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    )
  );
}
