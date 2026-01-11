import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://settibalijaactionforce.com';
const API_PREFIX = '/apiv1';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('saf_admin_token');
    if (token) {
      config.headers['x-access-token'] = token;
    }
    
    // If data is FormData, let browser set Content-Type (multipart/form-data)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    console.log('API Request:', config.url, config.data);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
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
      console.error('API Error:', error.response?.data || error.message);
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

const post = (route, data) => new Promise((resolve, reject) => {
  axiosInstance
    .post(route, data)
    .then((response) => {
      resolve(response.data);
    })
    .catch((error) => {
      reject(error.response?.data || error);
    });
});

const get = (route) => new Promise((resolve, reject) => {
  axiosInstance
    .get(route)
    .then((response) => {
      resolve(response.data);
    })
    .catch((error) => {
      reject(error.response?.data || error);
    });
});

const put = (route, data) => new Promise((resolve, reject) => {
  axiosInstance
    .put(route, data)
    .then((response) => {
      resolve(response.data);
    })
    .catch((error) => {
      reject(error.response?.data || error);
    });
});

const deleteMethod = (route) => new Promise((resolve, reject) => {
  axiosInstance
    .delete(route)
    .then((response) => {
      resolve(response.data);
    })
    .catch((error) => {
      reject(error.response?.data || error);
    });
});

export default {
  post,
  get,
  put,
  delete: deleteMethod,
  apiUrl: API_BASE_URL
};

