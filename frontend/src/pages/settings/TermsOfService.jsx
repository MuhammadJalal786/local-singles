// frontend/src/pages/settings/TermsOfService.jsx
import React from 'react';
import SettingsLayout from '../../components/SettingsLayout';
import Layout from '../../components/Layout';


export default function TermsOfService() {
  return (
    <layout>
    <SettingsLayout title="Settings" breadcrumb="Legal and Compliance">
      {/* Hardcode your Terms of Service text here */}
      <div className="prose max-w-none">
        <h2 className="text-xl font-semibold mb-4">Terms of Service</h2>
        <p>
          Welcome to Local Singles. These Terms of Service (“TOS”) govern your use of our website
          and mobile applications (collectively, the “Service”). Please read these terms carefully
          before accessing or using our Service.
        </p>
        <h3 className="text-lg font-medium mt-6">1. Acceptance of Terms</h3>
        <p>
          By accessing or using the Service, you agree to be bound by these TOS and any policies
          referenced herein. If you do not agree with any part of these TOS, you may not use the
          Service.
        </p>
        {/* Add the rest of your full Terms of Service here */}
        <h3 className="text-lg font-medium mt-6">2. Eligibility</h3>
        <p>
          You must be at least 18 years old to use this Service. If you are under 18, you may not
          register for an account or use any features of the Service.
        </p>
        <h3 className="text-lg font-medium mt-6">3. Account Registration</h3>
        <p>
          To use certain features of the Service, you must register for an account and provide
          accurate and complete information. You are responsible for maintaining the security of
          your password and account.
        </p>
        {/* … more sections as needed … */}
        <h3 className="text-lg font-medium mt-6">4. User Conduct</h3>
        <p>
          You agree not to use the Service to: harass, threaten, or harm any person; upload harmful
          or offensive content; violate any laws; or otherwise misuse the Service.
        </p>
        <h3 className="text-lg font-medium mt-6">5. Termination</h3>
        <p>
          We reserve the right to suspend or terminate your account at any time, for any reason,
          including if you violate these TOS.
        </p>
        <h3 className="text-lg font-medium mt-6">6. Changes to the Terms</h3>
        <p>
          We may modify these TOS at any time. We will notify you of material changes by posting
          updates on the Service. Continued use of the Service after such changes constitutes
          acceptance.
        </p>
        <h3 className="text-lg font-medium mt-6">7. Contact Us</h3>
        <p>
          If you have questions about these TOS, please contact us at support@localsingles.com.
        </p>
      </div>
    </SettingsLayout>
    </layout>
  );
}
