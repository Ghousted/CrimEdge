import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authRole, setAuthRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [membershipPlan, setMembershipPlan] = useState(null);
  const [membershipStatus, setMembershipStatus] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user); // 👈 Set current user

      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const role = userDoc.data().role;
            const membership = userDoc.data().membership;
            const membershipStatus = userDoc.data().membershipStatus;
            setAuthRole(role || null);
            setMembershipPlan(membership || null);
            setMembershipStatus(membershipStatus || false)
          } else {
            console.warn('User document not found in Firestore');
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
    <AuthContext.Provider value={{ authRole, currentUser, loading, membershipPlan, membershipStatus, setMembershipStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
