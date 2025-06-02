// backend/routes/events.js
const express      = require('express');
const router       = express.Router();
const Event        = require('../models/Event');

// Simple middleware to check for a logged‐in user
const ensureAuth = (req, res, next) => {
  if (req.session?.user) {
    req.user = req.session.user;
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
};

const ensureAdmin  = require('../middleware/ensureAdmin');

/**
 * 1. GET /api/events
 *    List upcoming events (date ≥ today). Ordered by date ascending.
 */
router.get('/', ensureAuth, async (req, res) => {
  try {
    const from = req.query.from ? new Date(req.query.from) : new Date();
    const events = await Event.find({ date: { $gte: from } }).sort({ date: 1 });
    return res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    return res.status(500).json({ message: 'Could not fetch events' });
  }
});

/**
 * 2. GET /api/events/:id
 *    Event details (including attendee list).
 */
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    const evt = await Event.findById(req.params.id).populate('attendees', 'firstName lastName');
    if (!evt) return res.status(404).json({ message: 'Event not found' });
    return res.json(evt);
  } catch (err) {
    console.error('Error fetching event:', err);
    return res.status(500).json({ message: 'Could not fetch event' });
  }
});

/**
 * 3. POST /api/events
 *    (Admin only) Create new event.
 */
router.post('/', ensureAuth, ensureAdmin, async (req, res) => {
  try {
    const { title, description, date, zip, city, minAge, maxAge, image, capacity } = req.body;
    const evt = await Event.create({ title, description, date, zip, city, minAge, maxAge, image, capacity });
    return res.status(201).json(evt);
  } catch (err) {
    console.error('Error creating event:', err);
    return res.status(500).json({ message: 'Could not create event' });
  }
});

/**
 * 4. PUT /api/events/:id
 *    (Admin only) Update event data.
 */
router.put('/:id', ensureAuth, ensureAdmin, async (req, res) => {
  try {
    const { title, description, date, zip, city, minAge, maxAge, image, capacity } = req.body;
    const updates = { title, description, date, zip, city, minAge, maxAge, image, capacity };
    const evt = await Event.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!evt) return res.status(404).json({ message: 'Event not found' });
    return res.json(evt);
  } catch (err) {
    console.error('Error updating event:', err);
    return res.status(500).json({ message: 'Could not update event' });
  }
});

/**
 * 5. DELETE /api/events/:id
 *    (Admin only) Delete an event.
 */
router.delete('/:id', ensureAuth, ensureAdmin, async (req, res) => {
  try {
    const evt = await Event.findByIdAndDelete(req.params.id);
    if (!evt) return res.status(404).json({ message: 'Event not found' });
    return res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error('Error deleting event:', err);
    return res.status(500).json({ message: 'Could not delete event' });
  }
});

/**
 * 6. POST /api/events/:id/rsvp
 *    (User only) RSVP to an event, if not sold out and age within [minAge, maxAge].
 */
router.post('/:id/rsvp', ensureAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const evt = await Event.findById(req.params.id);
    if (!evt) return res.status(404).json({ message: 'Event not found' });

    // Sold out check:
    if (evt.attendees.length >= evt.capacity) {
      return res.status(400).json({ message: 'Sold out' });
    }

    // Age check:
    const userDob = new Date(req.user.dob);
    const today   = new Date();
    let age = today.getFullYear() - userDob.getFullYear();
    if (
      today.getMonth() < userDob.getMonth() ||
      (today.getMonth() === userDob.getMonth() && today.getDate() < userDob.getDate())
    ) {
      age--;
    }
    if (age < evt.minAge || age > evt.maxAge) {
      return res.status(403).json({ message: 'Not in age range' });
    }

    // Already RSVPed?
    if (evt.attendees.some(a => a.toString() === userId.toString())) {
      return res.status(400).json({ message: 'Already RSVPed' });
    }

    evt.attendees.push(userId);
    await evt.save();
    return res.json({ message: 'RSVP successful', attendees: evt.attendees.length });
  } catch (err) {
    console.error('Error RSVPing:', err);
    return res.status(500).json({ message: 'Could not RSVP' });
  }
});

/**
 * 7. DELETE /api/events/:id/rsvp
 *    (User only) Cancel RSVP.
 */
router.delete('/:id/rsvp', ensureAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const evt = await Event.findById(req.params.id);
    if (!evt) return res.status(404).json({ message: 'Event not found' });

    evt.attendees = evt.attendees.filter(a => a.toString() !== userId.toString());
    await evt.save();
    return res.json({ message: 'RSVP canceled', attendees: evt.attendees.length });
  } catch (err) {
    console.error('Error canceling RSVP:', err);
    return res.status(500).json({ message: 'Could not cancel RSVP' });
  }
});

module.exports = router;
