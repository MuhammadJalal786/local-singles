// frontend/src/pages/Home.jsx
import React, { useState, useEffect } from 'react'
import api from '../api'
import AuthPrompt from '../components/Authprompt' // your prompt component
import Feed from '../components/Feed'               // the “logged-in” home/feed
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [user, setUser]       = useState(null)    // null = not yet checked, false = not logged in, object = logged in data

  useEffect(() => {
    // Ask the server “who am I?” — if 200, save user, if 401, mark as not logged in
    api
      .get('/api/auth/me', { withCredentials: true })
      .then(res => {
        setUser(res.data)    // e.g. { _id, email, firstName, subscriptionStatus, … }
      })
      .catch(err => {
        // 401 or any error → user is not signed in
        setUser(false)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {/* You could show a spinner here */}
        <p>Loading…</p>
      </div>
    )
  }

  // If the user is explicitly “not logged in,” show the prompt:
  if (user === false) {
    return <AuthPrompt />
  }

  // Otherwise (user is an object), render the normal layout + feed:
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar is always visible to a signed-in user */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Top header (search, messages, profile, notification) */}
        <Header user={user} />

        {/* Main content area: the feed of posts */}
        <main className="flex-1 overflow-y-auto p-4">
          <Feed currentUser={user} />
        </main>
      </div>
    </div>
  )
}
