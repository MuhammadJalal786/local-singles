// frontend/src/pages/settings/HelpSupport.jsx
import React, { useState } from 'react';
import api from '../../api';
import SettingsLayout from '../../components/SettingsLayout';
import Layout from '../../components/Layout';

export default function HelpSupport() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!subject || !message) {
      setError('Please fill out both subject and message.');
      return;
    }

    try {
      setLoading(true);
      await api.post(
        '/api/support',
        { subject, message },
        { withCredentials: true }
      );
      setSuccess('Your message has been sent. We will get back to you soon.');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error('Error sending support request:', err);
      setError('Could not send your message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
    <SettingsLayout title="Settings" breadcrumb="Help and Support">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
        >
          {loading ? 'Sending…' : 'Submit'}
        </button>
      </form>
    </SettingsLayout>
    </Layout>
  );
}
