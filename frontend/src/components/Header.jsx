// frontend/src/components/Header.jsx
import React from 'react';
import {
  MagnifyingGlassIcon,
  HomeIcon,
  ChatBubbleLeftIcon,
  UserCircleIcon,
  BellIcon
} from '@heroicons/react/24/outline';

export default function Header() {
  return (
    <header className="w-full bg-white border-b px-6 py-3 flex items-center justify-between">
      {/* Search input */}
      <div className="relative w-1/3">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Icon buttons */}
      <div className="flex items-center space-x-6">
        <HomeIcon className="h-6 w-6 text-gray-600 hover:text-teal-600 cursor-pointer" />
        <ChatBubbleLeftIcon className="h-6 w-6 text-gray-600 hover:text-teal-600 cursor-pointer" />
        <UserCircleIcon className="h-6 w-6 text-gray-600 hover:text-teal-600 cursor-pointer" />
        <BellIcon className="h-6 w-6 text-gray-600 hover:text-teal-600 cursor-pointer" />
      </div>
    </header>
  );
}
