import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

import Logo from '../../assets/Logo.png';
import LoginImage from '../../assets/Login.png';

const Login = () => {
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate               = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post(
        '/api/auth/login',
        { email, password },
        { withCredentials: true }
      );
      const { message, subscriptionStatus } = res.data;
      if (message === 'Logged in successfully!') {
        if (['active','trialing'].includes(subscriptionStatus)) {
          navigate('/');
        } else {
          navigate('/payment');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section: Image + Overlay (hidden on mobile) */}
      <div className="hidden md:block md:w-1/2 relative h-full">
        <img
          src={LoginImage}
          alt="Login"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white p-4">
          <h2 className="text-2xl md:text-3xl font-semibold mb-2">
            “Lost Something? Let Us Help You Find It!”
          </h2>
        </div>
      </div>

      {/* Right Section: Login Form */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center h-full">
        <div className="w-full max-w-md p-8 flex flex-col justify-center">
          <div className="flex items-center justify-center mb-4">
            <img src={Logo} alt="Logo" className="w-20 h-20 object-contain" />
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Log in to your account
          </h2>
          <p className="text-lg text-gray-600 mb-6">Welcome back</p>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-teal-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-teal-500"
                required
              />
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <button
              type="submit"
              className="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 transition"
            >
              Login
            </button>
          </form>

          <div className="flex items-center justify-between mt-4 mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-gray-700">Remember me</span>
            </label>
            <button className="text-sm font-medium text-teal-600">
              Forgot Password?
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-700">
              Don’t have an account?{' '}
              <Link to="/signup" className="font-medium text-teal-600">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
