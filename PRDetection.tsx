import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { auth } from './firebase';

interface PRRecord {
  exerciseName: string;
  prType: string;
  value: number;
  dateAchieved: any;
}

const PRDetection = () => {
  const [prs, setPrs] = useState<PRRecord[]>([]);
  const [error, setError] = useState('');

  const db = getFirestore();

  useEffect(() => {
    const fetchPRs = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not logged in');

        const q = query(
          collection(db, 'PRRecords'),
          where('userId', '==', user.uid)
        );

        const snapshot = await getDocs(q);
        const prList: PRRecord[] = [];

        snapshot.forEach(doc => {
          const data = doc.data();
          prList.push({
            exerciseName: data.exerciseName,
            prType: data.prType,
            value: data.value,
            dateAchieved: data.dateAchieved
          });
        });

        setPrs(prList);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchPRs();
  }, []);

  return (
    <div>
      <h2>Personal Records</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {prs.length > 0 ? (
        <ul>
          {prs.map((pr, index) => (
            <li key={index}>
              <strong>{pr.exerciseName}</strong> — {pr.prType}: {pr.value}kg (
              {new Date(pr.dateAchieved.seconds * 1000).toLocaleDateString()})
            </li>
          ))}
        </ul>
      ) : (
        <p>No PRs found.</p>
      )}
    </div>
  );
};

export default PRDetection;
