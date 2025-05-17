// backend/routes/posts.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

function ensureAuth(req, res, next) {
  if (req.session && req.session.user) {
    // attach the session user onto req.user for your routes
    req.user = req.session.user;
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized: please log in.' });
}

// …apply ensureAuth to your /feed route as you already do…
router.get('/feed', ensureAuth, async (req, res) => {
  // now you can freely use req.user here
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

router.use(ensureAuth);

// Create a new post
router.post('/', postController.createPost);

// Get all posts
router.get('/', postController.getAllPosts);

// Get one post
router.get('/:postId', postController.getPostById);

// Like a post
router.post('/:postId/like', postController.likePost);

// Add a comment
router.post('/:postId/comments', postController.addComment);

// Delete a post
router.delete('/:postId', postController.deletePost);

// Delete a comment
router.delete('/:postId/comments/:commentId', postController.deleteComment);

module.exports = router;
