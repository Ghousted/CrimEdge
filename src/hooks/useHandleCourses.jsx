import { db } from '../../firebase';
import { useState, useEffect } from 'react';
import { addDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useAuth } from '../auth/components/authContext';

export const useHandleCourses = () => {
  const { currentUser, authRole, userData } = useAuth(); // Get authRole and userData from context
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const addNewCourse = async (courseName, courseDescription) => {
    try {
      const coursesRef = collection(db, "courses");
      await addDoc(coursesRef, {
        course: courseName,
        description: courseDescription,
        createdBy: currentUser ? currentUser.uid : '', // Use user ID
        createdByName: userData ? `${userData.firstName} ${userData.lastName}` : '', // Also store instructor name
        createdAt: new Date(),
      });
      console.log(`Course created: ${courseName}`);
      window.location.reload(); // Reload the page to fetch new data
    } catch (error) {
      console.error("Error creating course: ", error);
    }
  };

  const getCourses = async () => {
    setLoading(true);
    try {
      const coursesRef = collection(db, "courses");
      let q = query(coursesRef);

      // If user is instructor, filter courses by createdBy uid
      if (authRole === 'instructor' && currentUser) {
        q = query(coursesRef, where("createdBy", "==", currentUser.uid), orderBy("createdAt", "asc"));
      }

      const querySnapshot = await getDocs(q);
      const fetchedCourses = [];
      querySnapshot.forEach((doc) => {
        fetchedCourses.push({ ...doc.data(), id: doc.id });
      });
      setCourses(fetchedCourses);

      console.log("Fetched Courses: ", fetchedCourses);
    } catch (error) {
      console.error("Error fetching courses: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      getCourses();
    }
  }, [currentUser, authRole]);

  return {
    addNewCourse,
    courses,
    loading,
  };
};
