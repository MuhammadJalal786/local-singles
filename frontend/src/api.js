import axios from 'axios';

// In dev, use your local backend. In prod builds, calls go to same origin.
const api = axios.create({
  baseURL: import.meta.env.DEV
    ? (import.meta.env.VITE_API_URL || 'http://localhost:5000')
    : '',
  withCredentials: true,
});

export default api;