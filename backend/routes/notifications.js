const express = require('express');
const router  = express.Router();
const Notification = require('../models/Notification');

// Reuse your simple auth guard:
const ensureAuth = (req, res, next) => {
  if (req.session?.user?._id) {
    req.userId = req.session.user._id;
    return next();
  }
  return res.status(401).json({ message: 'Not authenticated' });
};

// GET /api/notifications → latest 10 for current user
router.get('/', ensureAuth, async (req, res) => {
  try {
    const notes = await Notification.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(notes);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ message: 'Could not fetch notifications.' });
  }
});

// POST /api/notifications/mark-all-read
router.post('/mark-all-read', ensureAuth, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.userId, read: false },
      { read: true }
    );
    res.json({ message: 'All notifications marked read.' });
  } catch (err) {
    console.error('Error marking all read:', err);
    res.status(500).json({ message: 'Could not mark all as read.' });
  }
});

// POST /api/notifications/:id/mark-read
router.post('/:id/mark-read', ensureAuth, async (req, res) => {
  try {
    const note = await Notification.findOne({
      _id: req.params.id,
      userId: req.userId
    });
    if (note) {
      note.read = true;
      await note.save();
    }
    res.json({ message: 'Notification marked read.' });
  } catch (err) {
    console.error('Error marking read:', err);
    res.status(500).json({ message: 'Could not mark notification as read.' });
  }
});

module.exports = router;
