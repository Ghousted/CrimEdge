import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useHandleAnnouncements } from '../../hooks/useHandleAnnouncements';
import { useHandleCourses } from '../../hooks/useHandleCourses';
import { useHandleStorage } from '../../hooks/useHandleStorage';

export default function InstructorDashboard() {
  const [activeTab, setActiveTab] = useState('courses');
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

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  return (
    <section className="max-w-7xl mx-auto py-8 px-6 bg-gray-50 ">
      {/* Tabs */}
      <div className="w-full flex gap-6 bg-white shadow-lg py-3 px-5 rounded-xl justify-start mb-5">
        <div
          className={`cursor-pointer relative py-3 px-5 rounded-lg transition-all duration-200 ${
            activeTab === 'courses' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-blue-600 hover:bg-blue-50'
          }`}
          onClick={() => setActiveTab('courses')}
        >
          <i className="bi bi-book mr-2"></i>
          Courses
        </div>
        <div
          className={`cursor-pointer relative py-3 px-6 rounded-lg transition-all duration-200 ${
            activeTab === 'announcements' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-blue-600 hover:bg-blue-50'
          }`}
          onClick={() => setActiveTab('announcements')}
        >
          <i className="bi bi-megaphone mr-2"></i>
          Announcements
        </div>
      </div>

      {/* Courses Section */}
      {activeTab === 'courses' && (
        <div className="flex flex-col w-full gap-6">
          {/* Add Course */}
          <div className="flex-1 p-6 rounded-xl bg-white shadow-lg">
            <h2 className="text-2xl mb-4 text-gray-800">Add Course</h2>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  required
                  placeholder="Enter course code"
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                />
                <input
                  type="text"
                  required
                  placeholder="Enter course description"
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                />
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="courseImage"
                    className="cursor-pointer border-2 border-blue-600 text-blue-600 hover:text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center gap-2"
                  >
                    <i className='bi bi-card-image text-lg'></i>
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
                <div className="flex items-center gap-4 bg-white border-2 border-gray-200 rounded-lg shadow-md ">
                  <div className='flex justify-between w-full items-center'>
                    <div className='flex items-center gap-6'>
                      <img
                        src={URL.createObjectURL(courseImage)}
                        alt="Preview"
                        className="w-42 h-24 object-cover rounded-l-lg"
                      />
                      <span className="text-gray-700 text-lg font-medium">{courseImage.name}</span>
                    </div>
                    <button
                      className='text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center gap-2 mr-5'
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
                className="w-full sm:w-auto bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={!courseName.trim() || !courseDescription.trim()}
              >
                <i className="bi bi-plus-circle"></i>
                Add Course
              </button>
            </div>
          </div>

          {/* Display Courses */}
          <div className="mt-1">
            <h2 className="text-2xl  mb-3 text-gray-800">Your Courses</h2>
            {coursesLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : coursesWithImages.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <i className="bi bi-book text-4xl text-gray-400 mb-4"></i>
                <p className="text-gray-500 text-lg">You have not created any courses yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {coursesWithImages.map((course, index) => (
                  <div key={course.id} className="bg-white shadow-lg rounded-xl overflow-hidden transform hover:scale-105 transition-all duration-200">
                    <Link to={`/course-page/${course.id}`} className="block">
                      {course.imageUrl ? (
                        <img
                          src={course.imageUrl}
                          alt={course.course}
                          className="w-full h-40 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                          <i className="bi bi-image text-4xl text-gray-400"></i>
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-medium text-gray-800 mb-1">{course.course}</h3>
                        <p className="text-gray-600">{course.description}</p>
                      </div>
                    </Link>
                    <div className="absolute top-4 right-4">
                      <button 
                        className="text-gray-500 hover:text-gray-700 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-200" 
                        onClick={() => toggleDropdown(index)}
                      >
                        <i className="bi bi-three-dots-vertical"></i>
                      </button>
                      {dropdownOpen === index && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                          <button
                            className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors duration-200"
                            onClick={() => console.log('Edit course', course.id)}
                          >
                            <i className="bi bi-pencil"></i>
                            Edit
                          </button>
                          <button
                            className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-50 text-red-600 transition-colors duration-200"
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
      )}

      {/* Announcements Section */}
      {activeTab === 'announcements' && (
        <div className="flex flex-col w-full gap-4">
          <div className="flex-1 p-6 rounded-xl bg-white shadow-lg">
            <h2 className="text-2xl mb-4 text-gray-800">Add Announcement</h2>
            <textarea
              className="w-full p-4 h-24 border border-gray-300 rounded-lg resize-none mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Write your announcement here..."
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              required
            />
            <div className="mb-6">
              <label htmlFor="audience" className="block mb-2 font-medium text-gray-700">Target Audience</label>
              <select
                id="audience"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={!announcement.trim()}
            >
              <i className="bi bi-plus-circle"></i>
              Add Announcement
            </button>
          </div>

          {/* List Announcements */}
          <div className="w-full mt-4">
            <h2 className="text-2xl font-medium mb-2 text-gray-800">Your Announcements</h2>
            {createdAnnouncements.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <i className="bi bi-megaphone text-4xl text-gray-400 mb-4"></i>
                <p className="text-gray-500 text-lg">You have not created any announcements yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {createdAnnouncements.map((announcement, index) => (
                  <div key={announcement.id} className="p-6 shadow-lg rounded-xl bg-white relative transform hover:scale-105 transition-all duration-200">
                    <div className="absolute top-4 right-4">
                      <button 
                        className="text-gray-500 hover:text-gray-700 bg-gray-50 rounded-full p-2 hover:bg-gray-100 transition-all duration-200" 
                        onClick={() => toggleDropdown(index)}
                      >
                        <i className="bi bi-three-dots-vertical"></i>
                      </button>
                      {dropdownOpen === index && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                          <button
                            className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors duration-200"
                            onClick={() => openEditModal(announcement)}
                          >
                            <i className="bi bi-pencil"></i>
                            Edit
                          </button>
                          <button
                            className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-50 text-red-600 transition-colors duration-200"
                            onClick={() => openDeleteModal(announcement, 'announcement')}
                          >
                            <i className="bi bi-trash"></i>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <i className="bi bi-people-fill text-blue-600"></i>
                      <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {announcement.target}
                      </span>
                    </div>
                    <p className="text-gray-700 text-lg">{announcement.announcement}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-[90%] max-w-md transform transition-all">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Confirm Deletion</h2>
            <p className="text-gray-700 mb-8">
              Are you sure you want to delete this {deleteType === 'course' ? 'course' : 'announcement'}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeDeleteModal}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center gap-2"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-[90%] max-w-md transform transition-all">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Announcement</h2>
            <textarea
              className="w-full p-4 h-32 border border-gray-300 rounded-lg resize-none mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Write your announcement here..."
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              required
            />
            <div className="mb-6">
              <label htmlFor="editAudience" className="block mb-2 font-medium text-gray-700">Target Audience</label>
              <select
                id="editAudience"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Free">Free</option>
                <option value="Basic Plan">Basic Plan</option>
                <option value="Premium Plan">Premium Plan</option>
              </select>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeEditModal}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleEditAnnouncement}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
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
