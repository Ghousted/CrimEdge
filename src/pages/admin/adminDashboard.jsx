import React, { useState, useEffect } from 'react';
import { useHandleAnnouncements } from '../../hooks/useHandleAnnouncements';
import { useHandleCourses } from '../../hooks/useHandleCourses';
import { useHandleLessons } from '../../hooks/useHandleLessons';
import { useHandleQuizzes } from '../../hooks/useHandleQuizzes';
import { motion } from 'framer-motion';
import { useDarkMode } from '../../components/DarkModeContext';

export default function AdminDashboard() {
  const { darkMode } = useDarkMode();
  const { announcements, loading: announcementsLoading } = useHandleAnnouncements();
  const { courses, loading: coursesLoading } = useHandleCourses();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { lessons, loading: lessonsLoading } = useHandleLessons(selectedCourse?.id);
  const { quizzes, loading: quizzesLoading, getQuizAttempts } = useHandleQuizzes(selectedCourse?.id);
  const [quizAttempts, setQuizAttempts] = useState({});
  const [activeView, setActiveView] = useState('courses');
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [user, setUser] = useState({ firstName: 'Admin', lastName: 'User' });
  const [currentTime, setCurrentTime] = useState(new Date());
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => {
      clearInterval(timer);
    };
  }, []);

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

  const toggleLesson = (lessonId) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  // Color scheme based on mode
  const colors = {
    light: {
      primaryBlue: '#1877F2',
      background: '#f0f0f0',
      cardBackground: '#F0F2F5',
      primaryText: '#050505',
      secondaryText: '#65676B',
      border: '#CED0D4',
      iconGray: '#606770',
      yellow: '#F7B928',
      red: '#FA383E',
      green: '#31A24C',
    },
    dark: {
      primaryBlue: '#2374E1',
      background: '#18191A',
      cardBackground: '#242526',
      primaryText: '#E4E6EB',
      secondaryText: '#B0B3B8',
      border: '#3E4042',
      iconGray: '#B0B3B8',
      yellow: '#FFD600',
      red: '#FF4C4C',
      green: '#4BCB64',
    },
  };

  const currentColors = darkMode ? colors.dark : colors.light;

  return (
    <section className="relative p-4">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
        {/* Welcome Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-xl grd-bg2 p-5 shadow-lg mb-4"
          style={{ backgroundColor: currentColors.primaryBlue }}
        >
          <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:16px_16px]"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-xs text-blue-50 font-medium">Admin Dashboard</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Welcome back, {user ? `${user.firstName} ${user.lastName}` : 'Admin'}!
            </h2>
            <p className="text-sm text-blue-50/90 font-medium">
              Manage your courses, lessons, and announcements with Crim Edge
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

        {/* Navigation */}
        <div className="flex space-x-3 mb-3">
          <button
            onClick={() => setActiveView('courses')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeView === 'courses'
                ? `bg-${darkMode ? 'dark' : 'light'}-primaryBlue text-white `
                : `bg-${darkMode ? 'dark' : 'light'}-cardBackground text-${darkMode ? 'dark' : 'light'}-primaryText hover:bg-gray-50`
            }`}
            style={{
              backgroundColor: activeView === 'courses' ? currentColors.primaryBlue : currentColors.cardBackground,
              color: activeView === 'courses' ? '#FFFFFF' : currentColors.primaryText,
            }}
          >
            Courses
          </button>
          <button
            onClick={() => setActiveView('announcements')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeView === 'announcements'
                ? `bg-${darkMode ? 'dark' : 'light'}-primaryBlue text-white shadow-md `
                : `bg-${darkMode ? 'dark' : 'light'}-cardBackground text-${darkMode ? 'dark' : 'light'}-primaryText hover:bg-gray-50`
            }`}
            style={{
              backgroundColor: activeView === 'announcements' ? currentColors.primaryBlue : currentColors.cardBackground,
              color: activeView === 'announcements' ? '#FFFFFF' : currentColors.primaryText,
            }}
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
                <h2 className="text-xl font-medium" style={{ color: currentColors.primaryText }}>Courses</h2>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-0.5 bg-indigo-100 text-indigo-600 rounded-full text-xs font-medium">
                    {courses.length} Total
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 0}
                      className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      style={{
                        backgroundColor: currentColors.cardBackground,
                        borderColor: currentColors.border,
                        color: currentColors.iconGray,
                      }}
                    >
                      <i className="bi bi-chevron-left"></i>
                    </button>
                    <span className="text-xs" style={{ color: currentColors.secondaryText }}>
                      Page {currentPage + 1} of {totalPages}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages - 1}
                      className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      style={{
                        backgroundColor: currentColors.cardBackground,
                        borderColor: currentColors.border,
                        color: currentColors.iconGray,
                      }}
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
                <div className="text-center py-8 bg-gray-50 rounded-lg" style={{ backgroundColor: currentColors.cardBackground }}>
                  <p style={{ color: currentColors.secondaryText }}>No courses available.</p>
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
                          : `bg-${darkMode ? 'dark' : 'light'}-cardBackground hover:bg-gray-50 hover:shadow-md border border-gray-100`
                      }`}
                      style={{
                        backgroundColor: selectedCourse?.id === course.id ? '' : currentColors.cardBackground,
                        borderColor: currentColors.border,
                      }}
                    >
                      <h3 className="text-lg font-semibold" style={{ color: currentColors.primaryBlue }}>{course.course}</h3>
                      <p className="text-sm" style={{ color: currentColors.secondaryText }}>{course.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-indigo-600 font-medium">By {course.createdByName}</span>
                        <span style={{ color: currentColors.secondaryText }}>{formatDateDot(course.createdAt)}</span>
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
                <div className="bg-white rounded-lg shadow-md border border-gray-100 p-5" style={{ backgroundColor: currentColors.cardBackground, borderColor: currentColors.border }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold" style={{ color: currentColors.primaryText }}>Lessons</h3>
                    <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded-full text-xs font-medium" style={{ backgroundColor: `${currentColors.green}20`, color: currentColors.green }}>
                      {lessons.length} Total
                    </span>
                  </div>

                  {lessonsLoading ? (
                    <div className="flex justify-center items-center h-24">
                      <div className="animate-spin rounded-full h-6 w-6 border-4 border-green-200 border-t-green-600"></div>
                    </div>
                  ) : lessons.length === 0 ? (
                    <p className="text-gray-500 text-center py-6 bg-gray-50 rounded-lg text-sm" style={{ color: currentColors.secondaryText, backgroundColor: currentColors.cardBackground }}>No lessons available.</p>
                  ) : (
                    <div className="space-y-4">
                      {lessons.map((lesson) => (
                        <div key={lesson.id} className="bg-gray-50 rounded-lg" style={{ backgroundColor: `${currentColors.cardBackground}` }}>
                          <div
                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                            onClick={() => toggleLesson(lesson.id)}
                            style={{ backgroundColor: `${currentColors.cardBackground}` }}
                          >
                            <div className="flex items-center gap-1">
                              <i className={`bi ${expandedLesson === lesson.id ? 'bi-chevron-down' : 'bi-chevron-right'}`} style={{ color: currentColors.iconGray }}></i>
                              <h4 className="font-medium" style={{ color: currentColors.primaryText }}>{lesson.title}</h4>
                            </div>
                            {lesson.fileUrl && (
                              <a
                                href={lesson.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                                style={{ backgroundColor: currentColors.primaryBlue }}
                              >
                                <i className="bi bi-download"></i> Download
                              </a>
                            )}
                          </div>
                          {expandedLesson === lesson.id && (
                            <div className="p-4" style={{ backgroundColor: currentColors.cardBackground }}>
                              <p className="text-xs" style={{ color: currentColors.secondaryText }}>{lesson.description}</p>
                              {/* Lectures within the lesson */}
                              {lesson.lectures && lesson.lectures.length > 0 && (
                                <div className="space-y-2">
                                  {lesson.lectures.map((lecture) => (
                                    <div key={lecture.id} className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-100 transition-all duration-300" style={{ backgroundColor: currentColors.cardBackground }}>
                                      <div>
                                        <h5 className="font-medium" style={{ color: currentColors.primaryText }}>{lecture.title}</h5>
                                        <p className="text-xs" style={{ color: currentColors.secondaryText }}>{lecture.description}</p>
                                      </div>
                                      {lecture.fileUrl && (
                                        <a
                                          href={lecture.fileUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center gap-1"
                                          style={{ backgroundColor: currentColors.primaryBlue }}
                                        >
                                          <i className="bi bi-download"></i> Download
                                        </a>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quizzes Section */}
                <div className="bg-white rounded-lg shadow-md border border-gray-100 p-5" style={{ backgroundColor: currentColors.cardBackground, borderColor: currentColors.border }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold" style={{ color: currentColors.primaryText }}>Quizzes</h3>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full text-xs font-medium" style={{ backgroundColor: `${currentColors.primaryBlue}20`, color: currentColors.primaryBlue }}>
                      {quizzes.length} Total
                    </span>
                  </div>

                  {quizzesLoading ? (
                    <div className="flex justify-center items-center h-24">
                      <div className="animate-spin rounded-full h-6 w-6 border-4 border-purple-200 border-t-purple-600"></div>
                    </div>
                  ) : quizzes.length === 0 ? (
                    <p className="text-gray-500 text-center py-6 bg-gray-50 rounded-lg text-sm" style={{ color: currentColors.secondaryText, backgroundColor: currentColors.cardBackground }}>No quizzes available.</p>
                  ) : (
                    <div className="space-y-2">
                      {quizzes.map((quiz) => (
                        <div key={quiz.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-300" style={{ backgroundColor: currentColors.cardBackground }}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium" style={{ color: currentColors.primaryText }}>{quiz.title}</h4>
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full text-xs" style={{ backgroundColor: `${currentColors.primaryBlue}20`, color: currentColors.primaryBlue }}>
                              {quiz.questions.length} questions
                            </span>
                          </div>
                          <p className="text-xs" style={{ color: currentColors.secondaryText }}>Topic: {quiz.topic}</p>

                          {quizAttempts[quiz.id] && quizAttempts[quiz.id].length > 0 && (
                            <div className="mt-3">
                              <h5 className="text-xs font-semibold" style={{ color: currentColors.secondaryText }}>Recent Attempts:</h5>
                              <div className="space-y-2">
                                {quizAttempts[quiz.id].map((attempt, index) => (
                                  <div key={index} className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm" style={{ backgroundColor: currentColors.cardBackground }}>
                                    <span className="text-sm font-medium" style={{ color: currentColors.primaryText }}>{attempt.userName}</span>
                                    <div className="flex items-center gap-1">
                                      <span className="text-xs" style={{ color: currentColors.secondaryText }}>
                                        Score: {attempt.score}/{quiz.questions.length}
                                      </span>
                                      <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                                        attempt.percentage >= 70 ? `bg-${darkMode ? 'dark' : 'light'}-green text-${darkMode ? 'dark' : 'light'}-green` :
                                        attempt.percentage >= 50 ? 'bg-yellow-100 text-yellow-600' :
                                        `bg-${darkMode ? 'dark' : 'light'}-red text-${darkMode ? 'dark' : 'light'}-red`
                                      }`}
                                      style={{
                                        backgroundColor: attempt.percentage >= 70 ? `${currentColors.green}20` :
                                                          attempt.percentage >= 50 ? '#FFD60020' :
                                                          `${currentColors.red}20`,
                                        color: attempt.percentage >= 70 ? currentColors.green :
                                               attempt.percentage >= 50 ? '#FFD600' :
                                               currentColors.red,
                                      }}>
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
          <div className="bg-white rounded-lg shadow-md border border-gray-100 p-5" style={{ backgroundColor: currentColors.cardBackground, borderColor: currentColors.border }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold" style={{ color: currentColors.primaryText }}>Announcements</h2>
              <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full text-xs font-medium" style={{ backgroundColor: `${currentColors.yellow}20`, color: currentColors.yellow }}>
                {announcements.length} Total
              </span>
            </div>

            {announcementsLoading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-200 border-t-orange-600"></div>
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg" style={{ backgroundColor: currentColors.cardBackground }}>
                <p style={{ color: currentColors.secondaryText }}>No announcements available.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                     className={`p-3 rounded-lg transition-colors duration-200 border ${
                        darkMode
                          ? 'bg-gradient-to-br from-[#18191A]/80 to-[#2374E1]/10 hover:from-[#18191A]/90 hover:to-[#2374E1]/20 border-[#3E4042]'
                          : 'bg-gradient-to-br from-blue-50/50 to-indigo-50/50 hover:from-blue-50 hover:to-indigo-50 border-blue-100/50'
                      }`}
                    style={{ backgroundColor: currentColors.cardBackground }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs font-medium" style={{ backgroundColor: `${currentColors.primaryBlue}20`, color: currentColors.primaryBlue }}>
                          {announcement.target}
                        </span>
                        <span className="text-xs" style={{ color: currentColors.secondaryText }}>
                          {announcement.createdAt ? formatDateDot(announcement.createdAt) : ''}
                        </span>
                      </div>
                      <span className="text-xs" style={{ color: currentColors.secondaryText }}>By {announcement.createdByName}</span>
                    </div>
                    <p className="text-sm" style={{ color: currentColors.primaryText }}>{announcement.announcement}</p>
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
