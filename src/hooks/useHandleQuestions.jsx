import { useAuth } from "../auth/components/authContext";
import { useState, useEffect } from "react";
import { addDoc, collection, query, where, onSnapshot, deleteDoc, doc, updateDoc, arrayUnion, getDocs } from 'firebase/firestore';
import { db } from "../../firebase";


export const useHandleQuestions = (courseId) => {
    const [questions, setQuestions] = useState([]);
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(false);


    const qaCollectionRef = collection(db, "q_and_a");
    const { currentUser, authRole, userData } = useAuth(); // Get authRole and userData from context

    const addNewQuestion = async (question, lectureId) => {

        addDoc(qaCollectionRef, {
            question,
            lectureId,
            type: "question",
            createdBy: currentUser ? userData.firstName + " " + userData.lastName : '', // Use user ID
            createdAt: new Date(),
            courseId: courseId,
        })
    }

    const addReply = async (questionId, reply) => {
        const questionRef = doc(qaCollectionRef, questionId);
        await updateDoc(questionRef, {
            replies: arrayUnion({
                reply,
                createdBy: currentUser ? userData.firstName + " " + userData.lastName : '', // Use user ID
                createdAt: new Date(),
            })
        });
    }

const getAllReplies = async () => {
  const repliesByQuestion = {};

  const questionsSnapshot = await getDocs(qaCollectionRef);

  for (const questionDoc of questionsSnapshot.docs) {
    const questionId = questionDoc.id;
    const data = questionDoc.data();

    // Make sure the replies array exists and is actually an array
    const replies = Array.isArray(data.replies) ? data.replies : [];

    repliesByQuestion[questionId] = replies;
  }

  setReplies(repliesByQuestion); // Set to state if needed
  console.log(repliesByQuestion);
};


    const getQuestions = () => {
        const q = query(qaCollectionRef, where("courseId", "==", courseId), where("type", "==", "question"));
        onSnapshot(q, (querySnapshot) => {
            const questions = [];
            querySnapshot.forEach((doc) => {
                questions.push({ ...doc.data(), id: doc.id });
            });
            setQuestions(questions);
        });
    }

    useEffect(() => {
        if (courseId) {
            getQuestions();
            getAllReplies();
        }
    }, [courseId]);

    return { addNewQuestion, addReply, getAllReplies, questions, replies, loading, setLoading };
}