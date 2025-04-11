const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        // Verify token and decode payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Make sure decoded contains userId
        if (!decoded.userId) {
            return res.status(401).json({ message: "Invalid token format" });
        }

        // Attach user ID to request
        req.user = { userId: decoded.userId };
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};