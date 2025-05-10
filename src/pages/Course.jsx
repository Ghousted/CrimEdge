import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHandleCourses } from '../hooks/useHandleCourses';
import { useHandleAnnouncements } from '../hooks/useHandleAnnouncements'; // Import your hook
import { useHandleLessons } from '../hooks/useHandleLessons';
import { useHandleQuizzes } from '../hooks/useHandleQuizzes';
import { useAuth } from '../auth/components/authContext'; // Add this import
import QuizDisplay from '../components/QuizDisplay';


const Course = () => {
  const { id } = useParams();
  const { createAnnouncement, announcements, createdAnnouncements } = useHandleAnnouncements(id);
  const { courses, enrollStudentInCourse, enrolledCourses, courseLimit } = useHandleCourses(); // Get courses from hook
  const { lessons, loading: lessonsLoading } = useHandleLessons(id);
  const { membershipPlan } = useAuth(); // Add this line
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('lessons');
  const [confirmed, setConfirmed] = useState(false);

  const [loading, setLoading] = React.useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const {
    quizzes,
    loading: quizzesLoading,
    submitQuizAttempt,
    getQuizAttempts
  } = useHandleQuizzes(id);

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

  // Check if user has free membership and has reached the 2-course limit
  if (!confirmed && membershipPlan?.plan === 'Free' && enrolledCourses?.length >= 2) {
    return (
      <section className="p-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-6">
            <div className="flex items-center justify-center mb-4">
              <i className="bi bi-lock-fill text-4xl text-white"></i>
            </div>
            <h2 className="text-3xl font-bold text-center text-white mb-2">Course Limit Reached</h2>
            <p className="text-center text-yellow-100">You've reached the maximum courses for your Free plan</p>
          </div>
          
          <div className="p-8">
            <div className="bg-yellow-50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-yellow-800 mb-3">Current Plan Limitations</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-yellow-700">
                  <i className="bi bi-check-circle-fill mr-2"></i>
                  <span>Maximum 2 courses allowed</span>
                </li>
                <li className="flex items-center text-yellow-700">
                  <i className="bi bi-check-circle-fill mr-2"></i>
                  <span>Basic course access</span>
                </li>
                <li className="flex items-center text-yellow-700">
                  <i className="bi bi-check-circle-fill mr-2"></i>
                  <span>Standard learning materials</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">Upgrade Benefits</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-blue-700">
                  <i className="bi bi-star-fill mr-2"></i>
                  <span>Unlimited course access</span>
                </li>
                <li className="flex items-center text-blue-700">
                  <i className="bi bi-star-fill mr-2"></i>
                  <span>Premium learning materials</span>
                </li>
                <li className="flex items-center text-blue-700">
                  <i className="bi bi-star-fill mr-2"></i>
                  <span>Priority support</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate('/upgrade-plan')}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold flex items-center justify-center"
              >
                <i className="bi bi-arrow-up-circle-fill mr-2"></i>
                Upgrade Plan
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-semibold flex items-center justify-center"
              >
                <i className="bi bi-arrow-left-circle-fill mr-2"></i>
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Check if user has reached their plan's course limit
  if (!confirmed && courseLimit) {
    return (
      <section className="p-6 text-center bg-yellow-100 border border-yellow-400 rounded-md">
        <h2 className="text-2xl font-semibold mb-4 text-yellow-800">Course Limit Reached</h2>
        <p className="mb-4 text-yellow-700">
          You have reached the maximum number of courses allowed for your current plan.
        </p>
        <p className="mb-6 text-yellow-700">
          To enroll in more courses, please upgrade your membership plan.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/subscription/upgrade-plan')}
            className="px-6 py-3 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Upgrade Plan
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back to Dashboard
          </button>
        </div>
      </section>
    );
  }

  if (!confirmed) {
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
            <div className="bg-white shadow-md p-6 rounded-lg">
              <h2 className="font-bold text-xl mb-4">Course Lessons</h2>
              {lessonsLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : lessons.length === 0 ? (
                <div className="text-center py-8">
                  <i className="bi bi-book text-4xl text-gray-400 mb-4"></i>
                  <p className="text-gray-500">No lessons available yet.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {lessons.map((lesson) => (
                    <div key={lesson.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                      <div className="mb-2">
                        <h3 className="text-lg font-medium text-gray-800">{lesson.title}</h3>
                        <p className="text-sm text-gray-500">{lesson.createdByName}</p>
                      </div>
                      <p className="text-gray-600 mb-3">{lesson.description}</p>
                      <div className="flex items-center gap-2">
                        <i className={`bi ${lesson.fileType.includes('pdf') ? 'bi-file-pdf' : 'bi-file-play'} text-blue-600`}></i>
                        <a
                          href={lesson.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {lesson.fileName}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === 'quizzes' && (
          <div className='w-full max-w-7xl mx-auto p-2 flex flex-col gap-4'>
            <div className="bg-white shadow-md p-6 rounded-lg">
              <h2 className="font-bold text-xl mb-4">Course Quizzes</h2>
              {quizzesLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : quizzes.length === 0 ? (
                <div className="text-center py-8">
                  <i className="bi bi-pencil-square text-4xl text-gray-400 mb-4"></i>
                  <p className="text-gray-500">No quizzes available yet.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {quizzes.map((quiz) => (
                    <div key={quiz.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-800 mb-1">{quiz.title}</h3>
                          <p className="text-gray-600">Topic: {quiz.topic}</p>
                          <p className="text-gray-500 text-sm mt-2">
                            {quiz.questions.length} questions • Created by {quiz.createdByName}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedQuiz(quiz)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Take Quiz
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

      {/* Quiz Display Modal */}
      {selectedQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Quiz</h2>
              <button
                onClick={() => setSelectedQuiz(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="bi bi-x-lg text-xl"></i>
              </button>
            </div>
            <QuizDisplay
              quiz={selectedQuiz}
              onSubmitQuiz={submitQuizAttempt}
              onViewResults={getQuizAttempts}
              isInstructor={false}
            />
          </div>
        </div>
      )}

    </>
  );
};

export default Course;
