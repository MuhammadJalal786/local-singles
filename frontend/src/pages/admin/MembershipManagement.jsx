import React, { useState, useEffect } from 'react';
import api from "../../api";;

export default function MembershipManagement() {
  const [price, setPrice] = useState(10);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get('/api/admin/settings/membershipPrice')
      .then(res => setPrice(res.data.price))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const savePrice = async () => {
    setSaving(true);
    try {
      await api.put('/api/admin/settings/membershipPrice', { price: Number(price) });
      alert('Membership price updated');
    } catch (err) {
      console.error(err);
      alert('Failed to update price');
    } finally {
      setSaving(false);
    }
  };

  return ( 
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Membership Management</h1>

        {loading ? (
          <p>Loading current price…</p>
        ) : (
          <>
            <label className="block text-gray-700 mb-2">
              Monthly Price ($)
            </label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2 mb-4"
              value={price}
              onChange={e => setPrice(e.target.value)}
              min="0"
              step="0.01"
            />
            <button
              onClick={savePrice}
              disabled={saving}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </>
        )}
      </div>
  );
}
