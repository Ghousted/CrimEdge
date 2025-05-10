import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { useAuth } from "../auth/components/authContext";

export const useHandleStorage = () => {
    const { currentUser, userData } = useAuth();

    const fileUpload = async (files, courseId) => {
        console.log('=== File Upload Debug ===');
        console.log('Current user:', {
            uid: currentUser?.uid,
            email: currentUser?.email,
            emailVerified: currentUser?.emailVerified
        });
        console.log('User data:', userData);
        console.log('User role:', userData?.role);
        console.log('Auth token:', await currentUser?.getIdTokenResult());

        if (!currentUser) {
            throw new Error('You must be logged in to upload files');
        }

        if (!userData || (userData.role !== 'instructor' && userData.role !== 'admin')) {
            console.error('User role check failed:', {
                hasUserData: !!userData,
                role: userData?.role,
                requiredRoles: ['instructor', 'admin'],
                userData: userData
            });
            throw new Error('Only instructors and admins can upload files');
        }

        try {
            const uploadPromises = files.map(async (file) => {
                // Create a unique filename to prevent overwrites
                const uniqueFileName = `${Date.now()}_${file.name}`;
                const storageRef = ref(storage, `files/${courseId}/${uniqueFileName}`);
                
                console.log('Attempting to upload file:', {
                    path: `files/${courseId}/${uniqueFileName}`,
                    fileType: file.type,
                    fileSize: file.size
                });
                
                // Upload the file
                const snapshot = await uploadBytes(storageRef, file);
                
                // Get the download URL
                const url = await getDownloadURL(snapshot.ref);
                
                return {
                    file,
                    url,
                    fileName: file.name,
                    fileType: file.type,
                    uploadedAt: new Date().toISOString()
                };
            });

            const results = await Promise.all(uploadPromises);
            return results;
        } catch (error) {
            console.error("Error uploading files: ", error);
            if (error.code === 'storage/unauthorized') {
                const token = await currentUser?.getIdTokenResult();
                console.error('Storage unauthorized error details:', {
                    error,
                    token,
                    userRole: userData?.role
                });
                throw new Error('You do not have permission to upload files. Please make sure you are logged in as an instructor or admin.');
            }
            throw error;
        }
    };

    const uploadCourseImages = async (file, courseName) => {
        console.log('=== Course Image Upload Debug ===');
        console.log('Current user:', {
            uid: currentUser?.uid,
            email: currentUser?.email,
            emailVerified: currentUser?.emailVerified
        });
        console.log('User data:', userData);
        console.log('User role:', userData?.role);
        console.log('Auth token:', await currentUser?.getIdTokenResult());

        if (!currentUser) {
            throw new Error('You must be logged in to upload course images');
        }

        // Temporarily remove role check for testing
        // if (!userData || (userData.role !== 'instructor' && userData.role !== 'admin')) {
        //     throw new Error('Only instructors and admins can upload course images');
        // }

        // Determine storage path based on user role
        const storagePath = `course_image/${courseName}/${file.name}`;
        const storageRef = ref(storage, storagePath);

        console.log('Attempting to upload course image:', {
            path: storagePath,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size
        });

        try {
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            return url;
        } catch (error) {
            console.error("Upload failed:", error);
            if (error.code === 'storage/unauthorized') {
                const token = await currentUser?.getIdTokenResult();
                console.error('Storage unauthorized error details:', {
                    error,
                    token,
                    userRole: userData?.role
                });
                throw new Error('You do not have permission to upload course images. Please make sure you are logged in as an instructor or admin.');
            }
            throw error;
        }
    };

    const fetchCourseImages = async (courseName) => {
        if (!currentUser) {
            throw new Error('You must be logged in to fetch course images');
        }

        // Fetch image URL for specific courseName
        const folderRef = ref(storage, `course_image/${courseName}`);
        try {
            const result = await listAll(folderRef);
            if (result.items.length === 0) {
                return null;
            }
            // Assuming one image per course, get the first image URL
            const url = await getDownloadURL(result.items[0]);
            return url;
        } catch (error) {
            console.error("Error listing files:", error);
            throw error;
        }
    };

    return { fileUpload, uploadCourseImages, fetchCourseImages };
};
