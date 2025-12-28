const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, 'avatar-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// UPDATE PROFILE PIC
router.put('/profile-pic', upload.single('profilePic'), async (req, res) => {
  try {
    const { userId } = req.body;
    if (!req.file) return res.status(400).json("No file uploaded");
    
    const imageUrl = `/uploads/${req.file.filename}`;
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { profilePic: imageUrl }, 
      { new: true }
    );
    
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Existing Login/Register logic below...
router.post('/register', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) { res.status(500).json(err); }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");
    res.status(200).json(user);
  } catch (err) { res.status(500).json(err); }
});

module.exports = router;