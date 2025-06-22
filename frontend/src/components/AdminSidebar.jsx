import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import api from '../api';
import {
  TableCellsIcon,
  UsersIcon,
  CalendarIcon,
  MegaphoneIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function AdminSidebar() {
  const navigate = useNavigate();
  const links = [
    { to: '/admin/membership', label: 'Membership Management', icon: TableCellsIcon },
    { to: '/admin/users',       label: 'User Management',       icon: UsersIcon },
    { to: '/admin/events',      label: 'Event Management',      icon: CalendarIcon },
    { to: '/admin/messaging',   label: 'Messaging & Notifications', icon: MegaphoneIcon },
  ];

  const handleLogout = async () => {
    try {
      await api.get('/api/auth/logout');
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <aside className="w-64 bg-gray-50 border-r flex flex-col p-4">
      <nav className="flex-1 space-y-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center p-2 rounded ${
                isActive ? 'bg-teal-100 text-teal-600' : 'text-gray-700 hover:bg-teal-50'
              }`
            }
          >
            <Icon className="h-6 w-6 mr-2" />
            {label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center p-2 mt-4 text-gray-700 hover:bg-teal-50 rounded"
      >
        <ArrowRightOnRectangleIcon className="h-6 w-6 mr-2" />
        Logout
      </button>
    </aside>
  );
}
