// backend/routes/posts.js
const express = require('express');
const router  = express.Router();
const Post    = require('../models/Post');           // ← add this
const postController = require('../controllers/postController');

// Auth guard
function ensureAuth(req, res, next) {
  if (req.session && req.session.user && req.session.user._id) {
    req.user = req.session.user;
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized: please log in.' });
}

// Public feed endpoint (requires login)
router.get('/feed', ensureAuth, async (req, res) => {
  try {
    const posts = await Post
      .find()
      .populate('author', 'firstName lastName')    // optional
      .sort({ createdAt: -1 });
    return res.json(posts);
  } catch (err) {
    console.error('Error fetching posts feed:', err);
    return res.status(500).json({ message: 'Server error while loading feed' });
  }
});

// All other post routes also require auth
router.use(ensureAuth);

router.post('/', postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/:postId', postController.getPostById);
router.post('/:postId/like', postController.likePost);
router.post('/:postId/comments', postController.addComment);
router.delete('/:postId', postController.deletePost);
router.delete('/:postId/comments/:commentId', postController.deleteComment);

module.exports = router;
