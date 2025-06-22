// src/components/PostComposer.jsx
import React, { useState } from 'react';
import api from '../api';

export default function PostComposer({ onNewPost }) {
  const [content, setContent]   = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const { data: createdPost } = await api.post(
        '/api/posts',
        { content: content.trim() },
        { withCredentials: true }
      );
      onNewPost(createdPost);
      setContent('');
    } catch (err) {
      console.error('Post creation failed:', err);
      alert(err.response?.data?.message || 'Could not create post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-2 mb-6"
    >
      <textarea
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
        placeholder="What’s on your mind?"
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={submitting}
      />
      <button
        type="submit"
        disabled={submitting || !content.trim()}
        className={`self-end px-4 py-2 rounded-md font-medium text-white ${
          submitting || !content.trim()
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-teal-600 hover:bg-teal-700'
        }`}
      >
        {submitting ? 'Posting…' : 'Post'}
      </button>
    </form>
  );
}
