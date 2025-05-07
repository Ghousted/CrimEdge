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
  const { createAnnouncement, deleteAnnouncement, updateAnnouncement, announcements, createdAnnouncements } = useHandleAnnouncements(id);
  const { courses, loading } = useHandleCourses()

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

  const handleUploadFiles = () => {
    if (selectedFiles.length === 0) return;
    // Placeholder: Implement actual upload logic here
    alert(`Uploading ${selectedFiles.length} file(s):\n` + selectedFiles.map(f => f.name).join('\n'));
    setSelectedFiles([]);
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

  if (loading) {
    return <p>Loading course...</p>;
  }

  if (!course) {
    return <p>Course not found.</p>;
  }

  return (
    <section className="max-w-7xl mx-auto py-5 px-4">
      <h1 className="text-2xl font-bold mb-2">{course.course}</h1>
      <p className="mb-4 text-gray-600 text-lg">Created by: {course.createdByName}</p>

      {/* Add Announcement */}
      <div className="announcement-section p-4 rounded-md bg-white shadow-sm">
        <h2 className="text-lg mb-2">Add Announcement for this Course</h2>
        <textarea
          className="w-full p-2 border border-gray-300 h-24 rounded-md resize-none mb-3"
          rows={4}
          placeholder="Write your announcement here..."
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
        />
        <button
          onClick={handleAddAnnouncement}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Announcement
        </button>
      </div>

      {/* File Upload Section */}
      <div className="file-upload-section p-4 rounded-md bg-white shadow-sm mt-6">
        <h2 className="text-lg mb-2">Upload Files, Videos, and Images</h2>
        <input
          type="file"
          multiple
          accept="image/*,video/*,application/pdf"
          onChange={handleFileChange}
          className="mb-3"
        />
        {selectedFiles.length > 0 && (
          <div className="mb-3">
            <p className="font-semibold">Selected files:</p>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {selectedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
        <button
          onClick={handleUploadFiles}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Upload
        </button>
      </div>

      {/* Announcements List */}
      <div className="announcements-list mt-6">
        <h2 className="text-xl mb-2">Announcements</h2>
        {createdAnnouncements.length === 0 ? (
          <p className="text-gray-500">No announcements for this course yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {createdAnnouncements.map((announcement) => (
              <div key={announcement.id} className="p-4 bg-white rounded-md bg-gray-50 shadow-sm relative">
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
                    <div className="absolute right-0  w-32 bg-white border border-gray-300 rounded-md shadow-lg hidden">
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
                        className="block w-full text-left px-4 py-2  text-red-700 hover:bg-gray-100"
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

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="modal-overlay">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Edit Announcement</h3>
            <textarea
              className="w-full p-2 border border-gray-300 h-24 rounded-md resize-none mb-3"
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
        <div className="modal-overlay">
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
 
