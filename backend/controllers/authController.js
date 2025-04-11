const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Configure nodemailer
const createTransporter = () => {
    // Check if required environment variables are set
    if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
        throw new Error('Email configuration is missing. Please set EMAIL and EMAIL_PASSWORD environment variables.');
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

// Function to generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send OTP email
const sendOTPEmail = async (user) => {
    try {
        const transporter = createTransporter();
        const otp = generateOTP();

        // Save OTP to user
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Verify Your Email - BookMart',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Welcome to BookMart!</h2>
                    <p>Thank you for registering. Please use the following OTP to verify your email address:</p>
                    <div style="margin: 20px 0; text-align: center;">
                        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4CAF50;">${otp}</div>
                    </div>
                    <p style="color: #666;">This OTP will expire in 10 minutes.</p>
                    <p style="color: #999; font-size: 12px;">If you didn't create an account, you can safely ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        if (error.message.includes('Email configuration is missing')) {
            throw new Error('Server configuration error: Email service not properly configured');
        } else if (error.code === 'EAUTH') {
            throw new Error('Email authentication failed. Please check email credentials.');
        } else if (error.code === 'ETIMEDOUT') {
            throw new Error('Email service connection timed out. Please try again.');
        }
        throw error;
    }
};

// Export sendOTPEmail for use in routes
exports.sendOTPEmail = sendOTPEmail;


// Register new user
exports.registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, phone } = req.body;

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match..." });
        }

        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists😐" });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone
        });
        await user.save();

        // Send OTP email
        try {
            await sendOTPEmail(user);
            res.status(201).json({
                message: "Registration successful! Please check your email for OTP.",
                email: email
            });
        } catch (emailError) {
            // If email fails to send, delete the user and return specific error
            await User.findOneAndDelete({ email });
            console.error('Detailed email error:', emailError);
            res.status(500).json({
                message: emailError.message || "Failed to send verification email. Please try registering again."
            });
        }

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// User Login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User doesn't exists..|| Invalid credentials" });

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(400).json({ message: "Please verify your email before logging in." });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        // res.status(200).json({ token, user });
        // res.json({ token, message: "Login successful" });

        // Replaced by:
        res.status(200).json({
            token,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: `${user.firstName} ${user.lastName}`
            },
            message: "Login successful"
        });
    } catch (error) {
        console.error("Login error : ", error);
        res.status(500).json({ message: "Server Error" });
    }
};
