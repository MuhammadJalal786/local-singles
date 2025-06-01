// backend/controllers/postController.js
const Post = require('../models/Post');

exports.getFeed = async (req, res) => {
  try {
    const userId = req.session.user._id;
    // fetch all posts, newest first, and populate author
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'firstName lastName avatar'); // adjust fields as needed

    // annotate each post with a `hasLiked` boolean for the current user
    const feed = posts.map(post => {
      const hasLiked = post.likes.some(id => id.toString() === userId.toString());
      return {
        _id:      post._id,
        author:   post.author,
        content:  post.content,
        image:    post.image,
        likes:    post.likes.length,
        hasLiked, 
        comments: post.comments,
        createdAt: post.createdAt
      };
    });

    return res.json(feed);
  } catch (err) {
    console.error('Error in getFeed:', err);
    return res.status(500).json({ message: 'Could not fetch feed' });
  }
};


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
    const postId = req.params.postId;
    const userId = req.session.user._id; // ensureAuth already put user in session

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Check if user has already liked:
    const index = post.likes.findIndex(id => id.toString() === userId.toString());
    if (index === -1) {
      // not yet liked → add user to likes
      post.likes.push(userId);
    } else {
      // already liked → remove from array (toggle off)
      post.likes.splice(index, 1);
    }

    await post.save();
    // return the new like count and whether the user “hasLiked”
    return res.json({
      likesCount: post.likes.length,
      hasLiked:   index === -1 // true if we just added
    });
  } catch (err) {
    console.error('Error in likePost:', err);
    return res.status(500).json({ message: 'Could not toggle like' });
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
