// frontend/src/components/ProfileForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function ProfileForm({ initialData, onSave }) {
  const [form, setForm] = useState({
    avatar:     initialData.avatar || '',
    firstName:  initialData.firstName || '',
    lastName:   initialData.lastName || '',
    city:       initialData.city || '',
    zip:        initialData.zip || '',
    interests:  initialData.interests || '',
    occupation: initialData.occupation || '',
    bio:        initialData.bio || '',
    phone:      initialData.phone || '',
    sex:        initialData.sex || '',
    dob:        initialData.dob ? initialData.dob.slice(0, 10) : '',
  });

  const [preview, setPreview] = useState(initialData.avatar || '');
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('Avatar must be smaller than 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((f) => ({ ...f, avatar: reader.result }));
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (!/^\d{5}$/.test(form.zip)) {
      setError('ZIP code must be 5 digits');
      setSaving(false);
      return;
    }
    if (form.bio.length > 1000) {
      setError('Bio cannot exceed 1000 characters');
      setSaving(false);
      return;
    }

    try {
      const payload = {
        avatar:     form.avatar,
        firstName:  form.firstName,
        lastName:   form.lastName,
        city:       form.city,
        zip:        form.zip,
        interests:  form.interests,
        occupation: form.occupation,
        bio:        form.bio,
        phone:      form.phone,
        sex:        form.sex,
        dob:        form.dob,
      };

      const res = await axios.put(
        'http://localhost:5000/api/user/me',
        payload,
        { withCredentials: true }
      );

      onSave(res.data.user);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="text-red-600 bg-red-100 p-2 rounded">
          {error}
        </div>
      )}

      {/* Avatar Upload */}
      <div className="flex items-center space-x-6">
        <label htmlFor="avatar">
          {preview ? (
            <img
              src={preview}
              alt="Avatar Preview"
              className="h-24 w-24 rounded-full object-cover border"
            />
          ) : (
            <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
              Upload
            </div>
          )}
          <input
            type="file"
            name="avatar"
            id="avatar"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </label>
        <span className="text-sm text-gray-500">
          Click the circle to upload your avatar (max 2MB).
        </span>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            required
            value={form.firstName}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            required
            value={form.lastName}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Contact & Demographic */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Mobile <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            required
            value={form.phone}
            onChange={handleChange}
            placeholder="+1-202-555-0116"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            readOnly
            value={initialData.email}
            className="mt-1 p-2 w-full border border-gray-300 bg-gray-100 rounded-md cursor-not-allowed"
          />
        </div>
      </div>

      {/* DOB & Gender */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="dob"
            id="dob"
            required
            value={form.dob}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="sex" className="block text-sm font-medium text-gray-700">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            name="sex"
            id="sex"
            required
            value={form.sex}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          >
            <option value="" disabled>
              Select gender
            </option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Location & ZIP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            id="city"
            required
            value={form.city}
            onChange={handleChange}
            placeholder="e.g. New York"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
            ZIP Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="zip"
            id="zip"
            required
            pattern="\d{5}"
            title="Five-digit ZIP code"
            value={form.zip}
            onChange={handleChange}
            placeholder="12345"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Interests & Occupation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="interests" className="block text-sm font-medium text-gray-700">
            Interests <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="interests"
            id="interests"
            required
            value={form.interests}
            onChange={handleChange}
            placeholder="e.g. Music, Sports, Travel"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
            Occupation <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="occupation"
            id="occupation"
            required
            value={form.occupation}
            onChange={handleChange}
            placeholder="e.g. Software Engineer"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          Bio <span className="text-red-500">*</span>
        </label>
        <textarea
          name="bio"
          id="bio"
          required
          rows={4}
          maxLength={1000}
          value={form.bio}
          onChange={handleChange}
          placeholder="Tell us a bit about yourself (up to 500 words)."
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
        />
        <p className="mt-1 text-xs text-gray-500">
          {form.bio.length}/1000 characters
        </p>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Discard
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
