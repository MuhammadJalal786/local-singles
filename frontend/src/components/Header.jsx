// frontend/src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  HomeIcon,
  ChatBubbleLeftIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import NotificationBell from './NotificationBell';

export default function Header() {
  const [query, setQuery]         = useState('');
  const [results, setResults]     = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate                  = useNavigate();
  const inputRef                  = useRef();

  // Debounced search effect
  useEffect(() => {
    if (query.length < 4) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    const handle = setTimeout(async () => {
      try {
        const res = await fetch(`/api/users?search=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
      }
    }, 300);
    return () => clearTimeout(handle);
  }, [query]);

  // Close dropdown on blur (with slight delay to allow click)
  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 100);
  };

  // Select a user from results
  const selectUser = (userId) => {
    setQuery('');
    setResults([]);
    setShowDropdown(false);
    navigate(`/users/${userId}`);
  };

  return (
    <header className="w-full bg-white border-b px-6 py-3 flex items-center justify-between">
      {/* Search input */}
      <div className="relative w-1/3">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => query.length >= 4 && setShowDropdown(true)}
          onBlur={handleBlur}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        {showDropdown && (
          <ul className="absolute z-10 w-full bg-white border rounded shadow mt-1 max-h-60 overflow-y-auto">
            {results.length === 0 ? (
              <li className="p-2 text-gray-500">No results found</li>
            ) : results.map(user => (
              <li
                key={user.userId}
                onMouseDown={() => selectUser(user.userId)}
                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              >
                <img
                  src={user.avatar}
                  alt=""
                  className="h-8 w-8 rounded-full mr-2"
                />
                <span>{user.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Icon buttons */}
      <div className="flex items-center space-x-6">
        <Link to="/home">
          <HomeIcon className="h-6 w-6 text-gray-600 hover:text-teal-600 cursor-pointer" />
        </Link>
        <Link to="/messages">
          <ChatBubbleLeftIcon className="h-6 w-6 text-gray-600 hover:text-teal-600 cursor-pointer" />
        </Link>
        <Link to="/profile">
          <UserCircleIcon className="h-6 w-6 text-gray-600 hover:text-teal-600 cursor-pointer" />
        </Link>
          <NotificationBell />
      </div>
    </header>
  );
}
