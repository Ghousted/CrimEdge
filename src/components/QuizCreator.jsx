import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useDarkMode } from '../components/DarkModeContext'; // Import the useDarkMode hook

export default function QuizCreator({ onCreateQuiz }) {
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { darkMode } = useDarkMode(); // Use the useDarkMode hook

    const generateQuiz = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setError('');

        if (!topic.trim()) {
            setError('Please enter a topic');
            return;
        }

        setLoading(true);
        try {
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "learnlm-2.0-flash-experimental" });

            const prompt = `Create a multiple choice quiz about ${topic} with 10 questions.
            Format the response as a JSON object with the following structure:
            {
                "title": "Quiz Title",
                "topic": "${topic}",
                "questions": [
                    {
                        "question": "Question text",
                        "options": ["Option A", "Option B", "Option C", "Option D"],
                        "correctAnswer": "Option A"
                    }
                ]
            }
            Make sure the response is valid JSON and each question has exactly 4 options.
            The correctAnswer should be one of the options exactly as written.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Extract JSON from the response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No valid JSON found in the response');
            }

            const quizData = JSON.parse(jsonMatch[0]);

            // Validate the quiz data structure
            if (!quizData.title || !quizData.topic || !Array.isArray(quizData.questions)) {
                throw new Error('Invalid quiz data structure');
            }

            // Validate each question and ensure correct answer is in options
            quizData.questions.forEach((q, index) => {
                if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || !q.correctAnswer) {
                    throw new Error(`Invalid question structure at index ${index}`);
                }

                // Verify that the correct answer is one of the options
                if (!q.options.includes(q.correctAnswer)) {
                    throw new Error(`Correct answer "${q.correctAnswer}" not found in options for question ${index + 1}`);
                }
            });

            // Process the quiz data to ensure correct answers are properly formatted
            const processedQuizData = {
                ...quizData,
                questions: quizData.questions.map(q => ({
                    ...q,
                    correctAnswer: q.correctAnswer // Keep the full text answer
                }))
            };

            await onCreateQuiz(processedQuizData.title, processedQuizData.topic, processedQuizData.questions);
            setTopic('');
        } catch (error) {
            console.error('Error generating quiz:', error);
            setError('Failed to generate quiz. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="">
            <form onSubmit={generateQuiz} className="flex gap-4">
                <div className='flex-1'>
                    <input
                        type="text"
                        id="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter a topic for your quiz"
                        className={`w-full p-2 border rounded-lg transition
                            ${darkMode
                                ? "border-[gray-600 ]focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-[#242526] text-gray-100"
                                : "border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500  text-gray-900"
                            }`}
                        disabled={loading}
                    />
                </div>
                {error && (
                    <p className="text-red-600 text-sm">{error}</p>
                )}
                <button
                    type="submit"
                    disabled={loading || !topic.trim()}
                    className="bg-blue-600 text-white py-2 px-5 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Generating Quiz...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-plus-circle"></i>
                            Generate Quiz
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
