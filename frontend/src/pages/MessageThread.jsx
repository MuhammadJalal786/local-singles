// frontend/src/pages/MessageThread.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import api  from '../api';

export default function MessageThread() {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [me, setMe]     = useState(null);
  const pollRef = useRef();

  // get current user
  useEffect(() => {
    api.get('/auth/me').then(res => setMe(res.data));
  }, []);

  // fetch & poll
  const fetchMessages = () => {
    api.get(`/messages/${userId}`)
      .then(res => setMessages(res.data))
      .catch(console.error);
  };
  useEffect(() => {
    if (!userId) return;
    fetchMessages();
    pollRef.current = setInterval(fetchMessages, 5000);
    return () => clearInterval(pollRef.current);
  }, [userId]);

  // send
  const sendMessage = async () => {
    if (!text.trim()) return;
    await api.post(`/messages/${userId}`, { text });
    setText('');
    fetchMessages();
  };

  return (
    <Layout>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => {
            const isMine = me && msg.from === me._id;
            return (
              <div
                key={msg._id}
                className={`max-w-xs p-2 rounded ${
                  isMine
                    ? 'bg-blue-100 self-end ml-auto'
                    : 'bg-gray-100 self-start mr-auto'
                }`}
              >
                <p>{msg.text}</p>
                <span className="text-xs text-gray-400">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </span>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t flex">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            className="flex-1 border rounded p-2 mr-2"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Send
          </button>
        </div>
      </div>
    </Layout>
  );
}
