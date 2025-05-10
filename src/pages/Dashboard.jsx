import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHandleAnnouncements } from '../hooks/useHandleAnnouncements';
import { useHandleCourses } from '../hooks/useHandleCourses';
import { auth, db } from '../../firebase'; // Import Firebase configuration
import { onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth functions
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { useHandleStorage } from '../hooks/useHandleStorage';

const Dashboard = () => {
  const { courses, enrolledCourses } = useHandleCourses();
  const { announcements, loading } = useHandleAnnouncements();
  const { fetchCourseImages } = useHandleStorage();

  const [coursesWithImages, setCoursesWithImages] = useState([]);

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
      }
    };

    if (courses.length > 0) {
      fetchImagesForCourses();
    } else {
      setCoursesWithImages([]);
    }
  }, [courses]);

  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerRow, setCardsPerRow] = useState(3);
  const [user, setUser] = useState(null); // State to store user data
  const [activeSection, setActiveSection] = useState('enrolled'); // State to manage active section

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

  return (
    <section className="p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        <div className="flex flex-col gap-4 lg:gap-6 w-full lg:w-3/4">
          <div className="content-section px-6 sm:px-10 py-5 sm:py-7 grd-bg2 text-white rounded-lg">
            <h2 className="text-2xl sm:text-3xl mb-2">
              Welcome to Crim Edge, {user ? `${user.firstName} ${user.lastName}` : 'Guest'}!
            </h2>
            <p className="text-sm sm:text-base font-medium">Crim Edge: Where your insights shape the next top student.</p>   
          </div>

          <div className="w-full flex flex-wrap gap-3 sm:gap-7 bg-white shadow-md py-3 px-4 rounded-lg justify-start">
            <button
              className={`px-3 sm:px-4 py-2 rounded-md transition-all duration-300 text-sm sm:text-base ${
                activeSection === 'enrolled' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveSection('enrolled')}
            >
              <i className="bi bi-book mr-2"></i>
              Enrolled Courses
            </button>
            <button
              className={`px-3 sm:px-4 py-2 rounded-md transition-all duration-300 text-sm sm:text-base ${
                activeSection === 'other' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveSection('other')}
            >
              <i className="bi bi-grid mr-2"></i>
              Other Courses
            </button>
          </div>

          {activeSection === 'enrolled' && (
            <div className="course-container mb-4">
              {enrolledCoursesList.length === 0 ? (
                <p className="text-gray-500 text-center py-4">You are not enrolled in any courses yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3">
                  {currentEnrolledCourses.map((course) => (
                    <Link key={course.id} to={`/course/${course.id}`} className="bg-white shadow-md rounded-md hover:shadow-lg transition-shadow duration-300">
                      {course.imageUrl ? (
                        <img
                          src={course.imageUrl}
                          alt={course.course}
                          className="w-full h-32 sm:h-36 object-cover rounded-t-md"
                        />
                      ) : (
                        <div className="w-full h-32 sm:h-36 bg-gray-200 rounded-t-md flex items-center justify-center text-gray-500">
                          <div className="text-2xl">
                            <i className='bi bi-image'></i>
                          </div>
                        </div>
                      )}
                      <div className="p-2 sm:p-3">
                        <h2 className="text-sm sm:text-base font-semibold line-clamp-1">{course.course}</h2>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{course.description || '-------'}</p>
                        <p className="text-xs text-gray-500 mt-1">{course.createdByName || 'none'}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              <div className="flex mt-3 justify-center gap-2">
                {Array.from({ length: Math.ceil(enrolledCoursesList.length / cardsPerRow) }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                      currentPage === index ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  ></button>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'other' && (
            <div className="course-container">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3">
                {currentOtherCourses.map((course) => (
                  <Link key={course.id} to={`/course/${course.id}`} className="bg-white shadow-md rounded-md hover:shadow-lg transition-shadow duration-300">
                    {course.imageUrl ? (
                      <img
                        src={course.imageUrl}
                        alt={course.course}
                        className="w-full h-32 sm:h-36 object-cover rounded-t-md"
                      />
                    ) : (
                      <div className="w-full h-32 sm:h-36 bg-gray-200 rounded-t-md flex items-center justify-center text-gray-500">
                        <div className="text-2xl">
                          <i className='bi bi-image'></i>
                        </div>
                      </div>
                    )}
                    <div className="p-2 sm:p-3">
                      <h2 className="text-sm sm:text-base font-semibold line-clamp-1">{course.course}</h2>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{course.description || '-------'}</p>
                      <p className="text-xs text-gray-500 mt-1">{course.createdByName || 'none'}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="flex mt-3 justify-center gap-2">
                {Array.from({ length: Math.ceil(otherCoursesList.length / cardsPerRow) }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                      currentPage === index ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  ></button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 w-full lg:w-1/4">
          <div className="bg-white p-4 rounded-md shadow-md">
            <h1 className='mb-3 text-lg sm:text-xl font-semibold text-gray-800'>
              <i className='bi bi-megaphone mr-2 text-blue-600'></i>
              Instructor Announcements
            </h1>
            <div className='flex flex-col gap-3'>
              {announcements.map(announcement => (
                <div key={announcement.id} className="p-3 border border-gray-200 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <p className="text-sm font-medium text-gray-700">{announcement.createdByName}</p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {announcement.createdAt ? new Date(announcement.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                        month: 'long', day: 'numeric', year: 'numeric'
                      }) : ''}
                    </p>
                  </div>
                  {announcement.createdByName && (
                    <p className="text-sm mt-2 text-gray-600">{announcement.announcement}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
