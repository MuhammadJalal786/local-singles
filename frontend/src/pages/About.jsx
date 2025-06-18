// frontend/src/pages/About.jsx
import React, { useState } from 'react';
import Layout from '../components/Layout';
import aboutImg from '../../assets/About.jpeg'; // make sure this path matches
import {
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

//testimonial images
import t1 from '../../assets/testimonials/t1.png';
import t2 from '../../assets/testimonials/t2.png';
import t3 from '../../assets/testimonials/t3.jpeg';
import t4 from '../../assets/testimonials/t4.png';
import t5 from '../../assets/testimonials/t5.png';
import t6 from '../../assets/testimonials/t6.png';
import t7 from '../../assets/testimonials/t7.png';

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
const testimonials = [
   { id: 0, image: t1, text: `I first attended Maggie’s single meet up events because I heard the gatherings were a fun, lively and safe way to meet singles in the Santa Fe area. Emphasizing friendships first, takes the pressure off participants and having attended multiple events, I am pleased to share that I have made several nice friends, both male and female, with whom I have conversations over coffee, laughs during meals out and other shared activities. I highly recommend attending Maggie’s events. Name is LP` },
   { id: 1, image: t2, text: `I value meaningful in person connections, driving from ABQ to Santa Fe to attend Maggie's singles events! Name is Angela` },
   { id: 2, image: t3, text: 'I met my current boyfriend at one of Maggie’s events, after attending a few and meeting many kind, interesting people. What I love most is how easy and welcoming her events are—you just show up and enjoy yourself.If you’re looking to meet new people, I definitely recommend finding an event that sounds fun and giving it a try! Name Heather' },
   { id: 3, image: t4, text: `I’ll say this about Maggie’s group. I haven’t found that someone special but I’ve made many new friends and met some very interesting singles, that I wouldn’t have met if I wasn’t part of Maggie’s group. Have a drink and step out of your comfort zone and make new friends, just have fun! Name is Gray` },
   { id: 4, image: t5, text: `It’s not easy out there being single! I’ve met people who travel from all over to attend Maggie’s single group. She is the “hostess with the most-set” effortlessly gliding between attendees to make sure everyone is comfortable and meeting new people. She hosts events all over Santa Fe. Maggie works relentlessly to organize, promote, and host these get-togethers and I can say (from the perspective of a shy introvert who refuses to use cringy dating apps) that I always look forward to attending Maggie’s events. Based on their inclusive vibe, I have met both men and women who have become cherished inner-circle friends, and even gone on a few dates. Maggie has opened her heart to help others open theirs, and our town is better off because of this vibrant, worthy, warm, kind, generous, and sparkly human. Name is Jennifer` },
   { id: 5, image: t6, text: `Maggie’s events have been a goldmine to me. I was new to town and in a very short time I was able to build a thriving social network solely through attending her events. Additionally, every event is at a classy place with a great vibe. A++ Name is Daniel` },
   { id: 6, image: t7, text: `It’s challenging being single and meeting new people. I’m a discouraged veteran of dating apps. I wanted to meet singles in Santa Fe and connect in person and Maggie’s single group was the answer to a growing loneliness. It’s a “friends first” foundation, alleviating the pressure of “dating”. Her group focuses on “connections” and the possibilities are inherent with new found friendships. Sign up now, best decision you’ll make. Name is Annie` },
  ];
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
            className="mx-auto w-80 h-80 object-cover rounded-full"
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
    <img
    src={testimonials[current].image}
    alt={`Testimonial ${current + 1}`}
    className="h-48 w-48 rounded-full object-cover mx-auto mb-4"
  />
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
