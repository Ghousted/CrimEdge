import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useHandleAnnouncements } from '../../hooks/useHandleAnnouncements';
import { useHandleCourses } from '../../hooks/useHandleCourses';
import { useHandleStorage } from '../../hooks/useHandleStorage';

export default function InstructorDashboard() {
  const [target, setTarget] = useState('All');
  const [announcement, setAnnouncement] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseImage, setCourseImage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteType, setDeleteType] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [coursesWithImages, setCoursesWithImages] = useState([]);

  const { id } = useParams();
  const courseId = id;

  const {
    uploadCourseImages,
    fetchCourseImages,
  } = useHandleStorage();

  const {
    createAnnouncement,
    deleteAnnouncement,
    updateAnnouncement,
    announcements,
    createdAnnouncements,
    loading,
    getAnnouncements
  } = useHandleAnnouncements(courseId);

  const {
    addNewCourse,
    deleteCourse,
    courses,
    loading: coursesLoading,
    getCourses
  } = useHandleCourses();

  useEffect(() => {
    const fetchImagesForCourses = async () => {
      const coursesWithUrls = await Promise.all(
        courses.map(async (course) => {
          const imageUrl = await fetchCourseImages(course.course);
          return { ...course, imageUrl };
        })
      );
      setCoursesWithImages(coursesWithUrls);
    };

    if (courses.length > 0) {
      fetchImagesForCourses();
    } else {
      setCoursesWithImages([]);
    }
  }, [courses]);

  const handleAddCourse = async () => {
    // First add the new course to get its id
    await addNewCourse(courseName, courseDescription);

    // Then upload the image if present with the new course name
    if (courseImage && courseName) {
      await uploadCourseImages(courseImage, courseName);
    }

    // Refresh courses list after adding
    window.location.reload(); // Reload the page to fetch new data

    setCourseName('');
    setCourseDescription('');
    setCourseImage(null);
  };

  const handleAddAnnouncement = () => {
    createAnnouncement(announcement, target);
    setAnnouncement('');
    setTarget('');
  };

  const handleEditAnnouncement = () => {
    if (editTarget) {
      updateAnnouncement(editTarget.id, announcement, target);
      setShowEditModal(false);
      setEditTarget(null);
      setAnnouncement('');
      setTarget('');
    }
  };

  const handleDelete = async () => {
    if (deleteType === 'course') {
      await deleteCourse(deleteTarget.id);
    } else if (deleteType === 'announcement') {
      await deleteAnnouncement(deleteTarget.id);
    }
    setShowDeleteModal(false);
    setDeleteTarget(null);
    setDeleteType('');
    window.location.reload(); // Reload the page to fetch new data

    if (courseId) {
      getCourses();
      getAnnouncements();
    }
  };

  const handleRemoveFile = () => {
    setCourseImage(null);
  };

  const openDeleteModal = (item, type) => {
    setDeleteTarget(item);
    setDeleteType(type);
    setShowDeleteModal(true);
  };

  const openEditModal = (announcement) => {
    setEditTarget(announcement);
    setAnnouncement(announcement.announcement);
    setTarget(announcement.target);
    setShowEditModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
    setDeleteType('');
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditTarget(null);
    setAnnouncement('');
    setTarget('');
  };

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  return (
    <section className="p-8 sm:px-4 lg:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Side - Courses Section */}
          <div className="flex flex-col w-full gap-4 lg:col-span-2">
            {/* Add Course */}
            <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <h2 className="text-xl font-medium mb-2 text-gray-800 flex items-center gap-2">
                Add New Course
              </h2>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Enter course code"
                    className="flex-1 p-1.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-gray-50"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Enter course description"
                    className="flex-1 p-1.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-gray-50"
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="courseImage"
                      className="cursor-pointer bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-all duration-200 flex items-center gap-1.5 font-medium text-sm"
                    >
                      <i className='bi bi-card-image text-base'></i>
                      <span>Upload Image</span>
                    </label>
                    <input
                      id="courseImage"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setCourseImage(e.target.files[0])}
                    />
                  </div>
                </div>

                {courseImage && (
                  <div className="flex items-center gap-3 bg-gray-50 border-2 border-gray-200 rounded-md">
                    <div className='flex justify-between w-full items-center'>
                      <div className='flex items-center gap-4'>
                        <img
                          src={URL.createObjectURL(courseImage)}
                          alt="Preview"
                          className="w-28 h-16 object-cover rounded-l-md shadow-md"
                        />
                        <span className="text-gray-700 text-base font-medium">{courseImage.name}</span>
                      </div>
                      <button
                        className='text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center gap-1.5 mr-4 text-sm'
                        onClick={handleRemoveFile}
                      >
                        <i className="bi bi-trash"></i>
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleAddCourse}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2 rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 font-medium shadow-md shadow-blue-500/20 text-sm"
                  disabled={!courseName.trim() || !courseDescription.trim()}
                >
                  <i className="bi bi-plus-circle"></i>
                  Add Course
                </button>
              </div>
            </div>

            {/* Display Courses */}
            <div className="">
              {coursesLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : coursesWithImages.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <i className="bi bi-book text-4xl text-gray-400 mb-3"></i>
                  <p className="text-gray-500 text-base">You have not created any courses yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {coursesWithImages.map((course, index) => (
                    <div key={course.id} className="bg-white rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-200 border border-gray-200 shadow-md hover:shadow-lg">
                      <Link to={`/course-page/${course.id}`} className="block">
                        {course.imageUrl ? (
                          <img
                            src={course.imageUrl}
                            alt={course.course}
                            className="w-full h-36 object-cover"
                          />
                        ) : (
                          <div className="w-full h-36 bg-gray-100 flex items-center justify-center">
                            <i className="bi bi-image text-4xl text-gray-400"></i>
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-gray-800 mb-1">{course.course}</h3>
                          <p className="text-gray-600 text-sm">{course.description}</p>
                        </div>
                      </Link>
                      <div className="absolute top-3 right-3">
                        <button 
                          className="text-gray-500 hover:text-gray-700 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-md hover:shadow-lg transition-all duration-200" 
                          onClick={() => toggleDropdown(`course-${course.id}`)}
                        >
                          <i className="bi bi-three-dots-vertical"></i>
                        </button>
                        {dropdownOpen === `course-${course.id}` && (
                          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10 overflow-hidden">
                            <button
                              className="flex items-center gap-1.5 w-full px-3 py-2 hover:bg-gray-50 text-gray-700 transition-colors duration-200 text-sm"
                              onClick={() => console.log('Edit course', course.id)}
                            >
                              <i className="bi bi-pencil"></i>
                              Edit
                            </button>
                            <button
                              className="flex items-center gap-1.5 w-full px-3 py-2 hover:bg-gray-50 text-red-600 transition-colors duration-200 text-sm"
                              onClick={() => openDeleteModal(course, 'course')}
                            >
                              <i className="bi bi-trash"></i>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Announcements Section */}
          <div className="flex flex-col w-full gap-4">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <i className="bi bi-megaphone-fill text-blue-600"></i>
                Add Announcement
              </h2>
              <textarea
                className="w-full p-3 h-24 border border-gray-200 rounded-lg resize-none mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-gray-50 text-sm"
                placeholder="Write your announcement here..."
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                required
              />
              <div className="mb-4">
                <label htmlFor="audience" className="block mb-1.5 font-medium text-gray-700 text-sm">Target Audience</label>
                <select
                  id="audience"
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-gray-50 text-sm"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Free">Free</option>
                  <option value="Basic Plan">Basic Plan</option>
                  <option value="Premium Plan">Premium Plan</option>
                </select>
              </div>
              <button
                onClick={handleAddAnnouncement}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 font-medium shadow-md shadow-blue-500/20 text-sm"
                disabled={!announcement.trim()}
              >
                <i className="bi bi-plus-circle"></i>
                Add Announcement
              </button>
            </div>

            {/* List Announcements */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <i className="bi bi-bell-fill text-blue-600"></i>
                Your Announcements
              </h2>
              {createdAnnouncements.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <i className="bi bi-megaphone text-4xl text-gray-400 mb-3"></i>
                  <p className="text-gray-500 text-base">You have not created any announcements yet.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {createdAnnouncements.map((announcement, index) => (
                    <div key={announcement.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative transform hover:scale-102 transition-all duration-200">
                      <div className="absolute top-3 right-3">
                        <button 
                          className="text-gray-500 hover:text-gray-700 bg-white rounded-full p-1.5 shadow-md hover:shadow-lg transition-all duration-200" 
                          onClick={() => toggleDropdown(`announcement-${announcement.id}`)}
                        >
                          <i className="bi bi-three-dots-vertical"></i>
                        </button>
                        {dropdownOpen === `announcement-${announcement.id}` && (
                          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10 overflow-hidden">
                            <button
                              className="flex items-center gap-1.5 w-full px-3 py-2 hover:bg-gray-50 text-gray-700 transition-colors duration-200 text-sm"
                              onClick={() => openEditModal(announcement)}
                            >
                              <i className="bi bi-pencil"></i>
                              Edit
                            </button>
                            <button
                              className="flex items-center gap-1.5 w-full px-3 py-2 hover:bg-gray-50 text-red-600 transition-colors duration-200 text-sm"
                              onClick={() => openDeleteModal(announcement, 'announcement')}
                            >
                              <i className="bi bi-trash"></i>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <i className="bi bi-people-fill text-blue-600"></i>
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          {announcement.target}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{announcement.announcement}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-sm transform transition-all">
            <h2 className="text-xl font-bold mb-3 text-gray-800">Confirm Deletion</h2>
            <p className="text-gray-700 mb-6 text-sm">
              Are you sure you want to delete this {deleteType === 'course' ? 'course' : 'announcement'}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center gap-1.5 font-medium shadow-md shadow-red-500/20 text-sm"
              >
                <i className="bi bi-trash"></i>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-sm transform transition-all">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Announcement</h2>
            <textarea
              className="w-full p-3 h-24 border border-gray-200 rounded-lg resize-none mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-gray-50 text-sm"
              placeholder="Write your announcement here..."
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              required
            />
            <div className="mb-4">
              <label htmlFor="editAudience" className="block mb-1.5 font-medium text-gray-700 text-sm">Target Audience</label>
              <select
                id="editAudience"
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-gray-50 text-sm"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Free">Free</option>
                <option value="Basic Plan">Basic Plan</option>
                <option value="Premium Plan">Premium Plan</option>
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleEditAnnouncement}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-1.5 font-medium shadow-md shadow-blue-500/20 text-sm"
              >
                <i className="bi bi-check-lg"></i>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
