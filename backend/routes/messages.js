// backend/routes/messages.js
const express  = require('express');
const mongoose = require('mongoose');
const router   = express.Router();
const Message  = require('../models/Message');
const User     = require('../models/User');
const ensureAuth = (req, res, next) => {
  if (req.session?.user) {
    req.userId = req.session.user._id;
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
};

/**
 * GET /api/messages
 * List all threads: otherUserId, name, avatar, lastMessage, timestamp
 */
router.get('/', ensureAuth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const threads = await Message.aggregate([
      { $match: { $or: [ { from: userId }, { to: userId } ] } },
      { $sort: { createdAt: -1 } },
      { $group: {
          _id: {
            $cond: [
              { $eq: ['$from', userId] },
              '$to',
              '$from'
            ]
          },
          lastMessage: { $first: '$text' },
          timestamp:   { $first: '$createdAt' }
        }
      },
      { $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $project: {
          userId:      '$_id',
          name:        { $concat: ['$user.firstName', ' ', '$user.lastName'] },
          avatar:      '$user.avatar',
          lastMessage: 1,
          timestamp:   1
        }
      },
      { $sort: { timestamp: -1 } }
    ]);
    res.json(threads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/messages/:otherUserId
 * Full conversation sorted oldest→newest
 */
router.get('/:otherUserId', ensureAuth, async (req, res) => {
  try {
    const otherId = req.params.otherUserId;
    const conv = await Message.find({
      $or: [
        { from: req.userId, to:   otherId },
        { from: otherId,   to:   req.userId }
      ]
    }).sort({ createdAt: 1 });
    res.json(conv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/messages/:otherUserId
 * Send a new text message
 * Body: { text: string }
 */
router.post('/:otherUserId', ensureAuth, async (req, res) => {
  try {
    const otherId = req.params.otherUserId;
    const { text } = req.body;
    const message = new Message({
      from: req.userId,
      to:   otherId,
      text
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
