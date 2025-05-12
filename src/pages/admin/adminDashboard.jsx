import React, { useState, useEffect } from 'react';
import { useHandleAnnouncements } from '../../hooks/useHandleAnnouncements';
import { useHandleCourses } from '../../hooks/useHandleCourses';
import { useHandleLessons } from '../../hooks/useHandleLessons';
import { useHandleQuizzes } from '../../hooks/useHandleQuizzes';

export default function AdminDashboard() {
  const { announcements, loading: announcementsLoading } = useHandleAnnouncements();
  const { courses, loading: coursesLoading } = useHandleCourses();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { lessons, loading: lessonsLoading } = useHandleLessons(selectedCourse?.id);
  const { quizzes, loading: quizzesLoading, getQuizAttempts } = useHandleQuizzes(selectedCourse?.id);
  const [quizAttempts, setQuizAttempts] = useState({});
  const [activeView, setActiveView] = useState('courses');
  const [currentPage, setCurrentPage] = useState(0);
  const coursesPerPage = 3;

  useEffect(() => {
    if (selectedCourse && quizzes.length > 0) {
      const fetchAttempts = async () => {
        const attempts = {};
        for (const quiz of quizzes) {
          attempts[quiz.id] = await getQuizAttempts(quiz.id);
        }
        setQuizAttempts(attempts);
      };
      fetchAttempts();
    }
  }, [selectedCourse, quizzes]);

  const totalPages = Math.ceil(courses.length / coursesPerPage);
  const startIndex = currentPage * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = courses.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  function formatDateDot(dateObj) {
    const d = new Date(dateObj.seconds * 1000);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  }

  return (
    <section className="">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
        <div className="mb-3 bg-white rounded-lg p-4 shadow-md border border-gray-100">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600">Manage your courses, lessons, and announcements</p>
        </div>

        {/* Navigation */}
        <div className="flex space-x-3 mb-3">
          <button
            onClick={() => setActiveView('courses')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeView === 'courses'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Courses
          </button>
          <button
            onClick={() => setActiveView('announcements')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeView === 'announcements'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Announcements
          </button>
        </div>

        {/* Content Area */}
        {activeView === 'courses' ? (
          <div className="space-y-3">
            {/* Courses Section - Top */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-medium text-gray-800">Courses</h2>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-0.5 bg-indigo-100 text-indigo-600 rounded-full text-xs font-medium">
                    {courses.length} Total
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 0}
                      className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      <i className="bi bi-chevron-left"></i>
                    </button>
                    <span className="text-xs text-gray-600">
                      Page {currentPage + 1} of {totalPages}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages - 1}
                      className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              {coursesLoading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600"></div>
                </div>
              ) : courses.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No courses available.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {currentCourses.map((course) => (
                    <div
                      key={course.id}
                      onClick={() => setSelectedCourse(course)}
                      className={`py-3 px-5 rounded-lg cursor-pointer transition-all duration-300 ${
                        selectedCourse?.id === course.id
                          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-500 shadow-md'
                          : 'bg-white hover:bg-gray-50 hover:shadow-md border border-gray-100'
                      }`}
                    >
                      <h3 className="text-lg font-semibold text-blue-800 mb-1">{course.course}</h3>
                      <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-indigo-600 font-medium">By {course.createdByName}</span>
                        <span className="text-gray-500">{formatDateDot(course.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lessons and Quizzes Section - Bottom */}
            {selectedCourse && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Lessons Section */}
                <div className="bg-white rounded-lg shadow-md border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Lessons</h3>
                    <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                      {lessons.length} Total
                    </span>
                  </div>
                  
                  {lessonsLoading ? (
                    <div className="flex justify-center items-center h-24">
                      <div className="animate-spin rounded-full h-6 w-6 border-4 border-green-200 border-t-green-600"></div>
                    </div>
                  ) : lessons.length === 0 ? (
                    <p className="text-gray-500 text-center py-6 bg-gray-50 rounded-lg text-sm">No lessons available.</p>
                  ) : (
                    <div className="space-y-2">
                      {lessons.map((lesson) => (
                        <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300">
                          <div>
                            <h4 className="font-medium text-gray-800 text-sm mb-0.5">{lesson.title}</h4>
                            <p className="text-xs text-gray-600">{lesson.description}</p>
                          </div>
                          <a
                            href={lesson.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center gap-1"
                          >
                            <i className="bi bi-download"></i> Download
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quizzes Section */}
                <div className="bg-white rounded-lg shadow-md border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Quizzes</h3>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">
                      {quizzes.length} Total
                    </span>
                  </div>
                  
                  {quizzesLoading ? (
                    <div className="flex justify-center items-center h-24">
                      <div className="animate-spin rounded-full h-6 w-6 border-4 border-purple-200 border-t-purple-600"></div>
                    </div>
                  ) : quizzes.length === 0 ? (
                    <p className="text-gray-500 text-center py-6 bg-gray-50 rounded-lg text-sm">No quizzes available.</p>
                  ) : (
                    <div className="space-y-2">
                      {quizzes.map((quiz) => (
                        <div key={quiz.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-300">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-800 text-sm">{quiz.title}</h4>
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full text-xs">
                              {quiz.questions.length} questions
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-3">Topic: {quiz.topic}</p>
                          
                          {quizAttempts[quiz.id] && quizAttempts[quiz.id].length > 0 && (
                            <div className="mt-3">
                              <h5 className="text-xs font-semibold text-gray-700 mb-2">Recent Attempts:</h5>
                              <div className="space-y-2">
                                {quizAttempts[quiz.id].map((attempt, index) => (
                                  <div key={index} className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm">
                                    <span className="text-sm text-gray-700 font-medium">{attempt.userName}</span>
                                    <div className="flex items-center gap-1">
                                      <span className="text-xs text-gray-500">
                                        Score: {attempt.score}/{quiz.questions.length}
                                      </span>
                                      <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                                        attempt.percentage >= 70 ? 'bg-green-100 text-green-600' :
                                        attempt.percentage >= 50 ? 'bg-yellow-100 text-yellow-600' :
                                        'bg-red-100 text-red-600'
                                      }`}>
                                        {attempt.percentage.toFixed(1)}%
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Announcements View */
          <div className="bg-white rounded-lg shadow-md border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Announcements</h2>
              <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
                {announcements.length} Total
              </span>
            </div>
            
            {announcementsLoading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-200 border-t-orange-600"></div>
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No announcements available.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                          {announcement.target}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {announcement.createdAt ? formatDateDot(announcement.createdAt) : ''}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 font-medium">By {announcement.createdByName}</span>
                    </div>
                    <p className="text-sm text-gray-800 leading-relaxed">{announcement.announcement}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
