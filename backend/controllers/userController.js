const User = require('../models/User');
const Post = require('../models/Post');

// Enhanced getCurrentUser with posts
exports.getCurrentUser = async (req, res) => {
    try {
        // Fetch user with their posts populated
        const user = await User.findById(req.user.userId)
            .select('-password') // Exclude sensitive data
            .populate({
                path: 'posts',
                select: 'bookName authorName image createdAt status', // Include status for credit system
                options: { sort: { createdAt: -1 } } // Show newest first
            });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Use the user's actual credits from the database
        const availableCredits = user.credits + (user.booksDonated || 0) - (user.booksReceived || 0);

        // Return user data with credits and posts
        res.json({
            ...user.toObject(),
            postCount: user.posts.length,
            credits: Math.max(0, availableCredits) // Ensure credits don't go negative
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Enhanced getUserById with posts and stats
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate({
                path: 'posts',
                select: 'bookName authorName image category createdAt',
                options: { sort: { createdAt: -1 }, limit: 10 } // 10 latest posts
            });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get additional stats
        const totalPosts = await Post.countDocuments({ user: req.params.id });
        const newPostsCount = await Post.countDocuments({
            user: req.params.id,
            category: 'New'
        });

        res.json({
            user: user.toObject(),
            stats: {
                totalPosts,
                newPostsCount,
                usedPostsCount: totalPosts - newPostsCount
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        // Get user details
        const user = await User.findById(req.params.id)
            .select('-password')
            .lean(); // Convert to plain JS object

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get user's posts with populated user data
        const posts = await Post.find({ user: req.params.id })
            .sort({ createdAt: -1 })
            .populate('user', 'firstName lastName profilePic')
            .lean();

        res.json({
            user,
            posts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// For updating/editing user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, profilePic } = req.body;
        const userId = req.user.userId; // From auth middleware

        // 1. Verify the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 2. Prevent email duplication
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        // 3. Update only the current user's profile
        const updateData = { firstName, lastName, email, phone };
        if (profilePic) {
            updateData.profilePic = profilePic;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId, // Only update the authenticated user
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};