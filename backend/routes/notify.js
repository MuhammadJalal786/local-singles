// backend/routes/notify.js
const express      = require('express');
const router       = express.Router();
const Notification = require('../models/Notification');

router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    await Notification.create({ email });
    return res.json({ message: 'Thanks — we’ll let you know!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Oops! Something went wrong.' });
  }
});

module.exports = router;
