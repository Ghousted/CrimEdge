import { db } from "../../firebase";
import { addDoc, collection, serverTimestamp, query, onSnapshot, deleteDoc, doc, orderBy, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";

export const useEditAdminSettings = () => {
    const subscriptionPlansRef = collection(db, 'subscription-plans');
    const [subscriptionPlans, setSubscriptionPlans] = useState([]);

    useEffect(() => {
        const q = query(subscriptionPlansRef, orderBy('price'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const plans = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSubscriptionPlans(plans);
        }, (error) => {
            console.error("Error listening to subscription plans: ", error);
        });

        return () => unsubscribe();
    }, []);


    const editCurrentPlan = async (id, plan, price) => {
        try {
            console.log(id, plan, price);
            await updateDoc(doc(subscriptionPlansRef, id), {
                plan,
                price,
            });
        } catch (err) {
            console.error("Error editing current plan: ", err);
        }
    };

    const removePlan = async (id) => {
        try {
            const planDocRef = doc(db, "subscription-plans", id); // make sure "subscriptionPlans" is your collection name
            await deleteDoc(planDocRef);
        } catch (err) {
            console.log(id);
            console.error("Failed to delete plan:", err);
        }
    };

    return {  subscriptionPlans, removePlan, editCurrentPlan };
};