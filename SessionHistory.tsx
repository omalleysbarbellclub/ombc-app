import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './UserContext';

type Session = {
  id: string;
  lift: string;
  weight: number;
  reps: number;
  rpe: number;
  createdAt: any;
};

const SessionHistory: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [prs, setPRs] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) return;

      const q = query(
        collection(db, 'sessions'),
        where('uid', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const fetched: Session[] = [];
      const prMap: Record<string, number> = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const estimated1RM = data.weight * (1 + data.reps / 30);
        if (!prMap[data.lift] || estimated1RM > prMap[data.lift]) {
          prMap[data.lift] = estimated1RM;
        }
        fetched.push({
          id: doc.id,
          lift: data.lift,
          weight: data.weight,
          reps: data.reps,
          rpe: data.rpe,
          createdAt: data.createdAt?.toDate(),
        });
      });

      setSessions(fetched);
      setPRs(prMap);
    };

    fetchSessions();
  }, [user]);

  return (
    <div>
      <h2>Session History</h2>
      {sessions.map((session) => {
        const estimated1RM = session.weight * (1 + session.reps / 30);
        const isPR = estimated1RM >= prs[session.lift];
        return (
          <div key={session.id} style={{ marginBottom: '10px' }}>
            <strong>{session.lift}</strong>: {session.weight}kg × {session.reps} @ RPE {session.rpe}
            {isPR && <span style={{ color: 'green', marginLeft: '10px' }}>🔥 New PR!</span>}
            <br />
            <small>{session.createdAt?.toLocaleString()}</small>
          </div>
        );
      })}
    </div>
  );
};

export default SessionHistory;
