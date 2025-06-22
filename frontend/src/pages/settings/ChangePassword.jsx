// frontend/src/pages/settings/ChangePassword.jsx
import React, { useState } from 'react';
import api from '../../api';
import SettingsLayout from '../../components/SettingsLayout';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors]       = useState({});
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg]   = useState('');
  const [loading, setLoading]         = useState(false);

  const navigate = useNavigate();

  // Validate newPassword / confirmPassword in real time
  const validate = () => {
    const e = {};
    // 1) newPassword rules: 8+ chars, at least one uppercase
    if (!/^(?=.*[A-Z]).{8,}$/.test(newPassword)) {
      e.newPassword =
        'Password must be at least 8 characters and include one uppercase letter.';
    }
    // 2) confirm matches new
    if (newPassword !== confirmPassword) {
      e.confirmPassword = 'Passwords do not match.';
    }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMsg('');

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    if (!currentPassword) {
      setErrors((prev) => ({ ...prev, currentPassword: 'Current password is required.' }));
      return;
    }

    try {
      setLoading(true);
      await api.put(
        '/api/user/change-password',
        { currentPassword, newPassword },
        { withCredentials: true }
      );
      setSuccessMsg('Password changed successfully.');
      // Optionally, navigate back after a delay:
      setTimeout(() => navigate('/settings'), 1500);
    } catch (err) {
      console.error(err);
      setServerError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
    <SettingsLayout
      title="Account Security"
      breadcrumb="Change Password"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
          />
          {errors.currentPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
          />
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Server error / success message */}
        {serverError && <p className="text-sm text-red-600">{serverError}</p>}
        {successMsg && <p className="text-sm text-green-600">{successMsg}</p>}

        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
          >
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </SettingsLayout>
    </Layout>
  );
}
