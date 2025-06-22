import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BellIcon } from '@heroicons/react/24/outline';     
import { Link } from 'react-router-dom';

export default function NotificationBell() {
  const [notes, setNotes]         = useState([]);
  const [unreadCount, setUnread]  = useState(0);
  const [open, setOpen]           = useState(false);
  const pollingRef                = useRef(null);

  // Fetch & update unread count
  const fetchNotes = async () => {
    try {
      const { data } = await axios.get('/api/notifications', { withCredentials: true });
      setNotes(data);
      setUnread(data.filter(n => !n.read).length);
    } catch (err) {
      console.error('Fetch notifications error:', err);
    }
  };

  useEffect(() => {
    fetchNotes();
    pollingRef.current = setInterval(fetchNotes, 30000); // every 30s
    return () => clearInterval(pollingRef.current);
  }, []);

  const toggleDropdown = async () => {
    const nextOpen = !open;
    setOpen(nextOpen);

    if (nextOpen && unreadCount > 0) {
      // Mark all read on open
      try {
        await axios.post('/api/notifications/mark-all-read', {}, { withCredentials: true });
        setUnread(0);
        setNotes(prev => prev.map(n => ({ ...n, read: true })));
      } catch (err) {
        console.error('Error marking all read:', err);
      }
    }
  };

  return (
    <div className="relative">
      {/* Bell icon with badge */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 rounded-full hover:bg-gray-200"
      >
        <BellIcon className="h-6 w-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="max-h-64 overflow-y-auto">
            {notes.length === 0 && (
              <p className="p-4 text-gray-500 text-sm">No notifications.</p>
            )}
            {notes.map(n => (
              <Link
                key={n._id}
                to={n.link}
                className="flex justify-between items-start px-4 py-2 hover:bg-gray-100"
                onClick={() => axios.post(`/api/notifications/${n._id}/mark-read`, {}, { withCredentials: true })}
              >
                <span className="text-sm text-gray-800">{n.message}</span>
                <span className="text-xs text-gray-500">
                  {new Date(n.createdAt).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-200">
            <button
              onClick={() => setOpen(false)}
              className="w-full text-sm text-center text-blue-600 py-2 hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
