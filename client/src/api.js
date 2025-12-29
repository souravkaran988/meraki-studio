import axios from "axios";

// FIX: Hardcode your Render URL here so the frontend can find the backend
const API_URL = "https://meraki-studio.onrender.com/api"; 

const API = axios.create({
  baseURL: API_URL,
});

// Auto-attach token if it exists in local storage
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user")); // Check if your app stores 'user' or 'token'
  const token = user?.token || localStorage.getItem("token");
  
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;