import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHandleCourses } from '../../hooks/useHandleCourses';
import { useHandleStorage } from '../../hooks/useHandleStorage';
import { useHandleLessons } from '../../hooks/useHandleLessons';
import { useHandleAnnouncements } from '../../hooks/useHandleAnnouncements';
import QuizCreator from '../../components/QuizCreator';
import QuizDisplay from '../../utils/QuizDisplayModal';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';
import SectionModal from '../../utils/SectionModal';
import LessonModal from '../../utils/LessonModal';
import { useDarkMode } from '../../components/DarkModeContext'; // Import the useDarkMode hook

export default function CoursePage() {
  try {
    const [activeTab, setActiveTab] = useState('Overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [expandedSections, setExpandedSections] = useState({});
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [showAddSectionModal, setShowAddSectionModal] = useState(false);
    const [newSectionTitle, setNewSectionTitle] = useState('');
    const [newSectionDescription, setNewSectionDescription] = useState('');
    const [courseDetails, setCourseDetails] = useState(null);
    const [courseImage, setCourseImage] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [lessonId, setLessonId] = useState(null);
    const [selectedAssessmentType, setSelectedAssessmentType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('submittedAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [filterStatus, setFilterStatus] = useState('all');

    const dummyResults = [
      {
        id: 1,
        studentName: "John Doe",
        score: 85,
        submittedAt: "2024-03-15 14:30",
        timeTaken: "45m 30s",
        status: "passed",
        answers: [
          { question: "Question 1", correct: true },
          { question: "Question 2", correct: true },
          { question: "Question 3", correct: false },
          { question: "Question 4", correct: true },
          { question: "Question 5", correct: true }
        ]
      },
      {
        id: 2,
        studentName: "Jane Smith",
        score: 92,
        submittedAt: "2024-03-15 15:45",
        timeTaken: "38m 15s",
        status: "passed",
        answers: [
          { question: "Question 1", correct: true },
          { question: "Question 2", correct: true },
          { question: "Question 3", correct: true },
          { question: "Question 4", correct: true },
          { question: "Question 5", correct: false }
        ]
      },
      {
        id: 3,
        studentName: "Mike Johnson",
        score: 55,
        submittedAt: "2024-03-15 16:20",
        timeTaken: "52m 10s",
        status: "failed",
        answers: [
          { question: "Question 1", correct: true },
          { question: "Question 2", correct: false },
          { question: "Question 3", correct: false },
          { question: "Question 4", correct: true },
          { question: "Question 5", correct: false }
        ]
      }
    ];

    const filteredResults = dummyResults
      .filter(result => {
        const matchesSearch = result.studentName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || result.status === filterStatus;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const multiplier = sortOrder === 'asc' ? 1 : -1;
        switch (sortBy) {
          case 'score':
            return (a.score - b.score) * multiplier;
          case 'studentName':
            return a.studentName.localeCompare(b.studentName) * multiplier;
          case 'submittedAt':
            return (new Date(a.submittedAt) - new Date(b.submittedAt)) * multiplier;
          default:
            return 0;
        }
      });

    const [showAddLessonModal, setShowAddLessonModal] = useState(false);
    const [lessonTitle, setLessonTitle] = useState('');
    const [lessonDescription, setLessonDescription] = useState('');
    const [lessonFile, setLessonFile] = useState(null);
    const [lessonsError, setLessonsError] = useState('');
    const [activeSection, setActiveSection] = useState(null);
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [announcementText, setAnnouncementText] = useState('');
    const [announcementFiles, setAnnouncementFiles] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [quizResults, setQuizResults] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadDescription, setUploadDescription] = useState('');
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadError, setUploadError] = useState('');
    const { id } = useParams();
    const courseId = id;
    const { courses, getCourses } = useHandleCourses();
    const { fetchCourseImages } = useHandleStorage();
    const { addNewSection, addNewLecture, uploadLearningMaterial, uploadLessonFile, lessons = [] } = useHandleLessons(courseId);
    const { createAnnouncement, announcements: courseAnnouncements, loading: announcementsLoading } = useHandleAnnouncements(courseId);
    const course = courses.find(c => c.id === courseId);
    const navigate = useNavigate();
    const { darkMode } = useDarkMode(); // Use the useDarkMode hook

    useEffect(() => {
      if (course) {
        setCourseDetails(course);
      }
    }, [course]);

    useEffect(() => {
      if (lessons && lessons.length > 0) {
        setExpandedSections({ 0: true });
        const firstLesson = lessons[0];
        if (firstLesson.lectures && firstLesson.lectures.length > 0) {
          setSelectedLecture(firstLesson.lectures[0]);
        }
      }
    }, [lessons]);

    console.log('Found course:', course);
    console.log('Course ID:', courseId);
    console.log(courseDetails);
    const tabs = ['Overview', 'Q&A', 'Announcements', 'Reviews', 'Assessment', 'Learning tools', 'Quizzes'];

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
      await addNewSection(newSectionTitle, newSectionDescription);
      setShowAddSectionModal(false);
      setNewSectionTitle('');
      setNewSectionDescription('');
    };

    const handleEditSection = (sectionId) => {
      console.log('Editing section:', sectionId);
      setDropdownOpen(null); // Close the dropdown
    };

    const handleDeleteSection = (sectionId) => {
      console.log('Deleting section:', sectionId);
      setDropdownOpen(null); // Close the dropdown
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

    const handleLessonFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.type.includes('pdf') || file.type.includes('video')) {
          setLessonFile(file);
          setLessonsError('');
        } else {
          setLessonsError('Please upload only PDF or video files');
          setLessonFile(null);
        }
      }
    };

    const handleRemoveLessonFile = () => {
      setLessonFile(null);
    };

    const handleUploadLesson = async () => {
      if (!lessonId || !lessonTitle || !lessonDescription) {
        setLessonsError('Please fill in all required fields');
        return;
      }
      try {
        const success = await uploadLearningMaterial(
          lessonId,
          lessonFile
        );

        if (success) {
          console.log('Lecture created successfully');
          // Reset form
          setLessonTitle('');
          setLessonDescription('');
          setLessonFile(null);
          setShowAddLessonModal(false);
          setLessonsError('');
        } else {
          setLessonsError('Failed to create lecture');
        }
      } catch (error) {
        console.error('Error uploading lecture:', error);
        setLessonsError(error.message || 'Failed to upload lecture');
      }
    };

    const handleAnnouncementFileChange = (e) => {
      setAnnouncementFiles(Array.from(e.target.files));
    };

    const handleAddAnnouncement = async (e) => {
      e.preventDefault();
      if (announcementText.trim() && course) {
        try {
          await createAnnouncement(announcementText.trim(), course.course, courseId);
          setAnnouncementText('');
          setAnnouncementFiles([]);
        } catch (error) {
          console.error('Error creating announcement:', error);
        }
      }
    };

    const handleCreateQuiz = async (title, topic, questions) => {
      const processedQuestions = questions.map(q => {
        const correctIndex = q.options.indexOf(q.correctAnswer);
        return {
          ...q,
          correctAnswer: String.fromCharCode(65 + correctIndex) // Convert to A, B, C, or D
        };
      });

      const newQuiz = {
        id: Date.now(),
        title,
        topic,
        questions: processedQuestions,
        createdAt: new Date().toISOString()
      };

      console.log('New Quiz Created:', {
        title: newQuiz.title,
        topic: newQuiz.topic,
        totalQuestions: newQuiz.questions.length,
        questions: newQuiz.questions.map((q, index) => ({
          questionNumber: index + 1,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer // Now shows A, B, C, or D
        }))
      });

      setQuizzes([newQuiz, ...quizzes]);
      setCurrentQuiz(newQuiz);
    };

    const handleSubmitQuiz = async (quizId, answers) => {
      const quiz = quizzes.find(q => q.id === quizId);
      if (!quiz) return null;

      let score = 0;
      answers.forEach((answer, index) => {
        if (answer === quiz.questions[index].correctAnswer) {
          score++;
        }
      });

      const result = {
        score,
        percentage: (score / quiz.questions.length) * 100
      };

      console.log('Quiz Results:', {
        quizId,
        score,
        totalQuestions: quiz.questions.length,
        percentage: result.percentage,
        answers: answers.map((answer, index) => ({
          questionNumber: index + 1,
          submittedAnswer: answer,
          correctAnswer: quiz.questions[index].correctAnswer,
          isCorrect: answer === quiz.questions[index].correctAnswer
        }))
      });

      setQuizResults(prev => ({
        ...prev,
        [quizId]: result
      }));

      return result;
    };

    const handleViewQuizResults = async (quizId) => {
      return [
        { userName: 'Student 1', score: 8, percentage: 80 },
        { userName: 'Student 2', score: 7, percentage: 70 }
      ];
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
            className="w-full h-[500px] rounded-lg shadow-lg"
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

    const handleLearningMaterialFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.type.includes('pdf') || file.type.includes('video')) {
          setUploadFile(file);
          setUploadError('');
        } else {
          setUploadError('Please upload only PDF or video files');
          setUploadFile(null);
        }
      }
    };

    const handleUploadLearningMaterial = async () => {
      if (!uploadTitle || !uploadDescription || !uploadFile) {
        setUploadError('Please fill in all fields and select a file');
        return;
      }
      try {
        const success = await uploadLearningMaterial(
          uploadFile,
          uploadTitle,
          uploadDescription,
        );
        if (success) {
          console.log('Learning material uploaded successfully');
          setUploadTitle('');
          setUploadDescription('');
          setUploadFile(null);
          setShowUploadModal(false);
          setUploadError('');
        } else {
          setUploadError('Failed to upload learning material');
        }
      } catch (error) {
        console.error('Error uploading learning material:', error);
        setUploadError(error.message || 'Failed to upload learning material');
      }
    };

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
                  <p
                    className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm mb-4`}
                    dangerouslySetInnerHTML={{
                      __html: (selectedLecture.content || 'Loading course description...').replace(/\n/g, '<br />'),
                    }}
                  ></p>
                  <div className={`flex items-center gap-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <div className="flex items-center gap-1">
                      <span className={`text-lg font-bold text-amber-500 ${darkMode ? 'text-amber-400' : ''}`}>
                        {courseDetails?.rating || '4.3'}
                      </span>
                      <i className={`bi bi-star-fill text-amber-500 ${darkMode ? 'text-amber-400' : ''}`}></i>
                      <span className={`text-sm ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        ({courseDetails?.totalRatings || '10,508'} ratings)
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <i className={`bi bi-people ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}></i>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {courseDetails?.students || '185,456'} students
                      </span>
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <i className="bi bi-calendar-check"></i>
                      <span>Last updated {courseDetails?.lastUpdated || 'November 2017'}</span>
                    </div>
                  </div>
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
                              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors duration-200 ${comment.isLiked
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
                                      ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-blue-400'
                                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'}`}
                                />
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      setReplyingTo(null);
                                      setReplyText('');
                                    }}
                                    className={`px-2.5 py-1 rounded-md font-medium text-xs transition-all duration-200 ${darkMode
                                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleAddReply(comment.id)}
                                    disabled={!replyText.trim()}
                                    className={`px-2.5 py-1 rounded-md font-medium text-xs transition-all duration-200 ${darkMode
                                      ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                                      : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'}`}
                                  >
                                    <i className="bi bi-send text-xs"></i>Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                          {comment.replies.length > 0 && (
                            <div className="mt-2 pl-3 border-l-2 space-y-2" style={{ borderColor: darkMode ? '#374151' : undefined }}>
                              {comment.replies.map((reply) => (
                                <div
                                  key={reply.id}
                                  className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-800'}`}
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
                </>
              ) : (
                <div>
                  <h2 className={`text-xl mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {courseDetails?.course || 'Loading...'}
                  </h2>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm mb-4`}>
                    {courseDetails?.description || 'Loading...'}
                  </p>
                </div>
              )}
            </div>
          );
        case 'Announcements':
          return (
            <div>
              <h2 className={`text-lg font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Add Announcement</h2>
              <form onSubmit={handleAddAnnouncement} className="mb-6">
                <textarea
                  value={announcementText}
                  rows={3}
                  onChange={e => setAnnouncementText(e.target.value)}
                  placeholder="Write your announcement here..."
                  className={`w-full p-3 border rounded-lg shadow-sm text-sm resize-none min-h-[80px] transition
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    ${darkMode
                      ? "bg-[#242526] border-gray-600 text-gray-200 placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }
                  `}
                />
                <div className="flex items-center justify-between">
                  <label className="inline-block">
                    <span className="sr-only">Upload files</span>
                    <input type="file" multiple className="hidden" onChange={handleAnnouncementFileChange} />
                    <span className={`px-4 py-1.5 border rounded-md cursor-pointer transition-all duration-200 text-sm font-medium
                      ${darkMode
                        ? 'border-gray-600 text-gray-200 hover:text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400'
                        : 'border-blue-600 text-blue-700 hover:text-white hover:bg-blue-700'
                      }`}>
                      Upload Files
                    </span>
                  </label>
                  <button
                    type="submit"
                    disabled={!announcementText.trim()}
                    className={`px-4 py-1.5 rounded-md transition-all duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed
                      ${darkMode
                        ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400'
                        : 'bg-blue-700 text-white hover:bg-blue-800'}`}
                  >
                    Add Announcement
                  </button>
                </div>
                {announcementFiles.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {announcementFiles.map((file, idx) => (
                      <span key={idx} className={`px-2 py-1 rounded text-xs border
                        ${darkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                        {file.name}
                      </span>
                    ))}
                  </div>
                )}
              </form>
              <div className="space-y-4">
                {announcementsLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className={`animate-spin rounded-full h-8 w-8 border-2 ${darkMode ? 'border-blue-400 border-t-transparent' : 'border-blue-600 border-t-transparent'}`}></div>
                  </div>
                ) : courseAnnouncements.filter(a => a.courseId === courseId).length === 0 ? (
                  <div className={`text-center py-6 rounded-md border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <i className={`bi bi-megaphone text-2xl mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}></i>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No announcements yet for {course?.course}</p>
                  </div>
                ) : (
                  courseAnnouncements
                    .filter(a => a.courseId === courseId)
                    .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
                    .map(announcement => (
                      <div key={announcement.id} className={`p-3 rounded-md border shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                              {course?.course}
                            </span>
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {announcement.createdByName}
                            </span>
                          </div>
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {announcement.createdAt ? new Date(announcement.createdAt.seconds * 1000).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : ''}
                          </span>
                        </div>
                        <p className={`text-sm whitespace-pre-wrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{announcement.announcement}</p>
                      </div>
                    ))
                )}
              </div>
            </div>
          );
        case 'Reviews':
          return (
            <div>
              <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Reviews</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>Reviews section coming soon.</p>
            </div>
          );
        case 'Assessment':
          return (
            <div>
              <div className="space-y-4">
                <h2 className={`text-xl mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Manage Assessment</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => navigate(`/assessment/${id}/pre-test`)}
                    className={`flex flex-col items-center p-4 rounded-lg hover:shadow-md transition-all duration-200 border
                      ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
                  >
                    <i className={`bi bi-journal-check text-3xl mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}></i>
                    <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Pre-Test</span>
                    <span className={`text-sm text-center mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Evaluate initial understanding</span>
                  </button>
                  <button
                    onClick={() => navigate(`/assessment/${id}/post-test`)}
                    className={`flex flex-col items-center p-4 rounded-lg hover:shadow-md transition-all duration-200 border
                      ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
                  >
                    <i className={`bi bi-journal-text text-3xl mb-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}></i>
                    <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Post-Test</span>
                    <span className={`text-sm text-center mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Assess learning outcomes</span>
                  </button>
                  <button
                    onClick={() => navigate(`/assessment/${id}/mock-exam`)}
                    className={`flex flex-col items-center p-4 rounded-lg hover:shadow-md transition-all duration-200 border
                      ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
                  >
                    <i className={`bi bi-clock text-3xl mb-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}></i>
                    <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Mock Exam</span>
                    <span className={`text-sm text-center mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Timed simulation</span>
                  </button>
                  <button
                    onClick={() => navigate(`/assessment/${id}/final-exam`)}
                    className={`flex flex-col items-center p-4 rounded-lg hover:shadow-md transition-all duration-200 border
                      ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
                  >
                    <i className={`bi bi-award text-3xl mb-2 ${darkMode ? 'text-red-400' : 'text-red-600'}`}></i>
                    <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Final Exam</span>
                    <span className={`text-sm text-center mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Comprehensive evaluation</span>
                  </button>
                </div>
              </div>
              <div>
                <div className="mb-6 mt-2">
                  <div className={`flex items-center gap-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button
                      onClick={() => setSelectedAssessmentType('all')}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200
                        ${selectedAssessmentType === 'all'
                          ? darkMode ? 'border-blue-400 text-blue-400' : 'border-blue-600 text-blue-700'
                          : darkMode ? 'border-transparent text-gray-400 hover:text-blue-400' : 'border-transparent text-gray-600 hover:text-blue-700'}`}
                    >
                      All Assessments
                    </button>
                    <button
                      onClick={() => setSelectedAssessmentType('pre-test')}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200
                        ${selectedAssessmentType === 'pre-test'
                          ? darkMode ? 'border-blue-400 text-blue-400' : 'border-blue-600 text-blue-700'
                          : darkMode ? 'border-transparent text-gray-400 hover:text-blue-400' : 'border-transparent text-gray-600 hover:text-blue-700'}`}
                    >
                      Pre-Test
                    </button>
                    <button
                      onClick={() => setSelectedAssessmentType('post-test')}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200
                        ${selectedAssessmentType === 'post-test'
                          ? darkMode ? 'border-blue-400 text-blue-400' : 'border-blue-600 text-blue-700'
                          : darkMode ? 'border-transparent text-gray-400 hover:text-blue-400' : 'border-transparent text-gray-600 hover:text-blue-700'}`}
                    >
                      Post-Test
                    </button>
                    <button
                      onClick={() => setSelectedAssessmentType('mock-exam')}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200
                        ${selectedAssessmentType === 'mock-exam'
                          ? darkMode ? 'border-blue-400 text-blue-400' : 'border-blue-600 text-blue-700'
                          : darkMode ? 'border-transparent text-gray-400 hover:text-blue-400' : 'border-transparent text-gray-600 hover:text-blue-700'}`}
                    >
                      Mock Exam
                    </button>
                    <button
                      onClick={() => setSelectedAssessmentType('final-exam')}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200
                        ${selectedAssessmentType === 'final-exam'
                          ? darkMode ? 'border-blue-400 text-blue-400' : 'border-blue-600 text-blue-700'
                          : darkMode ? 'border-transparent text-gray-400 hover:text-blue-400' : 'border-transparent text-gray-600 hover:text-blue-700'}`}
                    >
                      Final Exam
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Search by student name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'}`}
                    />
                  </div>
                  <div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-800'}`}
                    >
                      <option value="all">All Status</option>
                      <option value="passed">Passed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={`flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-800'}`}
                    >
                      <option value="submittedAt">Sort by Date</option>
                      <option value="score">Sort by Score</option>
                      <option value="studentName">Sort by Name</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className={`p-2 border rounded-lg hover:bg-gray-50
                        ${darkMode ? 'border-gray-600 text-gray-200 hover:bg-gray-700' : 'border-gray-300 text-gray-800'}`}
                    >
                      <i className={`bi bi-arrow-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className={`p-3 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Submissions</p>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>{filteredResults.length}</p>
                    </div>
                    <div className={`p-3 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Average Score</p>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                        {Math.round(filteredResults.reduce((acc, curr) => acc + curr.score, 0) / filteredResults.length)}%
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pass Rate</p>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                        {Math.round((filteredResults.filter(r => r.status === 'passed').length / filteredResults.length) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
                <div className={`w-full rounded-xl border overflow-hidden ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                  <div className={`flex items-center px-4 py-3 text-sm font-semibold border-b sticky top-0
                    ${darkMode ? 'border-gray-700 bg-gray-800 text-gray-300' : 'border-gray-200 bg-gray-50 text-gray-700'}`}>
                    <div className="flex-1 font-medium">Student Name</div>
                    <div className="flex-1 text-center font-medium">Status</div>
                    <div className="flex-1 text-center font-medium">Score</div>
                    <div className="flex-1 text-center font-medium">Time Spent</div>
                    <div className="flex-1 text-center font-medium">Submitted</div>
                    <div className="flex-1 text-center font-medium">Actions</div>
                  </div>
                  {filteredResults.map((result, idx) => {
                    const totalQuestions = result.answers.length;
                    const correctAnswers = result.answers.filter(a => a.correct).length;
                    const scoreString = `${correctAnswers}/${totalQuestions} (${result.score}%)`;
                    const dateObj = new Date(result.submittedAt.replace(' ', 'T'));
                    const formattedDate = dateObj.toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    });
                    const displayDate = formattedDate.replace(',', '').replace(/\s+/, ' ').replace('AM', 'am').replace('PM', 'pm').replace(',', '').replace(' at', ' at');
                    return (
                      <div key={result.id}
                        className={`flex items-center px-4 py-3.5 text-sm border-b last:border-b-0 transition-all duration-200
                          ${idx % 2 === 0 ? darkMode ? 'bg-gray-800' : 'bg-white' : darkMode ? 'bg-gray-700' : 'bg-gray-50'}
                          hover:bg-blue-50 group`}
                      >
                        <div className="flex-1 min-w-[120px]">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>{result.studentName}</span>
                          </div>
                        </div>
                        <div className="flex-1 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium
                            ${result.status === 'passed'
                              ? 'bg-green-100 text-green-700 border border-green-200'
                              : 'bg-red-100 text-red-700 border border-red-200'}`}>
                            {result.status === 'passed' ? 'Passed' : 'Failed'}
                          </span>
                        </div>
                        <div className="flex-1 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            <span className={`text-sm font-medium
                              ${result.status === 'passed' ? 'text-green-600' : 'text-red-600'}`}>
                              {scoreString}
                            </span>
                            {result.status === 'passed' && (
                              <i className="bi bi-check-circle-fill text-green-500 text-xs"></i>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 text-center">
                          <div className="inline-flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-full">
                            <span className="text-gray-700 font-medium">{result.timeTaken.toUpperCase()}</span>
                          </div>
                        </div>
                        <div className="flex-1 text-center">
                          <div className="inline-flex items-center gap-1.5 text-gray-600">
                            <span className="text-sm">{displayDate}</span>
                          </div>
                        </div>
                        <div className="flex-1 text-center">
                          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                            <i className="bi bi-eye text-sm"></i>View Details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        case 'Quizzes':
          return (
            <div className="space-y-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className={`text-xl mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Generate Quiz</h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Quiz per lecture will be generated automatically -- select a lecture to generate a quiz -- comment ito</p>
                </div>
                <div className="flex items-center gap-4">
                  <select
                    defaultValue=""
                    className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm
                      ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-800'}`}
                  >
                    <option value="" disabled>Select a lecture</option>
                    <option value="intro">Introduction to Criminal Law</option>
                    <option value="elements">Elements of a Crime</option>
                    <option value="defenses">Criminal Defenses</option>
                    <option value="procedure">Criminal Procedure</option>
                    <option value="evidence">Rules of Evidence</option>
                  </select>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium
                    ${darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                    <i className="bi bi-lightning-charge-fill mr-1"></i>Powered by AI
                  </span>
                </div>
              </div>
              <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-50 to-purple-50'}`}>
                <QuizCreator onCreateQuiz={handleCreateQuiz} />
              </div>
            </div>
          );
        case 'Learning tools':
          return (

            <div className="space-y-6">
              <div className={`rounded-lg shadow p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-2xl font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Learning Materials Library</h2>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className={`px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2
        ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'}`}
                  >
                    <i className="bi bi-upload"></i>
                    Upload Material
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  {['all', 'pdf', 'video'].map(tab => (
                    <button
                      key={tab}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${activeTab === tab
                        ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
                        : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      onClick={() => {setActiveTab(tab); console.log(activeTab)}}
                    >
                      {tab === 'all' ? 'All Materials' : tab === 'pdf' ? 'PDFs' : 'Videos'}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {course.learningMaterials?.filter(file =>
                    activeTab === 'all' ||
                    (activeTab === 'pdf' && file.fileType?.toLowerCase().includes('pdf')) ||
                    (activeTab === 'video' && file.fileType?.toLowerCase().startsWith('video/'))
                  )
                    .map((file, index) => (
                      <div key={index}
                        className={`rounded-lg p-4 hover:shadow-md transition-shadow duration-200 border
            ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${file.fileType === 'application/pdf'
                            ? darkMode ? 'bg-red-900 text-red-400' : 'bg-red-100 text-red-600'
                            : darkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'
                            }`}>
                            <i className={`bi ${file.fileType === 'application/pdf' ? 'bi-file-pdf' : 'bi-file-play'} text-xl`}></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-medium mb-1 truncate ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                              {file.fileName}
                            </h3>
                            <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {file.fileTitle}
                            </p>
                            <p className={`text-xs mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                              {file.fileDescription}
                            </p>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleFileSelect(file)}
                                className={`text-sm font-medium flex items-center gap-1
                    ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                              >
                                <i className="bi bi-eye"></i> View
                              </button>
                              <a
                                href={file.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-sm font-medium flex items-center gap-1
                    ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                              >
                                <i className="bi bi-download"></i> Download
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {(!course.learningMaterials || course.learningMaterials.length === 0 ||
                  !course.learningMaterials.some(file =>
                    activeTab === 'all' ||
                    (activeTab === 'pdf' && file.fileType?.toLowerCase().includes('pdf')) ||
                    (activeTab === 'video' && file.fileType?.toLowerCase().startsWith('video/'))
                  )) && (
                    <div className="text-center py-12">
                      <i className={`bi bi-folder text-4xl mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}></i>
                      <p className={`text-gray-500 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No learning materials found</p>
                    </div>
                  )}
              </div>
              {showUploadModal && (
                <div className="modal-overlay">
                  <div className={`p-6 rounded-xl shadow-xl w-[90%] max-w-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className={`text-xl font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Upload Learning Material</h2>
                      <button
                        onClick={() => {
                          setShowUploadModal(false);
                          setUploadTitle('');
                          setUploadDescription('');
                          setUploadFile(null);
                          setUploadError('');
                        }}
                        className={`text-gray-500 hover:text-gray-700 ${darkMode ? 'hover:text-gray-300' : ''}`}
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                    {uploadError && (
                      <div className="mb-4 p-4 rounded-lg border">
                        <p className={`text-sm flex items-center gap-2 ${darkMode ? 'bg-gray-700 text-red-400 border-gray-600' : 'bg-red-50 text-red-600 border-red-200'}`}>
                          <i className="bi bi-exclamation-circle"></i>
                          {uploadError}
                        </p>
                      </div>
                    )}
                    <div className="flex flex-col gap-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Material Title"
                          value={uploadTitle}
                          onChange={(e) => setUploadTitle(e.target.value)}
                          className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pl-5
                            ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'}`}
                        />
                      </div>
                      <div className="relative">
                        <textarea
                          placeholder="Material Description"
                          rows={3}
                          value={uploadDescription}
                          onChange={(e) => setUploadDescription(e.target.value)}
                          className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none pl-5
                            ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'}`}
                        />
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <label className={`cursor-pointer border-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium px-6 py-2
                          ${darkMode ? 'border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white' : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'}`}>
                          <i className="bi bi-upload"></i>
                          <span>Select File (PDF/Video)</span>
                          <input type="file" accept=".pdf,video/*" onChange={handleLearningMaterialFileChange} className="hidden" />
                        </label>
                        <button
                          onClick={handleUploadLearningMaterial}
                          disabled={!uploadTitle || !uploadDescription || !uploadFile}
                          className={`py-2 px-8 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium
                            ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'}`}
                        >
                          <i className="bi bi-cloud-upload"></i>Upload Material
                        </button>
                      </div>
                      {uploadFile && (
                        <div className={`p-5 rounded-lg border-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                          <div className='flex justify-between w-full items-center'>
                            <div className="flex items-center gap-3">
                              <i className={`bi ${uploadFile.type.includes('pdf') ? 'bi-file-pdf' : 'bi-file-play'} text-2xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}></i>
                              <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{uploadFile.name}</span>
                            </div>
                            <button
                              onClick={() => setUploadFile(null)}
                              className={`text-sm font-medium flex items-center gap-2 ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}
                            >
                              <i className="bi bi-trash"></i>
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <section >
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
                              <iframe src={fileUrl} className="w-full h-full" title={fileName}>
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
                              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition
                                ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                            >
                              <i className="bi bi-file-earmark mr-2"></i>{fileName}
                            </a>
                          </div>
                        );
                      })()}
                      {selectedFile && (
                        <div className={`mt-6 border-t pt-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Learning Material</h3>
                            <button
                              onClick={() => setSelectedFile(null)}
                              className={`text-gray-500 hover:text-gray-700 ${darkMode ? 'hover:text-gray-300' : ''}`}
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </div>
                          {renderFilePreview(selectedFile)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-50">
                      <i className={`bi bi-journal-text text-4xl mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}></i>
                      <p className={`text-gray-500 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Looks like there are no lessons or lectures yet.
                        <span onClick={() => setShowAddSectionModal(true)} className={`text-gray-400 hover:text-gray-500 cursor-pointer ${darkMode ? 'hover:text-gray-300' : ''}`}>
                          Create a lesson first?
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className={`p-2 transition-all duration-200 ${darkMode ? 'bg-[#242526] border border-gray-700' : 'bg-white shadow-lg border border-gray-100'}`}>
                <div className={`border-b flex gap-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  {tabs.map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors duration-150
                        ${activeTab === tab
                          ? darkMode ? 'border-blue-400 text-blue-400' : 'border-blue-600 text-blue-700'
                          : darkMode ? 'border-transparent text-gray-400 hover:text-blue-400' : 'border-transparent text-gray-600 hover:text-blue-700'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className={`min-h-[200px] p-4 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                  {renderTabContent()}
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full gap-4 bg-gray-50">
              <div className={`p-4 border h-full overflow-y-auto ${darkMode ? 'bg-[#242526] border-gray-700' : 'bg-white border-gray-100'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-2xl font-semibold flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                    {courseDetails?.course || 'Loading...'}
                  </h2>
                  <button
                    onClick={() => setShowAddSectionModal(true)}
                    className={`px-3 py-1.5 rounded-md transition-all duration-200 flex items-center gap-1.5 font-medium text-sm
                      ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                  >
                    <i className="bi bi-plus-circle"></i>Add Lesson
                  </button>
                </div>
                <div className={`space-y-2 max-h-[calc(100vh-160px)] overflow-y-auto pr-2 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                  {lessons.length === 0 ? (
                    <p className={`italic text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No lessons available yet</p>
                  ) : (
                    lessons.map((lesson, idx) => (
                      <div key={idx} className={`border rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                        <div
                          onClick={() => toggleSection(idx)}
                          className={`flex items-center justify-between p-2 cursor-pointer transition-colors duration-200
                            ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'}`}
                        >
                          <div className="flex items-center gap-1">
                            <i className={`bi ${expandedSections[idx] ? 'bi-chevron-down' : 'bi-chevron-right'} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}></i>
                            <h3 className={`font-bold text-sm ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>{lesson.title}</h3>
                          </div>
                          <button
                            className={`p-1 rounded-full transition-colors duration-200 relative z-50
                              ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDropdown(`section-${idx}`);
                            }}
                          >
                            <i className="bi bi-three-dots-vertical"></i>
                            {dropdownOpen === `section-${idx}` && (
                              <div className={`absolute right-0 top-0 mr-8 w-40 rounded-lg shadow-lg z-[100] overflow-hidden border
                                ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                                <button
                                  onClick={() => handleEditSection(idx)}
                                  className={`flex items-center gap-1.5 w-full px-3 py-2 text-sm transition-colors duration-200
                                    ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                  <i className="bi bi-pencil"></i>Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteSection(idx)}
                                  className={`flex items-center gap-1.5 w-full px-3 py-2 text-sm transition-colors duration-200
                                    ${darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-50'}`}
                                >
                                  <i className="bi bi-trash"></i>Delete
                                </button>
                              </div>
                            )}
                          </button>
                        </div>
                        {expandedSections[idx] && (
                          <ul className="p-2">
                            {Array.isArray(lesson.lectures) &&
                              lesson.lectures.map((lec, lidx) => (
                                <li
                                  key={lidx}
                                  className={`flex items-center gap-2 text-sm p-2 rounded-lg cursor-pointer transition-colors duration-200
                                    ${selectedLecture && selectedLecture.id === lec.id
                                      ? darkMode ? 'bg-blue-900 text-blue-300 font-semibold' : 'bg-blue-100 text-blue-700 font-semibold'
                                      : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
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
                                            className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1
                                              ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
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
                            <li className="mt-2">
                              <button
                                onClick={() => {
                                  setActiveSection(idx);
                                  setShowAddLessonModal(true);
                                  setLessonId(lesson.id);
                                }}
                                className={`w-full text-sm font-medium flex items-center gap-2 p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200
                                    ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                              >
                                <i className="bi bi-plus-circle"></i>Add Lecture
                              </button>
                            </li>
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

        <SectionModal
          showModal={showAddSectionModal}
          onClose={() => setShowAddSectionModal(false)}
          title={newSectionTitle}
          setTitle={setNewSectionTitle}
          description={newSectionDescription}
          setDescription={setNewSectionDescription}
          onSubmit={handleAddSection}
        />

        <LessonModal
          showModal={showAddLessonModal}
          onClose={() => {
            setLessonId(null);
            setShowAddLessonModal(false);
            setLessonTitle('');
            setLessonDescription('');
            setLessonFile(null);
            setLessonsError('');
          }}
          title={lessonTitle}
          setTitle={setLessonTitle}
          description={lessonDescription}
          setDescription={setLessonDescription}
          file={lessonFile}
          onFileChange={handleLessonFileChange}
          onRemoveFile={handleRemoveLessonFile}
          error={lessonsError}
          onSubmit={handleUploadLesson}
        />
      </section>
    );
  } catch (err) {
    console.error(err);
  }
}
