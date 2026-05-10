const Post = require('../models/Post');

const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate('author', 'name email');
    res.json({ success: true, posts });
  } catch (err) {
    next(err);
  }
};

const createPost = async (req, res, next) => {
  try {
    const { title, body } = req.body;
    // ✅ FIX 5: user._id → req.user._id
    const post = await Post.create({ title, body, author: req.user._id });
    // ✅ FIX 6: post return kiya response mein
    res.status(201).json({ success: true, post });
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    // ✅ FIX 7: sirf author hi delete kar sakta hai
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPosts, createPost, deletePost };