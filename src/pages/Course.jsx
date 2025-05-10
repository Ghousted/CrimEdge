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
      <section className="bg-gray-50">
        {/* Enhanced Header with course info and section buttons */}
        <div className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-10 py-5">
            <div className="mb-4">
              <h1 className="text-2xl font-medium text-gray-900">{course?.course}</h1>
              <p className="text-gray-600 mt-1">{course?.description}</p>
              <p className="text-gray-600 mt-1">Instructor: {course?.createdByName}</p>
            </div>
            
            <div className="flex gap-6 border-b border-gray-200">
              <button
                className={`pb-4 px-2 font-medium text-sm transition-all duration-200 ${
                  activeSection === 'lessons'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => handleSectionClick('lessons')}
              >
                <i className="bi bi-book mr-2"></i>Lessons
              </button>
              <button
                className={`pb-4 px-2 font-medium text-sm transition-all duration-200 ${
                  activeSection === 'announcements'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => handleSectionClick('announcements')}
              >
                <i className="bi bi-megaphone mr-2"></i>Announcements
              </button>
              <button
                className={`pb-4 px-2 font-medium text-sm transition-all duration-200 ${
                  activeSection === 'quizzes'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => handleSectionClick('quizzes')}
              >
                <i className="bi bi-pencil-square mr-2"></i>Quizzes
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Content Sections */}
        {activeSection === 'lessons' && (
          <div className='max-w-7xl mx-auto px-4'>
            <div className="">
              <div className="p-4">
                <h2 className="text-xl font-medium text-gray-900 mb-2">Course Lessons</h2>
                {lessonsLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : lessons.length === 0 ? (
                  <div className="text-center py-12">
                    <i className="bi bi-book text-5xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500 text-lg">No lessons available yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {lessons.map((lesson) => (
                      <div key={lesson.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900 mb-1">{lesson.title}</h3>
                            <p className="text-gray-600 mb-4">{lesson.description}</p>
                            <div className="flex items-center gap-2 bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-all duration-200">
                              <i className={`bi ${lesson.fileType.includes('pdf') ? 'bi-file-pdf' : 'bi-file-play'} text-blue-600 text-lg`}></i>
                              <a
                                href={lesson.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 font-medium"
                              >
                                {lesson.fileName}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'quizzes' && (
          <div className='max-w-7xl mx-auto px-4 '>
            <div className="">
              <div className="p-4">
                <h2 className="text-xl font-medium text-gray-900 mb-2">Course Quizzes</h2>
                {quizzesLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : quizzes.length === 0 ? (
                  <div className="text-center py-12">
                    <i className="bi bi-pencil-square text-5xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500 text-lg">No quizzes available yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {quizzes.map((quiz) => (
                      <div key={quiz.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">{quiz.title}</h3>
                            <p className="text-gray-600 mb-1">Topic: {quiz.topic}</p>
                            <p className="text-gray-500 text-sm">
                              {quiz.questions.length} questions
                            </p>
                          </div>
                          <button
                            onClick={() => setSelectedQuiz(quiz)}
                            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
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
          </div>
        )}

        {activeSection === 'announcements' && (
          <div className="max-w-7xl mx-auto px-4 ">
            <div className="">
              <div className="p-4">
                <h2 className="text-xl font-medium text-gray-900 mb-2">
                  Course Announcements
                </h2>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {announcements.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <i className="bi bi-megaphone text-5xl text-gray-300 mb-4"></i>
                      <p className="text-gray-500 text-lg">No announcements for this course yet.</p>
                    </div>
                  ) : (
                    announcements.map(announcement => (
                      <div key={announcement.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between mb-2">
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
                        <p className="text-gray-700 mb-3">{announcement.announcement}</p>
                      </div>
                    ))
                  )}
                </div>
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
};

export default Course;
