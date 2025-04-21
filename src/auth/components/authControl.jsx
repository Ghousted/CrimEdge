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
    query,
    where,
    getDocs,
    collection
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./authContext";

export const authControl = () => {
    const navigate = useNavigate();
    const googleProvider = new GoogleAuthProvider();
    const { setAuthRole, setUserData, setMembershipPlan } = useAuth();

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

            const { role, emailVerified, membership } = userSnapshot.data();

            // Navigate by role
            const routes = {
                admin: "/admin/dashboard",
                instructor: "/insdashboard",
                user: "/dashboard",
            };

            if (!emailVerified) {
                navigate("/verify-email");
                return;
            }

            await setAuthRole(role);
            await setUserData(userSnapshot.data());
            const plan = membership;

            if (plan) {
                const q = query(
                    collection(db, 'subscription-plans'),
                    where('plan', '==', plan) // change 'name' to your actual field name
                );

                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const planDoc = querySnapshot.docs[0]; // since there's only one match
                    setMembershipPlan(planDoc.data());
                } else {
                    setMembershipPlan(null);
                }
            } else {
                setMembershipPlan(null);
            }

            navigate(routes[role] || "/dashboard");

        } catch (error) {
            console.error("Error fetching user role:", error);
            alert("There was an error signing in. Please try again.");
        }
    };

    const signUp = async ({ email, confirmPassword, firstName, lastName, contactNumber }, setAuthRole) => {
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
                membershipStatus: false,
                createdAt: serverTimestamp(),
            });

            navigate("/verify-email");

        } catch (err) {
            if (err.code === "auth/email-already-in-use") {
                alert("This email is already registered. Please sign in.");
                navigate("/signin");
            } else {7
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

    const updateEmailVerificationStatus = async (userId) => {
        try {
            const userDocRef = doc(db, "users", userId);
            await updateDoc(userDocRef, {
                emailVerified: true,
            });
        } catch (error) {
            console.error("Error updating email verification status:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            setAuthRole(null);
            setUserData(null);
            setMembershipPlan(null);
            await signOut(auth);
            navigate("/");
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    return { signUp, signIn, logout, updateEmailVerificationStatus };
};
