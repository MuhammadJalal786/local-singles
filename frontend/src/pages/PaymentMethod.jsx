// src/pages/PaymentMethod.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginImage from '../../assets/Login.png';

const PaymentMethod = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('card');
  const [agreed, setAgreed]     = useState(false);

  // Redirect based on auth/trial/subscription status
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/auth/me', { withCredentials: true })
      .then(res => {
        console.log('GET /api/auth/me →', res.data);
        const { subscriptionStatus } = res.data;
        if (subscriptionStatus === 'active' || subscriptionStatus === 'trialing') {
          navigate('/');
        }
        // otherwise stay on /payment
      })
      .catch(err => {
        console.log('GET /api/auth/me error →', err.response?.status);
        navigate('/login');
      });
  }, [navigate]);

  // 14-day trial endpoint
  const startTrial = async () => {
    if (!agreed) {
      return alert('Please agree to the Terms & Conditions before continuing.');
    }
    try {
      await axios.post(
        'http://localhost:5000/api/payment/trial',
        {},
        { withCredentials: true }
      );
      navigate('/');
    } catch (err) {
      console.error('Trial error:', err);
      navigate('/login');
    }
  };

  // Stripe checkout session
  const handleContinue = async () => {
    if (!agreed) {
      return alert('Please agree to the Terms & Conditions before continuing.');
    }
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/payment/create-checkout-session',
        { mode: selected === 'card' ? 'subscription' : selected },
        { withCredentials: true }
      );
      // Redirect browser to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      console.error('Checkout error:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        alert(err.response?.data?.message || 'Could not start checkout');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden w-full max-w-6xl">
        {/* Left: Image */}
        <div className="relative md:w-1/2 h-64 md:h-auto">
          <img
            src={LoginImage}
            alt="Overlay"
            className="w-full h-full object-cover"
          />
          <Link
            to="/"
            className="absolute top-4 left-4 bg-white/70 hover:bg-white/90 text-black px-4 py-2 rounded-md text-sm font-medium"
          >
            Back to website
          </Link>
        </div>

        {/* Right: Options */}
        <div className="md:w-1/2 p-8 flex flex-col">
          <h1 className="font-bold text-4xl text-gray-800 mb-4">
            Payment Method
          </h1>

          {/* Trial button */}
          <button
            onClick={startTrial}
            className="mb-6 w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
          >
            Start 14-Day Free Trial
          </button>

          {/* Continue to Stripe */}
          <button
            onClick={handleContinue}
            className="mb-6 w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition"
          >
            Continue to Payment
          </button>

          <div className="text-center text-sm text-gray-500 mt-4">
            Or choose a different option below:
          </div>

          {['paypal', 'apple', 'card'].map(method => (
            <div
              key={method}
              onClick={() => setSelected(method)}
              className={`flex items-center p-4 mb-4 border rounded-lg cursor-pointer ${
                selected === method
                  ? 'border-teal-600 bg-teal-50'
                  : 'border-gray-300 bg-white'
              }`}
            >
              <div className="w-6 h-6 bg-gray-400 rounded-full mr-4" />
              <div className="flex-1 text-gray-800 capitalize">
                {method === 'card'
                  ? 'Credit / Debit Card'
                  : `${method.charAt(0).toUpperCase() + method.slice(1)} Pay`}
              </div>
              <input
                type="radio"
                name="payment"
                checked={selected === method}
                readOnly
                className="w-5 h-5 text-teal-600"
              />
            </div>
          ))}

          {/* Terms & Conditions Checkbox */}
          <label className="flex items-center mt-auto">
            <input
              type="checkbox"
              className="mr-2"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
            />
            <span className="text-gray-700 text-sm">
              I agree to the{' '}
              <Link to="/terms" className="text-teal-600 hover:underline">
                Terms & Conditions
              </Link>
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
