import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.js";
import Dashboard from "./pages/Dashboard.js";
import Profile from "./pages/Profile.js";
import Auth from "./pages/Auth.js";
import Navbar from "./components/Navbar.js"; // Ensure you have a Navbar component

function App() {
  // Check if user is logged in
  const user = localStorage.getItem("username");

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Only let logged-in users see the Dashboard */}
        <Route 
          path="/dashboard/:username" 
          element={user ? <Dashboard /> : <Navigate to="/auth" />} 
        />
        
        <Route path="/profile/:username" element={<Profile />} />
        
        {/* If already logged in, redirect home from the Auth page */}
        <Route 
          path="/auth" 
          element={!user ? <Auth /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;