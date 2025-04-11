const Message = require('../models/Message');
const User = require('../models/User');

// Send a new message
exports.sendMessage = async (req, res) => {
    try {
        const { recipientId, postId, content } = req.body;
        const senderId = req.user.userId;

        const message = new Message({
            sender: senderId,
            recipient: recipientId,
            postId,
            content
        });

        await message.save();

        // Populate sender and recipient details
        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'firstName lastName profilePic')
            .populate('recipient', 'firstName lastName profilePic');

        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(500).json({ message: 'Error sending message', error: error.message });
    }
};

// Get conversation messages for a specific post between two users
exports.getConversation = async (req, res) => {
    try {
        const { postId, otherUserId } = req.params;
        const userId = req.user.userId;

        const messages = await Message.find({
            postId,
            $or: [
                { sender: userId, recipient: otherUserId },
                { sender: otherUserId, recipient: userId }
            ]
        })
            .sort({ createdAt: 1 })
            .populate('sender', 'firstName lastName profilePic')
            .populate('recipient', 'firstName lastName profilePic');

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching conversation', error: error.message });
    }
};

// Get all conversations for the current user
exports.getAllConversations = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Get all messages where user is either sender or recipient
        const messages = await Message.find({
            $or: [{ sender: userId }, { recipient: userId }]
        })
            .sort({ createdAt: -1 })
            .populate('sender', 'firstName lastName profilePic')
            .populate('recipient', 'firstName lastName profilePic')
            .populate('postId', 'bookName image');

        // Filter out messages with deleted posts or users
        const validMessages = messages.filter(message =>
            message.postId &&
            message.sender &&
            message.recipient &&
            message.postId._id &&
            message.sender._id &&
            message.recipient._id
        );

        // Group messages by conversation (unique combination of post and other user)
        const conversations = validMessages.reduce((acc, message) => {
            const otherUser = message.sender._id.toString() === userId.toString()
                ? message.recipient
                : message.sender;

            const key = `${message.postId._id}_${otherUser._id}`;

            if (!acc[key]) {
                acc[key] = {
                    postId: message.postId,
                    otherUser,
                    lastMessage: message,
                    unreadCount: message.recipient._id.toString() === userId.toString() && !message.isRead ? 1 : 0
                };
            } else {
                if (message.recipient._id.toString() === userId.toString() && !message.isRead) {
                    acc[key].unreadCount++;
                }
            }

            return acc;
        }, {});

        res.json(Object.values(conversations));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching conversations', error: error.message });
    }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
    try {
        const { postId, senderId } = req.params;
        const recipientId = req.user.userId;

        await Message.updateMany(
            {
                postId,
                sender: senderId,
                recipient: recipientId,
                isRead: false
            },
            { isRead: true }
        );

        res.json({ message: 'Messages marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error marking messages as read', error: error.message });
    }
};