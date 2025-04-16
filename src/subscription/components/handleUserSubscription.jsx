import { db } from '../../../firebase';
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../auth/components/authContext'; // Replace with your actual auth context

export const useHandleUserMembership = () => {
  const [membershipPlan, setMembershipPlan] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { currentUser } = useAuth(); // assuming you're using Firebase Auth with context

  const userRef = doc(db, "users", currentUser.uid);

  const captureMembershipPlan = async (plan) => {
    try {
      setMembershipPlan(plan);
      await updateDoc(userRef, {
        membership: plan,
      });

      console.log(`Membership updated to: ${plan}`);
    } catch (error) {
      console.error("Error updating membership: ", error);
    }
  };

  const subscriptionStatus = async (status) => {
    try {
      setIsSubscribed(status);
      await updateDoc(userRef, {
        membershipStatus: status,
      });

      console.log(`Membership updated to: ${status}`);
    } catch (error) {
      console.error("Error updating membership: ", error);
    }
  }

  return { membershipPlan, captureMembershipPlan, subscriptionStatus };
};
