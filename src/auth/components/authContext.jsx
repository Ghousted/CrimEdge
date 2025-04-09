import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, signOut as firebaseSignOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

// Create a context for authentication
const AuthContext = createContext();

// Auth provider that wraps your app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    // You can add Firebase onAuthStateChanged listener here
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, [auth]);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);  // Update the state to reflect that the user is logged out
    } catch (error) {
      console.error('Sign out error: ', error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context values
export const useAuth = () => {
  return useContext(AuthContext);
};
