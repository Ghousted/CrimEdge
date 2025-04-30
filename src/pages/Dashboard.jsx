import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHandleAnnouncements } from '../hooks/useHandleAnnouncements';
import { useHandleCourses } from '../hooks/useHandleCourses';
import { auth, db } from '../../firebase'; // Import Firebase configuration
import { onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth functions
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions

const Dashboard = () => {
  const { courses, enrolledCourses } = useHandleCourses();
  const { announcements, loading } = useHandleAnnouncements();

  console.log("Enrolled Courses: ", enrolledCourses);


  const upcomingEvents = [
    { id: 1, title: 'Cybersecurity Webinar', date: 'April 10, 2025' },
    { id: 2, title: 'AI in Criminal Justice', date: 'April 15, 2025' },
  ];

  const recentActivity = [
    { id: 1, description: 'You completed the Digital Forensics course.', time: '2 hours ago' },
    { id: 2, description: 'You enrolled in Crime Scene Investigation.', time: 'Yesterday' },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerRow, setCardsPerRow] = useState(4);
  const [direction, setDirection] = useState(null);
  const [user, setUser] = useState(null); // State to store user data

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
    if (window.innerWidth >= 1024) return 4;
    if (window.innerWidth >= 768) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  };

  const handleNext = () => {
    if ((currentPage + 1) * cardsPerRow < courses.length) {
      setDirection('next');
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setDirection('prev');
      setCurrentPage(currentPage - 1);
    }
  };

  const startIdx = currentPage * cardsPerRow;
  const endIdx = startIdx + cardsPerRow;
  const currentCourses = courses.slice(startIdx, endIdx);

  // Separate enrolled and other courses
  const enrolledCoursesList = courses.filter(course => enrolledCourses.includes(course.id));
  const otherCoursesList = courses.filter(course => !enrolledCourses.includes(course.id));

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
    <section className="p-6">
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="flex flex-col gap-7 w-full lg:w-5/7">
          <div className="content-section px-10 py-7 mb-5">
            <h2 className="text-3xl mb-2">
              Welcome to Crim Edge, {user ? `${user.firstName} ${user.lastName}` : 'Guest'}!
            </h2>
            <p className="text-base font-medium">Crim Edge: Where your insights shape the next top student.</p>
          </div>

          <h1 className='-mb-5 -mt-5 text-2xl'>Enrolled Courses</h1>
          <div className="course-container mb-8">
            {enrolledCoursesList.length === 0 ? (
              <p className="text-gray-500">You are not enrolled in any courses yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {enrolledCoursesList.map((course) => (
                  <Link key={course.id} to={`/course/${course.id}`} className="courses-card p-4 border rounded-lg">
                    <h2 className="text-xl">{course.course}</h2>
                    <p className="text-base">{course.description || '-------'}</p>
                    <p className="text-sm">{course.createdByName || 'none'}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <h1 className='-mb-5 -mt-5 text-2xl'>Other Courses</h1>
          <div className="course-container">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {currentOtherCourses.map((course) => (
                <Link key={course.id} to={`/course/${course.id}`} className="courses-card p-4 border rounded-lg">
                  <h2 className="text-xl">{course.course}</h2>
                  <p className="text-base">{course.description || '-------'}</p>
                  <p className="text-sm">{course.createdByName || 'none'}</p>
                </Link>
              ))}
            </div>
            <div className="flex mt-4 justify-between gap-5">
              <button onClick={handlePrev} disabled={currentPage === 0} className="prev-next-btn">Prev</button>
              <button onClick={handleNext} disabled={(currentPage + 1) * cardsPerRow >= otherCoursesList.length} className="prev-next-btn">Next</button>
            </div>
          </div>

          <div className="content-section p-5">
            <h2 className="text-xl font-medium mb-2">Progress</h2>
            <p className="text-lg">$5,000</p>
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full lg:w-2/7">
          <div className="content-section p-5">
            <h1 className='mb-5 text-xl'><i className='bi bi-calendar-check mr-2'></i>Upcoming Events</h1>
            <div className="flex flex-col gap-3">
              {upcomingEvents.map(event => (
                <div key={event.id} className="p-1 flex items-start gap-3">
                  <i className='bi bi-bell'></i>
                  <div>
                    <h2 className="text-sm font-medium">{event.title}</h2>
                    <p className="text-xs text-gray-600">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="content-section p-5">
            <h1 className='mb-5 text-xl'><i className='bi bi-clock mr-2'></i>Recent Activity</h1>
            <div className='flex flex-col gap-3'>
              {recentActivity.map(activity => (
                <div key={activity.id} className="p-1 flex items-start gap-3">
                  <i className='bi bi-bell'></i>
                  <div>
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="content-section p-5 mt-6 border-t border-gray-300">
            <h1 className='mb-5 text-xl'><i className='bi bi-megaphone mr-2'></i>Instructor Announcements</h1>
            <div className='flex flex-col gap-3'>
              {announcements.map(announcement => (
                <div key={announcement.id} className="p-2 border rounded-md bg-gray-50">
                  <p className="text-sm">{announcement.announcement}</p>
                  {announcement.createdByName && (
                    <>
                      <p className="text-xs text-gray-500 mt-1">By: {announcement.createdByName}</p>
                      <p className="text-xs text-gray-500 mt-1">Date: {announcement.createdAt ? new Date(announcement.createdAt.seconds * 1000).toLocaleString() : ''}</p>
                    </>
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
