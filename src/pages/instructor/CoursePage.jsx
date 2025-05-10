import React, { useState } from 'react';
import { useHandleCourses } from '../../hooks/useHandleCourses';
import { useHandleAnnouncements } from '../../hooks/useHandleAnnouncements';
import { useHandleStorage } from '../../hooks/useHandleStorage';
import { useHandleLessons } from '../../hooks/useHandleLessons';
import { useHandleQuizzes } from '../../hooks/useHandleQuizzes';
import { useParams } from 'react-router-dom';
import QuizCreator from '../../components/QuizCreator';
import QuizDisplay from '../../components/QuizDisplay';

export default function CoursePage() {
  const { id } = useParams();

  const [target, setTarget] = useState('Free');
  const [announcement, setAnnouncement] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [activeSection, setActiveSection] = useState('announcements');
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showDeleteQuizModal, setShowDeleteQuizModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  
  // New state for lesson upload
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [lessonFile, setLessonFile] = useState(null);
  const [showDeleteLessonModal, setShowDeleteLessonModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { createAnnouncement, deleteAnnouncement, updateAnnouncement, announcements, createdAnnouncements } = useHandleAnnouncements(id);
  const { courses, loading } = useHandleCourses();
  const { fileUpload } = useHandleStorage();
  const { uploadLessonFile, deleteLesson, lessons, loading: lessonsLoading, error: lessonsError } = useHandleLessons(id);
  const { createQuiz, deleteQuiz, submitQuizAttempt, getQuizAttempts, quizzes, createdQuizzes, loading: quizzesLoading } = useHandleQuizzes(id);

  const course = courses.find(c => c.id === id) || null;

  const handleAddAnnouncement = () => {
    if (announcement.trim() === '') return;
    createAnnouncement(announcement, course.course, course.id);
    setAnnouncement('');
    setTarget('Free');
  };

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleUploadFiles = async () => {
    if (!selectedFiles.length) {
        setError('Please select at least one file to upload');
        return;
    }

    try {
        setUploading(true);
        const results = await fileUpload(selectedFiles, id);
        
        // Create a new lesson for each uploaded file
        for (const result of results) {
            await uploadLessonFile(
                result.file, // Pass the actual file object
                result.fileName, // Use the file name as the title
                `Uploaded file: ${result.fileName}` // Use a default description
            );
        }

        setSelectedFiles([]);
        setError(null);
    } catch (error) {
        console.error('Error uploading files:', error);
        setError(error.message || 'Failed to upload files. Please try again.');
    } finally {
        setUploading(false);
    }
  };

  const handleEditAnnouncement = () => {
    if (selectedAnnouncement) {
      updateAnnouncement(selectedAnnouncement.id, selectedAnnouncement.newText, target);
      setEditModalOpen(false);
      setSelectedAnnouncement(null);
    }
  };

  const handleDeleteAnnouncement = () => {
    if (selectedAnnouncement) {
      deleteAnnouncement(selectedAnnouncement.id);
      setDeleteModalOpen(false);
      setSelectedAnnouncement(null);
    }
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  const handleLessonFileChange = (event) => {
    setLessonFile(event.target.files[0]);
  };

  const handleRemoveLessonFile = () => {
    setLessonFile(null);
  };

  const handleUploadLesson = async () => {
    if (!lessonFile || !lessonTitle.trim()) return;

    const success = await uploadLessonFile(lessonFile, lessonTitle, lessonDescription);
    if (success) {
      setLessonTitle('');
      setLessonDescription('');
      setLessonFile(null);
    }
  };

  const handleDeleteLesson = async () => {
    if (selectedLesson) {
      await deleteLesson(selectedLesson.id, selectedLesson.fileUrl);
      setShowDeleteLessonModal(false);
      setSelectedLesson(null);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    await deleteQuiz(quizId);
    setShowDeleteQuizModal(false);
    setQuizToDelete(null);
  };

  if (loading) {
    return <p>Loading course...</p>;
  }

  if (!course) {
    return <p>Course not found.</p>;
  }

  return (
    <section className="max-w-7xl mx-auto py-8 px-6">
      <div className="bg-white rounded-xl shadow-lg p-5 mb-4">
        <h1 className="text-2xl font-bold mb-2">{course.course}</h1>
        <p className="text-gray-500 text-lg">Created by: <span className="font-medium text-gray-800">{course.createdByName}</span></p>
      </div>

      {/* Navigation Bar */}
      <div className="w-full flex gap-4 bg-white shadow-lg py-4 px-4 rounded-xl justify-start mb-6">
        <button
          className={`cursor-pointer relative py-3 px-8 rounded-lg transition-all duration-200 flex items-center gap-2 ${
            activeSection === 'announcements' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => handleSectionClick('announcements')}
        >
          <i className="bi bi-megaphone"></i>
          <span>Announcements</span>
        </button>
        <button
          className={`cursor-pointer relative py-3 px-8 rounded-lg transition-all duration-200 flex items-center gap-2 ${
            activeSection === 'lessons' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => handleSectionClick('lessons')}
        >
          <i className="bi bi-book"></i>
          <span>Lessons</span>
        </button>
        <button
          className={`cursor-pointer relative py-3 px-8 rounded-lg transition-all duration-200 flex items-center gap-2 ${
            activeSection === 'quizzes' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => handleSectionClick('quizzes')}
        >
          <i className="bi bi-pencil-square"></i>
          <span>Quizzes</span>
        </button>
      </div>

      {/* Conditional Rendering of Sections */}
      {activeSection === 'lessons' && (
        <div className="flex flex-col gap-6">
          {/* Add Lesson */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-medium mb-2 text-gray-800 flex items-center gap-2">
              Add New Lesson
            </h2>
            {lessonsError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 flex items-center gap-2">
                  <i className="bi bi-exclamation-circle"></i>
                  {lessonsError}
                </p>
              </div>
            )}
            <div className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Lesson Title"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pl-5"
                />
                </div>
              <div className="relative">
                <textarea
                  placeholder="Lesson Description"
                  value={lessonDescription}
                  onChange={(e) => setLessonDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none pl-5"
                  rows={2}
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <label className="cursor-pointer border-2 border-blue-600 text-blue-600 hover:text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center gap-2 font-medium">
                  <i className="bi bi-upload"></i>
                  <span>Upload File (PDF/Video)</span>
                  <input
                    type="file"
                    accept=".pdf,video/*"
                    onChange={handleLessonFileChange}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={handleUploadLesson}
                  disabled={!lessonFile || !lessonTitle.trim()}
                  className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                >
                  <i className="bi bi-cloud-upload"></i>
                  Upload Lesson
                </button>
              </div>
              {lessonFile && (
                <div className="flex items-center gap-4 p-5 bg-gray-50 border-2 border-gray-200 rounded-lg">
                  <div className='flex justify-between w-full items-center'>
                    <div className="flex items-center gap-3">
                      <i className={`bi ${lessonFile.type.includes('pdf') ? 'bi-file-pdf' : 'bi-file-play'} text-2xl text-blue-600`}></i>
                      <span className="text-gray-700 font-medium">{lessonFile.name}</span>
                    </div>
                    <button
                      onClick={handleRemoveLessonFile}
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

          {/* Display Lessons */}
          <div className="mt-1">
            <h2 className="text-xl font-medium mb-2 text-gray-800 flex items-center gap-2">
              Course Lessons
            </h2>
            {lessonsLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : lessons.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <i className="bi bi-book text-5xl text-gray-400 mb-4"></i>
                <p className="text-gray-500 text-lg">No lessons uploaded yet.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {lessons.map((lesson) => (
                  <div key={lesson.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{lesson.title}</h3>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedLesson(lesson);
                          setShowDeleteLessonModal(true);
                        }}
                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <i className="bi bi-trash"></i> <span>Delete</span>
                      </button>
                    </div>
                    <p className="text-gray-600 mb-4">{lesson.description}</p>
                    <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-md shadow-md">
                      <i className={`bi ${lesson.fileType.includes('pdf') ? 'bi-file-pdf' : 'bi-file-play'} text-blue-600 text-xl`}></i>
                      <a
                        href={lesson.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                      >
                        {lesson.fileName}
                        <i className="bi bi-box-arrow-up-right text-sm"></i>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === 'announcements' && (
        <div>
          {/* Add Announcement */}
          <div className="announcement-section p-6 rounded-xl bg-white shadow-lg mb-6">
            <h2 className="text-xl font-medium mb-2 text-gray-800 flex items-center gap-2">
              Add New Announcement
            </h2>
            <div className="flex flex-col gap-2">
              <div className="relative">
                <textarea
                  className="w-full p-4 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none pl-5"
                  rows={4}
                  placeholder="Write your announcement here..."
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="text-base text-blue-600 cursor-pointer border-2 border-blue-600 rounded-lg px-6 py-3 hover:bg-blue-50 transition-all duration-200 font-medium flex items-center gap-2">
                  <i className="bi bi-paperclip"></i>
                  Upload Files
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={handleAddAnnouncement}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <i className="bi bi-send"></i>
                  Add Announcement
                </button>
              </div>
              {selectedFiles.length > 0 && (
                <div className="space-y-3 mb-4 mt-6">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        {file.type.startsWith("image/") ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg shadow-sm"
                          />
                        ) : file.type.startsWith("video/") ? (
                          <div className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded-lg">
                            <i className="bi bi-play-circle text-3xl text-gray-600"></i>
                          </div>
                        ) : (
                          <div className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded-lg">
                            <i className="bi bi-file-pdf text-3xl text-gray-600"></i>
                          </div>
                        )}
                        <span className="text-gray-700 font-medium">{file.name}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-600 hover:text-red-800 text-base transition-colors duration-200 flex items-center gap-2"
                      >
                        <i className='bi bi-trash'></i>
                        <span>Remove</span>
                      </button>
                    </div>
                  ))}
                  <div className='flex justify-end mt-4'>
                    <button
                      onClick={handleUploadFiles}
                      className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      <i className="bi bi-cloud-upload"></i>
                      Upload Files
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Announcements List */}
          <div className="announcements-list">
            <h2 className="text-xl font-medium mb-2 text-gray-800 flex items-center gap-2">
              Course Announcements
            </h2>
            {createdAnnouncements.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <i className="bi bi-megaphone text-5xl text-gray-400 mb-4"></i>
                <p className="text-gray-500 text-lg">No announcements for this course yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {createdAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-all duration-200">
                    <div className="flex flex-row justify-between items-center mb-4 border-b border-gray-200 pb-2">
                      <span className="px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-sm font-medium flex items-center gap-2">
                        <i className="bi bi-tag"></i>
                        {announcement.target}
                      </span>
                      <div className="relative">
                        <button
                          className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg"
                          onClick={(e) => {
                            const dropdown = e.currentTarget.nextSibling;
                            dropdown.classList.toggle('hidden');
                          }}
                        >
                          <i className="bi bi-three-dots-vertical"></i>
                        </button>
                        <div className="absolute right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg hidden z-10">
                          <button
                            className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                            onClick={() => {
                              setSelectedAnnouncement({ ...announcement, newText: announcement.announcement });
                              setEditModalOpen(true);
                            }}
                          >
                            <i className="bi bi-pencil"></i>
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-2"
                            onClick={() => {
                              setSelectedAnnouncement(announcement);
                              setDeleteModalOpen(true);
                            }}
                          >
                            <i className="bi bi-trash"></i>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{announcement.announcement}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === 'quizzes' && (
        <div className="flex flex-col gap-6">
          {/* Add Quiz */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-medium mb-2 text-gray-800 flex items-center gap-2">
              <i className="bi bi-plus-circle"></i>
              Create New Quiz
            </h2>
            <QuizCreator onCreateQuiz={createQuiz} />
          </div>

          {/* Display Quizzes */}
          <div className="mt-1">
            <h2 className="text-xl font-medium mb-2 text-gray-800 flex items-center gap-2">
              <i className="bi bi-pencil-square"></i>
              Course Quizzes
            </h2>
            {quizzesLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : quizzes.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <i className="bi bi-pencil-square text-5xl text-gray-400 mb-4"></i>
                <p className="text-gray-500 text-lg">No quizzes available yet.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">{quiz.title}</h3>
                        <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg mb-3">
                          <i className="bi bi-bookmark text-blue-600"></i>
                          <span className="text-gray-700 font-medium">Topic: {quiz.topic}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <div className="flex items-center gap-1">
                            <i className="bi bi-list-check"></i>
                            <span>{quiz.questions.length} questions</span>
                          </div>
                          <span className="mx-2">•</span>
                          <div className="flex items-center gap-1">
                            <i className="bi bi-person"></i>
                            <span>{quiz.createdByName}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedQuiz(quiz)}
                          className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <i className="bi bi-eye"></i>
                          <span>Preview</span>
                        </button>
                        <button
                          onClick={() => {
                            setQuizToDelete(quiz);
                            setShowDeleteQuizModal(true);
                          }}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <i className="bi bi-trash"></i>
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="modal-overlay">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-[480px] transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                Edit Announcement
              </h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="relative mb-6">
              <textarea
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-5"
                rows={4}
                value={selectedAnnouncement.newText}
                onChange={(e) =>
                  setSelectedAnnouncement((prev) => ({ ...prev, newText: e.target.value }))
                }
              />
             
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="px-6 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 font-medium flex items-center gap-2"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center gap-2"
                onClick={handleEditAnnouncement}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="modal-overlay">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-[480px] transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                Delete Announcement
              </h3>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-600 flex items-center gap-2">
                Are you sure you want to delete this announcement? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="px-6 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 font-medium flex items-center gap-2"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center gap-2"
                onClick={handleDeleteAnnouncement}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Lesson Modal */}
      {showDeleteLessonModal && (
        <div className="modal-overlay">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-[90%] max-w-md transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                Delete Lesson
              </h2>
              <button
                onClick={() => setShowDeleteLessonModal(false)}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-600 flex items-center gap-2">
                Are you sure you want to delete this lesson? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteLessonModal(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteLesson}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center gap-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Quiz Modal */}
      {showDeleteQuizModal && (
        <div className="modal-overlay">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-[90%] max-w-md transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                Delete Quiz
              </h2>
              <button
                onClick={() => {
                  setShowDeleteQuizModal(false);
                  setQuizToDelete(null);
                }}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-600 flex items-center gap-2">
                Are you sure you want to delete the quiz "{quizToDelete?.title}"? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteQuizModal(false);
                  setQuizToDelete(null);
                }}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteQuiz(quizToDelete.id)}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center gap-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Display Modal */}
      {selectedQuiz && (
        <div className="modal-overlay">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                Quiz Preview
              </h2>
              <button
                onClick={() => setSelectedQuiz(null)}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <QuizDisplay
              quiz={selectedQuiz}
              onSubmitQuiz={submitQuizAttempt}
              onViewResults={getQuizAttempts}
              isInstructor={true}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-lg flex items-center gap-2 transform transition-all duration-300" role="alert">
          <i className="bi bi-exclamation-circle text-xl"></i>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
    </section>
  );
}
