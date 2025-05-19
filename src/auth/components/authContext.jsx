import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { auth, db } from '../../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  doc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
} from 'firebase/firestore';
import Loading from '../../components/Loading';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authRole, setAuthRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [membershipPlan, setMembershipPlan] = useState(null);
  const [membershipStatus, setMembershipStatus] = useState(false);
  const [emailVerification, setEmailVerification] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async (user) => {
    if (user) {
      try {
        console.log('Fetching user data for:', user.uid);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          console.log('User data from Firestore:', data);
          
          const membership = data.membership;
          const membershipStatus = data.membershipStatus;
          const emailVerified = data.emailVerified;
          const role = data.role;
          
          console.log('Setting user role:', role);
          setUserData(data);
          setAuthRole(role || null);
          setMembershipStatus(membershipStatus || false);
          setEmailVerification(emailVerified || false);
          setMembershipPlan(membership); 

          if (membership) {
            const q = query(
              collection(db, 'plans'),
              where('plan', '==', membership)
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              const planDoc = querySnapshot.docs[0];
              setMembershipPlan(planDoc.data());
              console.log('membershipPlan:', planDoc.data());
            } else {
              setMembershipPlan(null);
            }
          } else {
            setMembershipPlan(null);
          }
          console.log("User role set to:", role);

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
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user);
      setCurrentUser(user);
      fetchUserData(user);
    });

    return () => unsubscribe();
  }, [fetchUserData]);

  const refreshUserData = async () => {
    if (currentUser) {
      setLoading(true);
      await fetchUserData(currentUser);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      authRole, currentUser, loading, membershipPlan, membershipStatus,
      setAuthRole, setMembershipStatus, emailVerification, setEmailVerification,
      userData, setUserData, setMembershipPlan, refreshUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
