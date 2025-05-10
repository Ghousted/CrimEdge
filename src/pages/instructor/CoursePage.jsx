import React, { useState } from 'react';
import { useHandleCourses } from '../../hooks/useHandleCourses';
import { useHandleAnnouncements } from '../../hooks/useHandleAnnouncements';
import { useHandleStorage } from '../../hooks/useHandleStorage';
import { useHandleLessons } from '../../hooks/useHandleLessons';
import { useParams } from 'react-router-dom';

export default function CoursePage() {
  const { id } = useParams();

  const [target, setTarget] = useState('Free');
  const [announcement, setAnnouncement] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [activeSection, setActiveSection] = useState('announcements');
  
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

  if (loading) {
    return <p>Loading course...</p>;
  }

  if (!course) {
    return <p>Course not found.</p>;
  }

  return (
    <section className="max-w-7xl mx-auto py-8 px-6">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
        <h1 className="text-3xl font-medium mb-1 text-gray-800">{course.course}</h1>
        <p className="text-gray-600 text-lg">Created by: <span className="font-medium text-blue-600">{course.createdByName}</span></p>
      </div>

      {/* Navigation Bar */}
      <div className="w-full flex gap-4 bg-white shadow-lg py-3 px-6 rounded-xl justify-start mb-4">
        <button
          className={`cursor-pointer relative py-2.5 px-6 rounded-lg transition-all duration-200 ${
            activeSection === 'announcements' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
          onClick={() => handleSectionClick('announcements')}
        >
          Announcements
        </button>
        <button
          className={`cursor-pointer relative py-2.5 px-6 rounded-lg transition-all duration-200 ${
            activeSection === 'lessons' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
          onClick={() => handleSectionClick('lessons')}
        >
          Lessons
        </button>
        <button
          className={`cursor-pointer relative py-2.5 px-6 rounded-lg transition-all duration-200 ${
            activeSection === 'quizzes' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
          onClick={() => handleSectionClick('quizzes')}
        >
          Quizzes
        </button>
      </div>

      {/* Conditional Rendering of Sections */}
      {activeSection === 'lessons' && (
        <div className="flex flex-col gap-6">
          {/* Add Lesson */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Lesson</h2>
            {lessonsError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{lessonsError}</p>
              </div>
            )}
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Lesson Title"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <textarea
                placeholder="Lesson Description"
                value={lessonDescription}
                onChange={(e) => setLessonDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                rows={3}
              />
              <div className="flex items-center gap-4">
                <label className="cursor-pointer border-2 border-blue-600 text-blue-600 hover:text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center gap-2">
                  <i className="bi bi-upload"></i>
                  <span>Upload File (PDF/Video)</span>
                  <input
                    type="file"
                    accept=".pdf,video/*"
                    onChange={handleLessonFileChange}
                    className="hidden"
                  />
                </label>
                {lessonFile && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">{lessonFile.name}</span>
                    <button
                      onClick={handleRemoveLessonFile}
                      className="text-red-600 hover:text-red-800"
                    >
                      <i className="bi bi-x-circle"></i>
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={handleUploadLesson}
                disabled={!lessonFile || !lessonTitle.trim()}
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload Lesson
              </button>
            </div>
          </div>

          {/* Display Lessons */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Course Lessons</h2>
            {lessonsLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : lessons.length === 0 ? (
              <div className="text-center py-8">
                <i className="bi bi-book text-4xl text-gray-400 mb-4"></i>
                <p className="text-gray-500">No lessons uploaded yet.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {lessons.map((lesson) => (
                  <div key={lesson.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">{lesson.title}</h3>
                        <p className="text-sm text-gray-500">{lesson.createdByName}</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedLesson(lesson);
                          setShowDeleteLessonModal(true);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                    <p className="text-gray-600 mb-3">{lesson.description}</p>
                    <div className="flex items-center gap-2">
                      <i className={`bi ${lesson.fileType.includes('pdf') ? 'bi-file-pdf' : 'bi-file-play'} text-blue-600`}></i>
                      <a
                        href={lesson.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {lesson.fileName}
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
          <div className="announcement-section p-6 rounded-xl bg-white shadow-lg mb-5">
            <h2 className="text-xl font-medium mb-4 text-gray-800">Add Announcement</h2>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              rows={4}
              placeholder="Write your announcement here..."
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <label className="text-base text-blue-600 cursor-pointer border-2 border-blue-600 rounded-lg px-6 py-2.5 hover:bg-blue-50 transition-all duration-200 font-medium">
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
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
              >
                Add Announcement
              </button>
            </div>
            {selectedFiles.length > 0 && (
              <div className="space-y-3 mb-4 mt-6">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-4 bg-gray-50 border border-gray-200 rounded- hover:bg-gray-100 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      {file.type.startsWith("image/") || file.type.startsWith("video/") ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-lg shadow-sm"
                        />
                      ) : (
                        <div className="w-30 h-20 flex items-center justify-center bg-gray-200 rounded-l-lg text-gray-600 text-sm font-medium">
                          PDF
                        </div>
                      )}
                      <span className="text-gray-700 font-medium">{file.name}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-600 hover:text-red-800 text-base transition-colors duration-200 mr-5"
                    >
                      <i className='bi bi-trash'></i> Remove
                    </button>
                  </div>
                ))}
                <div className='flex justify-end mt-4'>
                  <button
                    onClick={handleUploadFiles}
                    className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                  >
                    Upload Files
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Announcements List */}
          <div className="announcements-list">
            <h2 className="text-2xl font-medium mb-2 text-gray-800">Announcements</h2>
            {createdAnnouncements.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <p className="text-gray-500 text-lg">No announcements for this course yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {createdAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200">
                    <div className="flex flex-row justify-between items-center mb-3 border-b border-gray-200 pb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                        {announcement.target}
                      </span>
                      <div className="relative">
                        <button
                          className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                          onClick={(e) => {
                            const dropdown = e.currentTarget.nextSibling;
                            dropdown.classList.toggle('hidden');
                          }}
                        >
                          ⋮
                        </button>
                        <div className="absolute right-0 w-40 bg-white border border-gray-200 rounded-lg shadow-lg hidden z-10">
                          <button
                            className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            onClick={() => {
                              setSelectedAnnouncement({ ...announcement, newText: announcement.announcement });
                              setEditModalOpen(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors duration-200"
                            onClick={() => {
                              setSelectedAnnouncement(announcement);
                              setDeleteModalOpen(true);
                            }}
                          >
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
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Quizzes</h2>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-[480px]">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Edit Announcement</h3>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              rows={4}
              value={selectedAnnouncement.newText}
              onChange={(e) =>
                setSelectedAnnouncement((prev) => ({ ...prev, newText: e.target.value }))
              }
            />
            <div className="flex justify-end gap-3">
              <button
                className="px-6 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 font-medium"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-[480px]">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Delete Announcement</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this announcement? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-6 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 font-medium"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-[90%] max-w-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Delete Lesson</h2>
            <p className="text-gray-700 mb-8">
              Are you sure you want to delete this lesson? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteLessonModal(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteLesson}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
        </div>
      )}
    </section>
  );
}
