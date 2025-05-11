// frontend/src/pages/Checkout.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginImage from '../../assets/Login.png';  // or your checkout-specific image

const Checkout = () => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    // after confirming, go to success page
    navigate('/success');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden w-full max-w-6xl">
        
        {/* Left Panel */}
        <div className="relative md:w-1/2 h-64 md:h-auto">
          <img
            src={LoginImage}
            alt="Overlay"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-black/50 flex flex-col items-center justify-center text-white p-6">
            <h2 className="font-poppins font-semibold text-2xl md:text-3xl text-center">
              “Lost Something? Let Us Help You Find It!”
            </h2>
            <div className="flex space-x-2 mt-4">
              <span className="w-9 h-1 bg-gray-300 rounded-full" />
              <span className="w-9 h-1 bg-gray-300/50 rounded-full" />
              <span className="w-9 h-1 bg-gray-300/50 rounded-full" />
            </div>
          </div>
          <Link
            to="/"
            className="absolute top-4 left-4 inline-block bg-white/70 hover:bg-white/90 text-black px-4 py-2 rounded-md text-sm font-medium"
          >
            Back to website
          </Link>
        </div>

        {/* Right Panel */}
        <div className="md:w-1/2 p-8 flex flex-col">
          {/* Header */}
          <h1 className="font-poppins font-bold text-4xl text-gray-800 mb-6">
            Payment Method
          </h1>

          {/* Summary Cards */}
          <div className="space-y-4 mb-6">
            {/* Payment & Amount */}
            <div className="bg-gray-50 shadow rounded-lg p-4">
              <p className="text-sm text-gray-800">Payment</p>
              <p className="text-lg font-semibold text-gray-900">$10</p>
            </div>
            {/* Purchase Date */}
            <div className="bg-gray-50 shadow rounded-lg p-4">
              <p className="text-sm text-gray-800">Purchase Date</p>
              <p className="text-xs text-gray-900">01/09/2020</p>
            </div>
            {/* Divider and Total */}
            <div className="border-t border-gray-200 pt-4 flex justify-between">
              <span className="text-sm text-gray-800">Total Price</span>
              <span className="text-lg font-semibold text-gray-900">$10</span>
            </div>
          </div>

          {/* Details Section */}
          <div className="bg-gray-50 shadow rounded-lg p-6 mb-6 grid grid-cols-1 gap-6">
            {/* Order ID */}
            <div>
              <p className="text-sm text-gray-800">Order ID</p>
              <p className="text-xs text-gray-900">INV-P6FDC7WM</p>
            </div>
            {/* Item */}
            <div>
              <p className="text-sm text-gray-800">Item</p>
              <p className="text-xs text-gray-900">Lorem ipsum Lorem</p>
            </div>
            {/* Name & Email */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-800">Name</p>
                <p className="text-xs text-gray-900">Maria Pons</p>
              </div>
              <div>
                <p className="text-sm text-gray-800">Email</p>
                <p className="text-xs text-gray-900">mariapons@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            className="mt-auto w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition text-lg"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
