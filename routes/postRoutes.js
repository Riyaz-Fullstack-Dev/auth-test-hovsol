const express = require('express');
const router = express.Router();
const { getPosts, createPost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getPosts);
router.post('/', protect, createPost);
router.delete('/:id', protect, deletePost);

module.exports = router;
