import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Logo from '../../assets/Logo.png';
import LoginImage from '../../assets/Login.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      }, { withCredentials: true });
  
      const { message, subscriptionStatus } = res.data;
  
      if (message === "Logged in successfully!") {
        if (subscriptionStatus === 'active' || subscriptionStatus === 'trialing') {
          navigate('/');  // or /home if that's your real landing page
        } else {
          navigate('/payment');  // force them to pay or activate trial
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };
  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="container mx-auto flex flex-col md:flex-row rounded-lg shadow-md overflow-hidden">

        {/* Left Section: Image + Overlay */}
        <div className="hidden md:block md:w-1/2 relative">
          <img
            src={LoginImage}
            alt="Login"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white p-4">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">
              “Lost Something? Let Us Help You Find It!”
            </h2>
          </div>
          <div className="absolute top-4 left-4">
            <button className="bg-white bg-opacity-70 hover:bg-opacity-90 text-black px-4 py-2 rounded-md">
              Back to website
            </button>
          </div>
        </div>

        {/* Right Section: Login Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <div className="flex items-center justify-center mb-4">
            <img src={Logo} alt="Logo" className="w-20 h-20 object-contain" />
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">Log in to your account</h2>
          <p className="text-lg text-gray-600 mb-6">Welcome back</p>

          <form onSubmit={handleLogin}>
            {/* Email Input */}
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

            {/* Password Input */}
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

            {/* Error Message */}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 transition"
            >
              Login
            </button>
          </form>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between mt-4 mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-gray-700">Remember me</span>
            </label>
            <button className="text-sm font-medium text-teal-600">
              Forgot Password?
            </button>
          </div>

          {/* Don’t have an account? Create one */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-700">
              Don’t have an account?{' '}
              <Link to="/signup" className="font-medium text-teal-600">
                Create an account
              </Link>
            </p>
          </div>

          {/* Or Continue with */}
          <div className="mt-6 flex items-center justify-between">
            <hr className="w-full border-gray-300" />
            <span className="mx-2 text-gray-400">Or continue with</span>
            <hr className="w-full border-gray-300" />
          </div>

          {/* Social Logins */}
          <div className="mt-4 flex justify-center space-x-4">
            <button className="flex items-center px-4 py-2 border rounded-md">
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Google
            </button>
            <button className="flex items-center px-4 py-2 border rounded-md">
              <img
                src="https://www.svgrepo.com/show/303128/apple.svg"
                alt="Apple"
                className="w-5 h-5 mr-2"
              />
              Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
