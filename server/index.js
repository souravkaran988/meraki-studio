import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Import your Auth Route
import authRoute from "./routes/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- MIDDLEWARE ---
// FIX: Added specific origin to allow your Vercel Frontend to communicate with this Backend
app.use(cors({
  origin: ["https://meraki-studio-lac.vercel.app", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// --- CLOUDINARY CONFIGURATION ---
cloudinary.config({
  cloud_name: "dvvlo2wsr",
  api_key: "857828378427176",
  api_secret: "O9dA1_BLMm7UM79zXAq6Y_JOqyE",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "meraki_uploads",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});
const upload = multer({ storage });

// --- ROUTES ---
app.use("/api/auth", authRoute);

// --- DATABASE CONNECTION ---
const MONGO_URI = "mongodb+srv://sourav:souravkaran@cluster0.mtxul8p.mongodb.net/meraki?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ DB Connected & Meraki Server Running"))
  .catch((err) => console.log("❌ DB Connection Error:", err));

// --- SCHEMAS & MODELS ---
const postSchema = new mongoose.Schema({
  username: String,
  title: String,
  description: String,
  tags: [String],
  image: String,
  likes: { type: [String], default: [] },
  comments: [{ 
    username: String, 
    text: String, 
    createdAt: { type: Date, default: Date.now } 
  }]
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

const profileSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  bio: { type: String, default: "Digital Artist & Creator" },
  avatar: { type: String, default: "" },
  banner: { type: String, default: "" },
}, { timestamps: true });

const Profile = mongoose.model("Profile", profileSchema);

// --- POST ROUTES ---

app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/api/posts/user/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const posts = await Post.find({ 
      username: { $regex: new RegExp("^" + username + "$", "i") } 
    }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post("/api/posts", upload.single("imageFile"), async (req, res) => {
  try {
    const { username, title, description, imageUrl, tags } = req.body;
    let finalImage = req.file ? req.file.path : imageUrl;
    
    const newPost = new Post({ 
      username, 
      title, 
      description, 
      tags: tags ? tags.split(",").map(tag => tag.trim()) : [], 
      image: finalImage 
    });
    
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.put("/api/posts/:id", upload.single("imageFile"), async (req, res) => {
  try {
    const { title, description, tags, imageUrl } = req.body;
    let updateData = { 
      title, 
      description, 
      tags: tags ? tags.split(",").map(tag => tag.trim()) : [] 
    };

    if (req.file) {
      updateData.image = req.file.path; 
    } else if (imageUrl) {
      updateData.image = imageUrl;
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.delete("/api/posts/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json("Deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

app.put("/api/posts/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const { username } = req.body;
    
    if (!post.likes.includes(username)) {
      await post.updateOne({ $push: { likes: username } });
      res.status(200).json("Liked");
    } else {
      await post.updateOne({ $pull: { likes: username } });
      res.status(200).json("Unliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post("/api/posts/:id/comment", async (req, res) => {
  try {
    const { username, text } = req.body;
    const comment = { username, text };
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: comment } },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.delete("/api/posts/:postId/comment/:commentId", async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// --- PROFILE ROUTES ---

app.get("/api/profile/:username", async (req, res) => {
  try {
    let profile = await Profile.findOne({ username: req.params.username });
    if (!profile) {
      profile = new Profile({ username: req.params.username });
      await profile.save();
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.put("/api/profile/:username", upload.fields([
  { name: 'avatarFile', maxCount: 1 },
  { name: 'bannerFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const { bio } = req.body;
    let updateData = {};
    if (bio !== undefined) updateData.bio = bio;

    if (req.files) {
      if (req.files['avatarFile']) {
        updateData.avatar = req.files['avatarFile'][0].path; 
      }
      if (req.files['bannerFile']) {
        updateData.banner = req.files['bannerFile'][0].path; 
      }
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { username: req.params.username },
      { $set: updateData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(200).json(updatedProfile);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});