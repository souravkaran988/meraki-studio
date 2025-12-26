const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();

// --- THE FINAL CORS FIX ---
// This configuration allows your Vercel site to access the API 
// and handles the "Preflight" requests that were causing the red errors.
app.use(cors({
  origin: true, // This automatically allows the origin making the request
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Root Health Check (To verify the server is awake)
app.get('/', (req, res) => {
  res.send('Meraki Art API is Live and Running!');
});

const PORT = process.env.PORT || 5000;

// Database Connection
mongoose.connect(process.env.TEST_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });