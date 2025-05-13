// backend/routes/posts.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/postController');

// Ensure user is authenticated middleware (you may already have one)
function requireAuth(req, res, next) {
  if (!req.session.user) return res.status(401).send('Unauthorized');
  next();
}

router.get('/feed', requireAuth, ctrl.getFeed);
router.post('/', requireAuth, ctrl.createPost);
router.post('/:id/like', requireAuth, ctrl.likePost);
router.post('/:id/comment', requireAuth, ctrl.addComment);

module.exports = router;
