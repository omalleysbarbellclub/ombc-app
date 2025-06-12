import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import ProgramAssignment from './ProgramAssignment';

const CoachDashboard = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');

  const db = getFirestore();

  const fetchClients = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'UserProfile'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setClients(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handlePTSessionComplete = async (clientId: string, currentPT: number) => {
    try {
      const newCount = Math.max(currentPT - 1, 0);
      await updateDoc(doc(db, 'UserProfile', clientId), {
        remainingPT: newCount
      });
      setSuccess('✅ PT session marked complete.');
      fetchClients(); // refresh UI
    } catch (err: any) {
      setError(`❌ ${err.message}`);
    }
  };

  return (
    <div>
      <h2>Coach Dashboard</h2>
      {loading && <p>Loading clients...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {clients.length > 0 ? (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Email</th>
              <th>Membership</th>
              <th>Program Assigned</th>
              <th>Remaining PT Sessions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, index) => (
              <tr key={index}>
                <td>{client.email || 'N/A'}</td>
                <td>{client.membershipPlan || 'N/A'}</td>
                <td>{client.programStatus || 'Not Assigned'}</td>
                <td>{client.remainingPT ?? 0}</td>
                <td>
                  <button onClick={() => handlePTSessionComplete(client.id, client.remainingPT ?? 0)}>
                    Complete PT Session
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No clients found.</p>
      )}

      <hr />
      <ProgramAssignment />
    </div>
  );
};

export default CoachDashboard;
