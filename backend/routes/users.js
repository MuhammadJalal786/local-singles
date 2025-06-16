// backend/routes/users.js
const express   = require('express');
const router    = express.Router();
const User      = require('../models/User');

// reuse your ensureAuth from messages.js (or auth middleware file)
const ensureAuth = (req, res, next) => {
  if (req.session?.user) {
    req.userId = req.session.user._id;
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
};

 /**
  * GET /api/users?search=foobar
  * Returns up to 10 users whose first or last name matches (case-insensitive).
  */
router.get('/', ensureAuth, async (req, res) => {
  try {
    const q = req.query.search;
    if (!q || q.length < 4) {
      return res.status(400).json({ message: 'Query too short' });
    }
    const regex = new RegExp(q, 'i');
    const users = await User.find({
      $or: [
        { firstName: regex },
        { lastName:  regex }
      ]
    })
      .select('firstName lastName avatar')
      .limit(10);

    const results = users.map(u => ({
      userId: u._id,
      name:   `${u.firstName} ${u.lastName}`,
      avatar: u.avatar
    }));

    res.json(results);
  } catch (err) {
    console.error('User search error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/:userId', ensureAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .select('firstName lastName avatar bio occupation city zip interests');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      userId:    user._id,
      name:      `${user.firstName} ${user.lastName}`,
      avatar:    user.avatar,
      bio:       user.bio,
      occupation: user.occupation,
      location:  `${user.city}, ${user.zip}`,
      interests: user.interests,            // array of strings
    });
  } catch (err) {
    console.error('Public profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
