// DarkModeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUserTheme = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setDarkMode(data.darkMode || false);
      }
    } catch (error) {
      console.error('Error fetching user theme:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = async () => {
    const user = auth.currentUser;
    if (user) {
      const newMode = !darkMode;
      setDarkMode(newMode);
      try {
        await updateDoc(doc(db, 'users', user.uid), { darkMode: newMode });
      } catch (error) {
        console.error('Error updating dark mode:', error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserTheme(user.uid);
      } else {
        setDarkMode(false);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {!loading && children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => useContext(DarkModeContext);
