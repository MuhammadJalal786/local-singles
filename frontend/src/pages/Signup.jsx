// frontend/src/pages/Signup.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import BackgroundImage from '../../assets/Signup.jpeg';
import Logo from '../../assets/Logo.png';

const Signup = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName]       = useState('');
  const [lastName, setLastName]         = useState('');
  const [phone, setPhone]               = useState('');
  const [email, setEmail]               = useState('');
  const [sex, setSex]                   = useState('');
  const [dob, setDob]                   = useState('');
  const [password, setPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree]               = useState(false);
  const [errors, setErrors]             = useState({});
  const [serverError, setServerError]   = useState('');

  const validate = () => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim())  newErrors.lastName  = 'Last name is required';
    if (!phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\d+$/.test(phone)) newErrors.phone = 'Phone must contain numbers only';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(email)) newErrors.email = 'Invalid email address';
    if (!sex) newErrors.sex = 'Please select your sex';
    if (!dob) newErrors.dob = 'Date of birth is required';
    if (!password) newErrors.password = 'Password is required';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!agree) newErrors.agree = 'You must agree to the Terms & Conditions';
    return newErrors;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    setServerError('');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/signup',
        { firstName, lastName, phone, email, sex, dob, password, confirmPassword },
        { withCredentials: true }
      );
      navigate(res.data.redirect || '/payment');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left: Image & overlay (hidden on mobile) */}
      <div className="hidden md:block md:w-1/2 relative h-full">
        <img
          src={BackgroundImage}
          alt="Signup Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-end pb-10 text-white">
          <h2 className="text-xl md:text-2xl font-semibold mb-2 px-4 text-center">
            
          </h2>
         
        </div>
      </div>

      {/* Right: Signup Form */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center h-full">
        <div className="w-full max-w-md p-8 flex flex-col justify-center">
          <div className="flex items-center justify-center mb-4">
            <img src={Logo} alt="Logo" className="w-20 h-20 object-contain" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Create an account</h2>
          <p className="text-base text-gray-600 mb-6">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-600 font-medium">Log in</Link>
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            {/* First & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  name="firstName"
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-teal-500"
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  name="lastName"
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-teal-500"
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Numbers only"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-teal-500"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  name="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="example@example.com"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-teal-500"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Sex & Date of Birth */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Sex</label>
                <select
                  name="sex"
                  value={sex}
                  onChange={e => setSex(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-teal-500"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.sex && <p className="text-red-500 text-xs mt-1">{errors.sex}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  name="dob"
                  type="date"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-teal-500"
                />
                {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-teal-500"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-teal-500"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-center">
              <input
                name="agree"
                type="checkbox"
                checked={agree}
                onChange={() => setAgree(!agree)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">I agree to the Terms & Conditions</span>
            </div>
            {errors.agree && <p className="text-red-500 text-xs mt-1">{errors.agree}</p>}
            {serverError && <p className="text-red-500 text-center mt-4">{serverError}</p>}

            <button
              type="submit"
              disabled={!agree}
              className={`w-full bg-teal-500 text-white py-2 rounded-md mt-4 transition ${
                agree ? 'hover:bg-teal-600' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              Create account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
