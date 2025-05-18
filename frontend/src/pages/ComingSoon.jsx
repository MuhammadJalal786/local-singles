// frontend/src/pages/ComingSoon.jsx
import React, { useState } from 'react';
import axios from 'axios';
import LandingPage from '../../assets/LandingPage.png';
import Logo from '../../assets/Logo-nobg.png';
import Success from './Success';

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
      style={{ backgroundImage: `url(${LandingPage})` }}
    >
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60" />

      {/* logo centered at top */}
      <img
        src={Logo}
        alt="Local Singles Logo"
        className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-auto z-10"
      />

      {/* content */}
      <div className="relative z-20 max-w-xl text-center px-6 py-12 text-white space-y-6">
        <h1 className="text-5xl font-bold">Welcome to Local Singles</h1>
        <p className="text-lg">
          iMeet, Mingle, Match will be rebranding soon to <strong>Local Singles</strong>! Still in-person socials but with online connections, too!
        </p>
        <p className="text-lg">
          Local Singles is more than just a name change—it’s a new way to connect. Create your own profile, add photos and a bio, and meet real singles, whether in person or online and so much more! Can’t make it to a social? No problem. Stay connected virtually.
        </p>
        <p className="text-lg font-semibold">
          Experience Romance, Friendship and Community!<br />
          Stay tuned for our new website!
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4 justify-center">
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
        {status === 'success' && (
          <p className="text-green-400">Thanks! We'll let you know when we go live.</p>
        )}
        {status === 'error' && (
          <p className="text-red-400">Oops! Something went wrong. Please try again.</p>
        )}

        <p className="mt-8 text-sm">
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
        <p className="text-sm">
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
