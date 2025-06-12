import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './UserContext';
import { useNavigate } from 'react-router-dom';

const LogSession: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [lift, setLift] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [rpe, setRPE] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await addDoc(collection(db, 'sessions'), {
      uid: user.uid,
      lift,
      weight: Number(weight),
      reps: Number(reps),
      rpe: Number(rpe),
      createdAt: serverTimestamp(),
    });

    setLift('');
    setWeight('');
    setReps('');
    setRPE('');
    navigate('/dashboard');
  };

  return (
    <div>
      <h2>Log Session</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Lift"
          value={lift}
          onChange={(e) => setLift(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Reps"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="RPE"
          value={rpe}
          onChange={(e) => setRPE(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default LogSession;
