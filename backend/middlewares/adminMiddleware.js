const User = require("../models/User");

module.exports = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: "Admin access required" });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};