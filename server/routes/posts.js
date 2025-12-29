const router = require("express").Router();
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// 1. CLOUDINARY CONFIGURATION
cloudinary.config({
  cloud_name: "dvvlo2wsr",
  api_key: "857828378427176",
  api_secret: "O9dA1_BLMm7UM79zXAq6Y_JOqyE",
});

// 2. SET UP STORAGE ENGINE FOR MULTER
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "meraki_uploads",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage: storage });

// 3. CREATE POST ROUTE (The Fix)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    // req.file.path is now the Cloudinary URL automatically thanks to multer-storage-cloudinary
    const newPost = new (mongoose.model("Post"))({
      username: req.body.username,
      title: req.body.title,
      description: req.body.description,
      image: req.file.path, // This saves the Cloudinary HTTPS link!
      tags: req.body.tags,
    });

    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json(err);
  }
});

// 4. LIKE / UNLIKE ROUTE
router.put("/:id/like", async (req, res) => {
  try {
    const post = await (mongoose.model("Post")).findById(req.params.id);
    const { username } = req.body;

    if (!post.likes.includes(username)) {
      await post.updateOne({ $push: { likes: username } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: username } });
      res.status(200).json("The post has been unliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// 5. GET ALL POSTS (Example helper)
router.get("/", async (req, res) => {
  try {
    const posts = await (mongoose.model("Post")).find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;