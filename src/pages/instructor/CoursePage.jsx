import React, { useState } from 'react';
import { useHandleCourses } from '../../hooks/useHandleCourses';
import { useHandleAnnouncements } from '../../hooks/useHandleAnnouncements';
import { useHandleStorage } from '../../hooks/useHandleStorage';
import { useParams } from 'react-router-dom';

export default function CoursePage() {
  const { id } = useParams();

  const [target, setTarget] = useState('Free');
  const [announcement, setAnnouncement] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [activeSection, setActiveSection] = useState('lessons');

  const { createAnnouncement, deleteAnnouncement, updateAnnouncement, announcements, createdAnnouncements } = useHandleAnnouncements(id);
  const { courses, loading } = useHandleCourses();
  const { fileUpload } = useHandleStorage();

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
    if (selectedFiles.length === 0) return;
    try {
      await fileUpload(selectedFiles, course.id);
      alert('Files uploaded successfully!');
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files. Please try again.');
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

  if (loading) {
    return <p>Loading course...</p>;
  }

  if (!course) {
    return <p>Course not found.</p>;
  }

  return (
    <section className="max-w-7xl mx-auto py-5 px-4">
      <h1 className="text-3xl font-bold mb-4">{course.course}</h1>
      <p className="mb-6 text-gray-600 text-lg">Created by: {course.createdByName}</p>

      {/* Navigation Bar */}
      <div className="w-full flex gap-5 bg-white shadow-md py-2 px-4 rounded-lg justify-start mb-6">
        <button
          className={`cursor-pointer relative py-2 px-4 rounded-md ${activeSection === 'lessons' ? 'bg-blue-600 text-white' : 'text-blue-600'}`}
          onClick={() => handleSectionClick('lessons')}
        >
          Lessons
        </button>
        <button
          className={`cursor-pointer relative py-2 px-4 rounded-md ${activeSection === 'announcements' ? 'bg-blue-600 text-white' : 'text-blue-600'}`}
          onClick={() => handleSectionClick('announcements')}
        >
          Announcements
        </button>
        <button
          className={`cursor-pointer relative py-2 px-4 rounded-md ${activeSection === 'quizzes' ? 'bg-blue-600 text-white' : 'text-blue-600'}`}
          onClick={() => handleSectionClick('quizzes')}
        >
          Quizzes
        </button>
      </div>

      {/* Conditional Rendering of Sections */}
      {activeSection === 'lessons' && (
        <div>
          <h2 className="text-2xl mb-4">Lessons</h2>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Write something..."
          ></textarea>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <label className="flex items-center border border-blue-500 text-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer hover:text-white">
                <i className='bi bi-paperclip h-6 w-6'></i>
                <span className="ml-2">Add Attachment</span>
                <input type="file" className="hidden" />
              </label>
              <label className="flex items-center border border-blue-500 text-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer hover:text-white">
                <i className="bi bi-link h-6 w-6"></i>
                <span className="ml-2">Add Link</span>
              </label>
            </div>
            <button className="bg-green-600 px-4 py-2 rounded-md text-white hover:bg-green-700 cursor-pointer">
              Upload Task
            </button>
          </div>
        </div>
      )}

      {activeSection === 'announcements' && (
        <div>
          {/* Add Announcement */}
          <div className="announcement-section p-4 rounded-md bg-white shadow-sm mb-6">
            <h2 className="text-lg mb-2">Add Announcement for this Course</h2>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Write your announcement here..."
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <label className="text-base text-gray-600 cursor-pointer border border-blue-600 text-blue-600 rounded-md px-4 py-2 hover:bg-blue-600 hover:text-white">
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
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Add Announcement
              </button>
            </div>
            {selectedFiles.length > 0 && (
              <div className="space-y-2 mb-3 mt-5">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-4 bg-white border border-gray-200 rounded-md shadow-lg p-3"
                  >
                    <div className="flex items-center gap-4">
                      {file.type.startsWith("image/") || file.type.startsWith("video/") ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-md text-gray-500 text-sm">
                          PDF
                        </div>
                      )}
                      <span className="text-gray-700 text-sm">{file.name}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-600 hover:text-red-800 text-base"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className='flex justify-end mt-3'>
                  <button
                    onClick={handleUploadFiles}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                  >
                    Upload
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Announcements List */}
          <div className="announcements-list mt-6">
            <h2 className="text-2xl mb-4">Announcements</h2>
            {createdAnnouncements.length === 0 ? (
              <p className="text-gray-500">No announcements for this course yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {createdAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="p-4 bg-white rounded-md shadow-sm relative">
                    <div className="flex flex-row justify-between items-center mb-2 border-b border-gray-300 pb-1">
                      <p className="text-base text-gray-600">Target: {announcement.target}</p>
                      <div className="relative">
                        <button
                          className="text-gray-500 hover:text-gray-700"
                          onClick={(e) => {
                            const dropdown = e.currentTarget.nextSibling;
                            dropdown.classList.toggle('hidden');
                          }}
                        >
                          ⋮
                        </button>
                        <div className="absolute right-0 w-32 bg-white border border-gray-300 rounded-md shadow-lg hidden">
                          <button
                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              setSelectedAnnouncement({ ...announcement, newText: announcement.announcement });
                              setEditModalOpen(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-red-700 hover:bg-gray-100"
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
                    <p className="text-sm text-gray-700 mt-2">{announcement.announcement}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === 'quizzes' && (
        <div>
          <h2 className="text-2xl mb-4">Quizzes</h2>
          {/* Quizzes content goes here */}
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Edit Announcement</h3>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              value={selectedAnnouncement.newText}
              onChange={(e) =>
                setSelectedAnnouncement((prev) => ({ ...prev, newText: e.target.value }))
              }
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                onClick={handleEditAnnouncement}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Delete Announcement</h3>
            <p>Are you sure you want to delete this announcement?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                onClick={handleDeleteAnnouncement}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
