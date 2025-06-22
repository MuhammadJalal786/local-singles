// frontend/src/pages/Success.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function Success() {
  const [status, setStatus]     = useState('Processing subscription…');
  const [searchParams]          = useSearchParams();
  const navigate                = useNavigate();

  useEffect(() => {
    // 1️⃣ Get the session_id from the query string
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setStatus('No session ID found.');
      return;
    }

    // 2️⃣ Confirm the session on the backend
    api
      .post(
        '/api/payment/confirm',
        { sessionId },
        { withCredentials: true }
      )
      .then((res) => {
        console.log('Confirm response:', res.data);
        setStatus('Subscription activated! Redirecting…');

        // 3️⃣ Let the user see the success message for a sec then go to pricing
        setTimeout(() => {
          navigate('/settings/pricing');
        }, 1500);
      })
      .catch((err) => {
        console.error('Error confirming subscription:', err);
        setStatus(
          err.response?.data?.message ||
            'Failed to confirm subscription. Please contact support.'
        );
      });
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Payment Successful</h1>
        <p className="text-gray-700">{status}</p>
      </div>
    </div>
  );
}
