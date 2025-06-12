import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import LogSession from './LogSession';
import RepeatLastSession from './RepeatLastSession';
import SessionHistory from './SessionHistory';
import PrivateRoute from './PrivateRoute';
import CoachDashboard from './CoachDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/log-session" element={
          <PrivateRoute><LogSession /></PrivateRoute>
        } />
        <Route path="/repeat-session" element={
          <PrivateRoute><RepeatLastSession /></PrivateRoute>
        } />
        <Route path="/session-history" element={
          <PrivateRoute><SessionHistory /></PrivateRoute>
        } />
        <Route path="/coach-dashboard" element={
          <PrivateRoute><CoachDashboard /></PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
