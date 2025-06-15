// frontend/src/pages/settings/AccountSecurity.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsLayout from '../../components/SettingsLayout';
import Layout from '../../components/Layout';

export default function AccountSecurity() {
  const navigate = useNavigate();

  return (
    <Layout>
    <SettingsLayout title="Settings">
      {/* 1) Change Password card */}
      <div
        className="mb-4 bg-gray-50 hover:bg-gray-100 rounded-lg p-4 flex justify-between items-center cursor-pointer"
        onClick={() => navigate('/settings/account-security/change-password')}
      >
        <div>
          <h2 className="text-lg font-medium text-gray-800">Change Password</h2>
          <p className="text-sm text-gray-500">
            Update your account password to keep your account secure.
          </p>
        </div>
        <span className="text-gray-400">›</span>
      </div>
    </SettingsLayout>
    </Layout>
  );
}
