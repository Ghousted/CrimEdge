import React, { useState, useEffect } from 'react';

const QuizDisplay = ({ quiz, onSubmitQuiz, onViewResults, isInstructor }) => {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(null);
    const [attempts, setAttempts] = useState([]);
    const [showAnswerSheet, setShowAnswerSheet] = useState(false);

    useEffect(() => {
        if (quiz) {
            // Initialize answers object
            const initialAnswers = {};
            quiz.questions.forEach((_, index) => {
                initialAnswers[index] = '';
            });
            setAnswers(initialAnswers);
        }
    }, [quiz]);

    const handleAnswerChange = (questionIndex, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: answer
        }));
    };

    const handleSubmit = async () => {
        const answersArray = Object.values(answers);
        const result = await onSubmitQuiz(quiz.id, answersArray);
        setScore(result);
        setSubmitted(true);
    };

    const handleViewResults = async () => {
        const results = await onViewResults(quiz.id);
        setAttempts(results);
    };

    if (!quiz) return null;

    return (
        <div className="p-6 rounded-xl bg-white shadow-lg">
            <h2 className="text-2xl mb-4 text-gray-800">{quiz.title}</h2>
            <p className="text-gray-600 mb-6">Topic: {quiz.topic}</p>

            {isInstructor && (
                <div className="mb-6">
                    <button
                        onClick={() => setShowAnswerSheet(!showAnswerSheet)}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200"
                    >
                        {showAnswerSheet ? 'Hide Answer Sheet' : 'Show Answer Sheet'}
                    </button>
                </div>
            )}

            {showAnswerSheet && isInstructor && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Answer Sheet</h3>
                    <div className="space-y-4">
                        {quiz.questions.map((question, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <span className="font-medium text-gray-700">{index + 1}.</span>
                                <div className="flex-1">
                                    <p className="text-gray-700 mb-2">{question.question}</p>
                                    <div className="pl-4 space-y-1">
                                        {question.options.map((option, optIndex) => (
                                            <p 
                                                key={optIndex}
                                                className={`text-sm ${
                                                    String.fromCharCode(65 + optIndex) === question.correctAnswer
                                                        ? 'text-green-600 font-medium'
                                                        : 'text-gray-600'
                                                }`}
                                            >
                                                {String.fromCharCode(65 + optIndex)}. {option}
                                            </p>
                                        ))}
                                    </div>
                                    <p className="text-green-600 font-medium mt-2">
                                        Correct Answer: {question.correctAnswer} ({question.correctAnswerText})
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!submitted ? (
                <div className="space-y-6">
                    {quiz.questions.map((question, index) => (
                        <div key={index} className="border-b border-gray-200 pb-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">
                                {index + 1}. {question.question}
                            </h3>
                            <div className="space-y-2">
                                {question.options.map((option, optionIndex) => (
                                    <label
                                        key={optionIndex}
                                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name={`question-${index}`}
                                            value={String.fromCharCode(65 + optionIndex)}
                                            checked={answers[index] === String.fromCharCode(65 + optionIndex)}
                                            onChange={() => handleAnswerChange(index, String.fromCharCode(65 + optionIndex))}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-gray-700">
                                            {String.fromCharCode(65 + optionIndex)}. {option}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={handleSubmit}
                        disabled={Object.values(answers).some(answer => !answer)}
                        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Submit Quiz
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-green-800 mb-2">Quiz Completed!</h3>
                        <p className="text-green-700">
                            Your score: {score.score} out of {quiz.questions.length} ({score.percentage.toFixed(1)}%)
                        </p>
                    </div>

                    {isInstructor && (
                        <div>
                            <button
                                onClick={handleViewResults}
                                className="w-full bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-700 transition-all duration-200"
                            >
                                View All Results
                            </button>

                            {attempts.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="text-lg font-medium text-gray-800 mb-3">Student Results</h3>
                                    <div className="space-y-2">
                                        {attempts.map((attempt, index) => (
                                            <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                                <p className="text-gray-700">
                                                    {attempt.userName}: {attempt.score} out of {quiz.questions.length} ({attempt.percentage.toFixed(1)}%)
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default QuizDisplay; 