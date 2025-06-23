// frontend/src/pages/admin/EventForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import api from "../../api";

export default function EventForm() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const isEdit       = Boolean(id);
  const query        = new URLSearchParams(useLocation().search);
  const showAttendeesTab = query.get('tab') === 'attendees';

  const [form, setForm]       = useState({
    title: '', description: '',
    date: '', startTime: '',
    address: '',
    minAge: 18, maxAge: 99,
    image: '', capacity: 50,
    price: 0, type: '', discount: 0,
    coupleAllowed: false
  });
  const [loading, setLoading] = useState(isEdit);
  const [attendees, setAttendees] = useState([]);

  // Load existing event
  useEffect(() => {
    if (!isEdit) return setLoading(false);
    api.get(`/api/admin/events/${id}`)
      .then(res => {
        const e = res.data;
        setForm({
          title: e.title,
          description: e.description,
          date: e.date.slice(0,10),
          startTime: e.startTime,
          address: e.address,
          minAge: e.minAge,
          maxAge: e.maxAge,
          image: e.image,
          capacity: e.capacity,
          price: e.price,
          type: e.type,
          discount: e.discount,
          coupleAllowed: e.coupleAllowed
        });
        setAttendees(e.attendees || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // Handle form input
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Submit create or update
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/api/admin/events/${id}`, form);
      } else {
        await api.post('/api/admin/events', form);
      }
      navigate('/admin/events');
    } catch (err) {
      console.error(err);
      alert('Save failed');
    }
  };

  // Approve / reject an attendee inline
  const updateAttendee = async (userId, status) => {
    await api.put(`/api/admin/events/${id}/attendees/${userId}`,
      { status }
    );
    setAttendees(a => a.map(x =>
      x.userId === userId ? { ...x, status } : x
    ));
  };

  if (loading) {
    return (
      <AdminLayout>
        <p>Loading event…</p>
      </AdminLayout>
    );
  }

  return (
    
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">
          {isEdit ? 'Edit Event' : 'New Event'}
        </h1>

        {/* Tabs */}
        {isEdit && (
          <div className="flex space-x-4 border-b mb-4">
            <button
              className={`pb-2 ${!showAttendeesTab ? 'border-b-2 border-teal-600' : ''}`}
              onClick={() => navigate(`/admin/events/${id}/edit`)}
            >
              Details
            </button>
            <button
              className={`pb-2 ${showAttendeesTab ? 'border-b-2 border-teal-600' : ''}`}
              onClick={() => navigate(`/admin/events/${id}/edit?tab=attendees`)}
            >
              Attendees
            </button>
          </div>
        )}

        {isEdit && showAttendeesTab ? (
          // Attendees Tab
          <div>
            <h2 className="text-xl font-semibold mb-4">RSVPs</h2>
            <ul className="space-y-2">
              {attendees.map(a => (
                <li key={a.userId} className="flex justify-between items-center">
                  <span>
                    {a.userId} – {a.status}
                  </span>
                  {a.status === 'pending' && (
                    <div className="space-x-2">
                      <button
                        className="px-2 py-1 bg-green-100 text-green-600 rounded"
                        onClick={() => updateAttendee(a.userId, 'approved')}
                      >
                        Approve
                      </button>
                      <button
                        className="px-2 py-1 bg-red-100 text-red-600 rounded"
                        onClick={() => updateAttendee(a.userId, 'rejected')}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          // Details Tab (Create/Edit Form)
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label>Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Date & Start Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Date</label>
                <input
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label>Start Time</label>
                <input
                  name="startTime"
                  type="time"
                  value={form.startTime}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
            </div>

            {/* Address & Ages */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label>Address</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="flex space-x-2">
                <div>
                  <label>Min Age</label>
                  <input
                    name="minAge"
                    type="number"
                    value={form.minAge}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label>Max Age</label>
                  <input
                    name="maxAge"
                    type="number"
                    value={form.maxAge}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>

            <div>
              <label>Image URL</label>
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label>Capacity</label>
                <input
                  name="capacity"
                  type="number"
                  value={form.capacity}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label>Price ($)</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label>Discount ($)</label>
                <input
                  name="discount"
                  type="number"
                  step="0.01"
                  value={form.discount}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label>Type</label>
              <input
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                name="coupleAllowed"
                type="checkbox"
                checked={form.coupleAllowed}
                onChange={handleChange}
              />
              <label>Couple Allowed</label>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
            >
              {isEdit ? 'Save Changes' : 'Create Event'}
            </button>
          </form>
        )}
      </div>
    
  );
}
