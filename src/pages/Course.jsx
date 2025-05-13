import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHandleCourses } from '../hooks/useHandleCourses';
import { useHandleAnnouncements } from '../hooks/useHandleAnnouncements'; // Import your hook
<<<<<<< HEAD
import { useAuth } from '../auth/components/authContext'; // Add this import


const Course = () => {
  const { id } = useParams();
  const { createAnnouncement, announcements, createdAnnouncements } = useHandleAnnouncements(id);
  const { courses, enrollStudentInCourse, enrolledCourses, courseLimit } = useHandleCourses(); // Get courses from hook
  const { membershipPlan } = useAuth(); // Add this line
  const navigate = useNavigate();
=======
import { useHandleLessons } from '../hooks/useHandleLessons';
import { useHandleQuizzes } from '../hooks/useHandleQuizzes';
import { useAuth } from '../auth/components/authContext'; // Add this import
import QuizDisplay from '../components/QuizDisplay';


const Course = () => {
  try {
    const { id } = useParams();
    const { createAnnouncement, announcements, createdAnnouncements } = useHandleAnnouncements(id);
    const { courses, enrollStudentInCourse, enrolledCourses, courseLimit } = useHandleCourses(); // Get courses from hook
    const { lessons } = useHandleLessons(id);
    const { membershipPlan } = useAuth(); // Add this line
    const navigate = useNavigate();
>>>>>>> a711f2fb5b47023c7025d20f9f83347e8af47cf9

    const [activeSection, setActiveSection] = useState('lessons');
    const [confirmed, setConfirmed] = useState(false);

    const [loading, setLoading] = React.useState(true);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [selectedLecture, setSelectedLecture] = useState(null);

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

<<<<<<< HEAD
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
  if (membershipPlan?.plan === 'Free' && enrolledCourses?.length >= 2) {
    return (
      <section className="p-6 text-center bg-yellow-100 border border-yellow-400 rounded-md">
        <h2 className="text-2xl font-semibold mb-4 text-yellow-800">Free Plan Course Limit Reached</h2>
        <p className="mb-4 text-yellow-700">
          You have reached the maximum number of courses (2) allowed for the Free plan.
        </p>
        <p className="mb-6 text-yellow-700">
          Upgrade to a paid plan to access more courses and additional features.
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
=======
    // Check if user has free membership and has reached the 2-course limit
    if (!confirmed && membershipPlan?.plan === 'Free' && enrolledCourses?.length >= 2) {
      return (
        <section className="p-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 via-blue-600 to-purple-600 p-6">
              <div className="flex items-center justify-center mb-4">
                <i className="bi bi-lock-fill text-4xl text-white"></i>
              </div>
              <h2 className="text-3xl font-bold text-center text-white mb-2">Course Limit Reached</h2>
              <p className="text-center text-yellow-100">You've reached the maximum courses for your Free plan</p>
            </div>

            <div className="p-8">
              <div className="bg-red-50 rounded-lg p-6 mb-6">
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
>>>>>>> a711f2fb5b47023c7025d20f9f83347e8af47cf9
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
        <section className="bg-gray-50 min-h-screen">
          {/* Enhanced Header with course info and section buttons */}
          <div className="bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-6 py-4">
              <div className="mb-3">
                <h1 className="text-xl font-semibold text-gray-900">{course?.course}</h1>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                  <p className="line-clamp-1">{course?.description}</p>
                  <span className="text-gray-300">•</span>
                  <p>Instructor: {course?.createdByName}</p>
                </div>
              </div>

              <div className="flex gap-4 border-b border-gray-100">
                <button
                  className={`pb-3 px-2 font-medium text-sm transition-all duration-200 ${activeSection === 'lessons'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                  onClick={() => handleSectionClick('lessons')}
                >
                  <i className="bi bi-book mr-1.5"></i>Lessons
                </button>
                <button
                  className={`pb-3 px-2 font-medium text-sm transition-all duration-200 ${activeSection === 'announcements'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                  onClick={() => handleSectionClick('announcements')}
                >
                  <i className="bi bi-megaphone mr-1.5"></i>Announcements
                </button>
                <button
                  className={`pb-3 px-2 font-medium text-sm transition-all duration-200 ${activeSection === 'quizzes'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                  onClick={() => handleSectionClick('quizzes')}
                >
                  <i className="bi bi-pencil-square mr-1.5"></i>Quizzes
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Content Sections */}
          {activeSection === 'lessons' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sidebar: Sections & Lectures */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Course Content</h2>
                  <div className="space-y-4">
                    {lessons.map((lesson, idx) => (
                      <div key={lesson.id} className="border border-gray-200 rounded-lg">
                        <details className="group" open={idx === 0}>
                          <summary className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                            <div className="flex items-center gap-2">
                              <i className="bi bi-chevron-right group-open:rotate-90 transition-transform text-gray-600"></i>
                              <h3 className="font-medium text-sm text-gray-800">{lesson.title}</h3>
                            </div>
                          </summary>
                          <ul className="px-3 py-2 space-y-2">
                            {Array.isArray(lesson.lectures) && lesson.lectures.length > 0 ? (
                              lesson.lectures.map((lec, lidx) => (
                                <li
                                  key={lidx}
                                  onClick={() => setSelectedLecture(lec)}
                                  className={`flex items-center gap-2 p-2 text-sm rounded-md cursor-pointer transition-colors ${selectedLecture?.title === lec.title
                                    ? 'bg-blue-100 text-blue-700 font-semibold'
                                    : 'hover:bg-gray-50 text-gray-700'
                                    }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={lec.isCompleted}
                                    readOnly
                                    className="accent-blue-600"
                                  />
                                  <span>{lec.title}</span>
                                </li>
                              ))
                            ) : (
                              <li className="text-gray-400 italic text-sm">No lectures</li>
                            )}
                          </ul>
                        </details>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Panel: Lecture Content */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 h-full">
                  {selectedLecture ? (
                    <>
                      <h2 className="text-xl font-bold text-gray-800 mb-2">{selectedLecture.title}</h2>
                      <p className="text-gray-700 text-sm">{selectedLecture.content || 'No description available.'}</p>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-lg">
                      Select a lecture to view its content.
                    </div>
                  )}
                </div>
              </div>
            </div>

          )}

          {activeSection === 'quizzes' && (
            <div className='max-w-6xl mx-auto px-4 py-4'>
              <div className="p-2">
                <h2 className="text-lg font-medium text-gray-900 mb-3">Course Quizzes</h2>
                {quizzesLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : quizzes.length === 0 ? (
                  <div className="text-center py-8 bg-white rounded-lg border border-gray-100">
                    <i className="bi bi-pencil-square text-4xl text-gray-300 mb-2"></i>
                    <p className="text-gray-500">No quizzes available yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {quizzes.map((quiz) => (
                      <div key={quiz.id} className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-all duration-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-base font-medium text-gray-900 mb-1">{quiz.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="bg-gray-50 px-2 py-0.5 rounded text-gray-600">Topic: {quiz.topic}</span>
                              <span className="text-gray-400">•</span>
                              <span>{quiz.questions.length} questions</span>
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedQuiz(quiz)}
                            className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-1.5"
                          >
                            <i className="bi bi-pencil-square"></i>
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

          {activeSection === 'announcements' && (
            <div className="max-w-6xl mx-auto px-4 py-4">
              <div className="p-2">
                <h2 className="text-lg font-medium text-gray-900 mb-3">Course Announcements</h2>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {announcements.length === 0 ? (
                    <div className="col-span-full text-center py-8 bg-white rounded-lg border border-gray-100">
                      <i className="bi bi-megaphone text-4xl text-gray-300 mb-2"></i>
                      <p className="text-gray-500">No announcements for this course yet.</p>
                    </div>
                  ) : (
                    announcements.map(announcement => (
                      <div key={announcement.id} className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-all duration-200">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                            {announcement.createdAt
                              ? new Date(announcement.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                              : ''}
                          </p>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-3">{announcement.announcement}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Enhanced Quiz Modal */}
        {selectedQuiz && (
          <div className="modal-overlay">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Quiz: {selectedQuiz.title}</h2>
                  <button
                    onClick={() => setSelectedQuiz(null)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <i className="bi bi-x-lg text-xl"></i>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <QuizDisplay
                  quiz={selectedQuiz}
                  onSubmitQuiz={submitQuizAttempt}
                  onViewResults={getQuizAttempts}
                  isInstructor={false}
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  } catch (error) {
    console.error("Error in Course component:", error);
    return (
      <div className="p-6 text-center text-red-600">
        <h2 className="text-xl font-semibold">An error occurred</h2>
        <p>{error.message}</p>
      </div>
    );
  };
}
export default Course;
