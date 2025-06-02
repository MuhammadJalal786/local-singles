// frontend/src/components/Feed.jsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Feed({ currentUser }) {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/posts/feed', { withCredentials: true })
      .then(res => setPosts(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="space-y-6">
      {/* You can add a “Composer” here if you want */}
      <div className="bg-white p-4 rounded shadow">
        {/* For now, we’ll skip the composer per your note */}
        <p className="text-gray-500 italic">Write a new post… (coming soon)</p>
      </div>

      {posts.map(post => (
        <div key={post._id} className="bg-white p-4 rounded shadow">
          <div className="flex items-center space-x-3 mb-3">
            <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            <div>
              <p className="font-semibold">{post.authorName || 'Someone'}</p>
              <p className="text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <p className="text-gray-800">{post.content}</p>
        </div>
      ))}
    </div>
  )
}
