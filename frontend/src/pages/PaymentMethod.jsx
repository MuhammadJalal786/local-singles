// src/pages/PaymentMethod.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginImage from '../../assets/Payment.jpeg';

const PaymentMethod = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('card');
  const [agreed, setAgreed]     = useState(false);

  // Redirect if already subscribed/trialing
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/auth/me', { withCredentials: true })
      .then(res => {
        const { subscriptionStatus } = res.data;

        // 1) If trial expired, send them to payment
        if (subscriptionStatus === 'expired') {
          navigate('/payment?message=expired');
          return;
        }

        // 2) If already active or still in trial, go home
        if (subscriptionStatus === 'active' || subscriptionStatus === 'trialing') {
          navigate('/');
          return;
        }
        // otherwise (inactive), stay on /payment
      })
       .catch(err => {
         console.log('GET /api/auth/me error →', err.response?.status);
         navigate('/login');
      });
  }, [navigate]);

  const startTrial = async () => {
    if (!agreed) {
      alert('Please agree to the Terms & Conditions before continuing.');
      return;
    }
    try {
      await axios.post(
        'http://localhost:5000/api/payment/trial',
        {},
        { withCredentials: true }
      );
      navigate('/');
    } catch {
      navigate('/login');
    }
  };

  const handleContinue = async () => {
    if (!agreed) {
      alert('Please agree to the Terms & Conditions before continuing.');
      return;
    }
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/payment/create-checkout-session',
        { mode: 'subscription' }, // always card
        { withCredentials: true }
      );
      window.location.href = data.url;
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
      else alert(err.response?.data?.message || 'Could not start checkout');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left: Image (hidden on mobile) */}
      <div className="hidden md:block md:w-1/2 relative h-full">
        <img
          src={LoginImage}
          alt="Decorative"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Right: Form */}
      <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center h-full">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col">
          <h1 className="font-bold text-4xl text-gray-800 mb-6">Payment Method</h1>

          <button
            onClick={startTrial}
            className="mb-4 w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
          >
            Start 14-Day Free Trial
          </button>

          <button
            onClick={handleContinue}
            className="mb-6 w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition"
          >
            Continue to Payment
          </button>

          <div className="text-center text-sm text-gray-500 mb-4">
            Choose your payment option:
          </div>

          {/* Only Credit / Debit Card */}
          <div
            onClick={() => setSelected('card')}
            className={`flex items-center p-4 mb-6 border rounded-lg cursor-pointer ${
              selected === 'card'
                ? 'border-teal-600 bg-teal-50'
                : 'border-gray-300 bg-white'
            }`}
          >
            <div className="w-6 h-6 bg-gray-400 rounded-full mr-4" />
            <div className="flex-1 text-gray-800">Credit / Debit Card</div>
            <input
              type="radio"
              name="payment"
              checked={selected === 'card'}
              readOnly
              className="w-5 h-5 text-teal-600"
            />
          </div>

          {/* Terms & Conditions */}
          <label className="flex items-center mt-auto">
            <input
              type="checkbox"
              className="mr-2"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
            />
            <span className="text-gray-700 text-sm">
              I agree to the{' '}
              <a
                href="/terms"
                className="text-teal-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms & Conditions
              </a>
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
