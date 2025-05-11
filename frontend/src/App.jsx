// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home           from './pages/Home';
import Login          from './pages/Login';
import Signup         from './pages/Signup';
import PaymentMethod  from './pages/PaymentMethod';
import Checkout from './pages/Checkout';
import Success from './pages/Success';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/home"        element={<Home />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/signup"      element={<Signup />} />
        <Route path="/payment"     element={<PaymentMethod />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
}

export default App;
