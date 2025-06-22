const express     = require('express');
const router      = express.Router();
const User        = require('../../models/User');
const Event       = require('../../models/Event');
const Message     = require('../../models/Message');
const ensureAdmin = require('../../middleware/ensureAdmin');
const Notification = require('../../models/Notification');


router.use(ensureAdmin);

/**
 * POST /api/admin/messages/broadcast
 * Body: {
 *   filters: {
 *     gender?, ageMin?, ageMax?,
 *     city?, eventIds?: string[], labels?: string[]
 *   },
 *   text: string
 * }
 */
router.post('/broadcast', async (req, res) => {
  try {
    const { filters = {}, text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ message: 'Message text required' });
    }

    // Base user filter
    const userFilter = { isBlocked: false };
    if (filters.gender) userFilter.sex = filters.gender;
    if (filters.city)   userFilter.city = filters.city;
    if (filters.labels && filters.labels.length) {
      userFilter.labels = { $in: filters.labels };
    }

    let users = await User.find(userFilter).lean();

    // Age filter
    if (filters.ageMin != null || filters.ageMax != null) {
      const now = Date.now();
      users = users.filter(u => {
        if (!u.dob) return false;
        const age = Math.abs(new Date(now - u.dob.getTime()).getUTCFullYear() - 1970);
        if (filters.ageMin != null && age < filters.ageMin) return false;
        if (filters.ageMax != null && age > filters.ageMax) return false;
        return true;
      });
    }

    // Event filter (users who RSVPed approved)
    if (filters.eventIds && filters.eventIds.length) {
      const evts = await Event.find({
        _id: { $in: filters.eventIds },
        'attendees.status': 'approved'
      }).select('attendees').lean();
      const eventUserIds = new Set(
        evts.flatMap(e => e.attendees.map(a => a.userId.toString()))
      );
      users = users.filter(u => eventUserIds.has(u._id.toString()));
    }

    users = users.filter(u => u._id.toString() !== req.session.user._id);

    // Create messages
    const adminId = req.session.user._id;
    const msgs = users.map(u => ({
      from: adminId,
      to:   u._id,
      text
    }));
    await Message.insertMany(msgs);

    await Notification.insertMany(
      users.map(u => ({
      userId: u._id,
      type:   'message',
      message: text,
      link:   `/messages/${adminId}`
    }))
  );

    res.json({ sentCount: msgs.length });
  } catch (err) {
    console.error('POST /api/admin/messages/broadcast error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
