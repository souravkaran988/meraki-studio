const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');

// 1. Setup Storage
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// 2. CREATE POST 
// Note: We use '/' here because '/api/posts' is already prefixed in index.js
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    
    let imageUrl = req.body.image; 
    if (req.file) {
      // Use relative path for the database
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!imageUrl) {
      return res.status(400).json({ message: "Image is required" });
    }

    const newPost = new Post({
      user: req.body.userId || "658af...your_test_id", // Replace with actual user ID logic
      title,
      description,
      tags: typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags,
      image: imageUrl
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// 3. GET ALL POSTS (For Home Page)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 4. GET USER POSTS
router.get('/profile/:username', async (req, res) => {
  try {
    const posts = await Post.find().populate('user');
    const userPosts = posts.filter(p => p.user && p.user.username === req.params.username);
    res.status(200).json(userPosts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;