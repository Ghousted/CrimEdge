import { db } from '../../firebase';
import { useState, useEffect } from 'react';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../auth/components/authContext';

export const useHandleAnnouncements = (courseId = null) => {
    const { currentUser, authRole, userData } = useAuth(); // Get authRole and userData from context
    const [announcements, setAnnouncements] = useState([]);
    const [createdAnnouncements, setCreatedAnnouncements] = useState([]);
    const [loading, setLoading] = useState(false);

    // Function to create an announcement
    const createAnnouncement = async (announcement, target, id) => {
        try {
            // Use collection instead of doc for announcements
            const announcementsRef = collection(db, "announcements");

            await addDoc(announcementsRef, {
                announcement,
                target,
                createdBy: currentUser ? currentUser.uid : '', // Use user ID
                createdByName: userData ? `${userData.firstName} ${userData.lastName}` : '', // Also store instructor name
                createdAt: new Date(),
                courseId: id || null, // Associate announcement with course if provided
            });

            console.log(`Announcement created: ${announcement}`);
        } catch (error) {
            console.error("Error creating announcement: ", error);
        }
    };

    // Function to get announcements based on user's membership and target field
    const getAnnouncements = async () => {
        setLoading(true);

        try {
            const announcementsRef = collection(db, "announcements");

            // Use authRole and userData.membership instead of currentUser.role and currentUser.membership
            const userRole = authRole;  // Role from context
            const userMembership = userData ? userData.membership : null;  // Membership from userData
            console.log("User Role: ", userRole);
            console.log("User Membership: ", userMembership);
            let q = query(announcementsRef);

            if (userRole === 'user' && courseId) {
                // For users with a courseId, fetch announcements created by this user and filtered by courseId
                q = query(announcementsRef, where("courseId", "==", courseId));
            } else if (userRole === 'user' && userMembership) {
                // For users without courseId, filter announcements based on membership or 'All'
                q = query(announcementsRef, where("target", "in", [userMembership, "All"]));  // Match the target field to the membership level or 'All'
            } 
            
            console.log('course id', courseId);
            // Get the data from the announcements collection
            const querySnapshot = await getDocs(q);
            const fetchedAnnouncements = [];

            querySnapshot.forEach((doc) => {
                fetchedAnnouncements.push({ ...doc.data(), id: doc.id });
            });

            setAnnouncements(fetchedAnnouncements);

            // If role is instructor, get announcements created by this instructor and optionally filtered by courseId
            if (userRole === 'instructor') {
                const created = courseId
                    ? fetchedAnnouncements.filter(a => a.createdBy === currentUser.uid && a.courseId === courseId)
                    : fetchedAnnouncements.filter(a => a.createdBy === currentUser.uid);
                setCreatedAnnouncements(created);
            } else {
                setCreatedAnnouncements([]);
            }

            console.log("Fetched Announcements: ", fetchedAnnouncements);
            if (userRole === 'instructor') {
                console.log("Created Announcements: ", createdAnnouncements);
            }
        } catch (error) {
            console.error("Error fetching announcements: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            getAnnouncements();  // Fetch announcements when the component mounts or when currentUser changes
        }
    }, [currentUser, authRole, userData, courseId]);

    return { createAnnouncement, announcements, createdAnnouncements, loading };
};
