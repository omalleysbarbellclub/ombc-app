import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { auth } from './firebase';

const SessionHistory = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const db = getFirestore();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not logged in');

        const q = query(
          collection(db, 'WorkoutLogs'),
          where('userId', '==', user.uid),
          orderBy('workoutDate', 'desc')
        );

        const snapshot = await getDocs(q);
        const history: any[] = [];

        snapshot.forEach(doc => {
          history.push(doc.data());
        });

        setLogs(history);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div>
      <h2>Session History</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {logs.length > 0 ? (
        <ul>
          {logs.map((log, index) => (
            <li key={index}>
              <strong>{log.sessionTitleSnapshot || 'Untitled Session'}</strong> — {new Date(log.workoutDate.seconds * 1000).toLocaleDateString()}
              <ul>
                {log.loggedExercises.map((exercise: any, i: number) => (
                  <li key={i}>
                    {exercise.exerciseName}:
                    <ul>
                      {exercise.sets.map((set: any, j: number) => (
                        <li key={j}>
                          {set.loggedWeight}kg × {set.loggedReps} reps (RPE {set.rpe})
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>No past sessions found.</p>
      )}
    </div>
  );
};

export default SessionHistory;
