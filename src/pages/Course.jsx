import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHandleCourses } from '../hooks/useHandleCourses';
import { useHandleAnnouncements } from '../hooks/useHandleAnnouncements'; // Import your hook


const Course = () => {
  const { id } = useParams();
  const { createAnnouncement, announcements, createdAnnouncements } = useHandleAnnouncements(id);
  const { courses, enrollStudentInCourse, enrolledCourses, courseLimit } = useHandleCourses(); // Get courses from hook
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('lessons');
  const [confirmed, setConfirmed] = useState(false);

  const [loading, setLoading] = React.useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);

  //hindi pa ayos, lumalabas yung access course confirmation section kahit enrolled na
  useEffect(() => {
    const checkEnrollment = () => {
      const dataReady = enrolledCourses && courses && courses.length > 0;
  
      if (!dataReady) {
        console.log("Waiting for enrolledCourses or courses to load...");
        setLoading(true);
        return;
      }
  
      const isEnrolled = enrolledCourses.some(course => course.id === id);

      console.log("Enrolled courses:", enrolledCourses);
      console.log("Is enrolled in course:", isEnrolled);
  
      setConfirmed(isEnrolled);
      setLoading(false);
    };
    
    setLoading(true); // Set loading to true before checking enrollment
    checkEnrollment();
  }, [id, enrolledCourses, courses]);
  

  const course = courses?.find(c => c.id === id) || null;


  if (loading || course === null) {
    return <div className="p-6 text-center text-gray-700">Loading...</div>;
  }

  if (isEnrolling) {
    return <div className="p-6 text-center text-gray-700">Processing enrollment...</div>;
  }

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  const handleConfirm = async () => {
    setIsEnrolling(true);
    await enrollStudentInCourse(course.id); // Enroll the student in the course
    window.location.reload(); // Reload the page to reflect the changes
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };



  if (courseLimit) {
    return (
      <section className="p-6 text-center bg-yellow-100 border border-yellow-400 rounded-md">
        <h2 className="text-2xl font-semibold mb-4 text-yellow-800">Course Limit Reached</h2>
        <p className="mb-4 text-yellow-700">
          You have reached the maximum number of courses allowed for your current plan.
        </p>
        <p className="mb-6 text-yellow-700">
          To enroll in more courses, please upgrade your membership plan.
        </p>
        <button
          onClick={() => navigate('/upgrade-plan')}
          className="px-6 py-3 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Upgrade Plan
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Dashboard
        </button>
      </section>
    );
  }

  if (confirmed === false) {
    console.log('Course not confirmed yet');
    return (
      <section className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Are you sure you want to access this course?</h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Yes
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            No
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="">
        {/* Header with section buttons */}
        <div className="w-full flex gap-5 bg-white shadow-md py-2 px-4  justify-start mb-4">
          <div
            className={`cursor-pointer relative ${activeSection === 'lessons' ? 'active-underline' : ''}`}
            onClick={() => handleSectionClick('lessons')}
          >
            Lessons
          </div>
          <div
            className={`cursor-pointer relative ${activeSection === 'announcements' ? 'active-underline' : ''}`}
            onClick={() => handleSectionClick('announcements')}
          >
            Announcements
          </div>
          <div
            className={`cursor-pointer relative ${activeSection === 'quizzes' ? 'active-underline' : ''}`}
            onClick={() => handleSectionClick('quizzes')}
          >
            Quizzes
          </div>
          <div
            className={`cursor-pointer relative ${activeSection === 'workload' ? 'active-underline' : ''}`}
            onClick={() => handleSectionClick('workload')}
          >
            Workload
          </div>
        </div>

        {/* Render sections based on active state */}
        {activeSection === 'lessons' && (
          <div className='w-full max-w-7xl mx-auto p-2 flex flex-col gap-4'>
            <div className="bg-white shadow-md p-4 rounded-lg">
            <h2 className="font-bold text-lg">Lessons</h2>
            <p>{course.description}</p>
            <p>Number of lessons: {course.lessons}</p>
          </div>
          </div>
        )}

        {activeSection === 'quizzes' && (
          <div className='w-full max-w-7xl mx-auto p-2 flex flex-col gap-4'>
            <div className="bg-white shadow-md p-4 rounded-lg">
            <h2 className="font-bold text-lg">Quizzes</h2>
            <p>Quizzes section content here.</p>
          </div>
          </div>
        )}

        {activeSection === 'workload' && (
          <div className='w-full max-w-7xl mx-auto p-2 flex flex-col gap-4'>
            <div className="bg-white shadow-md p-4 rounded-lg">
            <h2 className="font-bold text-lg">Workload</h2>
            <p>Workload section content here.</p>
          </div>
          </div>
        )}

{activeSection === 'announcements' && (
  <div className="w-full max-w-7xl mx-auto p-2 flex flex-col bg-white shadow-md p-4 rounded-lg">
    <h1 className='mb-3 text-xl'>
      <i className='bi bi-megaphone mr-5 text-lg'></i>Announcement for {course.course}
    </h1>
    <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
      {announcements.length === 0 ? (
        <p className="text-gray-500 col-span-full">No announcements for this course yet.</p>
      ) : (
        announcements.map(announcement => (
          <div key={announcement.id} className="p-5 border border-gray-200 rounded-md bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">{announcement.createdByName}</p>
              <p className="text-sm text-gray-500">
                {announcement.createdAt
                  ? new Date(announcement.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : ''}
              </p>
            </div>
            <p className="text-sm mt-2">{announcement.announcement}</p>
            <p className="text-xs text-gray-500 mt-1">Target: {announcement.target}</p>
          </div>
        ))
      )}
    </div>
  </div>
)}

      </section>


    </>
  );
};

export default Course;
