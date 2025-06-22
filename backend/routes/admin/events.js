// backend/routes/admin/events.js
const express     = require('express');
const router      = express.Router();
const mongoose    = require('mongoose');
const User        = require('../../models/User');
const Event       = require('../../models/Event');
const Message     = require('../../models/Message');
const Notification = require('../../models/Notification');
const ensureAdmin = require('../../middleware/ensureAdmin');

// Helper to compute pending + total attendees
function summarizeAttendees(attendees) {
  const total   = attendees.length;
  const pending = attendees.filter(a => a.status === 'pending').length;
  return { total, pending };
}

/**
 * GET /api/admin/events
 * - Query params:
 *    • search (string): filter title (case-insensitive)
 *    • past   (boolean): "true"→past events, else upcoming
 *    • page   (int), limit (int)
 */
router.get('/', ensureAdmin, async (req, res) => {
  try {
    const { search = '', past = 'false', page = 1, limit = 20 } = req.query;
    const pg   = Math.max(1, parseInt(page));
    const lt   = Math.max(1, parseInt(limit));
    const skip = (pg - 1) * lt;
    const now  = new Date();

    // Build Mongo filter
    const filter = {};
    if (search) filter.title = new RegExp(search, 'i');
    filter.date = past === 'true'
      ? { $lt: now }
      : { $gte: now };

    // Fetch total + page of events
    const [ total, events ] = await Promise.all([
      Event.countDocuments(filter),
      Event.find(filter)
           .sort({ date: past === 'true' ? -1 : 1 })
           .skip(skip)
           .limit(lt)
           .lean()
    ]);

    // Map to DTO
  const data = events.map(e => {
    const { total: attTotal, pending } = summarizeAttendees(e.attendees);
    return {
      eventId:       e._id.toString(),
      title:         e.title,
      date:          e.date,
      address:       e.address,       // now showing address
      startTime:     e.startTime,     // start time string
      attendeeCount: attTotal,
      pendingCount:  pending,
      status:        past === 'true' ? 'Past' : 'Upcoming'
    };
  });

    return res.json({
      events:     data,
      page:       pg,
      totalPages: Math.ceil(total / lt),
      total
    });
  } catch (err) {
    console.error('GET /api/admin/events error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/admin/events/:id
 * Fetch one event (for edit form), including full attendees array
 */
router.get('/:id', ensureAdmin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }
    const e = await Event.findById(req.params.id).lean();
    if (!e) return res.status(404).json({ message: 'Event not found' });
    return res.json(e);
  } catch (err) {
    console.error('GET /api/admin/events/:id error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/admin/events
 * Create a new event (all fields per your schema)
 */
router.post('/', ensureAdmin, async (req, res) => {
  try {
    const ev = new Event(req.body);
    await ev.save();

    // ── Notify ALL users of the new event ───────────────────────────
    {
      const users = await User.find({}).select('_id').lean();
      await Notification.insertMany(
        users.map(u => ({
          userId: u._id,
          type:   'new_event',
          message: `New event "${ev.title}" available!`,
          link:   `/events/${ev._id}`
        }))
      );
    }

    return res.status(201).json(ev);
  } catch (err) {
    console.error('POST /api/admin/events error:', err);
    return res.status(400).json({ message: err.message });
  }
});

/**
 * PUT /api/admin/events/:id
 * Update any event field
 */
router.put('/:id', ensureAdmin, async (req, res) => {
  try {
    const e = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).lean();
    if (!e) return res.status(404).json({ message: 'Event not found' });
    return res.json(e);
  } catch (err) {
    console.error('PUT /api/admin/events/:id error:', err);
    return res.status(400).json({ message: err.message });
  }
});

/**
 * DELETE /api/admin/events/:id
 */
router.delete('/:id', ensureAdmin, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('DELETE /api/admin/events/:id error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PUT /api/admin/events/:id/attendees/:userId
 * Approve or reject an RSVP
 * Body: { status: 'approved'|'rejected' }
 */
router.put('/:id/attendees/:userId', ensureAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved','rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const e = await Event.findById(req.params.id);
    if (!e) return res.status(404).json({ message: 'Event not found' });
    const att = e.attendees.find(a => a.userId.toString() === req.params.userId);
    if (!att) return res.status(404).json({ message: 'Attendee not found' });
    att.status = status;
    await e.save();

    // ── Notify the user of their RSVP decision ───────────────────────
    await Notification.create({
      userId: att.userId,
      type:   'rsvp',
      message: `Your RSVP for "${e.title}" was ${status}.`,
      link:   `/events/${e._id}`
    });

    return res.json({ userId: att.userId, status });
  } catch (err) {
    console.error('PUT attendee status error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/admin/events/:id/announce
 * Broadcast a message to all approved attendees
 * Body: { text: string }
 */
router.post('/:id/announce', ensureAdmin, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Text required' });
    }
    const e = await Event.findById(req.params.id).lean();
    if (!e) return res.status(404).json({ message: 'Event not found' });

    const adminId    = req.session.user._id;
    const recipients = e.attendees
      .filter(a => a.status === 'approved')
      .map(a => a.userId);

    const msgs = recipients.map(to => ({
      from: adminId,
      to,
      text
    }));
    await Message.insertMany(msgs);

    // ── Notify approved attendees via Notifications ────────────────
    await Notification.insertMany(
      recipients.map(to => ({
        userId: to,
        type:   'admin_announcement',
        message: text,
        link:   `/events/${req.params.id}`
      }))
    );

    return res.json({ sentCount: msgs.length });
  } catch (err) {
    console.error('POST announce error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
