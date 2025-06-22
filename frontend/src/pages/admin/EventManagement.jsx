// frontend/src/pages/admin/EventManagement.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import api from "../../api";

export default function EventManagement() {
  const [events, setEvents]       = useState([]);
  const [search, setSearch]       = useState('');
  const [showPast, setShowPast]   = useState(false);
  const [page, setPage]           = useState(1);
  const [hasMore, setHasMore]     = useState(true);
  const [loading, setLoading]     = useState(false);
  const [announceEv, setAnnounceEv]     = useState(null);
  const [announceText, setAnnounceText] = useState('');
  const observer = useRef();
  const navigate = useNavigate();

  // Fetch page of events
  const fetchEvents = async (p = 1, append = false) => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/events', {
        params: {
          search,
          past: showPast,
          page: p,
          limit: 20
        }
      });
      const { events: data, totalPages } = res.data;
      setEvents(prev => append ? [...prev, ...data] : data);
      setHasMore(p < totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Reload on filters
  useEffect(() => {
    setPage(1);
    fetchEvents(1, false);
  }, [search, showPast]);

  // Infinite scroll sentinel
  const lastRowRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchEvents(page + 1, true);
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, page]);

  // Delete
  const deleteEvent = async id => {
    if (!window.confirm('Delete this event?')) return;
    await api.delete(`/api/admin/events/${id}`);
    setEvents(ev => ev.filter(e => e.eventId !== id));
  };

  // Send announcement
  const sendAnnounce = async () => {
    const res = await api.post(`/api/admin/events/${announceEv}/announce`, {
      text: announceText
    });
    alert(`Sent to ${res.data.sentCount} users`);
    setAnnounceEv(null);
    setAnnounceText('');
  };

  return (
    
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Event Management</h1>
          <Link
            to="/admin/events/new"
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            New Event
          </Link>
        </div>

        {/* Search & Past Toggle */}
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search by title"
            className="border rounded px-3 py-2 flex-1"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <label className="flex items-center space-x-1">
            <input
              type="checkbox"
              checked={showPast}
              onChange={e => setShowPast(e.target.checked)}
            />
            <span>Show Past</span>
          </label>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-50 text-left">
                {['Title','Date','Location','Attendees','Status','Actions'].map(col => (
                  <th key={col} className="px-4 py-2 border-b">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map((e, i) => (
                <tr
                  key={e.eventId}
                  ref={i === events.length - 1 ? lastRowRef : null}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-2">{e.title}</td>
                  <td className="px-4 py-2">
                    {new Date(e.date).toLocaleDateString()} {e.startTime}
                  </td>
                  <td className="px-4 py-2">{e.address}</td>
                  <td className="px-4 py-2">
                    {e.attendeeCount}
                    {e.pendingCount > 0 && ` (+${e.pendingCount} pending)`}
                  </td>
                  <td className="px-4 py-2">{e.status}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => navigate(`/admin/events/${e.eventId}/edit`)}
                      className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteEvent(e.eventId)}
                      className="px-2 py-1 bg-red-100 text-red-600 rounded text-sm"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => navigate(`/admin/events/${e.eventId}/edit?tab=attendees`)}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                    >
                      RSVPs
                    </button>
                    <button
                      onClick={() => setAnnounceEv(e.eventId)}
                      className="px-2 py-1 bg-teal-100 text-teal-600 rounded text-sm"
                    >
                      Announce
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <p className="p-4 text-center">Loading…</p>}
        </div>

        {/* Announce Modal */}
        {announceEv && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-1/2 space-y-4">
              <h2 className="text-xl font-semibold">Announce Event</h2>
              <textarea
                rows="4"
                className="w-full border rounded px-2 py-1"
                placeholder="Your announcement…"
                value={announceText}
                onChange={e => setAnnounceText(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setAnnounceEv(null)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={sendAnnounce}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    
  );
}
