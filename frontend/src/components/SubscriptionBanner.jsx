// frontend/src/components/SubscriptionBanner.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';

export default function SubscriptionBanner() {
  const [info, setInfo]     = useState(null);
  const [daysLeft, setDays] = useState(0);

  useEffect(() => {
    api
      .get('/api/payment/subscription', { withCredentials: true })
      .then(({ data }) => {
        setInfo(data);
        const now = Date.now();
        // Use currentPeriodEnd for both trialing and active/cancelled
        const msLeft = data.currentPeriodEnd - now;
        const days = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
        setDays(days > 0 ? days : 0);
      })
      .catch(() => {
        /* quietly fail—no banner if not logged in or no sub */
      });
  }, []);

  if (!info || info.status === 'active') return null;

  const isTrial = info.status === 'trialing';
  const verb    = isTrial ? 'expire' : 'end';
  const label   = isTrial
    ? `Your free trial will ${verb} in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}.`
    : `Your subscription will ${verb} in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}.`;

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-700 p-4 mb-4">
      <p className="font-medium">{label}</p>
    </div>
  );
}
