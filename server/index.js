const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();

// Create uploads folder if it doesn't exist
const dir = './uploads';
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

app.use(cors());
app.use(express.json());

// Serve the uploads folder so images are viewable
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.get('/', (req, res) => res.send('API is Online'));

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.TEST_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));