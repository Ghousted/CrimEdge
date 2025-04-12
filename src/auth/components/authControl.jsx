import React, { useState } from "react";
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
    const [authRole, setAuthRole] = useState(null);
    const googleProvider = new GoogleAuthProvider();

    // 🔁 Centralized role fetching + navigation logic
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
            setAuthRole(role);

            // 🔀 Navigate by role
            const routes = {
                admin: "/admin/dashboard",
                instructor: "/insdashboard",
                user: "/dashboard",
            };

            // Check if email is verified
            if (!emailVerified) {
                navigate("/verify-email");
                return;
            }

            navigate(routes[role] || "/dashboard");

        } catch (error) {
            if (error === 'FirebaseError: Missing or insufficient permissions.') {
            }
            console.error("Error fetching user role:", error);
            alert("There was an error signing in. Please try again.");
        }
    };

    const signUp = async ({ email, confirmPassword, firstName, lastName, contactNumber }) => {
        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, email, confirmPassword);
            const user = userCredentials.user;

            // ✅ Send email verification
            await sendEmailVerification(user);

            // ✅ Save user data in Firestore with verification status
            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, {
                firstName,
                lastName,
                email,
                contactNumber,
                role: "user",
                emailVerified: false, // Initially set to false
                createdAt: serverTimestamp(),
            });

            // ✅ Redirect to verification notice page
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

            // If email is not verified, prompt user to verify email
            if (!user.emailVerified && email != 'admin@crimedge.com') {
                alert("Please verify your email before signing in.");
                await signOut(auth);
                return;
            }

            // Update Firestore to reflect verified email (in case the user verified after sign-up)
            if (email != 'admin@crimedge.com') {
                await updateDoc(doc(db, "users", user.uid), {
                    emailVerified: true,
                });
            }

            // Proceed with user login and navigation
            await handleUserLogin(user);
        } catch (err) {
            console.error("Email/password sign-in error:", err);
            alert("Invalid credentials or user does not exist.");
        }
    };
    const signInWithGoogle = async () => {
        try {

            const { user } = await signInWithPopup(auth, googleProvider);
            const userDocRef = doc(db, "users", user.uid);
            const userSnapshot = await getDoc(userDocRef);

            if (!userSnapshot.exists()) {
                // If no user doc exists, create one
                await setDoc(userDocRef, {
                    firstName: user.displayName?.split(" ")[0] || "",
                    lastName: user.displayName?.split(" ")[1] || "",
                    email: user.email,
                    contactNumber: "", // Optional - or pull from custom claim if needed
                    role: "user", // Default role
                    emailVerified: true,
                    createdAt: serverTimestamp(),
                });
            }

            await handleUserLogin(user);

        } catch (err) {
            console.error("Google sign-in error:", err);
            alert("Google sign-in failed.");
        }
    };
    const logout = async () => {
        try {
            await signOut(auth);
            setAuthRole(null);
            navigate("/");
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    return { signUp, signIn, signInWithGoogle, logout, authRole };
};
