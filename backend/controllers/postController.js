// backend/controllers/postController.js
const Post = require('../models/Post');

// 1. Create a new post
exports.createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    const newPost = await Post.create({
      author: req.session.user._id,
      content,
      image
    });
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username')
      .populate('comments.author', 'username')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get a single post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('author', 'username')
      .populate('comments.author', 'username');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Like a post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Add a comment
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.comments.push({
      author: req.session.user._id,
      text
    });
    await post.save();
    // re-populate comment authors
    await post.populate('comments.author', 'username').execPopulate();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.postId,
      author: req.session.user._id
    });
    if (!post) return res.status(404).json({ error: 'Post not found or unauthorized' });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 7. Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    // only comment author or post author can delete
    if (
      comment.author.toString() !== req.session.user._id.toString() &&
      post.author.toString() !== req.session.user._id.toString()
    ) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    comment.remove();
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
