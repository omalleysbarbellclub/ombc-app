import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from './firebase';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const user = auth.currentUser;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
