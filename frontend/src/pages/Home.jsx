// src/pages/Home.jsx
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  BellIcon,
  MagnifyingGlassIcon,
  HandThumbUpIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

function AuthPrompt() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-gray-900">LOCAL SINGLES</h1>
          <h2 className="mt-6 text-center text-2xl font-medium text-gray-900">
            Connect with people around you
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in or create an account to continue
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <div>
            <a 
              href="/login"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Sign in to your account
            </a>
          </div>
          
          <div>
            <a 
              href="/signup"
              className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-teal-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Create a new account
            </a>
          </div>
        </div>
        
        <div className="pt-4 text-center">
          <p className="text-sm text-gray-600">
            Join our community and discover local events near you
          </p>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post, onLike }) {
  return (
    <div className="bg-white rounded-lg shadow mb-6 p-4">
      {/* author + timestamp */}
      <div className="flex items-center mb-4">
        <img
          src={post.author.avatar || '/assets/avatar-placeholder.png'}
          alt={post.author.name}
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <div>
          <p className="font-medium">{post.author.name}</p>
          <p className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* content */}
      <div className="mb-4">
        <p className="whitespace-pre-wrap">{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="Post attachment"
            className="mt-4 w-full rounded"
          />
        )}
      </div>

      {/* actions */}
      <div className="flex items-center space-x-6 text-gray-600">
        <button
          onClick={() => onLike(post._id)}
          className="flex items-center hover:text-teal-600"
        >
          <HandThumbUpIcon className="w-5 h-5 mr-1" />
          <span>{post.likes}</span>
        </button>
        <button className="flex items-center hover:text-teal-600">
        <ChatBubbleLeftEllipsisIcon className="w-5 h-5 mr-1" />
          <span>{post.comments.length}</span>
        </button>
      </div>
    </div>
  )
}

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get('/api/auth/me', { withCredentials: true });
        setCurrentUser(data);
      } catch (err) {
        // If error, user is not authenticated
        console.log('User not authenticated:', err.message);
        setCurrentUser(null);
      } finally {
        setAuthChecked(true);
      }
    };
    
    checkAuth();
  }, []);

  // Fetch posts only if user is authenticated
  useEffect(() => {
    if (currentUser) {
      const fetchFeed = async () => {
        try {
          const { data } = await axios.get('/api/posts/feed', { withCredentials: true });
          setPosts(data);
        } catch (err) {
          console.error('Error fetching posts:', err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchFeed();
    } else if (authChecked) {
      // If not authenticated but auth check is complete, stop loading
      setLoading(false);
    }
  }, [currentUser, authChecked]);

  const handleLike = async postId => {
    // optimistic UI
    setPosts(ps => ps.map(p => p._id === postId ? { ...p, likes: p.likes + 1 } : p));
    
    try {
      await axios.post(`/api/posts/${postId}/like`, {}, { withCredentials: true });
    } catch (err) {
      console.error('Error liking post:', err);
      // Revert the optimistic update on error
      setPosts(ps => ps.map(p => p._id === postId ? { ...p, likes: p.likes - 1 } : p));
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-teal-600 text-xl">Loading...</div>
      </div>
    );
  }

  // If not authenticated, show buttons to redirect to login/signup pages
  if (!currentUser) {
    return <AuthPrompt />;
  }

  // If authenticated, show the main application
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* ─── SIDEBAR ────────────────────────────────────── */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold">LOCAL SINGLES</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 text-gray-700">
          <a href="/" className="flex items-center p-2 rounded bg-teal-50 text-teal-600">
            <HomeIcon className="w-5 h-5 mr-2" /> Home
          </a>
          <a href="/events/upcoming" className="flex items-center p-2 rounded hover:bg-gray-100">
            <HomeIcon className="w-5 h-5 mr-2" /> Future Events
          </a>
          <a href="/events/mine" className="flex items-center p-2 rounded hover:bg-gray-100">
            <HomeIcon className="w-5 h-5 mr-2" /> My Events
          </a>
          <a href="/about" className="flex items-center p-2 rounded hover:bg-gray-100">
            <HomeIcon className="w-5 h-5 mr-2" /> About Us
          </a>
        </nav>
        <div className="px-4 py-6 border-t space-y-2">
          <a href="/settings" className="flex items-center p-2 rounded hover:bg-gray-100">
            <Cog6ToothIcon className="w-5 h-5 mr-2" /> Settings
          </a>
          <a href="/logout" className="flex items-center p-2 rounded hover:bg-gray-100">
            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" /> Logout
          </a>
        </div>
      </aside>

      {/* ─── MAIN ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:bg-white focus:outline-none focus:ring"
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <HomeIcon className="w-6 h-6 text-gray-600 hover:text-teal-600 cursor-pointer" />
            <ChatBubbleLeftEllipsisIcon className="w-5 h-5 mr-1" />
          </div>
          <div className="flex items-center space-x-4">
            <BellIcon className="w-6 h-6 text-gray-600 hover:text-teal-600 cursor-pointer" />
            {currentUser && (
              <div className="flex items-center">
                <img
                  src={currentUser.avatar || '/assets/avatar-placeholder.png'}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="ml-2 font-medium">{currentUser.name}</span>
              </div>
            )}
          </div>
        </header>

        {/* FEED */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            {posts.length > 0 ? (
              posts.map(post => (
                <PostCard key={post._id} post={post} onLike={handleLike} />
              ))
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <h3 className="text-xl font-medium mb-2">No posts yet</h3>
                <p className="text-gray-600">
                  Follow some users or create your first post to get started!
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}