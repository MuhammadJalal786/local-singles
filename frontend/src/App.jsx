// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home            from './pages/Home';
import Login           from './pages/Login';
import Signup          from './pages/Signup';
import PaymentMethod   from './pages/PaymentMethod';
import Checkout        from './pages/Checkout';
import Success         from './pages/Success';

import AccountSettings from './pages/settings/AccountSettings';
import Events          from './pages/Events';       
import EventDetail     from './pages/EventDetail';  
import MyEvents        from './pages/MyEvents';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/login"       element={<Login />} />
        <Route path="/signup"      element={<Signup />} />
        <Route path="/payment"     element={<PaymentMethod />} />
        <Route path="/checkout"    element={<Checkout />} />
        <Route path="/success"     element={<Success />} />

        {/* Profile */}
        <Route path="/profile"     element={<AccountSettings />} />

        {/* Events Listing (protected by RequireProfileCompletion inside) */}
        <Route path="/events"      element={<Events />} />

        {/* (Optionally) Event Detail page */}
        <Route path="/events/:id"  element={<EventDetail />} />

        {/* My Events */}
        <Route path="/myevents"    element={<MyEvents />} />

        {/* Home */}
        <Route path="/home"        element={<Home />} />
        <Route path="/"            element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
