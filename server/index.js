const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();

// --- UPDATED CORS CONFIGURATION ---
app.use(cors({
  origin: ["https://meraki-art.vercel.app", "http://localhost:5173"],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Health Check for Render
app.get('/', (req, res) => {
  res.send('Meraki API is running...');
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.TEST_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));