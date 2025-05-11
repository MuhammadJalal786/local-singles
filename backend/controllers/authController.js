const User = require('../models/User');

exports.getCurrentUser = async (req, res) => {
  // 1) If there’s no session or no user in session → not authenticated
  if (!req.session?.user?._id) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    // 2) Re-fetch the user for up-to-date subscription info
    const freshUser = await User.findById(req.session.user._id)
      .select('firstName lastName email subscriptionStatus trialEndsAt');

    // 3) Return only what the frontend needs
    return res.json({
      name:              `${freshUser.firstName} ${freshUser.lastName}`,
      email:             freshUser.email,
      subscriptionStatus: freshUser.subscriptionStatus,  // e.g. 'active' | 'trialing' | null
      trialEndsAt:       freshUser.trialEndsAt           // Date or undefined
    });
  } catch (err) {
    console.error('getCurrentUser error:', err);
    return res.status(500).json({ message: err.message });
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
    const user = await require('../models/User').findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password.' });
    }

    req.session.user = user;

    res.json({
      message: 'Logged in successfully!',
      subscriptionStatus: user.subscriptionStatus,
      trialEndsAt: user.trialEndsAt
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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
