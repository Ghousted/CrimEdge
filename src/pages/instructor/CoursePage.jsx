import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useHandleCourses } from '../../hooks/useHandleCourses';
import { useHandleStorage } from '../../hooks/useHandleStorage';
import { useHandleLessons } from '../../hooks/useHandleLessons';
import QuizCreator from '../../components/QuizCreator';
import QuizDisplay from '../../components/QuizDisplay';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';

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

    // New state variables for lesson modal
    const [showAddLessonModal, setShowAddLessonModal] = useState(false);
    const [lessonTitle, setLessonTitle] = useState('');
    const [lessonDescription, setLessonDescription] = useState('');
    const [lessonFile, setLessonFile] = useState(null);
    const [lessonsError, setLessonsError] = useState('');
    const [activeSection, setActiveSection] = useState(null);
    const [selectedLecture, setSelectedLecture] = useState(null);

    // Add new state for notes
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editNoteText, setEditNoteText] = useState('');

    // Add state for announcements
    const [announcements, setAnnouncements] = useState([]);
    const [announcementText, setAnnouncementText] = useState('');
    const [announcementFiles, setAnnouncementFiles] = useState([]);

    // Quiz-related state
    const [quizzes, setQuizzes] = useState([]);
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [quizResults, setQuizResults] = useState({});

    // Add state for selected file
    const [selectedFile, setSelectedFile] = useState(null);

    // Add new state for learning materials upload
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
    const course = courses.find(c => c.id === courseId);



    useEffect(() => {
      if (course) {
        setCourseDetails(course);
      }
    }, [course]);

    console.log('Found course:', course);
    console.log('Course ID:', courseId);
    console.log(courseDetails);

    const tabs = ['Overview', 'Q&A', 'Notes', 'Announcements', 'Reviews', 'Learning tools'];

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
      // Here you would typically add the new section to your data
      console.log('Adding new section:', { title: newSectionTitle, description: newSectionDescription });
      await addNewSection(newSectionTitle, newSectionDescription);
      setShowAddSectionModal(false);
      setNewSectionTitle('');
      setNewSectionDescription('');
    };

    const handleEditSection = (sectionId) => {
      // Here you would typically handle editing the section
      console.log('Editing section:', sectionId);
      setDropdownOpen(null); // Close the dropdown
    };

    const handleDeleteSection = (sectionId) => {
      // Here you would typically handle deleting the section
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
            console.log('Starting lecture upload:', {
          title: lessonTitle,
          description: lessonDescription,
                hasFile: !!lessonFile
            });

            let fileData = null;
            if (lessonFile) {
                // Create a unique file name
                const fileName = `${Date.now()}_${lessonFile.name}`;
                const storagePath = `lectures/${courseId}/${fileName}`;
                const storageRef = ref(storage, storagePath);

                console.log('Uploading file to Firebase Storage:', {
                    path: storagePath,
                    fileName: lessonFile.name,
                    fileType: lessonFile.type,
                    fileSize: lessonFile.size
                });

                // Upload file to Firebase Storage
                const snapshot = await uploadBytes(storageRef, lessonFile);
                const fileUrl = await getDownloadURL(snapshot.ref);

                fileData = {
                    fileName: lessonFile.name,
                    fileType: lessonFile.type,
                    fileSize: lessonFile.size,
                    fileUrl: fileUrl
                };

                console.log('File uploaded successfully:', fileData);
            }

            // Create lecture with file data
            const success = await addNewLecture(
                lessonId,
                lessonTitle,
                lessonDescription,
                fileData
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

    // Add note handling functions
    const handleAddNote = (e) => {
      e.preventDefault();
      if (newNote.trim()) {
        const note = {
          id: Date.now(),
          text: newNote.trim(),
          timestamp: new Date().toISOString(),
          isEditing: false
        };
        setNotes([note, ...notes]);
        setNewNote('');
      }
    };

    const handleEditNote = (noteId) => {
      const note = notes.find(n => n.id === noteId);
      if (note) {
        setEditingNoteId(noteId);
        setEditNoteText(note.text);
      }
    };

    const handleSaveEdit = (noteId) => {
      if (editNoteText.trim()) {
        setNotes(notes.map(note =>
          note.id === noteId
            ? { ...note, text: editNoteText.trim(), timestamp: new Date().toISOString() }
            : note
        ));
        setEditingNoteId(null);
        setEditNoteText('');
      }
    };

    const handleDeleteNote = (noteId) => {
      setNotes(notes.filter(note => note.id !== noteId));
    };

    const handleAnnouncementFileChange = (e) => {
      setAnnouncementFiles(Array.from(e.target.files));
    };

    const handleAddAnnouncement = (e) => {
      e.preventDefault();
      if (announcementText.trim()) {
        setAnnouncements([
          {
            id: Date.now(),
            text: announcementText.trim(),
            files: announcementFiles,
            timestamp: new Date().toISOString(),
          },
          ...announcements,
        ]);
        setAnnouncementText('');
        setAnnouncementFiles([]);
      }
    };

    const handleCreateQuiz = async (title, topic, questions) => {
        // Convert correct answers to letters (A, B, C, D)
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
        
        // Log quiz details
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
            // Compare the submitted answer (A, B, C, D) with the correct answer (A, B, C, D)
            if (answer === quiz.questions[index].correctAnswer) {
                score++;
            }
        });

        const result = {
            score,
            percentage: (score / quiz.questions.length) * 100
        };

        // Log the quiz results
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
        // In a real application, this would fetch results from a backend
        return [
            { userName: 'Student 1', score: 8, percentage: 80 },
            { userName: 'Student 2', score: 7, percentage: 70 }
        ];
    };

    // Function to handle file selection
    const handleFileSelect = (file) => {
        setSelectedFile(file);
    };

    // Function to render file preview
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

    // Function to handle file selection for learning materials
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

    // Function to handle learning material upload
    const handleUploadLearningMaterial = async () => {
        if (!uploadTitle || !uploadDescription || !uploadFile) {
            setUploadError('Please fill in all fields and select a file');
            return;
        }

        try {
            // Create a unique file name
            const fileName = `${Date.now()}_${uploadFile.name}`;
            // Update storage path to match existing rules structure
            const storagePath = `lessons/${courseId}/${fileName}`;
            const storageRef = ref(storage, storagePath);

            console.log('Uploading learning material:', {
                path: storagePath,
                fileName: uploadFile.name,
                fileType: uploadFile.type,
                fileSize: uploadFile.size
            });

            // Upload file to Firebase Storage
            const snapshot = await uploadBytes(storageRef, uploadFile);
            const fileUrl = await getDownloadURL(snapshot.ref);

            const fileData = {
                fileName: uploadFile.name,
                fileType: uploadFile.type,
                fileSize: uploadFile.size,
                fileUrl: fileUrl
            };

            // Create a new lecture with the uploaded file
            const success = await addNewLecture(
                lessons[0]?.id || '', // Use the first section's ID or create a new section
                uploadTitle,
                uploadDescription,
                fileData
            );

            if (success) {
                console.log('Learning material uploaded successfully');
                // Reset form
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
                      <h2 className="text-xl font-semibold mb-2">Course Overview</h2>
                      <p className="text-gray-700 text-sm mb-4">
                        Welcome to the Complete Guide to Microsoft PowerApps! This comprehensive course will take you from beginner to expert in building powerful business applications using Microsoft PowerApps. You'll learn how to create custom apps that connect to your data, automate workflows, and transform your business processes.
                      </p>


                      {/* Comments Section */}
                      <div className="mt-6 border-t border-gray-200 pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-medium text-gray-800">Comments</h3>
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
                                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors duration-200 ${comment.isLiked
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
                                          className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs transition-colors duration-200 ${reply.isLiked
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
            case 'Q&A':
                return (
                    <div>
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
            case 'Announcements':
                return (
                    <div>
                      <h2 className="text-lg font-medium mb-3 text-gray-800">Add Announcement</h2>
                      <form onSubmit={handleAddAnnouncement} className="mb-6">
                        <textarea
                          value={announcementText}
                          onChange={e => setAnnouncementText(e.target.value)}
                          placeholder="Write your announcement here..."
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-sm resize-none min-h-[70px] mb-3"
                          rows={3}
                        />
                        <div className="flex items-center justify-between">
                          <label className="inline-block">
                            <span className="sr-only">Upload files</span>
                            <input
                              type="file"
                              multiple
                              onChange={handleAnnouncementFileChange}
                              className="hidden"
                            />
                            <span className="px-4 py-1.5 border border-blue-600 text-blue-700 rounded-md cursor-pointer hover:bg-blue-50 transition-all duration-200 text-sm font-medium">Upload Files</span>
                          </label>
                          <button
                            type="submit"
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
                        {announcements.map(a => (
                          <div key={a.id} className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-800 text-sm font-medium">Announcement</span>
                              <span className="text-xs text-gray-500">{new Date(a.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-gray-700 text-sm mb-2 whitespace-pre-wrap">{a.text}</p>
                            {a.files && a.files.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-1">
                                {a.files.map((file, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs border border-blue-200">{file.name}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                        {announcements.length === 0 && (
                          <div className="text-center py-6 bg-gray-50 rounded-md border border-gray-200 text-xs text-gray-500">No announcements yet.</div>
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
            case 'Learning tools':
                return (
                    <div className="space-y-6">
                        {/* Learning Materials Library */}
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
                            
                            {/* Filter Controls */}
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

                            {/* Materials Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                                    <div 
                                                        key={`${lecture.id}-${index}`}
                                                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className={`p-2 rounded-lg ${
                                                                file.fileType === 'application/pdf' 
                                                                    ? 'bg-red-100 text-red-600' 
                                                                    : 'bg-blue-100 text-blue-600'
                                                            }`}>
                                                                <i className={`bi ${
                                                                    file.fileType === 'application/pdf' 
                                                                        ? 'bi-file-pdf' 
                                                                        : 'bi-file-play'
                                                                } text-xl`}></i>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="font-medium text-gray-900 mb-1 truncate">
                                                                    {file.fileName}
                                                                </h3>
                                                                <p className="text-sm text-gray-500 mb-2">
                                                                    {lecture.title}
                                                                </p>
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        onClick={() => handleFileSelect(file)}
                                                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                                                                    >
                                                                        <i className="bi bi-eye"></i>
                                                                        View
                                                                    </button>
                                                                    <a
                                                                        href={file.fileUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                                                                    >
                                                                        <i className="bi bi-download"></i>
                                                                        Download
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                        )
                                )}
                            </div>

                            {/* Empty State */}
                            {!lessons.some(lesson => 
                                lesson.lectures.some(lecture => 
                                    lecture.lectureFiles && 
                                    lecture.lectureFiles.some(file => 
                                        activeTab === 'all' || 
                                        (activeTab === 'pdf' && file.fileType === 'application/pdf') ||
                                        (activeTab === 'video' && file.fileType.startsWith('video/'))
                                    )
                                )
                            ) && (
                                <div className="text-center py-12">
                                    <i className="bi bi-folder text-4xl text-gray-400 mb-3"></i>
                                    <p className="text-gray-500">No learning materials found</p>
                                </div>
                            )}
                        </div>

                        {/* AI Quiz Generator */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-2xl font-semibold mb-4">AI Quiz Generator</h2>
                            <QuizCreator onCreateQuiz={handleCreateQuiz} />
                        </div>
                        
                        {quizzes.length > 0 && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-semibold">Created Quizzes</h3>
                                    {currentQuiz && (
                                        <button
                                            onClick={() => setCurrentQuiz(null)}
                                            className="text-blue-600 hover:text-blue-700 flex items-center gap-2 text-sm"
                                        >
                                            <i className="bi bi-arrow-left"></i>
                                            Back to Quiz List
                                        </button>
                                    )}
                                </div>

                                {currentQuiz ? (
                                    <div className="space-y-4">
                                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                            <h4 className="font-medium text-blue-800">{currentQuiz.title}</h4>
                                            <p className="text-sm text-blue-600">Topic: {currentQuiz.topic}</p>
                                            <p className="text-xs text-blue-500 mt-1">
                                                Created: {new Date(currentQuiz.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <QuizDisplay 
                                            quiz={currentQuiz}
                                            onSubmitQuiz={handleSubmitQuiz}
                                            onViewResults={handleViewQuizResults}
                                            isInstructor={true}
                                        />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {quizzes.map(quiz => (
                                            <div 
                                                key={quiz.id}
                                                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-all duration-200"
                                                onClick={() => setCurrentQuiz(quiz)}
                                            >
                                                <div className="flex items-start justify-between mb-3">
                    <div>
                                                        <h4 className="font-medium text-gray-800">{quiz.title}</h4>
                                                        <p className="text-sm text-gray-600">Topic: {quiz.topic}</p>
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(quiz.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-600">Questions:</span>
                                                        <span className="font-medium">{quiz.questions.length}</span>
                                                    </div>
                                                    {quizResults[quiz.id] && (
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-600">Last Score:</span>
                                                            <span className="font-medium text-blue-600">
                                                                {quizResults[quiz.id].score}/{quiz.questions.length} 
                                                                ({quizResults[quiz.id].percentage.toFixed(1)}%)
                                                            </span>
                    </div>
                  )}
                                                </div>

                                                <div className="mt-4 pt-3 border-t border-gray-100">
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <i className="bi bi-eye"></i>
                                                        <span>Click to preview and take quiz</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {quizzes.length === 0 && !currentQuiz && (
                            <div className="bg-white rounded-lg shadow p-6 text-center">
                                <div className="text-gray-400 mb-3">
                                    <i className="bi bi-journal-text text-4xl"></i>
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">No Quizzes Created Yet</h3>
                                <p className="text-gray-600 text-sm">
                                    Use the AI Quiz Generator above to create your first quiz!
                                </p>
                            </div>
                        )}

                        {/* Upload Learning Material Modal */}
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
                                            <input
                                                type="text"
                                                placeholder="Material Title"
                                                value={uploadTitle}
                                                onChange={(e) => setUploadTitle(e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pl-5"
                                            />
                                        </div>
                                        <div className="relative">
                                            <textarea
                                                placeholder="Material Description"
                                                value={uploadDescription}
                                                onChange={(e) => setUploadDescription(e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none pl-5"
                                                rows={3}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                            <label className="cursor-pointer border-2 border-blue-600 text-blue-600 hover:text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center gap-2 font-medium">
                                                <i className="bi bi-upload"></i>
                                                <span>Select File (PDF/Video)</span>
                                                <input
                                                    type="file"
                                                    accept=".pdf,video/*"
                                                    onChange={handleLearningMaterialFileChange}
                                                    className="hidden"
                                                />
                                            </label>
                                            <button
                                                onClick={handleUploadLearningMaterial}
                                                disabled={!uploadTitle || !uploadDescription || !uploadFile}
                                                className="bg-blue-600 text-white py-2 px-8 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                                            >
                                                <i className="bi bi-cloud-upload"></i>
                                                Upload Material
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
      <section className="p-8 sm:px-4 lg:px-6">
        {console.log('Current courseDetails:', courseDetails)}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main Content */}
            <div className="flex flex-col w-full gap-4 lg:col-span-2">
              {/* Course Header */}
              <div className="flex flex-col gap-4">
                <div>
                  <h1 className='text-3xl font-bold text-gray-900'>{courseDetails?.course || 'Course Name'}</h1>
                  <p className='text-gray-600 text-lg'>{courseDetails?.description || 'Course Description'}</p>
                </div>
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
                      className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors duration-150 ${activeTab === tab ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:text-blue-700'}`}
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

            {/* Sidebar */}
            <div className="flex flex-col w-full gap-4">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-medium text-gray-800 flex items-center gap-2">
                    Course Content
                  </h2>
                  <button
                    onClick={() => setShowAddSectionModal(true)}
                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-all duration-200 flex items-center gap-1.5 font-medium text-sm"
                  >
                    <i className="bi bi-plus-circle"></i>
                    Add Section
                  </button>
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
                        <button
                          className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200 transition-colors duration-200 relative z-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(`section-${idx}`);
                          }}
                        >
                          <i className="bi bi-three-dots-vertical"></i>
                          {dropdownOpen === `section-${idx}` && (
                            <div className="absolute left-full top-0 ml-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-[100] overflow-hidden">
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
                          <li className="mt-2">
                            <button
                              onClick={() => {
                                setActiveSection(idx);
                                setShowAddLessonModal(true);
                                setLessonId(lesson.id);
                              }}
                              className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2 p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            >
                              <i className="bi bi-plus-circle"></i>
                              Add Lecture
                            </button>
                          </li>
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Section Modal */}
        {showAddSectionModal && (
          <div className="modal-overlay">
            <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md">
              <h2 className="text-xl font-medium mb-4 text-gray-800">Add New Section</h2>
              <div className="mb-4">
                <label htmlFor="sectionTitle" className="block font-medium text-gray-700 text-base">Section Title</label>
                <input
                  type="text"
                  id="sectionTitle"
                  className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-gray-50 text-sm"
                  placeholder="Enter section title"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="sectionDescription" className="block font-medium text-gray-700 text-base">Section Description</label>
                <textarea
                  id="sectionDescription"
                  className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-gray-50 text-sm resize-none"
                  placeholder="Enter section description"
                  rows="3"
                  value={newSectionDescription}
                  onChange={(e) => setNewSectionDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowAddSectionModal(false);
                    setNewSectionTitle('');
                    setNewSectionDescription('');
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSection}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-1.5 font-medium shadow-md shadow-blue-500/20 text-sm"
                  disabled={!newSectionTitle.trim()}
                >
                  Add Section
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Lecture Modal */}
        {showAddLessonModal && (
          <div className="modal-overlay">
            <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-gray-800">Add New Lecture</h2>
                <button
                  onClick={() => {
                    setLessonId(null);
                    setShowAddLessonModal(false);
                    setLessonTitle('');
                    setLessonDescription('');
                    setLessonFile(null);
                    setLessonsError('');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              {lessonsError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 flex items-center gap-2">
                    <i className="bi bi-exclamation-circle"></i>
                    {lessonsError}
                  </p>
                </div>
              )}
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Lecture Title"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pl-5"
                  />
                </div>
                <div className="relative">
                  <textarea
                    placeholder="Lecture Content"
                    value={lessonDescription}
                    onChange={(e) => setLessonDescription(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none pl-5"
                    rows={2}
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <label className="cursor-pointer border-2 border-blue-600 text-blue-600 hover:text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center gap-2 font-medium">
                    <i className="bi bi-upload"></i>
                    <span>Upload File (PDF/Video)</span>
                    <input
                      type="file"
                      accept=".pdf,video/*"
                      onChange={handleLessonFileChange}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={handleUploadLesson}
                    disabled={!lessonDescription || !lessonTitle.trim()}
                    className="bg-blue-600 text-white py-2 px-8 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                  >
                    <i className="bi bi-cloud-upload"></i>
                    Upload Lecture
                  </button>
                </div>
                {lessonFile && (
                  <div className="flex items-center gap-4 p-5 bg-gray-50 border-2 border-gray-200 rounded-lg">
                    <div className='flex justify-between w-full items-center'>
                      <div className="flex items-center gap-3">
                        <i className={`bi ${lessonFile.type.includes('pdf') ? 'bi-file-pdf' : 'bi-file-play'} text-2xl text-blue-600`}></i>
                        <span className="text-gray-700 font-medium">{lessonFile.name}</span>
                      </div>
                      <button
                        onClick={handleRemoveLessonFile}
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
      </section>
    );
  } catch (err) {
    console.error(err);
  }
}
