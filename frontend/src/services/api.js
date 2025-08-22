import axios from 'axios';
import { auth } from '../config/firebase';

const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      auth.signOut();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const taskAPI = {
  getTasks: (params) => api.get('/tasks', { params }),
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  toggleTask: (id) => api.patch(`/tasks/${id}/toggle`)
};

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  getProfile: (uid) => api.get(`/auth/profile/${uid}`)
};

export const paymentAPI = {
  processPayment: (data) => api.post('/payment/process', data),
  getKey: () => api.get('/payment/getKey'),
  verification: (data) => api.post('/payment/verification', data),
};
export default api;