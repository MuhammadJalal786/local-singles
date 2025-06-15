// backend/routes/support.js
const express = require('express');
const router  = express.Router();
const supportController = require('../controllers/supportController');

// Re‐use ensureAuth from user routes
const ensureAuth = (req, res, next) => {
  if (req.session?.user) {
    req.user = req.session.user;
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
};

router.post('/', ensureAuth, supportController.sendSupportMessage);

module.exports = router;
