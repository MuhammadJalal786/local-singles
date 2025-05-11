import React from 'react';
import { Link } from 'react-router-dom';

const Success = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
      <h1 className="text-3xl font-bold mb-4">Thank you for subscribing!</h1>
      <p className="mb-6">Your subscription is now active. You can access all member features.</p>
      <Link to="/home" className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700">
        Go to Dashboard
      </Link>
    </div>
  </div>
);

export default Success;
