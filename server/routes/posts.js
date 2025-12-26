const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

// 1. CREATE A POST
router.post('/', async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. GET ALL POSTS (Updated to load comment authors)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username profilePic') // Post Creator
      .populate('comments.user', 'username profilePic'); // Comment Authors
    res.status(200).json(posts.reverse());
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. GET USER'S POSTS
router.get('/profile/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json("User not found");
    
    const posts = await Post.find({ user: user._id })
      .populate('user', 'username profilePic')
      .populate('comments.user', 'username profilePic');
    res.status(200).json(posts.reverse());
  } catch (err) {
    res.status(500).json(err);
  }
});

// 4. LIKE / UNLIKE
router.put('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.likes.includes(req.body.userId)) {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("Unliked");
    } else {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("Liked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// 5. COMMENT ON A POST
router.put('/:id/comment', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = {
      user: req.body.userId,
      text: req.body.text,
      createdAt: new Date()
    };
    await post.updateOne({ $push: { comments: comment } });
    res.status(200).json("Comment added");
  } catch (err) {
    res.status(500).json(err);
  }
});

// 6. DELETE A COMMENT (New Route)
router.put('/:id/comment/delete', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // Remove the comment with the specific ID
    await post.updateOne({ 
        $pull: { comments: { _id: req.body.commentId } } 
    });
    res.status(200).json("Comment deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

// 7. UPDATE A POST
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.user.toString() === req.body.user) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post updated");
    } else {
      res.status(403).json("Access denied");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// 8. DELETE A POST
router.delete('/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json("Post deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;