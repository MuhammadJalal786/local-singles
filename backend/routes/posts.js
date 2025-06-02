// backend/routes/posts.js
const express = require('express');
const router = express.Router();
const Post   = require('../models/Post');
const User   = require('../models/User');

// Middleware to ensure the user is authenticated via session:
function requireAuth(req, res, next) {
  if (!req.session?.user?._id) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  next();
}

// GET /api/posts/feed
// Returns the last 20 posts, newest first, with author populated (name + avatarUrl).
router.get('/feed', requireAuth, async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .populate({
        path: 'author',
        select: 'firstName lastName avatarUrl', // assuming your User model has these
      })
      .lean();

    // For convenience, it’s common to send `author.name` in the response:
    const shaped = posts.map((p) => ({
      _id: p._id,
      author: {
        _id: p.author._id,
        name: `${p.author.firstName} ${p.author.lastName}`,
        avatarUrl: p.author.avatarUrl || null,
      },
      content: p.content,
      images: p.images,
      likes: p.likes || [],
      comments: p.comments || [],
      createdAt: p.createdAt,
    }));

    return res.json(shaped);
  } catch (err) {
    console.error('Error fetching feed:', err);
    return res.status(500).json({ message: 'Could not fetch feed' });
  }
});

// POST /api/posts
// Body: { content: String, images?: [String] }
// Creates a new post by the logged-in user.
router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { content, images } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const newPost = new Post({
      author:  userId,
      content: content.trim(),
      images:  Array.isArray(images) ? images : [],
    });

    await newPost.save();
    // Populate author so the client immediately sees name + avatar
    await newPost.populate({
      path: 'author',
      select: 'firstName lastName avatarUrl',
    }).execPopulate();

    return res.status(201).json({
      _id: newPost._id,
      author: {
        _id: newPost.author._id,
        name: `${newPost.author.firstName} ${newPost.author.lastName}`,
        avatarUrl: newPost.author.avatarUrl || null,
      },
      content: newPost.content,
      images: newPost.images,
      likes: newPost.likes,
      comments: newPost.comments,
      createdAt: newPost.createdAt,
    });
  } catch (err) {
    console.error('Error creating post:', err);
    return res.status(500).json({ message: 'Could not create post' });
  }
});

module.exports = router;
