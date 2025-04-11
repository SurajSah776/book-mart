const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Post = require('../models/Post');
const { createNotification } = require('./notificationController');

exports.requestBook = async (req, res) => {
    try {
        const { postId } = req.body;
        const requesterId = req.user.userId;

        // Get the post and verify it's available
        const post = await Post.findById(postId).populate('user', 'firstName lastName');
        if (!post) {
            return res.status(404).json({ message: "Book not found" });
        }
        if (post.status !== 'available') {
            return res.status(400).json({
                message: "This book is no longer available"
            });
        }

        // Check if already requested
        if (post.requestedBy.includes(requesterId)) {
            return res.status(400).json({
                message: "You've already requested this book"
            });
        }

        // Prevent users from requesting their own books
        if (post.user._id.toString() === requesterId.toString()) {
            return res.status(400).json({
                message: "You cannot request your own book"
            });
        }

        // Get requester
        const requester = await User.findById(requesterId);

        // Determine transaction type based on listing type
        const transactionType = post.listingType === 'donate' ? 'credit' : 'purchase';

        // For credit transactions, check if user has enough credits
        if (transactionType === 'credit' && requester.credits < 1) {
            return res.status(400).json({
                message: "You need at least 1 credit to request this book"
            });
        }

        // Create transaction record
        const transaction = new Transaction({
            book: postId,
            fromUser: requesterId,
            toUser: post.user._id,
            transactionType,
            status: 'pending',
            amount: post.price || 0
        });

        // Update post with request
        post.requestedBy.push(requesterId);
        post.status = 'pending';

        // For credit transactions, deduct credit immediately (will be refunded if rejected)
        // For purchase transactions, no credits are deducted
        if (transactionType === 'credit') {
            requester.credits -= 1;
            await requester.save();
        }

        // Save transaction and post changes
        await Promise.all([
            transaction.save(),
            post.save()
        ]);

        // Create notification for book owner with transaction type info
        const transactionTypeText = transactionType === 'credit' ? 'exchange (for 1 credit)' : 'purchase';
        const notificationMessage = `${requester.firstName} ${requester.lastName} has requested to ${transactionTypeText} your book "${post.bookName}"`;

        await createNotification(
            post.user._id,
            requesterId,
            'book_request',
            notificationMessage,
            postId,
            transaction._id
        );

        res.status(201).json({
            message: "Request submitted successfully",
            remainingCredits: requester.credits,
            transactionType
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Server error"
        });
    }
};

exports.completeTransaction = async (req, res) => {
    try {
        const { transactionId } = req.body;
        const userId = req.user.userId;

        // Get and validate transaction
        const transaction = await Transaction.findById(transactionId)
            .populate('fromUser', 'firstName lastName')
            .populate('toUser', 'firstName lastName')
            .populate('book', 'bookName listingType');

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        if (transaction.toUser._id.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }
        if (transaction.status !== 'pending') {
            return res.status(400).json({
                message: "Transaction already processed"
            });
        }

        // Update book receiver stats
        await User.findByIdAndUpdate(transaction.fromUser._id, {
            $inc: { booksReceived: 1 }
        });

        // Handle transaction based on type
        let bookOwner;
        let newStatus;

        if (transaction.transactionType === 'credit') {
            // For credit transactions, add credit to book owner
            bookOwner = await User.findByIdAndUpdate(
                transaction.toUser._id,
                { $inc: { booksDonated: 1, credits: 1 } },
                { new: true }
            );
            newStatus = 'donated';
        } else {
            // For purchase transactions, just update donation count
            bookOwner = await User.findByIdAndUpdate(
                transaction.toUser._id,
                { $inc: { booksDonated: 1 } },
                { new: true }
            );
            newStatus = 'sold';
        }

        // Update transaction and post status
        transaction.status = 'completed';
        await Post.findByIdAndUpdate(transaction.book._id, {
            status: newStatus
        });

        await transaction.save();

        // Create notification for the requester
        const transactionTypeText = transaction.transactionType === 'credit'
            ? 'exchange request'
            : 'purchase';

        const notificationMessage = `${transaction.toUser.firstName} ${transaction.toUser.lastName} has completed your ${transactionTypeText} for "${transaction.book.bookName}"`;

        await createNotification(
            transaction.fromUser._id,
            transaction.toUser._id,
            'transaction_complete',
            notificationMessage,
            transaction.book._id,
            transaction._id
        );

        res.json({
            message: transaction.transactionType === 'credit'
                ? "Book successfully exchanged"
                : "Book successfully sold",
            updatedCredits: bookOwner.credits
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Server error"
        });
    }
};

