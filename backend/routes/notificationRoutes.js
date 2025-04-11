const express = require('express');
const {
    getUserNotifications,
    markAsRead,
    markAllAsRead
} = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Get all notifications for the current user
router.get('/', authMiddleware, getUserNotifications);

// Mark a notification as read
router.put('/:notificationId/read', authMiddleware, markAsRead);

// Mark all notifications as read
router.put('/read-all', authMiddleware, markAllAsRead);

module.exports = router;