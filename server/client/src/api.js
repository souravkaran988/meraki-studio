import axios from "axios";

// This dynamic URL handles both Local Development and Production
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: API_URL,
});

// Auto-attach token if it exists in local storage
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;