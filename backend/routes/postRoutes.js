const express = require('express');
const { createPost, getPosts, getPostById } = require("../controllers/postController");
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Remove multer - we'll handle uploads separately
router.post('/', authMiddleware, createPost);
router.get('/', authMiddleware, getPosts);
router.get('/:id', authMiddleware, getPostById);

module.exports = router;