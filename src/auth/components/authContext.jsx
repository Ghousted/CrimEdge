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
  const [emailVerification, setEmailVerification] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            const membership = data.membership;
            const membershipStatus = data.membershipStatus;
            const emailVerified = data.emailVerified;
            const role = data.role;
            setUserData(data);
            setAuthRole(role || null);
            setMembershipStatus(membershipStatus || false);
            setEmailVerification(emailVerified || false);
            // Fetch subscription plan details from subscription-plans collectiom
           
            if (membership) {
              const planDoc = await getDoc(doc(db, 'subscription-plans', membership));
              if (planDoc.exists()) {
                setMembershipPlan(planDoc.data());
                console.log('member setq');
              } else {
                setMembershipPlan(null);
              }
            } else {q 
              setMembershipPlan(null);
            }
          } else {
            console.warn('User document not found in Firestore');
            setAuthRole(null);
            setUserData(null);
            setMembershipPlan(null);
            setEmailVerification(false);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setAuthRole(null);
          setUserData(null);
          setMembershipPlan(null);
          setEmailVerification(false);
        }
      } else {
        setAuthRole(null);
        setUserData(null);
        setMembershipPlan(null);
        setEmailVerification(false);
      }
      setLoading(false);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      fetchUserData(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{
      authRole, currentUser, loading, membershipPlan, membershipStatus,
      setAuthRole, setMembershipStatus, emailVerification, setEmailVerification,
      userData, setUserData, setMembershipPlan
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
