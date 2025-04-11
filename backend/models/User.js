const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },

        lastName: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        },
        profilePic: {
            type: String,
            default: ''
        },
        posts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }],
        credits: {
            type: Number,
            default: 2,  // New users get 2 credits
            min: 0
        },
        booksDonated: {
            type: Number,
            default: 0
        },
        booksReceived: {
            type: Number,
            default: 0
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        otp: {
            type: String
        },
        otpExpires: {
            type: Date
        }
    }
);
// Add virtual for full name
UserSchema.virtual('username').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included when converting to JSON
UserSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model("User", UserSchema);
