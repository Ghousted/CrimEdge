import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHandleAnnouncements } from '../../hooks/useHandleAnnouncements';
import { useHandleCourses } from '../../hooks/useHandleCourses';
import { auth, db } from '../../../firebase'; // Import Firebase configuration
import { onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth functions
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { useHandleStorage } from '../../hooks/useHandleStorage';
import { motion, AnimatePresence } from 'framer-motion'; // Add framer-motion for animations
import Loading from '../../components/Loading'; // Import Loading component


import { useDarkMode } from '../../components/DarkModeContext';

const Dashboard = () => {
  const { courses, enrolledCourses } = useHandleCourses();
  const { announcements, loading: announcementsLoading } = useHandleAnnouncements();
  const { fetchCourseImages } = useHandleStorage();
  const { darkMode } = useDarkMode();

  const [coursesWithImages, setCoursesWithImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerRow, setCardsPerRow] = useState(3);
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('enrolled');

  useEffect(() => {
    const fetchImagesForCourses = async () => {
      try {
        const coursesWithUrls = await Promise.all(
          courses.map(async (course) => {
            if (!course.course) {
              return { ...course, imageUrl: null };
            }
            const imageUrl = await fetchCourseImages(course.course);
            return { ...course, imageUrl };
          })
        );
        setCoursesWithImages(coursesWithUrls);
      } catch (error) {
        console.error('Error fetching course images:', error);
        setCoursesWithImages(courses.map(course => ({ ...course, imageUrl: null })));
      } finally {
        setIsLoading(false);
      }
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

    // Firebase Auth state change listener
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        // Fetch user data from Firestore
        const userDocRef = doc(db, 'users', userAuth.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUser(userDocSnap.data());
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      unsubscribe(); // Unsubscribe from the auth state change listener
    };
  }, []);

  const getCardsPerRow = () => {
    if (window.innerWidth >= 1536) return 4; // 2xl screens
    if (window.innerWidth >= 1280) return 3; // xl screens
    if (window.innerWidth >= 1024) return 3; // lg screens
    if (window.innerWidth >= 768) return 2;  // md screens
    return 1; // sm and xs screens
  };

  const handleDotClick = (index) => {
    setCurrentPage(index);
  };

  const startIdx = currentPage * cardsPerRow;
  const endIdx = startIdx + cardsPerRow;

  // Separate enrolled and other courses
  const enrolledCourseIds = (enrolledCourses || []).map(c => c.id);
  const enrolledCoursesList = coursesWithImages.filter(course => enrolledCourseIds.includes(course.id));
  
  const otherCoursesList = coursesWithImages.filter(course => !enrolledCourseIds.includes(course.id));

  console.log("Enrolled Courses: ", enrolledCoursesList);


  // Pagination for enrolled courses
  const currentEnrolledCourses = enrolledCoursesList.slice(startIdx, endIdx);

  // Pagination for other courses
  const otherStartIdx = currentPage * cardsPerRow;
  const otherEndIdx = otherStartIdx + cardsPerRow;
  const currentOtherCourses = otherCoursesList.slice(otherStartIdx, otherEndIdx);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new':
        return <i className="bi bi-bell text-success"></i>;
      case 'upcoming':
        return <i className="bi bi-calendar-check text-primary"></i>;
      case 'cancelled':
        return <i className="bi bi-x-circle text-danger"></i>;
      case 'reminder':
        return <i className="bi bi-clock text-warning"></i>;
      default:
        return <i className="bi bi-info-circle text-info"></i>;
    }
  };

  // Add these constants at the top of the component, after the state declarations
  const CARD_HEIGHT = 'h-[280px]'; // Fixed height for all cards
  const CARD_IMAGE_HEIGHT = 'h-[140px]'; // Fixed height for card images
  const CARD_CONTENT_HEIGHT = 'h-[140px]'; // Fixed height for card content

  return (
    <section className="relative p-4">
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
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex flex-col gap-4 w-full lg:w-3/4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-xl grd-bg2 p-5 shadow-lg"
            >
              <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:16px_16px]"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-xs text-blue-50 font-medium">Active Session</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Welcome back, {user ? `${user.firstName} ${user.lastName}` : 'Guest'}! 
                </h2>
                <p className="text-sm text-blue-50/90 font-medium">
                  Continue your learning journey with Crim Edge
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-blue-50/90">
                    <i className="bi bi-calendar-check text-sm"></i>
                    <span className="text-xs">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="h-3 w-px bg-blue-50/30"></div>
                  <div className="flex items-center gap-1.5 text-blue-50/90">
                    <i className="bi bi-clock text-sm"></i>
                    <span className="text-xs">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Fix: Use useDarkMode and correct JSX string interpolation */}
            <div
              className={`rounded-lg border ${
                darkMode
                  ? 'bg-[#242526] border-[#3E4042]'
                  : 'bg-[#F0F2F5] border-[#CED0D4]'
              }`}
            >
              <div className={`border-b ${darkMode ? 'border-[#3E4042]' : 'border-[#CED0D4]'}`}>
                <div className="flex">
                  <button
                    className={`flex-1 px-4 py-3 transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 relative rounded-tl-lg ${
                      activeSection === 'enrolled'
                        ? 'bg-gradient-to-r from-white to-blue-200 text-transparent bg-clip-text' // gradient text
                        : darkMode
                          ? 'text-[#B0B3B8] hover:bg-[#23243a] hover:text-white cursor-pointer'
                          : 'text-[#65676B] hover:bg-blue-50 hover:text-blue-700 cursor-pointer'
                    }`}
                    onClick={() => setActiveSection('enrolled')}
                  >
                    {activeSection === 'enrolled' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 grd-bg2 rounded-tl-lg cursor-pointer"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <div className="relative flex items-center gap-1.5">
                      <i
                        className={`bi bi-book ${
                          activeSection === 'enrolled'
                            ? 'text-white drop-shadow-[0_1px_4px_rgba(30,144,255,0.5)]' // white icon with blue shadow
                            : darkMode
                              ? 'text-[#B0B3B8]'
                              : 'text-[#606770]'
                        }`}
                      ></i>
                      <span
                        className={
                          activeSection === 'enrolled'
                            ? 'bg-gradient-to-r from-white to-blue-200 text-transparent bg-clip-text font-bold'
                            : darkMode
                              ? 'text-[#B0B3B8]'
                              : 'text-[#65676B]'
                        }
                      >
                        Enrolled Courses
                      </span>
                      <span
                        className={`px-1.5 py-0.5 text-xs rounded-full font-semibold ${
                          activeSection === 'enrolled'
                            ? darkMode
                              ? 'bg-[#2374E1]/30 text-[#E4E6EB]'
                              : 'bg-[#1877F2]/10 text-[#1877F2]'
                            : darkMode
                              ? 'bg-[#3E4042] text-[#B0B3B8]'
                              : 'bg-[#CED0D4] text-[#606770]'
                        }`}
                      >
                        {enrolledCoursesList.length}
                      </span>
                    </div>
                  </button>
                  <button
                    className={`flex-1 px-4 py-3 transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 relative rounded-tr-lg ${
                      activeSection === 'other'
                        ? 'bg-gradient-to-r from-white to-blue-200 text-transparent bg-clip-text' // gradient text
                        : darkMode
                          ? 'text-[#B0B3B8] hover:bg-[#23243a] hover:text-white cursor-pointer'
                          : 'text-[#65676B] hover:bg-blue-50 hover:text-blue-700 cursor-pointer'
                    }`}
                    onClick={() => setActiveSection('other')}
                  >
                    {activeSection === 'other' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 grd-bg2 rounded-tr-lg cursor-pointer"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <div className="relative flex items-center gap-1.5 ">
                      <i
                        className={`bi bi-grid ${
                          activeSection === 'other'
                            ? 'text-white drop-shadow-[0_1px_4px_rgba(30,144,255,0.5)] curosr-pointer' // white icon with blue shadow
                            : darkMode
                              ? 'text-[#B0B3B8] curosr-pointer'
                              : 'text-[#606770] curosr-pointer'
                        }`}
                      ></i>
                      <span
                        className={
                          activeSection === 'other'
                            ? 'bg-gradient-to-r from-white to-blue-200 text-transparent bg-clip-text font-bold curosr-pointer'
                            : darkMode
                              ? 'text-[#B0B3B8] curosr-pointer'
                              : 'text-[#65676B] curosr-pointer'
                        }
                      >
                        Available Courses
                      </span>
                      <span
                        className={`px-1.5 py-0.5 text-xs rounded-full font-semibold curosr-pointer ${
                          activeSection === 'other'
                            ? darkMode
                              ? 'bg-[#2374E1]/30 text-[#E4E6EB] curosr-pointer'
                              : 'bg-[#1877F2]/10 text-[#1877F2] curosr-pointer'
                            : darkMode
                              ? 'bg-[#3E4042] text-[#B0B3B8] curosr-pointer'
                              : 'bg-[#CED0D4] text-[#606770] curosr-pointer'
                        }`}
                      >
                        {otherCoursesList.length}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="p-3">
                <AnimatePresence mode="wait">
                  {activeSection === 'enrolled' ? (
                    <motion.div 
                      key="enrolled"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="course-container"
                    >
                      {enrolledCoursesList.length === 0 ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`rounded-lg shadow-sm p-6 text-center backdrop-blur-sm ${darkMode ? 'bg-[#242526] text-[#E4E6EB]' : 'bg-white/50 text-gray-800'}`}
                        >
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i className="bi bi-book text-2xl text-blue-500"></i>
                          </div>
                          <h3 className={`text-base font-semibold mb-2 ${darkMode ? 'text-[#E4E6EB]' : 'text-gray-800'}`}>No Enrolled Courses</h3>
                          <p className={`text-sm mb-4 max-w-sm mx-auto ${darkMode ? 'text-[#B0B3B8]' : 'text-gray-600'}`}>Start your learning journey by exploring our available courses.</p>
                          <button 
                            onClick={() => setActiveSection('other')}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all shadow-sm hover:shadow-md"
                          >
                            <i className="bi bi-grid"></i>
                            Browse Courses
                          </button>
                        </motion.div>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3">
                            {currentEnrolledCourses.map((course) => (
                              <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                                className="group"
                              >
                                <Link 
                                  to={`/course/${course.id}`}
                                  className={`block rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 ${CARD_HEIGHT} border ${darkMode ? 'bg-[#242526] border-[#3E4042]' : 'bg-white/50 border-gray-100/50 backdrop-blur-sm'}`}
                                >
                                  <div className={`relative ${CARD_IMAGE_HEIGHT} overflow-hidden`}>
                                    {course.imageUrl ? (
                                      <img
                                        src={course.imageUrl}
                                        alt={course.course}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                      />
                                    ) : (
                                      <div className={`h-full flex items-center justify-center ${darkMode ? 'bg-[#18191A]' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
                                        <div className={`text-2xl ${darkMode ? 'text-[#3E4042]' : 'text-blue-200'}`}>
                                          <i className='bi bi-image'></i>
                                        </div>
                                      </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute top-2 right-2">
                                      <span className="px-1.5 py-0.5 text-xs font-medium text-white bg-blue-500/90 rounded-full backdrop-blur-sm">
                                        Enrolled
                                      </span>
                                    </div>
                                  </div>
                                  <div className={`${CARD_CONTENT_HEIGHT} p-3 flex flex-col`}>
                                    <h2 className={`text-base font-semibold mb-1.5 line-clamp-1 ${darkMode ? 'text-[#E4E6EB]' : 'text-gray-800'}`}>{course.course}</h2>
                                    <p className={`text-xs mb-2 line-clamp-2 flex-grow ${darkMode ? 'text-[#B0B3B8]' : 'text-gray-600'}`}>{course.description || 'No description available'}</p>
                                    <div className={`flex items-center text-xs mt-auto ${darkMode ? 'text-[#B0B3B8]' : 'text-gray-500'}`}>
                                      <i className={`bi bi-person-circle mr-1.5 ${darkMode ? 'text-[#2374E1]' : 'text-blue-500'}`}></i>
                                      {course.createdByName || 'Unknown Instructor'}
                                    </div>
                                  </div>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                          {enrolledCoursesList.length > 0 && (
                            <div className="flex justify-center mt-4 gap-1.5">
                              {Array.from({ length: Math.ceil(enrolledCoursesList.length / cardsPerRow) }, (_, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleDotClick(index)}
                                  className={`h-1.5 rounded-full transition-all duration-300 ${
                                    currentPage === index 
                                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 w-6' 
                                      : 'bg-gray-200 w-1.5 hover:bg-gray-300'
                                  }`}
                                ></button>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="other"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="course-container"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3">
                        {currentOtherCourses.map((course) => (
                          <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -3, transition: { duration: 0.2 } }}
                            className="group"
                          >
                            <Link
                              to={`/course/${course.id}`}
                              className={`block rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 ${CARD_HEIGHT} border ${darkMode ? 'bg-[#242526] border-[#3E4042]' : 'bg-white/50 border-gray-100/50 backdrop-blur-sm'}`}
                            >
                              <div className={`relative ${CARD_IMAGE_HEIGHT} overflow-hidden`}>
                                {course.imageUrl ? (
                                  <img
                                    src={course.imageUrl}
                                    alt={course.course}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                  />
                                ) : (
                                  <div className={`h-full flex items-center justify-center ${darkMode ? 'bg-[#18191A]' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
                                    <div className={`text-2xl ${darkMode ? 'text-[#3E4042]' : 'text-blue-200'}`}>
                                      <i className='bi bi-image'></i>
                                    </div>
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </div>
                              <div className={`${CARD_CONTENT_HEIGHT} p-3 flex flex-col`}>
                                <h2 className={`text-base font-semibold mb-1.5 line-clamp-1 ${darkMode ? 'text-[#E4E6EB]' : 'text-gray-800'}`}>{course.course}</h2>
                                <p className={`text-xs mb-2 line-clamp-2 flex-grow ${darkMode ? 'text-[#B0B3B8]' : 'text-gray-600'}`}>{course.description || 'No description available'}</p>
                                <div className={`flex items-center text-xs mt-auto ${darkMode ? 'text-[#B0B3B8]' : 'text-gray-500'}`}>
                                  <i className={`bi bi-person-circle mr-1.5 ${darkMode ? 'text-[#2374E1]' : 'text-blue-500'}`}></i>
                                  {course.createdByName || 'Unknown Instructor'}
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                      <div className="flex mt-6 justify-center gap-2">
                        {Array.from({ length: Math.ceil(otherCoursesList.length / cardsPerRow) }, (_, index) => (
                          <button
                            key={index}
                            onClick={() => handleDotClick(index)}
                            className={`h-2 w-2 rounded-full transition-all duration-300 ${
                              currentPage === index ? 'bg-gradient-to-r from-blue-500 to-indigo-500 w-4' : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                          ></button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`rounded-xl shadow-sm p-4 sticky top-6 border backdrop-blur-sm ${
                darkMode
                  ? 'bg-[#242526]/90 border-[#3E4042]'
                  : 'bg-white/80 border-gray-100/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className={
                  darkMode
                    ? 'p-1.5 bg-gradient-to-br from-[#18191A] to-[#2374E1]/20 rounded-lg'
                    : 'p-1.5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg'
                }>
                  <i className={`bi bi-megaphone text-lg ${darkMode ? 'text-[#2374E1]' : 'text-blue-500'}`}></i>
                </div>
                <div>
                  <h2 className={`text-base font-semibold ${darkMode ? 'text-[#E4E6EB]' : 'text-gray-800'}`}>Announcements</h2>
                  <p className={`text-xs ${darkMode ? 'text-[#B0B3B8]' : 'text-gray-500'}`}>Latest updates</p>
                </div>
              </div>

              <div className="space-y-3">
                {announcements.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <div className={
                      darkMode
                        ? 'w-12 h-12 bg-gradient-to-br from-[#18191A] to-[#2374E1]/20 rounded-full flex items-center justify-center mx-auto mb-2'
                        : 'w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-2'
                    }>
                      <i className={`bi bi-megaphone text-xl ${darkMode ? 'text-[#2374E1]' : 'text-blue-400'}`}></i>
                    </div>
                    <p className={`text-xs ${darkMode ? 'text-[#B0B3B8]' : 'text-gray-500'}`}>No announcements at the moment</p>
                  </motion.div>
                ) : (
                  announcements.map((announcement, index) => (
                    <motion.div
                      key={announcement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 rounded-lg transition-colors duration-200 border ${
                        darkMode
                          ? 'bg-gradient-to-br from-[#18191A]/80 to-[#2374E1]/10 hover:from-[#18191A]/90 hover:to-[#2374E1]/20 border-[#3E4042]'
                          : 'bg-gradient-to-br from-blue-50/50 to-indigo-50/50 hover:from-blue-50 hover:to-indigo-50 border-blue-100/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <div className={
                            darkMode
                              ? 'w-6 h-6 bg-gradient-to-br from-[#242526] to-[#2374E1]/20 rounded-full flex items-center justify-center'
                              : 'w-6 h-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center'
                          }>
                            <i className={`bi bi-person text-xs ${darkMode ? 'text-[#2374E1]' : 'text-blue-500'}`}></i>
                          </div>
                          <p className={`text-xs font-medium ${darkMode ? 'text-[#E4E6EB]' : 'text-gray-700'}`}>{announcement.createdByName}</p>
                        </div>
                        <span className={`text-xs ${darkMode ? 'text-[#B0B3B8]' : 'text-gray-500'}`}>
                          {announcement.createdAt ? new Date(announcement.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          }) : ''}
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed ${darkMode ? 'text-[#B0B3B8]' : 'text-gray-600'}`}>{announcement.announcement}</p>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
