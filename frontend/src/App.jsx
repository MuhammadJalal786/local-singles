// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home            from './pages/Home';
import Login           from './pages/Login';
import Signup          from './pages/Signup';
import PaymentMethod   from './pages/PaymentMethod';
import Checkout        from './pages/Checkout';
import Success         from './pages/Success';

import Events          from './pages/Events';
import EventDetail     from './pages/EventDetail';
import MyEvents        from './pages/MyEvents';

import AccountSettings from './pages/settings/AccountSettings';
import SettingsIndex   from './pages/settings/SettingsIndex';
import AccountSecurity from './pages/settings/AccountSecurity';
import ChangePassword  from './pages/settings/ChangePassword';
import Pricing         from './pages/settings/Pricing';
import HelpSupport     from './pages/settings/HelpSupport';
import TermsOfService  from './pages/settings/TermsOfService';
import Messages      from './pages/Messages';
import MessageThread from './pages/MessageThread';
import UserProfile from './pages/UserProfile';
import About from './pages/About';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/login"     element={<Login />} />
        <Route path="/signup"    element={<Signup />} />
        <Route path="/payment"   element={<PaymentMethod />} />
        <Route path="/checkout"  element={<Checkout />} />
        <Route path="/success"   element={<Success />} />

        {/* Profile */}
        <Route path="/profile"   element={<AccountSettings />} />

        {/* Events */}
        <Route path="/events"      element={<Events />} />
        <Route path="/events/:id"  element={<EventDetail />} />
        <Route path="/myevents"    element={<MyEvents />} />
        <Route path="/users/:userId" element={<UserProfile />} />
        {/* Settings index + sub‐pages */}
        <Route path="/about" element={<About />} />
        <Route path="/messages"        element={<Messages />} />
        <Route path="/messages/:userId" element={<MessageThread />} />
        <Route path="/settings"                                    element={<SettingsIndex />} />
        <Route path="/settings/account-security/change-password"   element={<ChangePassword />} />
        <Route path="/settings/account-security/deactivate"        element={<AccountSecurity />} />
        <Route path="/settings/pricing"                            element={<Pricing />} />
        <Route path="/settings/help"                               element={<HelpSupport />} />
        <Route path="/settings/legal/terms-of-service"             element={<TermsOfService />} />

        {/* Home */}
        <Route path="/home"       element={<Home />} />
        <Route path="/"           element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
