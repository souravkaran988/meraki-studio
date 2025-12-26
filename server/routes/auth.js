const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs'); // For password security
const jwt = require('jsonwebtoken'); // For login tokens

// REGISTER (Sign Up)
router.post('/register', async (req, res) => {
  try {
    // 1. Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return res.status(400).json("User already exists");

    // 2. Encrypt the password (security)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // 3. Create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    });

    // 4. Save to DB
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    // 1. Find user
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("User not found");

    // 2. Check password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json("Wrong password");

    // 3. Create Login Token (Optional but good practice)
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;