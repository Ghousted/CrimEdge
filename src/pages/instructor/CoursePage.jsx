import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHandleCourses } from '../../hooks/useHandleCourses';
import { useHandleStorage } from '../../hooks/useHandleStorage';
import { useHandleLessons } from '../../hooks/useHandleLessons';
import { useHandleAnnouncements } from '../../hooks/useHandleAnnouncements';
import QuizCreator from '../../components/QuizCreator';
import QuizDisplay from '../../components/QuizDisplay';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';
import SectionModal from '../../utils/SectionModal';
import LessonModal from '../../utils/LessonModal';

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
    const { addNewSection, addNewLecture, uploadLessonFile, lessons = [] } = useHandleLessons(courseId);
    const { createAnnouncement, announcements: courseAnnouncements, loading: announcementsLoading } = useHandleAnnouncements(courseId);
    const course = courses.find(c => c.id === courseId);
    const navigate = useNavigate();

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
          const success = await addNewLecture(
            lessonId,
            lessonTitle,
            lessonDescription,
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
        const success = await addNewLecture(
          lessons[0]?.id || '', // Use the first section's ID or create a new section
          uploadTitle,
          uploadDescription,
          uploadFile
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
                <h2 className="text-xl mb-1">{selectedLecture.title || 'Loading...'}</h2>
                <p className="text-gray-700 text-sm mb-4">{selectedLecture.content || 'Loading course description...'}</p>
                <div className="flex items-center gap-6  ">
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold text-amber-500">{courseDetails?.rating || '4.3'}</span>
                    <i className="bi bi-star-fill text-amber-500"></i>
                    <span className="text-sm text-gray-600 ml-1">({courseDetails?.totalRatings || '10,508'} ratings)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="bi bi-people text-gray-600"></i>
                    <span className="text-sm text-gray-600">{courseDetails?.students || '185,456'} students</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <i className="bi bi-calendar-check"></i>
                    <span>Last updated {courseDetails?.lastUpdated || 'November 2017'}</span>
                  </div>
                </div>
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
              </>
            ) : (
              <div>
                <h2 className="text-xl mb-1">{courseDetails?.course || 'Loading...'}</h2>
                <p className="text-gray-700 text-sm mb-4">
                  {courseDetails?.description || 'Loading...'}
                </p>
              </div>
            )}
          </div>
        );
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
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <span className="font-semibold text-gray-700">Filters:</span>
              <button className="border border-gray-300 px-4 py-2 rounded-lg bg-white text-gray-800 font-medium flex items-center gap-2 text-sm hover:border-blue-600">All lectures <i className="bi bi-chevron-down"></i></button>
              <span className="font-semibold text-gray-700">Sort by:</span>
              <button className="border border-gray-300 px-4 py-2 rounded-lg bg-white text-gray-800 font-medium flex items-center gap-2 text-sm hover:border-blue-600">Sort by recommended <i className="bi bi-chevron-down"></i></button>
              <button className="border border-blue-600 text-blue-700 px-4 py-2 rounded-lg font-medium text-sm bg-white hover:bg-blue-50 transition flex items-center gap-2">Filter questions <i className="bi bi-chevron-down"></i></button>
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
            <form onSubmit={handleAddNote} className="mb-5">
              <div className="flex flex-col gap-2">
                <textarea value={newNote} rows="3"
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Take a note..."
                  className="w-full p-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-sm resize-none min-h-[80px] shadow-sm"
                />
                <div className="flex justify-end">
                  <button type="submit"
                    disabled={!newNote.trim()}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm hover:shadow-md"
                  >
                    <i className="bi bi-plus-lg text-xs"></i>Add Note
                  </button>
                </div>
              </div>
            </form>
            <div className="space-y-3">
              {notes.map((note) => (
              <div key={note.id} className="bg-white p-3 rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                {editingNoteId === note.id ? (
                  <div className="flex flex-col gap-2">
                    <textarea value={editNoteText} rows="3"
                      onChange={(e) => setEditNoteText(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-sm resize-none min-h-[60px]"
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => {
                        setEditingNoteId(null);
                        setEditNoteText('');
                        }}
                        className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-all duration-200 font-medium text-xs"
                      >
                        Cancel
                      </button>
                      <button onClick={() => handleSaveEdit(note.id)}
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
                        <button onClick={() => handleEditNote(note.id)}
                          className="p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-50 transition-colors duration-200"
                        >
                          <i className="bi bi-pencil text-xs"></i>
                        </button>
                        <button nClick={() => handleDeleteNote(note.id)}
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
      case 'Announcements':
        return (
          <div>
            <h2 className="text-lg font-medium mb-3 text-gray-800">Add Announcement</h2>
            <form onSubmit={handleAddAnnouncement} className="mb-6">
              <textarea value={announcementText} rows={3}
                onChange={e => setAnnouncementText(e.target.value)}
                placeholder="Write your announcement here..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-sm resize-none min-h-[70px] mb-3"
              />
              <div className="flex items-center justify-between">
                <label className="inline-block">
                  <span className="sr-only">Upload files</span>
                  <input type="file"  multiple className="hidden"
                    onChange={handleAnnouncementFileChange}
                  />
                  <span className="px-4 py-1.5 border border-blue-600 text-blue-700 rounded-md cursor-pointer hover:bg-blue-50 transition-all duration-200 text-sm font-medium">Upload Files</span>
                </label>
                <button type="submit"
                  disabled={!announcementText.trim()}
                  className="px-4 py-1.5 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-all duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Announcement
                </button>
              </div>
              {announcementFiles.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {announcementFiles.map((file, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs border border-blue-200">{file.name}</span>
                  ))}
                </div>
              )}
            </form>
            <div className="space-y-4">
              {announcementsLoading ? (
              <div className="flex justify-center items-center py-8">
                 <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
              </div>
              ) : courseAnnouncements.filter(a => a.courseId === courseId).length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-md border border-gray-200">
                  <i className="bi bi-megaphone text-2xl text-gray-400 mb-2"></i>
                  <p className="text-gray-500 text-xs">No announcements yet for {course?.course}</p>
                </div>
              ) : (
                courseAnnouncements
                  .filter(a => a.courseId === courseId)
                  .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
                  .map(announcement => (
                  <div key={announcement.id} className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
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
          <div>
            <h2 className="text-xl font-semibold mb-2">Reviews</h2>
            <p className="text-gray-700 text-sm">Reviews section coming soon.</p>
          </div>
        );
      case 'Assessment':
        return (
          <div>
            <div className="space-y-4">
              <h2 className="text-xl text-gray-800 mb-2">Manage Assessment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button onClick={() => navigate(`/assessment/${id}/pre-test`)}
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
                >
                  <i className="bi bi-journal-check text-3xl text-blue-600 mb-2"></i>
                  <span className="font-medium">Pre-Test</span>
                  <span className="text-sm text-gray-500 text-center mt-1">Evaluate initial understanding</span>
                </button>
                <button onClick={() => navigate(`/assessment/${id}/post-test`)}
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"  
                >
                  <i className="bi bi-journal-text text-3xl text-green-600 mb-2"></i>
                  <span className="font-medium">Post-Test</span>
                  <span className="text-sm text-gray-500 text-center mt-1">Assess learning outcomes</span>
                </button>
                <button onClick={() => navigate(`/assessment/${id}/mock-exam`)}
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
                >
                  <i className="bi bi-clock text-3xl text-purple-600 mb-2"></i>
                  <span className="font-medium">Mock Exam</span>
                  <span className="text-sm text-gray-500 text-center mt-1">Timed simulation</span>
                </button>
                <button onClick={() => navigate(`/assessment/${id}/final-exam`)}
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"   
                >
                  <i className="bi bi-award text-3xl text-red-600 mb-2"></i>
                  <span className="font-medium">Final Exam</span>
                  <span className="text-sm text-gray-500 text-center mt-1">Comprehensive evaluation</span>
                </button>
              </div>
            </div>
            <div>
              <div className="mb-6 mt-2">
                <div className="flex items-center gap-2 border-b border-gray-200">
                  <button onClick={() => setSelectedAssessmentType('all')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                      selectedAssessmentType === 'all' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:text-blue-700'
                    }`}
                  >
                    All Assessments
                  </button>
                  <button onClick={() => setSelectedAssessmentType('pre-test')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                      selectedAssessmentType === 'pre-test' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:text-blue-700'
                    }`}
                  >
                    Pre-Test
                  </button>
                  <button onClick={() => setSelectedAssessmentType('post-test')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                      selectedAssessmentType === 'post-test' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:text-blue-700'
                    }`}
                  >
                    Post-Test
                  </button>
                  <button
                    onClick={() => setSelectedAssessmentType('mock-exam')}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                        selectedAssessmentType === 'mock-exam' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:text-blue-700'
                      }`}
                    >
                      Mock Exam
                    </button>
                    <button onClick={() => setSelectedAssessmentType('final-exam')}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                        selectedAssessmentType === 'final-exam' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:text-blue-700'
                      }`}
                    >
                      Final Exam
                    </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <input type="text" placeholder="Search by student name..." value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="passed">Passed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="submittedAt">Sort by Date</option>
                    <option value="score">Sort by Score</option>
                    <option value="studentName">Sort by Name</option>
                  </select>
                  <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    lassName="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <i className={`bi bi-arrow-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600">Total Submissions</p>
                    <p className="text-2xl font-bold text-gray-800">{filteredResults.length}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {Math.round(filteredResults.reduce((acc, curr) => acc + curr.score, 0) / filteredResults.length)}%
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600">Pass Rate</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {Math.round((filteredResults.filter(r => r.status === 'passed').length / filteredResults.length) * 100)}%
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200 bg-gray-50 sticky top-0">
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
                      className={`flex items-center px-4 py-3.5 text-sm border-b border-gray-200 last:border-b-0 transition-all duration-200 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50' } 
                      hover:bg-blue-50 group`
                    }>
                      <div className="flex-1 min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800">{result.studentName}</span>
                        </div>
                      </div>
                      <div className="flex-1 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          result.status === 'passed' ? 'bg-green-100 text-green-700 border border-green-200' : 
                          'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                          {result.status === 'passed' ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                      <div className="flex-1 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <span className={`text-sm font-medium ${
                            result.status === 'passed' ? 'text-green-600' : 'text-red-600'
                          }`}>
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
                <h2 className="text-xl text-gray-800 mb-2">Generate Quiz</h2>
                <p className="text-gray-600 mt-1">Quiz per lecture will be generated automatically -- select a lecture to generate a quiz -- comment ito </p>
              </div>
              <div className="flex items-center gap-4">
                <select defaultValue=""
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-sm"
                >
                  <option value="" disabled>Select a lecture</option>
                  <option value="intro">Introduction to Criminal Law</option>
                  <option value="elements">Elements of a Crime</option>
                  <option value="defenses">Criminal Defenses</option>
                  <option value="procedure">Criminal Procedure</option>
                  <option value="evidence">Rules of Evidence</option>
                </select>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                  <i className="bi bi-lightning-charge-fill mr-1"></i>Powered by AI
                </span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
              <QuizCreator onCreateQuiz={handleCreateQuiz} />
            </div>
          </div>
        );
      case 'Learning tools':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Learning Materials Library</h2>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
                >
                    <i className="bi bi-upload"></i>
                    Upload Material
                </button>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    activeTab === 'all'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveTab('all')}
                  >
                    All Materials
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      activeTab === 'pdf'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveTab('pdf')}
                  >
                    PDFs
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    activeTab === 'video'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveTab('video')}
                  >
                    Videos
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols- gap-4">
                {lessons.flatMap(lesson =>
                  lesson.lectures
                    .filter(lecture => lecture.lectureFiles && lecture.lectureFiles.length > 0)
                    .flatMap(lecture =>
                      lecture.lectureFiles
                        .filter(file =>
                          activeTab === 'all' ||
                          (activeTab === 'pdf' && file.fileType === 'application/pdf') ||
                          (activeTab === 'video' && file.fileType.startsWith('video/'))
                        )
                        .map((file, index) => (
                        <div key={`${lecture.id}-${index}`}
                          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${file.fileType === 'application/pdf' ? 'bg-red-100 text-red-600': 'bg-blue-100 text-blue-600' }`}>
                              <i className={`bi ${file.fileType === 'application/pdf' ? 'bi-file-pdf' : 'bi-file-play' } text-xl`}></i>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 mb-1 truncate">
                                {file.fileName}
                              </h3>
                              <p className="text-sm text-gray-500 mb-2">
                                {lecture.title}
                              </p>
                              <div className="flex items-center gap-2">
                                <button onClick={() => handleFileSelect(file)}
                                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                                >
                                  <i className="bi bi-eye"></i> View
                                </button>
                                <a href={file.fileUrl} target="_blank" rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                                >
                                  <i className="bi bi-download"></i>Download
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )
                )}
              </div>
                {!lessons.some(lesson =>
                  lesson.lectures.some(lecture =>
                    lecture.lectureFiles && lecture.lectureFiles.some(file =>
                      activeTab === 'all' ||  (activeTab === 'pdf' && file.fileType === 'application/pdf') || (activeTab === 'video' && file.fileType.startsWith('video/'))
                    )
                  )
                ) && (
                <div className="text-center py-12">
                  <i className="bi bi-folder text-4xl text-gray-400 mb-3"></i>
                  <p className="text-gray-500">No learning materials found</p>
                </div>
              )}
            </div>
            {showUploadModal && (
              <div className="modal-overlay">
                <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-medium text-gray-800">Upload Learning Material</h2>
                  <button 
                    onClick={() => {
                      setShowUploadModal(false);
                      setUploadTitle('');
                      setUploadDescription('');
                      setUploadFile(null);
                      setUploadError('');
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
                {uploadError && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 flex items-center gap-2">
                      <i className="bi bi-exclamation-circle"></i>
                      {uploadError}
                    </p>
                  </div>
                )}
                <div className="flex flex-col gap-4">
                  <div className="relative">
                    <input type="text" placeholder="Material Title" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pl-5"
                    />
                  </div>
                  <div className="relative">
                    <textarea placeholder="Material Description" rows={3} value={uploadDescription}
                      onChange={(e) => setUploadDescription(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none pl-5"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <label className="cursor-pointer border-2 border-blue-600 text-blue-600 hover:text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center gap-2 font-medium">
                      <i className="bi bi-upload"></i>
                      <span>Select File (PDF/Video)</span>
                      <input  type="file" accept=".pdf,video/*" onChange={handleLearningMaterialFileChange} className="hidden"/>
                    </label>
                    <button
                      onClick={handleUploadLearningMaterial}
                      disabled={!uploadTitle || !uploadDescription || !uploadFile}
                      className="bg-blue-600 text-white py-2 px-8 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                    >
                      <i className="bi bi-cloud-upload"></i>Upload Material
                    </button>
                  </div>
                  {uploadFile && (
                    <div className="flex items-center gap-4 p-5 bg-gray-50 border-2 border-gray-200 rounded-lg">
                      <div className='flex justify-between w-full items-center'>
                        <div className="flex items-center gap-3">
                          <i className={`bi ${uploadFile.type.includes('pdf') ? 'bi-file-pdf' : 'bi-file-play'} text-2xl text-blue-600`}></i>
                          <span className="text-gray-700 font-medium">{uploadFile.name}</span>
                        </div>
                        <button
                          onClick={() => setUploadFile(null)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-2"
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
      <section className="">
        {console.log('Current courseDetails:', courseDetails)}
        <div className="mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 ">
            <div className="flex flex-col w-full lg:col-span-4">
              <div className="flex flex-col ">
                <div className={`bg-black ${selectedLecture?.fileData?.fileType?.startsWith('video/') ? 'p-0' : 'p-0'}`}>
                  {selectedLecture ? (
                    <div className="space-y-4">
                      {selectedLecture.fileData && (() => {
                        const { fileType, fileUrl, fileName } = selectedLecture.fileData;
                        if (fileType.startsWith('video/')) {
                          return (
                            <div className="w-3/4 mx-auto aspect-video  overflow-hidden shadow">
                              <video controls className="w-full h-full object-contain">
                                <source src={fileUrl} type={fileType} />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          );
                        }
                        if (fileType === 'application/pdf') {
                          return (
                            <div className="w-full mx-auto h-[600px]  overflow-hidden shadow border">
                              <iframe src={fileUrl} className="w-full h-full" title={fileName}>
                                This browser does not support PDFs. Please download the file:
                                <a href={fileUrl}>Download PDF</a>.
                              </iframe>
                            </div>
                          );
                        }
                        return (
                          <div>
                            <a href={fileUrl}  target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
                            >
                              <i className="bi bi-file-earmark mr-2"></i>{fileName}
                            </a>
                          </div>
                        );
                      })()}
                      {selectedFile && (
                        <div className="mt-6 border-t border-gray-200 pt-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-800">Learning Material</h3>
                            <button onClick={() => setSelectedFile(null)} className="text-gray-500 hover:text-gray-700">
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </div>
                          {renderFilePreview(selectedFile)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-50">
                      <i className="bi bi-journal-text text-4xl text-gray-400 mb-3"></i>
                      <p className="text-gray-500"> Looks like there are no lessons or lectures yet.  <span></span>
                        <span onClick={() => setShowAddSectionModal(true)}  className='text-gray-400 hover:text-gray-500 cursor-pointer'>
                          Create a lesson first?
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white  shadow-lg p-2 border border-gray-100">
                <div className="border-b border-gray-200 flex gap-2">
                  {tabs.map(tab => (
                    <button  key={tab} onClick={() => setActiveTab(tab)}
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
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">{courseDetails?.course || 'Loading...'}</h2>
                  <button
                    onClick={() => setShowAddSectionModal(true)}
                    className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-3 py-1.5 rounded-md transition-all duration-200 flex items-center gap-1.5 font-medium text-sm"
                  >
                    <i className="bi bi-plus-circle"></i>Add Lesson
                  </button>
                </div>
                <div className="space-y-2 max-h-[calc(100vh-160px)] overflow-y-auto pr-2">
                  {lessons.length === 0 ? (
                    <p className="text-gray-500 italic text-center py-4">No lessons available yet</p>
                  ) : (
                    lessons.map((lesson, idx) => (
                      <div key={idx} className="border border-gray-300 rounded-lg">
                        <div onClick={() => toggleSection(idx)}
                          className="flex items-center justify-between p-2 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
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
                                <button onClick={() => handleEditSection(idx)}
                                  className="flex items-center gap-1.5 w-full px-3 py-2 hover:bg-gray-50 text-gray-700 transition-colors duration-200 text-sm"
                                >
                                  <i className="bi bi-pencil"></i>Edit
                                </button>
                                <button onClick={() => handleDeleteSection(idx)}
                                  className="flex items-center gap-1.5 w-full px-3 py-2 hover:bg-gray-50 text-red-600 transition-colors duration-200 text-sm"
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
                                <li key={lidx}
                                  className={`flex items-center gap-2 text-sm p-2 rounded-lg transition-colors duration-200 cursor-pointer ${
                                    selectedLecture && selectedLecture.id === lec.id ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                                  }`}
                                  onClick={() => setSelectedLecture(lec)}
                                >
                                  <input  type="checkbox" checked={lec.isCompleted} readOnly className="accent-blue-600"/>
                                  <div className="flex-1">
                                    <span>{lec.title}</span>
                                    {lec.lectureFiles && lec.lectureFiles.length > 0 && (
                                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        {lec.lectureFiles.map((file, index) => (
                                          <span key={index} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full flex items-center gap-1">
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
                                  className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2 p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200"
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
