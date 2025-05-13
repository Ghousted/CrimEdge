import { db, storage } from "../../firebase";
import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  deleteDoc, 
  updateDoc,
  arrayUnion
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage";
import { useAuth } from '../auth/components/authContext';

export const useHandleLessons = (courseId) => {
  const { currentUser, userData } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const lessonsRef = collection(db, "lessons");
  const lecturesRef = collection(db, "lectures");


  const addNewSection = async (title, description) => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to add a new section');
      }
      if (userData?.role !== 'instructor') {
        throw new Error('Only instructors can add new sections');
      }
      if (!title || !description) {
        throw new Error('Invalid section: Title and description are required');
      }
      setError(null);
      await addDoc(lessonsRef, {
        courseId,
        title,
        description,
        createdBy: currentUser.uid,
        createdByName: `${userData.firstName} ${userData.lastName}`,
        createdAt: new Date()
      });
      return true;
    }
    catch (error) {
      console.error("Error adding new section:", error);
      setError(error.message);
      return false;
    }
  };

  const addNewLecture = async (lessonId, title, content, lectureFile = null) => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to add a new lecture');
      }
      if (userData?.role !== 'instructor') {
        throw new Error('Only instructors can add new lectures');
      }
      if (!lessonId || !title || !content) {
        throw new Error('Invalid lecture: Section ID, title, and content are required');
      }
      setError(null);
      const lectureRef = await addDoc(lecturesRef, {
        title,
        content,
        isCompleted: false,
        createdBy: currentUser.uid,
        lectureFiles: lectureFile ? [lectureFile] : [],
        createdByName: `${userData.firstName} ${userData.lastName}`,
        createdAt: new Date()
      });


      const lessonDocRef = doc(db, "lessons", lessonId);

      await updateDoc(lessonDocRef, {
        lectures: arrayUnion(lectureRef.id)
      });
      return true;
    }
    catch (error) {
      console.error("Error adding new lecture:", error);
      setError(error.message);
      return false;
    }
  };

  const uploadLessonFile = async (file, title, description) => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to upload lessons');
      }

      if (userData?.role !== 'instructor') {
        throw new Error('Only instructors can upload lessons');
      }

      if (!file || !file.name) {
        throw new Error('Invalid file: File name is required');
      }

      setError(null);
      // Create a unique file name
      const fileName = `${Date.now()}_${file.name}`;
      const storagePath = `lessons/${courseId}/${fileName}`;
      const storageRef = ref(storage, storagePath);

      console.log('Uploading lesson file:', {
        path: storagePath,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      });

      // Upload file to Firebase Storage
      const snapshot = await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(snapshot.ref);

      // Add lesson document to Firestore
      await addDoc(lessonsRef, {
        courseId,
        title: title || file.name, // Use file name as title if not provided
        description: description || '', // Use empty string if description not provided
        fileName: file.name,
        fileUrl,
        fileType: file.type,
        createdBy: currentUser.uid,
        createdByName: `${userData.firstName} ${userData.lastName}`,
        createdAt: new Date()
      });

      // Refresh lessons list
      await getLessons();
      return true;
    } catch (error) {
      console.error("Error uploading lesson file:", error);
      setError(error.message);
      return false;
    }
  };

  const deleteLesson = async (lessonId, fileUrl) => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to delete lessons');
      }

      if (userData?.role !== 'instructor') {
        throw new Error('Only instructors can delete lessons');
      }

      setError(null);
      // Delete file from Storage
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);

      // Delete lesson document from Firestore
      await deleteDoc(doc(db, "lessons", lessonId));

      // Refresh lessons list
      await getLessons();
      return true;
    } catch (error) {
      console.error("Error deleting lesson:", error);
      setError(error.message);
      return false;
    }
  };

  const getLessons = async () => {
    if (!currentUser) {
      setError('You must be logged in to view lessons');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const q = query(
        lessonsRef,
        where("courseId", "==", courseId),
        orderBy("createdAt", "asc")
      );

      const querySnapshot = await getDocs(q);
      const sections = [];

      for (const lessonDoc of querySnapshot.docs) {
        const lessonData = lessonDoc.data();
        const lessonId = lessonData.lessonId;
        const lectureIds = lessonData.lectures || [];

        // Fetch lecture documents (max 10 per batch)
        const fetchedLectures = [];

        const chunkSize = 10;
        for (let i = 0; i < lectureIds.length; i += chunkSize) {
          const chunk = lectureIds.slice(i, i + chunkSize);
          const lectureQuery = query(
            lecturesRef,
            where("__name__", "in", chunk)
          );

          const lectureSnapshot = await getDocs(lectureQuery);
          lectureSnapshot.forEach((doc) => {
            const lectureData = doc.data();
            console.log('Fetched lecture data:', lectureData);
            fetchedLectures.push({
              title: lectureData.title || "Untitled Lecture",
              content: lectureData.content || "",
              completed: lectureData.isCompleted || false,
              id: doc.id
            });
          });
        }

        sections.push({
          id: lessonData.lessonId || lessonDoc.id,
          title: lessonData.title || `Lesson: ${lessonId}`,
          lectures: fetchedLectures
        });
      }

      setLessons(sections); // You can rename this state to setSections if desired
    } catch (error) {
      console.error("Error fetching lessons with lectures:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      getLessons();
    }
  }, [courseId]);

  return {
    uploadLessonFile,
    deleteLesson,
    addNewSection,
    addNewLecture,
    lessons,
    loading,
    error
  };
}; 