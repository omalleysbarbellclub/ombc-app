import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import CoachDashboard from './CoachDashboard';
import LogSession from './LogSession';
import SessionHistory from './SessionHistory';
import RepeatSession from './RepeatLastSession';
import { useAuth } from './UserContext';

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/coach-dashboard" element={user ? <CoachDashboard /> : <Navigate to="/" />} />
        <Route path="/log" element={user ? <LogSession /> : <Navigate to="/" />} />
        <Route path="/history" element={user ? <SessionHistory /> : <Navigate to="/" />} />
        <Route path="/repeat" element={user ? <RepeatSession /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
