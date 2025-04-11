const express = require('express');
const {
    sendMessage,
    getConversation,
    getAllConversations,
    markAsRead
} = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Send a new message
router.post('/send', sendMessage);

// Get conversation messages for a specific post between two users
router.get('/conversation/:postId/:otherUserId', getConversation);

// Get all conversations for the current user
router.get('/conversations', getAllConversations);

// Mark messages as read
router.put('/read/:postId/:senderId', markAsRead);

module.exports = router;