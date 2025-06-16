// frontend/src/pages/Messages.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import axios  from 'axios';

export default function Messages() {
  const [threads, setThreads] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/messages')
      .then(res => setThreads(res.data))
      .catch(console.error);
  }, []);

  return (
    <Layout>
      <div className="flex h-full">
        {/* Thread List */}
        <div className="w-1/3 border-r overflow-y-auto">
          {threads.length === 0 ? (
            <p className="p-4 text-gray-500">No conversations yet.</p>
          ) : (
            threads.map(t => (
              <div
                key={t.userId}
                className="flex items-center p-4 cursor-pointer hover:bg-gray-100"
                onClick={() => navigate(`/messages/${t.userId}`)}
              >
                <img
                  src={t.avatar}
                  alt=""
                  className="h-10 w-10 rounded-full mr-3"
                />
                <div className="flex-1">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-sm text-gray-500 truncate">
                    {t.lastMessage}
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(t.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty Placeholder */}
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">
            Select a conversation to start chatting
          </p>
        </div>
      </div>
    </Layout>
  );
}
