// services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', {
      email: userData.email,
      password: userData.password,
      name: userData.name
    });
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password
    });
    return response.data;
  },

  devBypass: async () => {
    const response = await api.post('/auth/dev-bypass', {
      email: 'guest@rosephotobooth.dev',
      password: 'guestpass'
    });
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export const photoAPI = {
  uploadPhoto: async (photoData) => {
    const formData = new FormData();
    formData.append('photo', photoData.photo);
    formData.append('title', photoData.title || '');
    formData.append('description', photoData.description || '');
    formData.append('filterApplied', photoData.filterApplied || '');
    formData.append('isFlashUsed', photoData.isFlashUsed || false);
    formData.append('isFlashlightUsed', photoData.isFlashlightUsed || false);
    formData.append('sessionId', photoData.sessionId || '');
    formData.append('photoOrder', photoData.photoOrder || 0);
    if (photoData.stripTemplateId) {
      formData.append('stripTemplateId', photoData.stripTemplateId);
    }
    
    const response = await api.post('/photos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  getUserPhotos: async () => {
    const response = await api.get('/photos');
    return response.data;
  },
  
  getDownloadedPhotos: async () => {
    const response = await api.get('/photos/downloaded');
    return response.data;
  },
  
  markAsDownloaded: async (photoId) => {
    const response = await api.post(`/photos/${photoId}/download`);
    return response.data;
  },
  
  deletePhoto: async (photoId) => {
    const response = await api.delete(`/photos/${photoId}`);
    return response.data;
  },
  
  searchPhotos: async (query) => {
    const response = await api.get(`/photos/search?query=${encodeURIComponent(query)}`);
    return response.data;
  }
};

export const sessionAPI = {
  createSession: async (sessionName) => {
    const response = await api.post('/sessions', { sessionName });
    return response.data;
  },
  
  endSession: async (sessionId) => {
    const response = await api.put(`/sessions/${sessionId}/end`);
    return response.data;
  },
  
  getUserSessions: async () => {
    const response = await api.get('/sessions');
    return response.data;
  },

  claimSession: async (sessionId) => {
    const response = await api.post(`/sessions/${sessionId}/claim`);
    return response.data;
  }
};

export default api;