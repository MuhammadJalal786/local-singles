const User = require('../models/User');

/**
 * ensureAdmin
 *  1) Verifies there's a session 
 *  2) Re-fetches the user from Mongo
 *  3) Checks the fresh isAdmin flag
 */
module.exports = async function ensureAdmin(req, res, next) {
  // 1) Must be logged in
  if (!req.session?.user?._id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // 2) Pull latest user from DB
  let user;
  try {
    user = await User.findById(req.session.user._id).lean();
  } catch (err) {
    console.error('ensureAdmin lookup error:', err);
    return res.status(500).json({ message: 'Server error' });
  }

  // 3) Check admin flag
  if (!user?.isAdmin) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // 4) Update session snapshot (optional, but keeps session.user fresh)
  req.session.user = user;

  next();
};
