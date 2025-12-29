import axios from "axios";

// We are hardcoding the Render URL to stop it from looking at localhost
const API_URL = "https://meraki-studio.onrender.com/api"; 

const API = axios.create({
  baseURL: API_URL,
});

// Auto-attach token if it exists in local storage
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token || localStorage.getItem("token");
  
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;