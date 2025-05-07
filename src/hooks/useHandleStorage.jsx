import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { useAuth } from "../auth/components/authContext";

export const useHandleStorage = () => {
    const { currentUser, userData } = useAuth();

    const fileUpload = async (file) => {
        const storageRef = ref(storage, `images/${currentUser.uid}/${file.name}`);
        try {
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            console.log(currentUser.uid);
            return url;
        } catch (error) {
            console.error("Error uploading file: ", error);
            return null;
        }
    };

    const uploadCourseImages = async (file, courseName) => {
        // Determine storage path based on user role
        const storagePath = `course_image/${courseName}/${file.name}`;

        const storageRef = ref(storage, storagePath);

        try {
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            return url;
        } catch (error) {
            console.error("Upload failed:", error);
            return null;
        }
    };

    const fetchCourseImages = async (courseName) => {
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
            return null;
        }
    };

    return { uploadCourseImages, fetchCourseImages };
};
