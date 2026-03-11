import axios from 'axios';

// Use exactly the same hostname/port when deployed to Render, but fallback to 5000 in dev
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://localhost:5000/api' 
  : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const leadService = {
  getLeads: () => api.get('/leads'),
  addLead: (lead) => api.post('/leads', lead),
  updateStatus: (id, status) => api.patch(`/leads/${id}/status`, { status }),
  addNote: (id, text) => api.post(`/leads/${id}/notes`, { text }),
  deleteLead: (id) => api.delete(`/leads/${id}`),
};

export const authService = {
  login: (username, password) => api.post('/auth/login', { username, password }),
};
