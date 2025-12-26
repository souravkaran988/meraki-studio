const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/create', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No image uploaded" });

        const { title, description, tags, userId, username } = req.body;
        
        // --- FULL URL FIX ---
        const baseUrl = "https://meraki-art.onrender.com";
        const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

        const newPost = new Post({
            title,
            description,
            tags: tags ? tags.split(',') : [],
            image: imageUrl,
            userId,
            username
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch posts" });
    }
});

module.exports = router;