exports.rejectRequest = async (req, res) => {
    try {
        const { transactionId } = req.body;
        const userId = req.user.userId;

        // Get and validate transaction
        const transaction = await Transaction.findById(transactionId)
            .populate('fromUser', 'firstName lastName')
            .populate('toUser', 'firstName lastName')
            .populate('book', 'bookName listingType');

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        if (transaction.toUser._id.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }
        if (transaction.status !== 'pending') {
            return res.status(400).json({
                message: "Transaction already processed"
            });
        }

        // For credit transactions, refund the credit to requester
        if (transaction.transactionType === 'credit') {
            await User.findByIdAndUpdate(
                transaction.fromUser._id,
                { $inc: { credits: 1 } }
            );
        }

        // Update transaction and post status
        transaction.status = 'rejected';
        await Post.findByIdAndUpdate(transaction.book._id, {
            status: 'available',
            $pull: { requestedBy: transaction.fromUser._id }
        });

        await transaction.save();

        // Create notification for the requester
        const transactionTypeText = transaction.transactionType === 'credit'
            ? 'exchange request'
            : 'purchase';

        const notificationMessage = `${transaction.toUser.firstName} ${transaction.toUser.lastName} has rejected your ${transactionTypeText} for "${transaction.book.bookName}"`;

        await createNotification(
            transaction.fromUser._id,
            transaction.toUser._id,
            'transaction_rejected',
            notificationMessage,
            transaction.book._id,
            transaction._id
        );

        res.json({
            message: "Transaction rejected successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Server error"
        });
    }
};

// Get all pending requests for a user's books
exports.getPendingRequests = async (req, res) => {
    try {
        const userId = req.user.userId;

        const transactions = await Transaction.find({
            toUser: userId,
            status: 'pending'
        })
            .populate('fromUser', 'firstName lastName email phone profilePic')
            .populate({
                path: 'book',
                select: 'bookName authorName image listingType price address paymentMethod description',
                populate: {
                    path: 'user',
                    select: 'firstName lastName'
                }
            })
            .sort({ createdAt: -1 });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({
            message: error.message || "Server error"
        });
    }
};

// Reject a book request
exports.rejectRequest = async (req, res) => {
    try {
        const { transactionId } = req.body;
        const userId = req.user.userId;

        // Get and validate transaction
        const transaction = await Transaction.findById(transactionId)
            .populate('fromUser', 'firstName lastName credits')
            .populate('toUser')
            .populate('book', 'bookName status requestedBy');

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        if (transaction.toUser._id.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        if (transaction.status !== 'pending') {
            return res.status(400).json({
                message: "Transaction already processed"
            });
        }

        // Update transaction status
        transaction.status = 'rejected';
        await transaction.save();

        // Return credit to requester if this was a credit transaction
        if (transaction.transactionType === 'credit') {
            await User.findByIdAndUpdate(
                transaction.fromUser._id,
                { $inc: { credits: 1 } }
            );
        }

        // Update post status if no other pending requests
        const post = await Post.findById(transaction.book._id);

        // Remove this user from requestedBy array
        post.requestedBy = post.requestedBy.filter(
            userId => userId.toString() !== transaction.fromUser._id.toString()
        );

        // If no more requests, set status back to available
        if (post.requestedBy.length === 0) {
            post.status = 'available';
        }

        await post.save();

        // Create notification for requester
        let notificationMessage;

        if (transaction.transactionType === 'credit') {
            notificationMessage = `${transaction.toUser.firstName} ${transaction.toUser.lastName} has declined your exchange request for "${transaction.book.bookName}". Your credit has been returned.`;
        } else {
            notificationMessage = `${transaction.toUser.firstName} ${transaction.toUser.lastName} has declined your purchase request for "${transaction.book.bookName}".`;
        }

        await createNotification(
            transaction.fromUser._id,
            transaction.toUser._id,
            'transaction_complete',
            notificationMessage,
            transaction.book._id,
            transaction._id
        );

        res.json({
            message: "Request rejected successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Server error"
        });
    }
};