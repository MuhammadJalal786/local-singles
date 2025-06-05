// backend/routes/user.js
const express = require('express');
const router  = express.Router();
const User    = require('../models/User');

// Middleware to ensure the user is logged in
const ensureAuth = (req, res, next) => {
  if (req.session?.user) {
    req.user = req.session.user;
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
};

/**
 * GET /api/user/me
 * Return the current user's full profile (including new fields).
 */
router.get('/me', ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      '-password -__v' // omit password hash and __v
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Could not fetch profile' });
  }
});

/**
 * PUT /api/user/me
 * Update the current user's profile: avatar, city, zip, interests, occupation, bio.
 */
router.put('/me', ensureAuth, async (req, res) => {
  try {
    // Assemble only the fields we allow to be edited:
    const updates = {};
    if (req.body.avatar)      updates.avatar     = req.body.avatar;
    if (req.body.firstName)   updates.firstName  = req.body.firstName;
    if (req.body.lastName)    updates.lastName   = req.body.lastName;
    if (req.body.city)        updates.city       = req.body.city;
    if (req.body.zip) {
      // Optional: validate 5‐digit zip on the backend if you want
      if (!/^\d{5}$/.test(req.body.zip)) {
        return res.status(400).json({ message: 'ZIP code must be 5 digits' });
      }
      updates.zip = req.body.zip;
    }
    if (req.body.interests)   updates.interests  = req.body.interests;
    if (req.body.occupation)  updates.occupation = req.body.occupation;
    if (req.body.bio) {
      if (req.body.bio.length > 1000) {
        return res.status(400).json({ message: 'Bio cannot exceed 1000 characters' });
      }
      updates.bio = req.body.bio;
    }
    // We do NOT allow changing email/password here; that’s out of scope.

    // Update in DB
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password -__v');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Refresh session data so requests have the latest fields (especially avatar, city, zip, etc.)
    req.session.user = {
      _id:        user._id,
      firstName:  user.firstName,
      lastName:   user.lastName,
      email:      user.email,
      sex:        user.sex,
      dob:        user.dob,
      phone:      user.phone,
      city:       user.city,
      zip:        user.zip,
      interests:  user.interests,
      occupation: user.occupation,
      bio:        user.bio,
      avatar:     user.avatar,
      isAdmin:    user.isAdmin,
      subscriptionStatus: user.subscriptionStatus,
      trialEndsAt:         user.trialEndsAt,
      stripeCustomerId:    user.stripeCustomerId,
      stripeSubscriptionId:user.stripeSubscriptionId
    };

    res.json({ user });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Could not update profile' });
  }
});

module.exports = router;
