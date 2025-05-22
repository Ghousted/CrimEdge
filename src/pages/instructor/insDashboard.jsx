import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useHandleAnnouncements } from '../../hooks/useHandleAnnouncements';
import { useHandleCourses } from '../../hooks/useHandleCourses';
import { useHandleStorage } from '../../hooks/useHandleStorage';
import { motion, AnimatePresence } from 'framer-motion';
import Loading from '../../components/Loading';
import { auth, db } from '../../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useDarkMode } from '../../components/DarkModeContext';

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
  const [isLoading, setIsLoading] = useState(true);
  const [cardsPerRow, setCardsPerRow] = useState(3);
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const { darkMode } = useDarkMode();

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
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const fetchImagesForCourses = async () => {
      const coursesWithUrls = await Promise.all(
        courses.map(async (course) => {
          const imageUrl = await fetchCourseImages(course.course);
          return { ...course, imageUrl };
        })
      );
      setCoursesWithImages(coursesWithUrls);
      setIsLoading(false);
    };

    if (courses.length > 0) {
      fetchImagesForCourses();
    } else {
      setCoursesWithImages([]);
      setIsLoading(false);
    }
  }, [courses]);

  useEffect(() => {
    const handleResize = () => {
      setCardsPerRow(getCardsPerRow());
    };

    setCardsPerRow(getCardsPerRow());
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        const userDocRef = doc(db, 'users', userAuth.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUser(userDocSnap.data());
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const getCardsPerRow = () => {
    if (window.innerWidth >= 1536) return 4;
    if (window.innerWidth >= 1280) return 3;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  };

  const handleAddCourse = async () => {
    await addNewCourse(courseName, courseDescription);

    if (courseImage && courseName) {
      await uploadCourseImages(courseImage, courseName);
    }

    window.location.reload();

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
    window.location.reload();

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

  const CARD_HEIGHT = 'h-[240px]';
  const CARD_IMAGE_HEIGHT = 'h-[120px]';
  const CARD_CONTENT_HEIGHT = 'h-[120px]';

  return (
    <section className={`relative p-4 `}>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-blue-500/10 animate-pulse"></div>
            <Loading />
          </div>
        </motion.div>
      )}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex flex-col gap-3 w-full lg:w-3/4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative overflow-hidden rounded-xl p-5 shadow-lg grd-bg2`}
            >
              <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:16px_16px]"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-xs text-blue-50 font-medium">Instructor Dashboard</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
                  Welcome back, {user ? `${user.firstName} ${user.lastName}` : 'Instructor'}!
                </h2>
                <p className="text-sm text-blue-50/90 font-medium">
                  Manage your courses and announcements with Crim Edge
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-blue-50/90">
                    <i className="bi bi-calendar-check text-sm"></i>
                    <span className="text-xs">{currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="h-3 w-px bg-blue-50/30"></div>
                  <div className="flex items-center gap-1.5 text-blue-50/90">
                    <i className="bi bi-clock text-sm"></i>
                    <span className="text-xs">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Add Course Section */}
            <div className={`rounded-xl shadow-sm p-4 border ${darkMode ? 'bg-[#242526] border-gray-700' : 'bg-white/80 border-gray-100/50'}`}>
              <h2 className={`text-lg mb-3 flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                <i className="bi bi-plus-circle-fill text-blue-600"></i>
                Add New Course
              </h2>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col md:flex-row gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Enter course code"
                    className={`flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm ${darkMode ? 'bg-[#242526] border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'}`}
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Enter course description"
                    className={`flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm ${darkMode ? 'bg-[#242526] border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'}`}
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="courseImage"
                      className={`flex items-center gap-2 cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200 rounded-lg p-2 border ${darkMode ? 'bg-[#242526] border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                    >
                      <i className='bi bi-card-image'></i>
                      Upload Image
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
                  <div className={`flex items-center gap-3 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <div className='flex justify-between w-full items-center'>
                      <div className='flex items-center gap-3'>
                        <img
                          src={URL.createObjectURL(courseImage)}
                          alt="Preview"
                          className="w-24 h-14 object-cover rounded-l-lg"
                        />
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{courseImage.name}</span>
                      </div>
                      <button
                        className='text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center gap-2 mr-3 text-sm'
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
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-md text-sm"
                  disabled={!courseName.trim() || !courseDescription.trim()}
                >
                  <i className="bi bi-plus-circle"></i>
                  Add Course
                </button>
              </div>
            </div>

            {/* Display Courses */}
            <div className={`rounded-xl shadow-sm p-4 border ${darkMode ? 'bg-[#242526] border-gray-700' : 'bg-white/80 border-gray-100/50'}`}>
              <h2 className={`text-lg font-bold mb-3 flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                <i className="bi bi-collection-fill text-blue-600"></i>
                Your Courses
              </h2>
              {coursesLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : coursesWithImages.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <i className="bi bi-book text-4xl text-gray-400 mb-3"></i>
                  <p className="text-gray-500">You have not created any courses yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3">
                  {coursesWithImages.map((course) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -3, transition: { duration: 0.2 } }}
                      className="group"
                    >
                      <Link
                        to={`/course-page/${course.id}`}
                        className={`block rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border ${darkMode ? 'bg-[#242526] border-gray-600' : 'bg-white/50 border-gray-100/50'} ${CARD_HEIGHT}`}
                      >
                        <div className={`relative ${CARD_IMAGE_HEIGHT} overflow-hidden`}>
                          {course.imageUrl ? (
                            <img
                              src={course.imageUrl}
                              alt={course.course}
                              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                              <div className="text-2xl text-blue-200">
                                <i className='bi bi-image'></i>
                              </div>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute top-2 right-2">
                            <button
                              className={`text-gray-500 hover:text-gray-700 rounded-full p-1.5 shadow-md hover:shadow-lg transition-all duration-200 ${darkMode ? 'bg-white/20' : 'bg-white/90'}`}
                              onClick={(e) => {
                                e.preventDefault();
                                toggleDropdown(`course-${course.id}`);
                              }}
                            >
                              <i className="bi bi-three-dots-vertical"></i>
                            </button>
                            {dropdownOpen === `course-${course.id}` && (
                              <div className={`absolute right-0 mt-2 w-40 rounded-lg shadow-lg border z-10 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                                <button
                                  className={`flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50 text-red-600 transition-colors duration-200 ${darkMode ? 'hover:bg-gray-600' : ''}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    openDeleteModal(course, 'course');
                                  }}
                                >
                                  <i className="bi bi-trash"></i>
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className={`${CARD_CONTENT_HEIGHT} p-3 flex flex-col`}>
                          <h3 className={`text-base font-semibold mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{course.course}</h3>
                          <p className={`text-xs line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{course.description}</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Announcements Section */}
          <div className="w-full lg:w-1/4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`rounded-xl shadow-sm p-4 sticky top-6 border ${darkMode ? 'bg-[#242526] border-gray-700' : 'bg-white/80 border-gray-100/50'}`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="">
                  <i className="bi bi-megaphone text-base text-blue-500 mr-2 "></i>
                </div>
                <div>
                  <h2 className={`text-base font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Announcements</h2>
                </div>
              </div>

              <div className="mb-4">
                <textarea
                  className={`w-full p-2 h-20 border rounded-lg resize-none mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'}`}
                  placeholder="Write your announcement here..."
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  required
                />
                <div className="mb-4">
                  <label className={`block mb-1 text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Target Audience</label>
                  <select
                    className={`w-full p-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'}`}
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
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium text-sm"
                  disabled={!announcement.trim()}
                >
                  <i className="bi bi-plus-circle"></i>
                  Add Announcement
                </button>
              </div>

              <div className="space-y-2">
                {createdAnnouncements.map((announcement) => (
                  <motion.div
                    key={announcement.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                   className={`p-3 rounded-lg transition-colors duration-200 border ${
                        darkMode
                          ? 'bg-gradient-to-br from-[#18191A]/80 to-[#2374E1]/10 hover:from-[#18191A]/90 hover:to-[#2374E1]/20 border-[#3E4042]'
                          : 'bg-gradient-to-br from-blue-50/50 to-indigo-50/50 hover:from-blue-50 hover:to-indigo-50 border-blue-100/50'
                      }`}
                  >
                    <div className="mb-1.5">
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                        {announcement.target}
                      </span>
                    </div>
                    <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{announcement.announcement}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-xl shadow-xl w-[90%] max-w-sm ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
          >
            <h2 className="text-xl font-bold mb-3">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete this {deleteType}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center gap-2"
              >
                <i className="bi bi-trash"></i>
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-xl shadow-xl w-[90%] max-w-sm ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
          >
            <h2 className="text-xl font-bold mb-4">Edit Announcement</h2>
            <textarea
              className={`w-full p-3 h-24 border rounded-lg resize-none mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'}`}
              placeholder="Write your announcement here..."
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              required
            />
            <div className="mb-4">
              <label className={`block mb-1.5 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Target Audience</label>
              <select
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'}`}
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
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleEditAnnouncement}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
              >
                <i className="bi bi-check-lg"></i>
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
