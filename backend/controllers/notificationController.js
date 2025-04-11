const Notification = require('../models/Notification');
const User = require('../models/User');

// Get all notifications for the current user
exports.getUserNotifications = async (req, res) => {
    try {
        const userId = req.user.userId;

        const notifications = await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 })
            .populate('sender', 'firstName lastName profilePic email phone')
            .populate('relatedPost', 'bookName authorName image listingType price address paymentMethod')
            .populate({
                path: 'relatedTransaction',
                populate: [
                    { path: 'fromUser', select: 'firstName lastName email phone' },
                    { path: 'book', select: 'bookName authorName image listingType price address paymentMethod' },
                    { path: 'toUser', select: 'firstName lastName email phone' }
                ]
            });

        res.json(notifications);
    } catch (error) {
        res.status(500).json({
            message: error.message || "Failed to fetch notifications"
        });
    }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user.userId;

        const notification = await Notification.findById(notificationId);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        // Ensure the notification belongs to the current user
        if (notification.recipient.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized" });
        }

        notification.isRead = true;
        await notification.save();

        res.json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Failed to update notification"
        });
    }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.userId;

        await Notification.updateMany(
            { recipient: userId, isRead: false },
            { isRead: true }
        );

        res.json({ message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Failed to update notifications"
        });
    }
};

// Create a notification (internal use only)
exports.createNotification = async (recipientId, senderId, type, message, relatedPost = null, relatedTransaction = null) => {
    try {
        const notification = new Notification({
            recipient: recipientId,
            sender: senderId,
            type,
            message,
            relatedPost,
            relatedTransaction
        });

        await notification.save();
        return notification;
    } catch (error) {
        console.error("Failed to create notification:", error);
        return null;
    }
};