import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  // Pre-create an admin user (run this once)
  const createAdminUser = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: email,
        role: 'admin',
        createdAt: serverTimestamp()
      });
      console.log('Admin user created successfully');
    } catch (error) {
      console.error('Error creating admin user:', error);
    }
  };

  // Sign up with email/password
  const signUp = async (email, password) => {
    setAuthError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Send email verification
      await sendEmailVerification(userCredential.user);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: email,
        role: 'user', // Default role
        emailVerified: false,
        createdAt: serverTimestamp()
      });
      
      return userCredential;
    } catch (error) {
      setAuthError(getFriendlyError(error.code));
      throw error;
    }
  };

  // Sign in with email/password
  const signIn = async (email, password) => {
    setAuthError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error) {
      setAuthError(getFriendlyError(error.code));
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create new user if doesn't exist
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          role: 'user',
          emailVerified: user.emailVerified,
          createdAt: serverTimestamp()
        });
      }
      
      return result;
    } catch (error) {
      setAuthError(getFriendlyError(error.code));
      throw error;
    }
  };

  // Sign out
  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
      navigate('/landing');
    } catch (error) {
      setAuthError(getFriendlyError(error.code));
    }
  };

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        if (userDoc.exists()) {
          setUser(firebaseUser);
          setUserData(userDoc.data());
          
          // Only redirect if coming from auth pages AND not already on a valid route
          const isAuthRoute = ['/signin', '/signup', '/landing', '/'].includes(
            window.location.pathname
          );
          
          if (isAuthRoute) {
            if (userDoc.data().role === 'admin') {
              navigate('/admin/dashboard', { replace: true });
            } else {
              navigate('/dashboard', { replace: true });
            }
          }
        }
      } else {
        setUser(null);
        setUserData(null);
        
        // Only redirect if on a protected route
        const protectedRoutes = [
          '/dashboard',
          '/admin',
          '/account',
          '/support',
          '/certification'
        ];
        const isProtectedRoute = protectedRoutes.some(route => 
          window.location.pathname.startsWith(route)
        );
        
        if (isProtectedRoute) {
          navigate('/landing', { replace: true });
        }
      }
      setLoading(false);
    });
  
    return unsubscribe;
  }, [auth, navigate]);

  // Helper function for friendly error messages
  const getFriendlyError = (errorCode) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please sign in.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/wrong-password':
        return 'Incorrect email or password.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      case 'auth/requires-recent-login':
        return 'Please sign in again to perform this action.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/operation-not-allowed':
        return 'This operation is not allowed.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with this email.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        authError,
        setAuthError,
        signUp,
        signIn,
        signInWithGoogle,
        logOut,
        createAdminUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};