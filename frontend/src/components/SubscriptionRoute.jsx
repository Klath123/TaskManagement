import React from 'react';
import { Navigate } from "react-router-dom";
import { useAuth } from '../contexts/authContext';

const SubscriptionRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!currentUser) {
    console.log('SubscriptionRoute: No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check subscription status
  const hasActivePlan = currentUser.plan && currentUser.plan.status === "active";
  
  if (!hasActivePlan) {
    console.log('SubscriptionRoute: No active plan found, redirecting to plans');
    console.log('Current user plan:', currentUser.plan);
    return <Navigate to="/plans" replace />;
  }

  console.log('SubscriptionRoute: User has active plan, allowing access');
  return children;
};

export default SubscriptionRoute;