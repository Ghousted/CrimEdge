import { db } from '../../firebase';
import { useState, useEffect } from 'react';
import { addDoc, collection, query, where, onSnapshot, deleteDoc, doc, updateDoc, getDoc, getDocs } from 'firebase/firestore';
import { useAuth } from '../auth/components/authContext';

export const useHandleQuizzes = (courseId = null) => {
    const { currentUser, authRole, userData } = useAuth();
    const [quizzes, setQuizzes] = useState([]);
    const [createdQuizzes, setCreatedQuizzes] = useState([]);
    const [loading, setLoading] = useState(false);
    const quizzesRef = collection(db, "quizzes");
    const quizAttemptsRef = collection(db, "quizAttempts");

    const createQuiz = async (title, topic, questions) => {
        try {
            // Process questions to store both the full answer and the letter
            const processedQuestions = questions.map(q => {
                // Find the index of the correct answer in the options array
                const correctOptionIndex = q.options.findIndex(option => option === q.correctAnswer);
                if (correctOptionIndex === -1) {
                    throw new Error(`Correct answer "${q.correctAnswer}" not found in options`);
                }
                
                // Convert to letter (A, B, C, D)
                const letterAnswer = String.fromCharCode(65 + correctOptionIndex);
                
                return {
                    ...q,
                    correctAnswer: letterAnswer, // Store the letter answer
                    correctAnswerText: q.correctAnswer // Store the full text answer
                };
            });

            const quizData = {
                title,
                topic,
                questions: processedQuestions,
                createdBy: currentUser?.uid,
                createdByName: userData ? `${userData.firstName} ${userData.lastName}` : '',
                createdAt: new Date(),
                courseId: courseId,
            };

            console.log('Creating quiz with data:', quizData);
            await addDoc(quizzesRef, quizData);
            console.log(`Quiz created: ${title}`);
        } catch (error) {
            console.error("Error creating quiz: ", error);
            throw error;
        }
    };

    const deleteQuiz = async (quizId) => {
        try {
            await deleteDoc(doc(db, "quizzes", quizId));
            console.log(`Quiz deleted: ${quizId}`);
        } catch (error) {
            console.error("Error deleting quiz: ", error);
            throw error;
        }
    };

    const submitQuizAttempt = async (quizId, answers) => {
        try {
            const quizDoc = await getDoc(doc(db, "quizzes", quizId));
            const quiz = quizDoc.data();
            
            // Calculate score
            let score = 0;
            quiz.questions.forEach((question, index) => {
                console.log(`Question ${index + 1}:`, {
                    studentAnswer: answers[index],
                    correctAnswer: question.correctAnswer,
                    isCorrect: answers[index] === question.correctAnswer
                });
                
                if (answers[index] === question.correctAnswer) {
                    score++;
                }
            });

            const percentage = (score / quiz.questions.length) * 100;

            await addDoc(quizAttemptsRef, {
                quizId,
                userId: currentUser?.uid,
                userName: userData ? `${userData.firstName} ${userData.lastName}` : '',
                answers,
                score,
                percentage,
                submittedAt: new Date(),
                courseId: courseId,
            });

            return { score, percentage };
        } catch (error) {
            console.error("Error submitting quiz attempt: ", error);
            throw error;
        }
    };

    const getQuizAttempts = async (quizId) => {
        try {
            const q = query(quizAttemptsRef, where("quizId", "==", quizId));
            const querySnapshot = await getDocs(q);
            const attempts = [];
            querySnapshot.forEach((doc) => {
                attempts.push({ ...doc.data(), id: doc.id });
            });
            return attempts;
        } catch (error) {
            console.error("Error fetching quiz attempts: ", error);
            throw error;
        }
    };

    const getQuizzes = () => {
        setLoading(true);

        const q = query(quizzesRef, where("courseId", "==", courseId));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedQuizzes = [];
            querySnapshot.forEach((doc) => {
                fetchedQuizzes.push({ ...doc.data(), id: doc.id });
            });

            setQuizzes(fetchedQuizzes);

            if (authRole === 'instructor') {
                const created = fetchedQuizzes.filter(q => q.createdBy === currentUser?.uid);
                setCreatedQuizzes(created);
            } else {
                setCreatedQuizzes([]);
            }

            setLoading(false);
        }, (error) => {
            console.error("Error fetching quizzes: ", error);
            setLoading(false);
        });

        return unsubscribe;
    };

    useEffect(() => {
        if (currentUser && courseId) {
            getQuizzes();
        }
    }, [currentUser, courseId]);

    return {
        createQuiz,
        deleteQuiz,
        submitQuizAttempt,
        getQuizAttempts,
        quizzes,
        createdQuizzes,
        loading,
    };
}; 