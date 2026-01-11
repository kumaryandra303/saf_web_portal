import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4901';
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
    console.error('API Error:', error.response?.data || error.message);
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

