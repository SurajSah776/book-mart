const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    bookName: {
        type: String,
        required: true,
        trim: true
    },
    authorName: {
        type: String,
        required: true,
        trim: true
    },
    publicationName: {
        type: String,
        trim: true
    },
    isbn: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        enum: ['New', 'Used', 'Prefer not to say'],
        default: 'Prefer not to say'
    },
    listingType: {
        type: String,
        enum: ['donate', 'sell'],
        required: true
    },
    price: {
        type: Number,
        required: function () {
            return this.listingType === 'sell';
        }
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    paymentMethod: {
        type: String,
        enum: ['cash_on_delivery'],
        default: 'cash_on_delivery'
    },
    image: {
        type: String // Will store the file path
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['available', 'donated', 'sold', 'pending'],
        default: 'available'
    },
    requestedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
}, { timestamps: true });

module.exports = mongoose.model("Post", PostSchema);