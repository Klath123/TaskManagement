// src/pages/PaymentSuccess.jsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the reference query parameter
  const queryParams = new URLSearchParams(location.search);
  const reference = queryParams.get('reference');

  useEffect(() => {
    if (reference) {
      toast.success(`Payment successful! Reference: ${reference}`);
    } else {
      toast.error('Payment reference not found!');
    }

    // Redirect to home/dashboard after 5 seconds
    const timer = setTimeout(() => {
      navigate('/'); // Change this to '/dashboard' if you want
    }, 5000);

    return () => clearTimeout(timer);
  }, [reference, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-6">
      <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
      {reference && (
        <p className="text-lg text-gray-700 mb-6">
          Your payment reference number is: <strong>{reference}</strong>
        </p>
      )}
      <p className="text-gray-600">
        You will be redirected shortly...
      </p>
    </div>
  );
};

export default PaymentSuccess;
