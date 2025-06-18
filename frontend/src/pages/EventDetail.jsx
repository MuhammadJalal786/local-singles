// frontend/src/pages/EventDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Layout from '../components/Layout';
import RequireProfileCompletion from '../components/RequireProfileCompletion';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [evt, setEvt]             = useState(null);
  const [user, setUser]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError]     = useState('');

  // Fetch event + current user on mount
  useEffect(() => {
    // 1) Get user
    axios
      .get('http://localhost:5000/api/user/me', { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        // 2) Then fetch the event by ID
        return axios.get(`http://localhost:5000/api/events/${id}`, { withCredentials: true });
      })
      .then((res) => {
        setEvt(res.data);
      })
      .catch((err) => {
        console.error('Error fetching event or user:', err);
        setError('Failed to load event data.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Helper: check if user has already RSVPed
const hasRSVPed = () => {
  if (!user || !evt) return false;
  return evt.attendees.some((a) => {
    // If a.userId is a populated object, use a.userId._id.
    // Otherwise, use a.userId directly (it’s an ObjectId).
    const idToCompare = a.userId._id ? a.userId._id : a.userId;
    return idToCompare.toString() === user._id.toString();
  });
};

  // Compute slots remaining
  const slotsRemaining = () => {
    if (!evt) return 0;
    return evt.capacity - (evt.attendees?.length || 0);
  };

  // Open confirm‐join modal
  const openModal = () => {
    setModalError('');
    setModalOpen(true);
  };

  // Close modal (unless a request is in progress)
  const closeModal = () => {
    if (modalLoading) return;
    setModalOpen(false);
    setModalError('');
  };

  // Confirm join: POST /api/events/:id/rsvp
  const confirmJoin = async () => {
    setModalLoading(true);
    setModalError('');
    try {
      await axios.post(`http://localhost:5000/api/events/${id}/rsvp`, {}, { withCredentials: true });
         // Update local state: add a proper subdocument { userId, status: 'pending' }
      setEvt((prev) => ({
        ...prev,
        attendees: [
          ...(prev.attendees || []),
          { userId: user._id, status: 'pending' }
        ]
      }));
      closeModal();
    } catch (err) {
      console.error('Error RSVPing:', err);
      setModalError(err.response?.data?.message || 'Join request failed');
    } finally {
      setModalLoading(false);
    }
  };

  // Cancel request: DELETE /api/events/:id/rsvp
 const cancelRequest = async () => {
    try {
      // 1) Tell the backend to remove this user from attendees
      await axios.delete(`http://localhost:5000/api/events/${id}/rsvp`, {
        withCredentials: true
      });

      // 2) Now remove them from local state in whichever form 'userId' currently is:
      setEvt((prev) => ({
        ...prev,
        attendees: prev.attendees.filter((a) => {
          // If 'a.userId' has its own '_id', use that; otherwise it's already a primitive ID
          const idToCompare = a.userId && a.userId._id
            ? a.userId._id
            : a.userId;
          return idToCompare.toString() !== user._id.toString();
        })
      }));
    } catch (err) {
      console.error('Error canceling RSVP:', err);
      alert(err.response?.data?.message || 'Cancel request failed');
    }
  };


  if (loading) {
    return (
      <Layout>
        <div className="p-6">Loading event…</div>
      </Layout>
    );
  }
  if (error || !evt) {
    return (
      <Layout>
        <div className="p-6 text-red-600">{error || 'Event not found'}</div>
      </Layout>
    );
  }

  // Format dates & times
  const startDateStr = new Date(evt.date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const startTimeStr = new Date(evt.date).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });
  const endTimeStr = evt.endTime
    ? new Date(evt.endTime).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      })
    : null;

  return (
    <RequireProfileCompletion>
      <Layout>
        <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
          {/* ─────── Hero & Title Section ─────── */}
          <div className="relative">
            {evt.image && (
              <img
                src={evt.image}
                alt={evt.title}
                className="w-full h-96 object-cover rounded-lg shadow"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg" />
            <div className="absolute bottom-6 left-6 text-white space-y-1">
              <h1 className="text-3xl font-semibold">{evt.title}</h1>
              {/* show full address instead of city/zip */}
              <p className="text-lg">
                {evt.address} &middot; {startDateStr}
              </p>
            </div>
            {/* Join / Cancel button at top-right of hero */}
            <div className="absolute top-6 right-6">
              {hasRSVPed() ? (
                <button
                  onClick={cancelRequest}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Cancel Request
                </button>
              ) : user.subscriptionStatus !== 'active' ? (
                <button
                  disabled
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded cursor-not-allowed"
                  title="Only active members can join"
                >
                  Join
                </button>
              ) : (
                <button
                  onClick={openModal}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                  Join
                </button>
              )}
            </div>
          </div>

          {/* ─────── Description ─────── */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Description</h2>
            <p className="text-gray-700">{evt.description}</p>
          </section>

          {/* ─────── Event Details Table ─────── */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Event Details</h2>
            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Address */}
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-700">Address</td>
                    <td className="px-6 py-4 text-gray-900">{evt.address}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-700">ID</td>
                    <td className="px-6 py-4 text-gray-900">{evt._id}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-700">Price</td>
                    <td className="px-6 py-4 text-gray-900">${evt.price.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-700">Start Time</td>
                    <td className="px-6 py-4 text-gray-900">{startTimeStr}</td>
                  </tr>
                  {endTimeStr && (
                    <tr>
                      <td className="px-6 py-4 font-medium text-gray-700">End Time</td>
                      <td className="px-6 py-4 text-gray-900">{endTimeStr}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-700">Type</td>
                    <td className="px-6 py-4 text-gray-900">{evt.type}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-700">Couple Allowed</td>
                    <td className="px-6 py-4 text-gray-900">
                      {evt.coupleAllowed ? 'Yes' : 'No'}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-700">Capacity</td>
                    <td className="px-6 py-4 text-gray-900">{evt.capacity}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-700">Slots Remaining</td>
                    <td className="px-6 py-4 text-gray-900">{slotsRemaining()} / {evt.capacity}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-700">Discount</td>
                    <td className="px-6 py-4 text-gray-900">{evt.discount}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ─────── Map Embed ─────── */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Map Location</h2>
            <div className="w-full h-64 border rounded-lg overflow-hidden shadow-sm">
              <iframe
                title="Event Location"
                width="100%"
                height="100%"
                frameBorder="0"
                loading="lazy"
                src={
                  // point the map at the full address
                  `https://maps.google.com/maps?q=${
                    encodeURIComponent(evt.address)
                  }&t=&z=15&output=embed`
                }
              />
            </div>
          </section>
        </div>

        {/* ─────── Join Confirmation Modal ─────── */}
        {modalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-lg max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4">Confirm Join</h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to join this event? Your request will be sent to the admin for approval.
              </p>
              {modalError && (
                <div className="text-red-600 mb-4">{modalError}</div>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeModal}
                  disabled={modalLoading}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmJoin}
                  disabled={modalLoading}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                  {modalLoading ? 'Joining…' : 'Confirm Join'}
                </button>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </RequireProfileCompletion>
  );
}
