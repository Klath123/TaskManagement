import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const SubscriptionRoute = ({ children }) => {
  const { currentUser } = useAuth();

  // If not logged in, redirect to login
  if (!currentUser) return <Navigate to="/login" />;

  // If user has no plan, redirect to PlanPage
  if (!currentUser.plan || currentUser.plan === 'none') return <Navigate to="/plans" />;

  // Else, allow access
  return children;
};

export default SubscriptionRoute;
