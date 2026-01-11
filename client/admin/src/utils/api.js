import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://settibalijaactionforce.com';
const API_PREFIX = import.meta.env.VITE_API_PREFIX || '/apiv1/auth2/admin';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('saf_admin_token');
    if (token) {
      config.headers['x-access-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      if (error.response.status === 401) {
        // Unauthorized - clear storage and redirect to login
        localStorage.removeItem('saf_admin_user');
        localStorage.removeItem('saf_admin_token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // Request made but no response
      console.error('No response from server:', error.request);
    } else {
      // Error in request setup
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL, API_PREFIX };

