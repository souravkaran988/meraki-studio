const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const userRoute = require('./routes/users'); // New Route
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const TEST_URI = "mongodb+srv://admin:12345@cluster0.mtxul8p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(TEST_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.log('❌ DB Error:', err.message));

app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/users', userRoute); // Add this line

app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err.message);
  res.status(500).send("Server Error");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});