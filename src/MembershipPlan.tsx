import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from './firebase';

const MembershipPlan = () => {
  const [plan, setPlan] = useState('');
  const [error, setError] = useState('');

  const db = getFirestore();

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not logged in');

        const userRef = doc(db, 'UserProfile', user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setPlan(data.membershipPlan || 'No plan assigned');
        } else {
          setError('User profile not found.');
        }
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchMembership();
  }, []);

  return (
    <div>
      <h2>Your Membership Plan</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {plan && <p><strong>Plan:</strong> {plan}</p>}
    </div>
  );
};

export default MembershipPlan;
