import React from 'react';
import { Link } from 'react-router-dom';
import PRDetection from './PRDetection';
import MembershipPlan from './MembershipPlan';

const Dashboard = () => {
  return (
    <div>
      <h2>Client Dashboard</h2>
      <p>Welcome to your training dashboard.</p>
      <Link to="/log-session">
        <button>Start Next Session</button>
      </Link><br /><br />
      <Link to="/repeat-session">
        <button>Repeat Last Session</button>
      </Link><br /><br />
      <Link to="/session-history">
        <button>View Session History</button>
      </Link>

      <hr />
      <PRDetection />
      <hr />
      <MembershipPlan />
    </div>
  );
};

export default Dashboard;
