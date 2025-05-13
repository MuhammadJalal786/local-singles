// backend/controllers/postController.js
const Post = require('../models/Post');

exports.getFeed = async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate('author', 'name avatar')
    .populate('comments.author', 'name');
  res.json(posts);
};

exports.createPost = async (req, res) => {
  const { content, image } = req.body;
  const post = new Post({
    author: req.session.user._id,
    content,
    image
  });
  await post.save();
  res.status(201).json(post);
};

exports.likePost = async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: 1 } },
    { new: true }
  );
  res.json(post);
};

exports.addComment = async (req, res) => {
  const { text } = req.body;
  const post = await Post.findById(req.params.id);
  post.comments.push({ author: req.session.user._id, text });
  await post.save();
  res.json(post);
};
