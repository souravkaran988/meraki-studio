# 🎨 Meraki Art – Full-Stack Creative Portfolio API

![Status](https://img.shields.io/badge/Status-Live-green)
![Tech](https://img.shields.io/badge/Stack-MERN-blue)

### 📌 Project Overview
This project implements a **robust RESTful Backend System** for a digital art gallery. It allows artists to securely manage their portfolios, upload creative works, and maintain a professional profile, all backed by a cloud database. 

The system features a complete **Authentication and Authorization** flow, ensuring that artist data is protected and artwork is managed only by the rightful owner.

---

### 🎯 Problem Statement
* **Input:** User credentials for authentication; Artwork details (title, description, tags, image files).
* **Output:** Secure JWT access tokens; Persistent art data stored in a NoSQL database; Direct image serving via static paths.
* **Goal:** To build a secure, community-driven platform that demonstrates proficiency in MERN stack development, cloud database integration, and security protocols.

---

### 🛠️ Technologies Used
* **Node.js & Express** (Web Framework)
* **MongoDB Atlas** (NoSQL Database)
* **Mongoose** (ODM for MongoDB)
* **Bcryptjs** (Secure Password Hashing)
* **Multer** (Middleware for File Uploads)
* **Vercel & Render** (Cloud Deployment & Hosting)

---

### 📂 Project Structure

meraki-art/
├── client/ (Frontend - React/Vercel)
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable UI parts (Navbar, Card, etc.)
│   │   ├── pages/            # Main views (Home, Login, Register, Profile)
│   │   ├── App.js            # Main React component
│   │   ├── index.js          # React entry point
│   │   └── api/              # Axios configuration & API calls
│   ├── package.json
│   └── tailwind.config.js
│
├── server/ (Backend - Node/Render)
│   ├── models/               # Mongoose Schemas (User.js, Post.js)
│   ├── routes/               # API Endpoints (auth.js, posts.js)
│   ├── uploads/              # Local folder for stored images
│   ├── .env                  # Environment variables (DB URI, PORT)
│   ├── .gitignore            # Files to ignore (node_modules, .env)
│   ├── index.js              # Server entry point & Middleware
│   └── package.json
│
├── .gitignore                # Root ignore file
└── README.md                 # Project documentation

---

### ⚙️ Installation & Execution

Follow these steps to run the project locally:

**1️⃣ Clone the Repository**
```bash
git clone [https://github.com/souravkaran988/meraki-art.git](https://github.com/souravkaran988/meraki-art.git)
cd meraki-art

2️⃣ Install Backend Dependencies

Bash

cd server
npm install
3️⃣ Set Up Environment Variables Create a .env file in the server folder:

Code snippet

PORT=5000
TEST_URI=your_mongodb_atlas_connection_string
4️⃣ Run the Application

Bash

npm start
The server will start at: http://localhost:5000

🧠 Model & Logic Explanation

Shutterstock
1️⃣ Security & Image Persistence

Password Hashing: Passwords are encrypted using Bcryptjs before database insertion to ensure user privacy.

Full URL Mapping: The backend maps the Full URL (e.g., https://meraki-art.onrender.com/uploads/...) to the database. This ensures images load correctly across all frontend refreshes without broken links.

2️⃣ Database Logic

Asynchronous Operations: Uses async/await for non-blocking communication with MongoDB Atlas.

Static Serving: Implements express.static to serve uploaded artwork directly, allowing the React frontend to fetch images via standard HTTP.

📊 Project Requirements Fulfilled
✅ User Authentication: Implemented via Login/Register routes.

✅ Database Integration: Fully connected to MongoDB Atlas.

✅ CRUD Endpoints: Full Create, Read, and Delete capabilities for art posts.

✅ Deployment: Live production environments on Vercel (Frontend) and Render (Backend).

👨‍💻 Author
Sourav Karan 🔗 GitHub: https://github.com/souravkaran988 🔗 Live App: https://meraki-art.vercel.app