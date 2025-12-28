const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Setup storage for profile pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, 'avatar-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// UPDATE PROFILE PICTURE
router.put('/profile-pic', upload.single('profilePic'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json("No file uploaded");
    
    // We get the user ID from the body or a token (for now, let's use a placeholder if you don't have middleware)
    const imageUrl = `/uploads/${req.file.filename}`;
    
    // Note: In a real app, you'd find the user by ID from their token
    // For now, we return the path so the frontend updates
    res.status(200).json({ profilePic: imageUrl });
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN (Keep your existing login logic here)
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if(!user) return res.status(404).json("User not found");
        // Simplified for this fix:
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

// REGISTER (Keep your existing register logic here)
router.post('/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;