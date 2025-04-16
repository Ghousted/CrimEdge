import React from "react";
import { auth, db } from "../../../firebase";
import {
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendEmailVerification,
} from "firebase/auth";
import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export const authControl = () => {
    const navigate = useNavigate();
    const googleProvider = new GoogleAuthProvider();

    const handleUserLogin = async (user) => {
        try {
            const userDocRef = doc(db, "users", user.uid);
            const userSnapshot = await getDoc(userDocRef);

            if (!userSnapshot.exists()) {
                console.warn("User document not found in Firestore.");
                alert("Your account has no associated user record. Please contact support.");
                await signOut(auth);
                navigate("/signin");
                return;
            }

            const { role, emailVerified } = userSnapshot.data();

            // Navigate by role
            const routes = {
                admin: "/admin/dashboard",
                instructor: "/insdashboard",
                user: "/membership",
            };

            if (!emailVerified) {
                navigate("/verify-email");
                return;
            }

            navigate(routes[role] || "/dashboard");

        } catch (error) {
            console.error("Error fetching user role:", error);
            alert("There was an error signing in. Please try again.");
        }
    };

    const signUp = async ({ email, confirmPassword, firstName, lastName, contactNumber }) => {
        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, email, confirmPassword);
            const user = userCredentials.user;

            await sendEmailVerification(user);

            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, {
                firstName,
                lastName,
                email,
                contactNumber,
                role: "user",
                emailVerified: false,
                createdAt: serverTimestamp(),
            });

            navigate("/verify-email");
        } catch (err) {
            if (err.code === "auth/email-already-in-use") {
                alert("This email is already registered. Please sign in.");
                navigate("/signin");
            } else {
                console.error("Sign up error:", err);
                alert("There was an issue with your registration. Please try again.");
            }
        }
    };

    const signIn = async ({ email, password }) => {
        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);

            if (!user.emailVerified && email !== 'admin@crimedge.com') {
                alert("Please verify your email before signing in.");
                await signOut(auth);
                return;
            }

            if (email !== 'admin@crimedge.com') {
                await updateDoc(doc(db, "users", user.uid), {
                    emailVerified: true,
                });
            }

            await handleUserLogin(user);
        } catch (err) {
            console.error("Email/password sign-in error:", err);
            alert("Invalid credentials or user does not exist.");
        }
    };

   

    const logout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    return { signUp, signIn, logout };
};
