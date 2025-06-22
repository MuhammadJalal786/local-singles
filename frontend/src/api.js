// frontend/src/api.js
import axios from 'axios';

// Centralized API client with credentials
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '', 
  withCredentials: true,         // ← this makes the browser send your session cookie
});

export default api;
