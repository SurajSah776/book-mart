const express = require("express");
const { getAllUsers, deleteUser, deletePost } = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.delete("/posts/:id", deletePost);

module.exports = router;