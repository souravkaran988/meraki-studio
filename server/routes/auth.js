const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

// Local storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/register', upload.single('profilePic'), async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        // --- FULL URL FIX ---
        const baseUrl = "https://meraki-art.onrender.com"; 
        const profilePicPath = req.file 
            ? `${baseUrl}/uploads/${req.file.filename}` 
            : `${baseUrl}/uploads/default-avatar.png`;

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            profilePic: profilePicPath 
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Error during registration" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const { password: _, ...userData } = user._doc;
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;