// src/components/AuthPrompt.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthPrompt() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-gray-900">
            Welcome To <span className="text-teal-600">Local Singles</span>
          </h1>
          <h2 className="mt-6 text-center text-2xl font-medium text-gray-900">
            Your gateway to unforgettable local events! Join the community, discover amazing happenings near you, or host your own. Sign in to explore, connect, and experience more.
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in or create an account to continue
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <div>
            <Link
              to="/login"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
            >
              Sign in to your account
            </Link>
          </div>

          <div>
            <Link
              to="/signup"
              className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-teal-700 bg-white hover:bg-gray-50"
            >
              Create a new account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
