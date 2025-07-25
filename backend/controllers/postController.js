const Post = require('../models/Post.js');
const User = require('../models/User');

// Create post
exports.createPost = async (req, res) => {
    try {
        const userId = req.user._id || req.user.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const newPost = new Post({
            bookName: req.body.bookName,
            authorName: req.body.authorName,
            publicationName: req.body.publicationName,
            isbn: req.body.isbn,
            category: req.body.category,
            description: req.body.description,
            image: req.body.image,
            listingType: req.body.listingType,
            price: req.body.price,
            address: req.body.address,
            paymentMethod: req.body.paymentMethod,
            user: userId
        });

        const savedPost = await newPost.save();

        // Update user's posts array
        await User.findByIdAndUpdate(
            userId,
            { $push: { posts: savedPost._id } },
            { new: true }
        );

        // Populate user data in the response
        const populatedPost = await Post.findById(savedPost._id)
            .populate('user', 'firstName lastName profilePic createdAt');

        res.status(201).json(populatedPost);
    } catch (error) {
        console.error("Post creation error:", error);
        res.status(500).json({
            error: error.message,
            details: error.stack
        });
    }
};

// Get all posts (updated for server-side filtering and searching)
exports.getPosts = async (req, res) => {
    try {
        let query = {};

        if (req.query.user) {
            query.user = req.query.user;
        }

        if (req.query.search) {
            query.$or = [
                { bookName: { $regex: req.query.search, $options: 'i' } },
                { authorName: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        if (req.query.category) {
            query.category = req.query.category;
        }

        if (req.query.listingType) {
            if (req.query.listingType === 'Exchange') {
                query.listingType = 'donate';
            } else if (req.query.listingType === 'Buy') {
                query.listingType = 'sell';
            }
        }

        const posts = await Post.find(query)
            .sort({ createdAt: -1 }) // Newest first
            .populate({
                path: 'user',
                select: 'firstName lastName profilePic createdAt',
            });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single post (updated with better population)
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate({
                path: 'user',
                select: 'firstName lastName profilePic email phone createdAt',
            });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Additional controller for user's posts
exports.getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.params.userId })
            .sort({ createdAt: -1 })
            .populate('user', 'firstName lastName profilePic');

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};