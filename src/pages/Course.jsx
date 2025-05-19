import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHandleCourses } from '../hooks/useHandleCourses';
import { useHandleAnnouncements } from '../hooks/useHandleAnnouncements';
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
import { useAuth } from '../auth/components/authContext';
import QuizDisplay from '../components/QuizDisplay';
import QuestionModal from '../utils/QuestionModal';
import ReviewModal from '../utils/ReviewModal';
import Loading from '../components/Loading';

const Course = () => {
  try {
    const { id } = useParams();
    const { createAnnouncement, announcements, createdAnnouncements } = useHandleAnnouncements(id);
    const { courses, enrollStudentInCourse, enrolledCourses, courseLimit } = useHandleCourses();
    const { lessons } = useHandleLessons(id);
    const { membershipPlan } = useAuth();
    const navigate = useNavigate();

    // Add useEffect to select first lesson and lecture
    useEffect(() => {
      if (lessons && lessons.length > 0) {
        // Set the first lesson as expanded
        setExpandedSections({ 0: true });
        
        // Get the first lesson's lectures
        const firstLesson = lessons[0];
        if (firstLesson.lectures && firstLesson.lectures.length > 0) {
          // Set the first lecture as selected
          setSelectedLecture(firstLesson.lectures[0]);
        }
      }
    }, [lessons]);

    const [activeTab, setActiveTab] = useState('Overview');
    const [expandedSections, setExpandedSections] = useState({});
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [confirmed, setConfirmed] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editNoteText, setEditNoteText] = useState('');
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');
    const [questionSearch, setQuestionSearch] = useState('');
    const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
    const [question, setQuestion] = useState('');
    const [review, setReview] = useState({ rating: 0, comment: '' });

    const {
      quizzes,
      loading: quizzesLoading,
      submitQuizAttempt,
      getQuizAttempts
    } = useHandleQuizzes(id);

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

    const course = courses?.find(c => c.id === id) || null;

    if (loading || course === null) {
      return;
    }

    if (isEnrolling) {
      return;
    }

    const handleConfirm = async () => {
      setIsEnrolling(true);
      await enrollStudentInCourse(course.id);
      window.location.reload();
    };

  const handleCancel = () => {
    navigate('/dashboard');
  };

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

    if (!confirmed) {
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

    const toggleSection = (sectionIndex) => {
      setExpandedSections(prev => ({
        ...prev,
        [sectionIndex]: !prev[sectionIndex]
      }));
    };

    const handleFileSelect = (file) => {
      setSelectedFile(file);
    };

    const renderFilePreview = (file) => {
      if (!file) return null;

      if (file.fileType === 'application/pdf') {
        return (
          <iframe
            src={file.fileUrl}
            className="w-full h-[600px] rounded-lg shadow-lg"
            title={file.fileName}
          />
        );
      } else if (file.fileType.startsWith('video/')) {
        return (
          <video
            controls
            className="w-full rounded-lg shadow-lg"
            src={file.fileUrl}
          >
            Your browser does not support the video tag.
          </video>
        );
      }
      return null;
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

    const handleAddNote = (e) => {
      e.preventDefault();
      if (newNote.trim()) {
        setNotes([
          ...notes,
          {
            id: Date.now(),
            text: newNote,
            timestamp: new Date().toISOString()
          }
        ]);
        setNewNote('');
      }
    };

    const handleEditNote = (noteId) => {
      setEditingNoteId(noteId);
      const note = notes.find(n => n.id === noteId);
      if (note) {
        setEditNoteText(note.text);
      }
    };

    const handleSaveEdit = (noteId) => {
      setNotes(notes.map(note => {
        if (note.id === noteId) {
          return {
            ...note,
            text: editNoteText
          };
        }
        return note;
      }));
      setEditingNoteId(null);
      setEditNoteText('');
    };

    const handleDeleteNote = (noteId) => {
      setNotes(notes.filter(note => note.id !== noteId));
      setEditingNoteId(null);
      setEditNoteText('');
    };

    const getReviewTemplate = (rating) => {
      const templates = {
        5: "Excellent course! The content was comprehensive and well-structured. The instructor was knowledgeable and engaging.",
        4: "Great course with valuable content. The material was well-presented and easy to follow.",
        3: "Good course overall. The content was informative but could use some improvements.",
        2: "The course was okay, but there's room for improvement in content and delivery.",
        1: "The course needs significant improvements in content and structure."
      };
      return templates[rating] || "";
    };

    const handleAddQuestion = () => {
      if (!newQuestion.trim()) return;
      
      const question = {
        id: Date.now(),
        text: newQuestion,
        author: 'You',
        timestamp: new Date().toISOString(),
        likes: 0,
        answers: []
      };
      
      setQuestions([question, ...questions]);
      setNewQuestion('');
      setShowQuestionModal(false);
    };

    const handleAddAnswer = (questionId, answer) => {
      setQuestions(questions.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: [...q.answers, {
              id: Date.now(),
              text: answer,
              author: 'You',
              timestamp: new Date().toISOString(),
              likes: 0
            }]
          };
        }
        return q;
      }));
    };

    const handleLikeQuestion = (questionId) => {
      setQuestions(questions.map(q => {
        if (q.id === questionId) {
          return { ...q, likes: q.likes + 1 };
        }
        return q;
      }));
    };

    const handleAddReview = () => {
      if (newReview.rating === 0) return;
      
      const review = {
        id: Date.now(),
        rating: newReview.rating,
        comment: newReview.comment || getReviewTemplate(newReview.rating),
        author: 'You',
        timestamp: new Date().toISOString(),
        likes: 0
      };
      
      setReviews([review, ...reviews]);
      setNewReview({ rating: 0, comment: '' });
      setShowReviewModal(false);
    };

    const tabs = ['Overview', 'Announcements', 'Notes', 'Q&A', 'Reviews', 'Assessment', 'Quizzes'];

    const renderTabContent = () => {
      switch (activeTab) {
        case 'Overview':
          return (
            <div>
              <h2 className="text-2xl mb-1">{course?.course || 'Loading...'}</h2>
              <p className="text-gray-700 text-sm mb-4">{course?.description || 'Loading course description...'}</p>

              {/* Course Statistics */}
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-1">
                  <span className="text-xl font-bold text-amber-500">{course?.rating || '4.3'}</span>
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

              {/* Comments Section */}
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-800">Comment Section</h3>
                  <span className="text-xs text-gray-500">{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
                </div>

                {/* Comment Form */}
                <form onSubmit={handleAddComment} className="mb-5">
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      className="w-full p-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-sm resize-none min-h-[60px] shadow-sm"
                      rows="2"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm hover:shadow-md"
                      >
                        <i className="bi bi-send text-xs"></i>
                        Post
                      </button>
                    </div>
                  </div>
                </form>

                {/* Comments List */}
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
                        <button
                          onClick={() => handleLike(comment.id)}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors duration-200 ${
                            comment.isLiked
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <i className={`bi ${comment.isLiked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                          <span>{comment.likes}</span>
                        </button>
                      </div>
                      <p className="text-gray-700 text-sm mb-2 leading-relaxed">{comment.text}</p>

                      {/* Reply Button */}
                      <button
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1 px-2 py-0.5 rounded-full hover:bg-gray-50 transition-colors duration-200"
                      >
                        <i className="bi bi-reply"></i>
                        Reply
                      </button>

                      {/* Reply Form */}
                      {replyingTo === comment.id && (
                        <div className="mt-2 pl-3 border-l-2 border-blue-200">
                          <div className="flex flex-col gap-2">
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write your reply..."
                              className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-sm resize-none min-h-[50px]"
                              rows="2"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText('');
                                }}
                                className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-all duration-200 font-medium text-xs"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleAddReply(comment.id)}
                                disabled={!replyText.trim()}
                                className="px-2.5 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                              >
                                <i className="bi bi-send text-xs"></i>
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Replies List */}
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
                                <button
                                  onClick={() => handleLike(comment.id, true, reply.id)}
                                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs transition-colors duration-200 ${
                                    reply.isLiked
                                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
            </div>
          );
        case 'Announcements':
          return (
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
          );
        case 'Notes':
          return (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-800">Course Notes</h2>
                <span className="text-xs text-gray-500">{notes.length} {notes.length === 1 ? 'note' : 'notes'}</span>
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="mb-5">
                <div className="flex flex-col gap-2">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Take a note..."
                    className="w-full p-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-sm resize-none min-h-[80px] shadow-sm"
                    rows="3"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newNote.trim()}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm hover:shadow-md"
                    >
                      <i className="bi bi-plus-lg text-xs"></i>
                      Add Note
                    </button>
                  </div>
                </div>
              </form>

              {/* Notes List */}
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="bg-white p-3 rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                    {editingNoteId === note.id ? (
                      <div className="flex flex-col gap-2">
                        <textarea
                          value={editNoteText}
                          onChange={(e) => setEditNoteText(e.target.value)}
                          className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-sm resize-none min-h-[60px]"
                          rows="3"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingNoteId(null);
                              setEditNoteText('');
                            }}
                            className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-all duration-200 font-medium text-xs"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(note.id)}
                            disabled={!editNoteText.trim()}
                            className="px-2.5 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{note.text}</p>
                          <div className="flex items-center gap-1 ml-2">
                            <button
                              onClick={() => handleEditNote(note.id)}
                              className="p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-50 transition-colors duration-200"
                            >
                              <i className="bi bi-pencil text-xs"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-50 transition-colors duration-200"
                            >
                              <i className="bi bi-trash text-xs"></i>
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(note.timestamp).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {notes.length === 0 && (
                  <div className="text-center py-6 bg-gray-50 rounded-md border border-gray-200">
                    <i className="bi bi-journal-text text-2xl text-gray-400 mb-2"></i>
                    <p className="text-gray-500 text-xs">No notes yet. Start taking notes to keep track of important information!</p>
                  </div>
                )}
              </div>
            </div>
          );
        case 'Q&A':
          return (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium text-gray-800">Course Questions</h2>
                <button
                  onClick={() => setShowQuestionModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
                >
                  <i className="bi bi-plus-lg"></i>
                  Ask Question
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Search all course questions"
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-blue-500 transition bg-white text-sm"
                />
                <button className="bg-blue-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200">
                  <i className="bi bi-search"></i>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-6 mb-6">
                <span className="font-semibold text-gray-700">Filters:</span>
                <button className="border border-gray-300 px-4 py-2 rounded-lg bg-white text-gray-800 font-medium flex items-center gap-2 text-sm hover:border-blue-600">All lectures <i className="bi bi-chevron-down"></i></button>
                <span className="font-semibold text-gray-700">Sort by:</span>
                <button className="border border-gray-300 px-4 py-2 rounded-lg bg-white text-gray-800 font-medium flex items-center gap-2 text-sm hover:border-blue-600">Sort by recommended <i className="bi bi-chevron-down"></i></button>
                <button className="border border-blue-600 text-blue-700 px-4 py-2 rounded-lg font-medium text-sm bg-white hover:bg-blue-50 transition flex items-center gap-2">Filter questions <i className="bi bi-chevron-down"></i></button>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {questions.map((question) => (
                  <div key={question.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                          {question.author.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{question.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{question.author}</span>
                            <span>•</span>
                            <span>{new Date(question.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {question.answers.length} answers
                        </span>
                        <button className="text-gray-500 hover:text-blue-600">
                          <i className="bi bi-bookmark"></i>
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{question.content}</p>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600">
                        <i className="bi bi-hand-thumbs-up"></i>
                        <span>{question.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600">
                        <i className="bi bi-chat"></i>
                        <span>Answer</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        case 'Reviews':
          return (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium text-gray-800">Course Reviews</h2>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
                >
                  <i className="bi bi-plus-lg"></i>
                  Write Review
                </button>
              </div>

              {/* Rating Summary */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">4.5</div>
                    <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i key={star} className="bi bi-star-fill"></i>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">Based on 128 reviews</div>
                  </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-2 mb-2">
                        <div className="w-12 text-sm text-gray-600">{rating} stars</div>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500"
                            style={{ width: `${(rating / 5) * 100}%` }}
                          ></div>
                        </div>
                        <div className="w-12 text-sm text-gray-600 text-right">
                          {Math.round((rating / 5) * 100)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                          {review.author.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{review.author}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <div className="flex items-center text-amber-500">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <i
                                  key={star}
                                  className={`bi bi-star${star <= review.rating ? '-fill' : ''}`}
                                ></i>
                              ))}
                            </div>
                            <span>•</span>
                            <span>{new Date(review.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-gray-700">{review.comment}</p>
                    )}
                    {!review.comment && (
                      <p className="text-gray-500 italic">
                        {getReviewTemplate(review.rating)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        case 'Assessment':
          return (
            <div className="space-y-4">
              {/* Assessment List */}
              <div className="space-y-4">
                {/* Pre-Test */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <i className="bi bi-journal-check text-2xl text-blue-600"></i>
                      <div>
                        <h3 className="font-medium text-gray-900">Pre-Test</h3>
                        <p className="text-sm text-gray-500">Evaluate initial understanding</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Available</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Scheduled Date & Time</p>
                      <p className="font-medium">March 10, 2024 at 9:00 AM</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Time Limit</p>
                      <p className="font-medium">No time limit</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Passing Score</p>
                      <p className="font-medium">60%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status</p>
                      <p className="font-medium">Available Now</p>
                    </div>
                  </div>
                </div>

                {/* Post-Test */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <i className="bi bi-journal-text text-2xl text-green-600"></i>
                      <div>
                        <h3 className="font-medium text-gray-900">Post-Test</h3>
                        <p className="text-sm text-gray-500">Assess learning outcomes</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">Scheduled</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Scheduled Date & Time</p>
                      <p className="font-medium">March 15, 2024 at 10:00 AM</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Time Limit</p>
                      <p className="font-medium">No time limit</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Passing Score</p>
                      <p className="font-medium">70%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status</p>
                      <p className="font-medium">Not Available Yet</p>
                    </div>
                  </div>
                </div>

                {/* Mock Exam */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <i className="bi bi-clock text-2xl text-purple-600"></i>
                      <div>
                        <h3 className="font-medium text-gray-900">Mock Exam</h3>
                        <p className="text-sm text-gray-500">Timed simulation</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">Scheduled</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Scheduled Date & Time</p>
                      <p className="font-medium">March 20, 2024 at 1:00 PM</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Time Limit</p>
                      <p className="font-medium">2 hours</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Passing Score</p>
                      <p className="font-medium">75%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status</p>
                      <p className="font-medium">Not Available Yet</p>
                    </div>
                  </div>
                </div>

                {/* Final Exam */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <i className="bi bi-award text-2xl text-red-600"></i>
                      <div>
                        <h3 className="font-medium text-gray-900">Final Exam</h3>
                        <p className="text-sm text-gray-500">Comprehensive evaluation</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">Scheduled</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Scheduled Date & Time</p>
                      <p className="font-medium">March 25, 2024 at 9:00 AM</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Time Limit</p>
                      <p className="font-medium">3 hours</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Passing Score</p>
                      <p className="font-medium">80%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status</p>
                      <p className="font-medium">Not Available Yet</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        case 'Quizzes':
          return (
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
          );
        default:
          return null;
      }
    };

    return (
      <section className="p-10 sm:px-4 lg:px-6">
        <div className="mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Sidebar */}
            <div className="flex flex-col w-full gap-4 lg:col-span-3">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-medium text-gray-800 flex items-center gap-2">
                    {course?.course || 'Loading...'}
                  </h2>
                </div>
                <div className="space-y-4">
                  {lessons.map((lesson, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg">
                      <div
                        className="flex items-center justify-between p-2 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => toggleSection(idx)}
                      >
                        <div className="flex items-center gap-1">
                          <i className={`bi ${expandedSections[idx] ? 'bi-chevron-down' : 'bi-chevron-right'} text-gray-600`}></i>
                          <h3 className="font-bold text-gray-800 text-sm">{lesson.title}</h3>
                        </div>
                      </div>
                      {expandedSections[idx] && (
                        <ul className="p-2">
                          {Array.isArray(lesson.lectures) &&
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
                                    <div className="flex items-center gap-2 mt-1">
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
                            ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col w-full gap-4 lg:col-span-9">
              {/* Course Header */}
              <div className="flex flex-col gap-4">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  {selectedLecture ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">{selectedLecture.title}</h2>
                        <div className="flex items-center gap-2">
                          {selectedLecture.lectureFiles && selectedLecture.lectureFiles.length > 0 && (
                            <div className="flex items-center gap-2">
                              {selectedLecture.lectureFiles.map((file, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleFileSelect(file)}
                                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors duration-200 ${
                                    selectedFile?.fileName === file.fileName
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                >
                                  <i className={`bi ${file.fileType === 'application/pdf' ? 'bi-file-pdf' : 'bi-file-play'}`}></i>
                                  {file.fileName}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700">{selectedLecture.content}</p>

                      {/* File Preview Section */}
                      {selectedFile && (
                        <div className="mt-6 border-t border-gray-200 pt-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-800">Learning Material</h3>
                            <button
                              onClick={() => setSelectedFile(null)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </div>
                          {renderFilePreview(selectedFile)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <i className="bi bi-journal-text text-4xl text-gray-400 mb-3"></i>
                      <p className="text-gray-500">Select a lecture to view its content and materials</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tabs and Content */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="border-b border-gray-200 mb-4 flex gap-2">
                  {tabs.map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors duration-150 ${
                        activeTab === tab ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:text-blue-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="min-h-[200px]">
                  {renderTabContent()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Modal */}
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

        <QuestionModal
          showModal={showQuestionModal}
          onClose={() => setShowQuestionModal(false)}
          question={question}
          setQuestion={setQuestion}
          onSubmit={() => {
            // Handle question submission logic here
            setShowQuestionModal(false);
            setQuestion('');
          }}
          error={null}
        />

        <ReviewModal
          showModal={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          review={review}
          setReview={setReview}
          onSubmit={() => {
            // Handle review submission logic here
            setShowReviewModal(false);
            setReview({ rating: 0, comment: '' });
          }}
          error={null}
        />
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
};

export default Course;
