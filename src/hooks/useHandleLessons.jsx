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

  const addNewLecture = async (lessonId, title, content, lessonFile) => {
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

      console.log('Creating new lecture:', {
        lessonId,
        title,
        hasFile: !!fileData
      });

      const lectureData = {
        title,
        content,
        isCompleted: false,
        createdBy: currentUser.uid,
        createdByName: `${userData.firstName} ${userData.lastName}`,
        createdAt: new Date(),
        ...(fileData && { lectureFiles: [fileData] })
      };

      const lectureRef = await addDoc(lecturesRef, lectureData);

      console.log('Lecture document created:', lectureRef.id);

      const lessonDocRef = doc(db, "lessons", lessonId);
      await updateDoc(lessonDocRef, {
        lectures: arrayUnion(lectureRef.id)
      });

      console.log('Lesson document updated with new lecture');

      // Refresh lessons list
      await getLessons();
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
            where("__name__", "in", chunk),
            orderBy("createdAt", "asc")
          );

          const lectureSnapshot = await getDocs(lectureQuery);
          lectureSnapshot.forEach((doc) => {
            const lectureData = doc.data();
            const fileData = lectureData.lectureFiles?.[0] || null;
            const fileUrl = fileData?.fileUrl || null;

            console.log('Fetched lecture data:', lectureData);

            fetchedLectures.push({
              title: lectureData.title || "Untitled Lecture",
              content: lectureData.content || "",
              completed: lectureData.isCompleted || false,
              id: doc.id,
              fileUrl: fileUrl, // ← ✅ add video URL here
              fileData: fileData || null,
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