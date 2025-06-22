// frontend/src/components/RequireProfileCompletion.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';

/**
 * Wrap any page that should be blocked until the profile is complete.
 * 
 * Profile is considered complete if *all* of these fields are non-empty:
 *   firstName, lastName, phone, sex, dob, city, zip, interests, occupation
 * 
 * (We are ignoring avatar and bio per your request.)
 */
export default function RequireProfileCompletion({ children }) {
  const [checking, setChecking] = useState(true);
  const [error, setError]       = useState('');
  const navigate               = useNavigate();
  const location               = useLocation();

  useEffect(() => {
    // 1) Fetch the current user’s profile
    api
      .get('/api/user/me', { withCredentials: true })
      .then((res) => {
        const u = res.data.user;

        // 2) Check required fields (excluding avatar and bio)
        const required = [
          u.firstName,
          u.lastName,
          u.phone,
          u.sex,
          u.dob,
          u.city,
          u.zip,
          u.interests,
          u.occupation,
        ];

        const incomplete = required.some((field) => {
          // treat null, undefined, or empty string as incomplete
          return field === null || field === undefined || field.toString().trim() === '';
        });

        if (incomplete) {
          // Redirect to /profile, preserving the original location in state
          navigate('/profile', { replace: true, state: { from: location.pathname } });
        }
        // otherwise, allow rendering of children
      })
      .catch((err) => {
        console.error('Error fetching profile for completion check:', err);
        setError('Unable to verify profile. Please try again.');
      })
      .finally(() => setChecking(false));
  }, [location, navigate]);

  if (checking) {
    // Show a simple loading text while we check
    return <div className="p-6">Verifying profile…</div>;
  }
  if (error) {
    // If fetching /api/user/me failed (e.g. session expired), show error
    return <div className="p-6 text-red-600">{error}</div>;
  }

  // If we didn’t redirect, render the wrapped children
  return <>{children}</>;
}
