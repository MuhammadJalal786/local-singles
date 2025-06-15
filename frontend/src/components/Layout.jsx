// src/components/Layout.jsx
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import SubscriptionBanner from './SubscriptionBanner';

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="px-6 pt-3">
        <SubscriptionBanner />
        </div>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
