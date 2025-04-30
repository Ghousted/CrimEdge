import { db } from '../../firebase';
import { useState, useEffect } from 'react';
import { addDoc, collection, query, where, getDocs, orderBy, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { useAuth } from '../auth/components/authContext';

export const useHandleCourses = () => {
  const { currentUser, authRole, userData } = useAuth(); // Get authRole and userData from context
  const [courses, setCourses] = useState([]);
  const [courseLimit, setCourseLimit] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const coursesRef = collection(db, "courses");


  const userDocRef = doc(db, 'users', currentUser.uid);

  const addNewCourse = async (courseName, courseDescription) => {
    try {
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


  const enrollStudentInCourse = async (courseId) => {
    try {
      if (!currentUser || !currentUser.uid) {
        throw new Error("No user is currently logged in.");
      }

      // Reset course limit state
      setCourseLimit(false);

      // Check membership rules 
      const userDocSnap = await getDoc(userDocRef);

      const data = userDocSnap.data();
      const membership = data.membership; // 🔥 Access single field

      if (membership === 'Free') {
        const courses = data.courses || []; // safety fallback if courses field is missing
        if (courses.length >= 2) {
          console.log('Course limit reached for Free membership');
          setCourseLimit(true);
          return;
        }
      }

      await updateDoc(userDocRef, {
        courses: arrayUnion(courseId),
      });

      // Update local state
      setEnrolledCourses(prev => [...prev, courseId]);

      console.log(`✅ Enrolled in course: ${courseId}`);
    } catch (error) {
      console.error("❌ Error enrolling in course: ", error);
    }
  };

  const getEnrolledCourses = async () => {
    try {
      if (!currentUser || !currentUser.uid) {
        throw new Error("No user is currently logged in.");
      }

      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const enrolledCourses = userDoc.data().courses || [];
        setEnrolledCourses(enrolledCourses);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching enrolled courses: ", error);
    }
  }


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

    } catch (error) {
      console.error("Error fetching courses: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      getCourses();
      getEnrolledCourses(); // Fetch enrolled courses when user is logged in
    }
  }, [currentUser, authRole]);

  return {
    addNewCourse,
    enrollStudentInCourse,
    courses,
    enrolledCourses,
    courseLimit,
    loading,
  };
};
