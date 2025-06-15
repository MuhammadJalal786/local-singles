// src/pages/settings/SettingsIndex.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';

export default function SettingsIndex() {
  return (
    <Layout>
    <div>
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>
      <ul className="space-y-2">
        <li>
          <Link
            to="account-security/change-password"
            className="block p-4 bg-white rounded shadow hover:bg-gray-50"
          >
            Change Password
            <span className="text-gray-500 block text-sm">
              Update your account password to keep your account secure.
            </span>
          </Link>
        </li>
        <li>
          <Link
            to="pricing"
            className="block p-4 bg-white rounded shadow hover:bg-gray-50"
          >
            Pricing &amp; Billing
            <span className="text-gray-500 block text-sm">
              Manage your subscription plan and billing details.
            </span>
          </Link>
        </li>
        <li>
          <Link
            to="help"
            className="block p-4 bg-white rounded shadow hover:bg-gray-50"
          >
            Help &amp; Support
            <span className="text-gray-500 block text-sm">
              Send us questions or report problems.
            </span>
          </Link>
        </li>
        <li>
          <Link
            to="legal/terms-of-service"
            className="block p-4 bg-white rounded shadow hover:bg-gray-50"
          >
            Terms of Service
            <span className="text-gray-500 block text-sm">
              View our legal terms and compliance info.
            </span>
          </Link>
        </li>
      </ul>
    </div>
    </Layout>
  );
}
