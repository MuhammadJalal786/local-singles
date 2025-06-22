// frontend/src/pages/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api  from '../api';

export default function UserProfile() {
  const { userId }   = useParams();
  const navigate     = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    api
      .get(`/api/users/${userId}`)
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Loading profile…</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto p-6">
        {/* Avatar */}
        <div className="flex justify-center">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-32 w-32 rounded-full object-cover"
          />
        </div>

        {/* Name */}
        <h1 className="mt-4 text-2xl font-semibold text-center">
          {user.name}
        </h1>

        {/* Bio */}
        {user.bio && (
          <p className="mt-2 text-center text-gray-700">
            {user.bio}
          </p>
        )}

        {/* Occupation & Location */}
        <div className="mt-4 space-y-1 text-center text-gray-600">
          {user.occupation && <div>💼 {user.occupation}</div>}
          {user.location   && <div>📍 {user.location}</div>}
        </div>

        {/* Interests */}
        {user.interests && (
          <p className="mt-4 text-center text-gray-600">
            <span className="font-medium">Interests:</span>{' '}
            {Array.isArray(user.interests)
              ? user.interests.join(', ')
              : user.interests}
          </p>
        )}

        {/* Message button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate(`/messages/${userId}`)}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Message
          </button>
        </div>
      </div>
    </Layout>
  );
}
