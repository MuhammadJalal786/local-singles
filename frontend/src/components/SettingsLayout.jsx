// frontend/src/components/SettingsLayout.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function SettingsLayout({ children, title, breadcrumb }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // We’ll show a “Back” button if we’re not exactly on /settings
  const isTopLevel = pathname === '/settings';

  return (
    <div className="flex">
      {/* Sidebar and Header are assumed to be in a higher‐level Layout wrapper */}
      {/* This component focuses just on the “white card” with a back arrow + content */}

      <div className="flex-1 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Back arrow + breadcrumb */}
          <div className="flex items-center space-x-2 mb-6">
            {!isTopLevel && (
              <button
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-gray-900"
              >
                ←
              </button>
            )}
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
            {breadcrumb && (
              <span className="text-gray-500">&gt; {breadcrumb}</span>
            )}
          </div>

          {/* White card container */}
          <div className="bg-white rounded-lg shadow-sm p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
