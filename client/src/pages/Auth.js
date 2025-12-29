import React, { useState } from "react";
import API from "../api.js"
import { useNavigate } from "react-router-dom";
import { Sparkles, Mail, Lock, User, ArrowRight } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // FIX: We use /auth/login because the "api" part is already in our baseURL in api.js
    const endpoint = isLogin ? "/auth/login" : "/auth/register";
    try {
      // FIX: Removed "http://localhost:5000/api" - API.js handles the URL now
      const res = await API.post(endpoint, formData);
      
      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("user", JSON.stringify(res.data)); // Store full user object
        navigate("/");
        window.location.reload();
      } else {
        alert("Registration successful! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Error: Check your credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] text-white">
      <div className="w-full max-w-md bg-[#161b22] p-10 rounded-[3rem] border border-white/10 shadow-2xl">
        <h1 className="text-3xl font-black mb-8 italic text-center">
          {isLogin ? "Login to Meraki" : "Join the Studio"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <input 
              type="text" placeholder="Username" 
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          )}
          <input 
            type="email" placeholder="Email" 
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" placeholder="Password" 
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <button type="submit" className="w-full bg-blue-600 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-blue-500 transition-all">
            {isLogin ? "Sign In" : "Register"}
          </button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-6 text-gray-500 text-sm hover:text-white">
          {isLogin ? "Need an account? Sign Up" : "Have an account? Login"}
        </button>
      </div>
    </div>
  );
};

export default Auth;