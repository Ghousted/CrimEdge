import { db } from '../../firebase';
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../auth/components/authContext'; // Replace with your actual auth context
import { useNavigate } from 'react-router-dom';


export const useHandleUserMembership = () => {
  const navigate = useNavigate();
  const [membershipPlan, setMembershipPlan] = useState(null);
  const { currentUser, setMembershipStatus, refreshUserData } = useAuth(); // assuming you're using Firebase Auth with context


  const userRef = doc(db, "users", currentUser.uid);

  const captureMembershipPlan = async (plan) => {
    try {
      await updateDoc(userRef, {
        membership: plan,
      });

      console.log(`Membership updated to: ${plan}`);
    } catch (error) {
      console.error("Error updating membership: ", error);
    }
  };

  const updateMembershipPlan = async (plan) => {
    try {
      await updateDoc(userRef, {
        membership: plan,
      });

      if (plan === 'Free') {
        await updateDoc(userRef, {
          courses: [],
        });

        alert(`ALl Courses will be removed`);
      }

      await refreshUserData(); // Refresh user data to get the latest membership plan
      alert(`Membership updated to: ${plan}`);
      navigate('/dashboard');
    } catch (error) {
      console.error("Error updating membership: ", error);
    }
  };

  const subscriptionStatus = async (status) => {
    try {
      await updateDoc(userRef, {
        membershipStatus: status,
      });

      setMembershipStatus(status); // update context state

      console.log(`Membership updated to: ${status}`);
      navigate('/dashboard');
    } catch (error) {
      console.error("Error updating membership: ", error);
    }
  }

  return { membershipPlan, captureMembershipPlan, subscriptionStatus, updateMembershipPlan };
};
