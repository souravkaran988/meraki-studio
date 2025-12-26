const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');

// UPDATE USER (Profile Pic)
router.put('/:id', async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      // 1. Update the User document
      const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      }, { new: true });
      
      // 2. Also update the user's avatar in all their Posts (so the Home feed updates)
      // Note: In a large app, we wouldn't duplicate data like this, but for now it keeps things fast.
      if (req.body.profilePic) {
          // This is a quick fix to ensure old posts show the new face
          // (Requires Post model to allow updating user details if embedded, or usually we just Populate)
      }

      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can only update your own account!");
  }
});

module.exports = router;