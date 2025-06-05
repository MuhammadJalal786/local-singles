// frontend/src/pages/MyEvents.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Layout from '../components/Layout';
import RequireProfileCompletion from '../components/RequireProfileCompletion';

export default function MyEvents() {
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [user, setUser]         = useState(null);
  const [myEvents, setMyEvents] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        // 1) Fetch current user
        const userRes = await axios.get('http://localhost:5000/api/user/me', {
          withCredentials: true
        });
        const currentUser = userRes.data.user;
        setUser(currentUser);

        // 2) Fetch all events
        const eventsRes = await axios.get('http://localhost:5000/api/events', {
          withCredentials: true
        });
        const allEvents = eventsRes.data;

        // 3) Filter only those where attendee.userId matches currentUser._id
        const filtered = allEvents.filter((evt) => {
          return evt.attendees.some(
            (a) => a.userId.toString() === currentUser._id.toString()
          );
        });
        setMyEvents(filtered);
      } catch (err) {
        console.error('Error fetching My Events:', err);
        setError('Failed to load your events.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="p-6">Loading your events…</div>
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
          <h1 className="text-2xl font-semibold text-gray-800">My Events</h1>
          {myEvents.length === 0 ? (
            <p className="text-gray-600">You haven’t joined any events yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Listing
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {myEvents.map((evt) => {
                    // Find this user's subdoc
                    const attendeeRecord = evt.attendees.find((a) => {
                        const idToCompare = a.userId._id ? a.userId._id : a.userId;
                        return idToCompare.toString() === user._id.toString();
                    });
                    const status = attendeeRecord ? attendeeRecord.status : 'pending';
                    return (
                      <tr key={evt._id}>
                        {/* Listing: thumbnail + title + date + city/zip */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-4">
                            {evt.image ? (
                              <img
                                src={evt.image}
                                alt={evt.title}
                                className="h-16 w-24 object-cover rounded"
                              />
                            ) : (
                              <div className="h-16 w-24 bg-gray-200 rounded" />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {evt.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(evt.date).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}{' '}
                                &middot; {evt.city}, {evt.zip}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {status === 'pending' ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Pending Approval
                            </span>
                          ) : status === 'approved' ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Approved
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Rejected
                            </span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            to={`/events/${evt._id}`}
                            className="px-3 py-1 bg-teal-600 text-white text-sm font-medium rounded hover:bg-teal-700"
                          >
                            View Detail
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Layout>
    </RequireProfileCompletion>
  );
}
