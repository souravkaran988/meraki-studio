const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');

const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/'); },
  filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage: storage });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, tags, userId } = req.body;
    
    let imageUrl = req.body.image; 
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // Use req.body.userId if req.user is not available yet
    const newPost = new Post({
      user: userId || req.body.user, // Getting user ID from frontend
      title,
      description,
      tags: typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags,
      image: imageUrl
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error("Post Error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) { res.status(500).json(err); }
});

router.get('/profile/:username', async (req, res) => {
  try {
    const posts = await Post.find().populate('user');
    const userPosts = posts.filter(p => p.user && p.user.username === req.params.username);
    res.status(200).json(userPosts);
  } catch (err) { res.status(500).json(err); }
});

module.exports = router;