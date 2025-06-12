import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore';

interface Client {
  id: string;
  email: string;
  program: string;
  ptSessions: number;
}

const CoachDashboard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string>('');

  useEffect(() => {
    const fetchClients = async () => {
      const snapshot = await getDocs(collection(db, 'clients'));
      const data: Client[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        data.push({
          id: docSnap.id,
          email: d.email,
          program: d.program || '',
          ptSessions: d.ptSessions || 0,
        });
      });
      setClients(data);
    };

    fetchClients();
  }, []);

  const assignProgram = async (clientId: string) => {
    if (!selectedProgram) return;
    const ref = doc(db, 'clients', clientId);
    await updateDoc(ref, { program: selectedProgram });
    alert('Program assigned!');
  };

  const markPTSession = async (clientId: string) => {
    const ref = doc(db, 'clients', clientId);
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;
    const newCount = Math.max(0, client.ptSessions - 1);
    await updateDoc(ref, { ptSessions: newCount });
    alert('PT session checked off!');
  };

  return (
    <div>
      <h2>Coach Dashboard</h2>
      <label>
        Program to assign:
        <input
          value={selectedProgram}
          onChange={(e) => setSelectedProgram(e.target.value)}
          placeholder="e.g. LTL or HLM P3"
        />
      </label>
      {clients.map((client) => (
        <div key={client.id} style={{ border: '1px solid #ccc', padding: '8px', marginTop: '10px' }}>
          <p><strong>{client.email}</strong></p>
          <p>Program: {client.program || 'None'}</p>
          <p>PT Sessions Left: {client.ptSessions}</p>
          <button onClick={() => assignProgram(client.id)}>Assign Program</button>
          <button onClick={() => markPTSession(client.id)}>Check Off PT Session</button>
        </div>
      ))}
    </div>
  );
};

export default CoachDashboard;
