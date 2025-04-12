import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authRole, setAuthRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          console.log(userDoc.data().role);
          if (userDoc.exists()) {
            setAuthRole(userDoc.data().role);
          } else {
            setAuthRole(null);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setAuthRole(null);
        }
      } else {
        setAuthRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ authRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
