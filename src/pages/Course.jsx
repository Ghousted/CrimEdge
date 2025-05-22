import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHandleCourses } from '../hooks/useHandleCourses';
import { useHandleAnnouncements } from '../hooks/useHandleAnnouncements';
import { useHandleLessons } from '../hooks/useHandleLessons';
import { useHandleQuizzes } from '../hooks/useHandleQuizzes';
import { useHandleQuestions } from '../hooks/useHandleQuestions';
import { useAuth } from '../auth/components/authContext';
import QuizDisplay from '../utils/QuizDisplayModal';
import QuestionModal from '../utils/QuestionModal';
import { useDarkMode } from '../components/DarkModeContext'; // Import the useDarkMode hook

const Course = () => {
  try {
    const { id } = useParams();
    const { createAnnouncement, announcements, createdAnnouncements } = useHandleAnnouncements(id);
    const { addNewQuestion, questions, addReply, replies, getAllReplies } = useHandleQuestions(id);
    const { courses, enrollStudentInCourse, enrolledCourses, courseLimit } = useHandleCourses();
    const { lessons } = useHandleLessons(id);
    const { membershipPlan } = useAuth();
    const navigate = useNavigate();
    const [confirmed, setConfirmed] = useState(false);
    const [loading, setLoading] = React.useState(true);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [activeTab, setActiveTab] = useState('Overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [expandedSections, setExpandedSections] = useState({});
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [newSectionTitle, setNewSectionTitle] = useState('');
    const [newSectionDescription, setNewSectionDescription] = useState('');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const { quizzes, loading: quizzesLoading, submitQuizAttempt, getQuizAttempts } = useHandleQuizzes(id);
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [question, setQuestion] = useState('');
    const [questionError, setQuestionError] = useState('');
    const [reviews, setReviews] = useState([]);
    const [reviewFilter, setReviewFilter] = useState('All');
    const [reviewSearch, setReviewSearch] = useState('');
    const [newReviewStars, setNewReviewStars] = useState(0);
    const [newReviewComment, setNewReviewComment] = useState('');
    const [selectedLectureId, setSelectedLectureId] = useState('');

    const [expandedReplies, setExpandedReplies] = useState({});
    const [replyBoxes, setReplyBoxes] = useState({});
    const { darkMode } = useDarkMode(); // Use the useDarkMode hook

    useEffect(() => {
      if (
        lessons &&
        lessons.length > 0 &&
        lessons[0].lectures &&
        lessons[0].lectures.length > 0 &&
        !selectedLecture
      ) {
        setSelectedLecture(lessons[0].lectures[0]);
      }
    }, [lessons, selectedLecture]);

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

      setLoading(true);
      checkEnrollment();
    }, [id, enrolledCourses, courses]);

    const handleConfirm = async () => {
      setIsEnrolling(true);
      await enrollStudentInCourse(course.id);
      window.location.reload();
    };

    const handleCancel = () => {
      navigate('/dashboard');
    };

    const toggleSection = (sectionIndex) => {
      setExpandedSections(prev => ({
        ...prev,
        [sectionIndex]: !prev[sectionIndex]
      }));
    };

    const toggleDropdown = (id) => {
      setDropdownOpen(dropdownOpen === id ? null : id);
    };

    const handleEditSection = (sectionId) => {
      console.log('Editing section:', sectionId);
      setDropdownOpen(null);
    };

    const handleDeleteSection = (sectionId) => {
      console.log('Deleting section:', sectionId);
      setDropdownOpen(null);
    };

    const handleAddComment = (e) => {
      e.preventDefault();
      if (newComment.trim()) {
        setComments([
          ...comments,
          {
            id: Date.now(),
            text: newComment,
            author: 'Current User',
            timestamp: new Date().toISOString(),
            replies: [],
            likes: 0,
            isLiked: false
          },
        ]);
        setNewComment('');
      }
    };

    const handleAddReply = (qustiondId) => {
      if (!replyText.trim()) {
        alert('Please add a reply');
      };
      addReply(qustiondId, replyText);
      getAllReplies();
      setReplyText('');
      setReplyingTo(null);
    };

    const handleLike = (commentId, isReply = false, replyId = null) => {
      setComments(comments.map(comment => {
        if (isReply && comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === replyId) {
                return {
                  ...reply,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                  isLiked: !reply.isLiked
                };
              }
              return reply;
            })
          };
        }
        if (!isReply && comment.id === commentId) {
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked
          };
        }
        return comment;
      }));
    };

    const handleQuestionSubmit = () => {
      if (!question.trim()) {
        setQuestionError('Question cannot be empty.');
        return;
      }
      addNewQuestion(question, selectedLectureId);
      setShowQuestionModal(false);
      setQuestion('');
      setQuestionError('');
    };

    const course = courses?.find(c => c.id === id) || null;

    if (loading || course === null) {
      return <div className="p-6 text-center text-gray-700">Loading...</div>;
    }

    if (isEnrolling) {
      return <div className="p-6 text-center text-gray-700">Processing enrollment...</div>;
    }

    if (!confirmed && membershipPlan?.plan === 'Free' && enrolledCourses?.length >= 2) {
      return (
        <section className="p-8 max-w-4xl mx-auto">
  <div className={`${darkMode ? 'dark:bg-[#242526]' : 'bg-[#F0F2F5'} shadow-lg rounded-lg`}>
    <div className="bg-gradient-to-r from-red-600 via-blue-600 to-blue-600 p-6">
      <div className="flex items-center justify-center mb-4">
        <i className="bi bi-lock-fill text-4xl text-white"></i>
      </div>
      <h2 className="text-3xl font-bold text-center text-white mb-2">Course Limit Reached</h2>
      <p className="text-center text-yellow-100">You've reached the maximum courses for your Free plan</p>
    </div>

    <div className="p-8">
      <div className={`${darkMode ? 'dark:bg-[#242526] border border-[#3E4042] text-[#FF4C4C]' : 'bg-red-100 text-[#FA383E]'} rounded-lg p-6 mb-6`}>
        <h3 className="text-xl font-semibold mb-3">Current Plan Limitations</h3>
        <ul className="space-y-3">
          <li className="flex items-center =">
            <i className="bi bi-check-circle-fill mr-2"></i>
            <span>Maximum 2 courses allowed</span>
          </li>
          <li className="flex items-center">
            <i className="bi bi-check-circle-fill mr-2"></i>
            <span>Basic course access</span>
          </li>
          <li className="flex items-center">
            <i className="bi bi-check-circle-fill mr-2"></i>
            <span>Standard learning materials</span>
          </li>
        </ul>
      </div>

      <div className={`${darkMode ? 'dark:bg-[#242526] border border-[#3E4042] text-[#2374E1]' : 'bg-blue-100 text-[#1877F2]'} rounded-lg p-6 mb-6`}>
        <h3 className="text-xl font-semibold mb-3">Upgrade Benefits</h3>
        <ul className="space-y-3">
          <li className="flex items-center">
            <i className="bi bi-star-fill mr-2"></i>
            <span>Unlimited course access</span>
          </li>
          <li className="flex items-center">
            <i className="bi bi-star-fill mr-2"></i>
            <span>Premium learning materials</span>
          </li>
          <li className="flex items-center">
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
  <section className={`p-6 text-center rounded-lg pt-10 ${darkMode ? ' text-gray-200' : ' text-gray-800'}`}>
    <h2 className="text-xl font-semibold mb-4">
      Are you sure you want to access this course?
    </h2>
    <div className="flex justify-center gap-4">
      <button
        onClick={handleConfirm}
        className={`px-4 py-2 rounded font-semibold transition-colors ${
          darkMode
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        Yes
      </button>
      <button
        onClick={handleCancel}
        className={`px-4 py-2 rounded font-semibold transition-colors ${
          darkMode
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
        }`}
      >
        No
      </button>
    </div>
  </section>
);
    }


    const tabs = ['Overview', 'Announcements', 'Notes', 'Q&A', 'Reviews', 'Assessment', 'Quizzes', 'Learning tools'];

    const renderTabContent = () => {
      switch (activeTab) {
   case 'Overview':
  return (
    <div>
      {selectedLecture ? (
        <>
          <h2 className={`text-xl mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {selectedLecture.title || 'Loading...'}
          </h2>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm mb-4`}>
            {selectedLecture.content || 'Loading course description...'}
          </p>

          <div className={`flex items-center gap-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <div className="flex items-center gap-1">
              <span className={`text-lg font-bold text-amber-500 ${darkMode ? 'text-amber-400' : ''}`}>
                {course?.rating || '4.3'}
              </span>
              <i className={`bi bi-star-fill text-amber-500 ${darkMode ? 'text-amber-400' : ''}`}></i>
              <span className={`text-sm ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                ({course?.totalRatings || '10,508'} ratings)
              </span>
            </div>
            <div className="flex items-center gap-1">
              <i className={`bi bi-people ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}></i>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {course?.students || '185,456'} students
              </span>
            </div>
            <div className={`flex items-center gap-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <i className="bi bi-calendar-check"></i>
              <span>Last updated {course?.lastUpdated || 'November 2017'}</span>
            </div>
          </div>
        </>
      ) : (
        <div>
          <h2 className={`text-xl mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {course?.course || 'Loading...'}
          </h2>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm mb-4`}>
            {course?.description || 'Loading...'}
          </p>
        </div>
      )}

      {/* --- Comment Section: Always visible in Overview --- */}
      <div className={`mt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-4`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`${darkMode ? 'text-white' : 'text-gray-800'} text-lg font-medium`}>
            Comments
          </h3>
          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs`}>
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </span>
        </div>
        <form onSubmit={handleAddComment} className="mb-5">
          <div className="flex flex-col gap-2">
            <textarea
              value={newComment}
              rows={2}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className={`w-full p-2.5 border rounded-md focus:ring-2 focus:border-blue-500 transition text-sm resize-none min-h-[60px] shadow-sm
                ${darkMode
                  ? 'bg-[#242526] border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-blue-400'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'}`}
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newComment.trim()}
                className={`px-3 py-1.5 rounded-md font-medium text-sm flex items-center gap-1 shadow-sm transition-all duration-200
                  ${darkMode 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg'
                    : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md'}`}
              >
                <i className="bi bi-send text-xs"></i>Post
              </button>
            </div>
          </div>
        </form>

        <div className="space-y-3">
          {comments.length === 0 && (
            <div className={`text-center py-6 rounded-md border shadow-sm
              ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <i className={`bi bi-chat-square-text text-2xl mb-2 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}></i>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs`}>
                No comments yet. Be the first to share your thoughts!
              </p>
            </div>
          )}
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-3 rounded-md border shadow-sm hover:shadow-md transition-shadow duration-200
                ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                    {comment.author.charAt(0)}
                  </div>
                  <div>
                    <span className={`${darkMode ? 'text-gray-200' : 'text-gray-800'} font-medium block text-sm`}>
                      {comment.author}
                    </span>
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs`}>
                      {new Date(comment.timestamp).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleLike(comment.id)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors duration-200 ${
                    comment.isLiked
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <i className={`bi ${comment.isLiked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                  <span>{comment.likes}</span>
                </button>
              </div>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm mb-2 leading-relaxed`}>
                {comment.text}
              </p>
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className={`${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'} flex items-center gap-1 px-2 py-0.5 rounded-full transition-colors duration-200 text-xs`}
              >
                <i className="bi bi-reply"></i>Reply
              </button>
              {replyingTo === comment.id && (
                <div className="mt-2 pl-3 border-l-2 border-blue-200">
                  <div className="flex flex-col gap-2">
                     <textarea
                      value={replyText}
                      rows={2}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Share your thoughts..."
                      className={`w-full p-2.5 border rounded-md focus:ring-2 focus:border-blue-500 transition text-sm resize-none min-h-[60px] shadow-sm
                        ${darkMode
                          ? 'bg-gray-800  border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-blue-400'
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'}`}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText('');
                        }}
                        className={`px-2.5 py-1 rounded-md font-medium text-xs transition-all duration-200 ${
                          darkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleAddReply(comment.id)}
                        disabled={!replyText.trim()}
                        className={`px-2.5 py-1 rounded-md font-medium text-xs transition-all duration-200 ${
                          darkMode
                            ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                        }`}
                      >
                        <i className="bi bi-send text-xs"></i>Reply
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {comment.replies.length > 0 && (
                <div className="mt-2 pl-3 border-l-2 space-y-2" style={{borderColor: darkMode ? '#374151' : undefined}}>
                  {comment.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className={`p-2 rounded-md ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-xs">
                          {reply.author.charAt(0)}
                        </div>
                        <span className="font-medium text-xs">{reply.author}</span>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(reply.timestamp).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );


       case 'Announcements':
  return (
    <div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {announcements.length === 0 ? (
          <div
            className={`col-span-full text-center py-8 rounded-lg border
              ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-100 text-gray-500'}`}
          >
            <i className="bi bi-megaphone text-4xl text-gray-400 mb-2"></i>
            <p>No announcements for this course yet.</p>
          </div>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className={`rounded-lg p-4 hover:shadow-sm transition-all duration-200 border
                ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200 shadow-md text-gray-700'}`}
            >
              {/* First line: course left, date right */}
              <div className="flex justify-between items-center mb-1">
                <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {course?.course}
                </span>
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs`}>
                  {announcement.createdAt
                    ? new Date(announcement.createdAt.seconds * 1000).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : ''}
                </span>
              </div>

              {/* Second line: created by name */}
              <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm font-semibold mb-2`}>
                {announcement.createdByName}
              </div>

              {/* Announcement content */}
              <p className={`${darkMode ? 'text-gray-200' : 'text-gray-700'} text-sm whitespace-pre-wrap`}>
                {announcement.announcement}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );

        case 'Reviews':
  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <span className="text-5xl font-bold text-amber-500">{course?.rating || '4.3'}</span>
          <div>
            <div className="flex items-center mb-1">
              {[1, 2, 3, 4, 5].map(star => (
                <i
                  key={star}
                  className={`bi bi-star-fill text-amber-400 text-xl transition ${
                    star > Math.round(course?.rating || 4.3) ? 'opacity-30' : ''
                  }`}
                ></i>
              ))}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {course?.totalRatings || reviews.length} ratings
            </span>
          </div>
        </div>
      </div>

      {/* Review Submission */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-10 mb-3">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Leave a Review</h3>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setNewReviewStars(star)}
                className="focus:outline-none hover:scale-110 transition-transform"
                aria-label={`${star} star`}
              >
                <i
                  className={`bi ${
                    newReviewStars >= star ? 'bi-star-fill text-amber-400' : 'bi-star text-gray-300 dark:text-gray-600'
                  } text-2xl`}
                ></i>
              </button>
            ))}
          </div>
        </div>

<div
  className={`flex gap-2 w-full mb-4 border-b pb-4 ${
    darkMode ? 'border-gray-700' : 'border-gray-200'
  }`}
>
          <input
            type="text"
            value={newReviewComment}
            onChange={e => setNewReviewComment(e.target.value)}
            maxLength={300}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:border-blue-500 transition text-sm  shadow-sm
                        ${darkMode
                          ? 'bg-gray-800  border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-blue-400'
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'}`}
            placeholder="Write your review here..."
          />
          <button
            className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-md transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={newReviewStars === 0 || !newReviewComment.trim()}
            onClick={() => {
              setReviews([
                {
                  id: Date.now(),
                  stars: newReviewStars,
                  comment: newReviewComment,
                  author: 'Current User',
                  timestamp: new Date().toISOString(),
                },
                ...reviews,
              ]);
              setNewReviewStars(0);
              setNewReviewComment('');
            }}
          >
            Submit
          </button>
        </div>
      </div>

      {/* Reviews List */}
     <div className="space-y-4">
  {reviews.length === 0 ? (
    <div className="text-center text-gray-400 dark:text-gray-500 py-8 italic">
      No reviews yet. Be the first!
    </div>
  ) : (
    reviews
      .filter(
        r =>
          (reviewFilter === 'All' || r.stars === Number(reviewFilter)) &&
          (reviewSearch === '' || r.comment?.toLowerCase().includes(reviewSearch.toLowerCase()))
      )
      .map(r => (
        <div
          key={r.id}
className={`rounded-lg p-4 shadow-sm hover:shadow-md transition border ${
  darkMode
    ? 'bg-gray-800 border-gray-700 text-gray-200'
    : 'bg-white border-gray-200 text-gray-900'
}`}        >
          <div className="flex items-center gap-3 mb-2">
            {/* Author name */}
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
              {r.author || "Current User"}
            </span>

            {/* Stars */}
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <i
                  key={star}
                  className={`bi ${
                    r.stars >= star ? 'bi-star-fill text-amber-400' : 'bi-star text-gray-300 dark:text-gray-600'
                  } text-sm`}
                ></i>
              ))}
            </div>

            {/* Date on right */}
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto whitespace-nowrap font-mono">
              {new Date(r.timestamp).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>

          {/* Comment text */}
          {r.comment && (
            <p className="text-sm text-gray-800 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {r.comment}
            </p>
          )}
        </div>
      ))
  )}
</div>

    </div>
  );

     case 'Assessment': {
  const studentAssessments = [
    {
      id: 1,
      type: "Pre-Test",
      status: "Not Started",
      due: "2025-06-01",
      description: "Evaluate initial understanding",
    },
    {
      id: 2,
      type: "Post-Test",
      status: "In Progress",
      due: "2025-07-01",
      description: "Assess learning outcomes",
    },
    {
      id: 3,
      type: "Mock Exam",
      status: "Completed",
      due: "2025-07-10",
      description: "Timed simulation",
      score: 88,
    },
    {
      id: 4,
      type: "Final Exam",
      status: "Not Started",
      due: "2025-07-20",
      description: "Comprehensive evaluation",
    },
  ];

  // Assume you have darkMode in scope (from context or props)
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {studentAssessments.map((a) => (
          <div
            key={a.id}
            className={`flex flex-col items-center justify-center rounded-xl p-8 transition-shadow hover:shadow-md text-center border ${
              darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300 shadow-md"
            }`}
          >
            <div className="mb-3">
              <i
                className={`bi ${
                  a.type === "Pre-Test"
                    ? `bi-journal-check ${darkMode ? "text-blue-400" : "text-blue-600"}`
                    : a.type === "Post-Test"
                    ? `bi-journal-text ${darkMode ? "text-green-400" : "text-green-600"}`
                    : a.type === "Mock Exam"
                    ? `bi-clock ${darkMode ? "text-blue-400" : "text-blue-600"}`
                    : `bi-award ${darkMode ? "text-red-400" : "text-red-600"}`
                }`}
                style={{ fontSize: "2.2rem" }}
              ></i>
            </div>
            <div
              className={`font-semibold text-lg mb-1 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {a.type}
            </div>
            <div
              className={`text-sm mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-500"
              }`}
            >
              {a.description}
            </div>

            {/* Status Badge */}
          
          </div>
        ))}
      </div>
      {studentAssessments.length === 0 && (
        <div
          className={`text-center py-8 italic ${
            darkMode ? "text-gray-500" : "text-gray-400"
          }`}
        >
          No assessments assigned yet.
        </div>
      )}
    </div>
  );
}

case 'Notes':
  return (
    <div>
    <div className="flex justify-between gap-4 mb-6 items-start">
  <div className="flex-1">
    <textarea
      name="noteTaking"
      id="noteTaking"
      placeholder="Take notes here..."
      className={`w-full p-3 border rounded-lg shadow-sm text-sm resize-none min-h-[80px] transition
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        ${
          darkMode
            ? "bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400"
            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
        }
      `}
    />
  </div>
  <div className="w-[120px] flex-shrink-0">
    <button
      className={`w-full mt-1 px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-colors duration-200
        ${
          darkMode
            ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
            : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
        }
      `}
      type="button"
    >
      Add Note
    </button>
  </div>
</div>

    </div>
  );

   case 'Q&A':
  return (
    <div >
      {/* Search and filter UI */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search questions..."
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm shadow-sm transition-all border ${
            darkMode
              ? " text-gray-200 placeholder-gray-400 border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              : "bg-white text-gray-800 placeholder-gray-500 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          }`}
        />
        <button
          className={`rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition flex items-center justify-center gap-2 ${
            darkMode
              ? "bg-blue-700 hover:bg-blue-600 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          <i className="bi bi-search" />
          Search
        </button>
      </div>

      {/* Filters and Ask Button */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Filters:
          </span>
          {['All lectures', 'Sort by recommended', 'Filter questions'].map((label, idx) => (
            <button
              key={idx}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md border transition ${
                darkMode
                  ? "border-gray-700 text-gray-200 hover:border-blue-500"
                  : "border-gray-300 bg-white text-gray-800 hover:border-blue-600"
              }`}
            >
              {label} <i className="bi bi-chevron-down" />
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowQuestionModal(true)}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border transition shadow-sm ${
            darkMode
              ? "border-gray-700 text-gray-200 hover:border-blue-500"
              : "border-gray-300 bg-white text-gray-800 hover:border-blue-600"
          }`}
        >
          <i className="bi bi-plus-circle" />
          Ask a Question
        </button>
      </div>

      {/* Question Modal */}
      <QuestionModal
        showModal={showQuestionModal}
        onClose={() => {
          setShowQuestionModal(false);
          setQuestionError('');
        }}
        question={question}
        setQuestion={setQuestion}
        onSubmit={handleQuestionSubmit}
        error={questionError}
        lessons={lessons}
        selectedLectureId={selectedLectureId}
        setSelectedLectureId={setSelectedLectureId}
      />

      {/* List of Questions */}
      <div className="space-y-6">
        {questions.map((q) => {
          const flatLectures = lessons.flatMap((lesson) => lesson.lectures || []);
          const lecture = flatLectures.find((lec) => lec.id === q.lectureId);
          const ts = q.createdAt?.toDate ? q.createdAt.toDate() : new Date(q.createdAt);
          const formatted = ts.toLocaleDateString('en-US', { day: '2-digit', year: 'numeric', month: 'long' });
          const isRepliesShown = expandedReplies[q.id];
          const isReplyBoxShown = replyBoxes[q.id];

          return (
            <div
              key={q.id}
              className={`rounded-lg border shadow-sm transition ${
                darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              <div className={`px-4 py-2 rounded-t-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <h4 className={`text-base font-semibold ${darkMode ? "text-blue-300" : "text-blue-800"}`}>
                  {lecture ? lecture.title : "Unknown Lecture"}
                </h4>
              </div>

              <div className="p-4">
                <div className="flex justify-between  mb-1">
                  <span className={darkMode ? "text-gray-400 text-sm" : "text-gray-500 text-sm"}>{q.createdBy}</span>
                  <span className={darkMode ? "text-gray-400 text-xs" : "text-gray-500 text-xs"}>{formatted}</span>
                </div>

                <p className={`mb-3 text-sm ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{q.question}</p>

                <div className={`flex gap-4 text-sm ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                  <button onClick={() => setReplyBoxes((prev) => ({ ...prev, [q.id]: !prev[q.id] }))} className="hover:underline">
                    Reply
                  </button>
                  <button
                    onClick={() => setExpandedReplies((prev) => ({ ...prev, [q.id]: !prev[q.id] }))}
                    className="hover:underline"
                  >
                    {isRepliesShown ? "Hide replies" : `View replies (${replies[q.id]?.length || 0})`}
                  </button>
                </div>

                {isReplyBoxShown && (
                  <div className="mt-4">
                    <textarea
                      value={replyText}
                      rows="2"
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your reply..."
                      className={`w-full rounded-md px-3 py-2 text-sm border focus:outline-none focus:ring-2 transition ${
                        darkMode
                          ? "bg-gray-900 text-gray-200 border-gray-700 focus:ring-blue-500"
                          : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => setReplyBoxes((prev) => ({ ...prev, [q.id]: false }))}
                        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} hover:underline`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleAddReply(q.id)}
                        className="text-sm px-4 py-1 rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}

                {isRepliesShown && (
                  <div className={`mt-5 space-y-4 border-l-2 pl-4 ${darkMode ? "border-gray-700" : "border-gray-300"}`}>
                    {replies[q.id]?.map((r, index) => {
                      const replyDate = r.createdAt?.toDate?.().toLocaleString?.() ?? "Unknown date";
                      const replyDateFormatted = new Date(replyDate).toLocaleDateString('en-US', {
                        day: '2-digit',
                        year: 'numeric',
                        month: 'long',
                      });
                      return (
                        <div key={index} className="text-sm">
                          <div className="flex justify-between mb-1 items-center">
                            <p className={darkMode ?"text-gray-400 text-sm" : "text-gray-500 text-sm"}>
                            {r.createdBy} 
                          </p>
                          <p className={darkMode ?"text-gray-400 text-xs" : "text-gray-500 text-xs"}>{replyDateFormatted}</p>
                          </div>
                          <p className={`mb-3 text-sm ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{r.reply}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );


    case 'Quizzes':
  return (
    <div>
      <div>
        {quizzesLoading ? (
          <div className="flex justify-center items-center py-16">
            <div
              className={`animate-spin rounded-full h-10 w-10 border-4 ${
                darkMode
                  ? "border-blue-400 border-t-transparent"
                  : "border-blue-600 border-t-transparent"
              }`}
            ></div>
          </div>
        ) : quizzes.length === 0 ? (
          <div
            className={`text-center py-12 rounded-lg border shadow-sm ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <i className={`bi bi-pencil-square text-5xl ${
              darkMode ? "text-gray-600" : "text-gray-300"
            } mb-3`}></i>
            <p className={darkMode ? "text-gray-400" : "text-gray-500 text-lg"}>
              No quizzes available yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className={`rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border
                  ${
                    darkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-100"
                  }
                `}
              >
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h3 className={`text-lg font-semibold mb-1 ${
                      darkMode ? "text-gray-200" : "text-gray-900"
                    }`}>
                      {quiz.title}
                    </h3>
                    <div className={`flex items-center flex-wrap gap-2 text-sm mb-3 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}>
                      <span className={`px-2 py-0.5 rounded-full ${
                        darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
                      }`}>
                        📂 {quiz.topic}
                      </span>
                      <span className={darkMode ? "text-gray-500" : "text-gray-400"}>•</span>
                      <span>
                        {quiz.questions.length} question{quiz.questions.length !== 1 && 's'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedQuiz(quiz)}
                    className={`mt-auto px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-colors duration-200
                      ${
                        darkMode
                          ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
                          : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
                      }
                    `}
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

      {/* Quiz Modal */}
      {selectedQuiz && (
        <div className='modal-overlay'>
          <div
            className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-fadeIn
              ${
                darkMode
                  ? "bg-gray-900 border border-gray-700 text-gray-200"
                  : "bg-white border border-gray-200 text-gray-900"
              }
            `}
          >
            <div
              className={`sticky top-0 z-10 flex justify-between items-center px-6 py-4 border-b
                ${
                  darkMode
                    ? "bg-gray-900 border-gray-700"
                    : "bg-white border-gray-200"
                }
              `}
            >
              <h2 className="text-xl font-bold">📝 Quiz: {selectedQuiz.title}</h2>
              <button
                onClick={() => setSelectedQuiz(null)}
                className={`transition-colors ${
                  darkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <i className="bi bi-x-lg text-2xl"></i>
              </button>
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
    </div>
  );

        case 'Learning tools':
          return (
            <div className="space-y-6">
              <p>Learning tools for premium users - self-made flashcards etc. for reviewing</p>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <section className={darkMode ? ' text-white' : 'bg-white text-gray-900'}>
        <div className="mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="flex flex-col w-full lg:col-span-4">
              <div className="flex flex-col">
                <div className={`bg-black ${selectedLecture?.fileData?.fileType?.startsWith('video/') ? 'p-0' : 'p-0'}`}>
                  {selectedLecture ? (
                    <div className="space-y-4">
                      {selectedLecture.fileData && (() => {
                        const { fileType, fileUrl, fileName } = selectedLecture.fileData;

                        if (fileType.startsWith('video/')) {
                          return (
                            <div className="w-3/4 mx-auto aspect-video overflow-hidden shadow">
                              <video controls className="w-full h-full object-contain">
                                <source src={fileUrl} type={fileType} />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          );
                        }

                        if (fileType === 'application/pdf') {
                          return (
                            <div className="w-full mx-auto h-[600px] overflow-hidden shadow border">
                              <iframe
                                src={fileUrl}
                                className="w-full h-full"
                                title={fileName}
                              >
                                This browser does not support PDFs. Please download the file:
                                <a href={fileUrl}>Download PDF</a>.
                              </iframe>
                            </div>
                          );
                        }

                        return (
                          <div>
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
                            >
                              <i className="bi bi-file-earmark mr-2"></i>
                              {fileName}
                            </a>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="text-center py-50">
                      <i className="bi bi-journal-text text-4xl text-gray-400 mb-3"></i>
                      <p className="text-gray-500">
                        {lessons.length === 0
                          ? <>
                            No lessons available yet.{' '}
                            <span
                              onClick={() => setShowAddSectionModal(true)}
                              className='text-gray-400 hover:text-gray-500 cursor-pointer'
                            >
                              Create a lesson first?
                            </span>
                          </>
                          : 'No lecture selected.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className={`p-2  transition-all duration-200 ${
                darkMode
                  ? 'bg-[#1e1e1e] border border-[#3E4042] text-gray-100'
                  : 'bg-white shadow-lg border border-gray-100 text-gray-800'
                }`}>
                <div className={`border-b flex gap-2 ${
                  darkMode ? 'border-[#3E4042]' : 'border-gray-200'
                }`}>
                  {tabs.map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors duration-150 ${
                        activeTab === tab
                          ? darkMode
                            ? 'border-blue-400 text-blue-300'
                            : 'border-blue-600 text-blue-700'
                          : darkMode
                            ? 'border-transparent text-gray-400 hover:text-blue-300'
                            : 'border-transparent text-gray-600 hover:text-blue-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className={`min-h-[200px] p-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {renderTabContent()}
                </div>
              </div>

            </div>

            <div className="flex flex-col w-full gap-4 bg-gray-50">
              <div className={darkMode ? 'p-4 border border-[#3E4042] h-full overflow-y-auto bg-[#1e1e1e]' : 'p-4 bg-white shadow-lg border border-gray-100 text-gray-800 h-full overflow-y-auto'}>
                <div className="mb-4 grd-bg2 text-white p-4 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-semibold flex items-center gap-2">
                    {course?.course || 'Loading...'}
                  </h2>
                  <p>{course?.description}</p>
                  <p className='text-sm mt-2 text-gray-400'>
                    <i className='bi bi-person mr-2'></i>
                    <span>{course.createdByName}</span>
                  </p>
                </div>

               <div className={`space-y-2 max-h-[calc(100vh-160px)] overflow-y-auto pr-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
  {lessons.length === 0 ? (
    <p className={`italic text-center py-4 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>No lessons available yet</p>
  ) : (
    lessons.map((lesson, idx) => (
      <div key={idx} className={`border rounded-lg ${darkMode ? 'border-[#3E4042]' : 'border-gray-300'}`}>
        <div
          className={`flex items-center justify-between p-2 cursor-pointer transition-colors duration-200 ${
            darkMode ? 'bg-[#2c2c2e] hover:bg-[#3a3a3d]' : 'bg-gray-50 hover:bg-gray-100'
          }`}
          onClick={() => toggleSection(idx)}
        >
          <div className="flex items-center gap-1">
            <i className={`bi ${expandedSections[idx] ? 'bi-chevron-down' : 'bi-chevron-right'} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}></i>
            <h3 className={`font-bold text-sm ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{lesson.title}</h3>
          </div>
          <button
            className={`p-1 rounded-full transition-colors duration-200 relative z-50 ${
              darkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown(`section-${idx}`);
            }}
          >
            <i className="bi bi-three-dots-vertical"></i>
            {dropdownOpen === `section-${idx}` && (
              <div
                className={`absolute right-0 top-0 mr-8 w-40 rounded-lg shadow-lg z-[100] overflow-hidden border ${
                  darkMode ? 'bg-[#1f1f21] border-[#3E4042]' : 'bg-white border-gray-200'
                }`}
              >
                <button
                  className={`flex items-center gap-1.5 w-full px-3 py-2 text-sm transition-colors duration-200 ${
                    darkMode ? 'text-gray-200 hover:bg-[#2a2a2c]' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handleEditSection(idx)}
                >
                  <i className="bi bi-pencil"></i>
                  Edit
                </button>
                <button
                  className={`flex items-center gap-1.5 w-full px-3 py-2 text-sm transition-colors duration-200 ${
                    darkMode ? 'text-red-400 hover:bg-[#2a2a2c]' : 'text-red-600 hover:bg-gray-50'
                  }`}
                  onClick={() => handleDeleteSection(idx)}
                >
                  <i className="bi bi-trash"></i>
                  Delete
                </button>
              </div>
            )}
          </button>
        </div>

        {expandedSections[idx] && (
          <ul className="p-2">
            {Array.isArray(lesson.lectures) && lesson.lectures.length > 0 ? (
              lesson.lectures.map((lec, lidx) => (
                <li
                  key={lidx}
                  className={`flex items-center gap-2 text-sm p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                    selectedLecture && selectedLecture.id === lec.id
                      ? darkMode
                        ? 'bg-blue-900 text-blue-300 font-semibold'
                        : 'bg-blue-100 text-blue-700 font-semibold'
                      : darkMode
                        ? 'text-gray-300 hover:bg-[#2a2a2c]'
                        : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedLecture(lec)}
                >
                  <input
                    type="checkbox"
                    checked={lec.isCompleted}
                    readOnly
                    className="accent-blue-600"
                  />
                  <div className="flex-1">
                    <span>{lec.title}</span>
                    {lec.lectureFiles && lec.lectureFiles.length > 0 && (
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {lec.lectureFiles.map((file, index) => (
                          <span
                            key={index}
                            className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
                              darkMode ? 'bg-[#3a3a3d] text-gray-300' : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            <i
                              className={`bi ${
                                file.fileType === 'application/pdf' ? 'bi-file-pdf' : 'bi-file-play'
                              }`}
                            ></i>
                            {file.fileName}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <li className={`italic text-center py-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                No lectures yet in this lesson
              </li>
            )}
          </ul>
        )}
      </div>
    ))
  )}
</div>

              </div>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error in Course component:", error);
    return (
      <div className="p-6 text-center text-red-600">
        <h2 className="text-xl font-semibold">An error occurred</h2>
        <p>{error.message}</p>
      </div>
    );
  }
}

export default Course;
