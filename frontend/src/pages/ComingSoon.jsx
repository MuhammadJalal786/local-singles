// frontend/src/pages/ComingSoon.jsx
import React, { useState } from 'react';
import axios from 'axios';
import LandingBkg from '../../assets/LandingBkg.jpg'; // ✅ background image
import Logo from '../../assets/Logo-nobg.png';

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(''); // 'success' | 'error' | ''

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/notify', { email }, {
        headers: { 'Content-Type': 'application/json' }
      });
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${LandingBkg})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60" />

      {/* Logo centered at top */}
      <img
        src={Logo}
        alt="Local Singles Logo"
        className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-auto z-10"
      />

      {/* Main content */}
      <div className="relative z-20 max-w-2xl text-center px-6 py-12 text-white space-y-6">
        <h1 className="text-5xl font-bold">Coming Soon: Local Singles</h1>
        <p className="text-xl font-semibold">
          Experience Romance, Friendship, and Community!
        </p>
        <p>
          Local Singles is your new go-to for building authentic in-person connections and staying connected online—
          all with local singles who are ready for friendship, romance, and community.
        </p>
        <ul className="text-left list-disc pl-6 space-y-1">
          <li>Weekly socials & curated singles experiences</li>
          <li>Fun events like game nights, bowling, scavenger hunts, and “singles & dogs” meetups</li>
          <li>Large mixers or small group gatherings—something for everyone</li>
          <li>
            A secure online space to browse profiles, message local members, and stay in the loop
          </li>
          <li>Create your own profile with photos and a bio—meet over 1,000 real local singles</li>
        </ul>
        <p>
          Can’t make it to a social? No problem. Our online community lets you stay connected anytime, anywhere.
        </p>
        <p className="text-xl text-red-300 font-bold">❤ Stay tuned—our new website is launching soon!</p>

        {/* Signup form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center gap-4 justify-center mt-6"
        >
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full sm:w-auto flex-1 px-4 py-2 rounded-md text-gray-900"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-teal-500 hover:bg-teal-600 rounded-md font-medium"
          >
            Notify Me
          </button>
        </form>

        {/* Status feedback */}
        {status === 'success' && (
          <p className="text-green-400">Thanks! We'll let you know when we go live.</p>
        )}
        {status === 'error' && (
          <p className="text-red-400">Oops! Something went wrong. Please try again.</p>
        )}

        {/* Extra links */}
        <p className="mt-8 text-base">
          In the meantime, join iMeet, Mingle, Match on Meetup to RSVP and attend our upcoming socials:
          <br />
          <a
            href="https://Meetup.com/imeet-singles-santafe"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-teal-300"
          >
            Meetup.com/imeet-singles-santafe
          </a>
        </p>
        <p className="text-base">
          You're invited to join our Facebook group for updates, photos, videos, “Single of the Week” & more:
          <br />
          <a
            href="https://www.facebook.com/groups/1641059893466940"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-teal-300"
          >
            facebook.com/groups/1641059893466940
          </a>
        </p>
      </div>
    </div>
  );
}
