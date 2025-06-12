import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const programOptions = [
  'None',
  'Learn to Lift (LTL)',
  'HLM Phase 1',
  'HLM Phase 2',
  'HLM Phase 3',
  'HLM Phase 4',
  'HLM Phase 5',
  'BP Phase 1',
  'BP Phase 2',
  'BP Phase 3',
  'BP Phase 4'
];

const ProgramAssignment = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedPrograms, setSelectedPrograms] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const db = getFirestore();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'UserProfile'));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          email: doc.data().email,
          currentProgram: doc.data().programStatus || 'None'
        }));
        setClients(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchClients();
  }, []);

  const handleAssign = async (clientId: string) => {
    const newProgram = selectedPrograms[clientId];
    if (!newProgram) return;

    try {
      await updateDoc(doc(db, 'UserProfile', clientId), {
        programStatus: newProgram
      });
      setSuccess(`✅ Assigned "${newProgram}" to client.`);
      setError('');
    } catch (err: any) {
      setError(`❌ ${err.message}`);
      setSuccess('');
    }
  };

  return (
    <div>
      <h2>Assign Programs to Clients</h2>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {clients.map((client) => (
        <div key={client.id} style={{ marginBottom: '20px' }}>
          <p><strong>{client.email}</strong> | Current: {client.currentProgram}</p>
          <select
            value={selectedPrograms[client.id] || ''}
            onChange={(e) =>
              setSelectedPrograms({ ...selectedPrograms, [client.id]: e.target.value })
            }
          >
            <option value="">-- Select Program --</option>
            {programOptions.map((program) => (
              <option key={program} value={program}>{program}</option>
            ))}
          </select>
          <button onClick={() => handleAssign(client.id)} style={{ marginLeft: '10px' }}>
            Assign Program
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProgramAssignment;
