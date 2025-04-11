const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/User");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// OTP verification route
router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find user with matching email and non-expired OTP
        const user = await User.findOne({
            email,
            otp,
            otpExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        // Update user verification status
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Email verified successfully! You can now login." });
    } catch (error) {
        console.error("OTP verification error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Resend OTP route
router.post("/resend-otp", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "Email is already verified." });
        }

        // Generate new OTP
        const { sendOTPEmail } = require("../controllers/authController");
        await sendOTPEmail(user);

        res.status(200).json({ message: "New OTP has been sent to your email." });
    } catch (error) {
        console.error("Resend OTP error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Add to authRoutes.js or create new userRoutes.js
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
