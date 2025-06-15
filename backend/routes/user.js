// backend/routes/user.js
const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const userController = require('../controllers/userController');

// Re‐use the existing ensureAuth middleware (user must be logged in)
const ensureAuth = (req, res, next) => {
  if (req.session?.user) {
    req.user = req.session.user;
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
};

/**
 * GET /api/user/me
 * (existing) Return the full user profile.
 */
router.get('/me', ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -__v');
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
 * (existing) Update allowed profile fields (avatar, city, zip, interests, etc.).
 */
router.put('/me', ensureAuth, async (req, res) => {
  try {
    const updates = {};
    if (req.body.avatar)      updates.avatar     = req.body.avatar;
    if (req.body.firstName)   updates.firstName  = req.body.firstName;
    if (req.body.lastName)    updates.lastName   = req.body.lastName;
    if (req.body.city)        updates.city       = req.body.city;
    if (req.body.zip && /^\d{5}$/.test(req.body.zip)) updates.zip = req.body.zip;
    if (req.body.interests)   updates.interests  = req.body.interests;
    if (req.body.occupation)  updates.occupation = req.body.occupation;
    if (req.body.bio && req.body.bio.length <= 1000) updates.bio = req.body.bio;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password -__v');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Refresh session data
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
      trialEndsAt:        user.trialEndsAt,
      stripeCustomerId:   user.stripeCustomerId,
      stripeSubscriptionId: user.stripeSubscriptionId
    };

    res.json({ user });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Could not update profile' });
  }
});

/**
 * PUT /api/user/change-password
 * Change the current user’s password.
 */
router.put('/change-password', ensureAuth, userController.changePassword);

/**
 * DELETE /api/user/me
 * Deactivate (delete) the current user’s account.
 */
router.delete('/me', ensureAuth, userController.deactivateAccount);

module.exports = router;
