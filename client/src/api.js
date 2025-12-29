import API from "../api.js"

// This checks if we are on the web or on our computer
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: API_URL,
});

export default API;