// frontend/src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  HomeIcon,
  CalendarIcon,
  UserIcon,
  InformationCircleIcon,
  CogIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function Sidebar() {
  const { pathname } = useLocation();

  // helper to apply "active" styling if current route matches
  const isActive = (path) => pathname === path;

  const navigate = useNavigate();

const handleLogout = async () => {
  try {
    await axios.get('/api/auth/logout');
    navigate('/login');
  } catch (err) {
    console.error('Logout failed:', err);
  }
};

  return (
    <aside className="w-64 h-screen bg-white border-r flex flex-col pt-8">
      {/* Main navigation - takes up available space */}
      <nav className="flex-1 px-4 space-y-6">
        <Link
          to="/home"
          className={`flex items-center space-x-3 px-2 py-2 rounded-md hover:bg-teal-50 ${
            isActive('/home') ? 'text-teal-600' : 'text-gray-700'
          }`}
        >
          <HomeIcon className="h-6 w-6" />
          <span>Home</span>
        </Link>

        <Link
          to="/events"
          className={`flex items-center space-x-3 px-2 py-2 rounded-md hover:bg-teal-50 ${
            isActive('/events') ? 'text-teal-600' : 'text-gray-700'
          }`}
        >
          <CalendarIcon className="h-6 w-6" />
          <span>Future Events</span>
        </Link>

        <Link
          to="/myevents"
          className={`flex items-center space-x-3 px-2 py-2 rounded-md hover:bg-teal-50 ${
            isActive('/myevents') ? 'text-teal-600' : 'text-gray-700'
          }`}
        >
          <UserIcon className="h-6 w-6" />
          <span>My Events</span>
        </Link>

        <Link
          to="/about"
          className={`flex items-center space-x-3 px-2 py-2 rounded-md hover:bg-teal-50 ${
            isActive('/about') ? 'text-teal-600' : 'text-gray-700'
          }`}
        >
          <InformationCircleIcon className="h-6 w-6" />
          <span>About Us</span>
        </Link>
      </nav>

      {/* Bottom navigation - stays at bottom */}
      <nav className="px-4 pb-8 space-y-6">
        <Link
          to="/settings"
          className={`flex items-center space-x-3 px-2 py-2 rounded-md hover:bg-teal-50 ${
            isActive('/settings') ? 'text-teal-600' : 'text-gray-700'
          }`}
        >
          <CogIcon className="h-6 w-6" />
          <span>Settings</span>
        </Link>

        <button
  onClick={handleLogout}
  className="w-full text-left flex items-center space-x-3 px-2 py-2 rounded-md text-gray-700 hover:bg-teal-50"
>
  <ArrowRightOnRectangleIcon className="h-6 w-6" />
  <span>Logout</span>
</button>
      </nav>
    </aside>
  );
}