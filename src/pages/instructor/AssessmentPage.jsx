import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHandleCourses } from '../../hooks/useHandleCourses';

export default function Assessment() {
    const { type, courseId } = useParams();
    const navigate = useNavigate();
    const { courses } = useHandleCourses();
    const [courseInfo, setCourseInfo] = useState(null);
    const [creationMethod, setCreationMethod] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [passingScore, setPassingScore] = useState(60);
    const [assessmentDetails, setAssessmentDetails] = useState({
        title: '',
        description: '',
        startDate: '',
        startTime: '',
        passingScore: 60,
        duration: {
            hours: 0,
            minutes: 0,
            seconds: 0
        }
    });
    const [currentQuestion, setCurrentQuestion] = useState({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
    });

    useEffect(() => {
        console.log('Current courses:', courses);
        console.log('Course ID from params:', courseId);
        
        if (courses && courses.length > 0) {
            const course = courses.find(c => c.id === courseId);
            console.log('Found course:', course);
            
            if (course) {
                setCourseInfo({
                    title: course.course,
                    code: course.code || 'CRIM101',
                    description: course.description,
                    instructor: course.createdByName
                });
            }
        }
    }, [courses, courseId]);

    // Assessment type configurations
    const assessmentTypes = {
        'pre-test': {
            title: 'Pre-Test',
            description: 'Evaluate initial understanding before each lesson begins',
            icon: 'bi-journal-check',
            color: 'blue',
            requiresTimeSlot: false,
            hasTimer: false
        },
        'post-test': {
            title: 'Post-Test',
            description: 'Assess learning outcomes after lesson completion',
            icon: 'bi-journal-text',
            color: 'green',
            requiresTimeSlot: false,
            hasTimer: false
        },
        'mock-exam': {
            title: 'Mock Exam',
            description: 'Timed simulation covering all lessons and chapters',
            icon: 'bi-clock',
            color: 'purple',
            requiresTimeSlot: false,
            hasTimer: true
        },
        'final-exam': {
            title: 'Final Exam',
            description: 'Comprehensive timed assessment for final evaluation',
            icon: 'bi-award',
            color: 'red',
            requiresTimeSlot: false,
            hasTimer: true
        }
    };

    const currentType = assessmentTypes[type];
    if (!currentType) {
        return (
            <div className="p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h1 className="text-2xl font-semibold text-red-600">Invalid Assessment Type</h1>
                        <p className="text-gray-600">The assessment type you selected does not exist. Please go back and select a valid assessment.</p>
                    </div>
                </div>
            </div>
        );
    }

    const handleAddQuestion = () => {
        if (currentQuestion.question.trim() && currentQuestion.options.every(opt => opt.trim())) {
            setQuestions([...questions, { ...currentQuestion }]);
            setCurrentQuestion({
                question: '',
                options: ['', '', '', ''],
                correctAnswer: 0
            });
        }
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...currentQuestion.options];
        newOptions[index] = value;
        setCurrentQuestion({ ...currentQuestion, options: newOptions });
    };

    const handleAssessmentChange = (field, value) => {
        if (field.includes('duration.')) {
            const durationField = field.split('.')[1];
            setAssessmentDetails(prev => ({
                ...prev,
                duration: {
                    ...prev.duration,
                    [durationField]: value
                }
            }));
        } else {
            setAssessmentDetails(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const renderCreationMethod = () => {
        switch (creationMethod) {
            case 'manual':
                return (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium">Add New Question</h3>
                                <button
                                    onClick={() => setCreationMethod(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Question
                                    </label>
                                    <textarea
                                        value={currentQuestion.question}
                                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows={3}
                                        placeholder="Enter your question here..."
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Options
                                    </label>
                                    {currentQuestion.options.map((option, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="correctAnswer"
                                                checked={currentQuestion.correctAnswer === index}
                                                onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
                                                className="h-4 w-4 text-blue-600"
                                            />
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder={`Option ${index + 1}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={handleAddQuestion}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Add Question
                                </button>
                            </div>
                        </div>

                        {/* Questions List */}
                        {questions.length > 0 && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-medium mb-4">Added Questions ({questions.length})</h3>
                                <div className="space-y-4">
                                    {questions.map((q, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <p className="font-medium mb-2">{q.question}</p>
                                            <div className="space-y-2">
                                                {q.options.map((option, optIndex) => (
                                                    <div
                                                        key={optIndex}
                                                        className={`p-2 rounded-lg ${
                                                            optIndex === q.correctAnswer
                                                                ? 'bg-green-50 text-green-700 border border-green-200'
                                                                : 'bg-gray-50 text-gray-700'
                                                        }`}
                                                    >
                                                        {option}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'upload':
                return (
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium">Upload Content</h3>
                            <button
                                onClick={() => setCreationMethod(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                <i className="bi bi-cloud-upload text-4xl text-gray-400 mb-2"></i>
                                <p className="text-gray-600 mb-2">Drag and drop your file here, or click to browse</p>
                                <p className="text-sm text-gray-500">Supported formats: PDF, DOCX, TXT</p>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.docx,.txt"
                                />
                                <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                                    Select File
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'lesson-based':
                return (
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium">Select Lesson</h3>
                            <button
                                onClick={() => setCreationMethod(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Select a lesson...</option>
                                <option value="lesson1">Lesson 1: Introduction</option>
                                <option value="lesson2">Lesson 2: Basic Concepts</option>
                                <option value="lesson3">Lesson 3: Advanced Topics</option>
                            </select>
                            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                                Generate Quiz
                            </button>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Manual Input Card */}
                        <div
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                            onClick={() => setCreationMethod('manual')}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
                                    <i className="bi bi-pencil-square text-xl"></i>
                                </div>
                                <h3 className="font-medium text-gray-800">Manual Input</h3>
                            </div>
                            <p className="text-sm text-gray-600">
                                Create questions and answers manually with full control
                            </p>
                        </div>

                        {/* Upload Content Card */}
                        <div
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                            onClick={() => setCreationMethod('upload')}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <i className="bi bi-upload text-xl"></i>
                                </div>
                                <h3 className="font-medium text-gray-800">Upload Content</h3>
                            </div>
                            <p className="text-sm text-gray-600">
                                Generate questions automatically from PDF or video files
                            </p>
                        </div>

                        {/* Lesson-Based Generation Card */}
                        <div
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                            onClick={() => setCreationMethod('lesson-based')}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                    <i className="bi bi-book text-xl"></i>
                                </div>
                                <h3 className="font-medium text-gray-800">Lesson-Based</h3>
                            </div>
                            <p className="text-sm text-gray-600">
                                Auto-generate quizzes from selected lesson content
                            </p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Course Information */}
                {courseInfo ? (
                    <div className="bg-white rounded-lg shadow p-4 mb-4">
                        <div className='flex justify-between items-center mb-4'>
                            <div className='flex gap-4 items-center'>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 text-sm font-medium"
                                >
                                    <i className="bi bi-arrow-left text-lg"></i>
                                    Back
                                </button>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-1">{courseInfo.title}</h2>
                                    <p className="text-gray-500 text-sm leading-relaxed">{courseInfo.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${currentType.color}-50 text-${currentType.color}-600`}>
                                    {currentType.title}
                                </span>
                            </div>
                        </div>

                        {/* Assessment Form */}
                        <div className="space-y-4">
                            {/* Title and Description */}
                            <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Assessment Title
                                    </label>
                                    <input
                                        type="text"
                                        value={assessmentDetails.title}
                                        onChange={(e) => handleAssessmentChange('title', e.target.value)}
                                        className="w-full p-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter assessment title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={assessmentDetails.description}
                                        onChange={(e) => handleAssessmentChange('description', e.target.value)}
                                        className="w-full p-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows={2}
                                        placeholder="Enter assessment description"
                                    />
                                </div>
                            </div>

                            {/* Availability Settings */}
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={assessmentDetails.startDate}
                                        onChange={(e) => handleAssessmentChange('startDate', e.target.value)}
                                        className="w-full p-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Start Time
                                    </label>
                                    <input
                                        type="time"
                                        value={assessmentDetails.startTime}
                                        onChange={(e) => handleAssessmentChange('startTime', e.target.value)}
                                        className="w-full p-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Passing Score (%)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={assessmentDetails.passingScore}
                                            onChange={(e) => handleAssessmentChange('passingScore', Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                                            className="w-full p-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <div className="absolute right-2 top-1.5 text-gray-500 text-sm">%</div>
                                    </div>
                                </div>
                            </div>

                            {/* Duration Settings for Timed Assessments */}
                            {currentType.hasTimer && (
                                <div className="border-t border-gray-200 pt-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Exam Duration</h4>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1">
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Hours
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="24"
                                                value={assessmentDetails.duration.hours}
                                                onChange={(e) => handleAssessmentChange('duration.hours', parseInt(e.target.value) || 0)}
                                                className="w-full p-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Minutes
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="59"
                                                value={assessmentDetails.duration.minutes}
                                                onChange={(e) => handleAssessmentChange('duration.minutes', parseInt(e.target.value) || 0)}
                                                className="w-full p-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Seconds
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="59"
                                                value={assessmentDetails.duration.seconds}
                                                onChange={(e) => handleAssessmentChange('duration.seconds', parseInt(e.target.value) || 0)}
                                                className="w-full p-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-600">
                                        Total Duration: {assessmentDetails.duration.hours}h {assessmentDetails.duration.minutes}m {assessmentDetails.duration.seconds}s
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow p-4 mb-4 animate-pulse">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                    </div>
                )}

                {/* Creation Method Selection/Content */}
                <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-base font-medium mb-3 text-gray-800">Question Creation Method</h3>
                    {renderCreationMethod()}
                </div>
            </div>
        </div>
    );
} 