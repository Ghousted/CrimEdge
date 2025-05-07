import { db } from '../../firebase';
import { useState, useEffect } from 'react';
import { addDoc, collection, query, where, getDocs, orderBy, doc, updateDoc, arrayUnion, getDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../auth/components/authContext';
import { useHandleStorage } from './useHandleStorage';

export const useHandleCourses = () => {
  const { currentUser, authRole, userData } = useAuth(); // Get authRole and userData from context
  const [courses, setCourses] = useState([]);
  const [courseLimit, setCourseLimit] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState(null);
  const [loading, setLoading] = useState(false);
  const { fetchCourseImages } = useHandleStorage(); // Import the function to fetch course images

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
    } catch (error) {
      console.error("Error creating course: ", error);
    }
  };

  const deleteCourse = async (courseId) => {
    try {
      await deleteDoc(doc(db, "courses", courseId));
    } catch (error) {
      console.error(error);
    }
  }

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
        const enrolledCourseIds = userDoc.data().courses || [];

        // For each enrolled course ID, fetch course data and image URL
        const coursesWithUrls = await Promise.all(
          enrolledCourseIds.map(async (courseId) => {
            const courseDoc = await getDoc(doc(db, "courses", courseId));
            if (!courseDoc.exists()) {
              return null;
            }
            const courseData = { id: courseDoc.id, ...courseDoc.data() };
            const imageUrl = await fetchCourseImages(courseData.course);
            return { ...courseData, imageUrl };
          })
        );

        // Filter out any nulls (in case some courses no longer exist)
        const filteredCourses = coursesWithUrls.filter(course => course !== null);

        setEnrolledCourses(filteredCourses); // Update with images
      } else {
        console.log("No such document!");
        setEnrolledCourses([]);
      }
    } catch (error) {
      console.error("Error fetching enrolled courses: ", error);
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
    deleteCourse,
    courses,
    enrolledCourses,
    courseLimit,
    loading,
  };
};
