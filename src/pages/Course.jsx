import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHandleCourses } from '../hooks/useHandleCourses';
import { useHandleAnnouncements } from '../hooks/useHandleAnnouncements';
import { useHandleLessons } from '../hooks/useHandleLessons';
import { useHandleQuizzes } from '../hooks/useHandleQuizzes';
import { useAuth } from '../auth/components/authContext';
import QuizDisplay from '../components/QuizDisplay';
import QuestionModal from '../utils/QuestionModal'; // Adjust path as needed


const Course = () => {
  try {
    const { id } = useParams();
    const { createAnnouncement, announcements, createdAnnouncements } = useHandleAnnouncements(id);
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
    const {quizzes, loading: quizzesLoading, submitQuizAttempt, getQuizAttempts} = useHandleQuizzes(id);
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [question, setQuestion] = useState('');
    const [questionError, setQuestionError] = useState('');
    const [reviews, setReviews] = useState([]);
    const [reviewFilter, setReviewFilter] = useState('All');
    const [reviewSearch, setReviewSearch] = useState('');
    const [newReviewStars, setNewReviewStars] = useState(0);
    const [newReviewComment, setNewReviewComment] = useState('');

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

    const handleSectionClick = (section) => {
      setActiveSection(section);
    };

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

    const handleAddSection = async () => {
      console.log('Adding new section:', { title: newSectionTitle, description: newSectionDescription });
      setShowAddSectionModal(false);
      setNewSectionTitle('');
      setNewSectionDescription('');
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

    const handleAddReply = (commentId) => {
      if (replyText.trim()) {
        setComments(comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [...comment.replies, {
                id: Date.now(),
                text: replyText,
                author: 'Current User',
                timestamp: new Date().toISOString(),
                likes: 0,
                isLiked: false
              }]
            };
          }
          return comment;
        }));
        setReplyText('');
        setReplyingTo(null);
      }
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
  // TODO: Submit question to backend here
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

    const tabs = ['Overview', 'Announcements', 'Notes',  'Q&A', 'Reviews', 'Assessment', 'Quizzes', 'Learning tools'];

    const renderTabContent = () => {
      switch (activeTab) {
 
          case 'Overview':
  return (
    <div>
       {selectedLecture ? (
        <>
          <h2 className="text-xl mb-1">{selectedLecture.title || 'Loading...'}</h2>
          <p className="text-gray-700 text-sm mb-4">
            {selectedLecture.content || 'Loading course description...'}
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-amber-500">{course?.rating || '4.3'}</span>
              <i className="bi bi-star-fill text-amber-500"></i>
              <span className="text-sm text-gray-600 ml-1">({course?.totalRatings || '10,508'} ratings)</span>
            </div>
            <div className="flex items-center gap-1">
              <i className="bi bi-people text-gray-600"></i>
              <span className="text-sm text-gray-600">{course?.students || '185,456'} students</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <i className="bi bi-calendar-check"></i>
              <span>Last updated {course?.lastUpdated || 'November 2017'}</span>
            </div>
          </div>
        </>
      ) : (
        <div>
          <h2 className="text-xl mb-1">{course?.course || 'Loading...'}</h2>
          <p className="text-gray-700 text-sm mb-4">
            {course?.description || 'Loading...'}
          </p>
        </div>
      )}
      {/* --- Comment Section: Always visible in Overview --- */}
      <div className="mt-6 border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-800">Comments</h3>
          <span className="text-xs text-gray-500">{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
        </div>
        <form onSubmit={handleAddComment} className="mb-5">
          <div className="flex flex-col gap-2">
            <textarea value={newComment} rows="2"
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full p-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-sm resize-none min-h-[60px] shadow-sm"
            />
            <div className="flex justify-end">
              <button type="submit"
                disabled={!newComment.trim()}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm hover:shadow-md"
              >
                <i className="bi bi-send text-xs"></i>Post
              </button>
            </div>
          </div>
        </form>
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white p-3 rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                    {comment.author.charAt(0)}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800 block text-sm">{comment.author}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.timestamp).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                <button onClick={() => handleLike(comment.id)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors duration-200 ${comment.isLiked
                    ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <i className={`bi ${comment.isLiked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                  <span>{comment.likes}</span>
                </button>
              </div>
              <p className="text-gray-700 text-sm mb-2 leading-relaxed">{comment.text}</p>
              <button onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1 px-2 py-0.5 rounded-full hover:bg-gray-50 transition-colors duration-200"
              >
                <i className="bi bi-reply"></i>Reply
              </button>
              {replyingTo === comment.id && (
                <div className="mt-2 pl-3 border-l-2 border-blue-200">
                  <div className="flex flex-col gap-2">
                    <textarea value={replyText} rows="2"
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your reply..."
                      className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-sm resize-none min-h-[50px]"
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => {
                        setReplyingTo(null);
                        setReplyText('');
                      }}
                        className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-all duration-200 font-medium text-xs"
                      >
                        Cancel
                      </button>
                      <button onClick={() => handleAddReply(comment.id)}
                        disabled={!replyText.trim()}
                        className="px-2.5 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="bi bi-send text-xs"></i>Reply
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {comment.replies.length > 0 && (
                <div className="mt-2 pl-3 border-l-2 border-gray-200 space-y-2">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="bg-gray-50 p-2.5 rounded-md">
                      <div className="flex items-start justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium text-xs">
                            {reply.author.charAt(0)}
                          </div>
                          <div>
                            <span className="font-medium text-gray-800 block text-xs">{reply.author}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(reply.timestamp).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                        <button onClick={() => handleLike(comment.id, true, reply.id)}
                          className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs transition-colors duration-200 ${reply.isLiked
                            ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <i className={`bi ${reply.isLiked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                          <span>{reply.likes}</span>
                        </button>
                      </div>
                      <p className="text-gray-700 text-xs leading-relaxed">{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {comments.length === 0 && (
            <div className="text-center py-6 bg-gray-50 rounded-md border border-gray-200">
              <i className="bi bi-chat-square-text text-2xl text-gray-400 mb-2"></i>
              <p className="text-gray-500 text-xs">No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </div>
      {/* --- End Comment Section --- */}
    </div>
  );
        case 'Announcements':
          return (
            <div>
       
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
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                            {course?.course}
                          </span>
                          <span className="text-xs text-gray-500">
                            {announcement.createdByName}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {announcement.createdAt ? new Date(announcement.createdAt.seconds * 1000).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : ''}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">{announcement.announcement}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        case 'Reviews':
  return (
    <div className="">
      {/* Rating Summary */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
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
            <span className="text-sm text-gray-500">
              {course?.totalRatings || reviews.length} ratings
            </span>
          </div>
        </div>
      </div>

      {/* Review Submission */}
      <div className="">
        <div className="flex items-center gap-10 ">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Leave a Review</h3>
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setNewReviewStars(star)}
              className="focus:outline-none hover:scale-110 transition-transform"
            >
              <i
                className={`bi ${
                  newReviewStars >= star ? 'bi-star-fill text-amber-400' : 'bi-star text-gray-300'
                } text-2xl`}
              ></i>
            </button>
          ))}
        </div>
        </div>
 
<div className="flex items-center gap-2  w-full mb-4 border-b border-gray-200 pb-4">
  <input
    type="text"
    value={newReviewComment}
    onChange={e => setNewReviewComment(e.target.value)}
    maxLength={300}
    className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-300 focus:outline-none bg-white"
    placeholder="Write your review here..."
  />
  <button
    className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-md transition-all duration-200 flex items-center gap-2"
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
        {reviews
          .filter(
            r =>
              (reviewFilter === 'All' || r.stars === Number(reviewFilter)) &&
              (reviewSearch === '' || r.comment?.toLowerCase().includes(reviewSearch.toLowerCase()))
          )
          .map(r => (
            <div
              key={r.id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <i
                    key={star}
                    className={`bi ${
                      r.stars >= star ? 'bi-star-fill text-amber-400' : 'bi-star text-gray-300'
                    } text-sm`}
                  ></i>
                ))}
                <span className="text-xs text-gray-500 ml-3">{r.author}</span>
                <span className="text-xs text-gray-400 ml-auto">
                  {new Date(r.timestamp).toLocaleDateString()}
                </span>
              </div>
              {r.comment && <p className="text-gray-700 text-sm">{r.comment}</p>}
            </div>
          ))}
        {reviews.length === 0 && (
          <div className="text-center text-gray-400 py-8 italic">
            No reviews yet. Be the first!
          </div>
        )}
      </div>
    </div>
  );
// ...existing code...
case 'Assessment':
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
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {studentAssessments.map(a => (
          <div
            key={a.id}
            className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl p-8 transition-shadow hover:shadow-md text-center"
          >
            <div className="mb-3">
              <i className={`bi ${
                a.type === "Pre-Test" ? "bi-journal-check text-blue-600" :
                a.type === "Post-Test" ? "bi-journal-text text-green-600" :
                a.type === "Mock Exam" ? "bi-clock text-purple-600" :
                "bi-award text-red-600"
              }`} style={{ fontSize: "2.2rem" }}></i>
            </div>
            <div className="font-semibold text-gray-800 text-lg mb-1">{a.type}</div>
            <div className="text-sm text-gray-500 mb-2">{a.description}</div>
            {/* Status/Score below, optional */}
           
           
          </div>
        ))}
      </div>
      {studentAssessments.length === 0 && (
        <div className="text-center text-gray-400 py-8 italic">
          No assessments assigned yet.
        </div>
      )}
    </div>
  );
// ...existing code...

          case 'Q&A':
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <input type="text"
          placeholder="Search all course questions"
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-blue-500 transition bg-white text-sm"
        />
        <button className="bg-blue-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200">
          <i className="bi bi-search"></i>
        </button>
      </div>
      <div className='flex justify-between items-center mb-4'>
        <div className="flex flex-wrap items-center gap-6 mb-6">
          <span className="font-semibold text-gray-700">Filters:</span>
          <button className="border border-gray-300 px-4 py-2 rounded-lg bg-white text-gray-800 font-medium flex items-center gap-2 text-sm hover:border-blue-600">All lectures <i className="bi bi-chevron-down"></i></button>
          <span className="font-semibold text-gray-700">Sort by:</span>
          <button className="border border-gray-300 px-4 py-2 rounded-lg bg-white text-gray-800 font-medium flex items-center gap-2 text-sm hover:border-blue-600">Sort by recommended <i className="bi bi-chevron-down"></i></button>
          <button className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2'">Filter questions <i className="bi bi-chevron-down"></i></button>
        </div>
        <button
          className='border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2'
          onClick={() => setShowQuestionModal(true)}
        >
          <i className="bi bi-plus-circle "></i>
          <span className="">Ask a question</span>
        </button>
      </div>
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
      />
    </div>
  );
        case 'Quizzes':
  return (
    <div className="px-4 py-2">
      <div>
       

        {quizzesLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
            <i className="bi bi-pencil-square text-5xl text-gray-300 mb-3"></i>
            <p className="text-gray-500 text-lg">No quizzes available yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{quiz.title}</h3>
                    <div className="flex items-center flex-wrap gap-2 text-sm text-gray-600 mb-3">
                      <span className="bg-gray-100 px-2 py-0.5 rounded-full text-gray-700">📂 {quiz.topic}</span>
                      <span className="text-gray-400">•</span>
                      <span>{quiz.questions.length} question{quiz.questions.length !== 1 && 's'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedQuiz(quiz)}
                    className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
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
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-900">📝 Quiz: {selectedQuiz.title}</h2>
              <button
                onClick={() => setSelectedQuiz(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
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
      <section className="">
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
                        className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
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

        <div className="bg-white shadow-lg p-2 border border-gray-100">
          <div className="border-b border-gray-200 flex gap-2">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors duration-150 ${activeTab === tab ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:text-blue-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="min-h-[200px] p-4">
            {renderTabContent()}
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full gap-4 bg-gray-50">
        <div className="p-4 border border-gray-100 h-full overflow-y-auto">
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

          <div className="space-y-2 max-h-[calc(100vh-160px)] overflow-y-auto pr-2">
            {lessons.length === 0 ? (
              <p className="text-gray-500 italic text-center py-4">No lessons available yet</p>
            ) : (
              lessons.map((lesson, idx) => (
                <div key={idx} className="border border-gray-300 rounded-lg">
                  <div
                    className="flex items-center justify-between p-2 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => toggleSection(idx)}
                  >
                    <div className="flex items-center gap-1">
                      <i className={`bi ${expandedSections[idx] ? 'bi-chevron-down' : 'bi-chevron-right'} text-gray-600`}></i>
                      <h3 className="font-bold text-gray-800 text-sm">{lesson.title}</h3>
                    </div>
                    <button
                      className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200 transition-colors duration-200 relative z-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(`section-${idx}`);
                      }}
                    >
                      <i className="bi bi-three-dots-vertical"></i>
                      {dropdownOpen === `section-${idx}` && (
                        <div className="absolute right-0 top-0 mr-8 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-[100] overflow-hidden">
                          <button
                            className="flex items-center gap-1.5 w-full px-3 py-2 hover:bg-gray-50 text-gray-700 transition-colors duration-200 text-sm"
                            onClick={() => handleEditSection(idx)}
                          >
                            <i className="bi bi-pencil"></i>
                            Edit
                          </button>
                          <button
                            className="flex items-center gap-1.5 w-full px-3 py-2 hover:bg-gray-50 text-red-600 transition-colors duration-200 text-sm"
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
                            className={`flex items-center gap-2 text-sm p-2 rounded-lg transition-colors duration-200 cursor-pointer ${
                              selectedLecture && selectedLecture.id === lec.id
                                ? 'bg-blue-100 text-blue-700 font-semibold'
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
                                      className="text-xs px-2 py-0.5 bg-gray-100 rounded-full flex items-center gap-1"
                                    >
                                      <i className={`bi ${file.fileType === 'application/pdf' ? 'bi-file-pdf' : 'bi-file-play'}`}></i>
                                      {file.fileName}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-400 italic text-center py-2">No lectures yet in this lesson</li>
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
