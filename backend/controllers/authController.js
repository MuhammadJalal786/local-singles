const User = require('../models/User');

exports.getCurrentUser = async (req, res) => {
  try {
    // 1) Must be authenticated
    if (!req.session.user?._id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // 2) Load fresh data from DB
    const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // 3) Auto-expire trial if it's past due
    if (
      user.subscriptionStatus === 'trialing' &&
      user.trialEndsAt &&
      user.trialEndsAt < new Date()
    ) {
      user.subscriptionStatus = 'expired';
      await user.save();

      // Also update the session copy so front-end sees it
      req.session.user.subscriptionStatus = 'expired';
    }

    // 4) Send back only the fields the client-side expects
    const {
      firstName,
      lastName,
      email,
      subscriptionStatus,
      trialEndsAt,
      subscriptionEndsAt
    } = user;

    return res.json({
      firstName,
      lastName,
      email,
      subscriptionStatus,
      trialEndsAt,
      subscriptionEndsAt
    });
  } catch (err) {
    console.error('Error in getCurrentUser:', err);
    return res.status(500).json({ message: 'Could not fetch user' });
  }
};


// Signup function (already implemented)
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, sex, dob, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with that email already exists.' });
    }
    const newUser = new User({ firstName, lastName, phone, email, sex, dob, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found.' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch)  return res.status(400).json({ message: 'Invalid password.' });

    // ← HERE: only store the fields you actually need downstream
    req.session.user = {
      _id:                user._id,
      email:              user.email,
      firstName:          user.firstName,
      lastName:           user.lastName,
      subscriptionStatus: user.subscriptionStatus,
      trialEndsAt:        user.trialEndsAt
    };

    return res.json({ message: 'Logged in successfully!' });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error during login.' });
  }
};

exports.getCurrentUser = (req, res) => {
  if (!req.session?.user?._id) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  // You can return the full session.user or re-fetch fresh data if you like:
  return res.json(req.session.user);
};

exports.me = async (req, res) => {
  if (!req.session.user?._id) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  // reload from DB to get the latest subscriptionStatus
  const user = await require('../models/User').findById(req.session.user._id);
  return res.json({
    lastName: user.lastName,
    email: user.email,
    firstName: user.firstName,
    subscriptionStatus: user.subscriptionStatus,
    trialEndsAt: user.trialEndsAt,
  });
};

  
// Dummy logout function
exports.logout = (req, res) => {
  res.json({ message: 'Logout endpoint is not implemented yet.' });
};
