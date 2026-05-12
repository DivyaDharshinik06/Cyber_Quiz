// services/api.js - All API calls to the backend
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({ baseURL: BASE_URL });

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth API ──────────────────────────────────────────────────────────────
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);

// ─── Quiz API ──────────────────────────────────────────────────────────────
export const getQuestions = (level) => api.get(`/quiz/questions/${level}`);
export const submitQuiz = (data) => api.post('/quiz/submit', data);

// ─── User API ──────────────────────────────────────────────────────────────
export const getProfile = () => api.get('/user/profile');
export const getLeaderboard = () => api.get('/user/leaderboard');

// ─── Admin API ─────────────────────────────────────────────────────────────
export const adminGetUsers = () => api.get('/admin/users');
export const adminGetUser = (id) => api.get(`/admin/users/${id}`);
export const adminDeleteUser = (id) => api.delete(`/admin/users/${id}`);
export const adminGiveAward = (id, data) => api.patch(`/admin/users/${id}/award`, data);
export const adminAdjustCredits = (id, data) => api.patch(`/admin/users/${id}/credits`, data);

export default api;
