// frontend/src/pages/Events.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

import Layout from '../components/Layout';
import RequireProfileCompletion from '../components/RequireProfileCompletion';

export default function Events() {
  const [events, setEvents]   = useState([]);
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    // 1) Fetch current user (to check subscriptionStatus)
    api
      .get('/api/auth/me')
      .then((res) => {
        setUser(res.data);
        // 2) Fetch all upcoming events
        return api.get('/api/events');
      })
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => {
        console.error('Error fetching user or events:', err);
        setError('Failed to load events. Please try again.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="p-6">Loading events…</div>
      </Layout>
    );
  }
  if (error) {
    return (
      <Layout>
        <div className="p-6 text-red-600">{error}</div>
      </Layout>
    );
  }

  return (
    <RequireProfileCompletion>
      <Layout>
        <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Upcoming Events
          </h1>

          {events.length === 0 ? (
            <p className="text-gray-600">No upcoming events found.</p>
          ) : (
            // Each event card spans full width of the container
            <div className="space-y-8">
              {events.map((evt) => (
                <div
                  key={evt._id}
                  className="border rounded-lg overflow-hidden shadow-sm bg-white"
                >
                  {/* Event Image */}
                  {evt.image && (
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="h-64 w-full object-cover"
                    />
                  )}

                  <div className="p-6 space-y-4">
                    {/* Title */}
                    <h2 className="text-2xl font-semibold">{evt.title}</h2>

                    {/* Date */}
                    <p className="text-gray-600">
                      {new Date(evt.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>

                    {/* Address (City, ZIP) */}
                    <p className="text-gray-600">
                      {evt.city}, {evt.zip}
                    </p>

                    {/* Slots Remaining */}
                    <p className="text-gray-700">
                      Slots remaining: {evt.capacity - (evt.attendees?.length || 0)} / {evt.capacity}
                    </p>

                    {/* Show Details button (full-width on smaller screens, fixed width on large) */}
                    <div className="flex justify-end">
                      <Link
                        to={`/events/${evt._id}`}
                        className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                      >
                        Show Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </RequireProfileCompletion>
  );
}
