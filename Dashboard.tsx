import React from 'react';
import { useAuth } from './UserContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <h2>Welcome, {user?.email}</h2>
      <button onClick={() => navigate('/log')}>Log Session</button>
      <button onClick={() => navigate('/history')}>View Session History</button>
      <button onClick={() => navigate('/repeat')}>Repeat Last Session</button>
      <button onClick={logout}>Log Out</button>
    </div>
  );
};

export default Dashboard;
