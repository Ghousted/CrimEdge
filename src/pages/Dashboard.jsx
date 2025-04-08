import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const courses = [
    { id: 1, name: 'Course 1', lessons: 'Lessons: 2', instructor: 'Instructor: John Doe' },
    { id: 2, name: 'Course 2', lessons: 'Lessons: 4', instructor: 'Instructor: Jane Smith' },
    { id: 3, name: 'Course 3', lessons: 'Lessons: 6', instructor: 'Instructor: Bob Johnson' },
    { id: 4, name: 'Course 4', lessons: 'Lessons: 8', instructor: 'Instructor: Alice Brown' },
    { id: 5, name: 'Course 5', lessons: 'Lessons: 10', instructor: 'Instructor: Mike Davis' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Cybersecurity Webinar', date: 'April 10, 2025' },
    { id: 2, title: 'AI in Criminal Justice', date: 'April 15, 2025' },
  ];

  const recentActivity = [
    { id: 1, description: 'You completed the Digital Forensics course.', time: '2 hours ago' },
    { id: 2, description: 'You enrolled in Crime Scene Investigation.', time: 'Yesterday' },
  ];

  const liveAnnouncements = [
    { id: 1, message: 'New quiz available in Cybersecurity 101.', type: 'new' },
    { id: 2, message: 'Live Q&A session with an expert on April 12.', type: 'upcoming' },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerRow, setCardsPerRow] = useState(4);
  const [direction, setDirection] = useState(null);

  const getCardsPerRow = () => {
    if (window.innerWidth >= 1024) return 4;
    if (window.innerWidth >= 768) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  };

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
          <div className="content-section px-10 py-5 mb-5">
            <h2 className="text-3xl font-semibold mb-2">Welcome to Crim Edge, Aiah!</h2>
            <p className="text-base italic font-medium">Crim Edge: Where your insights shape the next top student.</p>
            <div className="learn"><button>Learn More</button></div>
          </div>

          <h1 className='-mb-5 -mt-5 text-2xl'>Courses</h1>
          <div className="course-container">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {currentCourses.map((course) => (
                <Link key={course.id} to={`/course/${course.id}`} className="courses-card p-4 border rounded-lg">
                <h2 className="text-xl">{course.name}</h2>
                <p className="text-sm">{course.lessons}</p>
                <p className="text-sm">{course.instructor}</p>
              </Link>
              
              ))}
            </div>
            <div className="flex mt-4 justify-between gap-5">
              <button
                onClick={handlePrev}
                disabled={currentPage === 0}
                className="prev-next-btn"
              >
                Prev
              </button>
              <button
                onClick={handleNext}
                disabled={(currentPage + 1) * cardsPerRow >= courses.length}
                className="prev-next-btn"
              >
                Next
              </button>
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
                <div key={event.id} className="p-1">
                  <div className="flex">
                    <div className="content-center">
                    <i  className='bi bi-bell mr-3'></i>
                    </div>
                  <div className="flex flex-col">
                    <h2 className="text-sm font-medium">{event.title}</h2>
                    <p className="text-xs text-gray-600">{event.date}</p>
                  </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="content-section p-5">
            <h1 className='mb-5 text-xl'><i className='bi bi-clock mr-2'></i>Recent Activity</h1>
            <div className='flex flex-col gap-3'>
              {recentActivity.map(activity => (
                <div key={activity.id} className="p-1">
                  <div className="flex">
                    <div className="content-center">
                      <i className='bi bi-bell mr-2'></i>
                    </div>
                    <div className="flex flex-col">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="content-section p-5">
            <h1 className='mb-5 text-xl'><i className='bi bi-broadcast mr-2'></i>Live and Announcements</h1>
            <div className='flex flex-col gap-2'>
              {liveAnnouncements.map(announcement => (
                <div key={announcement.id} className="p-1">
                 <div className="flex">
                  <div className="content-center">
                      <i  className='bi bi-bell mr-2'></i>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm">{announcement.message}</p>
                  </div>
                 </div>
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
