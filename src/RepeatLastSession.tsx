import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, limit, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './UserContext';
import { useNavigate } from 'react-router-dom';

const RepeatSession: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [latest, setLatest] = useState<any>(null);

  useEffect(() => {
    const fetchLatest = async () => {
      if (!user) return;

      const q = query(
        collection(db, 'sessions'),
        where('uid', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(1)
      );

      const snap = await getDocs(q);
      if (!snap.empty) {
        setLatest(snap.docs[0].data());
      }
    };

    fetchLatest();
  }, [user]);

  const handleRepeat = async () => {
    if (!user || !latest) return;

    await addDoc(collection(db, 'sessions'), {
      ...latest,
      createdAt: new Date(),
    });

    navigate('/dashboard');
  };

  return (
    <div>
      <h2>Repeat Last Session</h2>
      {latest ? (
        <>
          <p>
            <strong>{latest.lift}</strong>: {latest.weight}kg × {latest.reps} @ RPE {latest.rpe}
          </p>
          <button onClick={handleRepeat}>Repeat This Session</button>
        </>
      ) : (
        <p>No session found to repeat.</p>
      )}
    </div>
  );
};

export default RepeatSession;
