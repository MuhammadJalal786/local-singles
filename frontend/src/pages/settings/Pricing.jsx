// frontend/src/pages/settings/Pricing.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Layout from '../../components/Layout';
import SettingsLayout from '../../components/SettingsLayout';

export default function Pricing() {
  const [sub, setSub]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // Fetch subscription on mount
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/payment/subscription', {
        withCredentials: true
      })
      .then(res => {
        setSub(res.data);
      })
      .catch(err => {
        console.error('Error fetching subscription:', err);
        setError(err.response?.data?.message || 'Could not load subscription.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = () => {
    if (!window.confirm('Are you sure you want to cancel your subscription?')) return;
    axios
      .post('http://localhost:5000/api/payment/cancel-subscription', {}, {
        withCredentials: true
      })
      .then(() => {
        alert('Subscription canceled.');
        setSub(prev => ({ ...prev, status: 'cancelled' }));
      })
      .catch(err => {
        console.error('Error canceling subscription:', err);
        alert(err.response?.data?.message || 'Could not cancel subscription.');
      });
  };

  const handleCheckout = () => {
    axios
      .post('http://localhost:5000/api/payment/create-checkout-session', {}, {
        withCredentials: true
      })
      .then(res => {
        window.location.href = res.data.url;
      })
      .catch(err => {
        console.error('Error starting checkout:', err);
        alert(err.response?.data?.message || 'Could not start checkout.');
      });
  };

  return (
    <Layout>
      <SettingsLayout title="Settings" breadcrumb="Pricing & Billing">
        {loading && <p>Loading subscription details…</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && sub && (
          <div className="space-y-6">
            {/* Plan Info */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Plan: {sub.plan}
              </h2>
              <p className="text-gray-600">
                ${sub.price} / month — Status:{" "}
                <span
                  className={
                    sub.status === 'active'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                >
                  {sub.status}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Current period ends:{" "}
                {new Date(sub.currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              {sub.status === 'active' ? (
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Cancel Subscription
                </button>
              ) : (
                <button
                  onClick={handleCheckout}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                  Subscribe
                </button>
              )}
            </div>
          </div>
        )}
      </SettingsLayout>
    </Layout>
  );
}
