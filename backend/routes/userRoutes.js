const express = require('express');
const userController = require('../controllers/userController.js');
const {
    getCurrentUser,
    getUserById,
    getUserProfile,
    updateUserProfile
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/me', authMiddleware, getCurrentUser);
router.put('/me', authMiddleware, updateUserProfile);
router.get('/:id/profile', authMiddleware, getUserProfile); // Add this route
router.get('/:id', authMiddleware, getUserById);

module.exports = router;