import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  username: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String], default: [] }, // Array of strings for tags
  image: { type: String, required: true },
  likes: { type: [String], default: [] },
  comments: [{
    username: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model("Post", postSchema);