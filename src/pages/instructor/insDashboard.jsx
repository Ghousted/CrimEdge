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
    <section className="max-w-5xl mx-auto py-5 px-4">
      {/* Tabs */}
      <div className="w-full flex gap-5 bg-white shadow-md py-2 px-4 rounded-lg justify-start mb-4">
  <div
    className={`cursor-pointer relative py-2 px-4 rounded-md ${
      activeTab === 'courses' ? 'bg-blue-600 text-white' : 'text-blue-600'
    }`}
    onClick={() => setActiveTab('courses')}
  >
    Courses
  </div>
  <div
    className={`cursor-pointer relative py-2 px-4 rounded-md ${
      activeTab === 'announcements' ? 'bg-blue-600 text-white' : 'text-blue-600'
    }`}
    onClick={() => setActiveTab('announcements')}
  >
    Announcements
  </div>
</div>


      {/* Courses Section */}
      {activeTab === 'courses' && (
        <div className="flex flex-col w-full gap-4">
          {/* Add Course */}
          <div className="flex-1 p-5 rounded-md bg-white shadow-sm">
            <h2 className="text-xl mb-3">Add Course</h2>
            <div className="flex flex-col gap-4 mb-3">
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  type="text"
                  required
                  placeholder="Enter course code"
                  className="flex-1 p-2 border border-gray-400 rounded-md"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                />
                <input
                  type="text"
                  required
                  placeholder="Enter course description"
                  className="flex-1 p-2 border border-gray-400 rounded-md"
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                />
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="courseImage"
                    className="cursor-pointer border border-blue-600 text-blue-600 hover:text-white px-3 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    <div className="flex items-center gap-2">
                      <i className='bi bi-card-image text-lg'></i><span>Upload Image</span>
                    </div>
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
                <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-md shadow-lg">
                  <div className='flex justify-between w-full items-center'>
                    <div className='flex items-center gap-5'>
                      <img
                        src={URL.createObjectURL(courseImage)}
                        alt="Preview"
                        className="w-30 h-20 object-cover rounded-l-md"
                      />
                      <span className="text-gray-700 text-lg">{courseImage.name}</span>
                    </div>
                    <span
                      className='text-red-600 cursor-pointer hover:text-red-800 transition mr-5'
                      onClick={handleRemoveFile}
                    >Remove</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddCourse}
                className="w-full sm:w-auto bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!courseName.trim() || !courseDescription.trim()}
              >
                Add Course
              </button>
            </div>
          </div>

          {/* Display Courses */}
          <div className="mt-3">
            <h2 className="text-xl mb-3">Courses:</h2>
            {coursesLoading ? (
              <p>Loading courses...</p>
            ) : coursesWithImages.length === 0 ? (
              <p className="text-gray-500">You have not created any courses yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {coursesWithImages.map((course, index) => (
                  <div key={course.id} className="bg-white shadow-md rounded-md relative">
                    <Link to={`/course-page/${course.id}`} className="block">
                      {course.imageUrl ? (
                        <img
                          src={course.imageUrl}
                          alt={course.course}
                          className="w-full h-32 object-cover rounded-t-md mb-2"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-200 rounded-t-md mb-2 flex items-center justify-center text-gray-500">
                          No Image
                        </div>
                      )}
                      <div className="p-4">
                        <p className="text-lg">{course.course}</p>
                        <p className="text-sm text-gray-600">{course.description}</p>
                      </div>
                    </Link>
                    <div className="absolute bottom-2 right-2">
                      <button className="text-gray-500 hover:text-gray-700" onClick={() => toggleDropdown(index)}>
                        <i className="bi bi-three-dots-vertical"></i>
                      </button>
                      {dropdownOpen === index && (
                        <div className="absolute right-0 w-40 bg-white rounded shadow-lg z-1 border border-gray-300">
                          <button
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            onClick={() => console.log('Edit course', course.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                            onClick={() => openDeleteModal(course, 'course')}
                          >
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
          <div className="flex-1 p-5 rounded-md bg-white shadow-sm">
            <h2 className="text-xl mb-2">Add Announcement</h2>
            <textarea
              className="w-full p-1 h-24 border border-gray-400 rounded-md resize-none mb-1"
              rows={4}
              placeholder="Write your announcement here..."
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              required
            />
            <div className="mb-3">
              <label htmlFor="audience" className="block mb-1 font-medium">Target Audience</label>
              <select
                id="audience"
                className="w-full p-2 border border-gray-400 rounded-md"
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
              className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!announcement.trim()}
            >
              Add Announcement
            </button>
          </div>

          {/* List Announcements */}
          <div className="w-full mt-4">
            <h2 className="text-xl mb-2">Your Created Announcements</h2>
            {createdAnnouncements.length === 0 ? (
              <p className="text-gray-500">You have not created any announcements yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {createdAnnouncements.map((announcement, index) => (
                  <div key={announcement.id} className="p-5 shadow-md rounded-md bg-gray-50 relative">
                    <div className="absolute top-2 right-2">
                      <button className="text-gray-500 hover:text-gray-700" onClick={() => toggleDropdown(index)}>
                        <i className="bi bi-three-dots-vertical"></i>
                      </button>
                      {dropdownOpen === index && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                          <button
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            onClick={() => openEditModal(announcement)}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                            onClick={() => openDeleteModal(announcement, 'announcement')}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-base text-gray-600">For: {announcement.target}</p>
                    <p className="text-base text-gray-700 mt-2">{announcement.announcement}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Confirm Deletion</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this {deleteType === 'course' ? 'course' : 'announcement'}?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Announcement</h2>
            <textarea
              className="w-full p-1 h-24 border border-gray-500 rounded-md resize-none mb-1"
              rows={4}
              placeholder="Write your announcement here..."
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              required
            />
            <div className="mb-3">
              <label htmlFor="editAudience" className="block mb-1 font-medium">Target Audience</label>
              <select
                id="editAudience"
                className="w-full p-2 border border-gray-500 rounded-md"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Free">Free</option>
                <option value="Basic Plan">Basic Plan</option>
                <option value="Premium Plan">Premium Plan</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEditAnnouncement}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
