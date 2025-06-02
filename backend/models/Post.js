// backend/models/Post.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content:   { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  author:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content:   { type: String, required: true },
  images:    [{ type: String }],             // array of image‐URLs (optional)
  likes:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // array of user IDs who liked
  comments:  [commentSchema],                // embedded comments
  createdAt: { type: Date, default: Date.now },
});

// When we populate `author` we want just name & avatarUrl:
postSchema.methods.toJSON = function () {
  const obj = this.toObject();
  // avoid leaking fields we don’t need on the client
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('Post', postSchema);
