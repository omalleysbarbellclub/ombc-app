import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { auth } from './firebase';

const RepeatLastSession = () => {
  const [lastWorkout, setLastWorkout] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const db = getFirestore();

  useEffect(() => {
    const fetchLastWorkout = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not logged in');

        const q = query(
          collection(db, 'WorkoutLogs'),
          where('userId', '==', user.uid),
          orderBy('workoutDate', 'desc'),
          limit(1)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setLastWorkout(snapshot.docs[0].data());
        } else {
          setError('No previous session found.');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLastWorkout();
  }, []);

  return (
    <div>
      <h2>Repeat Last Session</h2>
      {loading && <p>Loading last session...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {lastWorkout && (
        <div>
          <p><strong>Session:</strong> {lastWorkout.sessionTitleSnapshot || 'Untitled'}</p>
          <p><strong>Date:</strong> {new Date(lastWorkout.workoutDate.seconds * 1000).toLocaleString()}</p>
          {lastWorkout.loggedExercises.map((exercise: any, i: number) => (
            <div key={i}>
              <h4>{exercise.exerciseName}</h4>
              <ul>
                {exercise.sets.map((set: any, j: number) => (
                  <li key={j}>
                    Weight: {set.loggedWeight}kg, Reps: {set.loggedReps}, RPE: {set.rpe}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RepeatLastSession;
