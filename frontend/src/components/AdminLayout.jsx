// src/components/AdminLayout.jsx
import React from 'react';
import AdminSidebar from './AdminSidebar';
import Header from './Header';
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
       <main className="flex-1 overflow-y-auto p-6">
         {/* Outlet renders the matched child route */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
