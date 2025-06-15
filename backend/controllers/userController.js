// backend/controllers/userController.js
const User    = require('../models/User');
const bcrypt  = require('bcrypt');

/**
 * PUT /api/user/change-password
 * Body: { currentPassword, newPassword }
 * Verifies currentPassword, then updates to newPassword (hashed).
 */
exports.changePassword = async (req, res) => {
  try {
    // 1) Ensure user is authenticated
    const userId = req.session?.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new passwords are required.' });
    }

    // 2) Fetch user from DB
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // 3) Verify currentPassword
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    // 4) Validate newPassword against rules: at least 8 chars + one uppercase
    const passwordRules = /^(?=.*[A-Z]).{8,}$/;
    if (!passwordRules.test(newPassword)) {
      return res.status(400).json({
        message:
          'New password must be at least 8 characters long and contain at least one uppercase letter.'
      });
    }

    // 5) Hash and save new password
    user.password = newPassword; // pre('save') hook will re‐hash
    await user.save();

    return res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    console.error('changePassword error:', err);
    return res.status(500).json({ message: 'Server error changing password.' });
  }
};


/**
 * DELETE /api/user/me
 * Completely deletes the current user and logs them out.
 */
exports.deactivateAccount = async (req, res) => {
  try {
    const userId = req.session?.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // 1) Delete the user document
    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // 2) Destroy their session (log them out)
    req.session.destroy((err) => {
      if (err) console.error('Session destruction error:', err);
      // 3) Return success
      return res.json({ message: 'Account deactivated and logged out.' });
    });
  } catch (err) {
    console.error('deactivateAccount error:', err);
    return res.status(500).json({ message: 'Server error deactivating account.' });
  }
};
