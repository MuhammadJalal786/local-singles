// frontend/src/pages/About.jsx
import React, { useState } from 'react';
import Layout from '../components/Layout';
import aboutImg from '../../assets/About.jpeg'; // make sure this path matches
import {
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

export default function About() {
  const features = [
    {
      title: 'Attend Unlimited Socials',
      desc: 'Attend in-person events that match your age group and interests',
    },
    {
      title: 'Inclusive Connections',
      desc: 'Build meaningful relationships with singles who share your gender orientation and values.',
    },
    {
      title: 'Full Website Access',
      desc: 'Enjoy full access to Maggie’s Local Singles platform. Explore upcoming events, connect online, sign up, communicate with other singles, create your profile, and manage your personal profile, all in one place.',
    },
    {
      title: 'Stay in the Know',
      desc: 'Get newsletters, event reminders, and alerts for upcoming socials.',
    },
    {
      title: 'Local & Real',
      desc: 'Meet real, local singles in person or online. We’re focused on creating genuine, local community connections.',
    },
  ];

  const longCopy = `Real Singles, Genuine Connections
There’s something truly special about Santa Fe, NM, a majestic, quirky city that brings together a diverse melting pot of interesting people from around the world. Our singles community is like that too! From young professionals and seasoned experts to farmers, wanderers, artists, musicians, entrepreneurs, healers, fitness enthusiasts, lawyers, doctors, investors, engineers, retirees, holistic care and more, every member creating an interesting and thriving singles community.
At Local Singles, we celebrate genuine in-person connections, but we also understand that some singles prefer to connect online or may be unable to attend in-person socials due to location or schedule.
What matters most is knowing you’re talking to real singles who are also seeking real connections. Our approach is all about building genuine connections, whether that’s friendship, community, or romance.
In-person socials are making a comeback, as singles seek not just potential partners, but also local friends in their community. With over 1,400+ members, our community attracts attendees from Albuquerque, Taos, Los Alamos, and beyond, all coming together to enjoy vibrant, face-to-face gatherings or online connections.`;

  const founderCopy = `Living Life as a Single in Santa Fe, NM
I'm Maggie, the founder and host of Local Singles. 

Welcome to a warm, stimulating, and unique singles experience. Whether you’re looking to build friendships, network, explore romantic possibilities, or simply meet new singles, Local Singles offers you a chance to connect, in person or online in a genuine and authentic way.
After going through my own transition back into single life, I realized how challenging it can be. How do you navigate this new world? How do you meet other singles, both men and women?
Like many, I turned to online dating after my divorce, hoping it would be a positive step in my journey. But instead, I felt disconnected and discouraged. I believe in the magic of meeting singles in person, locally and organically. That belief inspired me to launch Local Singles in October 2023. Research shows that strong social connections are just as important to our well-being as regular exercise and eating right, it’s time to invest in yourself!
I’m committed to spreading joy, connection, and love by building a vibrant singles community where you can thrive. Life’s too short not to seek out friendship and love — especially right here, in your own community.`;
const testimonials = Array.from({ length: 7 }).map((_, i) => ({
    id: i,
    image: null,           // you’ll replace this when you add real URLs
    text: 'Testimonial text placeholder...'
  }));
  const [current, setCurrent] = useState(0);
  const prev = () =>
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () =>
    setCurrent((c) => (c + 1) % testimonials.length);
  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-10 py-8 px-4">
        {/* Main Heading */}
        <h1 className="text-3xl font-bold text-center">
          Local Singles Membership Includes Connect Your Way, In Person, Online or Both!
        </h1>

        {/* Features List */}
        <div className="space-y-6">
          {features.map((f, i) => (
            <div key={i} className="text-center">
              <h2 className="text-xl font-semibold">{f.title}</h2>
              <p className="mt-1 text-gray-700">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Long Copy */}
        <div className="prose prose-lg mx-auto">
          {longCopy.split('\n').map((line, i) => (
            <p key={i} className={i === 0 ? 'font-semibold text-center' : ''}>
              {line}
            </p>
          ))}
        </div>

        {/* Founder Section */}
        <div className="space-y-4 text-center">
          <img
            src={aboutImg}
            alt="Maggie, founder of Local Singles"
            className="mx-auto w-48 h-48 object-cover rounded-full"
          />
          {founderCopy.split('\n').map((line, i) =>
            line.trim() ? (
              <p key={i} className="text-gray-700">
                {line}
              </p>
            ) : null
          )}
        </div>

       {/* Testimonials Carousel */}
<div className="relative bg-white rounded-lg shadow p-6 mt-8">
  {/* Left arrow */}
  <button
    onClick={prev}
    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow"
  >
    <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
  </button>

  {/* Testimonial content */}
  <div className="text-center">
    <div className="h-40 bg-gray-200 rounded mb-4 flex items-center justify-center text-gray-400">
      {/* Replace with:
          <img
            src={testimonials[current].image}
            alt=""
            className="h-full w-full object-cover rounded"
          />
      */}
      Image Placeholder
    </div>
    <p className="text-gray-700">
      {testimonials[current].text}
    </p>
  </div>

  {/* Right arrow */}
  <button
    onClick={next}
    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow"
  >
    <ChevronRightIcon className="h-6 w-6 text-gray-600" />
  </button>
</div>
      </div>
    </Layout>
  );
}
