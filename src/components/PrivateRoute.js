import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  console.log('PrivateRoute - Current User:', currentUser);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute; 