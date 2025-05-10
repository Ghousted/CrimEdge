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
  deleteDoc 
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
        orderBy("createdAt", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      const fetchedLessons = [];
      querySnapshot.forEach((doc) => {
        fetchedLessons.push({ ...doc.data(), id: doc.id });
      });
      setLessons(fetchedLessons);
    } catch (error) {
      console.error("Error fetching lessons:", error);
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
    lessons,
    loading,
    error
  };
}; 