import React, { useState } from 'react';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { auth } from './firebase';
import { checkAndUpdatePRs } from './prLogic';

const LogSession = () => {
  const [exercise, setExercise] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [rpe, setRpe] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const db = getFirestore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    // Input validation
    if (!exercise.trim()) {
      setError('Exercise name is required.');
      return;
    }
    if (!weight || isNaN(Number(weight)) || Number(weight) <= 0) {
      setError('Enter a valid weight.');
      return;
    }
    if (!reps || isNaN(Number(reps)) || Number(reps) <= 0) {
      setError('Enter a valid number of reps.');
      return;
    }
    if (!rpe || isNaN(Number(rpe)) || Number(rpe) < 5 || Number(rpe) > 10) {
      setError('Enter a valid RPE between 5 and 10.');
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not logged in');

      const workoutData = {
        userId: user.uid,
        workoutDate: Timestamp.now(),
        loggedExercises: [
          {
            exerciseName: exercise,
            sets: [
              {
                loggedWeight: Number(weight),
                loggedReps: Number(reps),
                rpe: Number(rpe),
              }
            ]
          }
        ]
      };

      await addDoc(collection(db, 'WorkoutLogs'), workoutData);

      // Call PR detection logic
      await checkAndUpdatePRs({
        userId: user.uid,
        exerciseName: exercise,
        sets: workoutData.loggedExercises[0].sets
      });

      setSuccess('✅ Workout logged and PRs updated.');
      setExercise('');
      setWeight('');
      setReps('');
      setRpe('');
    } catch (err: any) {
      setError(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Log a Training Session</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Exercise"
          value={exercise}
          onChange={e => setExercise(e.target.value)}
        /><br />
        <input
          type="number"
          placeholder="Weight"
          value={weight}
          onChange={e => setWeight(e.target.value)}
        /><br />
        <input
          type="number"
          placeholder="Reps"
          value={reps}
          onChange={e => setReps(e.target.value)}
        /><br />
        <input
          type="number"
          placeholder="RPE"
          value={rpe}
          onChange={e => setRpe(e.target.value)}
        /><br />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging...' : 'Log Session'}
        </button>
        {success && <p style={{ color: 'green' }}>{success}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default LogSession;
