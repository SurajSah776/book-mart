const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require('./routes/transactionRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const messageRoutes = require('./routes/messageRoutes');


const adminRoutes = require('./routes/adminRoutes');


dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// Middlewares
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    exposedHeaders: ['Content-Disposition']
}));
app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true })); // Add this for form data

// Serve static files from backend/public
app.use(express.static(path.join(__dirname, 'public')));

// Update your upload endpoint to save to backend/public/uploads
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.post('/api/uploads', (req, res) => {
    if (!req.files || !req.files.image) {
        return res.status(400).json({ error: 'No image uploaded' });
    }

    const image = req.files.image;

    // Validate file type
    if (!image.mimetype.startsWith('image/')) {
        return res.status(400).json({ error: 'Only image files are allowed' });
    }

    // Validate file size (5MB max)
    if (image.size > 5 * 1024 * 1024) {
        return res.status(400).json({ error: 'File size must be less than 5MB' });
    }

    const filename = `book-${Date.now()}${path.extname(image.name)}`;
    const uploadPath = path.join(uploadsDir, filename);

    image.mv(uploadPath, (err) => {
        if (err) {
            console.error('File save error:', err);
            return res.status(500).json({ error: 'Error saving file' });
        }
        res.json({ imageUrl: `/uploads/${filename}` });
    });
});


// Routes
app.use("/api/auth", authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

// Socket.io connection
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('joinConversation', (conversationId) => {
        socket.join(conversationId);
        console.log(`User joined conversation: ${conversationId}`);
    });

    socket.on('sendMessage', (message) => {
        io.to(message.conversationId).emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));