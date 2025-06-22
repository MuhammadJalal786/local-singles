// frontend/src/pages/settings/AccountSettings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api';

import Layout from '../../components/Layout';
import ProfileForm from '../../components/ProfileForm';

export default function AccountSettings() {
  const [ user, setUser ]       = useState(null);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ]     = useState('');
  const navigate                 = useNavigate();
  const location                 = useLocation();

  useEffect(() => {
    // Fetch the current user’s profile
    api
      .get('/api/user/me', { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (updatedUser) => {
    setUser(updatedUser);

    // 1) If location.state.from exists, navigate back there
    const redirectTo = location.state?.from;
    if (redirectTo) {
      navigate(redirectTo, { replace: true });
      return;
    }

    // 2) Otherwise, stay on page and show a simple alert
    alert('Profile updated successfully.');
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6">Loading profile…</div>
      </Layout>
    );
  }
  if (error) {
    return (
      <Layout>
        <div className="p-6 text-red-600">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">
          Edit Profile
        </h1>
        <ProfileForm initialData={user} onSave={handleSave} />
      </div>
    </Layout>
  );
}
