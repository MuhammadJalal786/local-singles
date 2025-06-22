// frontend/src/api.js
import axios from 'axios';

// VITE_API_URL comes from .env.development or .env.production
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || ''
});

export default api;
